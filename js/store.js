/* ============ Calc Dojo store: progress, daily stats, runs, Tempo, cloud sync, login ============ */
/* Needs core.js first (T, byId, MASTER, I, f). Pages may define: window.onData() -> re-render after data changes. */

/* ---------- local storage ---------- */
const KEY='mm-lab-v1', DKEY='mm-dojo-v1', PKEY='mm-play-v1';
let S={};      // per technique: {c,w,s,b}
let D={days:{},runs:[]}; // days: {'YYYY-MM-DD':{a,c}}, runs: finished plays {cid,t,mode,sc,tot,secs,bs,tp}
try{S=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){S={}}
try{const d=JSON.parse(localStorage.getItem(DKEY)||'null');if(d&&d.days)D={days:d.days,runs:d.runs||[]}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const saveD=()=>{try{localStorage.setItem(DKEY,JSON.stringify(D))}catch(e){}};
const st=id=>S[id]||(S[id]={c:0,w:0,s:0,b:0});
const mastered=id=>st(id).b>=MASTER;
const dataChanged=()=>{if(typeof window.onData==='function')window.onData()};

/* play preferences (levels chosen for sprint / free) */
function getPrefs(){let p={lv:[true,true,false]};try{const x=JSON.parse(localStorage.getItem(PKEY)||'null');if(x&&Array.isArray(x.lv)&&x.lv.length===3&&x.lv.some(Boolean))p=x}catch(e){}return p}
function setPrefs(p){try{localStorage.setItem(PKEY,JSON.stringify(p))}catch(e){}}

/* ---------- dates ---------- */
const p2d=n=>String(n).padStart(2,'0');
const dayKey=(d=new Date())=>`${d.getFullYear()}-${p2d(d.getMonth()+1)}-${p2d(d.getDate())}`;
const fromKey=k=>{const[a,b,c]=k.split('-').map(Number);return new Date(a,b-1,c)};
const addDays=(d,n)=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x};
const TH_M=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const thDate=k=>{const d=fromKey(k);return `${d.getDate()} ${TH_M[d.getMonth()]}`};

/* ---------- Tempo ---------- */
/* Tempo = weighted correct answers per minute in a Sprint. Harder levels count more (1 / 1.5 / 2), so only answering
   fast AND on harder problems raises it; doing lots of easy problems slowly does not.
   Your current Tempo is the average of your last 5 Sprints. Weights and tier thresholds are first guesses, not calibrated. */
const TW=[1,1.5,2];
const TIERS=[{th:'อุ่นเครื่อง',at:0},{th:'ติดจังหวะ',at:5},{th:'คล่อง',at:8},{th:'ไว',at:12},{th:'เฉียบ',at:16},{th:'ทะลุ',at:20}];
const tierIdx=v=>{let k=0;TIERS.forEach((t,i)=>{if(v>=t.at)k=i});return k};
const runTempo=r=>r.tp!=null?r.tp:r.secs>0?+(r.sc/(r.secs/60)).toFixed(2):0;
const tempos=()=>D.runs.filter(r=>r.mode==='sprint'&&r.tot>0).map(runTempo);
const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
function tempoNow(upTo){const t=tempos();const a=t.slice(Math.max(0,(upTo==null?t.length:upTo)-5),upTo==null?t.length:upTo);return a.length?{v:avg(a),n:a.length}:null}
function tempoPrev(){const t=tempos();if(t.length<8)return null;const a=t.slice(Math.max(0,t.length-10),t.length-5);return a.length>=3?{v:avg(a),n:a.length}:null}
const tempoBest=()=>tempos().reduce((m,v)=>Math.max(m,v),0);

/* ---------- recording ---------- */
const GOAL=30; // answers per day
function record(id,ok){
  const s=st(id);if(ok){s.c++;s.s++;s.b=Math.max(s.b,s.s)}else{s.w++;s.s=0}
  const k=dayKey(),d=D.days[k]||(D.days[k]={a:0,c:0});d.a++;if(ok)d.c++;
  save();saveD();pushOne(id);pushDay(k);dataChanged()}
function addRun(r){
  const run={cid:Date.now().toString(36)+Math.random().toString(36).slice(2,7),t:new Date().toISOString(),mode:r.mode,sc:r.score,tot:r.total,secs:r.secs,bs:r.bs,tp:r.secs>0?+(r.wc/(r.secs/60)).toFixed(2):0};
  D.runs.push(run);if(D.runs.length>300)D.runs=D.runs.slice(-300);
  saveD();pushRuns([run]);dataChanged();return run}

/* ---------- derived stats ---------- */
const today=()=>D.days[dayKey()]||{a:0,c:0};
function streakDays(){let d=new Date(),n=0;if(!(D.days[dayKey(d)]||{a:0}).a)d=addDays(d,-1);
  while((D.days[dayKey(d)]||{a:0}).a>0){n++;d=addDays(d,-1)}return n}
const sprintRuns=()=>D.runs.filter(r=>r.mode==='sprint');
const bestSprint=()=>sprintRuns().reduce((m,r)=>Math.max(m,r.sc),0);
const bestRunStreak=()=>D.runs.reduce((m,r)=>Math.max(m,r.bs||0),0);
function totals(){let a=0,c=0;Object.values(D.days).forEach(d=>{a+=d.a;c+=d.c});return{a,c}}
/* accuracy over a window of days: from..to are day offsets back from today (0 = today) */
function winAcc(fromBack,toBack){let a=0,c=0;for(let i=toBack;i<=fromBack;i++){const d=D.days[dayKey(addDays(new Date(),-i))];if(d){a+=d.a;c+=d.c}}return{a,c,pct:a?Math.round(100*c/a):null}}

/* ---------- Supabase ---------- */
/* The key below is a publishable (client-side) key. Data is protected by row-level security:
   each signed-in user can read and write only their own rows. Never put a service_role key in this file. */
const SB_URL='https://ftogfctliqygrazncjra.supabase.co';
const SB_KEY='sb_publishable_i6PTzYX_ZE7VR7zm_MhOSQ_pKPgactj';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SYNC_TXT={ok:'ซิงก์แล้ว',syncing:'กำลังซิงก์…',error:'ซิงก์ไม่สำเร็จ ข้อมูลยังอยู่ในเครื่อง'};
let sb=null,user=null,syncState='ok';
try{if(window.supabase)sb=window.supabase.createClient(SB_URL,SB_KEY)}catch(e){sb=null}
function setSync(s){syncState=s;const d=document.getElementById('syncDot');if(d)d.className='dot-sync '+s;const t=document.getElementById('syncTxt');if(t)t.textContent=SYNC_TXT[s]}
const activeIds=()=>T.filter(t=>{const s=S[t.id];return s&&(s.c||s.w)}).map(t=>t.id);
const pend={};
const later=(key,fn)=>{if(!sb||!user)return;clearTimeout(pend[key]);pend[key]=setTimeout(fn,500)};
async function upsert(table,rows,conflict){
  if(!sb||!user||!rows.length)return true;setSync('syncing');
  try{for(let i=0;i<rows.length;i+=200){const{error}=await sb.from(table).upsert(rows.slice(i,i+200),{onConflict:conflict});if(error){setSync('error');return false}}setSync('ok');return true}
  catch(e){setSync('error');return false}}
const techRow=id=>{const s=st(id);return{user_id:user.id,technique_id:id,correct:s.c,wrong:s.w,streak:s.s,best_streak:s.b,updated_at:new Date().toISOString()}};
const dayRow=k=>({user_id:user.id,day:k,attempts:D.days[k].a,correct:D.days[k].c,updated_at:new Date().toISOString()});
const runRow=r=>({user_id:user.id,client_id:r.cid,played_at:r.t,mode:r.mode,score:r.sc,total:r.tot,secs:r.secs|0,best_streak:r.bs|0,belt:0,passed:false,tempo:r.tp==null?null:r.tp});
function pushOne(id){later('t'+id,()=>upsert('technique_progress',[techRow(id)],'user_id,technique_id'))}
function pushDay(k){later('d'+k,()=>D.days[k]&&upsert('daily_stats',[dayRow(k)],'user_id,day'))}
function pushRuns(rs){if(sb&&user)upsert('play_runs',rs.map(runRow),'user_id,client_id')}
const flush=ids=>upsert('technique_progress',ids.map(techRow),'user_id,technique_id');
async function flushAll(){
  const a=await flush(activeIds());
  const b=await upsert('daily_stats',Object.keys(D.days).filter(k=>D.days[k].a>0).map(dayRow),'user_id,day');
  const c=await upsert('play_runs',D.runs.map(runRow),'user_id,client_id');
  setSync(a&&b&&c?'ok':'error');return a&&b&&c}
/* merge rules: per technique and per day the side with more attempts wins its counts (best streak = max);
   runs are a union by client id. */
async function pullAndMerge(){
  if(!sb||!user)return;setSync('syncing');
  try{
    const[t,d,r]=await Promise.all([
      sb.from('technique_progress').select('technique_id,correct,wrong,streak,best_streak'),
      sb.from('daily_stats').select('day,attempts,correct'),
      sb.from('play_runs').select('client_id,played_at,mode,score,total,secs,best_streak,tempo').order('played_at',{ascending:false}).limit(300)]);
    if(t.error||d.error||r.error){setSync('error');return}
    (t.data||[]).forEach(x=>{if(!byId[x.technique_id])return;const l=st(x.technique_id);
      if(x.correct+x.wrong>l.c+l.w){l.c=x.correct;l.w=x.wrong;l.s=x.streak}l.b=Math.max(l.b,x.best_streak)});
    (d.data||[]).forEach(x=>{const k=String(x.day).slice(0,10),l=D.days[k];if(!l||x.attempts>l.a)D.days[k]={a:x.attempts,c:x.correct}});
    const have=new Set(D.runs.map(x=>x.cid));
    (r.data||[]).forEach(x=>{if(!have.has(x.client_id))D.runs.push({cid:x.client_id,t:x.played_at,mode:x.mode,sc:x.score,tot:x.total,secs:x.secs,bs:x.best_streak,tp:x.tempo==null?null:+x.tempo})});
    D.runs.sort((a,b)=>a.t<b.t?-1:1);if(D.runs.length>300)D.runs=D.runs.slice(-300);
    save();saveD();dataChanged();
    await flushAll();
  }catch(e){setSync('error')}}

/* ---------- login UI ---------- */
function renderAuth(){
  const box=document.getElementById('authBox');if(!box)return;
  if(!sb){box.innerHTML='';return}
  if(!user){box.innerHTML=`<button class="btn" id="authOpen">${I('user')}เข้าสู่ระบบ</button>`;authOpen.onclick=()=>openDlg('in');return}
  box.innerHTML=`<button class="btn ghost" id="authMe" aria-label="บัญชีของฉัน"><i class="dot-sync ${syncState}" id="syncDot"></i><span class="who">${esc(user.email||'บัญชีของฉัน')}</span></button>`;
  authMe.onclick=()=>openDlg('account')}
function errTh(m){m=String(m||'');
  if(/Invalid login credentials/i.test(m))return'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  if(/Email not confirmed/i.test(m))return'ยังไม่ได้ยืนยันอีเมล เปิดลิงก์ในอีเมลก่อนแล้วลองใหม่';
  if(/already registered|already been registered/i.test(m))return'อีเมลนี้สมัครไว้แล้ว ลองกดเข้าสู่ระบบ';
  if(/at least \d+ characters|weak/i.test(m))return'รหัสผ่านสั้นเกินไป ใช้อย่างน้อย 6 ตัว';
  if(/rate limit|too many/i.test(m))return'ส่งคำขอบ่อยเกินไป รอสักครู่แล้วลองใหม่';
  if(/invalid.*email|valid email/i.test(m))return'รูปแบบอีเมลไม่ถูกต้อง';
  if(/fetch|network|Failed/i.test(m))return'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (หน้า artifact ใน claude.ai บล็อกการเชื่อมต่อภายนอก ให้เปิดเว็บจากที่โฮสต์เอง)';
  return'เกิดข้อผิดพลาด: '+m}
let lastFocus=null;
function closeDlg(){const e=document.getElementById('scrim');if(e){e.remove();if(lastFocus&&lastFocus.focus)lastFocus.focus()}}
function openDlg(kind){
  closeDlg();lastFocus=document.activeElement;
  const el=document.createElement('div');el.className='scrim';el.id='scrim';
  el.innerHTML=kind==='in'
   ?`<div class="dlg glass" role="dialog" aria-modal="true" aria-labelledby="dlgT"><h2 class="dlg-t" id="dlgT">เข้าสู่ระบบ</h2>
     <p class="dlg-s">เพื่อให้สถิติและ Tempo ตามไปทุกเครื่อง ไม่เข้าสู่ระบบก็ใช้งานได้ตามปกติ</p>
     <label class="lab" for="aEmail">อีเมล</label><input class="inp" id="aEmail" type="email" autocomplete="email" inputmode="email">
     <label class="lab" for="aPass">รหัสผ่าน (อย่างน้อย 6 ตัว)</label><input class="inp" id="aPass" type="password" autocomplete="current-password">
     <div class="fb" id="aMsg" aria-live="polite"></div>
     <div class="row"><button class="btn pri" id="aIn">เข้าสู่ระบบ</button><button class="btn" id="aUp">สมัครใหม่</button><button class="btn ghost" id="aX" style="margin-left:auto">ปิด</button></div></div>`
   :`<div class="dlg glass" role="dialog" aria-modal="true" aria-labelledby="dlgT"><h2 class="dlg-t" id="dlgT">บัญชีของฉัน</h2>
     <div class="kv"><i class="dot-sync ${syncState}" id="syncDot"></i><span id="syncTxt">${SYNC_TXT[syncState]}</span></div>
     <p class="dlg-s" style="margin-top:6px">${esc(user.email||'')}</p>
     <div class="fb info" id="aMsg" aria-live="polite"></div>
     <div class="row"><button class="btn" id="aSync">${I('refresh')}ซิงก์ตอนนี้</button><button class="btn" id="aOut">ออกจากระบบ</button><button class="btn ghost" id="aX" style="margin-left:auto">ปิด</button></div>
     <p class="fine">หลังออกจากระบบ ข้อมูลในเครื่องนี้จะถูกล้าง (ข้อมูลยังอยู่ในบัญชี) เพื่อไม่ให้ปนกับคนอื่นที่ใช้เครื่องเดียวกัน</p></div>`;
  document.body.appendChild(el);
  const dlg=el.firstElementChild,msg=()=>document.getElementById('aMsg');
  const say=(t,cls)=>{msg().className='fb '+(cls||'');msg().textContent=t};
  const busy=b=>dlg.querySelectorAll('button').forEach(x=>x.disabled=b);
  el.addEventListener('mousedown',e=>{if(e.target===el)closeDlg()});
  dlg.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeDlg();return}
    if(e.key==='Tab'){const fs=[...dlg.querySelectorAll('input,button:not(:disabled)')];if(!fs.length)return;const a=fs[0],z=fs[fs.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
  document.getElementById('aX').onclick=closeDlg;
  if(kind==='in'){
    const em=()=>aEmail.value.trim(),pw=()=>aPass.value;
    const need=()=>{if(!em()||!pw()){say('กรอกอีเมลและรหัสผ่านก่อน','bad');return false}return true};
    aIn.onclick=async()=>{if(!need())return;busy(true);say('กำลังเข้าสู่ระบบ…','info');
      try{const{error}=await sb.auth.signInWithPassword({email:em(),password:pw()});
        if(error){say(errTh(error.message),'bad');busy(false);return}closeDlg()}
      catch(e){say(errTh(e.message),'bad');busy(false)}};
    aUp.onclick=async()=>{if(!need())return;busy(true);say('กำลังสมัคร…','info');
      try{const{data,error}=await sb.auth.signUp({email:em(),password:pw(),options:{emailRedirectTo:location.href.split('#')[0]}});
        if(error){say(errTh(error.message),'bad');busy(false);return}
        if(data.session){closeDlg()}
        else{say('ส่งอีเมลยืนยันให้แล้ว เปิดลิงก์ในอีเมล แล้วกลับมากดเข้าสู่ระบบ','info');busy(false)}}
      catch(e){say(errTh(e.message),'bad');busy(false)}};
    aPass.onkeydown=e=>{if(e.key==='Enter')aIn.onclick()};
    aEmail.onkeydown=e=>{if(e.key==='Enter')aPass.focus()};
    aEmail.focus();
  }else{
    aSync.onclick=async()=>{busy(true);await pullAndMerge();busy(false);say(syncState==='error'?SYNC_TXT.error:'ซิงก์เรียบร้อย')};
    aOut.onclick=async()=>{busy(true);say('กำลังบันทึกข้อมูลก่อนออก…');
      const ok=await flushAll();
      if(!ok){say('ซิงก์ไม่สำเร็จ จึงยังไม่ออกจากระบบ เพื่อกันข้อมูลหาย ลองใหม่อีกครั้ง','bad');busy(false);return}
      try{await sb.auth.signOut()}catch(e){}
      S={};D={days:{},runs:[]};save();saveD();user=null;closeDlg();renderAuth();dataChanged()};
    aSync.focus();
  }
}
async function initAuth(){
  if(!sb){renderAuth();return}
  try{const{data}=await sb.auth.getSession();user=data.session?data.session.user:null}catch(e){user=null}
  renderAuth();
  sb.auth.onAuthStateChange((ev,sess)=>{const u=sess?sess.user:null,was=user;user=u;renderAuth();
    if(u&&(!was||was.id!==u.id))setTimeout(pullAndMerge,0)});
  if(user)pullAndMerge();
}
