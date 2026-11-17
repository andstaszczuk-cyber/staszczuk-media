// Grafika: nowe profile edukacyjne (Mądry Sport, Sędzia z głową, Sportowa Rodzina) dla @psychologsportu.
// node nowe-profile.js out.png W H
const path=require('path');const {render}=require('./kit');
const [out,W,H]=[process.argv[2],+process.argv[3],+process.argv[4]];
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['400','500','600','700','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const story=H>1600;
const B=[
 {n:'Mądry Sport',d:'Dbamy o edukację w zakresie zdrowia fizycznego i psychicznego.',h:'@madrysport.pl',bg:'#0D262C',ink:'#fff',acc:'#F6CFD2',chip:'#15625F'},
 {n:'Sędzia z głową',d:'Psychologia sędziowania: presja, decyzje i spokój na boisku.',h:'@sedziazglowa',bg:'#FCE86A',ink:'#2B1515',acc:'#9E3236',chip:'#9E3236'},
 {n:'Sportowa Rodzina',d:'Dla rodziców młodych sportowców: jak mądrze wspierać dziecko w sporcie.',h:'@sportowarodzina',bg:'#F4F1E6',ink:'#2A2622',acc:'#7A2423',chip:'#C4C18E'}];
const card=b=>`<div style="background:${b.bg};color:${b.ink};border-radius:34px;padding:${story?'40px 44px':'32px 40px'};box-shadow:0 18px 40px rgba(30,5,6,.35)">
 <div style="display:flex;justify-content:space-between;align-items:center;gap:20px"><div style="font-weight:800;font-size:${story?54:48}px;line-height:1.05">${b.n}</div>
 <div style="background:${b.chip};color:${b.bg=='#FCE86A'?'#fff':(b.bg=='#F4F1E6'?'#2A2622':'#fff')};font-weight:700;font-size:${story?26:24}px;padding:10px 20px;border-radius:30px;white-space:nowrap">${b.h}</div></div>
 <div style="margin-top:14px;font-size:${story?32:29}px;line-height:1.35;font-weight:500;opacity:.9">${b.d}</div></div>`;
const html=`<!doctype html><html><head><meta charset=utf-8><style>${css}body{margin:0;width:${W}px;height:${H}px;overflow:hidden;font-family:Pop;color:#fff;background:radial-gradient(120% 70% at 85% 0%,#C25257 0%,#9E3236 40%,#6E1F20 100%)}</style></head><body>
<div style="position:absolute;right:-180px;top:-180px;width:620px;height:620px;border-radius:50%;border:2px solid rgba(252,232,106,.2)"></div>
<div style="position:absolute;left:80px;right:80px;top:${story?190:70}px;bottom:${story?240:70}px;display:flex;flex-direction:column;justify-content:center">
 <div style="align-self:flex-start;background:#FCE86A;color:#3A0D0E;font-weight:800;font-size:28px;letter-spacing:.08em;padding:11px 24px;border-radius:40px">NOWE PROFILE</div>
 <div style="margin-top:22px;font-weight:800;font-size:${story?92:80}px;line-height:1.02;letter-spacing:-.01em">Zrobiłem nowe miejsca do <span style="color:#FCE86A">edukacji</span></div>
 <div style="margin-top:18px;font-size:${story?34:31}px;line-height:1.35;color:rgba(255,255,255,.88)">Każde dla innej osoby w sporcie. Zajrzyj i zaobserwuj to, które jest dla Ciebie.</div>
 <div style="height:${story?56:40}px"></div>
 ${B.map(card).join(`<div style="height:${story?28:22}px"></div>`)}
 <div style="margin-top:${story?44:30}px;font-weight:700;font-size:28px;letter-spacing:.1em;color:rgba(255,255,255,.75)">ANDRZEJ STASZCZUK · @PSYCHOLOGSPORTU</div>
</div></body></html>`;
render(html,out,W,H).then(()=>console.log('ok',out));
