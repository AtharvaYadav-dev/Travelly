import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Tooltip component with fade animation and dark mode support.
 * @param {string} content - Tooltip text
 * @param {string} position - top | bottom | left | right
 * @param {ReactNode} children - The element to wrap
 */
const Tooltip = ({ content, position = "top", children }) => {
  const [visible, setVisible] = useState(false);
  const timeout = useRef();

  const show = () => {
    timeout.current = setTimeout(() => setVisible(true), 80);
  };
  const hide = () => {
    clearTimeout(timeout.current);
    setVisible(false);
  };

  let posClass = "";
  if (position === "top") posClass = "bottom-full left-1/2 -translate-x-1/2 mb-2";
  if (position === "bottom") posClass = "top-full left-1/2 -translate-x-1/2 mt-2";
  if (position === "left") posClass = "right-full top-1/2 -translate-y-1/2 mr-2";
  if (position === "right") posClass = "left-full top-1/2 -translate-y-1/2 ml-2";

  return (
    <span className="relative inline-block"
      onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} tabIndex={0}
    >
      {children}
      <span
        className={`pointer-events-none absolute z-50 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg border border-indigo-100 dark:border-dark-border bg-white/90 dark:bg-dark-glass text-gray-800 dark:text-gray-100 transition-all duration-200 opacity-0 scale-95 ${posClass} ${visible ? "opacity-100 scale-100" : ""}`}
        role="tooltip"
        aria-hidden={!visible}
      >
        {content}
      </span>
    </span>
  );
};

Tooltip.propTypes = {
  content: PropTypes.string.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  children: PropTypes.node.isRequired,
};

export default Tooltip;
