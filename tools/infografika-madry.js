// Mądry Sport: infografika ze statystyką (FB/IG 1080x1350). node infografika-madry.js spec.json out.png
const fs=require('fs'),path=require('path');const [spec,out]=process.argv.slice(2);const d=JSON.parse(fs.readFileSync(spec,'utf8'));
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const Z='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'../madry/logo/znak-sst.png')).toString('base64');
const PK='#F6CFD2',MI='#BCD6D2',LINE='#4FBFB3';
const person=(c)=>`<svg viewBox="0 0 60 120" width="90" height="180"><circle cx="30" cy="16" r="14" fill="${c}"/><path d="M12 36 H48 Q54 36 54 44 V78 H44 V118 H34 V84 H26 V118 H16 V78 H6 V44 Q6 36 12 36Z" fill="${c}"/></svg>`;
const people=[...Array(d.of)].map((_,i)=>person(i<d.hit?PK:'rgba(188,214,210,.28)')).join('');
const hl=s=>s.replace(/\*(.+?)\*/g,`<span style="color:${PK}">$1</span>`);
const html=`<!doctype html><meta charset=utf-8><style>
@font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-ext-600-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-600-normal.woff2')})}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-ext-900-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-900-normal.woff2')})}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden;position:relative;font-family:M;background:linear-gradient(160deg,#0D262C 0%,#15625F 100%);color:#fff}
.p{position:absolute;left:100px;right:100px}</style>
<div style="position:absolute;inset:40px;border:6px solid ${LINE}"></div>
<div class=p style="top:110px;font-weight:900;font-size:26px;letter-spacing:6px;color:${MI}">${d.label}</div>
<div class=p style="top:170px;font-weight:900;font-size:230px;line-height:1;letter-spacing:-6px;color:${PK}">${d.big}</div>
<div class=p style="top:420px;font-weight:900;font-size:68px;line-height:1.12;letter-spacing:-1px">${hl(d.title)}</div>
<div class=p style="top:680px;display:flex;gap:22px">${people}</div>
<div class=p style="top:900px;font-weight:600;font-size:38px;line-height:1.45;color:${MI}">${d.body}</div>
<div class=p style="bottom:150px;font-weight:600;font-size:22px;line-height:1.4;color:rgba(188,214,210,.75)">Źródło: ${d.src}</div>
<div class=p style="bottom:86px;display:flex;align-items:center;gap:14px;font-weight:900;font-size:26px;letter-spacing:3px"><span style="display:inline-block;width:20px;height:47px;background:#fff;-webkit-mask:url(${Z}) center/contain no-repeat"></span>MĄDRY SPORT<span style="color:${PK};font-size:20px;letter-spacing:0">.pl</span></div>`;
(async()=>{const {chromium}=require('playwright');const g=fs.readdirSync('/opt/pw-browsers').filter(x=>x.startsWith('chromium_headless_shell')).sort().reverse();
const b=await chromium.launch({executablePath:`/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1350}});
const tmp=path.join(__dirname,'.tmpi.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out});fs.unlinkSync(tmp);await b.close();})();
