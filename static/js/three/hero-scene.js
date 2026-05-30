/**
 * Hero Scene — Premium organic morphing sphere
 * Custom GLSL shaders with multi-octave simplex noise displacement,
 * fresnel edge glow, orbital ring, ambient particles.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !window.THREE) return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Scene ─────────────────────────────────────────── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.2, 13);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.15 : 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const disposables = [];
    function track() { for (let i = 0; i < arguments.length; i++) disposables.push(arguments[i]); }

    /* ── Groups ────────────────────────────────────────── */
    const world = new THREE.Group();
    const blob  = new THREE.Group();
    const depth = new THREE.Group();
    scene.add(world);
    world.add(blob, depth);

    /* ── GLSL 3-D Simplex Noise (Ashima / S.Gustavson) ── */
    const noiseGLSL = [
        'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}',
        'vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}',
        'vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}',
        'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}',
        'float snoise(vec3 v){',
        '  const vec2 C=vec2(1.0/6.0,1.0/3.0);',
        '  const vec4 D=vec4(0.0,0.5,1.0,2.0);',
        '  vec3 i=floor(v+dot(v,C.yyy));',
        '  vec3 x0=v-i+dot(i,C.xxx);',
        '  vec3 g=step(x0.yzx,x0.xyz);',
        '  vec3 l=1.0-g;',
        '  vec3 i1=min(g.xyz,l.zxy);',
        '  vec3 i2=max(g.xyz,l.zxy);',
        '  vec3 x1=x0-i1+C.xxx;',
        '  vec3 x2=x0-i2+C.yyy;',
        '  vec3 x3=x0-D.yyy;',
        '  i=mod289(i);',
        '  vec4 p=permute(permute(permute(',
        '      i.z+vec4(0.0,i1.z,i2.z,1.0))',
        '    + i.y+vec4(0.0,i1.y,i2.y,1.0))',
        '    + i.x+vec4(0.0,i1.x,i2.x,1.0));',
        '  float n_=0.142857142857;',
        '  vec3 ns=n_*D.wyz-D.xzx;',
        '  vec4 j=p-49.0*floor(p*ns.z*ns.z);',
        '  vec4 x_=floor(j*ns.z);',
        '  vec4 y_=floor(j-7.0*x_);',
        '  vec4 x=x_*ns.x+ns.yyyy;',
        '  vec4 y=y_*ns.x+ns.yyyy;',
        '  vec4 h=1.0-abs(x)-abs(y);',
        '  vec4 b0=vec4(x.xy,y.xy);',
        '  vec4 b1=vec4(x.zw,y.zw);',
        '  vec4 s0=floor(b0)*2.0+1.0;',
        '  vec4 s1=floor(b1)*2.0+1.0;',
        '  vec4 sh=-step(h,vec4(0.0));',
        '  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;',
        '  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
        '  vec3 p0=vec3(a0.xy,h.x);',
        '  vec3 p1=vec3(a0.zw,h.y);',
        '  vec3 p2=vec3(a1.xy,h.z);',
        '  vec3 p3=vec3(a1.zw,h.w);',
        '  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));',
        '  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;',
        '  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);',
        '  m=m*m;',
        '  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));',
        '}',
    ].join('\n');

    /* ── Shared uniforms ──────────────────────────────── */
    const uniforms = {
        uTime:      { value: 0 },
        uFreq:      { value: isMobile ? 0.45 : 0.52 }, // Smoother noise
        uAmp:       { value: isMobile ? 0.22 : 0.28 }, // Less aggressive displacement
        uColor1:    { value: new THREE.Color(0x010d14) },
        uColor2:    { value: new THREE.Color(0x052230) }, // Darker, less saturated core
        uEdgeColor: { value: new THREE.Color(0x14b8a6) }, // Softer teal edge
        uWarmColor: { value: new THREE.Color(0xd97706) }, // Softer amber
    };

    /* ── Vertex shader (displacement) ─────────────────── */
    const vertexShader = [
        'uniform float uTime;',
        'uniform float uFreq;',
        'uniform float uAmp;',
        '',
        'varying vec3 vNormal;',
        'varying vec3 vWorldPos;',
        'varying vec3 vObjPos;',
        'varying float vDisplacement;',
        '',
        noiseGLSL,
        '',
        'void main(){',
        '  vec3 pos = position;',
        '',
        '  // Multi-octave noise — organic morphing',
        '  float n1 = snoise(pos * uFreq + uTime * 0.12);',
        '  float n2 = snoise(pos * uFreq * 2.1 + uTime * 0.07) * 0.3;',
        '  float n3 = snoise(pos * uFreq * 4.2 + uTime * 0.04) * 0.08;',
        '  float displacement = (n1 + n2 + n3) * uAmp;',
        '  pos += normal * displacement;',
        '',
        '  vNormal      = normalize(mat3(modelMatrix) * normal);',
        '  vWorldPos     = (modelMatrix * vec4(pos, 1.0)).xyz;',
        '  vObjPos       = position;',
        '  vDisplacement = displacement;',
        '',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',
        '}',
    ].join('\n');

    /* ── Fragment shader — solid surface ──────────────── */
    const solidFrag = [
        'uniform float uTime;',
        'uniform vec3 uColor1;',
        'uniform vec3 uColor2;',
        'uniform vec3 uEdgeColor;',
        'uniform vec3 uWarmColor;',
        '',
        'varying vec3 vNormal;',
        'varying vec3 vWorldPos;',
        'varying vec3 vObjPos;',
        'varying float vDisplacement;',
        '',
        'void main(){',
        '  vec3 V = normalize(cameraPosition - vWorldPos);',
        '  float fresnel = pow(1.0 - abs(dot(V, vNormal)), 2.8);',
        '',
        '  // Depth-coloring from displacement',
        '  vec3 base = mix(uColor1, uColor2, smoothstep(-0.3, 0.3, vDisplacement));',
        '  vec3 col  = mix(base, uEdgeColor, fresnel * 0.75);',
        '',
        '  // Warm amber accent on upper hemisphere',
        '  float warm = smoothstep(-0.1, 0.6, vObjPos.y / 2.8) * fresnel;',
        '  col = mix(col, uWarmColor, warm * 0.08);',
        '',
        '  // Subtle studio key-light',
        '  vec3 L = normalize(vec3(-3.0, 4.0, 5.0));',
        '  col += uEdgeColor * max(dot(vNormal, L), 0.0) * 0.03;',
        '',
        '  float alpha = 0.05 + fresnel * 0.45; // More transparent',
        '  gl_FragColor = vec4(col, alpha);',
        '}',
    ].join('\n');

    /* ── Fragment shader — wireframe overlay ──────────── */
    const wireFrag = [
        'uniform vec3 uEdgeColor;',
        '',
        'varying vec3 vNormal;',
        'varying vec3 vWorldPos;',
        'varying vec3 vObjPos;',
        'varying float vDisplacement;',
        '',
        'void main(){',
        '  vec3 V = normalize(cameraPosition - vWorldPos);',
        '  float f = pow(1.0 - abs(dot(V, vNormal)), 2.5);', // Sharper falloff
        '  gl_FragColor = vec4(uEdgeColor, 0.015 + f * 0.08); // Lower wire opacity',
        '}',
    ].join('\n');

    /* ── Sphere geometry ─────────────────────────────── */
    const sphereRadius = isMobile ? 2.2 : 2.8;
    const sphereDetail = isMobile ? 3 : 4;
    const geo = new THREE.IcosahedronGeometry(sphereRadius, sphereDetail);
    track(geo);

    // Solid mesh
    const solidMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: solidFrag,
        uniforms: uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
    });
    blob.add(new THREE.Mesh(geo, solidMat));
    track(solidMat);

    // Wireframe overlay
    const wireMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: wireFrag,
        uniforms: uniforms,
        transparent: true,
        wireframe: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    blob.add(new THREE.Mesh(geo, wireMat));
    track(wireMat);

    /* ── Outer glow halo ─────────────────────────────── */
    const glowGeo = new THREE.IcosahedronGeometry(sphereRadius * 1.35, isMobile ? 2 : 3);
    const glowMat = new THREE.ShaderMaterial({
        vertexShader: [
            'varying vec3 vN; varying vec3 vW;',
            'void main(){',
            '  vN = normalize(mat3(modelMatrix) * normal);',
            '  vW = (modelMatrix * vec4(position,1.0)).xyz;',
            '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);',
            '}',
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vN; varying vec3 vW;',
            'void main(){',
            '  vec3 V = normalize(cameraPosition - vW);',
            '  float f = pow(1.0 - abs(dot(V, vN)), 3.0);',
            '  gl_FragColor = vec4(vec3(0.18,0.83,0.75)*0.5, f*0.06); // Halved opacity',
            '}',
        ].join('\n'),
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
    });
    blob.add(new THREE.Mesh(glowGeo, glowMat));
    track(glowGeo, glowMat);

    /* ── Orbital ring ────────────────────────────────── */
    var ringGeo, ringMat, ring;
    if (!isMobile) {
        ringGeo = new THREE.TorusGeometry(sphereRadius * 1.4, 0.008, 8, 128);
        ringMat = new THREE.MeshBasicMaterial({
            color: 0x2dd4bf,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
        });
        ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI * 0.38;
        ring.rotation.z = 0.12;
        blob.add(ring);
        track(ringGeo, ringMat);
    }

    /* ── Background particles ────────────────────────── */
    var pCount = isMobile ? 45 : 115;
    var pGeo   = new THREE.BufferGeometry();
    var pArr   = new Float32Array(pCount * 3);
    for (var i = 0; i < pCount; i++) {
        pArr[i * 3]     = (Math.random() - 0.5) * 22;
        pArr[i * 3 + 1] = (Math.random() - 0.5) * 10;
        pArr[i * 3 + 2] = -2 - Math.random() * 18;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({
        color: 0xccfbf1,
        size: isMobile ? 0.012 : 0.018,
        transparent: true,
        opacity: isMobile ? 0.14 : 0.22,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });
    var particles = new THREE.Points(pGeo, pMat);
    depth.add(particles);
    track(pGeo, pMat);

    /* ── Depth floor grid ────────────────────────────── */
    var floorGeo = new THREE.PlaneGeometry(
        isMobile ? 12 : 22, isMobile ? 6 : 10,
        isMobile ? 10 : 26, isMobile ? 5 : 10
    );
    var floorMat = new THREE.MeshBasicMaterial({
        color: 0x2dd4bf,
        wireframe: true,
        transparent: true,
        opacity: isMobile ? 0.008 : 0.012,
    });
    var floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -1.2;
    floor.position.set(isMobile ? 1 : 4.5, -3.5, -9);
    depth.add(floor);
    track(floorGeo, floorMat);

    /* ── Lighting ────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xb6d7ff, 0.25));

    var keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(-4, 5, 8);
    scene.add(keyLight);

    var accentLight = new THREE.PointLight(0x2dd4bf, 2.8, 16);
    accentLight.position.set(4.5, 2.4, 3.5);
    scene.add(accentLight);

    var warmLight = new THREE.PointLight(0xfbbf24, 0.6, 14);
    warmLight.position.set(-3, -2.5, 2);
    scene.add(warmLight);

    /* ── Stage positioning ───────────────────────────── */
    function setStagePosition() {
        var w = window.innerWidth;
        blob.visible = true;
        // Perfectly centered for immersive layout
        blob.position.set(0, 0, -1);
        // Slightly larger to serve as a backdrop (restored original grand size)
        blob.scale.setScalar(w < 768 ? 0.9 : w < 1280 ? 1.05 : 1.25);
    }
    setStagePosition();

    /* ── Mouse parallax ──────────────────────────────── */
    var pointerX = 0, pointerY = 0;
    var frameId  = null;

    document.addEventListener('mousemove', function (e) {
        pointerX = (e.clientX / window.innerWidth  - 0.5) * 2;
        pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    /* ── Render loop ─────────────────────────────────── */
    function animate(time) {
        frameId = requestAnimationFrame(animate);
        var t = time * 0.001;

        uniforms.uTime.value = t;

        // Smooth mouse-follow rotation
        blob.rotation.y += (-0.15 + pointerX * 0.06 - blob.rotation.y) * 0.035;
        blob.rotation.x += ( 0.05 - pointerY * 0.04 - blob.rotation.x) * 0.035;

        if (!prefersReducedMotion) {
            // Gentle floating (pushed further down to accommodate the large scale and clear the navbar)
            blob.position.y = -0.85 + Math.sin(t * 0.4) * 0.08;

            // Ring orbit
            if (ring) ring.rotation.z = 0.12 + t * 0.05;

            // Particle drift
            particles.rotation.y = t * 0.008;
            particles.rotation.x = Math.sin(t * 0.15) * 0.02;

            // Floor sway
            floor.position.z = -9 + Math.sin(t * 0.3) * 0.12;
        }

        renderer.render(scene, camera);
    }

    /* ── Resize ──────────────────────────────────────── */
    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        setStagePosition();
    }
    window.addEventListener('resize', resize);

    animate(0);

    /* ── Cleanup ─────────────────────────────────────── */
    window.addEventListener('pagehide', function () {
        if (frameId) cancelAnimationFrame(frameId);
        window.removeEventListener('resize', resize);
        renderer.dispose();
        for (var i = 0; i < disposables.length; i++) disposables[i].dispose();
    }, { once: true });
})();
