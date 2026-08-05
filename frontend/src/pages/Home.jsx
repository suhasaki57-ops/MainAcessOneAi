import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { FiEye, FiCpu, FiFileText, FiGlobe, FiVolume2, FiShield } from 'react-icons/fi';

export const Home = () => {
  return (
    <MainLayout>
      <section className="py-16 text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider"
        >
          <FiShield /> Production Hackathon Foundation
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight"
        >
          Empowering Accessibility with <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-400 max-w-2xl"
        >
          ascess-1-ai combines WCAG compliance scanning, speech interaction, real-time translations, and Google Gemini AI to build an inclusive web for everyone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mt-4"
        >
          <Link to={ROUTES.REGISTER}>
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="secondary" size="lg">Open Dashboard</Button>
          </Link>
        </motion.div>
      </section>

      <section className="py-12 grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl">
            <FiEye />
          </div>
          <h3 className="font-bold text-white text-lg">Accessibility Scanner</h3>
          <p className="text-sm text-slate-400">Automated contrast, ARIA, and readability audits to satisfy WCAG standards.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl">
            <FiCpu />
          </div>
          <h3 className="font-bold text-white text-lg">Gemini AI Engine</h3>
          <p className="text-sm text-slate-400">Integrated generative intelligence for instant fixes, document summaries, and OCR.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl">
            <FiVolume2 />
          </div>
          <h3 className="font-bold text-white text-lg">Speech & Vision</h3>
          <p className="text-sm text-slate-400">Built-in text-to-speech synthesis and voice navigation hooks for maximum inclusivity.</p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
