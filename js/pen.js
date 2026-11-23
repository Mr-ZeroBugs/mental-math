/* ============ pen pad: two inks on one canvas ============
   Pen 1 (blue)   = the answer. It is read as a number and submitted.
   Pen 2 (orange) = scratch work. Never read, never counted.
   Select: tap a swatch (iPad) or press 1 / 2 (keyboard). Draws with pen, mouse (pen tablets) and, until a pen has been seen, touch. */
const PEN_KEY='mm-pen-v1';
const IDLE_CHOICES=[[500,'0.5 วินาที'],[700,'0.7 วินาที'],[1000,'1 วินาที'],[1500,'1.5 วินาที'],[0,'กดส่งเอง']];
function penPrefs(){let p={on:false,idle:700};try{const x=JSON.parse(localStorage.getItem(PEN_KEY)||'null');if(x)p={on:!!x.on,idle:IDLE_CHOICES.some(c=>c[0]===x.idle)?x.idle:700}}catch(e){}return p}
function setPenPrefs(p){try{localStorage.setItem(PEN_KEY,JSON.stringify(p))}catch(e){}}

class PenPad{
  /* host: element to fill. opts.onSubmit(text, value) is called with the recognised number. opts.idle: ms of no ink before submit (0 = manual) */
  constructor(host,opts){
    this.o=opts;this.idle=opts.idle;this.ink={1:[],2:[]};this.pen=1;this.cur=null;this.timer=null;this.prevT=null;this.sawPen=false;this.locked=false;this.touches=0;
    host.innerHTML=`<div class="pad">
      <div class="pad-bar">
        <div class="pens" role="radiogroup" aria-label="เลือกปากกา">
          <button class="pen p1" role="radio" aria-checked="true" data-p="1"><i></i>ปากกา 1 · ตอบ <kbd class="kbd">1</kbd></button>
          <button class="pen p2" role="radio" aria-checked="false" data-p="2"><i></i>ปากกา 2 · ทดเลข <kbd class="kbd">2</kbd></button>
        </div>
        <div class="pad-tools"><button class="btn ghost" data-a="undo">ย้อน <kbd class="kbd">Z</kbd></button><button class="btn ghost" data-a="clear1">ลบคำตอบ <kbd class="kbd">⌫</kbd></button><button class="btn" data-a="send">ส่ง <kbd class="kbd">Enter</kbd></button></div>
      </div>
      <canvas class="pad-cv" aria-label="พื้นที่เขียน"></canvas>
      <div class="pad-read" aria-live="polite"><span class="pad-val"></span><span class="pad-msg"></span></div></div>`;
    this.root=host.firstElementChild;this.cv=this.root.querySelector('canvas');this.cx=this.cv.getContext('2d');
    this.val=this.root.querySelector('.pad-val');this.msg=this.root.querySelector('.pad-msg');
    this.root.querySelectorAll('.pen').forEach(b=>b.onclick=()=>this.select(+b.dataset.p));
    this.root.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>this.act(b.dataset.a));
    const c=this.cv;
    c.addEventListener('pointerdown',e=>this.down(e));c.addEventListener('pointermove',e=>this.move(e));
    c.addEventListener('pointerup',e=>this.up(e));c.addEventListener('pointercancel',e=>this.up(e));
    c.addEventListener('contextmenu',e=>e.preventDefault());
    /* two-finger tap = Enter (iPad) */
    c.addEventListener('touchstart',e=>{if(e.touches.length===2){e.preventDefault();this.cur=null;this.submit()}},{passive:false});
    this.kd=e=>this.key(e);document.addEventListener('keydown',this.kd);
    this.ro=new ResizeObserver(()=>this.fit());this.ro.observe(c);this.fit()}
  destroy(){document.removeEventListener('keydown',this.kd);this.ro.disconnect();clearTimeout(this.timer)}

  /* ----- layout ----- */
  fit(){const r=this.cv.getBoundingClientRect(),d=window.devicePixelRatio||1;
    this.cv.width=Math.max(1,Math.round(r.width*d));this.cv.height=Math.max(1,Math.round(r.height*d));this.d=d;this.paint()}
  paint(){const x=this.cx,d=this.d;x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,this.cv.width,this.cv.height);x.lineCap='round';x.lineJoin='round';
    /* scratch under, answer on top */
    [2,1].forEach(k=>{x.strokeStyle=k===1?'#2f5bea':'#c4510f';x.fillStyle=x.strokeStyle;x.globalAlpha=k===1?1:.8;x.lineWidth=k===1?4.5:3;
      this.ink[k].forEach(s=>{if(s.length===1){x.beginPath();x.arc(s[0][0],s[0][1],x.lineWidth/2+.5,0,6.2832);x.fill();return}
        x.beginPath();s.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke()})});x.globalAlpha=1}

  /* ----- pens ----- */
  select(n){this.pen=n;this.root.querySelectorAll('.pen').forEach(b=>b.setAttribute('aria-checked',String(+b.dataset.p===n)))}
  act(a){if(a==='undo')this.undo();else if(a==='clear1')this.clear(1);else if(a==='send')this.submit()}
  key(e){
    if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;
    if(this.locked){if(e.key==='Enter'&&!(t&&t.tagName==='BUTTON')){e.preventDefault();this.o.onEmpty&&this.o.onEmpty()}return}
    if(e.key==='1'){this.select(1);e.preventDefault()}else if(e.key==='2'){this.select(2);e.preventDefault()}
    else if(e.key==='Enter'){if(t&&t.tagName==='BUTTON')return;e.preventDefault();this.submit()}
    else if(e.key==='Backspace'||e.key==='Delete'){e.preventDefault();this.clear(1)}
    else if(e.key==='z'||e.key==='Z'){e.preventDefault();this.undo()}}
  undo(){const k=this.last||this.pen;const a=this.ink[k];if(a.length)a.pop();this.paint();if(k===1)this.preview()}
  clear(k){this.ink[k]=[];clearTimeout(this.timer);this.paint();this.setRead('','')}
  /* a new question: wipe both inks */
  reset(){this.ink={1:[],2:[]};this.select(1);clearTimeout(this.timer);this.cur=null;this.paint();this.setRead('','')}
  lock(v){this.locked=v;clearTimeout(this.timer)}

  /* ----- drawing ----- */
  xy(e){const r=this.cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
  allowed(e){if(e.pointerType==='pen'){this.sawPen=true;return true}if(e.pointerType==='touch')return !this.sawPen;return e.button===0||e.buttons===1}
  down(e){if(this.locked||!this.allowed(e))return;e.preventDefault();try{this.cv.setPointerCapture(e.pointerId)}catch(_){}
    clearTimeout(this.timer);this.cur={k:this.pen,s:[this.xy(e)],id:e.pointerId};this.ink[this.pen].push(this.cur.s);this.paint()}
  move(e){if(!this.cur||e.pointerId!==this.cur.id)return;const ev=e.getCoalescedEvents?e.getCoalescedEvents():[e];
    (ev.length?ev:[e]).forEach(q=>{const p=this.xy(q),l=this.cur.s[this.cur.s.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])>1.2)this.cur.s.push(p)});this.paint()}
  up(e){if(!this.cur||e.pointerId!==this.cur.id)return;const k=this.cur.k;this.last=k;this.cur=null;this.paint();
    if(k===1){this.preview();if(this.idle>0)this.timer=setTimeout(()=>this.submit(),this.idle)}}

  /* ----- reading ----- */
  read(){return Recog.read(this.ink[1])}
  setRead(v,m,cls){this.val.textContent=v;this.msg.textContent=m;this.root.dataset.s=cls||''}
  preview(){if(!this.ink[1].length){this.setRead('','');return}
    const r=this.read();
    if(r.ok)this.setRead('อ่านได้ '+f(r.value).replace(/,/g,''),this.idle>0?'':'กดส่งเมื่อพร้อม','ok');
    else this.setRead('','อ่านไม่ออก เขียนใหม่ได้เลย','bad')}
  submit(){clearTimeout(this.timer);if(this.locked)return;if(!this.ink[1].length){this.o.onEmpty&&this.o.onEmpty();return}
    const r=this.read();
    if(!r.ok){this.setRead('','อ่านไม่ออก เขียนใหม่ (ไม่นับว่าผิด)','bad');this.ink[1]=[];this.paint();return}
    this.ink[1]=[];this.paint();this.setRead('','','');this.o.onSubmit(r.text,r.value)}
}
