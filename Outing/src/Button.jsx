import React, { useRef } from "react";
import PropTypes from "prop-types";

// Simple CSS ripple effect
const Button = ({ children, className = "", onClick, type = "button", ...props }) => {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    const button = btnRef.current;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={btnRef}
      type={type}
      className={`relative overflow-hidden transition-all focus:outline-none dark:shadow-glass-dark dark:text-gray-100 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

export default Button;

// Add ripple styles (can be moved to index.css)
const style = document.createElement('style');
style.innerHTML = `
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms linear;
  background: rgba(255,255,255,0.5);
  pointer-events: none;
  z-index: 10;
}
@keyframes ripple {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}`;
document.head.appendChild(style);
