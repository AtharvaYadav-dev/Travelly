import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import gsap from "gsap";

/**
 * Sovereign Globe: High-fidelity 3D WebGPU Visualization
 * Kinetic Zoon to coordinates from ItineraryFragment.jsx
 */
const GlobeModel = ({ targetLocation }) => {
  const meshRef = useRef();
  const { camera } = useThree();

  // Load High-res texture
  const texture = useMemo(() => new THREE.TextureLoader().load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"), []);

  useEffect(() => {
    if (targetLocation && targetLocation.lat !== undefined && targetLocation.lng !== undefined) {
      // Kinetic Zoom logic: Convert Lat/Lng to 3D Cartesian
      const radius = 1;
      const phi = (90 - targetLocation.lat) * (Math.PI / 180);
      const theta = (targetLocation.lng + 180) * (Math.PI / 180);

      const targetX = -(radius * Math.sin(phi) * Math.cos(theta));
      const targetZ = radius * Math.sin(phi) * Math.sin(theta);
      const targetY = radius * Math.cos(phi);

      // GSAP Kinetic Fly-To ORBIT & SNAP
      const tl = gsap.timeline();
      
      tl.to(camera.position, {
        x: targetX * 1.8,
        y: targetY * 1.8,
        z: targetZ * 1.8,
        duration: 1.5,
        ease: "power2.in"
      })
      .to(camera.position, {
        x: targetX * 1.2,
        y: targetY * 1.2,
        z: targetZ * 1.2,
        duration: 1.2,
        ease: "expo.out"
      });

      tl.to(camera, {
        zoom: 2.5,
        duration: 2.5,
        onUpdate: () => camera.updateProjectionMatrix()
      }, 0);

      gsap.to(camera.lookAt, {
        x: 0, y: 0, z: 0,
        onUpdate: () => camera.lookAt(0, 0, 0)
      });
    }
  }, [targetLocation, camera]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05; // Ambient rotation
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
      </mesh>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#00ffff" />
    </group>
  );
};

const SovereignGlobe = ({ targetLocation }) => {
  return (
    <div className="w-full h-96 lg:h-[600px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative bg-slate-950">
      <div className="absolute inset-x-0 top-10 flex justify-center z-10">
        <span className="px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">
          Sovereign WebGPU Visualization
        </span>
      </div>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          // 🚀 Enable WebGPU if available in browser
          renderer: window.navigator.gpu ? "WebGPURenderer" : "WebGLRenderer"
        }}
      >
        <GlobeModel targetLocation={targetLocation} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default SovereignGlobe;
