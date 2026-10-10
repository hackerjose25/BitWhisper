import React, { useState, useEffect } from 'react';
import { 
  Wallet, Github, ExternalLink, Moon, Sun, ArrowRight, 
  MessageSquare, Edit3, ArrowUpRight
} from 'lucide-react';
import ThreeBackground from './ThreeBackground';

const LandingPage = ({ onGetStarted }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const coreFeatures = [
    {
      num: '01',
      title: 'Direct Mesh Routing',
      desc: 'Browser-to-browser SCTP channels over DTLS 1.3. The signaling relay brokers initial discovery only—zero message payloads ever touch an intermediary server.',
      spec: 'RFC 8831 / WebRTC 1.0'
    },
    {
      num: '02',
      title: 'Ephemeral Web Crypto',
      desc: 'Client-side NIST P-256 ECDH derives isolated AES-GCM-256 session keys in volatile RAM. Keys are destroyed on tab close for forward secrecy.',
      spec: 'NIST SP 800-56A / AES-256'
    },
    {
      num: '03',
      title: 'Gasless SIWE Identity',
      desc: 'Sign-In with Ethereum (EIP-4361) verifies keypair ownership via off-chain wallet signatures. Zero gas fees, zero centralized credentials, zero tracking.',
      spec: 'EIP-4361 / SIWE'
    }
  ];

  const techStack = [
    { name: 'JavaScript', style: 'bg-[#F7DF1E] text-slate-950 border-[#E5CE1B]' },
    { name: 'React', style: 'bg-[#20232A] text-[#61DAFB] border-[#61DAFB]/40' },
    { name: 'HTML5', style: 'bg-[#E34F26] text-white border-[#C73E18]' },
    { name: 'CSS3', style: 'bg-[#1572B6] text-white border-[#105E98]' },
    { name: 'Python', style: 'bg-[#3776AB] text-[#FFD43B] border-[#2B5B84]' },
    { name: 'Next.js', style: 'bg-black text-white border-slate-700' },
    { name: 'MongoDB', style: 'bg-[#47A248] text-white border-[#388539]' },
    { name: 'MySQL', style: 'bg-[#00758F] text-[#F29111] border-[#005B70]' },
    { name: 'Blender', style: 'bg-[#EA7600] text-white border-[#C96400]' },
    { name: 'Node.js', style: 'bg-[#339933] text-white border-[#2A802A]' },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 transition-colors duration-200 overflow-x-hidden font-sans flex flex-col justify-between">
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <ThreeBackground theme={theme} />
      </div>

      {/* Subtle radial ambient background */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-radial opacity-90" />

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-slate-800 px-6 lg:px-12 py-3 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-3.5">
              <img 
                src="/logo.png" 
                alt="BitWhisper Logo" 
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0 filter drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]" 
              />
              <div className="flex items-center space-x-2.5">
                <span className="font-extrabold text-2xl tracking-tight text-white">BitWhisper</span>
                <span className="hidden sm:inline-block font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-amber-400 font-bold">
                  FUTUREFORGE
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <a 
                href="https://github.com/hackerjose25/BitWhisper" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-300 hover:text-amber-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-900"
              >
                <Github size={15} />
                <span>Source</span>
                <ArrowUpRight size={13} />
              </a>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer active:translate-y-[1px]"
              >
                {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
              </button>

              {/* Launch CTA */}
              <button
                onClick={onGetStarted}
                className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold px-4 sm:px-5 py-2.5 rounded-md flex items-center space-x-2 text-xs sm:text-sm shadow-sm cursor-pointer transition-colors active:translate-y-[1px]"
              >
                <Wallet size={16} />
                <span>Connect Wallet</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section: Big Typography Hackathon Aesthetic */}
        <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-16 w-full flex flex-col justify-center">
          
          {/* Top Hackathon Banner */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">CodeStorm 2026: FutureForge</span>
              <span className="text-slate-600">/</span>
              <span className="text-amber-400 font-bold">Devfolio</span>
            </div>
          </div>

          {/* Hero Branding: Big Logo with Yellow Text + Giant Headline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
            
            {/* Left: Giant Typography & CTAs */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.96] mb-6">
                ZERO-KNOWLEDGE<br />
                <span className="text-amber-400">P2P MESSAGING.</span>
              </h1>

              <p className="text-lg sm:text-2xl text-slate-300 font-normal leading-relaxed max-w-2xl mb-10">
                Direct browser-to-browser WebRTC DataChannels. Ephemeral NIST P-256 ECDH & AES-GCM-256 keys. Zero intermediate servers. Verified Ethereum identity.
              </p>

              {/* Big Hackathon Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onGetStarted}
                  className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold px-7 sm:px-9 py-4 rounded-lg flex items-center space-x-3 text-base sm:text-lg shadow-lg shadow-amber-500/10 cursor-pointer active:translate-y-[1px] transition-all"
                >
                  <Wallet size={20} />
                  <span>Launch Workspace</span>
                  <ArrowRight size={20} />
                </button>

                <a
                  href="https://github.com/hackerjose25/BitWhisper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-slate-200 border border-slate-800 font-semibold px-6 py-4 rounded-lg flex items-center space-x-2.5 text-base transition-colors active:translate-y-[1px]"
                >
                  <Github size={18} />
                  <span>GitHub Repository</span>
                </a>

                <a
                  href="https://devfolio.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-slate-300 border border-slate-800 font-semibold px-5 py-4 rounded-lg flex items-center space-x-2 text-base transition-colors active:translate-y-[1px]"
                >
                  <ExternalLink size={16} />
                  <span>Devfolio Project</span>
                </a>
              </div>
            </div>

            {/* Right: Large Featured Brand Seal */}
            <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
              <div className="w-56 h-56 sm:w-72 sm:h-72 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shadow-2xl">
                <img 
                  src="/logo.png" 
                  alt="BitWhisper Seal" 
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(251,191,36,0.3)]" 
                />
              </div>
            </div>

          </div>

          {/* Streamlined 3-Column Architecture Matrix (Oversized Clean Cards) */}
          <div className="pt-12 mb-16 border-t border-slate-800/80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coreFeatures.map((feat, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-3xl font-black text-amber-400">
                        {feat.num}
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-semibold">
                        {feat.spec}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2.5">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Developer & GitHub Profile Card (Directly Matching User Profile) */}
          <section className="pt-12 border-t border-slate-800/80">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                  CodeStorm 2026: FutureForge Builder
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  Lead Developer Profile
                </h2>
              </div>
              <a
                href="https://github.com/hackerjose25"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors bg-slate-900 px-3.5 py-2 rounded-md border border-slate-800"
              >
                <Github size={14} />
                <span>github.com/hackerjose25</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* GitHub Profile Card */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Avatar & Personal Info */}
                <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="relative mb-4">
                    <img
                      src="/avatar.png"
                      alt="Jose Regish J"
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-[#30363d] shadow-xl object-cover bg-slate-900"
                    />
                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#161b22] border-2 border-[#30363d] flex items-center justify-center text-slate-300 shadow-md">
                      <MessageSquare size={13} className="fill-slate-300" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Jose Regish J
                  </h3>
                  <p className="text-sm text-slate-400 font-mono mt-0.5">
                    hackerjose25 · he/him
                  </p>
                  <p className="text-sm text-slate-300 mt-2 font-medium">
                    I'm Spiderman !
                  </p>

                  <a
                    href="https://github.com/hackerjose25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] px-4 py-2.5 rounded-md text-xs font-semibold transition-colors"
                  >
                    <Github size={14} />
                    <span>View GitHub Profile</span>
                  </a>
                </div>

                {/* Right: hackerjose25 / README.md Box */}
                <div className="lg:col-span-8 bg-[#161b22] border border-[#30363d] rounded-lg p-5 sm:p-6 flex flex-col justify-between">
                  {/* Readme Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#30363d] text-xs font-mono text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-300 font-semibold">hackerjose25</span>
                      <span>/</span>
                      <span className="text-slate-400">README.md</span>
                    </div>
                    <Edit3 size={13} className="text-slate-500" />
                  </div>

                  {/* Readme Bio */}
                  <div className="space-y-5">
                    <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                      Hi, I am Jose <span className="inline-block">👋</span> A builder who enjoys creating meaningful projects and exploring new ideas.
                    </h4>

                    {/* Tech Stack Badges */}
                    <div>
                      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                        Core Tech Stack
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {techStack.map((tech, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-1 rounded text-xs font-bold border ${tech.style}`}
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Social Buttons */}
                    <div>
                      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                        Connect & Reach Out
                      </p>
                      <div className="flex flex-wrap items-center gap-2 font-mono">
                        <a
                          href="https://discord.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          DISCORD
                        </a>
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded bg-[#E4405F] hover:bg-[#D83653] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          INSTAGRAM
                        </a>
                        <a
                          href="mailto:jose@example.com"
                          className="px-3.5 py-1.5 rounded bg-[#EA4335] hover:bg-[#D93025] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          GMAIL
                        </a>
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded bg-[#0A66C2] hover:bg-[#084E96] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          LINKEDIN
                        </a>
                      </div>
                    </div>

                    {/* Activity Box */}
                    <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-md text-xs font-mono flex items-center space-x-2.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>CodeStorm 2026: FutureForge Submission • BitWhisper P2P Mesh</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </main>

        {/* Clean Hackathon Footer */}
        <footer className="border-t border-slate-800 bg-slate-950 px-6 lg:px-12 py-6 text-xs sm:text-sm text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <img src="/logo.png" alt="BitWhisper" className="w-9 h-9 object-contain filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]" />
              <span className="font-bold text-white text-base">BitWhisper</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-300">CodeStorm 2026: FutureForge Submission</span>
            </div>

            <div className="flex items-center space-x-4">
              <span>Built by <strong className="text-slate-200">Jose Regish J</strong> (<a href="https://github.com/hackerjose25" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">@hackerjose25</a>)</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
