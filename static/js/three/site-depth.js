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

    const frameGroup = new THREE.Group();
    root.add(frameGroup);

    const frameCount = isSmallScreen ? 3 : 5;
    for (let i = 0; i < frameCount; i++) {
        const size = 1.25 + i * 0.34;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const edges = new THREE.EdgesGeometry(geometry);
        const frame = new THREE.LineSegments(edges, i % 2 ? accentMaterial : lineMaterial);
        frame.position.set(
            (i - frameCount / 2) * 4.2,
            1.4 + (i % 2) * 0.8,
            -8 - i * 2.2
        );
        frame.rotation.set(i * 0.35, i * 0.22, i * 0.16);
        frameGroup.add(frame);
    }

    const nodeCount = isSmallScreen ? 26 : 54;
    const positions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * span * 1.6;
        positions[i3 + 1] = Math.random() * 7 - 1.4;
        positions[i3 + 2] = -Math.random() * 38;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const nodeMaterial = new THREE.PointsMaterial({
        color: 0x5eead4,
        size: isSmallScreen ? 0.045 : 0.06, // Slightly larger particles
        transparent: true,
        opacity: isSmallScreen ? 0.4 : 0.6, // Increased opacity
        blending: THREE.AdditiveBlending,
    });
    root.add(new THREE.Points(nodeGeometry, nodeMaterial));

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
        frameGroup.children.forEach((frame, index) => {
            frame.rotation.x += 0.0016 + index * 0.0002;
            frame.rotation.y += 0.0011 + index * 0.00015;
        });

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
    }, { once: true });
})();
