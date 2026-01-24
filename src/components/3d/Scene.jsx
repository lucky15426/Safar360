import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Preload } from '@react-three/drei';

/**
 * Scene - Reusable 3D Canvas wrapper
 * @param {Object} props
 * @param {React.ReactNode} props.children - 3D elements to render
 * @param {boolean} props.controls - Enable orbit controls (default: false)
 * @param {boolean} props.stars - Show star background (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const Scene = ({
    children,
    controls = false,
    stars = true,
    className = '',
    cameraPosition = [0, 0, 5],
    ...props
}) => {
    return (
        <div className={`w-full h-full ${className}`} {...props}>
            <Canvas
                camera={{ position: cameraPosition, fov: 45 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'default',
                    failIfMajorPerformanceCaveat: false
                }}
                dpr={[1, 1.5]}
                style={{ background: 'transparent' }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4fc3dc" />

                {/* Stars Background */}
                {stars && (
                    <Stars
                        radius={100}
                        depth={50}
                        count={3000}
                        factor={4}
                        saturation={0}
                        fade
                        speed={0.5}
                    />
                )}

                {/* Content */}
                <Suspense fallback={null}>
                    {children}
                    <Preload all />
                </Suspense>

                {/* Camera Controls */}
                {controls && (
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        minDistance={2}
                        maxDistance={10}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                )}
            </Canvas>
        </div>
    );
};

export default Scene;
