"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Collection = {
  name: string;
  slug: string;
};

function Garment({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(
    () => [
      new THREE.Vector2(0.25, 1.35),
      new THREE.Vector2(0.4, 1.22),
      new THREE.Vector2(0.7, 0.8),
      new THREE.Vector2(index === 1 ? 1.0 : 0.9, 0.1),
      new THREE.Vector2(index === 2 ? 1.35 : 1.2, -0.9),
      new THREE.Vector2(index === 1 ? 1.65 : 1.45, -1.55),
    ],
    [index],
  );

  const materialColor = ["#d8c19a", "#efe8db", "#b99861"][index] ?? "#d8c19a";

  useFrame((state) => {
    if (!group.current) return;
    const offset = (index - 1) * 0.14;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.18 + offset,
      0.035,
    );
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.65 + index) * 0.05;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]} castShadow>
        <latheGeometry args={[points, 48]} />
        <meshPhysicalMaterial color={materialColor} roughness={0.34} sheen={0.55} sheenRoughness={0.2} />
      </mesh>
      <mesh position={[0, 1.38, 0]} castShadow>
        <sphereGeometry args={[0.25, 28, 28]} />
        <meshPhysicalMaterial color="#d6b393" roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.83, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.35, 0.24, 64]} />
        <meshStandardMaterial color="#171717" roughness={0.62} metalness={0.18} />
      </mesh>
      <mesh position={[0, -1.69, 0]}>
        <torusGeometry args={[1.18, 0.018, 8, 64]} />
        <meshStandardMaterial color="#c7a55b" emissive="#6e5420" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}

function ShowroomScene() {
  const stage = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!stage.current) return;
    stage.current.rotation.y = THREE.MathUtils.lerp(stage.current.rotation.y, state.pointer.x * 0.06, 0.025);
    stage.current.rotation.x = THREE.MathUtils.lerp(stage.current.rotation.x, state.pointer.y * 0.025, 0.025);
  });

  return (
    <>
      <color attach="background" args={["#f3efe7"]} />
      <ambientLight intensity={1.7} />
      <hemisphereLight args={["#fffaf1", "#bdb2a0", 1.2]} />
      <spotLight position={[4, 7, 6]} intensity={80} angle={0.45} penumbra={1} color="#fff4dc" castShadow />
      <pointLight position={[-4, 2, 3]} intensity={25} color="#c9a560" />

      <group ref={stage} position={[0, 0.25, 0]}>
        <group position={[-2.3, 0, 0]}>
          <Garment index={0} />
        </group>
        <group position={[0, 0.18, 0.35]} scale={1.08}>
          <Garment index={1} />
        </group>
        <group position={[2.3, 0, 0]}>
          <Garment index={2} />
        </group>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.03, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#e6dfd3" roughness={0.78} />
      </mesh>
    </>
  );
}

export default function AtelierShowroom({ collections }: { collections: Collection[] }) {
  const fallback = [
    { name: "The Anarkali", slug: "anarkali" },
    { name: "The Gown", slug: "gown" },
    { name: "The Lehenga", slug: "lehenga" },
  ];
  const items = [...collections.slice(0, 3), ...fallback].slice(0, 3);

  return (
    <section className="overflow-hidden bg-[#f3efe7] px-5 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--gold)]">
              The digital showroom
            </p>
            <h2 className="mt-4 max-w-2xl text-6xl leading-[0.9] tracking-[-0.025em]">
              See the silhouette
              <br />
              before you choose it.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-black/50">
            Move your cursor across the showroom to shift the scene. Then open a collection to continue into the full catalogue.
          </p>
        </div>

        <div className="relative mt-12 h-[520px] overflow-hidden rounded-[2rem] border border-black/10 bg-[#e9e3d8]">
          <Canvas camera={{ position: [0, 0.2, 8.7], fov: 34 }} dpr={[1, 1.5]} shadows>
            <ShowroomScene />
          </Canvas>

          <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
            {items.map((item, index) => {
              const itemKey = item.slug + "-" + index;
              const itemHref = "/collections/" + item.slug;
              return (
                <Link
                  key={itemKey}
                  href={itemHref}
                  className="pointer-events-auto min-w-0 flex-1 rounded-2xl border border-black/10 bg-white/75 p-4 shadow-[0_18px_50px_rgba(0,0,0,.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white"
                >
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-black/35">
                    0{index + 1}
                  </span>
                  <span className="mt-2 block truncate display-font text-2xl">{item.name}</span>
                  <span className="mt-1 block text-xs text-black/45">Enter collection →</span>
                </Link>
              );
            })}
          </div>

          <span className="absolute left-5 top-5 rounded-full border border-black/10 bg-white/60 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-black/45 backdrop-blur-md">
            Interactive 3D
          </span>
        </div>
      </div>
    </section>
  );
}
