import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";
import CodeEditor from "../components/Editor";
import Chat from "../components/Chat";
import KanbanBoard from "../components/KanbanBoard";
import FileUpload from "../components/FileUpload";
import OnlineUsers from "../components/OnlineUsers";

const TABS = ["Chat", "Kanban", "Files"];

export default function RoomPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Chat");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/rooms/${id}`)
      .then((r) => setRoom(r.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !room) return;
    if (!socket.connected) socket.connect();

    socket.emit("join-room", {
      roomId: id,
      user: { _id: user._id, name: user.name, avatar: user.avatar },
    });

    socket.on("room-users", (users) => setOnlineUsers(users));

    return () => {
      socket.off("room-users");
      socket.disconnect();
    };
  }, [user, room, id]);

  const copyInvite = () => {
    navigator.clipboard.writeText(room.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen bg-night-900 flex flex-col overflow-hidden">
      <header className="border-b border-night-700 bg-night-800 z-20 flex-shrink-0">
        <div className="px-4 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="text-night-400 hover:text-white transition-colors flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </Link>
            <div className="w-px h-4 bg-night-700" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded bg-electric-600 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <span className="font-sans font-semibold text-white text-sm truncate">{room?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <OnlineUsers users={onlineUsers} />
            <button
              onClick={copyInvite}
              className="flex items-center gap-1.5 text-xs font-mono text-night-300 hover:text-white bg-night-700 hover:bg-night-600 px-3 py-1.5 rounded-lg transition-all border border-night-600"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-neon-green">Copied!</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  {room?.inviteCode}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden border-r border-night-700">
          <CodeEditor roomId={id} />
        </div>

        <div className="w-80 flex flex-col flex-shrink-0 bg-night-800">
          <div className="flex border-b border-night-700 flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs font-sans font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-electric-400 border-b-2 border-electric-500"
                    : "text-night-400 hover:text-night-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === "Chat" && <Chat roomId={id} user={user} />}
            {activeTab === "Kanban" && <KanbanBoard roomId={id} user={user} />}
            {activeTab === "Files" && <FileUpload />}
          </div>
        </div>
      </div>
    </div>
  );
}
