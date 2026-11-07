// Relacja IG 1080x1920: pytanie, czy pisać książkę Psychologia sportu. Książka: okladki-3d/Psychologia-sportu-ksiazka-3d.png (z ksiazka-flat.js nałożone na makietę serii).
// Użycie: node ankieta-ksiazka.js ../psychologsportu/relacje/2026-11-07-ankieta-ksiazka.png  (powstaje też wersja -czysta bez ramki na ankietę)
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);const out=process.argv[2];
const BK='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'../okladki-3d/Psychologia-sportu-ksiazka-3d.png')).toString('base64');
const ff=`@font-face{font-family:Pop;font-weight:800;src:url(${F('poppins/files/poppins-latin-ext-800-normal.woff2')});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:800;src:url(${F('poppins/files/poppins-latin-800-normal.woff2')})}`;
const html=poll=>`<!doctype html><html><head><meta charset="utf-8"><style>${ff}
html,body{margin:0;width:1080px;height:1920px;font-family:Pop;color:#fff;overflow:hidden;background:radial-gradient(75% 45% at 50% 55%,#4A181B 0%,#18141A 55%,#0E1014 100%)}
.q{position:absolute;top:190px;left:80px;right:80px;text-align:center;font-size:96px;font-weight:800;line-height:1.05}.q span{color:#F4B63A}
.bk{position:absolute;left:50%;top:640px;width:720px;transform:translateX(-50%);filter:drop-shadow(30px 40px 50px #000c)}
.poll{position:absolute;left:150px;right:150px;top:1580px;height:220px;border:5px dashed #ffffff66;border-radius:36px;display:flex;align-items:center;justify-content:center;font-size:30px;color:#ffffff88}</style></head><body>
<div class="q">Czas na moją książkę: <span>psychologia sportu</span></div><img class="bk" src="${BK}">
${poll?'<div class="poll">tu wstaw naklejkę Ankieta</div>':''}</body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.ak.tmp.html');
for(const [poll,o] of [[1,out],[0,out.replace('.png','-czysta.png')]]){fs.writeFileSync(tmp,html(poll));await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:o});}
await b.close();fs.unlinkSync(tmp);console.log('ok');})();
