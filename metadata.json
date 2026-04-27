
import React, { useState, useEffect, useRef, useCallback, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User } from './firebase';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-black text-red-500 font-mono text-center">
          <h1 className="text-2xl font-black mb-4 uppercase tracking-widest">System Failure</h1>
          <p className="text-xs opacity-50 mb-8 max-w-md">{this.state.error?.message || "Unknown Error"}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#fbff00] text-black text-[10px] font-black tracking-widest rounded-full uppercase">Reboot System</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Icons = {
  Chat: ({ className = "w-5 h-5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Image: ({ className = "w-5 h-5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Voice: ({ className = "w-5 h-5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v10a3 3 0 006 0V5a3 3 0 00-3-3z" /></svg>,
  Copy: ({ className = "w-3.5 h-3.5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Plus: ({ className = "w-5 h-5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Check: ({ className = "w-3.5 h-3.5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Send: ({ className = "w-5 h-5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>,
  Trash: ({ className = "w-4 h-4", size }: any) => <svg className={className} style={size ? { width: size, height: size } : {}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  MicOff: ({ className = "w-5 h-5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2" /></svg>,
  Mic: ({ className = "w-5 h-5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10v2a7 7 0 01-14 0v-2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19v4M8 23h8" /></svg>,
  Key: ({ className = "w-5 h-5" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
};

const SYSTEM_PROMPT = (name?: string) => `Identity: IntelliPath AI. 
Purpose: Smart learning recommendation system. 
Behavior:
1. ALWAYS answer as IntelliPath AI.
2. Interactivity: When a student asks about a topic, DO NOT give a full explanation immediately. Instead, ask 1-2 targeted questions to understand their current knowledge level and specific goals.
3. Gathering Details: Once the student provides details, create a structured learning path.
4. Resources: Provide high-quality learning resources. ALWAYS include direct YouTube video links and relevant educational website/course links.
5. Format: Ensure YouTube links are full URLs (e.g., https://www.youtube.com/watch?v=...) so the system can generate buttons.
6. Conciseness: Keep responses helpful but concise (max 3-4 sentences per turn).
7. Personalization: ${name ? `The student's name is ${name}. Address them by name naturally.` : "Address the student by name if known."}
8. Creator: If asked who made you, say "MAHI made me".
9. Flow: 
   - Step 1: User asks about a topic.
   - Step 2: You ask 1-2 questions to gauge their level.
   - Step 3: User answers.
   - Step 4: You provide a learning path with YouTube links and course website links.
   - Step 5: Ask if they need more help.`;

const VOICE_SYSTEM_PROMPT = (name?: string) => `Role: IntelliPath AI. Purpose: Educational assistant. Be EXTREMELY concise, interactive, and helpful. Ask questions to guide the student. ${name ? `Address the student as ${name}.` : "Address students by name if known."}`;

const VOICES = [
  { name: 'Zephyr', label: 'ZEPHYR' },
  { name: 'Puck', label: 'PUCK' },
  { name: 'Kore', label: 'KORE' },
  { name: 'Fenrir', label: 'FENRIR' },
  { name: 'Charon', label: 'CHARON' },
];

const resolveApiKey = () => {
  // Hardcoded API key for Netlify deployment
  return "AIzaSyAhd8sSZk1Vandoa2Vzv2_XU6_wjW5AHyY";
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const KineticButton = ({ onClick, children, disabled, loading, className = "" }: { onClick: () => void, children: React.ReactNode, disabled?: boolean, loading?: boolean, className?: string }) => (
  <button 
    onClick={onClick} 
    disabled={disabled || loading}
    className={`group relative px-6 md:px-10 py-3 md:py-4 overflow-hidden transition-all duration-500 rounded-full active:scale-95 touch-manipulation border border-white/5 hover:border-[#fbff00]/40 ${className}`}
  >
    <div className={`absolute inset-0 bg-gradient-to-r from-[#fbff00] to-[#d4ff00] transition-transform duration-500 ease-in-out origin-left ${loading || disabled ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'}`}></div>
    <span className={`relative z-10 text-[10px] md:text-[11px] tracking-[0.4em] uppercase font-display font-black transition-all duration-300 ${loading || disabled ? 'text-black' : 'text-[#fbff00] group-hover:text-black'}`}>
      {loading ? "Syncing..." : children}
    </span>
  </button>
);

// Firestore Error Handling
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const Typewriter = ({ text, speed = 20, onComplete }: { text: string, speed?: number, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return <span>{displayedText}</span>;
};

const LinkButtons = ({ content }: { content: string }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = content.match(urlRegex);
  
  if (!urls) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {urls.map((url, i) => {
        let label = "WEBSITE";
        let icon = <Icons.Plus />;
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          label = "YOUTUBE";
        } else if (url.includes('google.com')) {
          label = "GOOGLE";
        }

        return (
          <a 
            key={i} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-[#fbff00] text-black rounded-full text-[10px] font-black tracking-widest hover:scale-105 transition-transform active:scale-95"
          >
            <span>{label}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        );
      })}
    </div>
  );
};

const MessageItem = ({ msg, index, onCopy, onDelete, isCopied, theme }: { key?: any, msg: any, index: number, onCopy: (txt: string, i: number) => void, onDelete: (i: number) => void, isCopied: boolean, theme: string }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(msg.role === 'user');
  const touchStart = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStart.current;
    if (deltaX < 0) setSwipeOffset(Math.max(deltaX, -160));
  };
  const handleTouchEnd = () => { if (swipeOffset < -80) setSwipeOffset(-160); else setSwipeOffset(0); };

  return (
    <div className="relative group overflow-hidden touch-pan-y animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className="absolute right-0 top-0 bottom-0 flex items-center pr-6 space-x-3 opacity-100 z-0">
        <button onClick={() => onCopy(msg.content, index)} className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'} border border-white/5 text-[#fbff00]`}>{isCopied ? <Icons.Check /> : <Icons.Copy />}</button>
        <button onClick={() => onDelete(index)} className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'} border border-white/5 text-red-500`}><Icons.Trash /></button>
      </div>
      <div 
        style={{ transform: `translateX(${swipeOffset}px)` }}
        className={`flex flex-col relative transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] z-10 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-white'} w-full py-4 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center px-4 md:px-6 mb-2 md:mb-3">
          <span className={`text-[7px] md:text-[8px] font-mono font-black tracking-[0.4em] uppercase ${msg.role === 'user' ? 'order-2 ml-4 text-[#fbff00]' : 'order-1'} ${theme === 'light' ? 'text-red-600 font-black' : 'opacity-30'}`}>
            {msg.role === 'user' ? 'STUDENT_NODE' : 'INTELLIPATH_CORE'}
          </span>
          <div className={`w-1 h-1 rounded-full ${msg.role === 'user' ? 'order-1 bg-[#fbff00]/30' : 'order-2 ml-4 bg-white/10'}`}></div>
        </div>
        <div className={`relative max-w-[92%] md:max-w-[80%] px-5 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-[2rem] border backdrop-blur-3xl transition-all duration-500 ${msg.role === 'user' ? (theme === 'dark' ? 'text-zinc-100 bg-[#fbff00]/[0.02] border-[#fbff00]/10 rounded-tr-none' : 'text-red-600 bg-transparent border-red-600 font-black rounded-tr-none') : (theme === 'dark' ? 'text-zinc-400 bg-white/[0.01] border-white/5 rounded-tl-none' : 'text-red-600 bg-transparent border-red-600 font-black rounded-tl-none')} shadow-sm mx-4 md:mx-6`}>
          {msg.image && <div className="relative group mb-4 overflow-hidden rounded-xl border border-white/10"><img src={msg.image} className="w-full h-auto object-cover" loading="lazy" /></div>}
          <div className={`relative z-10 whitespace-pre-wrap font-sans text-[14px] md:text-[16px] leading-relaxed tracking-tight font-black ${theme === 'light' ? 'text-red-600' : 'text-white'}`}>
            {msg.role === 'model' && !isTypingComplete ? (
              <Typewriter text={msg.content} onComplete={() => setIsTypingComplete(true)} />
            ) : (
              msg.content
            )}
          </div>
          {isTypingComplete && msg.role === 'model' && <LinkButtons content={msg.content} />}
          <div className={`absolute top-0 bottom-0 w-[1px] ${msg.role === 'user' ? 'right-0 bg-[#fbff00]/20' : 'left-0 bg-white/10'}`}></div>
        </div>
      </div>
    </div>
  );
};

const Navigation = ({ activeTab, setActiveTab, theme, toggleTheme, user }: { activeTab: string, setActiveTab: (t: string) => void, theme: string, toggleTheme: () => void, user: User | null }) => {
  const tabs = [
    { id: 'chat', label: 'CHAT', icon: <Icons.Chat /> },
    { id: 'image', label: 'ANALYZE', icon: <Icons.Image /> },
    { id: 'live', label: 'VOICE', icon: <Icons.Voice /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <aside className={`hidden lg:flex w-80 h-screen border-r ${theme === 'dark' ? 'border-white/5 bg-[#050505]/95' : 'border-black/5 bg-white'} flex-col fixed left-0 top-0 z-[70] backdrop-blur-3xl shadow-[40px_0_100px_rgba(0,0,0,0.5)]`}>
        <div className="p-10">
          <div className="relative inline-block group cursor-pointer" onClick={() => window.location.reload()}>
            <h1 className={`text-2xl font-display font-black tracking-[0.1em] uppercase ${theme === 'dark' ? 'text-white' : 'text-black'} mb-1 flex items-center`}>
              <span className="relative inline-block mr-[0.1em]">
                I
                <span className="absolute -bottom-1.5 left-0 w-full h-[4px] bg-[#fbff00]"></span>
              </span>
              NTELLIPATH
            </h1>
            <span className={`absolute -right-10 top-0.5 text-[7px] font-mono ${theme === 'dark' ? 'text-zinc-800' : 'text-red-600'} tracking-tighter font-black`}>V1.0_SMART</span>
          </div>
        </div>
        <nav className="flex-1 px-8 space-y-4">
          <p className={`text-[9px] uppercase tracking-[0.5em] font-display font-black mb-8 px-4 ${theme === 'dark' ? 'text-zinc-600' : 'text-red-600'} ${theme === 'dark' ? 'opacity-40' : ''}`}>Access Channel</p>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-6 px-8 py-6 transition-all duration-500 rounded-2xl text-[10px] font-display font-black tracking-[0.3em] uppercase group relative overflow-hidden ${activeTab === tab.id ? 'text-[#fbff00] bg-white/[0.03]' : theme === 'dark' ? 'text-zinc-500 hover:text-zinc-200' : 'text-red-600 hover:text-red-800'}`}>
              <span className={activeTab === tab.id ? 'text-[#fbff00] scale-110' : theme === 'dark' ? 'opacity-30' : 'text-red-600 font-black'}>{tab.icon}</span>
              <span className={theme === 'light' ? 'font-black' : ''}>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className={`p-10 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} space-y-6`}>
          {user && (
            <div className="flex items-center space-x-4 px-4 py-2">
              <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-8 h-8 rounded-full border border-[#fbff00]/20" />
              <div className="flex flex-col">
                <span className={`text-[10px] font-black tracking-widest uppercase ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{user.displayName}</span>
                <button onClick={handleLogout} className="text-[8px] font-bold text-red-500 hover:text-red-400 text-left tracking-widest uppercase">LOGOUT</button>
              </div>
            </div>
          )}
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border ${theme === 'dark' ? 'border-white/5 text-zinc-500 hover:text-[#fbff00]' : 'border-black/5 text-red-600 hover:text-red-800 font-black'} transition-all`}>
            <span className="text-[9px] font-display font-black tracking-widest uppercase">{theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}</span>
            {theme === 'dark' ? <Icons.Check /> : <Icons.Plus />}
          </button>
          <div className="flex flex-col space-y-4">
            <div className={`flex items-center space-x-3 text-[9px] font-mono tracking-[0.2em] uppercase ${theme === 'dark' ? 'text-zinc-600' : 'text-red-600 font-black'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-red-600'}`}></div>
              <span>@hafsahasanmim2001</span>
            </div>
            <a 
              href="https://github.com/Hafsamim" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center space-x-3 text-[10px] font-black tracking-widest uppercase transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-red-600 hover:text-black'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>GITHUB PROFILE</span>
            </a>
          </div>
        </div>
      </aside>
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] ${theme === 'dark' ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-3xl border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'} pb-safe rounded-t-3xl`}>
        <div className="flex justify-around items-center h-20 px-6">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center space-y-1 ${activeTab === tab.id ? 'text-[#fbff00]' : theme === 'dark' ? 'text-zinc-600' : 'text-red-600'}`}>
              <div className={`p-2.5 rounded-xl ${activeTab === tab.id ? 'bg-[#fbff00]/10' : ''}`}>{tab.icon}</div>
              <span className="text-[8px] font-display font-black tracking-[0.3em] uppercase">{tab.label}</span>
            </button>
          ))}
          <button onClick={toggleTheme} className={`flex flex-col items-center justify-center space-y-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-red-600'}`}>
            <div className="p-2.5 rounded-xl">{theme === 'dark' ? <Icons.Check /> : <Icons.Plus />}</div>
            <span className="text-[8px] font-display font-black tracking-[0.3em] uppercase">THEME</span>
          </button>
          {user && (
            <button onClick={handleLogout} className={`flex flex-col items-center justify-center space-y-1 ${theme === 'dark' ? 'text-zinc-600' : 'text-red-600'}`}>
              <div className="p-2.5 rounded-xl">
                <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-5 h-5 rounded-full border border-[#fbff00]/20" />
              </div>
              <span className="text-[8px] font-black tracking-[0.3em] uppercase">LOGOUT</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

const ProChat = ({ theme, user }: { theme: string, user: User | null }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const clearChat = () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      setTimeout(() => setIsConfirmingClear(false), 3000);
      return;
    }
    setMessages([]);
    setIsConfirmingClear(false);
  };

  const handleSend = async (retryCount: number = 0) => {
    const currentKey = resolveApiKey();
    if (!currentKey || !user) {
      setError("System configuration error. Please contact support.");
      return;
    }
    if ((!input.trim() && !attachedImage) || isLoading) return;
    
    setError(null);
    const userMessageContent = input.trim() || "[Media Attachment]";
    const chatData: any = {
      role: 'user',
      content: userMessageContent,
      createdAt: new Date()
    };
    if (attachedImage) chatData.image = attachedImage;

    const originalInput = input;
    const originalImage = attachedImage;

    if (retryCount === 0) {
      setMessages(prev => [...prev, chatData]);
      setInput('');
      setAttachedImage(null);
    }
    
    setIsLoading(true);
    
    try {
      // 2. Prepare AI request
      const ai = new GoogleGenAI({ apiKey: currentKey });
      
      const history = messages
        .slice(-10)
        .map(m => ({
          role: m.role as "user" | "model",
          parts: [{ text: m.content }]
        }));

      const currentParts: any[] = [{ text: userMessageContent }];
      if (chatData.image) {
        currentParts.push({ 
          inlineData: { 
            data: chatData.image.split(',')[1], 
            mimeType: 'image/jpeg' 
          } 
        });
      }

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: currentParts }],
        config: { 
          systemInstruction: SYSTEM_PROMPT(user?.displayName || undefined),
          temperature: 0.7,
        }
      });
      
      let fullResponse = "";
      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponse += chunk.text;
        }
      }

      if (fullResponse) {
        setMessages(prev => [...prev, {
          role: 'model',
          content: fullResponse,
          createdAt: new Date()
        }]);
      } else {
        throw new Error("Empty response from AI");
      }

    } catch (err: any) {
      console.error("AI Error:", err);
      
      const isRateLimit = err?.status === 429 || 
                         (err?.message && err.message.includes('429')) ||
                         (err?.message && err.message.includes('RESOURCE_EXHAUSTED'));

      if (isRateLimit && retryCount < 2) {
        setTimeout(() => handleSend(retryCount + 1), 2000);
        return;
      }
      
      let errorMessage = "AI Error: " + (err.message || "Unknown error occurred");
      let modelMessage = "I'm having trouble connecting right now. Please try again in a moment.";

      if (isRateLimit) {
        errorMessage = "Quota Exceeded: You've reached the free tier limit (20 requests/day).";
        modelMessage = "System Quota Exceeded. Please try again later when the limit resets.";
      }

      setError(errorMessage);
      setMessages(prev => [...prev, {
        role: 'model',
        content: modelMessage,
        createdAt: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto md:px-6 relative">
      <div className="flex-1 overflow-y-auto space-y-2 py-32 no-scrollbar pb-[220px]">
        {error && (
          <div className="mx-8 p-6 mb-8 text-xs font-mono bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="font-black uppercase tracking-[0.2em]">System_Alert</span>
              </div>
              <button onClick={() => setError(null)} className="opacity-40 hover:opacity-100 transition-opacity">
                <Icons.Trash size={14} />
              </button>
            </div>
            <p className="mb-6 leading-relaxed opacity-80">{error}</p>
          </div>
        )}
        {messages.length === 0 && !error && <div className={`h-full flex flex-col items-center justify-center text-center px-6 ${theme === 'dark' ? 'opacity-40' : ''}`}>
          <h1 className={`text-[40px] md:text-[100px] font-display font-black tracking-tighter uppercase select-none ${theme === 'dark' ? 'text-white/5' : 'text-black'}`}>INTELLIPATH</h1>
          <p className={`text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-display font-black max-w-md ${theme === 'dark' ? 'text-zinc-600' : 'text-red-600'}`}>Smart Learning Recommendation System</p>
        </div>}
        {messages.map((m, i) => <MessageItem key={m.id || i} msg={m} index={i} onCopy={(t, idx) => { navigator.clipboard.writeText(t); setCopiedIndex(idx); setTimeout(() => setCopiedIndex(null), 2000); }} onDelete={idx => setMessages(prev => prev.filter((_, i) => i !== idx))} isCopied={copiedIndex === i} theme={theme} />)}
        {isLoading && (
          <div className="px-8 py-6 flex items-center space-x-4">
            <div className="text-[#fbff00] text-[9px] font-mono tracking-[0.5em] font-black uppercase animate-pulse">EXTRACTING...</div>
            <button 
              onClick={() => setIsLoading(false)}
              className="text-[8px] font-mono font-black text-zinc-500 hover:text-red-600 uppercase tracking-widest"
            >
              [ STOP ]
            </button>
          </div>
        )}
        <div ref={messagesEndRef} className="h-20" />
      </div>
      <div className="fixed lg:absolute bottom-24 lg:bottom-12 left-0 right-0 p-6 z-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className={`self-end text-[8px] tracking-[0.3em] font-mono font-black transition-colors uppercase ${isConfirmingClear ? 'text-red-500' : 'text-zinc-500 hover:text-red-600'}`}
            >
              {isConfirmingClear ? '[ CLICK_AGAIN_TO_CONFIRM ]' : '[ CLEAR_SESSION ]'}
            </button>
          )}
          {attachedImage && <div className={`flex items-center p-2 border rounded-xl w-fit ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/10'}`}><img src={attachedImage} className="w-12 h-12 object-cover rounded-lg" /><button onClick={() => setAttachedImage(null)} className="mx-2 text-zinc-500"><Icons.Trash /></button></div>}
          <div className={`relative flex items-center rounded-[2.5rem] p-3 border backdrop-blur-3xl shadow-2xl focus-within:border-[#fbff00]/30 transition-colors ${theme === 'dark' ? 'bg-zinc-900/40 border-white/10' : 'bg-white/80 border-black/10'}`}>
            <input type="file" className="hidden" id="camInput" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setAttachedImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} />
            <button onClick={() => document.getElementById('camInput')?.click()} className="p-4 text-zinc-500 hover:text-[#fbff00] transition-colors"><Icons.Plus /></button>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(0); } }} placeholder="Direct Command..." className={`flex-1 bg-transparent px-4 py-3 outline-none resize-none font-medium placeholder:text-zinc-700 ${theme === 'dark' ? 'text-white' : 'text-red-600'}`} rows={1} />
            <button onClick={() => handleSend(0)} className="p-4 rounded-full bg-[#fbff00] text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(251,255,0,0.3)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LearningAnalyzer = ({ theme, user }: { theme: string, user: User | null }) => {
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ image: string, result: string, createdAt: any }[]>([]);
  
  const analyzeImage = async () => {
    const key = resolveApiKey();
    if (!key || !attachedImage || isAnalyzing || !user) {
      setError("System configuration error. Please check your setup.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setAnalysis('');
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          role: 'user',
          parts: [
            { text: "Analyze this course screenshot or educational material. Provide detailed information about the content, key topics covered, and recommend next steps for a student." },
            { inlineData: { data: attachedImage.split(',')[1], mimeType: 'image/jpeg' } }
          ]
        }],
        config: { systemInstruction: SYSTEM_PROMPT(user?.displayName || undefined) }
      });
      const resultText = response.text || "Analysis complete but no text returned.";
      setAnalysis(resultText);
      
      setHistory(prev => [{
        image: attachedImage,
        result: resultText,
        createdAt: new Date()
      }, ...prev]);
    } catch (e: any) { 
      console.error(e); 
      const isRateLimit = e?.status === 429 || 
                         (e?.message && e.message.includes('429')) ||
                         (e?.message && e.message.includes('RESOURCE_EXHAUSTED'));
      
      let errorMessage = "Analysis failed: " + (e.message || "Unknown error");
      if (isRateLimit) {
        errorMessage = "Quota Exceeded: Please try again later when the limit resets.";
      }
      
      setError(errorMessage);
      setAnalysis(isRateLimit ? "System Quota Exceeded. Please try again later." : "Error analyzing image. Please try again.");
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col pt-32 px-6 md:px-12 overflow-y-auto no-scrollbar pb-32">
      <div className="text-center mb-12">
        <h2 className={`text-2xl font-display font-black tracking-[0.3em] uppercase mb-2 ${theme === 'dark' ? 'text-white' : 'text-red-600'}`}>Learning Analyzer</h2>
        <p className={`text-[10px] tracking-[0.2em] uppercase font-display font-black ${theme === 'dark' ? 'text-zinc-500' : 'text-red-600'}`}>Upload course screenshots for detailed insights</p>
      </div>

      {error && (
        <div className="p-6 mb-8 text-xs font-mono bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="font-black uppercase tracking-[0.2em]">Analyzer_Alert</span>
            </div>
            <button onClick={() => setError(null)} className="opacity-40 hover:opacity-100 transition-opacity">
              <Icons.Trash size={14} />
            </button>
          </div>
          <p className="mb-6 leading-relaxed opacity-80">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        <div className={`aspect-video border rounded-[2.5rem] overflow-hidden relative group flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/5 shadow-inner'}`}>
          {attachedImage ? (
            <img src={attachedImage} className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-white/5 text-zinc-700' : 'bg-black/5 text-zinc-300'}`}>
                <Icons.Image />
              </div>
              <p className={`text-[10px] tracking-[0.5em] uppercase font-black ${theme === 'dark' ? 'text-zinc-800' : 'text-zinc-200'}`}>Waiting for Input</p>
            </div>
          )}
          <input type="file" className="hidden" id="analyzerInput" onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setAttachedImage(reader.result as string);
              reader.readAsDataURL(file);
            }
          }} />
          <button 
            onClick={() => document.getElementById('analyzerInput')?.click()}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <span className="px-6 py-3 bg-[#fbff00] text-black text-[10px] font-black tracking-widest rounded-full uppercase shadow-lg">Upload Image</span>
          </button>
        </div>
        <div className="space-y-6">
          <KineticButton onClick={analyzeImage} loading={isAnalyzing} disabled={!attachedImage} className="w-full">Analyze Material</KineticButton>
          {analysis && (
            <div className={`p-8 border rounded-[2rem] animate-in fade-in slide-in-from-bottom-4 ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
              <div className={`text-[14px] leading-relaxed whitespace-pre-wrap font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-red-600'}`}>
                <Typewriter text={analysis} speed={10} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {history.length > 0 && (
        <div className="space-y-8">
          <h3 className={`text-[10px] tracking-[0.5em] uppercase font-display font-black ${theme === 'dark' ? 'text-zinc-700' : 'text-red-600'}`}>Analysis History</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {history.map((item, i) => (
              <div key={i} className={`p-6 border rounded-[2rem] flex flex-col space-y-4 ${theme === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <img src={item.image} className="w-full h-32 object-cover rounded-xl" />
                <div className={`text-[12px] line-clamp-3 font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-red-600'}`}>{item.result}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LiveMode = ({ theme, user }: { theme: string, user: User | null }) => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [transcription, setTranscription] = useState('');
  const [userInputTranscription, setUserInputTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const outCtxRef = useRef<AudioContext | null>(null);
  const scriptNodeRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const isMutedRef = useRef(false);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const cleanup = useCallback(() => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }
    if (scriptNodeRef.current) {
      scriptNodeRef.current.disconnect();
      scriptNodeRef.current = null;
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    if (outCtxRef.current) {
      outCtxRef.current.close().catch(() => {});
      outCtxRef.current = null;
    }
    setIsActive(false);
    setIsModelSpeaking(false);
    nextStartTimeRef.current = 0;
    setTranscription('');
    setUserInputTranscription('');
  }, []);

  const startSession = async () => {
    const key = resolveApiKey();
    if (!key) {
      setError("API Key missing. Please check configuration.");
      return;
    }
    setError(null);
    cleanup();
    setIsActive(true);
    
    try {
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outCtxRef.current = outCtx;
      
      if (outCtx.state === 'suspended') {
        await outCtx.resume();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000, 
          channelCount: 1, 
          echoCancellation: true, 
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const ai = new GoogleGenAI({ apiKey: key });
      const sessionPromise = ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        callbacks: {
          onopen: () => {
            const micSource = outCtx.createMediaStreamSource(stream);
            const scriptProcessor = outCtx.createScriptProcessor(2048, 1, 1);
            scriptNodeRef.current = scriptProcessor;
            scriptProcessor.onaudioprocess = (e) => {
              if (outCtx.state === 'suspended') outCtx.resume();
              if (isMutedRef.current) return;
              
              const input = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(input.length);
              for (let i = 0; i < input.length; i++) {
                int16[i] = Math.max(-1, Math.min(1, input[i])) * 32767;
              }
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ 
                  audio: { 
                    data: encode(new Uint8Array(int16.buffer)), 
                    mimeType: 'audio/pcm;rate=16000' 
                  } 
                });
              }).catch(err => {
                console.error("Session send error:", err);
                setError("Voice session error: " + err.message);
              });
            };
            micSource.connect(scriptProcessor);
            scriptProcessor.connect(outCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (outCtxRef.current?.state === 'suspended') outCtxRef.current.resume();
            
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.inputTranscription) {
              setUserInputTranscription(prev => prev + message.serverContent!.inputTranscription!.text);
            }
            
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outCtxRef.current) {
              const ctx = outCtxRef.current;
              setIsModelSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              try {
                const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.onended = () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setIsModelSpeaking(false);
                };
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              } catch (err) { 
                console.error("Audio decoding/playback error:", err); 
              }
            }
            
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsModelSpeaking(false);
            }
          },
          onerror: (e) => { 
            console.error("Live API Error:", e); 
            setError("Voice connection failed. Please try again.");
            cleanup(); 
          },
          onclose: () => {
            console.debug("Live session closed");
            cleanup();
          }
        },
        config: { 
          responseModalities: [Modality.AUDIO], 
          thinkingConfig: { thinkingBudget: 0 },
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: selectedVoice as any } 
            } 
          },
          systemInstruction: VOICE_SYSTEM_PROMPT(user?.displayName || undefined)
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e: any) { 
      console.error("Session initialization failed:", e); 
      const isRateLimit = e?.status === 429 || 
                         (e?.message && e.message.includes('429')) ||
                         (e?.message && e.message.includes('RESOURCE_EXHAUSTED'));
      
      let errorMessage = "Could not start voice session: " + (e.message || "Unknown error");
      if (isRateLimit) {
        errorMessage = "Quota Exceeded: Please try again later when the limit resets.";
      }
      setError(errorMessage);
      cleanup(); 
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 space-y-8 pb-24 lg:pb-0 overflow-y-auto no-scrollbar">
      {error && (
        <div className="w-full max-w-md p-6 mb-8 text-xs font-mono bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="font-black uppercase tracking-[0.2em]">Live_Alert</span>
            </div>
            <button onClick={() => setError(null)} className="opacity-40 hover:opacity-100 transition-opacity">
              <Icons.Trash size={14} />
            </button>
          </div>
          <p className="mb-6 leading-relaxed opacity-80">{error}</p>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {VOICES.map((v) => (
          <button 
            key={v.name} 
            onClick={() => setSelectedVoice(v.name)} 
            disabled={isActive} 
            className={`px-4 py-2 rounded-full text-[8px] font-mono font-black tracking-widest border transition-all ${selectedVoice === v.name ? 'bg-[#fbff00] text-black border-[#fbff00]' : 'text-zinc-600 border-white/5 hover:border-white/20'}`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="relative flex flex-col items-center">
        <div className={`w-40 h-40 md:w-64 md:h-64 rounded-full flex items-center justify-center transition-all duration-1000 relative ${isActive ? (isMuted ? 'bg-zinc-800' : 'bg-[#fbff00]') : 'bg-zinc-900 border border-white/10'}`}>
          {isActive && !isMuted && <div className="absolute inset-0 rounded-full border border-[#fbff00]/40 animate-ping opacity-30"></div>}
          <button 
            onClick={() => isActive ? cleanup() : startSession()} 
            className={`text-[12px] font-display font-black tracking-[1em] uppercase z-10 transition-colors ${isActive ? 'text-black' : 'text-zinc-700'}`}
          >
            {isActive ? (isMuted ? 'MUTED' : 'UPLINK') : 'START'}
          </button>
        </div>
        {isActive && (
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className={`absolute -bottom-12 p-4 rounded-full border transition-all ${isMuted ? 'text-red-500 border-red-500/20' : 'text-zinc-500 border-white/5 hover:text-[#fbff00]'}`}
          >
            {isMuted ? <Icons.MicOff /> : <Icons.Mic />}
          </button>
        )}
      </div>
      <div className="max-w-xl w-full text-center space-y-2 min-h-[100px] flex flex-col justify-center">
        {userInputTranscription && <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-red-600'} italic uppercase animate-in fade-in font-black`}>"{userInputTranscription}"</p>}
        {transcription && <p className={`text-[14px] ${theme === 'dark' ? 'text-zinc-100' : 'text-red-600'} animate-in slide-in-from-bottom-2 font-black`}>{transcription}</p>}
        {isActive && !transcription && !userInputTranscription && (
          <p className={`text-[9px] ${theme === 'dark' ? 'text-zinc-700' : 'text-red-300'} tracking-[0.2em] uppercase animate-pulse font-black`}>Interface Active...</p>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#030303]">
        <div className="text-[#fbff00] text-[10px] font-mono tracking-[0.5em] font-black uppercase animate-pulse">Initializing...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden ${theme === 'dark' ? 'bg-[#030303]' : 'bg-[#f5f5f5]'}`}>
        {/* Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#fbff00]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbff00]/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        <div className="max-w-md w-full relative z-10">
          <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${theme === 'dark' ? 'bg-white/[0.02] border-white/5 backdrop-blur-3xl shadow-2xl' : 'bg-white border-black/5 shadow-xl'}`}>
            <div className="text-center space-y-8">
              <div className="relative inline-block group mb-4">
                <div className="absolute -inset-4 bg-[#fbff00]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h1 className={`text-5xl md:text-6xl font-display font-black tracking-tighter uppercase relative ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  INTELLI<span className="text-[#fbff00]">PATH</span>
                </h1>
              </div>
              
              <div className="space-y-2">
                <p className={`text-[11px] tracking-[0.4em] uppercase font-display font-black ${theme === 'dark' ? 'text-zinc-500' : 'text-red-600'}`}>
                  Smart Learning Path
                </p>
                <div className={`h-[1px] w-12 mx-auto ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}></div>
              </div>

              <p className={`text-[13px] leading-relaxed font-medium px-4 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Connect your account to access your personalized AI-driven learning journey.
              </p>

              <div className="pt-8">
                <button 
                  onClick={handleLogin}
                  className="w-full group relative flex items-center justify-center space-x-4 px-8 py-5 bg-white text-black rounded-2xl font-display font-black tracking-widest uppercase hover:bg-[#fbff00] transition-all duration-500 shadow-2xl active:scale-95"
                >
                  <div className="absolute inset-0 bg-[#fbff00] rounded-2xl scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                  <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="relative z-10">Sign in with Google</span>
                </button>
              </div>

              <div className="pt-6">
                <p className={`text-[9px] font-mono tracking-widest uppercase opacity-40 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Encrypted & Secure Session
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-full ${theme === 'dark' ? 'bg-[#030303] text-zinc-400' : 'bg-[#f5f5f5] text-zinc-600'} font-sans antialiased overflow-hidden transition-colors duration-500`}>
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        user={user} 
      />
      <main className={`flex-1 lg:ml-80 relative ${theme === 'dark' ? 'bg-[#050505]' : 'bg-white'} min-h-screen transition-colors duration-500`}>
        <header className={`lg:hidden flex items-center px-6 h-16 border-b ${theme === 'dark' ? 'border-white/5 bg-black/80' : 'border-black/5 bg-white/80'} sticky top-0 z-[60]`}>
          <div className="flex-1">
            <span className={`text-base font-display font-black tracking-widest ${theme === 'dark' ? 'text-white' : 'text-black'}`}>INTELLIPATH AI</span>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <button onClick={() => signOut(auth)} className="p-2 rounded-lg border border-white/5 text-red-500">
                <Icons.Trash size={16} />
              </button>
            )}
          </div>
        </header>
        <div className="h-full relative overflow-hidden">
          {activeTab === 'chat' && <ProChat theme={theme} user={user} />}
          {activeTab === 'image' && <LearningAnalyzer theme={theme} user={user} />}
          {activeTab === 'live' && <LiveMode theme={theme} user={user} />}
        </div>
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
