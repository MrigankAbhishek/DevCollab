export default function Login() {
  const handleGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/auth/github`;
  };

  return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-600 opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-cyan opacity-5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-electric-500 flex items-center justify-center glow-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span className="font-display text-2xl font-bold text-white tracking-tight">DevCollab</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-3">
            Code together,<br />
            <span className="text-electric-400">ship faster</span>
          </h1>
          <p className="text-night-200 font-sans text-base leading-relaxed">
            Real-time collaborative coding with live chat, shared editor, and Kanban — all in one room.
          </p>
        </div>

        <div className="card p-8 glow-purple">
          <button
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-night-50 text-night-900 font-sans font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-xl group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <p className="text-center text-night-300 text-xs mt-4 font-sans">
            By continuing, you agree to our Terms of Service
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { icon: "⚡", label: "Real-time sync" },
            { icon: "🔒", label: "Private rooms" },
            { icon: "📋", label: "Kanban board" },
          ].map((f) => (
            <div key={f.label} className="text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-night-300 text-xs font-sans">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
