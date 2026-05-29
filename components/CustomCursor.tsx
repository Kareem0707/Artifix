"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor({ children }: { children: React.ReactNode }) {
    const [isHovered, setIsHovered] = useState(false);
    const cursorRef = useRef(null);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        // Add magnetic / hover state reading
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('magnetic')
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            <motion.div
                ref={cursorRef}
                className="hidden md:flex fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-accent/80 items-center justify-center pointer-events-none z-[100] mix-blend-exclusion backdrop-blur-[2px]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    scale: isHovered ? 2.5 : 1,
                    backgroundColor: isHovered ? "rgba(0, 240, 255, 0.1)" : "transparent",
                }}
            >
                {isHovered && <span className="text-[4px] font-bold text-accent">VIEW</span>}
            </motion.div>
            {children}
        </>
    );
}
