// Relacja IG 1080x1920: pytanie do obserwujących, czy pisać książkę Psychologia sportu (miejsce na naklejkę Ankieta).
// Użycie: node ankieta-ksiazka.js ../psychologsportu/relacje/2026-11-07-ankieta-ksiazka.png
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);const out=process.argv[2];
const css=['500','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${css}
html,body{margin:0;width:1080px;height:1920px;font-family:Pop;color:#fff;overflow:hidden;background:radial-gradient(90% 55% at 70% 28%,#3A2A12 0%,#1A1A1F 45%,#0E1014 100%)}
.top{position:absolute;top:120px;left:0;right:0;text-align:center;font-size:32px;font-weight:800;color:#A9B0BC;letter-spacing:2px}
.lab{position:absolute;top:220px;left:90px;background:#C42332;font-weight:800;font-size:32px;padding:12px 28px;border-radius:40px;letter-spacing:2px}
.q{position:absolute;top:320px;left:90px;right:90px;font-size:104px;font-weight:800;line-height:1.03}
.q span{color:#F4B63A}
.scene{position:absolute;top:760px;left:0;right:0;height:640px;perspective:1600px}
.glow{position:absolute;left:50%;top:50%;width:620px;height:620px;transform:translate(-50%,-50%);background:radial-gradient(circle,#F4B63A55 0%,#F4B63A00 65%)}
.book{position:absolute;left:50%;top:40px;width:400px;height:560px;transform:translateX(-50%) rotateY(-24deg) rotateX(4deg);transform-style:preserve-3d}
.front{position:absolute;inset:0;border-radius:6px 14px 14px 6px;background:linear-gradient(160deg,#20242C 0%,#11141A 100%);box-shadow:30px 40px 70px #000a;overflow:hidden;border-left:10px solid #0A0C10}
.spine{position:absolute;left:-44px;top:0;width:44px;height:100%;background:linear-gradient(90deg,#08090C,#171A20);transform:rotateY(-90deg);transform-origin:right}
.pages{position:absolute;right:-22px;top:8px;width:22px;height:calc(100% - 16px);background:repeating-linear-gradient(90deg,#EDE7DA 0 2px,#CFC8B8 2px 4px);transform:rotateY(90deg);transform-origin:left}
.f-in{position:absolute;inset:0;padding:46px 40px;display:flex;flex-direction:column}
.f-au{font-size:22px;font-weight:800;letter-spacing:3px;color:#A9B0BC}
.f-line{width:70px;height:6px;background:#F4B63A;margin:26px 0}
.f-t{font-size:54px;font-weight:800;line-height:1}
.f-t span{color:#F4B63A}
.f-s{margin-top:28px;position:relative;z-index:2;font-size:22px;font-weight:500;color:#C9CED6;line-height:1.4}
.f-arc{position:absolute;right:-110px;bottom:-110px;width:260px;height:260px;border:24px solid #F4B63A;border-radius:50%;opacity:.9}
.f-arc2{position:absolute;right:-40px;bottom:-40px;width:140px;height:140px;border:14px solid #C42332;border-radius:50%}
.q-mark{position:absolute;left:70%;top:-10px;font-size:220px;font-weight:800;color:#F4B63A;transform:rotate(12deg);text-shadow:0 10px 30px #0008}
.poll{position:absolute;left:150px;right:150px;top:1450px;height:230px;border:5px dashed #ffffff66;border-radius:36px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:30px;color:#ffffff88;font-weight:500}
.hint{position:absolute;bottom:110px;left:0;right:0;text-align:center;font-size:36px;font-weight:800;color:#F4B63A}</style></head><body>
<div class="top">@psychologsportu</div><div class="lab">ZAGŁOSUJ</div>
<div class="q">Czas na moją książkę <span>Psychologia sportu?</span></div>
<div class="scene"><div class="glow"></div><div class="book"><div class="spine"></div><div class="pages"></div><div class="front"><div class="f-arc"></div><div class="f-arc2"></div><div class="f-in"><div class="f-au">ANDRZEJ STASZCZUK</div><div class="f-line"></div><div class="f-t">Psychologia<br><span>sportu</span></div><div class="f-s">po ludzku,<br>dla zawodników,<br>trenerów i rodziców</div></div></div></div><div class="q-mark">?</div></div>
<div class="poll">tu wstaw naklejkę Ankieta</div>
<div class="hint">Twój głos decyduje</div></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});
const tmp=path.join(__dirname,'.ak.tmp.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:out});
fs.writeFileSync(tmp,html.replace('<div class="poll">tu wstaw naklejkę Ankieta</div>',''));await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out.replace('.png','-czysta.png')});
await b.close();fs.unlinkSync(tmp);console.log('ok');})();
