// Relacja IG: oferta dla dzieci i młodzieży, w estetyce strony andrzejstaszczuk.pl/dzieci-i-mlodziez (komiks: niebieskie tło, Bangers, żółty z obrysem).
// node relacja-dzieci.js out.png
const path=require('path');const {render}=require('./kit');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=`@font-face{font-family:Bang;src:url(${F('bangers/files/bangers-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F}@font-face{font-family:Bang;src:url(${F('bangers/files/bangers-latin-400-normal.woff2')})}`+['500','600','700'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const K='#1B1520',Y='#FFD23A',R='#E0403D';
const ring=n=>Array.from({length:24},(_,i)=>{const a=i/24*2*Math.PI;return `${K} ${(n*Math.cos(a)).toFixed(1)}px ${(n*Math.sin(a)).toFixed(1)}px 0`}).join(',');
const big=`font-family:Bang;color:${Y};text-shadow:${ring(5)},${K} 8px 10px 0;letter-spacing:.01em`;
const card=(t,d)=>`<div style="background:#fff;border:4px solid ${K};box-shadow:${K} 8px 8px 0;border-radius:18px;padding:24px 30px;margin-top:26px"><div style="font-family:Bang;font-size:50px;color:${K};letter-spacing:.02em">${t}</div><div style="font-size:30px;line-height:1.35;color:#3a3340;margin-top:4px">${d}</div></div>`;
const html=`<!doctype html><html><head><meta charset=utf-8><style>${css}body{margin:0;width:1080px;height:1920px;overflow:hidden;font-family:Pop;color:${K};background:linear-gradient(rgb(124,201,242) 0%,rgb(169,220,246) 75%,rgb(205,235,250) 100%)}</style></head><body>
<svg style="position:absolute;right:-60px;top:120px;opacity:.35" width="420" height="420" viewBox="0 0 100 100"><g fill="none" stroke="#fff" stroke-width="1.6">${Array.from({length:14},(_,i)=>{const a=i/14*2*Math.PI;return `<line x1="50" y1="50" x2="${(50+48*Math.cos(a)).toFixed(1)}" y2="${(50+48*Math.sin(a)).toFixed(1)}"/>`}).join('')}</g></svg>
<div style="position:absolute;left:90px;right:90px;top:210px;bottom:230px;display:flex;flex-direction:column;justify-content:center">
 <div style="display:flex;align-items:center;gap:20px"><div style="width:70px;height:8px;background:${Y};border:3px solid ${K}"></div><div style="font-family:Bang;font-size:42px;color:${R};letter-spacing:.04em">Oferta dla młodych zawodników</div></div>
 <div style="${big};font-size:150px;line-height:.98;margin-top:26px">Psycholog sportowy dla dzieci i młodzieży</div>
 <div style="font-size:34px;line-height:1.45;font-weight:500;margin-top:34px">Mamy ofertę dla młodych sportowców, którzy chcą radzić sobie ze stresem, błędami i presją, a przy tym nie stracić radości z gry.</div>
 ${card('Młodsi zawodnicy · 8–12 lat','Praca przez zabawę, rysunek, krótkie zadania i proste historie.')}
 ${card('Młodzież · 13–18 lat','Rozmowa wprost, bez dziecinnego tonu, i narzędzia do sprawdzenia na treningu.')}
 <div style="font-size:28px;line-height:1.4;margin-top:30px;color:#2c2632">Sesje online prowadzą Wiola Skawińska i Aleksandra Mikulicz.</div>
 <div style="align-self:flex-start;margin-top:34px;background:${Y};border:4px solid ${K};box-shadow:${K} 8px 8px 0;padding:18px 36px;font-family:Bang;font-size:52px;letter-spacing:.03em">Umów bezpłatne spotkanie</div>
 <div style="margin-top:22px;font-weight:700;font-size:30px">andrzejstaszczuk.pl/dzieci-i-mlodziez</div>
</div></body></html>`;
render(html,process.argv[2],1080,1920).then(()=>console.log('ok'));
