// Relacja SST (czerwone tło Staszczuk Sport Team) ze zdjęciem Andrzeja u góry.
// node relacja-sst-foto.js tlo.png foto.jpg 'tytuł z *wyróżnieniem*' 'treść' out.png
const path=require('path');const {render}=require('./kit');
const [tlo,foto,t,b,out]=process.argv.slice(2);
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['500','700','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const e=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\*(.+?)\*/g,'<span style="color:#FCE86A">$1</span>');
const abs=p=>'file://'+path.resolve(p);
const html=`<!doctype html><html><head><meta charset=utf-8><style>${css}body{margin:0;width:1080px;height:1920px;overflow:hidden;font-family:Pop;color:#fff;background:url('${abs(tlo)}') center/cover}</style></head><body>
<div style="position:absolute;left:110px;right:110px;top:170px;height:740px;border-radius:40px;background:url('${abs(foto)}') center 8%/cover;box-shadow:0 30px 60px rgba(40,5,8,.45);border:6px solid #FCE86A"></div>
<div style="position:absolute;left:110px;right:110px;top:970px">
<div style="font-weight:800;font-size:58px;line-height:1.18">${e(t)}</div>
<div style="margin:30px 0;width:110px;height:7px;background:#fff;border-radius:4px"></div>
<div style="font-weight:500;font-size:38px;line-height:1.4;color:rgba(255,255,255,.92)">${e(b)}</div></div>
</body></html>`;
render(html,out,1080,1920).then(()=>console.log('ok',out));
