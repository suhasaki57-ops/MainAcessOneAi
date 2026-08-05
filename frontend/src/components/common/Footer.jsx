import { APP_NAME } from '../../constants';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/60 bg-slate-950/80 px-6 py-6 text-center text-sm text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {APP_NAME}. Built for Hackathon production readiness.</p>
        <div className="flex items-center gap-6 text-slate-400 text-xs">
          <span>Accessibility First</span>
          <span>•</span>
          <span>WCAG 2.1 AA Compliant</span>
          <span>•</span>
          <span>Gemini AI Engine</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
