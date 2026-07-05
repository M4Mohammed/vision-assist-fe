"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  href?: string;
  size?: "sm" | "md";
  className?: string;
}

const LETTERS = [
  { char: "C", isLight: false },
  { char: "A", isLight: false },
  { char: "P", isLight: false },
  { char: "I", isLight: true },
  { char: "T", isLight: true },
];

/** Camera-body outline whose bottom edge morphs into a sound wave on hover. */
const BODY_REST =
  "M3 9a2 2 0 0 1 2-2h1.5l1.5-2h8l1.5 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2 H5a2 2 0 0 1-2-2V9z";
const BODY_FLAT =
  "M3 9a2 2 0 0 1 2-2h1.5l1.5-2h8l1.5 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2 L 15.5 20 L 12 20 L 8.5 20 L 5 20 a2 2 0 0 1-2-2V9z";
const BODY_WAVE_DOWN =
  "M3 9a2 2 0 0 1 2-2h1.5l1.5-2h8l1.5 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2 Q 17.25 17.2 15.5 20 Q 13.75 22.8 12 20 Q 10.25 17.2 8.5 20 Q 6.75 22.8 5 20 a2 2 0 0 1-2-2V9z";
const BODY_WAVE_UP =
  "M3 9a2 2 0 0 1 2-2h1.5l1.5-2h8l1.5 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2 Q 17.25 22.8 15.5 20 Q 13.75 17.2 12 20 Q 10.25 22.8 8.5 20 Q 6.75 17.2 5 20 a2 2 0 0 1-2-2V9z";

const BLINK = {
  animate: { scaleY: [1, 0.1, 1, 1, 0.1, 1] },
  transition: {
    repeat: Infinity,
    duration: 1.2,
    times: [0, 0.15, 0.3, 0.6, 0.75, 0.9],
    repeatDelay: 1.2,
  },
};

const BLINK_REST = {
  animate: { scaleY: 1 },
  transition: { duration: 0.2 },
};

export function Logo({ href = "/", size = "md", className }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setAnimationKey((prev) => prev + 1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const boxSize = size === "sm" ? "size-7" : "size-8";
  const iconSize = size === "sm" ? "size-4" : "size-5";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  const blink = isHovered ? BLINK : BLINK_REST;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 focus-visible:rounded-md",
        className,
      )}
      aria-label="CapIt — home"
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
        aria-hidden="true"
        className="flex flex-row flex-nowrap items-center gap-3 cursor-pointer select-none whitespace-nowrap"
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={cn(
            "flex flex-shrink-0 items-center justify-center rounded-sm bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]",
            boxSize,
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className={cn("text-black", iconSize)}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Camera body; bottom edge ripples like a sound wave while hovered */}
            <motion.path
              animate={{
                d: isHovered
                  ? [BODY_FLAT, BODY_WAVE_DOWN, BODY_WAVE_UP, BODY_FLAT]
                  : BODY_REST,
              }}
              transition={{
                duration: isHovered ? 0.7 : 0.2,
                ease: "easeInOut",
                repeat: isHovered ? Infinity : 0,
              }}
            />

            {/* Viewfinder detail dot */}
            <circle cx="17.5" cy="10" r="0.5" fill="currentColor" />

            {/* Lens container */}
            <circle cx="12" cy="13" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="white" />

            {/* Pupil */}
            <motion.circle
              cx="12"
              cy="13"
              r="2.2"
              fill="currentColor"
              style={{ transformOrigin: "12px 13px" }}
              {...blink}
            />

            {/* Specular highlight */}
            <motion.circle
              cx="11.2"
              cy="12.2"
              r="0.6"
              fill="white"
              style={{ transformOrigin: "12px 13px" }}
              {...blink}
            />

            {/* Eyelid + lashes */}
            <motion.g style={{ transformOrigin: "12px 13px" }} {...blink}>
              <path
                d="M 8.5 13 Q 12 9.5 15.5 13"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 9.5 11.8 L 8.3 10.0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M 10.8 11.0 L 10.2 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M 12 10.7 L 11.8 8.0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M 13.2 11.0 L 13.8 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M 14.5 11.8 L 15.7 10.0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </motion.g>
          </svg>
        </motion.div>

        <motion.span
          key={animationKey}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.18, delayChildren: 0.05 },
            },
          }}
          initial="hidden"
          animate="visible"
          className={cn(
            "flex flex-row flex-nowrap whitespace-nowrap font-bold uppercase tracking-tighter text-white",
            textSize,
          )}
        >
          {LETTERS.map((letter, idx) => (
            <motion.span
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 4, filter: "blur(2px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className={cn(
                "font-extrabold",
                letter.isLight ? "text-[#CCCCCC]" : "text-white",
              )}
            >
              {letter.char}
            </motion.span>
          ))}
        </motion.span>
      </div>
    </Link>
  );
}
