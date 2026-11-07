// Relacja IG 1080x1920: pytanie, czy pisać książkę Psychologia sportu. Książka w stylu twardych okładek z serii (jak Stres w sporcie).
// Użycie: node ankieta-ksiazka.js ../psychologsportu/relacje/2026-11-07-ankieta-ksiazka.png  (powstaje też wersja -czysta bez ramki na ankietę)
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);const out=process.argv[2];
const SH='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'sst_shield.png')).toString('base64');
const ff=`@font-face{font-family:Pop;font-weight:800;src:url(${F('poppins/files/poppins-latin-ext-800-normal.woff2')});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:800;src:url(${F('poppins/files/poppins-latin-800-normal.woff2')})}
@font-face{font-family:Anton;src:url(${F('anton/files/anton-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F}@font-face{font-family:Anton;src:url(${F('anton/files/anton-latin-400-normal.woff2')})}
@font-face{font-family:Mono;src:url(file:///usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf)}`;
const html=poll=>`<!doctype html><html><head><meta charset="utf-8"><style>${ff}
html,body{margin:0;width:1080px;height:1920px;font-family:Pop;color:#fff;overflow:hidden;background:radial-gradient(80% 50% at 50% 52%,#3B1517 0%,#17141A 55%,#0E1014 100%)}
.q{position:absolute;top:210px;left:80px;right:80px;text-align:center;font-size:96px;font-weight:800;line-height:1.05}
.q span{color:#F4B63A}
.stage{position:absolute;top:640px;left:0;right:0;height:860px;perspective:2200px}
.shadow{position:absolute;left:50%;top:800px;width:560px;height:60px;transform:translateX(-46%);background:radial-gradient(ellipse,#000c 0%,#0000 70%)}
.book{position:absolute;left:50%;top:0;width:520px;height:780px;margin-left:-230px;transform-style:preserve-3d;transform:rotateY(28deg) rotateX(3deg)}
.front,.spine,.pages,.back{backface-visibility:hidden}
.front{position:absolute;inset:0;transform:translateZ(45px);background:linear-gradient(135deg,#D4444A 0%,#C1343A 45%,#A21F24 100%);border-radius:3px 10px 10px 3px;overflow:hidden;box-shadow:inset 8px 0 14px #0004}
.front:after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,#fff0 30%,#ffffff1c 48%,#fff0 60%)}
.frame{position:absolute;left:38px;top:60px;width:150px;height:150px;border:2px solid #ffffff2a;border-right:none;border-bottom:none}
.frame2{position:absolute;right:38px;bottom:150px;width:150px;height:150px;border:2px solid #ffffff2a;border-left:none;border-top:none}
.au{position:absolute;top:70px;left:0;right:0;text-align:center;font-family:Mono;font-size:21px;letter-spacing:2px;color:#fff}
.t1{position:absolute;top:230px;left:0;right:0;text-align:center;font-family:Anton;font-size:70px;letter-spacing:4px}
.t2{position:absolute;top:322px;left:0;right:0;text-align:center;font-family:Mono;font-size:34px;letter-spacing:6px}
.sub{position:absolute;top:410px;left:40px;right:40px;text-align:center;font-family:Pop;font-weight:800;font-style:italic;font-size:21px;line-height:1.35;letter-spacing:.5px}
.ekg{position:absolute;top:500px;left:60px;right:60px}
.lab{position:absolute;bottom:140px;left:0;right:0;text-align:center;font-family:Mono;font-size:16px;letter-spacing:2px}
.spine{position:absolute;left:0;top:0;width:90px;height:100%;transform-origin:left center;transform:translateZ(45px) rotateY(-90deg);background:linear-gradient(90deg,#7E1519,#A7232A 45%,#8D1A1F);overflow:hidden}
.sp-t{position:absolute;left:50%;top:40px;transform:translateX(-50%);writing-mode:vertical-rl;font-family:Anton;font-size:40px;letter-spacing:3px;white-space:nowrap}
.sp-a{position:absolute;left:50%;top:440px;transform:translateX(-50%);writing-mode:vertical-rl;font-family:Mono;font-size:14px;letter-spacing:2px}
.sp-l{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);width:26px;height:60px;background:#fff;-webkit-mask:url(${SH}) center/contain no-repeat}
.pages{position:absolute;right:0;top:6px;width:88px;height:calc(100% - 12px);transform-origin:right center;transform:translateZ(43px) rotateY(90deg);background:repeating-linear-gradient(0deg,#F2ECDF 0 2px,#D9D1C0 2px 3px)}
.back{position:absolute;inset:0;transform:translateZ(-45px) rotateY(180deg);background:#7E1519}
.poll{position:absolute;left:150px;right:150px;top:1560px;height:220px;border:5px dashed #ffffff66;border-radius:36px;display:flex;align-items:center;justify-content:center;font-size:30px;color:#ffffff88}</style></head><body>
<div class="q">Czas na moją książkę: <span>psychologia sportu</span></div>
<div class="stage"><div class="shadow"></div><div class="book"><div class="back"></div><div class="pages"></div>
<div class="spine"><div class="sp-t">PSYCHOLOGIA SPORTU</div><div class="sp-a">Andrzej Staszczuk</div><div class="sp-l"></div></div>
<div class="front"><div class="frame"></div><div class="frame2"></div><div class="au">Andrzej Staszczuk</div><div class="t1">PSYCHOLOGIA</div><div class="t2">SPORTU</div>
<div class="sub">CZYLI JAK DZIAŁA GŁOWA ZAWODNIKA<br>I CO Z TYM ZROBIĆ</div>
<svg class="ekg" viewBox="0 0 400 80" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M0 50 H150 L165 50 L178 15 L192 72 L204 38 L214 50 H400"/></svg>
<div class="lab">KSIĄŻKA</div>
<div style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);width:40px;height:94px;background:#fff;-webkit-mask:url(${SH}) center/contain no-repeat"></div></div>
</div></div>${poll?'<div class="poll">tu wstaw naklejkę Ankieta</div>':''}</body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.ak.tmp.html');
for(const [poll,o] of [[1,out],[0,out.replace('.png','-czysta.png')]]){fs.writeFileSync(tmp,html(poll));await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:o});}
await b.close();fs.unlinkSync(tmp);console.log('ok');})();
