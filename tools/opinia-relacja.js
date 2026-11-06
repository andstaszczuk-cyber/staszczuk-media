// Relacja IG 1080x1920 z opinią z Google dla @psychologsportu (grafit, żółte gwiazdki, Poppins).
// Użycie: node opinia-relacja.js '{"tekst":"…","autor":"Imię N.","gwiazdki":5}' ../psychologsportu/opinie/NN.png
// Tekst opinii wklejamy tak, jak jest w Google (bez poprawiania sensu), autor tylko imię i inicjał.
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const o=JSON.parse(process.argv[2]),out=process.argv[3];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/[„”“"]/g,'');
const len=esc(o.tekst).length, fs_=len<180?50:len<320?42:len<480?36:30;
const star='<svg width="64" height="64" viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="#F4B63A"/></svg>';
const css=['600','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${css}
html,body{margin:0;width:1080px;height:1920px;background:radial-gradient(120% 70% at 50% 0%,#1E242E,#11141A);font-family:Pop;color:#fff}
.w{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 110px}
.lab{display:inline-block;align-self:flex-start;background:#F4B63A;color:#11141A;font-weight:800;font-size:34px;padding:12px 28px;border-radius:40px;letter-spacing:1px}
.st{margin:60px 0 40px;display:flex;gap:10px}
.q{font-size:220px;line-height:.5;color:#C42332;font-weight:800;height:90px}
.t{font-size:${fs_}px;font-weight:600;line-height:1.42}
.a{margin-top:54px;font-size:38px;font-weight:800;color:#F4B63A}
.h{position:absolute;bottom:150px;left:0;right:0;text-align:center;font-size:34px;font-weight:800;color:#A9B0BC;letter-spacing:2px}</style></head><body><div class="w">
<div class="lab">OPINIA Z GOOGLE</div><div class="st">${star.repeat(o.gwiazdki||5)}</div>
<div class="t">${esc(o.tekst)}</div><div class="a">${esc(o.autor)}</div></div><div class="h">@psychologsportu</div></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});
const tmp=path.join(__dirname,'.op.tmp.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);
fs.mkdirSync(path.dirname(out),{recursive:true});await p.screenshot({path:out});await b.close();fs.unlinkSync(tmp);console.log('ok',out);})();
