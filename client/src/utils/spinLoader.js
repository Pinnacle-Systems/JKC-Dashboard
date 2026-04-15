import React from "react";

const SpinLoader = () => {
  return (
    <div style={styles.overlay}>
      <div style={styles.spinner}>
        <div
          style={{
            ...styles.blade,
            transform: "translateY(-50%) rotate(0deg)",
          }}
        />
        <div
          style={{
            ...styles.blade,
            transform: "translateY(-50%) rotate(90deg)",
          }}
        />
        <div
          style={{
            ...styles.blade,
            transform: "translateY(-50%) rotate(180deg)",
          }}
        />
        <div
          style={{
            ...styles.blade,
            transform: "translateY(-50%) rotate(270deg)",
          }}
        />
        <div style={styles.center} />
      </div>
    

      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

/* 🔵 Clean Blue Palette (Balanced) */
const BLUE = "#2563EB";
const SOFT_BLUE = "#60A5FA";

const styles = {
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  spinner: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: `1.3px solid ${SOFT_BLUE}`,
    position: "relative",
    animation: "spin 0.55s linear infinite",
    background: "rgba(37,99,235,0.04)",
    boxShadow: `
    0 0 6px ${BLUE}40,
    0 0 12px ${BLUE}20
  `,
  },

  blade: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "14px",
    height: "4px",
    background: `linear-gradient(
      to right,
      transparent,
      ${BLUE}
    )`,
    borderRadius: "0 6px 6px 0",
    transformOrigin: "0% 50%",
    opacity: 0.9,
  },

  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "7px",
    height: "7px",
    background: `radial-gradient(circle, #DBEAFE, ${BLUE})`,
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",

    /* ✅ Balanced center glow */
    boxShadow: `0 0 4px ${BLUE}80`,
  },
};

export default SpinLoader;
