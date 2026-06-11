import { useState, useRef } from "react";
import axios from "axios";

export default function FileUpload() {
  const [uploads, setUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await axios.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploads((prev) => [data, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-night-700 bg-night-800 flex items-center justify-between">
        <h3 className="text-white font-sans font-semibold text-sm flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Files
        </h3>
        <button
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className="text-electric-400 hover:text-electric-300 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-electric-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          )}
        </button>
        <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {uploads.length === 0 && (
          <div
            onClick={() => inputRef.current.click()}
            className="border-2 border-dashed border-night-600 rounded-xl p-8 text-center cursor-pointer hover:border-electric-500 transition-colors mt-4"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7070a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="text-night-400 text-xs font-sans">Upload files or snippets</p>
            <p className="text-night-500 text-xs font-sans mt-1">Max 5MB</p>
          </div>
        )}
        {uploads.map((f, i) => (
          <a
            key={i}
            href={f.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 card p-3 hover:border-night-500 transition-colors group"
          >
            <div className="w-8 h-8 bg-night-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-night-100 text-xs font-sans truncate group-hover:text-electric-400 transition-colors">{f.name}</p>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7070a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
