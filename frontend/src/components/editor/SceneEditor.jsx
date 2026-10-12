import { useEffect, useState } from "react";

export default function SceneEditor({ scene, onSave, onDelete, saving }) {
  const [name, setName] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  useEffect(() => {
    setName(scene?.scene_name || "");
    setBackgroundUrl(scene?.background_url || "");
  }, [scene]);

  if (!scene) return <section className="scene-editor"><p>Select or add a scene.</p></section>;

  return (
    <section className="scene-editor">
      <h2>Scene Editor</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave(scene.scene_id, { scene_name: name, background_url: backgroundUrl || null });
      }}>
        <label>Scene Name</label>
        <input required maxLength={255} value={name} onChange={(e) => setName(e.target.value)} />
        <label>Background URL</label>
        <input type="url" value={backgroundUrl} onChange={(e) => setBackgroundUrl(e.target.value)} placeholder="https://..." />
        {backgroundUrl && <img className="scene-preview" src={backgroundUrl} alt="Scene background preview" />}
        <div className="editor-actions">
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Scene"}</button>
          <button type="button" onClick={() => onDelete(scene.scene_id)}>Delete Scene</button>
        </div>
      </form>
    </section>
  );
}