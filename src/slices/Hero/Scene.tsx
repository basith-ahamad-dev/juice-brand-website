"use client";

import { useRef } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { useStore } from "@/hooks/useStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {};

export default function Scene({}: Props) {
  const isReady = useStore((state) => state.isReady);

  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);
  const can3Ref = useRef<Group>(null);
  const can4Ref = useRef<Group>(null);
  const can5Ref = useRef<Group>(null);

  const can1GroupRef = useRef<Group>(null);
  const can2GroupRef = useRef<Group>(null);

  const groupRef = useRef<Group>(null);

  const FLOAT_SPEED = 1.5;

  // ---- HOME / HERO style: change this one word to switch the look ----
  // "stagger" = cans at different heights, turned toward the viewer
  // "bold"    = big cans pushed to the edges, partly cropped
  // "minimal" = small, upright, clean cans far from the text
  const HERO_STYLE: "stagger" | "bold" | "minimal" = "stagger";

  const HERO_PRESETS = {
    stagger: {
      left: { x: -2.5, y: -0.7, tilt: -0.3, turn: 0.5, scale: 0.9 },
      right: { x: 2.5, y: 0.6, tilt: 0.3, turn: -0.5, scale: 0.9 },
    },
    bold: {
      left: { x: -3.6, y: -0.9, tilt: -0.4, turn: 0.3, scale: 1.2 },
      right: { x: 3.6, y: -0.9, tilt: 0.4, turn: -0.3, scale: 1.2 },
    },
    minimal: {
      left: { x: -3.0, y: -0.2, tilt: -0.05, turn: 0, scale: 0.7 },
      right: { x: 3.0, y: -0.2, tilt: 0.05, turn: 0, scale: 0.7 },
    },
  } as const;

  const HERO = HERO_PRESETS[HERO_STYLE];

  // ---- "Try all five flavors" row (after scrolling) ----
  const SPACING = 0.9; // gap between cans
  const ROW_Y = 0;     // same height for all cans (prevents cut-off)
  const ROW_SCALE = 0.7; // makes the whole row smaller
  const ROW_X = 1.2;  // moves the row right, away from the text

  useGSAP(() => {
    if (
      !can1Ref.current ||
      !can2Ref.current ||
      !can3Ref.current ||
      !can4Ref.current ||
      !can5Ref.current ||
      !can1GroupRef.current ||
      !can2GroupRef.current ||
      !groupRef.current
    )
      return;

    isReady();

    // Hero starting positions (from the HERO_STYLE preset)
    gsap.set(can1Ref.current.position, { x: HERO.left.x, y: HERO.left.y });
    gsap.set(can1Ref.current.rotation, { z: HERO.left.tilt, y: HERO.left.turn });
    gsap.set(can1Ref.current.scale, {
      x: HERO.left.scale,
      y: HERO.left.scale,
      z: HERO.left.scale,
    });

    gsap.set(can2Ref.current.position, { x: HERO.right.x, y: HERO.right.y });
    gsap.set(can2Ref.current.rotation, { z: HERO.right.tilt, y: HERO.right.turn });
    gsap.set(can2Ref.current.scale, {
      x: HERO.right.scale,
      y: HERO.right.scale,
      z: HERO.right.scale,
    });

    // Other cans wait off-screen until the scroll animation brings them in
    gsap.set(can3Ref.current.position, { y: 5, z: 2 });
    gsap.set(can4Ref.current.position, { x: 0, y: 4, z: 2 });
    gsap.set(can5Ref.current.position, { y: -5 });

    // Intro animation (only plays if at the top of the page)
    const introTl = gsap.timeline({
      defaults: { duration: 3, ease: "back.out(1.4)" },
    });

    if (window.scrollY < 20) {
      introTl
        .from(can1GroupRef.current.position, { y: -5, x: 1 }, 0)
        .from(can1GroupRef.current.rotation, { z: 3 }, 0)
        .from(can2GroupRef.current.position, { y: 5, x: 1 }, 0)
        .from(can2GroupRef.current.rotation, { z: 3 }, 0);
    }

    // Scroll-driven animation
    const scrollTl = gsap.timeline({
      defaults: { duration: 2 },
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    scrollTl
      .to(groupRef.current.rotation, { y: Math.PI * 2 })

      // Can 1 - Black Cherry (far left)
      .to(can1Ref.current.position, { x: -SPACING * 2, y: ROW_Y, z: 0 }, 0)
      .to(can1Ref.current.rotation, { z: -0.12, y: 0 }, 0)
      .to(can1Ref.current.scale, { x: 1, y: 1, z: 1 }, 0)

      // Can 3 - Grape (left)
      .to(can3Ref.current.position, { x: -SPACING, y: ROW_Y, z: 0 }, 0)
      .to(can3Ref.current.rotation, { z: -0.06 }, 0)

      // Can 4 - Strawberry Lemonade (center front, upright)
      .to(can4Ref.current.position, { x: 0, y: ROW_Y, z: 0.3 }, 0)
      .to(can4Ref.current.rotation, { z: 0 }, 0)

      // Can 5 - Watermelon (right)
      .to(can5Ref.current.position, { x: SPACING, y: ROW_Y, z: 0 }, 0)
      .to(can5Ref.current.rotation, { z: 0.06 }, 0)

      // Can 2 - Lemon Lime (far right)
      .to(can2Ref.current.position, { x: SPACING * 2, y: ROW_Y, z: 0 }, 0)
      .to(can2Ref.current.rotation, { z: 0.12, y: 0 }, 0)
      .to(can2Ref.current.scale, { x: 1, y: 1, z: 1 }, 0)

      // Shrink the whole row
      .to(
        groupRef.current.scale,
        { x: ROW_SCALE, y: ROW_SCALE, z: ROW_SCALE },
        0,
      )

      // Shift the row right (away from the text)
      .to(
        groupRef.current.position,
        { x: ROW_X, duration: 3, ease: "sine.inOut" },
        1.3,
      );
  });

  return (
    <group ref={groupRef}>
      <group ref={can1GroupRef}>
        <FloatingCan
          ref={can1Ref}
          flavor="blackCherry"
          floatSpeed={FLOAT_SPEED}
        />
      </group>
      <group ref={can2GroupRef}>
        <FloatingCan
          ref={can2Ref}
          flavor="lemonLime"
          floatSpeed={FLOAT_SPEED}
        />
      </group>

      <FloatingCan ref={can3Ref} flavor="grape" floatSpeed={FLOAT_SPEED} />
      <FloatingCan
        ref={can4Ref}
        flavor="strawberryLemonade"
        floatSpeed={FLOAT_SPEED}
      />
      <FloatingCan ref={can5Ref} flavor="watermelon" floatSpeed={FLOAT_SPEED} />

      {/* <OrbitControls /> */}
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}