const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/projects`;
async function request(projectId,path,options={}){
 const r=await fetch(`${BASE}/${projectId}/choices${path}`,{...options,headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`}});
 const j=await r.json();if(!r.ok)throw Error(j.message||"Choice request failed");return j.data;
}
export const getChoices=id=>request(id,"");
export const addChoice=(id,data)=>request(id,"",{method:"POST",body:JSON.stringify(data)});
export const removeChoice=(id,choiceId)=>request(id,`/${choiceId}`,{method:"DELETE"});
