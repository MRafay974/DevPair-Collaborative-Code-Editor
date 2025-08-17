import { useRef, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeEditor from "../components/Editor";
import ChatBox from "../components/ChatBot";
import UserList from "../components/UserList";
import { createSocket } from "../sockets/socket";
import axios from "axios";

const Room = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();

  const codeRef = useRef("");
  const messagesRef = useRef([]);

  const [initialCode, setInitialCode] = useState(null);
  const [initialMessages, setInitialMessages] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [copyMessage, setCopyMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [userActivity, setUserActivity] = useState(new Map()); // Track user activity

  const socket = useMemo(() => createSocket(), []);

  useEffect(() => {
    let isMounted = true;

    const handleUsersUpdate = (usersList) => {
      if (isMounted) {
        console.log("Room users updated:", usersList);
        setUsers(usersList);
        
        // Update activity tracking - mark all current users as active
        setUserActivity(prev => {
          const newActivity = new Map(prev);
          usersList.forEach(user => {
            newActivity.set(user.userId, {
              username: user.username,
              status: 'active',
              lastSeen: Date.now()
            });
          });
          return newActivity;
        });
      }
    };

    const handleUserLeft = (userData) => {
      if (isMounted) {
        console.log("User left room:", userData);
        // Add user to activity tracking as "left"
        setUserActivity(prev => {
          const newActivity = new Map(prev);
          newActivity.set(userData.userId, {
            username: userData.username,
            status: 'left',
            leftAt: Date.now()
          });
          return newActivity;
        });
      }
    };

    socket.on("room-users", handleUsersUpdate);
    socket.on("user-left-room", handleUserLeft);
    socket.emit("join-room", roomId);

    const handleBeforeUnload = () => {
      socket.emit("leave-room", roomId);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isMounted = false;
      socket.off("room-users", handleUsersUpdate);
      socket.off("user-left-room", handleUserLeft);
      socket.emit("leave-room", roomId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, roomId]);

  useEffect(() => {
    axios
      .get(`https://dev-pair-backendd.vercel.app/api/session/${roomId}`)
      .then((res) => {
        if (res.data) {
          const { code = "", chatHistory = [], language: lang = "javascript" } = res.data;
          setInitialCode(code);
          codeRef.current = code;
          setInitialMessages(chatHistory);
          messagesRef.current = chatHistory;
          setLanguage(lang || "javascript");
        }
      })
      .catch(() => {
        axios
          .post("https://dev-pair-backendd.vercel.app/api/session", {
            sessionId: roomId,
            code: "",
            language: "javascript",
            chatHistory: [],
          })
          .then(() => {
            setInitialCode("");
            setInitialMessages([]);
            setLanguage("javascript");
          });
      });
  }, [roomId]);

  const handleLeaveRoom = async () => {
    setSaveStatus("saving");
    
    try {
      await axios.put(`https://dev-pair-backendd.vercel.app/api/session/${roomId}`, {
        code: codeRef.current,
        chatHistory: messagesRef.current,
        language,
      });
      setSaveStatus("saved");
    } catch (err) {
      console.error("Error saving session:", err);
      setSaveStatus("error");
    }

    // Emit leave-room and wait for acknowledgment before navigating
    socket.emit("leave-room", roomId, () => {

      // Navigate only after the server acknowledges
      navigate("/home");
    });

    // Fallback navigation in case acknowledgment doesn't come
    setTimeout(() => {
      navigate("/home");
    }, 2000);
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await axios.post("https://dev-pair-backendd.vercel.app/api/execute", {
        language,
        code: codeRef.current,
      });
      setOutput(res.data.output || "No output.");
    } catch (err) {
      setOutput("❌ Error executing code.");
    } finally {
      setLoading(false);
    }
  };

  const copyRoomLink = async () => {
    const roomUrl = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopyMessage("Room link copied!");
      setTimeout(() => setCopyMessage(""), 2000);
    } catch (err) {
      console.error("Failed to copy room link:", err);
      setCopyMessage("Failed to copy!");
      setTimeout(() => setCopyMessage(""), 2000);
    }
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopyMessage("Room ID copied!");
      setTimeout(() => setCopyMessage(""), 2000);
    } catch (err) {
      console.error("Failed to copy room ID:", err);
      setCopyMessage("Failed to copy!");
      setTimeout(() => setCopyMessage(""), 2000);
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

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case "saving": return "⏳";
      case "error": return "❌";
      default: return "✅";
    }
  };

  const isLoaded = initialCode !== null && initialMessages !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="mx-auto max-w-7xl p-4 md:p-6 space-y-6">
        <div className="navbar rounded-2xl bg-base-100 shadow-xl border border-base-300/50 backdrop-blur-sm">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-xl w-12 h-12">
                  <span className="text-xl">💻</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-base-content">
                  Collaboration Room
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-primary badge-sm font-mono">{roomId}</span>
                  <button
                    onClick={copyRoomLink}
                    className="btn btn-ghost btn-xs hover:btn-primary"
                    title="Copy room link"
                  >
                    📋
                  </button>
                  <div className="flex items-center gap-1 text-xs text-base-content/60">
                    <span>{getSaveStatusIcon()}</span>
                    <span className="hidden sm:inline">
                      {saveStatus === "saving" ? "Saving..." : 
                       saveStatus === "error" ? "Save failed" : "Saved"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-none">
            <button
              onClick={handleLeaveRoom}
              className="btn btn-error btn-sm md:btn-md hover:scale-105 transition-transform shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline ml-1">Leave Room</span>
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-300/50 rounded-2xl">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getLanguageIcon()}</span>
                  <label className="label p-0">
                    <span className="label-text font-semibold">Language</span>
                  </label>
                </div>
                <select
                  className="select select-bordered select-primary w-full sm:w-64 font-medium"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python3">Python</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="ruby">Ruby</option>
                  <option value="php">PHP</option>
                  <option value="typescript">TypeScript</option>
                  <option value="bash">Bash</option>
                  <option value="rust">Rust</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="lua">Lua</option>
                  <option value="haskell">Haskell</option>
                  <option value="r">R</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="stats shadow-sm">
                  <div className="stat py-2 px-4">
                    <div className="stat-title text-xs">Code Lines</div>
                    <div className="stat-value text-sm">
                      {codeRef.current ? codeRef.current.split('\n').length : 0}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={runCode}
                  disabled={loading}
                  className="btn btn-primary btn-lg hover:scale-105 transition-transform shadow-lg"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span className="hidden sm:inline ml-2">Running...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span className="hidden sm:inline ml-2">Run Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="card bg-base-100 shadow-xl border border-base-300/50 rounded-2xl overflow-hidden">
              <div className="card-body p-0">
                {!isLoaded ? (
                  <div className="flex flex-col items-center justify-center p-12">
                    <span className="loading loading-ring loading-lg text-primary mb-4"></span>
                    <h3 className="text-lg font-semibold mb-2">Loading Session</h3>
                    <p className="text-sm text-base-content/60">Retrieving your code and chat history...</p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <CodeEditor
                      roomId={roomId}
                      codeRef={codeRef}
                      initialCode={initialCode}
                      language={language}
                      socket={socket}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-300/50 rounded-2xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title flex items-center gap-2">
                    <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Output Console
                  </h3>
                  {output && (
                    <button
                      onClick={() => setOutput("")}
                      className="btn btn-ghost btn-xs"
                      title="Clear output"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                
                <div className="rounded-xl bg-gradient-to-br from-base-300 to-base-200 p-6 min-h-[150px] overflow-auto border-2 border-dashed border-base-300">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-24">
                      <span className="loading loading-dots loading-lg text-primary mb-2"></span>
                      <span className="text-sm font-medium">Executing code...</span>
                    </div>
                  ) : output ? (
                    <pre className="text-sm whitespace-pre-wrap break-words font-mono leading-relaxed">
                      {output}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 text-base-content/50">
                      <div className="text-3xl mb-2">⚡</div>
                      <span className="text-sm">Run your code to see output here</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="card bg-base-100 shadow-xl border border-base-300/50 rounded-2xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="card-title text-base">Active Collaborators</h3>
                  <span className="badge badge-primary badge-sm">{users.length}</span>
                </div>
                <UserList users={users} userActivity={userActivity} />
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-300/50 rounded-2xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <div className="indicator">
                    <span className="indicator-item badge badge-primary badge-xs animate-pulse"></span>
                    <div className="bg-primary/20 rounded-full p-2">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="card-title text-base">Team Chat</h3>
                </div>
                
                {!isLoaded ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <span className="loading loading-ring loading-md text-primary mb-3"></span>
                    <span className="text-sm text-base-content/60">Loading chat history...</span>
                  </div>
                ) : (
                  <ChatBox
                    roomId={roomId}
                    messagesRef={messagesRef}
                    initialMessages={initialMessages}
                    socket={socket}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-base-100 rounded-2xl shadow-lg border border-base-300/50">
          <div className="flex items-center gap-4 text-sm text-base-content/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Live collaboration active</span>
            </div>
            <div className="hidden sm:block">•</div>
            <span className="hidden sm:inline">Room ID: {roomId}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={copyRoomId}
                className="btn btn-ghost btn-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline ml-1">Copy Room ID</span>
              </button>
              
              {copyMessage && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-success text-success-content text-xs rounded-lg shadow-lg animate-bounce">
                  {copyMessage}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-success"></div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLeaveRoom}
              className="btn btn-error hover:scale-105 transition-transform"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline ml-1">Leave Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;