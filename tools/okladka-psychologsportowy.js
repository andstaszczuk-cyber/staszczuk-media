// Okładka rolki 9:16 dla @psychologsportowy (grafit + żółty, Poppins), osobny styl niż @psychologsportu.
// node okladka-psychologsportowy.js '{"kolor":"grafit|zolty","kicker":"ROLKA","t1":"Twoje sto procent to ","hl":"za mało","t2":"?","foto":"/abs/kadr.jpg"}' out.png
// foto opcjonalne: kadr z rolki w zaokrąglonym oknie u góry. Bez cudzysłowów.
const path=require('path');const {render}=require('./kit');
const o=JSON.parse(process.argv[2]),out=process.argv[3];
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['500','600','700','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const Z=o.kolor==='zolty';
const bg=Z?'radial-gradient(120% 85% at 50% 30%,#fff1a0 0%,#FCE86A 45%,#f3d94c 100%)':'radial-gradient(120% 85% at 50% 32%,#4a4a4f 0%,#2c2c30 42%,#1a1a1d 100%)';
const ink=Z?'#151515':'#FFFFFF', acc=Z?'#151515':'#FCE86A', hlBg=Z?'#151515':'transparent', hlInk=Z?'#FCE86A':'#FCE86A';
const e=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
const foto=o.foto?'file://'+o.foto:'';
const html=`<!doctype html><html><head><meta charset=utf-8><style>${css}body{margin:0;width:1080px;height:1920px;overflow:hidden;font-family:Pop;background:${bg};color:${ink}}</style></head><body>
<div style="position:absolute;left:90px;right:90px;top:${foto?150:0}px;bottom:${foto?220:0}px;display:flex;flex-direction:column;justify-content:${foto?'flex-start':'center'}">
 ${foto?`<div style="height:820px;border-radius:44px;background:url('${foto}') center 25%/cover;box-shadow:0 24px 50px rgba(0,0,0,.35);margin-bottom:70px"></div>`:''}
 <div style="align-self:flex-start;border:4px solid ${acc};color:${acc};font-weight:800;font-size:30px;letter-spacing:.1em;padding:10px 26px;border-radius:40px">${e(o.kicker||'ROLKA')}</div>
 <div style="margin-top:34px;font-weight:800;font-size:${foto?96:118}px;line-height:${Z?1.2:1.04};letter-spacing:-.015em">${e(o.t1)}<span style="background:${hlBg};color:${hlInk};${Z?'padding:0 14px;border-radius:14px;box-decoration-break:clone;-webkit-box-decoration-break:clone':''}">${e(o.hl)}</span>${e(o.t2)}</div>
 <div style="margin-top:40px;width:160px;height:12px;border-radius:8px;background:${acc}"></div>
</div>
<div style="position:absolute;left:0;right:0;bottom:120px;text-align:center;font-weight:700;font-size:30px;letter-spacing:.12em;color:${Z?'rgba(21,21,21,.7)':'rgba(255,255,255,.7)'}">@PSYCHOLOGSPORTOWY</div>
</body></html>`;
render(html,out,1080,1920).then(()=>console.log('ok',out));
