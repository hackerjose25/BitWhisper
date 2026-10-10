import React, { useState, useEffect, useRef } from 'react';
import { Hash, Users, Bell, Pin, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Components
import LandingPage from './components/LandingPage';
import WalletLoginModal from './components/WalletLoginModal';
import ChannelSidebar from './components/ChannelSidebar';
import MessageList from './components/MessageList';
import ChatWindow from './components/ChatWindow';
import FileTransferProgress from './components/FileTransferProgress';

// Utils
import WebRTCManager from './utils/webrtc';
import CryptoUtils from './utils/crypto';
import FileTransferManager from './utils/fileTransfer';
import notificationSounds from './utils/notificationSounds';

const getSignalingServerUrl = () => {
  if (import.meta.env.VITE_WEBSOCKET_URL) {
    return import.meta.env.VITE_WEBSOCKET_URL;
  }
  const hostname = window.location.hostname || 'localhost';
  return `wss://${hostname}:3001`;
};

const SIGNALING_SERVER = getSignalingServerUrl();

const AVAILABLE_ROOMS = [
  { id: 'general', name: 'general', description: 'General peer channel' },
  { id: 'gaming', name: 'gaming', description: 'Low-latency gaming' },
  { id: 'music', name: 'music', description: 'Audio & media streams' },
  { id: 'coding', name: 'coding', description: 'Engineering & architecture' },
  { id: 'random', name: 'random', description: 'Off-topic peer discussions' },
];

function App() {
  // App state
  const [showLanding, setShowLanding] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // User state
  const [walletAddress, setWalletAddress] = useState('');
  const [username, setUsername] = useState('');
  const [signature, setSignature] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState('general');
  const [showDisplayNamePrompt, setShowDisplayNamePrompt] = useState(false);
  
  // Room-specific state
  const [roomStates, setRoomStates] = useState({
    general: { messages: [], roomUsers: [], fileTransfers: [] },
    gaming: { messages: [], roomUsers: [], fileTransfers: [] },
    music: { messages: [], roomUsers: [], fileTransfers: [] },
    coding: { messages: [], roomUsers: [], fileTransfers: [] },
    random: { messages: [], roomUsers: [], fileTransfers: [] },
  });
  
  // Connection state
  const [connectionState, setConnectionState] = useState('disconnected');
  const [isSending, setIsSending] = useState(false);
  
  // New feature states
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [notificationSoundEnabled, setNotificationSoundEnabled] = useState(true);
  
  // Managers
  const [webrtc, setWebrtc] = useState(null);
  const [crypto, setCrypto] = useState(null);
  
  // Refs
  const peerCryptoRef = useRef(new Map());
  const [peerCryptoReady, setPeerCryptoReady] = useState(0);
  const peerUsernamesRef = useRef(new Map());
  const fileManagersRef = useRef(new Map());
  const initializingRef = useRef(false);
  const initializedRef = useRef(false);
  const selfIdRef = useRef(null);
  const displayNameRef = useRef('');
  const currentRoomIdRef = useRef('general');

  // Update refs whenever state changes
  useEffect(() => {
    displayNameRef.current = displayName || username;
  }, [displayName, username]);

  useEffect(() => {
    currentRoomIdRef.current = currentRoomId;
  }, [currentRoomId]);

  // Get current room state
  const currentRoomState = roomStates[currentRoomId] || { messages: [], roomUsers: [], fileTransfers: [] };
  const messages = currentRoomState.messages;
  const roomUsers = currentRoomState.roomUsers;
  const fileTransfers = currentRoomState.fileTransfers;

  // Handle wallet authentication from modal
  const handleWalletAuthenticated = (address, defaultName, sig) => {
    console.log('✅ Wallet authenticated:', address);
    setWalletAddress(address);
    setUsername(defaultName);
    setSignature(sig);
    setShowWalletModal(false);
    setShowLanding(false);
    setShowDisplayNamePrompt(true);
    
    localStorage.setItem('walletAddress', address);
    localStorage.setItem('siweSignature', sig);
  };

  // Handle Get Started button
  const handleGetStarted = () => {
    setShowWalletModal(true);
  };

  // New Feature Handlers
  const handlePinMessage = (message) => {
    setPinnedMessages(prev => {
      const isPinned = prev.some(pm => 
        (pm.text === message.text && pm.timestamp === message.timestamp) || 
        pm.id === message.id
      );
      
      if (isPinned) {
        // Unpin
        return prev.filter(pm => 
          !((pm.text === message.text && pm.timestamp === message.timestamp) || pm.id === message.id)
        );
      } else {
        // Pin
        if (notificationSoundEnabled) {
          notificationSounds.playPinSound();
        }
        return [...prev, { ...message, id: message.id || Date.now() }];
      }
    });
  };

  const handleReactToMessage = async (messageId, emoji) => {
    // Update local state
    setRoomStates(prev => {
      const roomId = currentRoomIdRef.current;
      const currentRoom = prev[roomId] || { messages: [], roomUsers: [], fileTransfers: [] };
      
      const updatedMessages = currentRoom.messages.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            existingReaction.count += 1;
            existingReaction.users = existingReaction.users || [];
            if (!existingReaction.users.includes(displayNameRef.current)) {
              existingReaction.users.push(displayNameRef.current);
            }
          } else {
            reactions.push({ emoji, count: 1, users: [displayNameRef.current] });
          }
          
          if (notificationSoundEnabled) {
            notificationSounds.playReactionSound();
          }
          
          return { ...msg, reactions: [...reactions] };
        }
        return msg;
      });
      
      return {
        ...prev,
        [roomId]: {
          ...currentRoom,
          messages: updatedMessages
        }
      };
    });

    // Send reaction to all peers
    if (webrtc && peerCryptoRef.current.size > 0) {
      const reactionMessage = JSON.stringify({
        type: 'emoji-reaction',
        messageId: messageId,
        emoji: emoji,
        username: displayNameRef.current
      });

      for (const peerId of peerCryptoRef.current.keys()) {
        try {
          webrtc.sendMessageToPeer(peerId, reactionMessage);
        } catch (error) {
          console.error('Failed to send reaction to peer:', error);
        }
      }
    }
  };

  const handleDeleteMessage = (message) => {
    setRoomStates(prev => {
      const roomId = currentRoomIdRef.current;
      const currentRoom = prev[roomId] || { messages: [], roomUsers: [], fileTransfers: [] };
      
      return {
        ...prev,
        [roomId]: {
          ...currentRoom,
          messages: currentRoom.messages.filter(m => m.id !== message.id)
        }
      };
    });
    
    // Also remove from pinned if it was pinned
    setPinnedMessages(prev => prev.filter(pm => pm.id !== message.id));
  };

  const handleToggleSound = () => {
    const newState = !notificationSoundEnabled;
    setNotificationSoundEnabled(newState);
    notificationSounds.setEnabled(newState);
    
    // Play a test sound when enabling
    if (newState) {
      notificationSounds.playMessageSound();
    }
  };

  // Initialize connection when authenticated and displayName is set
  useEffect(() => {
    if (initializedRef.current || initializingRef.current || !walletAddress || !displayName) {
      return;
    }

    initializingRef.current = true;

    const initializeConnection = async () => {
      try {
        setConnectionState('connecting');
        addSystemMessage('🔄 Initializing secure connection...', currentRoomIdRef.current);
        
        const webrtcManager = new WebRTCManager(SIGNALING_SERVER);
        
        webrtcManager.onRoomJoined = async (data) => {
          const roomId = data.roomId || currentRoomIdRef.current;
          addSystemMessage(`✅ Connected to #${roomId}`, roomId);
          
          if (webrtcManager.userId && !selfIdRef.current) {
            selfIdRef.current = webrtcManager.userId;
          }
          
          for (const user of data.users) {
            if (!peerUsernamesRef.current.has(user.userId)) {
              peerUsernamesRef.current.set(user.userId, user.username);
            }
            await initializePeerCrypto(user.userId, webrtcManager, user.username);
            addSystemMessage(`🔐 Connecting to ${user.username}...`, roomId);
            sendKeyExchangeOffer(user.userId, webrtcManager);
          }
          
          setConnectionState('connected');
        };
        
        webrtcManager.onUserJoined = async (data) => {
          if (!peerUsernamesRef.current.has(data.userId)) {
            peerUsernamesRef.current.set(data.userId, data.username);
          }
          
          addSystemMessage(`👋 ${data.username} joined`, currentRoomIdRef.current);
          await initializePeerCrypto(data.userId, webrtcManager, data.username);
          sendKeyExchangeOffer(data.userId, webrtcManager);
        };
        
        webrtcManager.onUserLeft = (data) => {
          const leavingUsername = peerUsernamesRef.current.get(data.userId) || data.username;
          addSystemMessage(`👋 ${leavingUsername} left`, currentRoomIdRef.current);
          
          peerCryptoRef.current.delete(data.userId);
          fileManagersRef.current.delete(data.userId);
          peerUsernamesRef.current.delete(data.userId);
          setPeerCryptoReady(prev => prev + 1);
        };
        
        webrtcManager.onUserListUpdate = (users) => {
          setTimeout(() => {
            setRoomStates(prev => {
              const roomId = currentRoomIdRef.current;
              const currentRoom = prev[roomId] || { messages: [], roomUsers: [], fileTransfers: [] };
              
              const correctedUsers = users.map(serverUser => {
                const storedDisplayName = peerUsernamesRef.current.get(serverUser.userId);
                const finalName = storedDisplayName || serverUser.username;
                
                return {
                  ...serverUser,
                  username: finalName,
                  displayName: finalName
                };
              });

              return {
                ...prev,
                [roomId]: {
                  ...currentRoom,
                  roomUsers: correctedUsers
                }
              };
            });
          }, 200);
        };
        
        webrtcManager.onConnectionStateChange = (peerId, state) => {
          if (state === 'connected') {
            addSystemMessage(`✅ P2P connection established`, currentRoomIdRef.current);
          }
        };
        
        webrtcManager.onDataChannelOpen = (peerId) => {
          setTimeout(() => {
            sendKeyExchange(peerId, webrtcManager);
          }, 100);
  
          const sendDisplayName = () => {
            try {
              const currentName = displayNameRef.current;
              const nameShareMsg = JSON.stringify({
                type: 'display-name-share',
                name: currentName
              });
              
              webrtcManager.sendMessageToPeer(peerId, nameShareMsg);
            } catch (error) {
              console.error('Failed to send display name share:', error);
            }
          };
          
          setTimeout(sendDisplayName, 300);
          setTimeout(sendDisplayName, 600);
          setTimeout(sendDisplayName, 1000);
        };
        
        webrtcManager.onMessage = async (fromId, data) => {
          try {
            const message = JSON.parse(data);
            const peerCryptoInstance = peerCryptoRef.current.get(fromId);
            
            if (message.type === 'key-exchange' || message.type === 'key-exchange-offer') {
              let peerCryptoInstance = peerCryptoRef.current.get(fromId);
              if (!peerCryptoInstance) {
                await initializePeerCrypto(fromId, webrtcManager);
                peerCryptoInstance = peerCryptoRef.current.get(fromId);
              }
              if (peerCryptoInstance) {
                await peerCryptoInstance.deriveSharedKey(message.publicKey);
                addSystemMessage(`✅ Encrypted connection ready`, currentRoomIdRef.current);
                setPeerCryptoReady(prev => prev + 1);

                // If this is an offer, reply with an answer so the other side can also derive the key!
                if (message.type === 'key-exchange-offer') {
                  const myPublicKey = await peerCryptoInstance.exportPublicKey();
                  const answerMsg = JSON.stringify({
                    type: 'key-exchange-answer',
                    publicKey: myPublicKey
                  });
                  webrtcManager.sendMessageToPeer(fromId, answerMsg);
                }
              }
            
            } else if (message.type === 'key-exchange-answer') {
              let peerCryptoInstance = peerCryptoRef.current.get(fromId);
              if (!peerCryptoInstance) {
                await initializePeerCrypto(fromId, webrtcManager);
                peerCryptoInstance = peerCryptoRef.current.get(fromId);
              }
              if (peerCryptoInstance && !peerCryptoInstance.sharedKey) {
                await peerCryptoInstance.deriveSharedKey(message.publicKey);
                addSystemMessage(`✅ Encrypted connection ready`, currentRoomIdRef.current);
                setPeerCryptoReady(prev => prev + 1);
              }
            
            } else if (message.type === 'display-name-share') {
              const newName = message.name;
              const userId = fromId;

              if (newName) {
                peerUsernamesRef.current.set(userId, newName);
                
                setRoomStates(prev => {
                  const updated = {};
                  for (const [roomId, room] of Object.entries(prev)) {
                    const updatedUsers = (room.roomUsers || []).map(u => {
                      if (u.userId === userId) {
                        return { ...u, username: newName, displayName: newName };
                      }
                      return u;
                    });
                    
                    const updatedMessages = (room.messages || []).map(msg =>
                      msg.senderId === userId
                        ? { ...msg, sender: newName, senderDisplayName: newName }
                        : msg
                    );
                    
                    updated[roomId] = {
                      ...room,
                      roomUsers: updatedUsers,
                      messages: updatedMessages
                    };
                  }
                  return updated;
                });
                
                setPeerCryptoReady(prev => prev + 1);
              }
  
            } else if (message.type === 'encrypted-message') {
              if (peerCryptoInstance && peerCryptoInstance.sharedKey) {
                try {
                  const decrypted = await peerCryptoInstance.decrypt(message.data);
                  const senderUsername = peerUsernamesRef.current.get(fromId) || 'Unknown';
                  
                  // Use the shared message ID from the sender
                  const messageId = message.messageId || `${fromId}-${Date.now()}`;
                  
                  addMessageWithId(messageId, senderUsername, decrypted, true, currentRoomIdRef.current, senderUsername, fromId);
                } catch (decryptError) {
                  console.error('❌ Decryption failed:', decryptError);
                  addSystemMessage('❌ Failed to decrypt message', currentRoomIdRef.current);
                }
              }
            
            } else if (message.type === 'emoji-reaction') {
              // Handle incoming emoji reaction from peer
              const { messageId, emoji, username } = message;
              
              setRoomStates(prev => {
                const roomId = currentRoomIdRef.current;
                const currentRoom = prev[roomId] || { messages: [], roomUsers: [], fileTransfers: [] };
                
                const updatedMessages = currentRoom.messages.map(msg => {
                  if (msg.id === messageId) {
                    const reactions = msg.reactions || [];
                    const existingReaction = reactions.find(r => r.emoji === emoji);
                    
                    if (existingReaction) {
                      existingReaction.count += 1;
                      existingReaction.users = existingReaction.users || [];
                      if (!existingReaction.users.includes(username)) {
                        existingReaction.users.push(username);
                      }
                    } else {
                      reactions.push({ emoji, count: 1, users: [username] });
                    }
                    
                    if (notificationSoundEnabled) {
                      notificationSounds.playReactionSound();
                    }
                    
                    return { ...msg, reactions: [...reactions] };
                  }
                  return msg;
                });
                
                return {
                  ...prev,
                  [roomId]: {
                    ...currentRoom,
                    messages: updatedMessages
                  }
                };
              });
            
            } else if (message.type === 'encrypted-file-metadata') {
              const fileManager = fileManagersRef.current.get(fromId);
              if (peerCryptoInstance && peerCryptoInstance.sharedKey && fileManager) {
                try {
                  const decrypted = await peerCryptoInstance.decrypt(message.data);
                  const metadata = JSON.parse(decrypted);
                  fileManager.handleFileMetadata(metadata);
                  
                  const senderUsername = peerUsernamesRef.current.get(fromId) || 'Unknown';
                  addSystemMessage(`📥 Receiving: ${metadata.fileName} from ${senderUsername}`, currentRoomIdRef.current);
                } catch (decryptError) {
                  console.error('❌ Failed to process file metadata:', decryptError);
                }
              }
            } else if (message.type === 'encrypted-file-chunk') {
              const fileManager = fileManagersRef.current.get(fromId);
              if (peerCryptoInstance && peerCryptoInstance.sharedKey && fileManager) {
                try {
                  const decrypted = await peerCryptoInstance.decrypt(message.data);
                  const chunkData = JSON.parse(decrypted);
                  await fileManager.handleFileChunk(chunkData);
                } catch (error) {
                  console.error('❌ Failed to process file chunk:', error);
                }
              }
            }
          } catch (error) {
            console.error('❌ Error handling message:', error);
          }
        };
        
        webrtcManager.onError = (error) => {
          addSystemMessage(`❌ Error: ${error}`, currentRoomIdRef.current);
        };
        
        const cryptoUtils = new CryptoUtils();
        await cryptoUtils.generateKeyPair();
        setCrypto(cryptoUtils);
        addSystemMessage('🔐 Encryption keys generated', currentRoomIdRef.current);
        
        addSystemMessage('🌐 Connecting to server...', currentRoomIdRef.current);
        await webrtcManager.connectToSignalingServer();
        addSystemMessage('✅ Connected to server', currentRoomIdRef.current);
        
        webrtcManager.join(displayNameRef.current, currentRoomIdRef.current);
        
        setWebrtc(webrtcManager);
        initializedRef.current = true;
        initializingRef.current = false;
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error('Connection error:', error);
        setConnectionState('disconnected');
        initializingRef.current = false;
        addSystemMessage('❌ Failed to connect: '.concat(error.message), currentRoomIdRef.current);
      }
    };

    initializeConnection();
    
    return () => {
      if (webrtc) {
        webrtc.close();
      }
    };
  }, [walletAddress, displayName]);

  const handleRoomSwitch = async (newRoomId) => {
    if (newRoomId === currentRoomId || !webrtc) return;
    
    webrtc.leaveRoom();
    
    peerCryptoRef.current.clear();
    peerUsernamesRef.current.clear();
    fileManagersRef.current.clear();
    
    setCurrentRoomId(newRoomId);
    setPeerCryptoReady(0);
    setPinnedMessages([]);
    
    webrtc.join(displayNameRef.current, newRoomId);
    
    addSystemMessage(`🔄 Switched to #${newRoomId}`, newRoomId);
  };

  const initializePeerCrypto = async (peerId, webrtcManager, username = null) => {
    if (username) {
      if (!peerUsernamesRef.current.has(peerId)) {
        peerUsernamesRef.current.set(peerId, username);
      }
    }
    
    const peerCryptoInstance = new CryptoUtils();
    await peerCryptoInstance.generateKeyPair();
    peerCryptoRef.current.set(peerId, peerCryptoInstance);
    
    const fileManager = new FileTransferManager(peerCryptoInstance, {
      sendMessage: (msg) => {
        return webrtcManager.sendMessageToPeer(peerId, msg);
      }
    });
    
    fileManager.onProgress = (progress) => {
      setRoomStates(prev => {
        const roomId = currentRoomIdRef.current;
        const currentRoom = prev[roomId] || { messages: [], roomUsers: [], fileTransfers: [] };
        const updatedTransfers = [...currentRoom.fileTransfers.filter(t => t.fileId !== progress.fileId), progress];
        
        return {
          ...prev,
          [roomId]: {
            ...currentRoom,
            fileTransfers: updatedTransfers
          }
        };
      });
    };
    
    fileManager.onFileReceived = (fileData) => {
      if (fileData.verified) {
        addSystemMessage(`✅ File verified: ${fileData.fileName}`, currentRoomIdRef.current);
        
        setRoomStates(prev => {
          const roomId = currentRoomIdRef.current;
          const currentRoom = prev[roomId] || { messages: [], roomUsers: [], fileTransfers: [] };
          const updatedTransfers = currentRoom.fileTransfers.map(t =>
            t.fileId === fileData.fileId
              ? { 
                  ...t, 
                  verified: true, 
                  blob: fileData.blob,
                  progress: 100,
                  onDownload: () => fileManager.downloadFile(fileData.fileName, fileData.blob)
                }
              : t
          );
          
          return {
            ...prev,
            [roomId]: {
              ...currentRoom,
              fileTransfers: updatedTransfers
            }
          };
        });
      } else {
        addSystemMessage(`❌ File integrity failed: ${fileData.fileName}`, currentRoomIdRef.current);
      }
    };
    
    fileManagersRef.current.set(peerId, fileManager);
    setPeerCryptoReady(prev => prev + 1);
  };

  const sendKeyExchangeOffer = async (peerId, webrtcManager) => {
    let peerCryptoInstance = peerCryptoRef.current.get(peerId);
    if (!peerCryptoInstance) return;
    
    const publicKey = await peerCryptoInstance.exportPublicKey();
    const keyExchangeMsg = JSON.stringify({
      type: 'key-exchange-offer',
      publicKey: publicKey
    });
    
    webrtcManager.sendMessageToPeer(peerId, keyExchangeMsg);
  };

  const sendKeyExchange = async (peerId, webrtcManager) => {
    return sendKeyExchangeOffer(peerId, webrtcManager);
  };

  const handleSendMessage = async (text) => {
    if (!webrtc || peerCryptoRef.current.size === 0) {
      addSystemMessage('❌ No peers connected', currentRoomIdRef.current);
      return;
    }
    
    try {
      setIsSending(true);
      
      // Create a shared message ID that all peers will use
      const sharedMessageId = `${selfIdRef.current}-${Date.now()}`;
      
      let sentCount = 0;
      
      for (const [peerId, peerCryptoInstance] of peerCryptoRef.current.entries()) {
        if (peerCryptoInstance.sharedKey) {
          try {
            const encrypted = await peerCryptoInstance.encrypt(text);
            
            const messageObj = {
              type: 'encrypted-message',
              data: encrypted,
              messageId: sharedMessageId,
              timestamp: new Date().getTime()
            };
            
            const sent = webrtc.sendMessageToPeer(peerId, JSON.stringify(messageObj));
            if (sent) sentCount++;
          } catch (error) {
            console.error(`❌ Failed to encrypt/send to ${peerId}:`, error);
          }
        } else {
          // If keys are not derived yet, trigger key exchange offer
          sendKeyExchangeOffer(peerId, webrtc);
        }
      }

      if (sentCount === 0 && peerCryptoRef.current.size > 0) {
        addSystemMessage('⏳ Encrypted channel initializing. Please resend message now.', currentRoomIdRef.current);
      }
      
      const selfId = selfIdRef.current;
      const currentDisplayName = displayNameRef.current;
      const roomId = currentRoomIdRef.current;
      
      addMessageWithId(sharedMessageId, currentDisplayName, text, true, roomId, currentDisplayName, selfId);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      addSystemMessage('❌ Failed to send message', currentRoomIdRef.current);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (fileManagersRef.current.size === 0) {
      addSystemMessage('❌ No peers connected', currentRoomIdRef.current);
      return;
    }
    
    addSystemMessage(`📤 Sending: ${file.name} (${formatFileSize(file.size)})`, currentRoomIdRef.current);
    
    try {
      let sentCount = 0;
      
      for (const [peerId, fileManager] of fileManagersRef.current.entries()) {
        const peerCrypto = peerCryptoRef.current.get(peerId);
        
        if (peerCrypto && peerCrypto.sharedKey) {
          try {
            await fileManager.sendFile(file, (progress) => {
              // Progress callback
            });
            sentCount++;
          } catch (error) {
            console.error(`❌ Failed to send file to ${peerId}:`, error);
          }
        }
      }
      
      if (sentCount > 0) {
        addSystemMessage(`✅ File sent to ${sentCount} peer(s): ${file.name}`, currentRoomIdRef.current);
      } else {
        addSystemMessage(`❌ Failed to send file: No peers ready`, currentRoomIdRef.current);
      }
    } catch (error) {
      console.error('❌ Error sending file:', error);
      addSystemMessage(`❌ Failed to send file: ${error.message}`, currentRoomIdRef.current);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const addMessageWithId = (messageId, sender, text, encrypted = false, roomId, senderDisplayName, senderId = null) => {
    const newMessage = {
      id: messageId,
      sender,
      text,
      encrypted,
      senderDisplayName,
      senderId,
      reactions: [],
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
    
    // Play notification sound for incoming messages (not from self or system)
    if (senderId !== selfIdRef.current && senderId !== 'system' && notificationSoundEnabled) {
      notificationSounds.playMessageSound();
    }
    
    setRoomStates(prev => {
      const currentRoom = prev[roomId] || { messages: [], roomUsers: [], fileTransfers: [] };
      return {
        ...prev,
        [roomId]: {
          ...currentRoom,
          messages: [...currentRoom.messages, newMessage]
        }
      };
    });
  };

  const addMessage = (sender, text, encrypted = false, roomId, senderDisplayName, senderId = null) => {
    const messageId = `${senderId || 'system'}-${Date.now()}`;
    addMessageWithId(messageId, sender, text, encrypted, roomId, senderDisplayName, senderId);
  };

  const addSystemMessage = (text, roomId) => {
    addMessage('System', text, false, roomId, 'System', 'system');
  };

  // Display name prompt UI
  if (showDisplayNamePrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-7 shadow-2xl">
          <div className="text-center mb-6">
            <img 
              src="/logo.png" 
              alt="BitWhisper Logo" 
              className="w-16 h-16 object-contain mx-auto mb-3 filter drop-shadow-[0_4px_16px_rgba(251,191,36,0.3)]" 
            />
            <h1 className="text-xl font-bold text-white tracking-tight">Configure Peer Alias</h1>
            <p className="text-xs text-slate-400 mt-1">Specify an identifier for direct WebRTC data exchange</p>
          </div>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            const trimmedName = displayName.trim();
            if (trimmedName) {
              setDisplayName(trimmedName);
              setShowDisplayNamePrompt(false);
            }
          }}>
            <div className="mb-5">
              <label className="block text-slate-300 text-xs font-medium mb-1.5">
                Peer Handle
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. node_alpha"
                maxLength={24}
                className="w-full bg-slate-950 border border-slate-700 text-white placeholder-slate-500 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-mono"
                required
                autoFocus
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-semibold py-2.5 rounded-md transition-all active:translate-y-[1px] cursor-pointer text-sm"
            >
              Enter Peer Mesh
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show landing page
  if (showLanding) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <AnimatePresence>
          {showWalletModal && (
            <WalletLoginModal 
              onAuthenticated={handleWalletAuthenticated}
              onClose={() => setShowWalletModal(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Show chat interface (authenticated)
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <ChannelSidebar 
        connectionState={connectionState}
        isEncrypted={peerCryptoRef.current.size > 0}
        roomUsers={roomUsers}
        currentUsername={displayName || username}
        currentRoom={currentRoomId}
        availableRooms={AVAILABLE_ROOMS}
        onRoomSwitch={handleRoomSwitch}
        onLeaveRoom={() => {
          localStorage.removeItem('walletAddress');
          localStorage.removeItem('siweSignature');
          window.location.reload();
        }}
        soundEnabled={notificationSoundEnabled}
        onToggleSound={handleToggleSound}
      />
      
      <div className="flex-1 flex flex-col bg-slate-950 min-w-0">
        {/* Top Channel Bar */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Hash size={16} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold text-sm tracking-tight capitalize">{currentRoomId}</span>
                <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{roomUsers.length + 1} online</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
              CodeStorm 2026: FutureForge
            </span>
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-mono text-slate-300">
                {displayName ? displayName : `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
              </span>
            </div>
          </div>
        </div>
        
        <MessageList 
          messages={messages}
          onPinMessage={handlePinMessage}
          onReactToMessage={handleReactToMessage}
          onDeleteMessage={handleDeleteMessage}
          pinnedMessages={pinnedMessages}
        />
        
        {fileTransfers.length > 0 && (
          <div className="px-4 max-h-48 overflow-y-auto custom-scrollbar bg-slate-950/80">
            {fileTransfers.map((transfer, index) => (
              <FileTransferProgress key={index} transfer={transfer} />
            ))}
          </div>
        )}
        
        <ChatWindow 
          onSendMessage={handleSendMessage}
          onFileSelect={handleFileSelect}
          isConnected={peerCryptoRef.current.size > 0}
          isSending={isSending}
        />
      </div>
    </div>
  );
}

export default App;
