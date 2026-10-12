import "../styles/reader.css";
import {useEffect,useState} from "react";import {useParams,useNavigate} from "react-router-dom";
import {getScenes} from "../services/sceneService";import {getChoices} from "../services/choiceService";
export default function Reader(){const {projectId}=useParams();const navigate=useNavigate();const [scenes,setScenes]=useState([]),[choices,setChoices]=useState([]),[current,setCurrent]=useState(null),[error,setError]=useState("");
 useEffect(()=>{Promise.all([getScenes(projectId),getChoices(projectId)]).then(([s,c])=>{setScenes(s);setChoices(c);setCurrent(s[0]?.scene_id??null)}).catch(e=>setError(e.message))},[projectId]);
 const scene=scenes.find(s=>String(s.scene_id)===String(current));const options=choices.filter(c=>String(c.scene_id)===String(current));
 return <main className="reader-page"><button onClick={()=>navigate(`/projects/${projectId}/editor`)}>← กลับ Editor</button><button onClick={()=>setCurrent(scenes[0]?.scene_id??null)}>เริ่มใหม่</button>{error&&<p role="alert">{error}</p>}
 {scene?<article className="reader-scene" style={scene.background_url?{backgroundImage:`linear-gradient(#0006,#0009),url(${scene.background_url})`}:{}}><h1>{scene.scene_name}</h1><p>{scene.text||"ยังไม่มีเนื้อเรื่อง"}</p>{options.length?options.map(c=><button key={c.choice_id} onClick={()=>setCurrent(c.next_scene_id)}>{c.label}</button>):<p>— จบฉาก —</p>}</article>:<p>จบเรื่อง หรือยังไม่มีฉาก</p>}</main>
}