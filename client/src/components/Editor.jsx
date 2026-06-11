import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import socket from "../socket";
import axios from "axios";

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp", "go", "rust", "html", "css"];

export default function CodeEditor({ roomId }) {
  const [code, setCode] = useState("// Loading...");
  const [language, setLanguage] = useState("javascript");
  const [saved, setSaved] = useState(false);
  const isRemote = useRef(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    socket.on("initial-code", ({ code: c, language: l }) => {
      setCode(c);
      setLanguage(l);
    });

    socket.on("code-update", (newCode) => {
      isRemote.current = true;
      setCode(newCode);
    });

    socket.on("language-update", (lang) => {
      setLanguage(lang);
    });

    return () => {
      socket.off("initial-code");
      socket.off("code-update");
      socket.off("language-update");
    };
  }, []);

  const handleChange = (value) => {
    if (isRemote.current) {
      isRemote.current = false;
      return;
    }
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      axios.put(`/api/rooms/${roomId}/code`, { code: value }).then(() => setSaved(true));
    }, 2000);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    socket.emit("language-change", { roomId, language: e.target.value });
  };

  const copyCode = () => navigator.clipboard.writeText(code);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-night-800 border-b border-night-700">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-night-700 border border-night-600 text-night-100 text-xs font-mono rounded px-2 py-1 focus:outline-none focus:border-electric-500"
        >
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <div className="flex items-center gap-3">
          {saved && <span className="text-neon-green text-xs font-sans animate-fade-in">Saved</span>}
          <button onClick={copyCode} className="text-night-300 hover:text-white transition-colors" title="Copy code">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            padding: { top: 16 },
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            renderLineHighlight: "gutter",
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
}
