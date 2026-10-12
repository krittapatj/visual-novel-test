export default function SceneSidebar({ scenes, selectedId, onSelect, onAdd, adding }) {
  return (
    <aside className="scene-sidebar">
      <h3>Scenes</h3>
      {scenes.map((scene) => (
        <button
          key={scene.scene_id}
          className={String(selectedId) === String(scene.scene_id) ? "scene-item active" : "scene-item"}
          onClick={() => onSelect(scene.scene_id)}
        >
          {scene.scene_name}
        </button>
      ))}
      <button onClick={onAdd} disabled={adding}>
        {adding ? "Adding..." : "+ Add Scene"}
      </button>
    </aside>
  );
}