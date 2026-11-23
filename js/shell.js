/* ============ Calc Dojo shell: light field, icon sprite, header, belt chip ============ */
const NAV=[['home','index.html','ลานฝึก'],['learn','learn.html','เรียนเทคนิค'],['play','play.html','เล่น']];
const SPRITE=`<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14.6-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.6 4.5L20 16"/><path d="M20 20v-4h-4"/></symbol>
  <symbol id="i-next" viewBox="0 0 24 24"><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></symbol>
  <symbol id="i-all" viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r=".6"/><circle cx="4" cy="12" r=".6"/><circle cx="4" cy="18" r=".6"/></symbol>
  <symbol id="i-hint" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-pass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16.2 9.6"/></symbol>
  <symbol id="i-timer" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/></symbol>
  <symbol id="i-free" viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h7"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><path d="M7 5.5v13l11-6.5-11-6.5Z"/></symbol>
  <symbol id="i-stop" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></symbol>
  <symbol id="i-prism" viewBox="0 0 24 24"><path d="M12 3 21 19H3L12 3Z"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></symbol>
  <symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.2 1.2.8 2 1.6 2.4C10.2 8 10.6 5.4 12 3Z"/></symbol>
  <symbol id="i-pen" viewBox="0 0 24 24"><path d="m4 20 1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1Z"/><path d="m14 7 3 3"/></symbol>
  <symbol id="i-belt" viewBox="0 0 24 24"><path d="M3 9h18v6H3z"/><path d="M10 9v6M14 9v6"/><path d="m8 15-2 5M16 15l2 5"/></symbol>
</svg>`;
const MARK=`<svg viewBox="0 0 60 52" aria-hidden="true"><path d="M2 30 L19 27" stroke="#9aa1bf" stroke-width="2.4" stroke-linecap="round"/><path d="M26 6 L42 40 L10 40 Z" fill="rgba(255,255,255,.7)" stroke="#141833" stroke-width="2.2" stroke-linejoin="round"/><path d="M34 26 L58 16" stroke="#2f5bea" stroke-width="2.4" stroke-linecap="round"/><path d="M35 28 L58 28" stroke="#b0247f" stroke-width="2.4" stroke-linecap="round"/><path d="M34 30 L58 40" stroke="#c4510f" stroke-width="2.4" stroke-linecap="round"/></svg>`;

/* a small belt swatch: coloured band with a knot */
const beltSwatch=(b,cls='bw')=>`<span class="${cls}" style="--bc:${BELTS[b].col};--be:${BELTS[b].edge}" aria-hidden="true"></span>`;

function mountShell(active){
  document.body.insertAdjacentHTML('afterbegin',
   `<div class="field" aria-hidden="true"><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="b4"></i><i class="b5"></i></div>${SPRITE}
    <header class="top glass">
      <a class="brand" href="index.html" aria-label="Calc Dojo หน้าหลัก">${MARK}Calc Dojo</a>
      <nav class="tabs" aria-label="เมนู">${NAV.map(([id,href,th])=>`<a href="${href}" class="${id===active?'on':''}" ${id===active?'aria-current="page"':''}>${th}</a>`).join('')}</nav>
      <a class="beltchip" id="beltChip" href="index.html" aria-label="สายและ XP"></a>
      <div class="authbox" id="authBox"></div>
    </header>`);
  updateChip()}
function updateChip(){
  const c=document.getElementById('beltChip');if(!c)return;
  c.innerHTML=`${beltSwatch(belt())}<span>สาย${BELTS[belt()].th}</span><b class="n">${xp()}</b><small>XP</small>`}
