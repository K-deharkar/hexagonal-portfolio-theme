document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded');
        return;
    }
    
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Camera Setup (Orthographic matching pixel coordinates)
    const camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, 0.1, 100);
    camera.position.z = 10;

    // Scenes
    const bgScene = new THREE.Scene();
    const glassScene = new THREE.Scene();

    // Render Target for Refraction
    let bgRenderTarget = new THREE.WebGLRenderTarget(
        window.innerWidth * pixelRatio, 
        window.innerHeight * pixelRatio
    );

    // Mouse Tracking
    const mouse = new THREE.Vector2(0.5, 0.5);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX / window.innerWidth;
        mouse.y = 1.0 - (e.clientY / window.innerHeight);
    });

    // Global Uniforms
    const globalUniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio) },
        uMouse: { value: mouse }
    };

    // --- Background Shader (Liquid Blobs) ---
    const bgMaterial = new THREE.ShaderMaterial({
        uniforms: globalUniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            uniform vec2 uResolution;

            vec3 cyan = vec3(0.22, 0.74, 0.97); 
            vec3 purple = vec3(0.75, 0.52, 0.99); 
            vec3 peach = vec3(0.98, 0.57, 0.24); 
            vec3 rose = vec3(0.96, 0.25, 0.37); 
            vec3 bg = vec3(0.03, 0.03, 0.05); 

            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                vec2 p = uv * 2.0 - 1.0;
                p.x *= uResolution.x / uResolution.y;

                vec2 pos1 = vec2(sin(uTime * 0.3) * 0.5 - 0.2, cos(uTime * 0.4) * 0.5 + 0.3);
                vec2 pos2 = vec2(cos(uTime * 0.2) * 0.6 + 0.2, sin(uTime * 0.5) * 0.4 - 0.2);
                vec2 pos3 = vec2(sin(uTime * 0.5) * 0.3, cos(uTime * 0.3) * 0.3);

                float d1 = length(p - pos1);
                float d2 = length(p - pos2);
                float d3 = length(p - pos3);

                float w1 = smoothstep(1.5, 0.0, d1);
                float w2 = smoothstep(1.5, 0.0, d2);
                float w3 = smoothstep(1.2, 0.0, d3);

                vec3 color = bg;
                color = mix(color, cyan * 0.8 + purple * 0.2, w1);
                color = mix(color, purple * 0.6 + peach * 0.6, w2);
                color = mix(color, rose * 0.6 + purple * 0.6, w3);

                gl_FragColor = vec4(color, 1.0);
            }
        `,
        depthWrite: false,
        depthTest: false
    });
    
    const bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial);
    bgScene.add(bgPlane);

    // --- Glass Shader Base ---
    const glassVertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const glassFragmentShader = `
        uniform sampler2D uBackgroundMap;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform float uTime;
        uniform vec2 uPlaneSize;
        uniform float uBorderRadius;
        
        varying vec2 vUv;

        // Hash and noise for surface imperfections
        float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
        float noise(vec2 x) {
            vec2 i = floor(x);
            vec2 f = fract(x);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        // Rounded Box SDF to match DOM border-radius
        float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
            Radius = min(Radius, min(Size.x, Size.y));
            return length(max(abs(CenterPosition) - Size + Radius, 0.0)) - Radius;
        }

        void main() {
            // Clip rounded corners
            vec2 pixelPos = vUv * uPlaneSize;
            vec2 center = uPlaneSize * 0.5;
            float d = roundedBoxSDF(pixelPos - center, center, uBorderRadius);
            
            // Antialiased border clipping
            float alpha = smoothstep(1.0, 0.0, d);
            if (alpha <= 0.0) discard;

            vec2 screenUv = gl_FragCoord.xy / uResolution.xy;
            
            // Frosting noise
            vec2 noiseUv = vUv * max(uPlaneSize.x, uPlaneSize.y) * 0.01 + uTime * 0.1;
            float n = noise(noiseUv);
            
            // Liquid Mouse Ripple
            float dist = distance(screenUv, uMouse);
            float ripple = sin(dist * 20.0 - uTime * 5.0) * exp(-dist * 6.0);
            
            // Calculate Refraction Displacement
            vec2 displacement = vec2(n * 0.005, n * 0.005);
            displacement += (screenUv - uMouse) * ripple * 0.04;
            
            // Fresnel Edge Thickness
            float edgeX = smoothstep(0.0, 0.02, vUv.x) * smoothstep(1.0, 0.98, vUv.x);
            float edgeY = smoothstep(0.0, 0.02, vUv.y) * smoothstep(1.0, 0.98, vUv.y);
            float edge = 1.0 - (edgeX * edgeY);
            
            displacement += (vUv - 0.5) * edge * 0.02;

            vec2 distortedUv = screenUv + displacement;

            // Chromatic Aberration & Blur for Glassy look
            vec3 blurColor = vec3(0.0);
            float blurSize = 0.005; // Adjust blur amount
            
            // 4-tap box blur with chromatic aberration offset
            blurColor += vec3(
                texture2D(uBackgroundMap, distortedUv + vec2(blurSize, blurSize) + vec2(0.005, 0.0)).r,
                texture2D(uBackgroundMap, distortedUv + vec2(blurSize, blurSize)).g,
                texture2D(uBackgroundMap, distortedUv + vec2(blurSize, blurSize) - vec2(0.005, 0.0)).b
            );
            blurColor += vec3(
                texture2D(uBackgroundMap, distortedUv + vec2(-blurSize, blurSize) + vec2(0.005, 0.0)).r,
                texture2D(uBackgroundMap, distortedUv + vec2(-blurSize, blurSize)).g,
                texture2D(uBackgroundMap, distortedUv + vec2(-blurSize, blurSize) - vec2(0.005, 0.0)).b
            );
            blurColor += vec3(
                texture2D(uBackgroundMap, distortedUv + vec2(blurSize, -blurSize) + vec2(0.005, 0.0)).r,
                texture2D(uBackgroundMap, distortedUv + vec2(blurSize, -blurSize)).g,
                texture2D(uBackgroundMap, distortedUv + vec2(blurSize, -blurSize) - vec2(0.005, 0.0)).b
            );
            blurColor += vec3(
                texture2D(uBackgroundMap, distortedUv + vec2(-blurSize, -blurSize) + vec2(0.005, 0.0)).r,
                texture2D(uBackgroundMap, distortedUv + vec2(-blurSize, -blurSize)).g,
                texture2D(uBackgroundMap, distortedUv + vec2(-blurSize, -blurSize) - vec2(0.005, 0.0)).b
            );
            
            // Center sample
            blurColor += vec3(
                texture2D(uBackgroundMap, distortedUv + vec2(0.005, 0.0)).r,
                texture2D(uBackgroundMap, distortedUv).g,
                texture2D(uBackgroundMap, distortedUv - vec2(0.005, 0.0)).b
            );
            
            vec3 color = blurColor / 5.0;
            
            // Add lighting and frosting
            color += vec3(0.05) * n; // Frost
            color += vec3(0.12) * edge; // Edge highlight
            
            gl_FragColor = vec4(color, alpha);
        }
    `;

    // --- DOM Tracking ---
    const trackedElements = [];
    const baseGeometry = new THREE.PlaneGeometry(1, 1);

    function addTrackedElement(domElement) {
        // Compute border radius
        const style = window.getComputedStyle(domElement);
        let br = parseFloat(style.borderRadius);
        if (isNaN(br)) br = 0;

        const material = new THREE.ShaderMaterial({
            vertexShader: glassVertexShader,
            fragmentShader: glassFragmentShader,
            transparent: true,
            uniforms: {
                uBackgroundMap: { value: bgRenderTarget.texture },
                uResolution: globalUniforms.uResolution,
                uMouse: globalUniforms.uMouse,
                uTime: globalUniforms.uTime,
                uPlaneSize: { value: new THREE.Vector2(100, 100) },
                uBorderRadius: { value: br }
            }
        });

        const mesh = new THREE.Mesh(baseGeometry, material);
        glassScene.add(mesh);

        trackedElements.push({
            dom: domElement,
            mesh: mesh,
            material: material
        });
    }

    // Initialize tracking for glass panels and custom cursor (excluding header for CSS blur)
    const elementsToTrack = document.querySelectorAll('.glass-panel, #custom-cursor');
    elementsToTrack.forEach(el => addTrackedElement(el));

    function syncMeshes() {
        trackedElements.forEach(item => {
            // For header, only show glass if scrolled
            if (item.dom.tagName === 'HEADER' && !item.dom.classList.contains('scrolled')) {
                item.mesh.visible = false;
                return;
            }
            // Check if element is hidden by parent (e.g. portfolio filter)
            if (item.dom.closest('.hide') || getComputedStyle(item.dom).display === 'none') {
                item.mesh.visible = false;
                return;
            }
            item.mesh.visible = true;

            const rect = item.dom.getBoundingClientRect();
            
            // Update Mesh Scale & Position
            item.mesh.scale.set(rect.width, rect.height, 1);
            item.mesh.position.x = rect.left + rect.width / 2;
            item.mesh.position.y = window.innerHeight - (rect.top + rect.height / 2);
            
            // Update Uniforms
            item.material.uniforms.uPlaneSize.value.set(rect.width * pixelRatio, rect.height * pixelRatio);
            
            // Handle dynamic border radius (e.g. if modified on hover or scroll)
            const style = window.getComputedStyle(item.dom);
            let br = parseFloat(style.borderRadius);
            if (isNaN(br)) br = 0;
            item.material.uniforms.uBorderRadius.value = br * pixelRatio;
        });
    }

    // --- Resize Handling ---
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        renderer.setSize(width, height);
        camera.right = width;
        camera.top = height;
        camera.updateProjectionMatrix();

        const pr = renderer.getPixelRatio();
        bgRenderTarget.setSize(width * pr, height * pr);
        globalUniforms.uResolution.value.set(width * pr, height * pr);
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        globalUniforms.uTime.value = clock.getElapsedTime();
        
        // Sync positions every frame to support scrolling and VanillaTilt
        syncMeshes();

        // Pass 1: Render background blobs to render target
        renderer.setRenderTarget(bgRenderTarget);
        renderer.clear();
        renderer.render(bgScene, camera);

        // Pass 2: Render background to screen, then glass scene on top
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(bgScene, camera); // Draw background
        
        // Ensure glass materials use the freshly rendered background
        trackedElements.forEach(item => {
            item.material.uniforms.uBackgroundMap.value = bgRenderTarget.texture;
        });

        renderer.render(glassScene, camera); // Draw glass
    }

    animate();
});
