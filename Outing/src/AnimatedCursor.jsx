

// Utility: checks if an element is clickable
const isClickable = (el) => {
  if (!el) return false;
  const clickableTags = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL'];
  if (clickableTags.includes(el.tagName)) return true;
  if (el.getAttribute('role') === 'button' || el.getAttribute('tabindex')) return true;
  return el.classList.contains('cursor-pointer') || el.closest('button,a,[role=button],.cursor-pointer');
};

const STAR_COUNT = 18;
const TRAIL_FADE_DURATION = 600; // ms
const BASE_STAR_SIZE = 24; // Slightly bigger base size

const StarSVG = ({ style, opacity, size = BASE_STAR_SIZE }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    style={{ ...style, opacity }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#glow)">
      <polygon
        points="16,2 20,12 31,12 22,19 25,30 16,23 7,30 10,19 1,12 12,12"
        fill="url(#blueGradient)"
        stroke="#5ab6ff"
        strokeWidth="1.5"
        opacity="0.95"
      />
    </g>
    <defs>
      <filter id="glow" x="-8" y="-8" width="48" height="48" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="blueGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#b6e0ff" stopOpacity="1" />
        <stop offset="60%" stopColor="#5ab6ff" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#1e90ff" stopOpacity="0.7" />
      </radialGradient>
    </defs>
  </svg>
);

const AnimatedCursor = () => {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [trail, setTrail] = useState([]); // [{x, y, time}]
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    let animationFrame;
    const updateTrail = (e) => {
      const now = Date.now();
      setTrail((prev) =>
        [
          ...prev.filter((p) => now - p.time < TRAIL_FADE_DURATION),
          { x: e.clientX, y: e.clientY, time: now },
        ].slice(-STAR_COUNT)
      );
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    document.addEventListener('mousemove', updateTrail);
    return () => {
      document.removeEventListener('mousemove', updateTrail);
      cancelAnimationFrame(animationFrame);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  if (!isVisible) return null;

  // Render trail stars
  const now = Date.now();
  return (
    <>
      {trail.map((point, idx) => {
        const age = now - point.time;
        const opacity = Math.max(0, 1 - age / TRAIL_FADE_DURATION);
        const size = BASE_STAR_SIZE - idx * 0.3; // Slightly bigger with trail
        return (
          <motion.div
            key={point.time + '-' + idx}
            style={{
              position: 'fixed',
              left: point.x - size / 2,
              top: point.y - size / 2,
              pointerEvents: 'none',
              zIndex: 9999,
              width: size,
              height: size,
              opacity,
              filter: `drop-shadow(0 0 14px #5ab6ff)`,
              transition: 'opacity 0.2s',
            }}
            animate={{ opacity }}
            exit={{ opacity: 0 }}
          >
            <StarSVG opacity={opacity} size={size} />
          </motion.div>
        );
      })}
    </>
  );
};

