import React, { useState } from "react";

const withDraggable = (WrappedComponent) => {
  return (props) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    const handleMouseDown = (e) => {
      setDragging(true);
    };

    const handleMouseMove = (e) => {
      if (dragging) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    return (
      <div
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: "absolute",
          top: position.y || "50%",
          left: position.x || "50%",
          transform: "translate(-50%, -50%)",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default withDraggable;
