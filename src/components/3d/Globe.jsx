import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Html, Stars, Preload, ScreenQuad } from '@react-three/drei';
import * as THREE from 'three';


/**
 * MarkerPulse - Animated glowing marker component
 */
const MarkerPulse = ({ position, label, color = '#ff6b6b', onClick }) => {
    const groupRef = useRef();
    const pulseRef = useRef();

    useFrame(({ clock }) => {
        if (pulseRef.current) {
            pulseRef.current.scale.multiplyScalar(0.95);
            pulseRef.current.scale.addScalar(0.05 + Math.sin(clock.elapsedTime * 3) * 0.02);
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Glowing Core */}
            <mesh>
                <sphereGeometry args={[0.025, 16, 16]} />
                <meshBasicMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.5}
                />
            </mesh>

            {/* Pulsing Ring */}
            <mesh ref={pulseRef}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Point Light for glow effect */}
            <pointLight color={color} intensity={0.8} distance={0.3} />

            {/* Interactive Label */}
            <Html
                position={[0, 0.08, 0]}
                center
                distanceFactor={2.5}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
                <div
                    onClick={() => onClick?.()}
                    className="group relative"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-125 whitespace-nowrap border border-blue-400/50"
                    >
                        {label}
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-sm -z-10 group-hover:blur opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                </div>
            </Html>
        </group>
    );
};


/**
 * GlobeCore - The actual 3D Earth component with enhanced visuals
 */
const GlobeCore = ({
    markers = [],
    autoRotate = true,
    rotationSpeed = 0.001,
    onClick
}) => {
    const meshRef = useRef();
    const cloudsRef = useRef();
    const atmosphereRef = useRef();

    // Load textures
    const textures = useTexture({
        earth: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg',
        bump: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_specular_2048.jpg',
        clouds: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_clouds_1024.png',
    });

    useFrame(({ clock }) => {
        if (autoRotate && meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed;
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += rotationSpeed * 1.3;
        }
        // Subtle atmosphere pulse
        if (atmosphereRef.current) {
            atmosphereRef.current.material.uniforms.intensity.value = 0.6 + Math.sin(clock.elapsedTime) * 0.1;
        }
    });

    const latLngToVector3 = (lat, lng, radius = 1.025) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);

        return new THREE.Vector3(
            -radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    };

    // Enhanced atmosphere shader with pulsing effect
    const atmosphereShader = useMemo(() => ({
        uniforms: {
            glowColor: { value: new THREE.Color('#00d4ff') },
            intensity: { value: 0.6 }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            uniform vec3 glowColor;
            uniform float intensity;
            void main() {
                float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(glowColor, intensity) * glow * 1.2;
            }
        `,
    }), []);

    return (
        <group>
            {/* Earth with Enhanced Materials */}
            <mesh ref={meshRef} onClick={onClick}>
                <sphereGeometry args={[1, 128, 128]} />
                <meshStandardMaterial
                    map={textures.earth}
                    bumpMap={textures.bump}
                    bumpScale={0.08}
                    metalness={0.05}
                    roughness={0.85}
                    emissive="#2a2a4e"
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Enhanced Cloud Layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[1.008, 128, 128]} />
                <meshStandardMaterial
                    map={textures.clouds}
                    transparent
                    opacity={0.5}
                    depthWrite={false}
                    emissive="#88ccff"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Outer Glow Atmosphere */}
            <mesh ref={atmosphereRef} scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[1, 64, 64]} />
                <shaderMaterial
                    {...atmosphereShader}
                    transparent
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Enhanced Destination Markers with Animation */}
            {markers.map((marker, index) => {
                const position = latLngToVector3(marker.lat, marker.lng);
                return (
                    <MarkerPulse
                        key={index}
                        position={position}
                        label={marker.label}
                        color={marker.color || '#ff6b6b'}
                        onClick={() => marker.onClick?.(marker)}
                    />
                );
            })}
        </group>
    );
};


/**
 * FallbackGlobe - Enhanced loading state
 */
const FallbackGlobe = () => {
    const meshRef = useRef();

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
            meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.2;
        }
    });

    return (
        <group>
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#0a47a4" wireframe strokeWidth={2} />
            </mesh>
            <mesh scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#00d4ff"
                    wireframe
                    opacity={0.3}
                    transparent
                />
            </mesh>
        </group>
    );
};


/**
 * Globe - Self-contained 3D Globe with enhanced visuals
 */
const Globe = ({
    markers = [],
    autoRotate = true,
    rotationSpeed = 0.001,
    onClick,
    cameraPosition = [0, 0, 2.8],
    showStars = true,
    className = ''
}) => {
    return (
        <div className={`w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black ${className}`}>
            <Canvas


                camera={{ position: cameraPosition, fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    failIfMajorPerformanceCaveat: false
                }}
                dpr={[1, 1.5]}
                style={{ background: 'transparent' }}


            >
                {/* Advanced Lighting Setup */}
                <ambientLight intensity={1.2} color="#ffffff" />
                <directionalLight position={[15, 10, 8]} intensity={2.5} color="#ffffff" />
                <directionalLight position={[-15, -10, -8]} intensity={0.8} color="#4fc3dc" />
                <pointLight position={[10, 10, 10]} intensity={0.8} color="#00d4ff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />

                {/* Enhanced Stars with better LOD */}
                {showStars && (
                    <Stars
                        radius={150}
                        depth={60}
                        count={5000}
                        factor={5}
                        saturation={0.3}
                        fade
                        speed={0.3}
                    />
                )}

                {/* Globe with Suspense */}
                <Suspense fallback={<FallbackGlobe />}>
                    <GlobeCore
                        markers={markers}
                        autoRotate={autoRotate}
                        rotationSpeed={rotationSpeed}
                        onClick={onClick}
                    />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Globe;