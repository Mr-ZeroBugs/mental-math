/* ============ handwriting -> number, fully in the browser ============
   strokes (pen 1)  ->  group into digits  ->  28x28 image per digit  ->  small CNN  ->  text like "-12.5"
   Needs js/digit-model.js (window.DIGIT_MODEL). Nothing is sent anywhere. */
const Recog=(()=>{
  const MIN_CONF=.8;               // every digit must reach this probability, else we say "can't read"
  let net=null;
  function b64f(s,n,scale){const bin=atob(s),a=new Float32Array(n);for(let i=0;i<n;i++){let v=bin.charCodeAt(i);if(v>127)v-=256;a[i]=v*scale}return a}
  function load(){
    if(net)return net;const m=window.DIGIT_MODEL;if(!m)return null;
    net={};for(const k of Object.keys(m.w)){const t=m.w[k];net[k]=b64f(t.d,t.n,t.s)}return net}

  /* ---- 28x28 rendering (mirrors the training renderer) ---- */
  const cv=document.createElement('canvas');cv.width=cv.height=112;
  const cx=cv.getContext('2d',{willReadFrequently:true});
  function draw(strokes,w,dx,dy){
    cx.fillStyle='#000';cx.fillRect(0,0,112,112);cx.strokeStyle=cx.fillStyle='#fff';cx.lineCap='round';cx.lineJoin='round';cx.lineWidth=w*4;
    for(const s of strokes){
      if(s.length===1){cx.beginPath();cx.arc((s[0][0]+dx)*4,(s[0][1]+dy)*4,Math.max(1,w*2),0,6.2832);cx.fill();continue}
      cx.beginPath();s.forEach((p,i)=>{const X=(p[0]+dx)*4,Y=(p[1]+dy)*4;i?cx.lineTo(X,Y):cx.moveTo(X,Y)});cx.stroke()}
    const d=cx.getImageData(0,0,112,112).data,o=new Float32Array(784);
    for(let y=0;y<28;y++)for(let x=0;x<28;x++){let a=0;for(let j=0;j<4;j++)for(let i=0;i<4;i++)a+=d[((y*4+j)*112+x*4+i)*4];o[y*28+x]=a/16/255}
    return o}
  function rasterize(strokes,w=2.4){
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    strokes.forEach(s=>s.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}));
    const size=Math.max(x1-x0,y1-y0,1e-6),sc=20/size,mx=(x0+x1)/2,my=(y0+y1)/2;
    const norm=strokes.map(s=>s.map(p=>[(p[0]-mx)*sc+14,(p[1]-my)*sc+14]));
    let img=draw(norm,w,0,0),tot=0,sx=0,sy=0;
    for(let i=0;i<784;i++){const v=img[i];tot+=v;sx+=v*(i%28);sy+=v*Math.floor(i/28)}
    if(tot>0)img=draw(norm,w,14-(sx/tot+.5),14-(sy/tot+.5));
    return img}

  /* ---- the network: conv3x3(8) pool conv3x3(16) pool dense64 dense10 ---- */
  function conv(x,C,H,W,w,b,F){const Ho=H-2,Wo=W-2,o=new Float32Array(F*Ho*Wo);
    for(let f=0;f<F;f++)for(let y=0;y<Ho;y++)for(let xx=0;xx<Wo;xx++){let s=b[f];
      for(let c=0;c<C;c++)for(let j=0;j<3;j++)for(let i=0;i<3;i++)s+=x[(c*H+y+j)*W+xx+i]*w[((f*C+c)*3+j)*3+i];
      o[(f*Ho+y)*Wo+xx]=s>0?s:0}
    return o}
  function pool(x,C,H,W){const h=H>>1,w=W>>1,o=new Float32Array(C*h*w);
    for(let c=0;c<C;c++)for(let y=0;y<h;y++)for(let xx=0;xx<w;xx++){const i=(c*H+2*y)*W+2*xx;o[(c*h+y)*w+xx]=Math.max(x[i],x[i+1],x[i+W],x[i+W+1])}
    return o}
  function dense(x,w,b,n,relu){const m=x.length,o=new Float32Array(n);for(let i=0;i<n;i++){let s=b[i];for(let j=0;j<m;j++)s+=w[i*m+j]*x[j];o[i]=relu&&s<0?0:s}return o}
  function logits(img){const N=load();if(!N)return null;
    const a=pool(conv(img,1,28,28,N.w1,N.b1,8),8,26,26),b=pool(conv(a,8,13,13,N.w2,N.b2,16),16,11,11);
    return dense(dense(b,N.w3,N.b3,64,true),N.w4,N.b4,10,false)}
  function probs(img){const z=logits(img);if(!z)return null;let m=-1e9;z.forEach(v=>m=Math.max(m,v));const e=Array.from(z,v=>Math.exp(v-m)),s=e.reduce((a,b)=>a+b);return e.map(v=>v/s)}

  /* ---- strokes -> text ---- */
  const bbox=s=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;s.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])});return{x0,y0,x1,y1,w:x1-x0,h:y1-y0}};
  const merge=(a,b)=>({x0:Math.min(a.x0,b.x0),y0:Math.min(a.y0,b.y0),x1:Math.max(a.x1,b.x1),y1:Math.max(a.y1,b.y1)});
  /* returns {ok,text,value,parts:[{ch,conf}],why} ; why is set when ok is false */
  function read(strokes){
    const S=strokes.filter(s=>s.length&&bbox(s).w+bbox(s).h>0||s.length>0).map(s=>({s,b:bbox(s)}));
    if(!S.length)return{ok:false,why:'empty'};
    const Href=Math.max(...S.map(o=>o.b.h),1);
    /* tiny marks: decimal point candidates (small and low) */
    let top=1e9,bot=-1e9;S.forEach(o=>{if(o.b.h>=.35*Href){top=Math.min(top,o.b.y0);bot=Math.max(bot,o.b.y1)}});
    const big=S.filter(o=>o.b.h>=.35*Href||o.b.w>=.5*Href),dots=[];
    if(!big.length)return{ok:false,why:'tiny'};
    S.forEach(o=>{if(!big.includes(o)){const cy=(o.b.y0+o.b.y1)/2;
      const inside=big.some(g=>Math.min(g.b.x1,o.b.x1)-Math.max(g.b.x0,o.b.x0)>.25*Math.max(o.b.w,1));
      if(o.b.w<.3*Href&&o.b.h<.3*Href&&cy>top+.6*(bot-top)&&!inside)dots.push(o);else big.push(o)}});
    big.sort((a,b)=>a.b.x0-b.b.x0);
    /* join strokes that overlap horizontally (4, 5, 7 with a bar, etc.) */
    const groups=[];
    for(const o of big){const g=groups[groups.length-1];
      if(g){const ov=Math.min(g.b.x1,o.b.x1)-Math.max(g.b.x0,o.b.x0),mw=Math.min(g.b.x1-g.b.x0,o.b.w)||1;
        if(ov>.35*mw||(o.b.w<.2*Href&&ov>0)){g.strokes.push(o.s);g.b=merge(g.b,o.b);continue}}
      groups.push({strokes:[o.s],b:{...o.b}})}
    const items=[];
    groups.forEach((g,i)=>{const w=g.b.x1-g.b.x0,h=g.b.y1-g.b.y0,cy=(g.b.y0+g.b.y1)/2;
      const flat=g.strokes.length===1&&h<.22*w&&w>.28*Href&&cy>top+.25*(bot-top)&&cy<top+.75*(bot-top);
      items.push({x:g.b.x0,g,flat,w,h})});
    dots.forEach(d=>items.push({x:(d.b.x0+d.b.x1)/2,dot:true}));
    items.sort((a,b)=>a.x-b.x);
    let text='',parts=[],minOk=true;
    for(let i=0;i<items.length;i++){const it=items[i];
      if(it.dot){if(text.includes('.'))return{ok:false,why:'two-dots'};text+='.';parts.push({ch:'.',conf:1});continue}
      if(it.flat&&i===0&&items.length>1){text+='-';parts.push({ch:'-',conf:1});continue}
      const p=probs(rasterize(it.g.strokes));if(!p)return{ok:false,why:'no-model'};
      let k=0;p.forEach((v,j)=>{if(v>p[k])k=j});
      parts.push({ch:String(k),conf:p[k]});if(p[k]<MIN_CONF)minOk=false;text+=k}
    text=text.replace(/\.$/,'');
    const digits=text.replace(/[-.]/g,'');
    if(!digits)return{ok:false,why:'no-digits',parts};
    if(digits.length>9)return{ok:false,why:'too-long',parts};
    if(!minOk)return{ok:false,why:'unsure',text,parts};
    if(text.startsWith('.'))text='0'+text;
    return{ok:true,text,value:parseFloat(text),parts}}
  return{read,probs,rasterize,logits,load,MIN_CONF}
})();
