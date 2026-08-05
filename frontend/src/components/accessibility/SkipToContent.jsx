export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded-xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-400"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
