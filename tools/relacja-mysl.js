// Relacje IG 1080x1920 dla @psychologsportu z myślą (grafit, żółty akcent, Poppins). Każdy zestaw to kilka klatek.
// Użycie: node relacja-mysl.js zestawy.json outDir   (zestawy.json: [{"id":"a","slides":[{"label":"…","title":"Tekst *wyróżniony*","body":"…"}]}])
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const [,,src,out]=process.argv;const sets=JSON.parse(fs.readFileSync(src,'utf8'));
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/[„”“"]/g,'');
const hl=s=>esc(s).replace(/\*(.+?)\*/g,'<span style="color:#F4B63A">$1</span>');
const css=['500','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const page=(s,i,n)=>`<!doctype html><html><head><meta charset="utf-8"><style>${css}
html,body{margin:0;width:1080px;height:1920px;background:radial-gradient(120% 70% at 50% 0%,#1E242E,#11141A);font-family:Pop;color:#fff}
.w{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 100px}
.lab{align-self:flex-start;background:#C42332;font-weight:800;font-size:30px;padding:10px 26px;border-radius:40px;letter-spacing:1px;margin-bottom:60px}
.t{font-size:${s.title.length>60?78:92}px;font-weight:800;line-height:1.1}
.l{width:150px;height:8px;background:#F4B63A;margin:60px 0}
.b{font-size:44px;font-weight:500;line-height:1.45;color:#D7DBE2}
.top{position:absolute;top:130px;left:0;right:0;text-align:center;font-size:32px;font-weight:800;color:#A9B0BC;letter-spacing:2px}
.n{position:absolute;bottom:150px;left:0;right:0;text-align:center;font-size:32px;font-weight:500;color:#F4B63A}</style></head><body>
<div class="top">@psychologsportu</div><div class="w">${s.label?`<div class="lab">${esc(s.label)}</div>`:''}<div class="t">${hl(s.title)}</div>${s.body?`<div class="l"></div><div class="b">${hl(s.body)}</div>`:''}</div>
${n>1?`<div class="n">${i<n-1?'stuknij dalej →':''}</div>`:''}</body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.rm.tmp.html');fs.mkdirSync(out,{recursive:true});
for(const st of sets)for(let i=0;i<st.slides.length;i++){fs.writeFileSync(tmp,page(st.slides[i],i,st.slides.length));await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(out,`${st.id}-${i+1}.png`)});}
await b.close();fs.unlinkSync(tmp);console.log('ok');})();
