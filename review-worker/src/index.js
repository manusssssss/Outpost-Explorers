const allowedOrigin = 'https://manusssssss.github.io';
const cors = {'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin'};
const reply = (body, status=200) => new Response(JSON.stringify(body), {status, headers: {...cors, 'Content-Type':'application/json', 'Cache-Control':'no-store'}});
export class ReviewInbox {
  constructor(ctx) { this.ctx=ctx; this.ctx.storage.sql.exec("CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, rating INTEGER NOT NULL, message TEXT NOT NULL)"); }
  async fetch(request) {
    const data=await request.json();
    this.ctx.storage.sql.exec("INSERT INTO reviews (id, created_at, rating, message) VALUES (?, ?, ?, ?)",crypto.randomUUID(),new Date().toISOString(),data.rating,data.message);
    return new Response(null,{status:204});
  }
}
export default {
  async fetch(request, env) {
    if (request.headers.get('Origin') !== allowedOrigin) return reply({error:'Origin not allowed'},403);
    if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:cors});
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/review') return reply({error:'Not found'},404);
    if (!env.REVIEW_EMAIL) return reply({error:'Email delivery is not configured'},503);
    if (Number(request.headers.get('Content-Length') || 0) > 5000) return reply({error:'Review too long'},413);
    let data; try {const text=await request.text();if(text.length>5000)return reply({error:'Review too long'},413);data=JSON.parse(text);}catch{return reply({error:'Invalid request'},400);}
    const rating=Number(data.rating),message=typeof data.message==='string'?data.message.trim():'';
    if(!Number.isInteger(rating)||rating<1||rating>10||!message||message.length>1000)return reply({error:'Please provide a rating and a review up to 1000 characters.'},400);
    try {
      const inbox=env.REVIEWS.get(env.REVIEWS.idFromName('reviews'));
      const stored=await inbox.fetch(new Request('https://inbox.internal/',{method:'POST',body:JSON.stringify({rating,message})}));
      if(!stored.ok)return reply({error:'Review could not be saved.'},503);
    }catch{return reply({error:'Review could not be saved.'},503);}
    try {
      const upstream=await fetch('https://formsubmit.co/ajax/'+encodeURIComponent(env.REVIEW_EMAIL),{method:'POST',signal:AbortSignal.timeout(10000),headers:{'Content-Type':'application/json','Accept':'application/json','Origin':allowedOrigin,'Referer':allowedOrigin+'/Outpost-Explorers/','User-Agent':'Mozilla/5.0 (compatible; OutpostReview/1.0)' },body:JSON.stringify({_subject:'Outpost Explorers review',rating:`${rating} / 10`,review:message,_captcha:'false'})});
      const result=await upstream.json().catch(()=>({}));
      if(!upstream.ok || String(result.success)==='false')return reply({accepted:true,emailSent:false});
      return reply({accepted:true,emailSent:true});
    }catch{return reply({accepted:true,emailSent:false});}
  }
};
