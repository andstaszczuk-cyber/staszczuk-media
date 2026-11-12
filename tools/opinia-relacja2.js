// Relacja IG 1080x1920 z opinią z Google (@psychologsportu), wersja 2: 3 warianty (red, grafit, krem).
// node opinia-relacja2.js '{"tekst":"… *wyróżnienie* …","autor":"Imię N.","wariant":"red"}' out.png
// Tekst opinii bez zmiany sensu, autor tylko imię i inicjał, bez cudzysłowów.
const fs=require('fs'),path=require('path');const {render}=require('./kit');
const o=JSON.parse(process.argv[2]),out=process.argv[3];
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['400','500','600','700','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const V={
 red:{bg:'radial-gradient(120% 75% at 85% 0%,#C9575C 0%,#9E3236 40%,#6A1C1E 100%)',ink:'#fff',soft:'rgba(255,255,255,.75)',acc:'#FCE86A',q:'rgba(252,232,106,.22)',ring:'rgba(252,232,106,.18)',pill:'#FCE86A',pillInk:'#3A0D0E',av:'#FCE86A',avInk:'#7A2423'},
 grafit:{bg:'radial-gradient(120% 75% at 15% 0%,#3B3F48 0%,#22252B 45%,#141619 100%)',ink:'#fff',soft:'rgba(255,255,255,.7)',acc:'#FCE86A',q:'rgba(196,35,50,.55)',ring:'rgba(196,35,50,.35)',pill:'#C42332',pillInk:'#fff',av:'#C42332',avInk:'#fff'},
 krem:{bg:'linear-gradient(180deg,#F7F1E6 0%,#EFE4D2 100%)',ink:'#2A1414',soft:'rgba(42,20,20,.65)',acc:'#B0363B',q:'rgba(176,54,59,.18)',ring:'rgba(176,54,59,.16)',pill:'#9E3236',pillInk:'#fff',av:'#9E3236',avInk:'#FCE86A'}}[o.wariant||'red'];
const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/[„”“"]/g,'').replace(/\*(.+?)\*/g,`<span style="color:${V.acc};font-weight:700">$1</span>`);
const L=o.tekst.replace(/\*/g,'').length, fz=L<90?66:L<150?58:L<210?52:L<260?47:44;
const star=`<svg width="58" height="58" viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="#F4B63A"/></svg>`;
const ini=o.autor.trim()[0].toUpperCase();
const html=`<!doctype html><html><head><meta charset=utf-8><style>${css}body{margin:0;width:1080px;height:1920px;overflow:hidden;font-family:Pop;background:${V.bg};color:${V.ink}}</style></head><body>
<div style="position:absolute;right:-200px;top:-200px;width:700px;height:700px;border-radius:50%;border:2px solid ${V.ring}"></div>
<div style="position:absolute;right:-110px;top:-110px;width:520px;height:520px;border-radius:50%;border:2px solid ${V.ring}"></div>
<div style="position:absolute;left:-220px;bottom:-260px;width:640px;height:640px;border-radius:50%;border:2px solid ${V.ring}"></div>
<div style="position:absolute;left:96px;right:96px;top:200px;bottom:250px;display:flex;flex-direction:column;justify-content:center">
 <div style="display:flex;align-items:center;gap:22px">
  <div style="background:${V.pill};color:${V.pillInk};font-weight:800;font-size:28px;letter-spacing:.08em;padding:11px 24px;border-radius:40px">OPINIA Z GOOGLE</div>
  <div style="display:flex;gap:4px">${star.repeat(5)}</div>
 </div>
 <div style="font-weight:800;font-size:330px;line-height:.62;height:150px;margin-top:70px;color:${V.q};font-family:Georgia,serif">&#8220;</div>
 <div style="font-size:${fz}px;font-weight:500;line-height:1.38;letter-spacing:-.005em">${e(o.tekst)}</div>
 <div style="margin-top:64px;display:flex;align-items:center;gap:26px">
  <div style="width:96px;height:96px;border-radius:50%;background:${V.av};color:${V.avInk};font-weight:800;font-size:46px;display:flex;align-items:center;justify-content:center">${ini}</div>
  <div><div style="font-weight:700;font-size:40px;line-height:1.1">${e(o.autor)}</div><div style="font-size:28px;color:${V.soft};margin-top:4px">opinia z wizytówki Google</div></div>
 </div>
</div>
<div style="position:absolute;left:0;right:0;bottom:150px;text-align:center;font-weight:700;font-size:30px;letter-spacing:.12em;color:${V.soft}">@PSYCHOLOGSPORTU</div>
</body></html>`;
render(html,out,1080,1920).then(()=>console.log('ok',out));
