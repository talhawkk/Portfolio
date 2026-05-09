/**
 * Three.js Hero Scene — Interactive particle field
 * Creates an immersive, mouse-reactive particle system
 */
(function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Check for mobile — use simpler version
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 800 : 2500;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
        new THREE.Color(0x00d4ff), // cyan
        new THREE.Color(0x7b61ff), // purple
        new THREE.Color(0xff6b9d), // pink
        new THREE.Color(0x00e68a), // green
    ];

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Spread particles in a sphere
        const radius = 5 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Random color from palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        sizes[i] = Math.random() * 3 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle material
    const material = new THREE.PointsMaterial({
        size: isMobile ? 0.04 : 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Optional: add subtle connecting lines (desktop only)
    if (!isMobile) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(200 * 6); // 200 lines
        for (let i = 0; i < 200; i++) {
            const idx1 = Math.floor(Math.random() * particleCount) * 3;
            const idx2 = Math.floor(Math.random() * particleCount) * 3;
            linePositions[i * 6] = positions[idx1];
            linePositions[i * 6 + 1] = positions[idx1 + 1];
            linePositions[i * 6 + 2] = positions[idx1 + 2];
            linePositions[i * 6 + 3] = positions[idx2];
            linePositions[i * 6 + 4] = positions[idx2 + 1];
            linePositions[i * 6 + 5] = positions[idx2 + 2];
        }
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.04,
        });
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);
    }

    camera.position.z = 12;

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth rotation follow mouse
        targetRotY = mouseX * 0.3;
        targetRotX = mouseY * 0.3;
        particles.rotation.y += (targetRotY - particles.rotation.y) * 0.05;
        particles.rotation.x += (targetRotX - particles.rotation.x) * 0.05;

        // Constant slow rotation
        particles.rotation.z += 0.0005;

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
