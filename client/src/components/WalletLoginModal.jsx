import React, { useState, useEffect } from 'react';
import { Wallet, Shield, AlertCircle, Loader, ExternalLink, X, Lock, Zap, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WalletAuth from '../utils/walletAuth';

const WalletLoginModal = ({ onAuthenticated, onClose }) => {
  const [walletAuth] = useState(() => new WalletAuth());
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('connect'); // connect, sign, authenticated

  useEffect(() => {
    if (!walletAuth.isMetaMaskInstalled()) {
      setError('MetaMask or EVM Web3 wallet is required');
    }

    walletAuth.onAccountsChanged((newAddress) => {
      if (newAddress === null) {
        setAddress('');
        setStep('connect');
        setError('Wallet disconnected. Reconnect to continue.');
      } else {
        setAddress(newAddress);
        setStep('sign');
        setError('Account changed. Please sign SIWE challenge.');
      }
    });

    walletAuth.onChainChanged((chainId) => {
      console.log('Chain changed to:', chainId);
    });
  }, [walletAuth]);

  const handleConnectWallet = async () => {
    setLoading(true);
    setError('');

    try {
      const connectedAddress = await walletAuth.connectWallet();
      setAddress(connectedAddress);
      setStep('sign');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { message, signature, address: walletAddress } = await walletAuth.signInWithEthereum();
      const isValid = await walletAuth.verifySignature(message, signature);
      
      if (isValid) {
        console.log('✅ SIWE authentication successful');
        setStep('authenticated');
        const username = walletAuth.shortenAddress(walletAddress);
        onAuthenticated(walletAddress, username, signature);
      } else {
        setError('Signature verification failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    walletAuth.disconnect();
    setAddress('');
    setStep('connect');
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md relative"
        >
          {/* Modal Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden font-sans">
            {/* Top Accent Line */}
            <div className="h-0.5 bg-amber-500" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10 p-1.5 rounded-md hover:bg-slate-800"
            >
              <X size={18} />
            </button>

            <div className="p-7">
              {/* Header */}
              <div className="text-center mb-6">
                <img 
                  src="/logo.png" 
                  alt="BitWhisper Logo" 
                  className="w-20 h-20 object-contain mx-auto mb-3 filter drop-shadow-[0_4px_16px_rgba(251,191,36,0.3)]" 
                />
                
                <h2 className="text-xl font-bold text-white tracking-tight mb-1">Connect Node to BitWhisper</h2>
                <p className="text-xs text-slate-400 font-mono">Sign-In with Ethereum (EIP-4361)</p>
              </div>

              {/* Error Notice */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-md flex items-start space-x-2.5 text-xs text-red-300"
                  >
                    <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step: Connect Wallet */}
              {step === 'connect' && (
                <div className="space-y-4">
                  {!walletAuth.isMetaMaskInstalled() ? (
                    <div className="text-center py-2 space-y-3">
                      <p className="text-xs text-slate-400">
                        An EVM Web3 wallet (such as MetaMask) is required to authenticate your node.
                      </p>
                      <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-2.5 px-5 rounded-md text-xs transition-colors"
                      >
                        <span>Install MetaMask</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleConnectWallet}
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 text-slate-950 font-semibold py-2.5 px-5 rounded-md transition-all active:translate-y-[1px] flex items-center justify-center space-x-2 cursor-pointer text-xs sm:text-sm"
                      >
                        {loading ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            <span>Connecting Wallet...</span>
                          </>
                        ) : (
                          <>
                            <Wallet size={16} />
                            <span>Connect MetaMask</span>
                          </>
                        )}
                      </button>

                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                        <div className="p-2.5 rounded-md bg-slate-950 border border-slate-800 text-center">
                          <p className="text-slate-400">EIP-4361 Protocol</p>
                        </div>
                        <div className="p-2.5 rounded-md bg-slate-950 border border-slate-800 text-center">
                          <p className="text-emerald-400">Gasless Signature</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step: Sign Message */}
              {step === 'sign' && address && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-950 rounded-md border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Wallet Address</p>
                    <p className="text-amber-400 font-mono text-xs break-all">
                      {address}
                    </p>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-slate-300">
                    <p className="font-semibold text-white mb-0.5">SIWE Signature Required</p>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Sign an off-chain challenge in your wallet to verify node key ownership without fees.
                    </p>
                  </div>

                  <button
                    onClick={handleSignIn}
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 text-slate-950 font-semibold py-2.5 px-5 rounded-md transition-all active:translate-y-[1px] flex items-center justify-center space-x-2 cursor-pointer text-xs sm:text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        <span>Awaiting Signature...</span>
                      </>
                    ) : (
                      <>
                        <Shield size={16} />
                        <span>Sign Challenge & Join Mesh</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDisconnect}
                    className="w-full py-1 text-slate-500 hover:text-slate-300 text-xs transition-colors cursor-pointer"
                  >
                    Switch wallet
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-3.5 bg-slate-950 border-t border-white/[0.06] text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center space-x-1.5">
                <CheckCircle size={12} className="text-emerald-400" />
                <span>EIP-4361 compliant • Signatures validated client-side</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WalletLoginModal;
