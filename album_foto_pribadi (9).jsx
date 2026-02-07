import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AlbumFotoFull() {
  const styles = `
  .album-container { padding: 20px; background: linear-gradient(135deg, #ffe3ec, #e0f7fa); min-height: 100vh; font-family: Arial, sans-serif; }
  .menu-bar { display:flex; gap:15px; margin-bottom:20px; justify-content:center; align-items:center; background: rgba(255,255,255,0.3); backdrop-filter: blur(10px); padding:10px 20px; border-radius:15px; }
  .menu-bar button { background: linear-gradient(135deg, #89f7fe, #66a6ff); border:none; padding:8px 15px; border-radius:10px; cursor:pointer; font-weight:bold; color:#fff; transition: all 0.3s ease; }
  .menu-bar button:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(102,166,255,0.6); }
  .album-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap:20px; }
  .album-card { position:relative; border-radius:15px; overflow:hidden; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border:2px solid rgba(255,255,255,0.3); transition: all 0.3s ease; }
  .album-card:hover { box-shadow: 0 0 20px rgba(0,0,0,0.3); border-color: #00f0ff; }
  .album-title { text-align:center; padding:10px 0; font-weight:bold; color:#333; font-size:16px; cursor:pointer; }
  .album-frame { width:100%; height:0; border:none; border-radius:10px; transition: height 0.5s ease; }
  .album-frame.open { height:400px; }
  .album-controls { position:absolute; bottom:10px; left:10px; display:flex; gap:5px; background: rgba(0,0,0,0.3); padding:5px; border-radius:5px; }
  .settings-box { position:absolute; top:60px; right:20px; background:#ffffffaa; backdrop-filter: blur(10px); padding:20px; border-radius:10px; max-width:400px; z-index:100; }
  .settings-item { display:flex; flex-direction:column; margin-bottom:10px; }
  .settings-item select, .settings-item input { padding:5px; border-radius:5px; border:1px solid #ccc; margin-bottom:5px; }
  .settings-add { display:flex; flex-direction:column; gap:5px; margin-top:10px; }
  .settings-add button { background:#66a6ff; color:#fff; border:none; border-radius:5px; padding:5px; cursor:pointer; }
  .login-container { display:flex; justify-content:center; align-items:center; height:100vh; position:relative; overflow:hidden; }
  .login-background { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0.3; z-index:0; animation: slideBg 15s infinite; }
  @keyframes slideBg { 0%{opacity:0.3;} 33%{opacity:0.3;} 66%{opacity:0.3;} 100%{opacity:0.3;} }
  .login-box { position:relative; background: rgba(255,255,255,0.3); backdrop-filter: blur(10px); padding:30px; border-radius:15px; display:flex; flex-direction:column; gap:10px; z-index:1; }
  .error-text { color:red; }
  `;

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  const [auth, setAuth] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState("");
  const [DEFAULT_PASSWORD, setDefaultPassword] = useState("12345");
  const [bgImages, setBgImages] = useState([
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=800&q=60",
  ]);

  const [albums, setAlbums] = useState([
    { id: 1, title: "Dokumen Penting", link: "https://drive.google.com/drive/folders/139FME2cPBYOlr8c-e4XrGv8NwT5Oc1-i", open: false, slideshowIndex: 0 },
    { id: 2, title: "Liburan Bali", link: "https://drive.google.com/drive/folders/1-example-bali", open: false, slideshowIndex: 0 },
    { id: 3, title: "Ulang Tahun", link: "https://drive.google.com/drive/folders/2-example-birthday", open: false, slideshowIndex: 0 },
    { id: 4, title: "Kegiatan Sekolah", link: "https://drive.google.com/drive/folders/3-example-school", open: false, slideshowIndex: 0 },
    { id: 5, title: "Foto Keluarga", link: "https://drive.google.com/drive/folders/4-example-family", open: false, slideshowIndex: 0 },
  ]);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState(albums[0]?.id || null);
  const [fieldToEdit, setFieldToEdit] = useState("title");
  const [newValue, setNewValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newBg, setNewBg] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setAlbums(prev => prev.map(a => a.open ? { ...a, slideshowIndex: (a.slideshowIndex + 1) % 5 } : a));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      if (passInput === DEFAULT_PASSWORD) { setAuth(true); setPassInput(""); } 
      else setError("Password salah");
    }
  };

  const getDrivePreviewLink = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com/drive/folders")) {
      const folderId = url.split("/folders/")[1].split("?")[0];
      return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    }
    if (url.includes("drive.google.com/file/d/")) {
      const fileId = url.split("/file/d/")[1].split("/")[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  const updateAlbum = () => {
    setAlbums(albums.map(a => a.id === selectedAlbumId ? { ...a, [fieldToEdit]: newValue } : a));
    setNewValue("");
  };

  const addAlbum = () => {
    const newId = Math.max(0, ...albums.map(a => a.id)) + 1;
    setAlbums([...albums, { id: newId, title: "Album Baru", link: "", open: false, slideshowIndex: 0 }]);
    setSelectedAlbumId(newId);
  };

  const deleteAlbum = () => {
    setAlbums(albums.filter(a => a.id !== selectedAlbumId));
    setSelectedAlbumId(albums[0]?.id || null);
  };

  const toggleAlbum = (id) => setAlbums(albums.map(a => a.id === id ? { ...a, open: !a.open } : a));

  const resetPassword = () => { setDefaultPassword("12345"); alert("Password telah di-reset ke default"); };
  const renewPassword = () => { if (newPassword) { setDefaultPassword(newPassword); setNewPassword(""); alert("Password berhasil diperbarui"); } };
  const changeBackground = () => { if (newBg) { setBgImages([newBg]); setNewBg(""); alert("Background utama diperbarui"); } };

  if (!auth) return (
    <div className="login-container">
      {bgImages.map((bg, i) => <img key={i} src={bg} className="login-background" alt="bg" />)}
      <div className="login-box">
        <h2>Masukkan Password</h2>
        <input type="password" placeholder="Password" value={passInput} onChange={e => { setPassInput(e.target.value); setError(""); }} onKeyDown={handlePasswordKeyDown} />
        {error && <p className="error-text">{error}</p>}
        <button onClick={() => { if(passInput === DEFAULT_PASSWORD) { setAuth(true); setPassInput(""); } else setError("Password salah"); }}>Masuk</button>
      </div>
    </div>
  );

  return (
    <div className="album-container">
      <div className="menu-bar">
        <button onClick={() => setSettingsOpen(!settingsOpen)}>Settings</button>
        <button onClick={() => setAuth(false)}>Keluar</button>
      </div>

      {settingsOpen && (
        <div className="settings-box">
          <div className="settings-item">
            <label>Pilih Album:</label>
            <select value={selectedAlbumId} onChange={e => setSelectedAlbumId(Number(e.target.value))}>
              {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
          <div className="settings-item">
            <label>Field yang ingin diedit:</label>
            <select value={fieldToEdit} onChange={e => setFieldToEdit(e.target.value)}>
              <option value="title">Judul</option>
              <option value="link">Link</option>
            </select>
          </div>
          <div className="settings-item">
            <label>Nilai baru:</label>
            <input value={newValue} onChange={e => setNewValue(e.target.value)} />
          </div>
          <div className="settings-add">
            <button onClick={updateAlbum}>Update Album</button>
            <button onClick={addAlbum}>Tambah Album</button>
            <button onClick={deleteAlbum}>Hapus Album</button>
          </div>
          <hr />
          <div className="settings-item">
            <label>Ganti Password Baru:</label>
            <input placeholder="Password baru" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button onClick={renewPassword}>Perbarui Password</button>
            <button onClick={resetPassword}>Reset Password Default</button>
          </div>
          <div className="settings-item">
            <label>Ganti Background Utama:</label>
            <input placeholder="URL background baru" value={newBg} onChange={e => setNewBg(e.target.value)} />
            <button onClick={changeBackground}>Perbarui Background</button>
          </div>
        </div>
      )}

      <div className="album-grid">
        {albums.map(album => (
          <div key={album.id} className="album-card">
            <div className="album-title" onClick={() => toggleAlbum(album.id)}>{album.title}</div>
            <iframe src={getDrivePreviewLink(album.link)} className={`album-frame ${album.open ? "open" : ""}`} title={album.title}></iframe>
            {album.open && (
              <div className="album-controls">
                <button onClick={() => alert("Zoom In")}>Zoom In</button>
                <button onClick={() => alert("Zoom Out")}>Zoom Out</button>
                <button onClick={() => alert("Fullscreen")}>Fullscreen</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
