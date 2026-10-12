import { Router } from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = Router({mergeParams:true}); router.use(verifyToken);
const valid = x => /^[1-9]\d*$/.test(String(x));
async function owner(req,res,next){
 if(!valid(req.params.projectId)) return res.status(400).json({message:"Invalid project"});
 const [[p]] = await db.execute("SELECT project_id FROM projects WHERE project_id=? AND user_id=?",[req.params.projectId,req.user.user_id]);
 if(!p) return res.status(404).json({message:"Project not found"}); next();
}
router.use((req,res,next)=>owner(req,res,next).catch(next));
router.get("/",async(req,res,next)=>{try{
 const [rows]=await db.execute(`SELECT c.* FROM choices c JOIN scenes s ON s.scene_id=c.scene_id WHERE s.project_id=? ORDER BY c.choice_order,c.choice_id`,[req.params.projectId]);res.json({success:true,data:rows});
}catch(e){next(e)}});
router.post("/",async(req,res,next)=>{try{
 const {scene_id,next_scene_id,label}=req.body;
 if(!valid(scene_id)||!label?.trim()||label.length>255|| (next_scene_id!=null&&!valid(next_scene_id))) return res.status(400).json({message:"Invalid choice"});
 const ids=next_scene_id==null?[scene_id]:[scene_id,next_scene_id];
 const [scenes]=await db.query(`SELECT scene_id FROM scenes WHERE project_id=? AND scene_id IN (${ids.map(()=>'?').join(',')})`,[req.params.projectId,...ids]);
 if(scenes.length!==new Set(ids.map(String)).size) return res.status(400).json({message:"Scene must belong to project"});
 const [r]=await db.execute("INSERT INTO choices(scene_id,next_scene_id,label) VALUES(?,?,?)",[scene_id,next_scene_id??null,label.trim()]);res.status(201).json({success:true,data:{choice_id:r.insertId,scene_id,next_scene_id:next_scene_id??null,label:label.trim()}});
}catch(e){next(e)}});
router.delete("/:choiceId",async(req,res,next)=>{try{
 if(!valid(req.params.choiceId)) return res.status(400).json({message:"Invalid choice ID"});
 const [r]=await db.execute("DELETE c FROM choices c JOIN scenes s ON c.scene_id=s.scene_id WHERE c.choice_id=? AND s.project_id=?",[req.params.choiceId,req.params.projectId]);
 res.status(r.affectedRows?200:404).json({success:!!r.affectedRows});
}catch(e){next(e)}});
export default router;
