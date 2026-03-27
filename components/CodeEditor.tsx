'use client';

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  FolderOpen,
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
}) => [
  {
    id: 'page1',
    name: copy.codeFileName,
    icon: <FileCode className="text-blue-400" size={14} />,
    language: 'typescript',
    content: getHomepageSample(copy),
  },
];

const createEmptyFiles = (
  initialFiles: ReturnType<typeof buildInitialFiles>
) =>
  initialFiles.map((file) => ({
    ...file,
    content: '',
  }));

const serializeFilesForComparison = (
  files: ReturnType<typeof buildInitialFiles>
) =>
  files.map(({ id, name, language, content }) => ({
    id,
    name,
    language,
    content,
  }));

const LiveResultView: React.FC<{
  onBack: () => void;
  copy: {
    previewUrl: string;
    previewLabel: string;
    backToCode: string;
  };
}> = ({ onBack, copy }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full h-full flex flex-col bg-[#1e1e1e] relative rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-4 ring-black/20"
    >
      {/* Browser-like header */}
      <div className="h-12 bg-[#2d2d2d] flex items-center px-4 border-b border-black relative z-20 shrink-0">
        <div className="flex gap-2 w-1/3">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#1e1e1e] px-4 py-1 rounded-md text-xs text-neutral-400 font-mono flex items-center gap-2 border border-white/5">
            <span>{copy.previewLabel}</span>
          </div>
        </div>
        <div className="w-1/3 flex justify-end">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white rounded text-xs transition-colors"
          >
            <RotateCcw size={12} />
            <span>{copy.backToCode}</span>
          </button>
        </div>
      </div>
      
      {/* Iframe Content */}
      <div className="flex-1 w-full bg-black relative">
        <iframe ref={iframeRef} src={copy.previewUrl} className="w-full h-full border-0" title="Live Preview" />
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

const CodeEditor: React.FC<{
  copy: {
    heading: string;
    description: string;
    codeFileName: string;
    previewUrl: string;
    previewLabel: string;
    backToCode: string;
    runButton: string;
    componentsLabel: string;
    terminalLabel: string;
    folderName: string;
    buildCommand: string;
    compiling: string;
    syntaxError: string;
    buildFailed: string;
    typeCheckSuccess: string;
    optimizing: string;
    buildComplete: string;
    generatingPreview: string;
    lineLabel: string;
    columnLabel: string;
    homepageComponentName: string;
    homeLabel: string;
    heroComment: string;
    servicesComment: string;
    showcaseComment: string;
    codeComment: string;
    footerComment: string;
  };
}> = ({ copy }) => {
  const initialFiles = useMemo(() => buildInitialFiles(copy), [copy]);
  const [files, setFiles] = useState(() => createEmptyFiles(initialFiles));
  const [activeFileId, setActiveFileId] = useState<string>(() => initialFiles[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<{ msg: string; type: 'info' | 'error' | 'success' }[]>([]);
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

    const addLog = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
      setTerminalLogs((prev) => [...prev, { msg, type }]);
    };

    addLog(copy.buildCommand);
    await new Promise((r) => setTimeout(r, 600));
    addLog(copy.compiling, 'info');
    await new Promise((r) => setTimeout(r, 800));

    const isDirty =
      JSON.stringify(serializeFilesForComparison(files)) !==
      JSON.stringify(serializeFilesForComparison(initialFiles));
    if (isDirty) {
      addLog(copy.syntaxError, 'error');
      addLog(copy.buildFailed, 'error');
      setIsRunning(false);
    } else {
      addLog(copy.typeCheckSuccess, 'success');
      await new Promise((r) => setTimeout(r, 400));
      addLog(copy.optimizing, 'info');
      await new Promise((r) => setTimeout(r, 800));
      addLog(copy.buildComplete, 'success');
      addLog(copy.generatingPreview, 'info');
      await new Promise((r) => setTimeout(r, 600));

      setIsTerminalOpen(false);
      setShowResult(true);
      setIsRunning(false);
    }
  };

  return (
    <section className="py-32 relative flex justify-center items-center min-h-screen bg-neutral-950 overflow-hidden border-t border-white/5">
      <div ref={sectionRef} className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center brand-font">
            {copy.heading}
          </h2>
          <p className="mt-4 text-neutral-400 max-w-lg text-center">
            {copy.description}
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto relative h-[600px] md:h-[550px]">
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
                <div className="h-12 bg-[#2d2d2d] flex items-center justify-between px-4 border-b border-black relative z-20">
                  <div className="flex gap-2 w-1/3">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-neutral-500 text-xs font-mono flex items-center justify-center gap-2 w-1/3">
                    <FolderOpen size={12} />
                    <span>{copy.folderName}</span>
                  </div>
                  <div className="flex items-center justify-end gap-3 w-1/3">
                    <button
                      onClick={handleReset}
                      disabled={isRunning}
                      className="p-2 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={runCode}
                      disabled={isRunning || isTyping}
                      className={`relative flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] ${!isTyping && !isRunning ? 'animate-pulse hover:animate-none' : ''}`}
                    >
                      {isRunning ? '...' : <Play size={12} fill="currentColor" />}
                      <span>{copy.runButton}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
                  {/* Sidebar */}
                  <div className="hidden md:flex w-64 bg-[#252526] flex-col border-r border-black/50 shrink-0">
                    <div className="p-3 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      {copy.componentsLabel}
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
                        <span className="text-xs text-neutral-400">{copy.terminalLabel}</span>
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
                      {copy.lineLabel} {activeFile.content.split('\n').length}, {copy.columnLabel} 1
                    </span>
                    <span>UTF-8</span>
                    <span>TSX</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <LiveResultView
                onBack={handleReset}
                copy={{
                  previewUrl: copy.previewUrl,
                  previewLabel: copy.previewLabel,
                  backToCode: copy.backToCode,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CodeEditor;
