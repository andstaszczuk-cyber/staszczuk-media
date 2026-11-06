// Relacja IG 1080x1920 dla @psychologsportu: książki dostępne jako audiobooki.
// Użycie: node audiobook-relacja.js ../psychologsportu/relacje/audiobooki.png
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);const out=process.argv[2];
const css=['600','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const hp='<svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#F4B63A" stroke-width="1.6" stroke-linecap="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5" fill="#F4B63A"/><rect x="17" y="14" width="4" height="6" rx="1.5" fill="#F4B63A"/></svg>';
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${css}
html,body{margin:0;width:1080px;height:1920px;background:radial-gradient(120% 70% at 50% 0%,#1E242E,#11141A);font-family:Pop;color:#fff}
.w{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:0 100px}
.lab{background:#C42332;font-weight:800;font-size:36px;padding:12px 30px;border-radius:40px;letter-spacing:2px;margin-bottom:70px}
.t{font-size:92px;font-weight:800;line-height:1.08;margin-top:60px}.t span{color:#F4B63A}
.d{font-size:42px;font-weight:600;color:#C9CED6;line-height:1.4;margin-top:50px}
.c{margin-top:80px;background:#F4B63A;color:#11141A;font-weight:800;font-size:44px;padding:24px 50px;border-radius:50px}
.h{position:absolute;bottom:150px;left:0;right:0;text-align:center;font-size:34px;font-weight:800;color:#A9B0BC;letter-spacing:2px}</style></head><body><div class="w">
<div class="lab">OD DZIŚ</div>${hp}<div class="t">Moje książki<br>są już jako <span>audiobooki</span></div>
<div class="d">Słuchaj w drodze na trening, na rozbieganiu albo przed zawodami.</div><div class="c">Link w bio</div></div><div class="h">@psychologsportu</div></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});
const tmp=path.join(__dirname,'.ab.tmp.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);
fs.mkdirSync(path.dirname(out),{recursive:true});await p.screenshot({path:out});await b.close();fs.unlinkSync(tmp);console.log('ok',out);})();
