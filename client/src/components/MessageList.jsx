import React, { useEffect, useRef, useState } from 'react';
import { Shield, Pin, Smile, MoreVertical, Copy, Trash2, Search, X, MessageSquare, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';

const MessageList = ({ messages, onPinMessage, onReactToMessage, onDeleteMessage, pinnedMessages = [] }) => {
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [filteredMessages, setFilteredMessages] = useState(messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchQuery, messages]);

  const groupMessagesByUser = (msgs) => {
    const grouped = [];
    let currentGroup = null;

    msgs.forEach((msg) => {
      if (
        currentGroup &&
        currentGroup.sender === msg.sender &&
        currentGroup.senderId === msg.senderId &&
        msg.sender !== 'System'
      ) {
        currentGroup.messages.push(msg);
      } else {
        currentGroup = {
          sender: msg.senderDisplayName || msg.sender,
          senderId: msg.senderId,
          encrypted: msg.encrypted,
          messages: [msg]
        };
        grouped.push(currentGroup);
      }
    });

    return grouped;
  };

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 200),
      y: Math.min(e.clientY, window.innerHeight - 200),
      message
    });
  };

  const handleEmojiClick = (messageId, emojiObject) => {
    onReactToMessage(messageId, emojiObject.emoji);
    setShowEmojiPicker(null);
  };

  const isPinned = (message) => {
    return pinnedMessages.some(pm => pm.id === message.id || pm.text === message.text);
  };

  const groupedMessages = groupMessagesByUser(filteredMessages);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/60 relative flex flex-col">
      {/* Search Bar Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="sticky top-0 z-20 px-4 py-2.5 bg-slate-900/95 backdrop-blur-xl border-b border-white/[0.08]"
          >
            <div className="max-w-2xl mx-auto flex items-center space-x-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search encrypted messages..."
                className="flex-1 bg-slate-800/80 text-white placeholder-slate-400 border border-slate-700/60 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs"
                autoFocus
              />
              {searchQuery && (
                <span className="text-[11px] text-slate-400 font-mono">
                  {filteredMessages.length} match{filteredMessages.length === 1 ? '' : 'es'}
                </span>
              )}
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned Messages Banner */}
      {pinnedMessages.length > 0 && (
        <div className="sticky top-0 z-10 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-xs text-amber-300">
            <Pin size={13} className="text-amber-400 fill-amber-400" />
            <span className="font-semibold">
              {pinnedMessages.length} Pinned Message{pinnedMessages.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
        {groupedMessages.length === 0 ? (
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 select-none">
            <div className="w-10 h-10 rounded-md bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-4">
              <Lock size={18} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">Direct P2P Encrypted Channel</h3>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Messages and files sent here are encrypted via ephemeral ECDH (NIST P-256) and AES-GCM-256. Zero intermediate logging.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {groupedMessages.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="mb-4"
              >
                {/* System Message */}
                {group.sender === 'System' ? (
                  <div className="flex items-center justify-center my-3">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{group.messages[0].text}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3 group/msg">
                    {/* Sender Avatar */}
                    <div className="w-7 h-7 rounded-md bg-amber-500 flex-shrink-0 flex items-center justify-center text-slate-950 font-bold text-xs mt-0.5">
                      {group.sender.charAt(0).toUpperCase()}
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 min-w-0">
                      {/* Meta header */}
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-xs text-slate-200">
                          {group.sender}
                        </span>
                        
                        {group.encrypted && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                            <Shield size={9} className="mr-0.5" />
                            E2E
                          </span>
                        )}
                        
                        <span className="text-[10px] text-slate-500 font-mono">
                          {group.messages[0].timestamp}
                        </span>
                      </div>

                      {/* Bubble items */}
                      <div className="space-y-1.5">
                        {group.messages.map((msg, msgIndex) => (
                          <div
                            key={msgIndex}
                            className="relative group/bubble flex items-start"
                            onContextMenu={(e) => handleContextMenu(e, msg)}
                          >
                            <div
                              className={`relative px-3.5 py-2 rounded-md text-xs sm:text-sm text-slate-100 max-w-xl break-words leading-relaxed ${
                                msg.encrypted
                                  ? 'bg-slate-900 border border-amber-500/25'
                                  : 'bg-slate-900 border border-slate-800'
                              } ${isPinned(msg) ? 'ring-1 ring-amber-400/50' : ''}`}
                            >
                              {isPinned(msg) && (
                                <div className="absolute -top-1.5 -left-1.5 bg-amber-500 text-slate-950 rounded-sm p-0.5">
                                  <Pin size={10} className="fill-slate-950" />
                                </div>
                              )}
                              
                              <p>{msg.text}</p>

                              {/* Reactions Pill List */}
                              {msg.reactions && msg.reactions.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-white/[0.06]">
                                  {msg.reactions.map((reaction, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => onReactToMessage(msg.id, reaction.emoji)}
                                      className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700/80 text-xs hover:border-amber-400/50 transition-colors"
                                    >
                                      <span>{reaction.emoji}</span>
                                      <span className="text-[10px] text-slate-400 font-bold">{reaction.count}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Floating Micro-Actions Toolbar */}
                            <div className="opacity-0 group-hover/bubble:opacity-100 transition-opacity ml-2 flex items-center space-x-0.5 bg-slate-900 border border-white/[0.1] rounded-lg p-0.5 shadow-lg backdrop-blur-md">
                              <button
                                onClick={() => setShowEmojiPicker(msg.id || msgIndex)}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-400 transition-colors"
                                title="Add reaction"
                              >
                                <Smile size={13} />
                              </button>
                              <button
                                onClick={() => onPinMessage(msg)}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-400 transition-colors"
                                title={isPinned(msg) ? "Unpin message" : "Pin message"}
                              >
                                <Pin size={13} className={isPinned(msg) ? 'text-amber-400 fill-amber-400' : ''} />
                              </button>
                              <button
                                onClick={(e) => handleContextMenu(e, msg)}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                                title="More options"
                              >
                                <MoreVertical size={13} />
                              </button>
                            </div>

                            {/* Emoji Picker Popup */}
                            <AnimatePresence>
                              {showEmojiPicker === (msg.id || msgIndex) && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="absolute top-8 left-0 z-40 shadow-2xl"
                                >
                                  <div 
                                    className="fixed inset-0 z-30" 
                                    onClick={() => setShowEmojiPicker(null)} 
                                  />
                                  <div className="relative z-40">
                                    <EmojiPicker
                                      onEmojiClick={(emoji) => handleEmojiClick(msg.id || msgIndex, emoji)}
                                      theme="dark"
                                      width={280}
                                      height={350}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Context Menu Dropdown */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setContextMenu(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                left: contextMenu.x,
                top: contextMenu.y,
                zIndex: 50
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 min-w-[170px] backdrop-blur-xl text-xs"
            >
              <button
                onClick={() => {
                  onPinMessage(contextMenu.message);
                  setContextMenu(null);
                }}
                className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Pin size={14} className="text-amber-400" />
                <span>{isPinned(contextMenu.message) ? 'Unpin' : 'Pin'} Message</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(contextMenu.message.text);
                  setContextMenu(null);
                }}
                className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Copy size={14} className="text-slate-400" />
                <span>Copy Message</span>
              </button>

              <button
                onClick={() => {
                  setShowEmojiPicker(contextMenu.message.id);
                  setContextMenu(null);
                }}
                className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Smile size={14} className="text-amber-400" />
                <span>React with Emoji</span>
              </button>

              {contextMenu.message.senderId === 'self' && (
                <button
                  onClick={() => {
                    onDeleteMessage(contextMenu.message);
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Delete Locally</span>
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />

      {/* Floating Search Toggle Button */}
      {!showSearch && (
        <button
          onClick={() => setShowSearch(true)}
          className="fixed bottom-24 right-8 p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md shadow-lg transition-colors z-10 text-slate-300 hover:text-white cursor-pointer active:translate-y-[1px]"
          title="Search messages (Ctrl+F)"
        >
          <Search size={16} />
        </button>
      )}
    </div>
  );
};

export default MessageList;
