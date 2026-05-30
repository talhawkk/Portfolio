/**
 * About page interactions.
 */
(function() {
    const section = document.querySelector('.skills-lab');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function initSkillConstellation() {
        const canvas = document.getElementById('skills-lab-canvas');
        if (!canvas || !window.THREE || prefersReducedMotion) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 0.2, 6.4);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

        const group = new THREE.Group();
        scene.add(group);

        const knotGeometry = new THREE.TorusKnotGeometry(1.6, 0.34, 180, 18);
        const knotMaterial = new THREE.MeshBasicMaterial({
            color: 0x2dd4bf,
            wireframe: true,
            transparent: true,
            opacity: 0.18,
        });
        const knot = new THREE.Mesh(knotGeometry, knotMaterial);
        knot.position.x = 2.1;
        group.add(knot);

        const nodeCount = 90;
        const positions = new Float32Array(nodeCount * 3);
        for (let i = 0; i < nodeCount; i++) {
            const i3 = i * 3;
            const radius = 1.4 + Math.random() * 2.9;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i3] = 1.7 + radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.9;
            positions[i3 + 2] = radius * Math.cos(phi);
        }

        const nodesGeometry = new THREE.BufferGeometry();
        nodesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const nodesMaterial = new THREE.PointsMaterial({
            color: 0xfacc15,
            size: 0.045,
            transparent: true,
            opacity: 0.72,
            blending: THREE.AdditiveBlending,
        });
        group.add(new THREE.Points(nodesGeometry, nodesMaterial));

        const linePairs = 90;
        const linePositions = new Float32Array(linePairs * 6);
        for (let i = 0; i < linePairs; i++) {
            const a = Math.floor(Math.random() * nodeCount) * 3;
            const b = Math.floor(Math.random() * nodeCount) * 3;
            linePositions.set(positions.slice(a, a + 3), i * 6);
            linePositions.set(positions.slice(b, b + 3), i * 6 + 3);
        }

        const linesGeometry = new THREE.BufferGeometry();
        linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0x5eead4,
            transparent: true,
            opacity: 0.08,
        });
        group.add(new THREE.LineSegments(linesGeometry, linesMaterial));

        let targetX = 0;
        let targetY = 0;
        let frameId = null;

        function resize() {
            const rect = section.getBoundingClientRect();
            renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1), false);
            camera.aspect = Math.max(rect.width, 1) / Math.max(rect.height, 1);
            camera.updateProjectionMatrix();
        }

        function animate(time) {
            frameId = requestAnimationFrame(animate);
            const t = time * 0.001;

            group.rotation.y += (targetY - group.rotation.y) * 0.035;
            group.rotation.x += (targetX - group.rotation.x) * 0.035;
            knot.rotation.x = t * 0.16;
            knot.rotation.y = t * 0.22;
            group.position.y = Math.sin(t * 0.8) * 0.08;

            renderer.render(scene, camera);
        }

        section.addEventListener('pointermove', (event) => {
            const rect = section.getBoundingClientRect();
            targetY = ((event.clientX - rect.left) / rect.width - 0.5) * 0.55;
            targetX = ((event.clientY - rect.top) / rect.height - 0.5) * -0.35;
        });

        const observer = new ResizeObserver(resize);
        observer.observe(section);
        resize();
        animate(0);

        window.addEventListener('pagehide', () => {
            if (frameId) cancelAnimationFrame(frameId);
            observer.disconnect();
            renderer.dispose();
            knotGeometry.dispose();
            nodesGeometry.dispose();
            linesGeometry.dispose();
            knotMaterial.dispose();
            nodesMaterial.dispose();
            linesMaterial.dispose();
        }, { once: true });
    }

    function initSkillTilt() {
        if (!supportsFinePointer || prefersReducedMotion) return;

        section.querySelectorAll('.skill-chip').forEach((card) => {
            card.addEventListener('pointermove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotateX = (0.5 - y) * 8;
                const rotateY = (x - 0.5) * 8;
                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            });

            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });
        });
    }

    initSkillConstellation();
    initSkillTilt();
})();
