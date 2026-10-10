import React, { useState } from 'react';
import { 
  Hash, ChevronDown, ChevronRight, LogOut, Shield, 
  Volume2, VolumeX, Radio, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChannelSidebar = ({
  connectionState,
  isEncrypted,
  roomUsers,
  currentUsername,
  currentRoom,
  availableRooms,
  onRoomSwitch,
  onLeaveRoom,
  soundEnabled,
  onToggleSound
}) => {
  const [showChannels, setShowChannels] = useState(true);
  const [showMembers, setShowMembers] = useState(true);

  return (
    <div className="w-64 bg-slate-950 flex flex-col border-r border-white/[0.08] select-none h-full">
      {/* App Workspace Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.08] bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <img 
            src="/logo.png" 
            alt="BitWhisper Logo" 
            className="w-10 h-10 object-contain filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]" 
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white text-sm tracking-tight">BitWhisper</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-amber-400/90 font-medium tracking-wide">CodeStorm 2026</span>
          </div>
        </div>
      </div>

      {/* Mesh Connection Indicator */}
      <div className="p-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${
              connectionState === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
            }`} />
            <span className="font-medium text-slate-300">
              {connectionState === 'connected' ? 'Mesh Connected' : 'Connecting...'}
            </span>
          </div>
          {isEncrypted && (
            <div className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Lock size={10} className="mr-1" />
              E2EE
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-2 space-y-4">
        {/* Rooms Section */}
        <div>
          <div
            className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors"
            onClick={() => setShowChannels(!showChannels)}
          >
            <div className="flex items-center space-x-1">
              {showChannels ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              <span>Channels</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.2 rounded border border-white/[0.05]">
              {availableRooms.length}
            </span>
          </div>

          <AnimatePresence>
            {showChannels && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 space-y-0.5"
              >
                {availableRooms.map((room) => {
                  const isActive = currentRoom === room.id;
                  return (
                    <button
                      key={room.id}
                      onClick={() => onRoomSwitch(room.id)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                        isActive
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <Hash size={14} className={isActive ? 'text-amber-400' : 'text-slate-500'} />
                      <span className="flex-1 truncate">{room.name}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Room Peers Section */}
        <div>
          <div
            className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors"
            onClick={() => setShowMembers(!showMembers)}
          >
            <div className="flex items-center space-x-1">
              {showMembers ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              <span>Room Peers</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
              {roomUsers.length + 1} online
            </span>
          </div>

          <AnimatePresence>
            {showMembers && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 space-y-1"
              >
                {/* Current User */}
                <div className="flex items-center space-x-2.5 px-3 py-2 rounded-md bg-slate-900 border border-slate-800">
                  <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 text-xs font-bold">
                    {currentUsername.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-amber-400 truncate">
                      {currentUsername}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Local Node</div>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>

                {/* Other Peers in Room */}
                {roomUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-md bg-slate-950 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
                      {(user.displayName || user.username).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-300 truncate">
                        {user.displayName || user.username}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">P2P Peer</div>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* User Profile & Actions Footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center justify-between px-2.5 py-2 rounded-md bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                {currentUsername.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{currentUsername}</p>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Node Active</span>
                </p>
              </div>
            </div>

          <div className="flex items-center space-x-1">
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title={soundEnabled ? "Mute audio cues" : "Unmute audio cues"}
            >
              {soundEnabled ? (
                <Volume2 size={15} />
              ) : (
                <VolumeX size={15} className="text-red-400" />
              )}
            </button>

            {/* Logout / Disconnect */}
            <button
              onClick={onLeaveRoom}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              title="Disconnect Wallet & Leave"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebar;
