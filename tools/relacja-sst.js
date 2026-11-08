// Relacja na tle Staszczuk Sport Team (czerwone tło z logo). Użycie: node relacja-sst.js tlo.png 'tytuł z *wyróżnieniem*' 'body' out.png
const fs=require('fs'),path=require('path');const [,,bg,title,body,out]=process.argv;
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['500','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const hl=s=>s.replace(/\*(.+?)\*/g,'<span style="color:#FCE86A">$1</span>');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${css}html,body{margin:0;width:1080px;height:1920px;background:url(${'file://'+path.resolve(bg)}) center/cover;font-family:Pop;color:#fff}
.w{position:absolute;left:110px;right:110px;top:0;height:1480px;display:flex;flex-direction:column;justify-content:center}
.t{font-size:66px;font-weight:800;line-height:1.14;text-shadow:0 2px 12px rgba(0,0,0,.18)}.l{width:150px;height:8px;background:#fff;margin:60px 0;border-radius:4px}
.b{font-size:44px;font-weight:500;line-height:1.45}</style></head><body><div class="w"><div class="t">${hl(title)}</div><div class="l"></div><div class="b">${hl(body)}</div></div></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse())for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.sst.tmp.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out});await b.close();fs.unlinkSync(tmp);console.log('ok')})();
