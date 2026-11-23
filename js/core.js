/* ---------- helpers ---------- */
const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[r(0,a.length-1)];
const f=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:4});
const p2=n=>String(n).padStart(2,'0');
const C=(n,c)=>`<i class="c${c}">${typeof n==='number'?f(n):n}</i>`;
const B=n=>`<b>${f(n)}</b>`;
const I=(id,cls='i')=>`<svg class="${cls}"><use href="#i-${id}"/></svg>`;
const LV=[
  {en:'Basic',th:'พื้นฐาน',col:'var(--l0)',soft:'#9fe3d1'},
  {en:'Intermediate',th:'ระดับกลาง',col:'var(--l1)',soft:'#ffd28a'},
  {en:'Advanced',th:'ขั้นสูง',col:'var(--l2)',soft:'#c7b4ff'}
];
const MASTER=5;
/* split part helpers: [text,color] or plain operator string */
const P=(v,c)=>[typeof v==='number'?f(v):v,c];

/* ---------- techniques ---------- */
const T=[
/* ===== BASIC ===== */
{id:'add-split',lv:0,en:'Break & Add',th:'แยกหลักแล้วบวก',
 idea:'แยกตัวที่สองเป็น “หลักสิบ” กับ “หลักหน่วย” แล้วบวกทีละก้อนจากซ้ายไปขวา แต่ละขั้นสมองจำแค่ตัวเลขเดียว',
 use:'บวกเลข 2 หลักทั่วไป เช่น ทอนเงิน รวมราคา',
 gen(){let a=r(24,89),b=r(15,79);if(b%10===0)b+=r(1,9);const t=b-b%10,o=b%10;
  return{q:`${a} + ${b}`,ans:a+b,split:{src:f(b),note:'แยกเป็นหลักสิบกับหลักหน่วย',parts:[P(t,1),'+',P(o,2)]},
  steps:[`แยก ${b} = ${C(t,1)} + ${C(o,2)}`,`<span class="m">${a} + ${C(t,1)} = ${f(a+t)}</span>`,`<span class="m">${f(a+t)} + ${C(o,2)} =</span> ${B(a+b)}`],
  viz:{type:'line',start:a,jumps:[t,o]}}}},
{id:'round-add',lv:0,en:'Round & Compensate (+)',th:'ปัดเป็นเลขกลมแล้วชดเชย',
 idea:'ถ้าตัวบวกใกล้เลขกลม (เช่น 298 ใกล้ 300) ให้บวกเลขกลมไปก่อน แล้วค่อยลบส่วนที่บวกเกินออก',
 use:'ตัวเลขลงท้ายด้วย 7, 8, 9 หรือ 98, 99',
 gen(){let a,b,R,d;if(Math.random()<.5){R=r(2,9)*100;d=r(1,4);b=R-d;a=r(123,689)}else{R=r(3,9)*10;d=r(1,3);b=R-d;a=r(26,88)}
  return{q:`${a} + ${b}`,ans:a+b,split:{src:f(b),note:'มองเป็นเลขกลมลบส่วนที่ขาด',parts:[P(R,1),'−',P(d,2)]},
  steps:[`${b} ใกล้ ${C(R,1)} (ขาดไป ${C(d,2)})`,`<span class="m">${a} + ${C(R,1)} = ${f(a+R)}</span>`,`บวกเกินไป ${C(d,2)} → <span class="m">${f(a+R)} − ${d} =</span> ${B(a+b)}`],
  viz:{type:'line',start:a,jumps:[R,-d]}}}},
{id:'count-up',lv:0,en:'Count Up to Subtract',th:'ลบด้วยการนับขึ้น (แบบทอนเงิน)',
 idea:'แทนที่จะลบ ให้นับจากตัวน้อยขึ้นไปหาตัวมาก โดยกระโดดไปเลขกลมทีละช่วง ผลรวมของระยะกระโดดคือคำตอบ',
 use:'การลบที่ต้องยืมหลายหลัก เช่น 603 − 278',
 gen(){const big=r(312,960),small=r(108,big-60);let p=small;const J=[];
  let t=Math.ceil(p/10)*10;if(t>p&&t<=big){J.push(t-p);p=t}
  t=Math.ceil(p/100)*100;if(t>p&&t<=big){J.push(t-p);p=t}
  if(big-p>=100){const h=Math.floor((big-p)/100)*100;J.push(h);p+=h}
  if(big>p)J.push(big-p);
  let q=small;const steps=J.map((j,i)=>{const s=`<span class="m">${f(q)} → ${f(q+j)}</span> กระโดด ${C(j,(i%3)+1)}`;q+=j;return s});
  steps.push(`รวมระยะกระโดด <span class="m">${J.join(' + ')} =</span> ${B(big-small)}`);
  const parts=[];J.forEach((j,i)=>{if(i)parts.push('+');parts.push(P(j,(i%3)+1))});
  return{q:`${big} − ${small}`,ans:big-small,split:{src:`${f(small)} → ${f(big)}`,note:'ระยะห่างแยกเป็นช่วงกระโดดไปเลขกลม',parts},steps,viz:{type:'line',start:small,jumps:J}}}},
{id:'round-sub',lv:0,en:'Round & Compensate (−)',th:'ลบเลขกลมแล้วบวกคืน',
 idea:'ถ้าตัวลบใกล้เลขกลม ให้ลบเลขกลมไปก่อน เท่ากับลบเกินไป จึงต้องบวกส่วนเกินคืน',
 use:'ลบเลขที่ลงท้ายด้วย 7, 8, 9',
 gen(){let b,R;if(Math.random()<.55){R=r(2,9)*10;b=R-r(1,3)}else{R=r(2,7)*100;b=R-r(1,4)}let a=r(b+25,b+600);
  return{q:`${a} − ${b}`,ans:a-b,split:{src:f(b),note:'มองเป็นเลขกลมลบส่วนที่ขาด',parts:[P(R,1),'−',P(R-b,2)]},
  steps:[`${b} ใกล้ ${C(R,1)}`,`<span class="m">${f(a)} − ${C(R,1)} = ${f(a-R)}</span>`,`ลบเกินไป ${C(R-b,2)} → บวกคืน <span class="m">${f(a-R)} + ${R-b} =</span> ${B(a-b)}`],
  viz:{type:'line',start:a,jumps:[-R,R-b]}}}},
{id:'times5',lv:0,en:'Multiply by 5',th:'คูณ 5 = คูณ 10 แล้วหาร 2',
 idea:'5 คือครึ่งหนึ่งของ 10 ดังนั้นเติม 0 ต่อท้าย แล้วแบ่งครึ่ง',
 use:'คูณ 5, 50, 500 (หลักการเดียวกัน)',
 gen(){const n=r(14,198);return{q:`${n} × 5`,ans:n*5,split:{src:'× 5',note:'คูณ 5 แยกเป็นสองขั้นที่ง่ายกว่า',parts:[P('× 10',1),P('÷ 2',2)]},
  steps:[`× 5 = ${C('× 10',1)} แล้ว ${C('÷ 2',2)}`,`<span class="m">${n} × 10 = ${f(n*10)}</span>`,`<span class="m">${f(n*10)} ÷ 2 =</span> ${B(n*5)}`]}}},
{id:'double-halve',lv:0,en:'Double & Halve',th:'ครึ่งหนึ่ง–สองเท่า',
 idea:'ลดตัวหนึ่งลงครึ่ง แล้วเพิ่มอีกตัวเป็นสองเท่า ผลคูณไม่เปลี่ยน ทำซ้ำจนเจอเลขกลมที่คูณง่าย',
 use:'มี 15, 25, 35, 45 คูณกับเลขคู่',
 gen(){const b0=pick([15,25,35,45]);let a0=2*r(4,24);if(b0===25&&Math.random()<.6)a0=4*r(3,12);
  let a=a0,b=b0;const steps=[`<span class="m">${a} × ${b}</span>`];
  while(a%2===0&&(b%10!==0||b===50)){a/=2;b*=2;steps.push(`${C(a,1)} (ครึ่งหนึ่ง) × ${C(b,2)} (สองเท่า)`)}
  steps.push(`<span class="m">${a} × ${b} =</span> ${B(a0*b0)}`);
  return{q:`${a0} × ${b0}`,ans:a0*b0,split:{src:`${a0} × ${b0}`,note:'แปลงเป็นคู่ที่คูณง่ายกว่า ผลคูณเท่าเดิม',parts:[P(a,1),'×',P(b,2)]},steps}}},

/* ===== INTERMEDIATE ===== */
{id:'times11',lv:1,en:'Multiply by 11',th:'คูณ 11 แบบแทรกตรงกลาง',
 idea:'เลข 2 หลักคูณ 11: แยกสองหลักออกจากกัน แล้วเอาผลบวกของมันไปแทรกตรงกลาง ถ้าผลบวกเกิน 9 ให้ทด 1 ไปหลักหน้า',
 use:'คูณ 11 ทุกครั้ง',
 gen(){const n=r(12,98),a=Math.floor(n/10),b=n%10,s=a+b;
  return{q:Math.random()<.5?`${n} × 11`:`11 × ${n}`,ans:n*11,split:{src:f(n),note:'แยกสองหลัก แล้วแทรกผลบวกไว้ตรงกลาง',parts:[P(a,1),P(`${a}+${b}`,3),P(b,2)]},
  steps:[`แยก ${n} → ${C(a,1)} _ ${C(b,2)}`,`ตรงกลาง = <span class="m">${a} + ${b} = ${C(s,3)}</span>`,
  s<10?`วาง ${C(a,1)}${C(s,3)}${C(b,2)} → ${B(n*11)}`:`${s} มี 2 หลัก → ทด 1 ไปหลักหน้า: <span class="m">${a}+1 | ${s-10} | ${b}</span> → ${B(n*11)}`]}}},
{id:'square5',lv:1,en:'Square Numbers Ending in 5',th:'ยกกำลังสองเลขลงท้าย 5',
 idea:'เอาหลักหน้าคูณกับ “ตัวมันบวก 1” แล้วต่อท้ายด้วย 25 เสมอ',
 use:'15², 35², 85², 115²',
 gen(){const t=r(1,12),n=t*10+5;return{q:`${n}²`,ans:n*n,split:{src:`${n}²`,note:'คำตอบแบ่งเป็นสองท่อน ซ้ายกับขวา',parts:[P(`${t}×${t+1}`,1),'|',P('25',2)]},
  steps:[`หลักหน้า = ${C(t,1)}`,`<span class="m">${t} × ${t+1} = ${C(t*(t+1),1)}</span>`,`ต่อท้ายด้วย ${C('25',2)} → ${B(n*n)}`]}}},
{id:'split-mult',lv:1,en:'Split & Multiply',th:'แยกคูณ (Distributive)',
 idea:'แยกเลข 2 หลักเป็นหลักสิบกับหลักหน่วย คูณทีละส่วนแล้วนำมารวมกัน',
 use:'เลข 2 หลัก × เลขหลักเดียว',
 gen(){let a=r(13,89);if(a%10===0)a++;const b=r(3,9),t=a-a%10,o=a%10;
  return{q:`${a} × ${b}`,ans:a*b,split:{src:f(a),note:'แยกเป็นหลักสิบกับหลักหน่วย แล้วคูณทีละส่วน',parts:[P(t,1),'+',P(o,2)]},
  steps:[`แยก ${a} = ${C(t,1)} + ${C(o,2)}`,`<span class="m">${C(t,1)} × ${b} = ${f(t*b)}</span>`,`<span class="m">${C(o,2)} × ${b} = ${f(o*b)}</span>`,`<span class="m">${f(t*b)} + ${f(o*b)} =</span> ${B(a*b)}`],
  viz:{type:'area',cols:[t,o],rows:[b]}}}},
{id:'ltr-mult',lv:1,en:'Left-to-Right Multiply',th:'คูณจากซ้ายไปขวา',
 idea:'คูณหลักร้อยก่อน แล้วสะสมผลไปเรื่อย ๆ ทีละหลัก คนส่วนใหญ่ถนัดแบบนี้มากกว่าการคูณจากขวาแบบในกระดาษ',
 use:'เลข 3 หลัก × เลขหลักเดียว',
 gen(){const a=r(123,987),b=r(3,9),H=a-a%100,Tn=a%100-a%10,O=a%10;const parts=[H,Tn,O].filter(x=>x>0);
  let acc=0;const steps=parts.map((p,i)=>{acc+=p*b;return i===0?`<span class="m">${C(p,i+1)} × ${b} = ${f(p*b)}</span>`:`<span class="m">+ ${C(p,i+1)} × ${b} = ${f(p*b)} → สะสม ${f(acc)}</span>`});
  steps.push(`คำตอบ ${B(a*b)}`);
  const sp=[];parts.forEach((p,i)=>{if(i)sp.push('+');sp.push(P(p,i+1))});
  return{q:`${a} × ${b}`,ans:a*b,split:{src:f(a),note:'แยกตามหลัก ร้อย สิบ หน่วย',parts:sp},steps,viz:{type:'area',cols:parts,rows:[b]}}}},
{id:'div5',lv:1,en:'Divide by 5',th:'หาร 5 = คูณ 2 แล้วหาร 10',
 idea:'หาร 5 ก็คือคูณ 2 แล้วเลื่อนจุดทศนิยมไปทางซ้าย 1 ตำแหน่ง',
 use:'หาร 5, 50 และคิดเปอร์เซ็นต์เร็ว ๆ',
 gen(){const n=r(23,480),ans=n*2/10;return{q:`${n} ÷ 5`,ans,split:{src:'÷ 5',note:'หาร 5 แยกเป็นสองขั้นที่ง่ายกว่า',parts:[P('× 2',1),P('÷ 10',2)]},
  steps:[`÷ 5 = ${C('× 2',1)} แล้ว ${C('÷ 10',2)}`,`<span class="m">${n} × 2 = ${f(n*2)}</span>`,`<span class="m">${f(n*2)} ÷ 10 =</span> ${B(ans)}`]}}},
{id:'percent',lv:1,en:'Percent Building Blocks',th:'เปอร์เซ็นต์จากบล็อก 10% และ 5%',
 idea:'10% คือเลื่อนจุดทศนิยม 1 ตำแหน่ง ส่วน 5% คือครึ่งหนึ่งของ 10% เอาสองบล็อกนี้มาประกอบเป็นเปอร์เซ็นต์อื่น',
 use:'ส่วนลด ทิป VAT',
 gen(){const p=pick([5,15,20,25,30,35,45,60,75]),base=20*r(2,30),ten=base/10,five=base/20,ans=base*p/100;let steps,parts;
  if(p===25){steps=[`25% = ${C('¼',1)}`,`<span class="m">${base} ÷ 4 =</span> ${B(ans)}`];parts=[P('¼',1)]}
  else if(p===75){steps=[`75% = ${C('¼',1)} × ${C('3',2)}`,`<span class="m">${base} ÷ 4 = ${f(base/4)}</span>`,`<span class="m">${f(base/4)} × 3 =</span> ${B(ans)}`];parts=[P('¼',1),'×',P('3',2)]}
  else{const k=Math.floor(p/10),h=p%10===5;steps=[`10% ของ ${base} = ${C(ten,1)}`];parts=[];
   if(k)parts.push(P(`${k} × 10%`,1));if(k&&h)parts.push('+');if(h)parts.push(P('5%',2));
   if(h)steps.push(`5% = ครึ่งของ 10% = ${C(five,2)}`);
   if(k===0)steps.push(`คำตอบ ${B(ans)}`);
   else steps.push(`${p}% = ${k} × 10%${h?' + 5%':''} → <span class="m">${k} × ${f(ten)}${h?' + '+f(five):''} =</span> ${B(ans)}`)}
  return{q:`${p}% ของ ${base}`,ans,split:{src:`${p}%`,note:'ประกอบจากบล็อกที่คิดง่าย',parts},steps}}},

/* ===== ADVANCED ===== */
{id:'near100',lv:2,en:'Near 100 (below)',th:'คูณเลขใกล้ 100 (ต่ำกว่า)',
 idea:'ดูว่าแต่ละตัวขาดจาก 100 เท่าไร ซ้าย = ตัวหนึ่งลบส่วนที่อีกตัวขาด, ขวา = ส่วนที่ขาดคูณกัน (เขียนเป็น 2 หลัก)',
 use:'เลข 85–99 คูณกัน',
 gen(){const a=r(86,99),b=r(85,99),da=100-a,db=100-b,L=a-db,R=da*db;
  const s=[`ขาดจาก 100: ${a} → ${C(da,1)}, ${b} → ${C(db,2)}`,`ซ้าย: <span class="m">${a} − ${C(db,2)} = ${f(L)}</span> (หรือ ${b} − ${da} ก็ได้เท่ากัน)`,`ขวา: <span class="m">${C(da,1)} × ${C(db,2)} = ${R<100?p2(R):R}</span>`];
  if(R>=100)s.push(`ขวาเกิน 2 หลัก → ทด ${Math.floor(R/100)} ไปทางซ้าย`);
  s.push(`คำตอบ ${B(a*b)}`);return{q:`${a} × ${b}`,ans:a*b,split:{src:`${a} × ${b}`,note:'มองแต่ละตัวเป็น 100 ลบส่วนที่ขาด',parts:[P(`100−${da}`,1),'×',P(`100−${db}`,2)]},steps:s}}},
{id:'near100up',lv:2,en:'Near 100 (above)',th:'คูณเลขใกล้ 100 (เกิน 100)',
 idea:'กลับด้านจากแบบต่ำกว่า: ซ้าย = ตัวหนึ่งบวกส่วนเกินของอีกตัว, ขวา = ส่วนเกินคูณกัน (2 หลัก)',
 use:'101–115 คูณกัน',
 gen(){const a=r(101,113),b=r(101,113),da=a-100,db=b-100,L=a+db,R=da*db;
  const s=[`เกิน 100: ${a} → ${C(da,1)}, ${b} → ${C(db,2)}`,`ซ้าย: <span class="m">${a} + ${C(db,2)} = ${L}</span>`,`ขวา: <span class="m">${C(da,1)} × ${C(db,2)} = ${R<100?p2(R):R}</span>`];
  if(R>=100)s.push(`ขวาเกิน 2 หลัก → ทด ${Math.floor(R/100)} ไปทางซ้าย`);
  s.push(`คำตอบ ${B(a*b)}`);return{q:`${a} × ${b}`,ans:a*b,split:{src:`${a} × ${b}`,note:'มองแต่ละตัวเป็น 100 บวกส่วนเกิน',parts:[P(`100+${da}`,1),'×',P(`100+${db}`,2)]},steps:s}}},
{id:'square-any',lv:2,en:'Square Any 2-Digit',th:'ยกกำลังสองเลข 2 หลักใดก็ได้',
 idea:'n² = (n+d)(n−d) + d² เลือก d ให้ตัวหนึ่งกลายเป็นเลขกลม ทำให้คูณง่ายขึ้นมาก',
 use:'ยกกำลังสอง เช่น 47², 83²',
 gen(){let n=r(21,99);if(n%10===0)n++;const u=n%10,d=u<=5?u:10-u,up=n+d,dn=n-d;
  return{q:`${n}²`,ans:n*n,split:{src:`${n}²`,note:'ขยับขึ้นลงเท่ากันจนเจอเลขกลม แล้วชดเชยด้วย d²',parts:[P(up,1),'×',P(dn,2),'+',P(`${d}²`,3)]},
  steps:[`${n} ห่างจากเลขกลม ${C(d,3)}`,`<span class="m">${n}² = (${n}+${d})(${n}−${d}) + ${d}²</span>`,`<span class="m">${C(up,1)} × ${C(dn,2)} = ${f(up*dn)}</span>`,`<span class="m">${f(up*dn)} + ${C(d*d,3)} =</span> ${B(n*n)}`]}}},
{id:'diff-sq',lv:2,en:'Difference of Squares',th:'ผลต่างกำลังสอง',
 idea:'ถ้าสองตัวห่างจากเลขกลมตัวเดียวกันเท่ากัน (เช่น 47 กับ 53 ห่างจาก 50 คนละ 3) ผลคูณ = กลาง² − ระยะ²',
 use:'สองตัวที่มีเลขกลมอยู่ตรงกลางพอดี',
 gen(){const m=r(2,9)*10,d=r(1,7),a=m-d,b=m+d;const[x,y]=Math.random()<.5?[a,b]:[b,a];
  return{q:`${x} × ${y}`,ans:a*b,split:{src:`${x} × ${y}`,note:'เลขกลมตรงกลางยกกำลังสอง ลบระยะยกกำลังสอง',parts:[P(`${m}²`,1),'−',P(`${d}²`,2)]},
  steps:[`${a} กับ ${b} ห่างจาก ${C(m,1)} คนละ ${C(d,2)}`,`<span class="m">(${m}−${d})(${m}+${d}) = ${m}² − ${d}²</span>`,`<span class="m">${f(m*m)} − ${d*d} =</span> ${B(a*b)}`]}}},
{id:'same-tens',lv:2,en:'Same Tens, Units Sum to 10',th:'หลักสิบเท่ากัน หลักหน่วยรวมได้ 10',
 idea:'เช่น 43 × 47: หลักสิบเท่ากัน (4) และหน่วยรวมได้ 10 (3+7) → ซ้าย = 4 × 5, ขวา = 3 × 7 (เขียน 2 หลัก)',
 use:'เป็นกรณีทั่วไปของเทคนิคเลขลงท้าย 5',
 gen(){const t=r(1,9),u=r(1,9),a=10*t+u,b=10*t+10-u,L=t*(t+1),R=u*(10-u);
  return{q:`${a} × ${b}`,ans:a*b,split:{src:`${a} × ${b}`,note:'คำตอบแบ่งเป็นสองท่อน ซ้ายกับขวา',parts:[P(`${t}×${t+1}`,1),'|',P(`${u}×${10-u}`,2)]},
  steps:[`หลักสิบเท่ากัน = ${C(t,1)}, หน่วย ${u} + ${10-u} = 10`,`ซ้าย: <span class="m">${t} × ${t+1} = ${C(L,1)}</span>`,`ขวา: <span class="m">${u} × ${10-u} = ${C(p2(R),2)}</span>`,`ต่อกัน → ${B(a*b)}`]}}},
{id:'cross',lv:2,en:'Vertically & Crosswise',th:'คูณไขว้ (2 หลัก × 2 หลัก)',
 idea:'เทคนิคจากเวทคณิต: ขวา = หน่วย×หน่วย, กลาง = ผลคูณไขว้บวกกัน, ซ้าย = สิบ×สิบ แล้วทดจากขวาไปซ้าย ภาพกล่องด้านล่างคือ 4 ก้อนเดียวกัน',
 use:'เลข 2 หลักคูณกันทั่วไป',
 gen(){const a=r(12,98),b=r(12,98),a1=Math.floor(a/10),a0=a%10,b1=Math.floor(b/10),b0=b%10;
  const R=a0*b0,M=a1*b0+a0*b1,L=a1*b1,c1=Math.floor(R/10),m2=M+c1,c2=Math.floor(m2/10),l2=L+c2;
  return{q:`${a} × ${b}`,ans:a*b,split:{src:`${a} × ${b}`,note:'สามคอลัมน์ ซ้าย กลาง ขวา แล้วทดจากขวา',parts:[P(`${a1}×${b1}`,1),'|',P(`${a1}×${b0}+${a0}×${b1}`,3),'|',P(`${a0}×${b0}`,2)]},
  steps:[
   `ขวา: <span class="m">${C(`${a0}×${b0}`,2)} = ${R}</span> → เขียน ${R%10}${c1?`, ทด ${c1}`:''}`,
   `กลาง: <span class="m">${C(`${a1}×${b0} + ${a0}×${b1}`,3)} = ${M}${c1?` + ทด ${c1} = ${m2}`:''}</span> → เขียน ${m2%10}${c2?`, ทด ${c2}`:''}`,
   `ซ้าย: <span class="m">${C(`${a1}×${b1}`,1)} = ${L}${c2?` + ทด ${c2} = ${l2}`:''}</span>`,
   `อ่านจากซ้ายไปขวา → ${B(a*b)}`],
  viz:{type:'area',cols:[a1*10,a0].filter(x=>x),rows:[b1*10,b0].filter(x=>x)}}}}
];
const byId=Object.fromEntries(T.map(t=>[t.id,t]));
/* ---------- the prism split ---------- */
const PC={1:'var(--c1)',2:'var(--c2)',3:'var(--c3)'};
const HEX={1:'#2f5bea',2:'#c4510f',3:'#b0247f'};
function prismHTML(sp,anim=true){
  const cs=[...new Set(sp.parts.filter(p=>Array.isArray(p)).map(p=>p[1]))];
  const ys=cs.length===1?[44]:cs.length===2?[30,60]:[22,44,68];const xs=cs.length===1?[83]:cs.length===2?[81,86]:[80,83,87];const y0=cs.length===1?[44]:cs.length===2?[40,50]:[38,45,52];
  const rays=cs.map((c,i)=>`<path class="ray" pathLength="1" d="M${xs[i]} ${y0[i]} L150 ${ys[i]}" stroke="${HEX[c]}" stroke-width="2.6" style="animation-delay:${.35+i*.08}s"/>`).join('');
  let k=0;const parts=sp.parts.map(p=>{const d=(.45+k++*.09).toFixed(2);return Array.isArray(p)?`<span class="chip" style="--pc:${PC[p[1]]};animation-delay:${d}s">${p[0]}</span>`:`<span class="op" style="animation-delay:${d}s">${p}</span>`}).join('');
  return `<p class="split-note">${sp.note}</p><div class="prism ${anim?'go':''}"><span class="src">${sp.src}</span>
   <svg class="pr" viewBox="0 0 150 84" aria-hidden="true">
   <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".55" stop-color="#e6ecff" stop-opacity=".7"/><stop offset="1" stop-color="#cfd8f5" stop-opacity=".85"/></linearGradient>
   <linearGradient id="pf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f5bea" stop-opacity="0"/><stop offset=".4" stop-color="#2f5bea" stop-opacity=".22"/><stop offset=".7" stop-color="#b0247f" stop-opacity=".2"/><stop offset="1" stop-color="#c4510f" stop-opacity=".22"/></linearGradient></defs>
   <path class="ray" pathLength="1" d="M0 50 L46 46" stroke="#a6acc6" stroke-width="2.4" style="animation-delay:0s"/>
   <g class="body"><path d="M66 8 L94 70 L38 70 Z" fill="url(#pg)" stroke="rgba(255,255,255,.95)" stroke-width="2" stroke-linejoin="round" style="filter:drop-shadow(0 6px 10px rgba(24,32,88,.22))"/>
   <path d="M52 44 L80 42 L86 56 L50 56 Z" fill="url(#pf)"/>
   <path d="M66 12 L42 66" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
   <path d="M66 8 L94 70 L38 70 Z" fill="none" stroke="rgba(20,24,51,.18)" stroke-width="1" stroke-linejoin="round"/></g>${rays}</svg>
   <span class="parts">${parts}</span></div>`}

/* ---------- visuals ---------- */
function numberLine(start,jumps,W0){
  const pts=[start];jumps.forEach(j=>pts.push(pts[pts.length-1]+j));
  const vals=[...new Set(pts)].sort((a,b)=>a-b);
  const W=W0||680,pad=W<520?30:46,H=190,y=95;const w=[0];
  for(let i=1;i<vals.length;i++)w.push(w[i-1]+Math.sqrt(vals[i]-vals[i-1])+2);
  const tot=w[w.length-1]||1;const X=v=>pad+w[vals.indexOf(v)]/tot*(W-2*pad);
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="เส้นจำนวน">
  <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="context-stroke"/></marker></defs>
  <rect x="${pad-22}" y="${y-3}" width="${W-2*pad+44}" height="6" rx="3" fill="rgba(255,255,255,.9)" stroke="rgba(20,24,51,.12)"/>`;
  const cols=['#2f5bea','#c4510f','#b0247f'];
  vals.forEach(v=>{const x=X(v);const isEnd=v===pts[pts.length-1];
    s+=`<circle cx="${x}" cy="${y}" r="${isEnd||v===start?6:4}" fill="${isEnd?'#14803c':'#fff'}" stroke="${isEnd?'#14803c':'#141833'}" stroke-width="1.6"/>
    <text x="${x}" y="${y+26}" text-anchor="middle" font-size="13.5" font-weight="${isEnd||v===start?800:500}" fill="${isEnd?'#14803c':'#141833'}">${f(v)}</text>`});
  jumps.forEach((j,i)=>{const x1=X(pts[i]),x2=X(pts[i+1]),up=j>0,h=Math.min(62,22+Math.abs(x2-x1)*.3);
    const cy=up?y-h*1.5:y+30+h*1.1,mid=(x1+x2)/2,col=cols[i%3],d=(i*0.7).toFixed(2);
    const sy=up?y-8:y+34;
    s+=`<path class="arc" pathLength="1" d="M${x1},${sy} Q${mid},${cy} ${x2},${sy}" stroke="${col}" marker-end="url(#ah)" style="animation-delay:${d}s"/>
    <text class="fade" style="animation-delay:${(i*0.7+.35).toFixed(2)}s" x="${mid}" y="${up?y-h*.75-12:y+30+h*.55+18}" text-anchor="middle" font-size="14.5" font-weight="800" fill="${col}">${j>0?'+':'−'}${f(Math.abs(j))}</text>`});
  return s+'</svg>'}
function areaModel(cols,rows,W0){
  const W=W0||600,L=56,Tp=34,mx=Math.max(...cols),my=Math.max(...rows);
  const cw=cols.map(c=>Math.max(c,mx*.22)),rh=rows.map(v=>Math.max(v,my*.3));
  const sw=cw.reduce((a,b)=>a+b),sh=rh.reduce((a,b)=>a+b);
  const GW=W-L-10,GH=rows.length>1?220:92;
  const cx=[],ry=[];let acc=L;cw.forEach(c=>{cx.push(acc);acc+=c/sw*GW});cx.push(acc);
  acc=Tp;rh.forEach(v=>{ry.push(acc);acc+=v/sh*GH});ry.push(acc);
  const fills=['rgba(47,91,234,.10)','rgba(196,81,15,.10)','rgba(176,36,127,.10)','rgba(20,128,60,.10)'];
  const strokes=['rgba(47,91,234,.35)','rgba(196,81,15,.35)','rgba(176,36,127,.35)','rgba(20,128,60,.35)'];
  let s=`<svg viewBox="0 0 ${W} ${Tp+GH+46}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แบบจำลองพื้นที่">`;let k=0,sum=[];
  cols.forEach((c,i)=>{s+=`<text x="${(cx[i]+cx[i+1])/2}" y="${Tp-11}" text-anchor="middle" font-size="15" font-weight="800" fill="#2f5bea">${f(c)}</text>`});
  rows.forEach((v,j)=>{s+=`<text x="${L-12}" y="${(ry[j]+ry[j+1])/2+5}" text-anchor="end" font-size="15" font-weight="800" fill="#c4510f">${f(v)}</text>`});
  rows.forEach((v,j)=>cols.forEach((c,i)=>{const x=cx[i],y=ry[j],w=cx[i+1]-x,h=ry[j+1]-y,dl=(k*.3).toFixed(2);sum.push(c*v);
    s+=`<g class="fade" style="animation-delay:${dl}s"><rect x="${x+2}" y="${y+2}" width="${w-4}" height="${h-4}" rx="10" fill="rgba(255,255,255,.75)"/><rect x="${x+2}" y="${y+2}" width="${w-4}" height="${h-4}" rx="10" fill="${fills[k%4]}" stroke="${strokes[k%4]}"/>
    <text x="${x+w/2}" y="${y+h/2-3}" text-anchor="middle" font-size="${w<90?11:13}" fill="#5a6082">${f(c)}×${f(v)}</text>
    <text x="${x+w/2}" y="${y+h/2+17}" text-anchor="middle" font-size="${w<90?14:17}" font-weight="800" fill="#141833">${f(c*v)}</text></g>`;k++}));
  s+=`<text class="fade" style="animation-delay:${(k*.3).toFixed(2)}s" x="${L}" y="${Tp+GH+32}" font-size="15" font-weight="700" fill="#141833">${sum.map(f).join(' + ')} = ${f(sum.reduce((a,b)=>a+b))}</text>`;
  return s+'</svg>'}
const vizHTML=(v,el)=>{if(!v)return'';const w=el&&el.clientWidth?Math.max(320,Math.min(680,el.clientWidth)):680;return v.type==='line'?numberLine(v.start,v.jumps,w):areaModel(v.cols,v.rows,Math.min(600,w))};
