const fs=require('fs'),path=require('path');const T='/home/claude/staszczuk-media/tools';
const {chromium}=require(T+'/node_modules/playwright');
const F=p=>'file://'+path.join(T,'node_modules/@fontsource',p);
const font=`@font-face{font-family:P;font-weight:800;src:url(${F('poppins/files/poppins-latin-ext-800-normal.woff2')});unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:P;font-weight:800;src:url(${F('poppins/files/poppins-latin-800-normal.woff2')})}
@font-face{font-family:P;font-weight:500;src:url(${F('poppins/files/poppins-latin-ext-500-normal.woff2')});unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:P;font-weight:500;src:url(${F('poppins/files/poppins-latin-500-normal.woff2')})}`;
const V={
 psy:{bg:'radial-gradient(110% 80% at 50% 38%,#4b4b4f 0%,#26262a 45%,#121214 100%)',acc:'#FCE86A',img:'/home/claude/P/ph_sit.jpg',role:'psycholog sportu',facts:['Pracuję z zawodnikami z ponad 40 dyscyplin','Sam trenuję i startuję','Najpierw człowiek, potem sportowiec'],handle:'@psychologsportowy'},
 sed:{bg:'radial-gradient(120% 90% at 85% 0%,#4A1E21 0%,#1A1719 55%,#141215 100%)',acc:'#FCE86A',img:'/home/claude/P/ph_bw.jpg',role:'psycholog sportu dla sędziów',facts:['Decyzje pod presją i reset po błędzie','Krytyka, ocena i trudne rozmowy na boisku','Sam trenuję i startuję, wiem, jak smakuje stres'],handle:'@sedziazglowa'}};
(async()=>{const d=fs.readdirSync('/opt/pw-browsers').filter(x=>x.startsWith('chromium_headless_shell')).sort().reverse()[0];
const b=await chromium.launch({executablePath:`/opt/pw-browsers/${d}/chrome-linux/headless_shell`,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [k,v] of Object.entries(V)){const img='data:image/jpeg;base64,'+fs.readFileSync(v.img).toString('base64');
const html=`<!doctype html><html><head><meta charset=utf-8><style>${font}html,body{margin:0;width:1080px;height:1350px;overflow:hidden;background:${v.bg};color:#fff;font-family:P}</style></head><body>
<div style="position:absolute;inset:0 0 130px 0;display:flex;flex-direction:column;align-items:center;justify-content:center">
<div style="font:500 30px P;letter-spacing:6px;color:${v.acc};margin-bottom:44px">KIM JESTEM</div>
<div style="width:560px;height:560px;border-radius:50%;overflow:hidden;border:10px solid ${v.acc};box-sizing:border-box"><img src="${img}" style="width:100%;height:100%;object-fit:cover;object-position:50% 20%"></div>
<div style="font:800 84px/1.1 P;margin-top:54px">Andrzej Staszczuk</div>
<div style="font:500 40px P;color:${v.acc};margin-top:12px">${v.role}</div>
<div style="width:110px;height:8px;background:${v.acc};margin:40px 0 36px"></div>
${v.facts.map(f=>`<div style="font:500 36px/1.5 P;opacity:.92">${f}</div>`).join('')}
</div><div style="position:absolute;left:0;right:0;bottom:56px;text-align:center;font:500 26px P;opacity:.6">${v.handle}</div></body></html>`;
fs.writeFileSync('/home/claude/PIN/.p.html',html);await p.goto('file:///home/claude/PIN/.p.html');await p.evaluate(()=>document.fonts.ready);
fs.mkdirSync(`out/${k}B`,{recursive:true});await p.screenshot({path:`out/${k}B/1.png`});}
await b.close();})();
