export const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const glassHover = {
  hover: {
    scale: 1.02,
    boxShadow: '0 12px 40px 0 rgba(0, 132, 199, 0.2)',
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
};
