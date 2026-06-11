export default function OnlineUsers({ users }) {
  return (
    <div className="px-4 py-3 border-b border-night-700 flex items-center gap-2">
      <div className="flex -space-x-2">
        {users.map((u) => (
          <div key={u._id} className="relative" title={u.name}>
            <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full border-2 border-night-900" />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-neon-green rounded-full border border-night-900" />
          </div>
        ))}
      </div>
      <span className="text-night-400 text-xs font-sans">
        {users.length} online
      </span>
    </div>
  );
}
