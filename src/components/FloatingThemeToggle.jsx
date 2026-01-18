// components/FloatingThemeToggle.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../ThemeContext";

const STORAGE_KEY = "themeTogglePos_v1";

export default function FloatingThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const btnRef = useRef(null);
  const constraintsRef = useRef(null);

  // store x/y offsets from the bottom-right anchor
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Load saved position
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved.x === "number" && typeof saved.y === "number") {
        setPos(saved);
      }
    } catch {}
  }, []);

  const savePos = (x, y) => {
    const next = { x, y };
    setPos(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  return (
    // Fullscreen invisible layer for constraints (so user can’t drag it off screen)
    <div
      ref={constraintsRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3000,
      }}
    >
      <motion.button
        ref={btnRef}
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.12}
        dragMomentum={false}
        onDragEnd={(e, info) => {
          // persist offsets relative to the anchor position
          savePos(pos.x + info.offset.x, pos.y + info.offset.y);
        }}
        // Anchor it bottom-right; apply saved offsets
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        style={{
          position: "fixed",
          right: "1.5rem",
          bottom: "1.5rem",
          pointerEvents: "auto",
        }}
        className="theme-toggle-desktop"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </motion.button>
    </div>
  );
}
