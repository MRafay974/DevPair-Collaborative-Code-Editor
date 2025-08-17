import React, { useEffect, useState, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { createSocket } from "../sockets/socket";

const CodeEditor = ({ roomId, codeRef, initialCode, language }) => {
  const [code, setCode] = useState(initialCode || "");
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [activeUsers, setActiveUsers] = useState(0);
  
  const socket = useMemo(() => createSocket(), []); // one per page load

  useEffect(() => {
    socket.emit("join-room", roomId);
    setConnectionStatus("connected");

    socket.on("code-update", (updatedCode) => {
      setCode(updatedCode);
      codeRef.current = updatedCode;
    });

    socket.on("room-users", (users) => {
      setActiveUsers(users.length);
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("connect", () => {
      setConnectionStatus("connected");
    });

    return () => {
      socket.off("code-update");
      socket.off("room-users");
      socket.off("disconnect");
      socket.off("connect");
    };
  }, [roomId]);

  const handleEditorChange = (value) => {
    setCode(value);
    codeRef.current = value;
    socket.emit("code-change", { roomId, code: value });
  };

  const handleEditorDidMount = () => {
    setIsLoading(false);
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case "connected": return "text-success";
      case "disconnected": return "text-error";
      default: return "text-warning";
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected": return "🟢";
      case "disconnected": return "🔴";
      default: return "🟡";
    }
  };

  const getLanguageIcon = () => {
    const icons = {
      javascript: "🟨",
      python3: "🐍",
      c: "⚡",
      cpp: "⚡",
      java: "☕",
      csharp: "🔷",
      go: "🐹",
      ruby: "💎",
      php: "🐘",
      typescript: "🟦",
      bash: "🖥️",
      rust: "🦀",
      swift: "🍎",
      kotlin: "🎯",
      lua: "🌙",
      haskell: "λ",
      r: "📊"
    };
    return icons[language] || "📄";
  };

  return (
    <div className="relative">
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-base-300 px-4 py-2 border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getLanguageIcon()}</span>
            <span className="text-sm font-medium capitalize">{language}</span>
          </div>
          
          <div className="divider divider-horizontal my-0"></div>
          
          <div className="flex items-center gap-2 text-xs">
            <span className={`${getConnectionColor()}`}>
              {getConnectionIcon()}
            </span>
            <span className="text-base-content/70">
              {connectionStatus === "connected" ? "Live Sync" : connectionStatus}
            </span>
          </div>
          
          {activeUsers > 0 && (
            <>
              <div className="divider divider-horizontal my-0"></div>
              <div className="flex items-center gap-1 text-xs text-base-content/70">
                <span>👥</span>
                <span>{activeUsers} user{activeUsers !== 1 ? 's' : ''}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <span className="loading loading-spinner loading-xs"></span>
              <span>Loading editor...</span>
            </div>
          )}
          
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-base-300 text-xs">
              <li><span className="text-base-content/50">Monaco Editor</span></li>
              <li><span className="text-base-content/50">Vim keybindings: Ctrl+Alt+V</span></li>
              <li><span className="text-base-content/50">Command palette: F1</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative bg-[#1e1e1e] rounded-b-lg overflow-hidden">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-base-300 z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <span className="text-sm text-base-content/60">Initializing editor...</span>
            </div>
          </div>
        )}

        {/* Monaco Editor */}
        <Editor
          height="450px"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            automaticLayout: true,
            minimap: { enabled: true, scale: 1 },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            lineNumbers: "on",
            renderLineHighlight: "all",
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            automaticLayout: true,
            glyphMargin: true,
            folding: true,
            showFoldingControls: "mouseover",
            matchBrackets: "always",
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderWhitespace: "selection",
            guides: {
              indentation: true,
              highlightActiveIndentation: true
            }
          }}
        />

        {/* Status Bar */}
        <div className="bg-base-300 px-4 py-1 flex items-center justify-between text-xs text-base-content/60 border-t border-base-200/20">
          <div className="flex items-center gap-4">
            <span>Ready</span>
            {code && (
              <>
                <span>Lines: {code.split('\n').length}</span>
                <span>Chars: {code.length}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="uppercase">{language}</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;