import {useEffect,useState} from "react";
export default function SceneEditor({scene,onSave,onDelete,saving}){
 const [name,setName]=useState("");const [backgroundUrl,setBackgroundUrl]=useState("");const [story,setStory]=useState("");
 useEffect(()=>{setName(scene?.scene_name||"");setBackgroundUrl(scene?.background_url||"");setStory(scene?.text||"")},[scene]);
 if(!scene)return <section className="scene-editor">เลือกฉากหรือสร้างฉากใหม่</section>;
 return <section className="scene-editor"><h2>แก้ไขฉาก</h2><form onSubmit={e=>{e.preventDefault();onSave(scene.scene_id,{scene_name:name,background_url:backgroundUrl||null,text:story})}}>
 <label>ชื่อฉาก</label><input required maxLength={255} value={name} onChange={e=>setName(e.target.value)}/>
 <label>URL ภาพพื้นหลัง</label><input type="url" value={backgroundUrl} onChange={e=>setBackgroundUrl(e.target.value)}/>
 <label>บทสนทนา / เนื้อเรื่อง</label><textarea rows={8} value={story} onChange={e=>setStory(e.target.value)}/>
 {backgroundUrl&&<img className="scene-preview" src={backgroundUrl} alt="ภาพพื้นหลัง"/>}
 <div className="editor-actions"><button disabled={saving}>บันทึกฉาก</button><button type="button" onClick={()=>onDelete(scene.scene_id)}>ลบฉาก</button></div></form></section>
}