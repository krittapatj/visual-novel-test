import {useState} from "react";
export default function ChoiceEditor({scene,scenes,choices,onAdd,onRemove,busy}){
 const [label,setLabel]=useState("");const [target,setTarget]=useState("");
 if(!scene)return null;
 return <section className="scene-editor"><h2>ตัวเลือกของฉาก</h2>
 {choices.filter(c=>String(c.scene_id)===String(scene.scene_id)).map(c=><div key={c.choice_id} className="choice-line">{c.label} → {scenes.find(s=>String(s.scene_id)===String(c.next_scene_id))?.scene_name||"ตอนจบ"} <button disabled={busy} onClick={()=>onRemove(c.choice_id)}>ลบ</button></div>)}
 <form onSubmit={async e=>{e.preventDefault();await onAdd({scene_id:scene.scene_id,label,next_scene_id:target||null});setLabel("");setTarget("")}}>
 <label>ข้อความตัวเลือก</label><input required maxLength={255} value={label} onChange={e=>setLabel(e.target.value)}/>
 <label>ไปยังฉาก (ไม่เลือก = จบเรื่อง)</label><select value={target} onChange={e=>setTarget(e.target.value)}><option value="">จบเรื่อง</option>{scenes.map(s=><option key={s.scene_id} value={s.scene_id}>{s.scene_name}</option>)}</select>
 <button disabled={busy}>+ เพิ่มตัวเลือก</button></form></section>
}