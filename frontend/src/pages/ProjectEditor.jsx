import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getScenes, createScene, updateScene, deleteScene } from "../services/sceneService";
import SceneSidebar from "../components/editor/SceneSidebar";
import SceneEditor from "../components/editor/SceneEditor";
import "../styles/projectEditor.css";

export default function ProjectEditor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [scenes, setScenes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getScenes(projectId)
      .then((data) => {
        if (!active) return;
        setScenes(data);
        setSelectedId(data[0]?.scene_id ?? null);
        setError("");
      })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [projectId]);

  const add = async () => {
    setBusy(true); setError(""); setNotice("");
    try {
      const scene = await createScene(projectId, { scene_name: "New Scene", background_url: null });
      setScenes((prev) => [...prev, scene]);
      setSelectedId(scene.scene_id);
      setNotice("Scene created");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const save = async (sceneId, data) => {
    setBusy(true); setError(""); setNotice("");
    try {
      const updated = await updateScene(projectId, sceneId, data);
      setScenes((prev) => prev.map((s) => s.scene_id === sceneId ? updated : s));
      setNotice("Saved successfully");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const remove = async (sceneId) => {
    if (!window.confirm("Delete this scene?")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await deleteScene(projectId, sceneId);
      const remaining = scenes.filter((s) => s.scene_id !== sceneId);
      setScenes(remaining);
      setSelectedId(remaining[0]?.scene_id ?? null);
      setNotice("Scene deleted");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const selected = scenes.find((s) => s.scene_id === selectedId) || null;
  return (
    <main className="project-editor-page">
      <header className="editor-header">
        <button onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <h1>Project #{projectId} — Editor</h1>
      </header>
      {error && <p role="alert" className="error">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {loading ? <p>Loading scenes...</p> : (
        <div className="editor-layout">
          <SceneSidebar scenes={scenes} selectedId={selectedId} onSelect={setSelectedId} onAdd={add} adding={busy} />
          <SceneEditor key={selectedId ?? "empty"} scene={selected} onSave={save} onDelete={remove} saving={busy} />
        </div>
      )}
    </main>
  );
}