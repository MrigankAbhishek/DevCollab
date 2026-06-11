import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp", "go", "rust", "html", "css"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", language: "javascript", isPrivate: false });
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/rooms").then((r) => setRooms(Array.isArray(r.data) ? r.data : [])).finally(() => setLoading(false));
  }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post("/api/rooms", form);
      setRooms((prev) => [data, ...prev]);
      setShowCreate(false);
      setForm({ name: "", description: "", language: "javascript", isPrivate: false });
      navigate(`/room/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    }
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post("/api/rooms/join", { inviteCode });
      navigate(`/room/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid invite code");
    }
  };

  return (
    <div className="min-h-screen bg-night-900">
      <header className="border-b border-night-700 bg-night-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-electric-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span className="font-display font-bold text-white text-lg">DevCollab</span>
          </div>
          <div className="flex items-center gap-3">
            <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-night-500" />
            <span className="text-night-200 text-sm font-sans hidden sm:block">{user?.name}</span>
            <button onClick={logout} className="btn-ghost text-sm py-1.5 px-3">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Your Rooms</h1>
            <p className="text-night-300 mt-1 font-sans">Collaborate in real-time with your team</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setShowJoin(true); setShowCreate(false); setError(""); }} className="btn-ghost border border-night-600 text-sm">
              Join room
            </button>
            <button onClick={() => { setShowCreate(true); setShowJoin(false); setError(""); }} className="btn-primary text-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New room
            </button>
          </div>
        </div>

        {(showCreate || showJoin) && (
          <div className="card p-6 mb-8 animate-slide-up border-electric-500 border-opacity-50">
            {showCreate && (
              <form onSubmit={createRoom} className="space-y-4">
                <h2 className="font-display font-bold text-white text-lg">Create a room</h2>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <input className="input" placeholder="Room name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="input" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <select className="input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <label className="flex items-center gap-2 cursor-pointer text-night-200 text-sm font-sans">
                  <input type="checkbox" checked={form.isPrivate} onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })} className="accent-electric-500" />
                  Private room
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary text-sm">Create room</button>
                  <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost text-sm">Cancel</button>
                </div>
              </form>
            )}
            {showJoin && (
              <form onSubmit={joinRoom} className="space-y-4">
                <h2 className="font-display font-bold text-white text-lg">Join a room</h2>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <input className="input font-mono" placeholder="Enter invite code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required />
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary text-sm">Join room</button>
                  <button type="button" onClick={() => setShowJoin(false)} className="btn-ghost text-sm">Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="w-16 h-16 bg-night-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-night-600">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7070a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <p className="text-night-300 font-sans">No rooms yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room, i) => (
              <button
                key={room._id}
                onClick={() => navigate(`/room/${room._id}`)}
                className="card p-5 text-left hover:border-electric-500 transition-all duration-200 hover:-translate-y-0.5 animate-slide-up group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-night-700 border border-night-600 flex items-center justify-center text-xs font-mono text-electric-400 group-hover:bg-electric-500 group-hover:text-white transition-colors">
                    {room.language?.slice(0, 2).toUpperCase()}
                  </div>
                  {room.isPrivate && (
                    <span className="text-xs bg-night-700 text-night-300 px-2 py-0.5 rounded-full font-sans border border-night-600">Private</span>
                  )}
                </div>
                <h3 className="font-sans font-semibold text-white mb-1 group-hover:text-electric-400 transition-colors">{room.name}</h3>
                {room.description && <p className="text-night-300 text-sm font-sans line-clamp-2 mb-3">{room.description}</p>}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-night-700">
                  <div className="flex -space-x-2">
                    {room.members?.slice(0, 4).map((m) => (
                      <img key={m._id} src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full border border-night-800" title={m.name} />
                    ))}
                    {room.members?.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-night-600 border border-night-800 flex items-center justify-center text-xs text-night-300">
                        +{room.members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-night-400 text-xs font-mono">{room.inviteCode}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
