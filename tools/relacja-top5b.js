// Relacja IG 1080x1920: top 5 (blog/podcast), wersja z ilustracją i kartami.
// node relacja-top5b.js spec.json out.png ; spec {kicker,big,sub,icon:"book|phones",items:[{t,d,tag}],cta,cta2}
const fs=require('fs'),path=require('path');const {render}=require('./kit');
const s=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['400','500','600','700','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const e=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\*(.+?)\*/g,'<span style="color:#FCE86A">$1</span>');
const Y='#FCE86A',R='#9E3236';
const ICON={
book:`<svg viewBox="0 0 300 220" width="300" height="220"><g fill="none" stroke="${Y}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
<path d="M150 60 C120 38 70 34 30 44 V190 C70 180 120 184 150 206 C180 184 230 180 270 190 V44 C230 34 180 38 150 60 Z"/><path d="M150 60 V206"/>
<path d="M58 80 C85 74 110 76 128 86" opacity=".55"/><path d="M58 112 C85 106 110 108 128 118" opacity=".55"/><path d="M58 144 C85 138 110 140 128 150" opacity=".55"/>
<path d="M172 86 C190 76 215 74 242 80" opacity=".55"/><path d="M172 118 C190 108 215 106 242 112" opacity=".55"/></g>
<g fill="#fff"><circle cx="262" cy="22" r="7"/><circle cx="38" cy="14" r="5"/><circle cx="284" cy="70" r="4"/></g></svg>`,
phones:`<svg viewBox="0 0 300 220" width="300" height="220"><g fill="none" stroke="${Y}" stroke-width="10" stroke-linecap="round">
<path d="M62 150 V120 C62 66 102 30 150 30 C198 30 238 66 238 120 V150"/></g>
<rect x="40" y="128" width="50" height="78" rx="18" fill="${Y}"/><rect x="210" y="128" width="50" height="78" rx="18" fill="${Y}"/>
<g stroke="#fff" stroke-width="8" stroke-linecap="round"><path d="M118 150 V178"/><path d="M134 132 V196"/><path d="M150 144 V184"/><path d="M166 124 V204"/><path d="M182 146 V182"/></g></svg>`};
const cards=s.items.map((x,i)=>`<div style="display:flex;align-items:center;gap:30px;background:#fff;border-radius:30px;padding:26px 34px 26px 26px;box-shadow:0 14px 34px rgba(40,6,8,.28)">
<div style="flex:none;width:92px;height:92px;border-radius:24px;background:${i==0?Y:'#F6E7E2'};color:${R};font-weight:800;font-size:54px;display:flex;align-items:center;justify-content:center">${i+1}</div>
<div style="min-width:0"><div style="font-weight:700;font-size:36px;line-height:1.16;color:#2a1012">${e(x.t)}</div>
<div style="margin-top:6px;font-size:26px;line-height:1.3;color:#7d5a5b">${x.tag?`<b style="color:${R};font-weight:700">${e(x.tag)}</b> · `:''}${e(x.d)}</div></div></div>`).join('<div style="height:22px"></div>');
const html=`<!doctype html><html><head><meta charset=utf-8><style>${css}body{margin:0;width:1080px;height:1920px;font-family:Pop;overflow:hidden;background:radial-gradient(120% 70% at 85% 0%,#C25257 0%,#9E3236 38%,#6E1F20 100%)}</style></head><body>
<div style="position:absolute;right:-180px;top:-160px;width:620px;height:620px;border-radius:50%;border:2px solid rgba(252,232,106,.22)"></div>
<div style="position:absolute;right:-90px;top:-70px;width:440px;height:440px;border-radius:50%;border:2px solid rgba(252,232,106,.16)"></div>
<div style="position:absolute;left:-160px;bottom:-200px;width:560px;height:560px;border-radius:50%;background:rgba(0,0,0,.12)"></div>
<div style="position:absolute;left:84px;right:84px;top:150px;bottom:230px;display:flex;flex-direction:column;justify-content:center">
 <div style="display:flex;justify-content:space-between;align-items:flex-end">
  <div style="display:inline-block;background:${Y};color:#2a0d0e;font-weight:800;font-size:28px;letter-spacing:.08em;padding:11px 24px;border-radius:40px;margin-bottom:6px">${e(s.kicker)}</div>
  <div style="transform:scale(.72);transform-origin:right bottom;margin-bottom:-4px">${ICON[s.icon]||''}</div>
 </div>
 <div style="margin-top:14px;font-weight:800;font-size:150px;line-height:.95;color:#fff;letter-spacing:-.02em">${e(s.big)}</div>
 <div style="margin-top:16px;font-weight:500;font-size:34px;line-height:1.3;color:rgba(255,255,255,.88)">${e(s.sub).replace(/&lt;br>/g,"<br>")}</div>
 <div style="height:56px"></div>${cards}
 <div style="margin-top:46px;background:${Y};border-radius:28px;padding:24px 34px;color:#2a0d0e">
  <div style="font-weight:800;font-size:34px;line-height:1.2">${e(s.cta)}</div>${s.cta2?`<div style="margin-top:4px;font-weight:500;font-size:27px">${e(s.cta2)}</div>`:''}</div>
</div></body></html>`;
render(html,process.argv[3],1080,1920).then(()=>console.log('ok'));
