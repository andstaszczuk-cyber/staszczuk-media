// Relacja IG 1080x1920: lista top 5 (blog albo podcast) w kolorach @psychologsportu.
// node relacja-top5.js spec.json out.png ; spec {kicker,title,items:[{t,d}],cta}
const fs=require('fs'),path=require('path');const {render}=require('./kit');
const s=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['400','600','700','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const e=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\*(.+?)\*/g,'<b style="color:#FCE86A">$1</b>');
const items=s.items.map((x,i)=>`<div style="display:flex;gap:30px;align-items:flex-start;margin-top:${i?44:0}px">
<div style="flex:none;width:84px;height:84px;border-radius:50%;background:#FCE86A;color:#2a0d0e;font-weight:800;font-size:46px;display:flex;align-items:center;justify-content:center">${i+1}</div>
<div><div style="font-weight:700;font-size:40px;line-height:1.18;color:#fff">${e(x.t)}</div><div style="margin-top:10px;font-size:29px;line-height:1.35;color:rgba(255,255,255,.82)">${e(x.d)}</div></div></div>`).join('');
const html=`<!doctype html><html><head><meta charset=utf-8><style>${css}body{margin:0;width:1080px;height:1920px;font-family:Pop;background:linear-gradient(180deg,#AE4549 0%,#7A2423 100%)}</style></head><body>
<div style="position:absolute;inset:34px;border:5px solid #FCE86A;border-radius:28px"></div>
<div style="position:absolute;left:100px;right:100px;top:230px;bottom:260px;display:flex;flex-direction:column;justify-content:center">
<div style="align-self:flex-start;background:#FCE86A;color:#2a0d0e;font-weight:800;font-size:30px;letter-spacing:.06em;padding:12px 26px;border-radius:40px">${e(s.kicker)}</div>
<div style="margin-top:34px;font-weight:800;font-size:76px;line-height:1.08;color:#fff">${e(s.title)}</div>
<div style="height:64px"></div>${items}
<div style="margin-top:64px;align-self:flex-start;border:3px solid #FCE86A;color:#FCE86A;font-weight:700;font-size:32px;padding:14px 30px;border-radius:40px">${e(s.cta)}</div>
</div></body></html>`;
render(html,process.argv[3],1080,1920).then(()=>console.log('ok'));
