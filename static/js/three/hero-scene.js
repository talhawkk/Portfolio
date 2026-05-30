/**
 * Premium Three.js hero scene.
 * Restrained studio-style 3D: faceted glass core, thin orbital lines, and sparse depth particles.
 */
(function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !window.THREE) return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 0, 13);

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

    const heroGroup = new THREE.Group();
    const objectGroup = new THREE.Group();
    const fieldGroup = new THREE.Group();
    scene.add(fieldGroup, heroGroup);
    heroGroup.add(objectGroup);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(-4, 5, 8);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x2dd4bf, 2.8, 18);
    cyanLight.position.set(4, 1.6, 3.4);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x60a5fa, 1.8, 18);
    blueLight.position.set(7, -3, 2.5);
    scene.add(blueLight);

    scene.add(new THREE.AmbientLight(0x7dd3fc, 0.42));

    const coreGeometry = new THREE.IcosahedronGeometry(isMobile ? 0.95 : 1.55, 0);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x9fb7c7,
        roughness: 0.22,
        metalness: 0.24,
        transmission: 0.16,
        thickness: 0.9,
        transparent: true,
        opacity: 0.58,
        clearcoat: 0.85,
        clearcoatRoughness: 0.16,
        iridescence: 0.18,
        iridescenceIOR: 1.45,
        flatShading: true,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    objectGroup.add(core);

    const edgeGeometry = new THREE.EdgesGeometry(coreGeometry, 18);
    const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xe2e8f0,
        transparent: true,
        opacity: 0.34,
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    objectGroup.add(edges);

    const innerGeometry = new THREE.OctahedronGeometry(isMobile ? 0.42 : 0.68, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x0f172a,
        transparent: true,
        opacity: 0.24,
        wireframe: true,
    });
    const inner = new THREE.Mesh(innerGeometry, innerMaterial);
    objectGroup.add(inner);

    const makeRing = (radius, tube, color, opacity, rotation) => {
        const geometry = new THREE.TorusGeometry(radius, tube, 8, 180);
        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            blending: THREE.AdditiveBlending,
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.set(rotation[0], rotation[1], rotation[2]);
        objectGroup.add(ring);
        return { geometry, material, ring };
    };

    const rings = [
        makeRing(isMobile ? 1.35 : 2.08, 0.005, 0x93c5fd, 0.18, [1.24, 0.18, -0.24]),
        makeRing(isMobile ? 1.55 : 2.42, 0.004, 0x5eead4, 0.13, [1.36, -0.08, 0.58]),
        makeRing(isMobile ? 1.12 : 1.82, 0.003, 0xf0f9ff, 0.09, [1.06, 0.52, 1.18]),
    ];

    const gridGeometry = new THREE.PlaneGeometry(isMobile ? 12 : 18, isMobile ? 7 : 10, isMobile ? 14 : 24, isMobile ? 8 : 14);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: isMobile ? 0.018 : 0.026,
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -1.18;
    grid.position.set(isMobile ? 1.4 : 4.4, -3.15, -8.5);
    fieldGroup.add(grid);

    const particleCount = isMobile ? 70 : 170;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 19;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 9;
        particlePositions[i3 + 2] = -2 - Math.random() * 18;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xcbd5e1,
        size: isMobile ? 0.018 : 0.024,
        transparent: true,
        opacity: isMobile ? 0.28 : 0.36,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    fieldGroup.add(particles);

    const beamGeometry = new THREE.BufferGeometry();
    const beamPositions = new Float32Array([
        -2.4, 1.2, 0.1, 2.7, -1.05, 0.1,
        -1.7, -1.8, 0.2, 2.2, 1.55, 0.2,
    ]);
    beamGeometry.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
    const beamMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.13,
        blending: THREE.AdditiveBlending,
    });
    const beams = new THREE.LineSegments(beamGeometry, beamMaterial);
    objectGroup.add(beams);

    const setScenePosition = () => {
        const width = window.innerWidth;
        const x = width < 900 ? 1.2 : width < 1280 ? 3.9 : 4.9;
        heroGroup.position.set(x, isMobile ? -0.1 : -0.05, -0.9);
        heroGroup.scale.setScalar(isMobile ? 0.72 : 0.92);
        heroGroup.visible = !isMobile;
    };
    setScenePosition();

    let targetX = 0;
    let targetY = 0;
    let frameId = null;

    document.addEventListener('mousemove', (event) => {
        targetX = (event.clientX / window.innerWidth - 0.5) * 2;
        targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function animate(time) {
        frameId = requestAnimationFrame(animate);
        const t = time * 0.001;

        heroGroup.rotation.y += (targetX * 0.1 - heroGroup.rotation.y) * 0.045;
        heroGroup.rotation.x += (-targetY * 0.055 - heroGroup.rotation.x) * 0.045;

        if (!prefersReducedMotion) {
            objectGroup.rotation.y = t * 0.17;
            objectGroup.rotation.x = Math.sin(t * 0.32) * 0.055;
            core.rotation.z = t * 0.09;
            edges.rotation.z = core.rotation.z;
            inner.rotation.y = -t * 0.22;
            rings.forEach((item, index) => {
                item.ring.rotation.z += 0.0016 + index * 0.0007;
            });
            particles.rotation.y = t * 0.018;
            grid.position.z = -8.5 + Math.sin(t * 0.36) * 0.16;
        }

        renderer.render(scene, camera);
    }

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        setScenePosition();
    }

    window.addEventListener('resize', resize);
    animate(0);

    window.addEventListener('pagehide', () => {
        if (frameId) cancelAnimationFrame(frameId);
        window.removeEventListener('resize', resize);
        renderer.dispose();
        coreGeometry.dispose();
        coreMaterial.dispose();
        edgeGeometry.dispose();
        edgeMaterial.dispose();
        innerGeometry.dispose();
        innerMaterial.dispose();
        rings.forEach(({ geometry, material }) => {
            geometry.dispose();
            material.dispose();
        });
        gridGeometry.dispose();
        gridMaterial.dispose();
        particleGeometry.dispose();
        particleMaterial.dispose();
        beamGeometry.dispose();
        beamMaterial.dispose();
    }, { once: true });
})();
