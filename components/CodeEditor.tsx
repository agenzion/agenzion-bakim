'use client';

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  FileCode,
  X,
  Play,
  RotateCcw,
  Copy,
} from 'lucide-react';

const TOKEN_SPLIT_REGEX =
  /(\s+|[(){}[\]:;,.<>]|\/\/.*|\/\*[\s\S]*?\*\/|"[^"]*"|'[^']*'|`[^`]*`)/g;
const KEYWORD_TOKEN_REGEX =
  /^(import|export|const|let|var|function|return|async|await|class|from|if|else|for|while|interface|type)$/;
const COMPONENT_NAME_TOKEN_REGEX = /^[A-Z][a-zA-Z0-9]*$/;
const NUMBER_TOKEN_REGEX = /^\d+$/;
const STRING_TOKEN_REGEX = /^"[^"]*"$|^'[^']*'|`[^`]*`$/;
const JSX_TAG_TOKEN_REGEX = /^[a-z][a-z0-9-]*$/i;

const revealTransition = { duration: 0.55, ease: 'easeOut' } as const;

const revealItemVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: revealTransition },
};

const wordpressLoadContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

type TerminalLogType = 'info' | 'error' | 'success';

type EditorFile = {
  id: string;
  name: string;
  icon: React.ReactNode;
  language: string;
  content: string;
};

type RunSequenceCopy = {
  buildCommand: string;
  compiling: string;
  syntaxError: string;
  buildFailed: string;
  typeCheckSuccess: string;
  optimizing: string;
  buildComplete: string;
  generatingPreview: string;
};

type EditorChromeCopy = {
  runButton: string;
  componentsLabel: string;
  terminalLabel: string;
  lineLabel: string;
  columnLabel: string;
};

type PreviewCopy = {
  previewUrl: string;
  previewLabel: string;
  locked?: boolean;
  title?: string;
};

type LegacyEditorCopy = EditorChromeCopy &
  RunSequenceCopy & {
    codeFileName: string;
    previewUrl: string;
    previewLabel: string;
    backToCode: string;
    statusLanguage: string;
    siteLabel: string;
    themeComment: string;
    pluginComment: string;
    contentComment: string;
    deployComment: string;
    installTitle: string;
    installDescription: string;
    packageLabel: string;
    builderLabel: string;
    hostingLabel: string;
    progressLabel: string;
    readyLabel: string;
    navigationItems: readonly string[];
  };

type CodeEditorCopy = EditorChromeCopy &
  RunSequenceCopy & {
    heading: string;
    description: string;
    closingMessage: string;
    codeFileName: string;
    previewUrl: string;
    previewLabel: string;
    backToCode: string;
    homepageComponentName: string;
    homeLabel: string;
    heroComment: string;
    servicesComment: string;
    showcaseComment: string;
    codeComment: string;
    footerComment: string;
    legacyEditor: LegacyEditorCopy;
  };

const getHomepageSample = (copy: {
  homepageComponentName: string;
  homeLabel: string;
  heroComment: string;
  servicesComment: string;
  showcaseComment: string;
  codeComment: string;
  footerComment: string;
}) => `import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Showcase from '@/components/Showcase';
import CodeEditor from '@/components/CodeEditor';
import Footer from '@/components/Footer';

export default function ${copy.homepageComponentName}() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#4592AF] selection:text-white">
      {/* ${copy.heroComment} */}
      <Hero />
      
      {/* ${copy.servicesComment} */}
      <Services />
      
      {/* ${copy.showcaseComment} */}
      <Showcase />
      
      {/* ${copy.codeComment} */}
      <CodeEditor />
      
      {/* ${copy.footerComment} */}
      <Footer />
    </main>
  );
}`;

const buildInitialFiles = (copy: {
  codeFileName: string;
  homepageComponentName: string;
  homeLabel: string;
  heroComment: string;
  servicesComment: string;
  showcaseComment: string;
  codeComment: string;
  footerComment: string;
}): EditorFile[] => [
  {
    id: 'page1',
    name: copy.codeFileName,
    icon: <FileCode className="text-blue-400" size={14} />,
    language: 'typescript',
    content: getHomepageSample(copy),
  },
];

const createEmptyFiles = (
  initialFiles: EditorFile[]
) =>
  initialFiles.map((file) => ({
    ...file,
    content: '',
  }));

const serializeFilesForComparison = (
  files: EditorFile[]
) =>
  files.map(({ id, name, language, content }) => ({
    id,
    name,
    language,
    content,
  }));

const LiveResultView: React.FC<{
  preview: PreviewCopy;
}> = ({ preview }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (preview.locked) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    let cleanup: (() => void) | undefined;

    const blockClicks = () => {
      try {
        const doc = iframe.contentDocument;
        const win = iframe.contentWindow;
        if (!doc) return;
        
        const style = doc.createElement('style');
        style.setAttribute('data-preview-cursor-lock', 'true');
        style.textContent = `
          html,
          body,
          *,
          *::before,
          *::after,
          *:hover,
          *:focus,
          *:active,
          a,
          a:hover,
          a:focus,
          button,
          button:hover,
          button:focus,
          [role="button"],
          [role="button"]:hover,
          input,
          textarea,
          select,
          label,
          summary {
            cursor: default !important;
          }
        `;
        doc.head?.appendChild(style);
        doc.documentElement.style.cursor = 'default';
        if (doc.body) {
          doc.body.style.cursor = 'default';
        }

        const blockedEvents = ['click', 'dblclick', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend'];

        const preventInteraction = (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
          if ('stopImmediatePropagation' in event) {
            event.stopImmediatePropagation();
          }
        };

        blockedEvents.forEach((eventName) => {
          doc.addEventListener(eventName, preventInteraction, true);
          win?.addEventListener(eventName, preventInteraction, true);
        });

        cleanup = () => {
          blockedEvents.forEach((eventName) => {
            doc.removeEventListener(eventName, preventInteraction, true);
            win?.removeEventListener(eventName, preventInteraction, true);
          });
          doc.documentElement.style.removeProperty('cursor');
          doc.body?.style.removeProperty('cursor');
          style.remove();
        };
      } catch {
        cleanup = undefined;
      }
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      blockClicks();
    } else {
      iframe.addEventListener('load', blockClicks);
    }

    return () => {
      iframe.removeEventListener('load', blockClicks);
      cleanup?.();
    };
  }, [preview.locked]);

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full h-full flex flex-col bg-[#1e1e1e] relative rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-4 ring-black/20"
    >
      {/* Browser-like header */}
      <div className="h-12 bg-[#2d2d2d] grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 sm:px-4 border-b border-black relative z-20 shrink-0">
        <div className="flex gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="min-w-0 flex justify-center">
          <div className="min-w-0 max-w-full bg-[#1e1e1e] px-3 sm:px-4 py-1 rounded-md text-xs text-neutral-400 font-mono flex items-center gap-2 border border-white/5">
            <span className="min-w-0 truncate">{preview.previewLabel}</span>
          </div>
        </div>
        <div aria-hidden="true" className="w-9" />
      </div>
      
      {/* Iframe Content */}
      <div
        className={`flex-1 w-full bg-black relative ${
          preview.locked ? 'overflow-y-auto overscroll-contain' : ''
        }`}
      >
        <iframe
          ref={iframeRef}
          src={preview.previewUrl}
          className={`w-full border-0 ${
            preview.locked
              ? 'h-[3200px] min-h-full pointer-events-none select-none'
              : 'h-full'
          }`}
          title={preview.title || 'Live Preview'}
        />
      </div>
    </motion.div>
  );
};

const CodeHighlighter = React.memo(function CodeHighlighter({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const highlightedTokens = useMemo(() => {
    const tokens = code.split(TOKEN_SPLIT_REGEX);

    return tokens.map((token, index) => {
      let colorClass = 'text-[#d4d4d4]';

      if (KEYWORD_TOKEN_REGEX.test(token)) {
        colorClass = 'text-[#c586c0]';
      } else if (COMPONENT_NAME_TOKEN_REGEX.test(token)) {
        colorClass = 'text-[#4ec9b0]';
      } else if (NUMBER_TOKEN_REGEX.test(token)) {
        colorClass = 'text-[#b5cea8]';
      } else if (STRING_TOKEN_REGEX.test(token)) {
        colorClass = 'text-[#ce9178]';
      } else if (token.trim().startsWith('//') || token.trim().startsWith('/*')) {
        colorClass = 'text-[#6a9955]';
      }

      if (token === '{' || token === '}') colorClass = 'text-[#ffd700]';
      if (token === '(' || token === ')') colorClass = 'text-[#da70d6]';
      if (token === '<' || token === '>' || token === '/>') colorClass = 'text-[#808080]';

      if (
        language === 'typescript' &&
        JSX_TAG_TOKEN_REGEX.test(token) &&
        index > 0 &&
        tokens[index - 1] === '<'
      ) {
        colorClass = 'text-[#569cd6]';
      }

      return (
        <span key={index} className={colorClass}>
          {token}
        </span>
      );
    });
  }, [code, language]);

  return <>{highlightedTokens}</>;
});

const PanelActionHeader: React.FC<{
  title: string;
  actionLabel: string;
  isBusy: boolean;
  isActionReady?: boolean;
  actionDisabled?: boolean;
  resetDisabled?: boolean;
  onAction: () => void;
  onReset: () => void;
}> = ({
  title,
  actionLabel,
  isBusy,
  isActionReady = true,
  actionDisabled = false,
  resetDisabled = false,
  onAction,
  onReset,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, amount: 0.8 }}
    transition={revealTransition}
    className="mb-4 flex h-9 items-center justify-between gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
  >
    <h3 className="min-w-0 truncate text-left text-lg font-bold leading-9 text-white brand-font sm:col-start-2 sm:text-center sm:text-2xl">
      {title}
    </h3>
    <div className="flex h-9 min-w-0 shrink-0 items-stretch justify-self-end gap-2 sm:col-start-3">
      <button
        onClick={onAction}
        disabled={actionDisabled}
        className={`relative flex w-28 min-w-0 items-center justify-center gap-2 rounded-md bg-green-600 px-3 text-xs font-bold text-white transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] ${
          isActionReady ? 'animate-pulse hover:animate-none' : ''
        }`}
      >
        {isBusy ? '...' : <Play size={12} fill="currentColor" className="shrink-0" />}
        <span className="min-w-0 truncate">{actionLabel.toLocaleUpperCase('tr-TR')}</span>
      </button>
      <button
        onClick={onReset}
        disabled={resetDisabled}
        aria-label={`${title} reset`}
        className="flex w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  </motion.div>
);

const VersusMark = () => (
  <div
    aria-label="VS"
    className="relative flex h-28 w-32 items-center justify-center justify-self-center overflow-visible xl:h-[672px] xl:w-full xl:self-stretch"
  >
    <div className="relative h-32 w-32 xl:h-52 xl:w-28">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 128 208"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="versus-route-trace" x1="80" y1="18" x2="46" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4592AF" stopOpacity="0.1" />
            <stop offset="42%" stopColor="#ffffff" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#E3C4A8" stopOpacity="0.18" />
          </linearGradient>
          <filter id="versus-route-glow" x="-40" y="-20" width="208" height="248" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.27 0 0 0 0 0.57 0 0 0 0 0.69 0 0 0 0.72 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M 82 18 L 46 190"
          stroke="url(#versus-route-trace)"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          whileInView={{ opacity: 1, pathLength: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 1.15, delay: 0.15, ease: 'easeOut' }}
          filter="url(#versus-route-glow)"
        />
        <motion.path
          d="M 82 18 L 46 190"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          whileInView={{ opacity: 0.95, pathLength: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 1.15, delay: 0.15, ease: 'easeOut' }}
        />
      </svg>
      <motion.span
        initial={{ opacity: 0, x: -16, y: 8, scale: 0.9, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, delay: 0.32, ease: 'easeOut' }}
        className="absolute left-4 top-1/2 -translate-y-1/2 -skew-x-6 text-5xl font-black leading-none text-white brand-font xl:left-0 xl:text-6xl"
        style={{ textShadow: '0 0 18px rgba(255,255,255,0.45)' }}
      >
        V
      </motion.span>
      <motion.span
        initial={{ opacity: 0, x: 16, y: 8, scale: 0.9, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, delay: 0.42, ease: 'easeOut' }}
        className="absolute right-4 top-1/2 -translate-y-1/2 -skew-x-6 text-5xl font-black leading-none text-white brand-font xl:right-0 xl:text-6xl"
        style={{ textShadow: '0 0 18px rgba(255,255,255,0.45)' }}
      >
        S
      </motion.span>
    </div>
  </div>
);

const EditorPanel: React.FC<{
  initialFiles: EditorFile[];
  chromeCopy: EditorChromeCopy;
  runCopy: RunSequenceCopy;
  preview: PreviewCopy;
  statusLanguage?: string;
}> = ({ initialFiles, chromeCopy, runCopy, preview, statusLanguage = 'TSX' }) => {
  const [files, setFiles] = useState(() => createEmptyFiles(initialFiles));
  const [activeFileId, setActiveFileId] = useState<string>(() => initialFiles[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<{ msg: string; type: TerminalLogType }[]>([]);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const typingFrameRef = useRef<number | null>(null);
  const hasStartedTypingRef = useRef(false);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const startTypingAnimation = useCallback(() => {
    if (typingFrameRef.current) {
      window.clearTimeout(typingFrameRef.current);
    }

    setFiles(createEmptyFiles(initialFiles));
    setIsTyping(true);

    const source = initialFiles[0].content;
    let index = 0;

    const typeNextChunk = () => {
      index = Math.min(index + 6, source.length);

      setFiles((prev) =>
        prev.map((file) =>
          file.id === initialFiles[0].id ? { ...file, content: source.slice(0, index) } : file
        )
      );

      if (index < source.length) {
        typingFrameRef.current = window.setTimeout(typeNextChunk, 20);
        return;
      }

      setIsTyping(false);
    };

    typingFrameRef.current = window.setTimeout(typeNextChunk, 270);
  }, [initialFiles]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStartedTypingRef.current) return;

        hasStartedTypingRef.current = true;
        startTypingAnimation();
      },
      { threshold: 0.45 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (typingFrameRef.current) {
        window.clearTimeout(typingFrameRef.current);
      }
    };
  }, [startTypingAnimation]);

  const handleCodeChange = (newCode: string) => {
    if (showResult || isTyping) return;
    setFiles((prev) => prev.map((f) => (f.id === activeFileId ? { ...f, content: newCode } : f)));
  };

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleReset = () => {
    if (typingFrameRef.current) {
      window.clearTimeout(typingFrameRef.current);
    }

    setFiles(createEmptyFiles(initialFiles));
    setTerminalLogs([]);
    setIsTerminalOpen(false);
    setShowResult(false);
    setIsRunning(false);
    startTypingAnimation();
  };

  const runCode = async () => {
    if (isRunning || isTyping) return;
    setIsRunning(true);
    setIsTerminalOpen(true);
    setTerminalLogs([]);
    setShowResult(false);

    const addLog = (msg: string, type: TerminalLogType = 'info') => {
      setTerminalLogs((prev) => [...prev, { msg, type }]);
    };

    addLog(runCopy.buildCommand);
    await new Promise((r) => setTimeout(r, 600));
    addLog(runCopy.compiling, 'info');
    await new Promise((r) => setTimeout(r, 800));

    const isDirty =
      JSON.stringify(serializeFilesForComparison(files)) !==
      JSON.stringify(serializeFilesForComparison(initialFiles));
    if (isDirty) {
      addLog(runCopy.syntaxError, 'error');
      addLog(runCopy.buildFailed, 'error');
      setIsRunning(false);
    } else {
      addLog(runCopy.typeCheckSuccess, 'success');
      await new Promise((r) => setTimeout(r, 400));
      addLog(runCopy.optimizing, 'info');
      await new Promise((r) => setTimeout(r, 800));
      addLog(runCopy.buildComplete, 'success');
      addLog(runCopy.generatingPreview, 'info');
      await new Promise((r) => setTimeout(r, 600));

      setIsTerminalOpen(false);
      setShowResult(true);
      setIsRunning(false);
    }
  };

  return (
    <div ref={sectionRef} className="w-full">
      <PanelActionHeader
        title="Modern Next.js"
        actionLabel={chromeCopy.runButton}
        isBusy={isRunning}
        isActionReady={!isTyping && !isRunning}
        actionDisabled={isRunning || isTyping}
        resetDisabled={isRunning}
        onAction={runCode}
        onReset={handleReset}
      />
      <div className="w-full h-[600px] md:h-[620px] relative">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
                className="w-full h-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-4 ring-black/20 flex flex-col"
              >
                {/* IDE Title Bar */}
                <div className="h-12 bg-[#2d2d2d] flex items-center px-4 border-b border-black relative z-20">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
                  {/* Sidebar */}
                  <div className="hidden md:flex w-64 bg-[#252526] flex-col border-r border-black/50 shrink-0">
                    <div className="p-3 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {chromeCopy.componentsLabel}
                    </div>
                    <div className="flex flex-col">
                      {files.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => setActiveFileId(file.id)}
                          className={`px-4 py-2 text-sm flex items-center gap-2 transition-colors border-l-2 ${
                            activeFileId === file.id
                              ? 'bg-[#37373d] text-white border-[#4592AF]'
                              : 'text-neutral-400 hover:text-neutral-200 border-transparent hover:bg-[#2a2d2e]'
                          }`}
                        >
                          {file.icon}
                          <span className="font-mono text-xs">{file.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editor Area */}
                  <div className="flex-1 bg-[#1e1e1e] flex flex-col font-mono relative min-w-0">
                    <div className="flex bg-[#252526] overflow-x-auto scrollbar-hide shrink-0">
                      {files.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => setActiveFileId(file.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 text-xs min-w-fit border-r border-black/50 transition-colors ${
                            activeFileId === file.id
                              ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#4592AF]'
                              : 'text-neutral-500 hover:bg-[#2a2d2e]'
                          }`}
                        >
                          {file.icon}
                          <span>{file.name}</span>
                          {activeFileId === file.id && (
                            <X size={12} className="ml-2 opacity-50 hover:opacity-100" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 relative group overflow-hidden bg-[#1e1e1e]">
                      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy
                          size={16}
                          className="text-neutral-500 hover:text-white cursor-pointer"
                          onClick={() => navigator.clipboard.writeText(activeFile.content)}
                        />
                      </div>
                      <div className="absolute inset-0 flex">
                        <div className="h-full pt-4 pr-4 bg-[#1e1e1e] text-neutral-600 select-none text-sm leading-6 border-r border-white/5 mr-0 min-w-[50px] text-right overflow-hidden shrink-0">
                          {Array.from({ length: activeFile.content.split('\n').length + 1 }).map(
                            (_, i) => (
                              <div key={i}>{i + 1}</div>
                            )
                          )}
                        </div>
                        <div className="relative flex-1 h-full min-w-0">
                          <pre
                            ref={preRef}
                            aria-hidden="true"
                            className="absolute inset-0 p-4 m-0 bg-transparent pointer-events-none overflow-hidden whitespace-pre font-mono text-sm leading-6"
                          >
                            <CodeHighlighter
                              code={activeFile.content}
                              language={activeFile.language}
                            />
                            <br />
                          </pre>
                          <textarea
                            ref={textareaRef}
                            value={activeFile.content}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            onScroll={handleScroll}
                            readOnly={isTyping}
                            spellCheck={false}
                            className="absolute inset-0 w-full h-full p-4 m-0 bg-transparent text-transparent caret-[#4592AF] resize-none border-none outline-none font-mono text-sm leading-6 whitespace-pre z-10 selection:bg-[#4592AF]/30 selection:text-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terminal Overlay */}
                <AnimatePresence>
                  {isTerminalOpen && (
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                      className="absolute bottom-0 left-0 right-0 h-[40%] bg-black/95 backdrop-blur border-t border-white/20 z-30 flex flex-col font-mono"
                    >
                      <div className="h-8 bg-neutral-900 flex items-center justify-between px-4 border-b border-white/10">
                        <span className="text-xs text-neutral-400">{chromeCopy.terminalLabel}</span>
                        <button onClick={() => setIsTerminalOpen(false)}>
                          <X size={14} className="text-neutral-400 hover:text-white" />
                        </button>
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto text-sm space-y-2 font-mono">
                        {terminalLogs.map((log, i) => (
                          <div
                            key={i}
                            className={`${
                              log.type === 'error'
                                ? 'text-red-500'
                                : log.type === 'success'
                                ? 'text-green-500'
                                : 'text-neutral-300'
                            }`}
                          >
                            {log.msg}
                          </div>
                        ))}
                        {isRunning && <div className="animate-pulse text-[#4592AF]">_</div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[10px] select-none z-20 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Code2 size={10} /> master*
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>
                      {chromeCopy.lineLabel} {activeFile.content.split('\n').length}, {chromeCopy.columnLabel} 1
                    </span>
                    <span>UTF-8</span>
                    <span>{statusLanguage}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <LiveResultView preview={preview} />
            )}
          </AnimatePresence>
      </div>
    </div>
  );
};

const LegacyInstallPanel: React.FC<{
  copy: LegacyEditorCopy;
  preview: PreviewCopy;
}> = ({ copy, preview }) => {
  const [showResult, setShowResult] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);

  const setupSteps = useMemo(
    () => [
      copy.themeComment,
      copy.pluginComment,
      copy.contentComment,
      copy.deployComment,
    ],
    [copy.contentComment, copy.deployComment, copy.pluginComment, copy.themeComment]
  );

  const progress = Math.round((completedSteps / setupSteps.length) * 100);

  const handleReset = () => {
    setIsInstalling(false);
    setShowResult(false);
    setCompletedSteps(0);
  };

  const runInstall = async () => {
    if (isInstalling) return;

    setIsInstalling(true);
    setShowResult(false);
    setCompletedSteps(0);

    for (let index = 1; index <= setupSteps.length; index += 1) {
      await new Promise((resolve) => setTimeout(resolve, 520));
      setCompletedSteps(index);
    }

    await new Promise((resolve) => setTimeout(resolve, 450));
    setIsInstalling(false);
    setShowResult(true);
  };

  return (
    <div className="w-full">
      <PanelActionHeader
        title="Geleneksel Wordpress"
        actionLabel={copy.runButton}
        isBusy={isInstalling}
        isActionReady={!isInstalling}
        actionDisabled={isInstalling}
        resetDisabled={isInstalling}
        onAction={runInstall}
        onReset={handleReset}
      />
      <div className="w-full h-[600px] md:h-[620px] relative">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="legacy-installer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="w-full h-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-4 ring-black/20 flex flex-col"
            >
              <motion.div
                initial={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.8 }}
                transition={revealTransition}
                className="h-12 bg-[#2d2d2d] flex items-center gap-3 px-3 sm:px-4 border-b border-black relative z-20"
              >
                <div className="flex gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
              </motion.div>

            <motion.div
              variants={wordpressLoadContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              className="flex-1 overflow-hidden bg-[#f0f0f1] text-[#1d2327] font-sans"
            >
              <motion.div variants={wordpressLoadContainerVariants} className="h-full flex overflow-hidden">
                <motion.aside variants={revealItemVariants} className="hidden min-[1800px]:flex w-44 shrink-0 flex-col bg-[#1d2327] text-[#c3c4c7]">
                  <div className="px-4 py-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center text-sm font-bold text-white">
                        W
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-white text-sm font-semibold">WordPress</div>
                        <div className="truncate text-[10px] uppercase tracking-[0.2em] text-[#72aee6]">
                          Elementor
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-3 text-sm">
                    {copy.navigationItems.map((item, index) => (
                      <div
                        key={item}
                        className={`px-4 py-2.5 border-l-4 break-words [overflow-wrap:anywhere] ${
                          index === 0
                            ? 'bg-[#2271b1] text-white border-[#72aee6]'
                            : 'border-transparent'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.aside>

                <motion.div variants={wordpressLoadContainerVariants} className="flex-1 flex flex-col min-w-0">
                  <motion.div variants={revealItemVariants} className="h-11 bg-white border-b border-[#c3c4c7] px-3 sm:px-5 flex items-center justify-between gap-3 text-xs text-[#50575e]">
                    <span className="min-w-0 flex-1 truncate font-medium">{copy.siteLabel}</span>
                    <span className="min-w-0 max-w-[45%] truncate text-right">{copy.previewLabel}</span>
                  </motion.div>

                  <div className="flex-1 overflow-hidden p-3 sm:p-4 min-[1800px]:p-6">
                    <motion.div variants={wordpressLoadContainerVariants} className="h-full rounded-lg bg-white border border-[#dcdcde] shadow-sm overflow-hidden flex flex-col">
                      <motion.div variants={wordpressLoadContainerVariants} className="px-4 sm:px-5 py-5 border-b border-[#dcdcde] flex flex-col gap-4 min-[1800px]:flex-row min-[1800px]:items-start min-[1800px]:justify-between">
                        <motion.div variants={revealItemVariants} className="min-w-0">
                          <div className="break-words text-xs uppercase tracking-[0.22em] text-[#2271b1] font-bold [overflow-wrap:anywhere]">
                            {copy.componentsLabel}
                          </div>
                          <h3 className="mt-2 break-words text-xl sm:text-2xl font-semibold leading-tight text-[#1d2327] [overflow-wrap:anywhere]">
                            {copy.installTitle}
                          </h3>
                          <p className="mt-2 max-w-xl break-words text-sm leading-relaxed text-[#646970] [overflow-wrap:anywhere]">
                            {copy.installDescription}
                          </p>
                        </motion.div>
                        <motion.div variants={revealItemVariants} className="w-full min-w-0 rounded-lg border border-[#dcdcde] bg-[#f6f7f7] px-4 py-3 min-[1800px]:w-auto min-[1800px]:min-w-[150px]">
                          <div className="break-words text-[11px] uppercase tracking-[0.18em] text-[#646970] [overflow-wrap:anywhere]">
                            {copy.packageLabel}
                          </div>
                          <div className="mt-1 break-all font-semibold text-[#1d2327]">
                            premium-theme.zip
                          </div>
                        </motion.div>
                      </motion.div>

                      <div className="grid flex-1 min-h-0 grid-cols-1 min-[1800px]:grid-cols-[minmax(0,1fr)_200px]">
                        <div className="min-w-0 p-4 sm:p-5 overflow-hidden flex flex-col">
                          <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                            {[
                              ['WordPress', '6.5'],
                              [copy.builderLabel, 'Elementor Pro'],
                              [copy.hostingLabel, 'LiteSpeed'],
                            ].map(([label, value]) => (
                              <motion.div
                                key={label}
                                variants={revealItemVariants}
                                className="min-w-0 rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-3"
                              >
                                <div className="break-words text-[11px] uppercase tracking-[0.16em] text-[#646970] [overflow-wrap:anywhere]">
                                  {label}
                                </div>
                                <div className="mt-1 break-words text-sm font-semibold text-[#1d2327] [overflow-wrap:anywhere]">
                                  {value}
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          <motion.div variants={revealItemVariants} className="mt-6">
                            <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[#50575e]">
                              <span className="min-w-0 break-words [overflow-wrap:anywhere]">{copy.progressLabel}</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#dcdcde]">
                              <div
                                className="h-full rounded-full bg-[#2271b1] transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </motion.div>

                          <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                            {setupSteps.map((step, index) => {
                              const isDone = completedSteps > index;
                              const isActive = isInstalling && completedSteps === index;

                              return (
                                <motion.div
                                  key={step}
                                  variants={revealItemVariants}
                                  className="min-w-0 rounded-lg border border-[#dcdcde] bg-white p-3 flex items-start gap-3"
                                >
                                  <div
                                    className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                                      isDone
                                        ? 'bg-[#00a32a] text-white'
                                        : isActive
                                        ? 'bg-[#2271b1] text-white animate-pulse'
                                        : 'bg-[#f0f0f1] text-[#646970]'
                                    }`}
                                  >
                                    {isDone ? 'v' : index + 1}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="break-words text-sm font-semibold leading-snug text-[#1d2327] [overflow-wrap:anywhere]">
                                      {step}
                                    </div>
                                    <div className="mt-0.5 break-words font-mono text-xs leading-snug text-[#646970] [overflow-wrap:anywhere]">
                                      {isDone ? copy.readyLabel : copy.buildCommand}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                        <motion.div variants={revealItemVariants} className="hidden min-[1800px]:flex min-w-0 flex-col border-l border-[#dcdcde] bg-[#f6f7f7] p-4">
                          <div className="aspect-[4/5] rounded-lg bg-gradient-to-br from-[#1d2327] via-[#2c3338] to-[#2271b1] p-4 text-white shadow-inner">
                            <div className="h-3 w-20 rounded-full bg-white/30" />
                            <div className="mt-14 h-4 w-24 rounded-full bg-white/70" />
                            <div className="mt-3 h-3 w-32 rounded-full bg-white/35" />
                            <div className="mt-8 grid grid-cols-2 gap-2">
                              <div className="h-16 rounded-lg bg-white/20" />
                              <div className="h-16 rounded-lg bg-white/20" />
                            </div>
                          </div>
                          <div className="mt-4 break-words text-xs leading-relaxed text-[#646970] [overflow-wrap:anywhere]">
                            {copy.generatingPreview}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <LiveResultView preview={preview} />
        )}
      </AnimatePresence>
    </div>
    </div>
  );
};

const CodeEditor: React.FC<{
  copy: CodeEditorCopy;
}> = ({ copy }) => {
  const modernFiles = useMemo(() => buildInitialFiles(copy), [copy]);

  return (
    <section className="py-32 relative flex justify-center items-center min-h-screen bg-neutral-950 overflow-hidden border-t border-white/5">
      <div className="w-full px-4 md:px-6 relative z-10">
        <motion.div
          variants={wordpressLoadContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.65 }}
          className="flex flex-col items-center mb-16"
        >
          <motion.h2 variants={revealItemVariants} className="text-4xl md:text-6xl font-bold text-white text-center brand-font">
            {copy.heading}
          </motion.h2>
          <motion.p variants={revealItemVariants} className="mt-4 text-neutral-400 max-w-lg text-center">
            {copy.description}
          </motion.p>
        </motion.div>

        <div className="mx-auto grid w-full grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)]">
          <LegacyInstallPanel
            key="legacy-installer"
            copy={copy.legacyEditor}
            preview={{
              previewUrl: copy.legacyEditor.previewUrl,
              previewLabel: copy.legacyEditor.previewLabel,
              locked: true,
              title: copy.legacyEditor.previewLabel,
            }}
          />
          <VersusMark />
          <EditorPanel
            key="modern-editor"
            initialFiles={modernFiles}
            chromeCopy={copy}
            runCopy={copy}
            preview={{
              previewUrl: copy.previewUrl,
              previewLabel: copy.previewLabel,
              title: copy.previewLabel,
            }}
          />
        </div>

        <motion.p
          variants={revealItemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.75 }}
          className="mt-10 text-center text-lg md:text-2xl text-neutral-300 brand-font"
        >
          {copy.closingMessage}
        </motion.p>
      </div>
    </section>
  );
};

export default CodeEditor;
