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
                  CodeStorm 2026: FutureForge Solo Builder
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  Lead Developer Profile
                </h2>
              </div>
              <a
                href="https://github.com/hackerjose25"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto inline-flex items-center space-x-1.5 text-xs font-mono text-slate-300 hover:text-white transition-colors bg-slate-900 px-3.5 py-2 rounded-md border border-slate-800 hover:border-slate-700"
              >
                <Github size={14} />
                <span>github.com/hackerjose25</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* GitHub Profile Card */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Avatar & Personal Info (Clean GitHub Profile) */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="relative mb-4 group">
                    <img
                      src="/avatar.png"
                      alt="Jose Regish J"
                      className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-[#30363d] shadow-2xl object-cover bg-slate-900 ring-4 ring-red-500/10 group-hover:ring-red-500/30 transition-all duration-300"
                    />
                    <div 
                      title="I'm Spiderman !"
                      className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#161b22] border-2 border-[#30363d] flex items-center justify-center text-slate-300 shadow-lg cursor-pointer hover:border-slate-400 transition-colors"
                    >
                      <MessageSquare size={14} className="fill-slate-300 text-slate-300" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Jose Regish J
                  </h3>
                  <p className="text-sm text-slate-400 font-mono mt-0.5">
                    <span className="text-slate-300 font-semibold">hackerjose25</span> · he/him
                  </p>
                  
                  {/* Status bubble */}
                  <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-200">
                    <span>🕷️</span>
                    <span className="font-medium italic">"I'm Spiderman !"</span>
                  </div>

                  {/* Visit Interactive Portfolio */}
                  <div className="mt-6 w-full">
                    <a
                      href="https://jose-portfolio-pi.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-950/60 to-slate-900 hover:from-cyan-900/60 hover:to-slate-800 text-cyan-300 border border-cyan-800/60 px-4 py-2.5 rounded-md text-xs font-semibold transition-all shadow-sm"
                    >
                      <ExternalLink size={14} />
                      <span>Visit Interactive Portfolio</span>
                    </a>
                  </div>

                  {/* Multiverse Tech Arsenal Cards (Moved to Left Column as per arrow) */}
                  <div className="mt-5 w-full space-y-3">
                    {/* Web3 Core */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-cyan-300 font-mono flex items-center space-x-1.5 mb-2.5 pb-2 border-b border-[#30363d]">
                          <span>🔗</span>
                          <span>Web3 &amp; Blockchain Core</span>
                        </div>
                        {/* Row 1: 4 icons */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <a href="https://soliditylang.org/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/solidity.svg" width="36" height="36" alt="Solidity" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://ethereum.org/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/ethereum.svg" width="36" height="36" alt="Ethereum" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://web3js.readthedocs.io/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/web3js.svg" width="36" height="36" alt="Web3.js" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://ipfs.tech/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/ipfs.svg" width="36" height="36" alt="IPFS" className="hover:scale-110 transition-transform" />
                          </a>
                        </div>
                        {/* Row 2: 2 icons */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <a href="https://hardhat.org/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/hardhat.svg" width="36" height="36" alt="Hardhat" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/metamask.svg" width="36" height="36" alt="MetaMask" className="hover:scale-110 transition-transform" />
                          </a>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono text-center pt-2 border-t border-[#30363d]/60">
                        Solidity • Smart Contracts • EVM • DApps • DeFi
                      </div>
                    </div>

                    {/* Frontend */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-amber-300 font-mono flex items-center space-x-1.5 mb-2.5 pb-2 border-b border-[#30363d]">
                          <span>⚡</span>
                          <span>Full-Stack Frontend</span>
                        </div>
                        {/* Row 1: 4 icons */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/react.svg" width="36" height="36" alt="React" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/nextjs.svg" width="36" height="36" alt="Next.js" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/typescript.svg" width="36" height="36" alt="TypeScript" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/javascript.svg" width="36" height="36" alt="JavaScript" className="hover:scale-110 transition-transform" />
                          </a>
                        </div>
                        {/* Row 2: 2 icons */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/tailwind.svg" width="36" height="36" alt="Tailwind" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/vite.svg" width="36" height="36" alt="Vite" className="hover:scale-110 transition-transform" />
                          </a>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono text-center pt-2 border-t border-[#30363d]/60">
                        React.js • Next.js • TypeScript • Tailwind • Vite
                      </div>
                    </div>

                    {/* Backend */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-red-400 font-mono flex items-center space-x-1.5 mb-2.5 pb-2 border-b border-[#30363d]">
                          <span>🛠️</span>
                          <span>Backend, DB &amp; Tools</span>
                        </div>
                        {/* Row 1: 4 icons */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/nodejs.svg" width="36" height="36" alt="Node.js" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/express.svg" width="36" height="36" alt="Express" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://www.python.org/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/python.svg" width="36" height="36" alt="Python" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/mongodb.svg" width="36" height="36" alt="MongoDB" className="hover:scale-110 transition-transform" />
                          </a>
                        </div>
                        {/* Row 2: 2 icons */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <a href="https://www.mysql.com/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/mysql.svg" width="36" height="36" alt="MySQL" className="hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://www.blender.org/" target="_blank" rel="noopener noreferrer">
                            <img src="/icons/blender.svg" width="36" height="36" alt="Blender" className="hover:scale-110 transition-transform" />
                          </a>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono text-center pt-2 border-t border-[#30363d]/60">
                        Node.js • Express • Python • MongoDB • MySQL
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: hackerjose25 / README.md Box */}
                <div className="lg:col-span-8 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl flex flex-col">
                  {/* Readme Header */}
                  <div className="bg-[#0d1117] border-b border-[#30363d] px-4 py-3 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <span className="font-semibold text-slate-100">hackerjose25</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-300 font-medium">README.md</span>
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">main</span>
                    </div>
                    <a 
                      href="https://github.com/hackerjose25"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Edit on GitHub"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit3 size={13} />
                    </a>
                  </div>

                  {/* Readme Body Content */}
                  <div className="p-4 sm:p-6 space-y-6 bg-[#0d1117]/50">
                    {/* 1. Spider-Man Profile Header Artwork */}
                    <div className="rounded-xl overflow-hidden border border-[#30363d] shadow-xl bg-black">
                      <img
                        src="/spider-header.svg"
                        alt="Jose Regish J — Spider-Man Themed Profile Header"
                        className="w-full h-auto block select-none"
                      />
                    </div>

                    {/* 2. Spider Cyber Divider */}
                    <div className="py-0.5">
                      <img src="/spider-divider.svg" alt="Divider" className="w-full h-auto block opacity-90 select-none" />
                    </div>

                    {/* 3. Typing SVG Animation Banner */}
                    <div className="flex justify-center py-1 overflow-x-auto">
                      <img
                        src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=16&duration=3000&pause=1000&color=00F0FF&center=true&vCenter=true&multiline=true&width=750&height=50&lines=%F0%9F%95%B7%EF%B8%8F+FULL-STACK+ENGINEER+%26+WEB3+%2F+BLOCKCHAIN+ARCHITECT;Building+Scalable+DApps%2C+Solidity+Smart+Contracts+%26+Modern+Web+Apps;29+Public+Repositories+%E2%80%A2+Loyola-ICAM+College+of+Engg+(LICET)"
                        alt="Typing SVG"
                        className="max-w-full h-auto"
                      />
                    </div>

                    {/* 4. Bio Paragraph */}
                    <div className="text-left bg-[#161b22]/70 border border-[#30363d] rounded-lg p-4 sm:p-5">
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                        Hi there! I'm <strong className="text-white font-bold">Jose Regish J</strong> (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded text-xs font-mono">@hackerjose25</code>) — a passionate <strong className="text-white">Full-Stack Developer</strong> and <strong className="text-white">Web3 / Blockchain Engineer</strong> studying at <strong className="text-white">Loyola-ICAM College of Engineering and Technology (LICET)</strong>, Chennai. Like Spider-Man swinging through the city, I build robust, high-performance web applications, architect decentralized protocols with <strong className="text-white">Solidity &amp; Smart Contracts</strong>, and secure digital infrastructures with razor-sharp <strong className="text-red-400">Spider-Sense</strong>.
                      </p>
                    </div>

                    {/* 5. Spider Cyber Divider */}
                    <div className="py-0.5">
                      <img src="/spider-divider.svg" alt="Divider" className="w-full h-auto block opacity-90 select-none" />
                    </div>

                    {/* 6. Spider-Net Communique // Connect with Jose (Moved Up into the gap as per arrow) */}
                    <div>
                      <div className="text-center mb-3.5">
                        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center justify-center gap-2">
                          <span>🕷️</span>
                          <span>SPIDER-NET COMMUNIQUE // CONNECT WITH JOSE</span>
                        </h4>
                        <p className="text-xs text-slate-400 italic mt-0.5 font-mono">
                          "Building decentralized protocols, full-stack systems, or looking for an impactful engineer? Let's connect!"
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                        <a href="https://github.com/hackerjose25" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                          <img src="https://img.shields.io/badge/GitHub-hackerjose25-0d1117?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
                        </a>
                        <a href="https://jose-portfolio-pi.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                          <img src="https://img.shields.io/badge/Portfolio-Visit_Site-00f0ff?style=for-the-badge&logo=vercel&logoColor=black" alt="Portfolio" />
                        </a>
                        <a href="https://www.linkedin.com/in/jose-regish-9b7196350/" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                          <img src="https://img.shields.io/badge/LinkedIn-Jose_Regish-0077b5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
                        </a>
                        <a href="https://discord.com/users/1232590985096331319" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                          <img src="https://img.shields.io/badge/Discord-Connect-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" />
                        </a>
                        <a href="https://www.instagram.com/itzz.jose_25/" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                          <img src="https://img.shields.io/badge/Instagram-@itzz.jose__25-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
                        </a>
                        <a href="mailto:joseregish25@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                          <img src="https://img.shields.io/badge/Gmail-Contact_Me-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
                        </a>
                        <a href="https://open.spotify.com/user/317hew6gxt3kuesq7rrng254viym" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                          <img src="https://img.shields.io/badge/Spotify-Follow-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify" />
                        </a>
                      </div>
                    </div>

                    {/* 7. Spider-Footer Artwork */}
                    <div className="rounded-xl overflow-hidden border border-[#30363d] shadow-xl bg-black">
                      <img
                        src="/spider-footer.svg"
                        alt="Spider-Man Multiverse Profile Footer"
                        className="w-full h-auto block select-none"
                      />
                    </div>

                    {/* Active Hackathon Submission Stamp */}
                    <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-md text-xs font-mono flex items-center justify-between text-emerald-400">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>CodeStorm 2026: FutureForge Submission • BitWhisper P2P Mesh</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">Solidity &amp; WebRTC</span>
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
