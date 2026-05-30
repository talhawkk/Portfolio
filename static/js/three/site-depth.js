/**
 * Site-wide depth layer.
 * A restrained WebGL structure that adds spatial quality without stealing focus.
 */
(function() {
    const canvas = document.getElementById('site-depth-canvas');
    if (!canvas || !window.THREE) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.innerWidth < 768;
    if (prefersReducedMotion) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 3.2, 15);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isSmallScreen,
        powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.2 : 1.7));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const root = new THREE.Group();
    scene.add(root);

    const grid = new THREE.Group();
    root.add(grid);

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x2dd4bf,
        transparent: true,
        opacity: isSmallScreen ? 0.08 : 0.15, // Increased opacity
    });
    const accentMaterial = new THREE.LineBasicMaterial({
        color: 0xfacc15,
        transparent: true,
        opacity: isSmallScreen ? 0.1 : 0.18, // Increased opacity
    });

    const span = isSmallScreen ? 28 : 40;
    const step = 4;
    for (let i = -span; i <= span; i += step) {
        const horizontal = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-span, 0, i),
            new THREE.Vector3(span, 0, i),
        ]);
        const vertical = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(i, 0, -span),
            new THREE.Vector3(i, 0, span),
        ]);
        grid.add(new THREE.Line(horizontal, lineMaterial));
        grid.add(new THREE.Line(vertical, lineMaterial));
    }

    // --- Neural Network / Plexus Effect (Subtle & Refined) ---
    const nodeCount = isSmallScreen ? 30 : 65; // Drastically reduced for cleaner look
    const maxDistance = isSmallScreen ? 6.0 : 8.0;
    
    const positions = new Float32Array(nodeCount * 3);
    const velocities = new Float32Array(nodeCount * 3);
    
    for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * span * 1.8;
        positions[i3 + 1] = Math.random() * 14 - 3.0;
        // Pushed far back to act strictly as a backdrop, not overlapping hero elements
        positions[i3 + 2] = -12 - Math.random() * 40;
        
        velocities[i3] = (Math.random() - 0.5) * 0.008;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.008;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const nodeMaterial = new THREE.PointsMaterial({
        color: 0x2dd4bf,
        size: isSmallScreen ? 0.03 : 0.045, // Smaller nodes
        transparent: true,
        opacity: 0.3, // Much fainter
        blending: THREE.AdditiveBlending,
    });
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    root.add(nodes);

    // Connections
    const maxConnections = nodeCount * nodeCount;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    
    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMat);
    root.add(lines);

    const colorBase = new THREE.Color(0x2dd4bf);

    let targetX = 0;
    let targetY = 0;
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let frameId = null;

    function onPointerMove(event) {
        targetX = (event.clientX / window.innerWidth - 0.5) * 0.42;
        targetY = (event.clientY / window.innerHeight - 0.5) * -0.28;
    }

    function onScroll() {
        scrollTarget = window.scrollY || document.documentElement.scrollTop || 0;
    }

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
    }

    function animate(time) {
        frameId = requestAnimationFrame(animate);
        const t = time * 0.001;
        scrollCurrent += (scrollTarget - scrollCurrent) * 0.06;

        root.rotation.y += (targetX - root.rotation.y) * 0.035;
        root.rotation.x += (targetY - root.rotation.x) * 0.035;
        
        // Fly through space effect
        root.position.z = scrollCurrent * 0.012;
        root.position.y = -1.8 + Math.sin(t * 0.45) * 0.12 + scrollCurrent * 0.0015;

        grid.rotation.y = Math.sin(t * 0.18) * 0.03;
        
        // Animate Plexus Network
        const pos = nodeGeometry.attributes.position.array;
        for(let i=0; i<nodeCount; i++) {
            pos[i*3] += velocities[i*3];
            pos[i*3+1] += velocities[i*3+1];
            pos[i*3+2] += velocities[i*3+2];
            
            // Gentle bounds bouncing
            if(pos[i*3] > span*0.75 || pos[i*3] < -span*0.75) velocities[i*3] *= -1;
            if(pos[i*3+1] > 10 || pos[i*3+1] < -3) velocities[i*3+1] *= -1;
            if(pos[i*3+2] > 2 || pos[i*3+2] < -40) velocities[i*3+2] *= -1;
        }
        nodeGeometry.attributes.position.needsUpdate = true;

        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for ( let i = 0; i < nodeCount; i++ ) {
            for ( let j = i + 1; j < nodeCount; j++ ) {
                const dx = pos[i*3] - pos[j*3];
                const dy = pos[i*3+1] - pos[j*3+1];
                const dz = pos[i*3+2] - pos[j*3+2];
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                if ( dist < maxDistance ) {
                    // Exponential falloff for softer blending
                    const alpha = Math.pow(1.0 - ( dist / maxDistance ), 2.0);
                    const intensity = alpha * 0.08; // Extremely subtle line opacity
                    
                    linePositions[ vertexpos++ ] = pos[i*3];
                    linePositions[ vertexpos++ ] = pos[i*3+1];
                    linePositions[ vertexpos++ ] = pos[i*3+2];
                    
                    linePositions[ vertexpos++ ] = pos[j*3];
                    linePositions[ vertexpos++ ] = pos[j*3+1];
                    linePositions[ vertexpos++ ] = pos[j*3+2];
                    
                    lineColors[ colorpos++ ] = colorBase.r * intensity;
                    lineColors[ colorpos++ ] = colorBase.g * intensity;
                    lineColors[ colorpos++ ] = colorBase.b * intensity;
                    
                    lineColors[ colorpos++ ] = colorBase.r * intensity;
                    lineColors[ colorpos++ ] = colorBase.g * intensity;
                    lineColors[ colorpos++ ] = colorBase.b * intensity;
                    
                    numConnected++;
                }
            }
        }
        
        lineGeometry.setDrawRange( 0, numConnected * 2 );
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;

        renderer.render(scene, camera);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    onScroll();
    animate(0);

    window.addEventListener('pagehide', () => {
        if (frameId) cancelAnimationFrame(frameId);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', resize);
        renderer.dispose();
        lineMaterial.dispose();
        accentMaterial.dispose();
        nodeGeometry.dispose();
        nodeMaterial.dispose();
        lineGeometry.dispose();
        lineMat.dispose();
    }, { once: true });
})();
