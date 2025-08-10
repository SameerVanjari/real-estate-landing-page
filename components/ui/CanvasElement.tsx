'use client';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three';
import React, { Suspense } from 'react'
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import { Loader2 } from 'lucide-react';

const SphereComponent = ({ text }: { text: string }) => {
    // Use the provided texture path, fallback to '/fireplace.jpg' if empty or invalid
    const validTexture = text && text.trim() !== '' ? text : '/fireplace.jpg';
    const texture = useLoader(THREE.TextureLoader, validTexture);
    const prevTexture = React.useRef<THREE.Texture | null>(null);

    React.useEffect(() => {
        // Dispose previous texture if different
        if (prevTexture.current && prevTexture.current !== texture) {
            prevTexture.current.dispose();
        }
        prevTexture.current = texture;
        if (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.colorSpace = THREE.SRGBColorSpace;
        }
        // Clean up on unmount
        return () => {
            if (texture) texture.dispose();
        };
    }, [texture]);
    const sphereRef = React.useRef<THREE.Mesh>(null)
    useFrame((state, delta) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.y += delta * 0.05;
        }
    })

    return (
        <>
            {/* Add your 3D objects here */}
            <mesh ref={sphereRef}>
                <sphereGeometry args={[45, 32, 32]} />
                <meshStandardMaterial map={texture} side={THREE.BackSide} />
            </mesh>
        </>
    )
}

const CanvasElement = ({ texture }: { texture: string }) => {
    return (<div className='w-full h-full min-h-[400px] bg-gray-400 rounded-lg'>
        <Suspense fallback={<div className='w-full h-full flex items-center justify-center'><Loader2 className='animate-spin text-blue-200' size={36} /> </div>}>

            <Canvas className='cursor-grab'>
                {/* <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} /> */}
                <Environment preset='city' />
                <OrbitControls maxDistance={43} />
                <SphereComponent text={texture} />
            </Canvas>
        </Suspense>
    </div>
    )
}

export default CanvasElement