import React, { useState, useRef } from 'react';
import { Send, Paperclip, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatWindow = ({ onSendMessage, onFileSelect, isConnected, isSending }) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && isConnected && !isSending) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      e.target.value = '';
    }
  };

  return (
    <div className="p-4 bg-slate-950/90 border-t border-white/[0.08] backdrop-blur-md">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* Disconnected Notice */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2.5 px-3.5 py-2 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center justify-between text-xs text-amber-300"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Waiting for peers to join this room to establish WebRTC ECDH mesh.</span>
            </div>
            <span className="font-mono text-[10px] text-amber-400/80">Room Ready</span>
          </motion.div>
        )}

        {/* Input Bar */}
        <div className="relative flex items-center space-x-2 bg-slate-900 p-1.5 rounded-md border border-slate-800 shadow-sm focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-colors">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={handleFileClick}
            disabled={!isConnected}
            title={isConnected ? "Attach file (16KB chunked + SHA-256)" : "Connect to peers first"}
            className="w-9 h-9 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer active:translate-y-[1px]"
          >
            <Paperclip size={16} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Text Input */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isConnected ? "Type an encrypted message..." : "Waiting for active peer in room..."}
              disabled={!isConnected || isSending}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm py-1.5 px-2 focus:outline-none disabled:cursor-not-allowed"
            />
          </div>

          {/* Encryption Indicator */}
          {isConnected && (
            <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20">
              <Lock size={10} />
              <span>AES-256</span>
            </div>
          )}

          {/* Send Action */}
          <button
            type="submit"
            disabled={!message.trim() || !isConnected || isSending}
            className="w-9 h-9 rounded-md bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold flex items-center justify-center transition-colors cursor-pointer active:translate-y-[1px]"
          >
            {isSending ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>

        {/* Status Line */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-2 font-medium">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Direct P2P DataChannel • Zero intermediate server storage</span>
          </div>
          <span className="hidden sm:inline-block font-mono text-slate-400">Press Enter ↵</span>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
