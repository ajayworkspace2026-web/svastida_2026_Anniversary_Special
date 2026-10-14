"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function useDressPoints() {
  return useMemo(
    () => [
      new THREE.Vector2(0.26, 1.72),
      new THREE.Vector2(0.34, 1.58),
      new THREE.Vector2(0.58, 1.38),
      new THREE.Vector2(0.82, 1.02),
      new THREE.Vector2(0.95, 0.35),
      new THREE.Vector2(1.18, -0.55),
      new THREE.Vector2(1.42, -1.38),
      new THREE.Vector2(1.68, -2.02),
      new THREE.Vector2(1.76, -2.18),
    ],
    [],
  );
}

function AtelierDress() {
  const group = useRef<THREE.Group>(null);
  const dressPoints = useDressPoints();

  useFrame((state) => {
    if (!group.current) return;
    const targetY = state.pointer.x * 0.22;
    const targetX = state.pointer.y * 0.08;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.04);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <group ref={group} rotation={[0, -0.24, 0]}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <latheGeometry args={[dressPoints, 64]} />
        <meshPhysicalMaterial
          color="#efe5d4"
          roughness={0.32}
          metalness={0.04}
          sheen={0.65}
          sheenRoughness={0.18}
        />
      </mesh>

      <mesh position={[0, 1.74, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.23, 0.34, 40]} />
        <meshPhysicalMaterial color="#d8c5a5" roughness={0.4} />
      </mesh>

      <mesh position={[0, 2.27, 0]} castShadow>
        <sphereGeometry args={[0.3, 40, 40]} />
        <meshPhysicalMaterial color="#d9b99b" roughness={0.48} />
      </mesh>

      <mesh position={[-0.26, 1.25, 0]} rotation={[0, 0, -0.34]} castShadow>
        <capsuleGeometry args={[0.11, 0.74, 10, 24]} />
        <meshPhysicalMaterial color="#d6b494" roughness={0.55} />
      </mesh>

      <mesh position={[0.26, 1.25, 0]} rotation={[0, 0, 0.34]} castShadow>
        <capsuleGeometry args={[0.11, 0.74, 10, 24]} />
        <meshPhysicalMaterial color="#d6b494" roughness={0.55} />
      </mesh>

      <mesh position={[0, 0.38, 0.98]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry args={[0.92, 0.018, 8, 96]} />
        <meshStandardMaterial color="#c9a85a" emissive="#6b4f1b" emissiveIntensity={0.35} />
      </mesh>

      <mesh position={[0, -0.62, 0]} scale={[1.06, 0.18, 1.06]}>
        <sphereGeometry args={[1.05, 32, 16]} />
        <meshBasicMaterial color="#caa85d" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function Particles() {
  const points = useMemo(() => {
    const positions = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i += 1) {
      const seed = i + 1;
      positions[i * 3] = Math.sin(seed * 12.9898) * 3.25;
      positions[i * 3 + 1] = Math.cos(seed * 78.233) * 2.9;
      positions[i * 3 + 2] = Math.sin(seed * 4.733) * 1.9;
    }
    return positions;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.025;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d2b56b" size={0.025} transparent opacity={0.62} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#0d0d0d"]} />
      <ambientLight intensity={1.05} />
      <hemisphereLight args={["#fff7e7", "#120d08", 1.15]} />
      <spotLight position={[3.7, 5.8, 5.5]} intensity={90} angle={0.42} penumbra={1} color="#fff1d6" castShadow />
      <pointLight position={[-4, 0.4, 2]} intensity={26} color="#c6a15b" />
      <pointLight position={[3, -2, -1]} intensity={14} color="#fff8ef" />
      <Particles />
      <AtelierDress />
      <mesh position={[0, -2.35, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.25, 96]} />
        <meshStandardMaterial color="#171717" roughness={0.72} metalness={0.2} />
      </mesh>
    </>
  );
}

export default function AtelierHero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#0d0d0d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_67%_35%,rgba(201,168,90,.18),transparent_26%),radial-gradient(circle_at_10%_90%,rgba(255,255,255,.07),transparent_30%)]" />
      <div className="absolute left-6 top-6 z-20 md:left-10 md:top-8">
        <p className="text-[10px] uppercase tracking-[0.38em] text-[#d2b56b]">Svastida Atelier / 2026</p>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-7xl items-center px-6 pb-16 pt-28 md:grid-cols-[0.9fr_1.1fr] md:px-10">
        <div className="max-w-xl">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-[#d2b56b]">
            Fashion in your hands
          </p>
          <h1 className="animate-fade-up-delay-1 mt-5 max-w-3xl text-7xl leading-[0.82] tracking-[-0.035em] sm:text-8xl md:text-[7.2rem]">
            Wear the
            <br />
            <span className="text-[#e8d5ae]">extraordinary.</span>
          </h1>
          <p className="animate-fade-up-delay-2 mt-7 max-w-md text-sm leading-7 text-white/65 md:text-base">
            A digital atelier for expressive Indian fashion — discover curated pieces, shape your fit,
            and turn your own fabric into a new silhouette.
          </p>

          <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap gap-3">
            <Link
              href="/collections"
              className="rounded-full bg-[#ead9b5] px-7 py-3.5 text-sm font-semibold text-[#111] transition hover:-translate-y-1"
            >
              Explore collections
            </Link>
            <Link
              href="/customise"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10"
            >
              Create with my fabric
            </Link>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.2em] text-white/40">
            <span>Curated</span>
            <span>Custom fit</span>
            <span>AI assisted</span>
          </div>
        </div>

        <div className="relative mt-8 h-[58vh] min-h-[480px] md:mt-0 md:h-[78vh]">
          <div className="absolute inset-x-[10%] top-[8%] h-[72%] rounded-full border border-white/5 bg-white/[0.02] blur-[1px]" />
          <Canvas
            camera={{ position: [0, 0.1, 6.8], fov: 34 }}
            dpr={[1, 1.5]}
            shadows
            gl={{ antialias: true, alpha: true }}
          >
            <Scene />
          </Canvas>

          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.35em] text-white/35">
            Move your cursor
          </div>

          <div className="absolute right-0 top-[14%] hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/50 backdrop-blur-md md:block">
            Digital mannequin
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d2b56b]/50 to-transparent" />
    </section>
  );
}
