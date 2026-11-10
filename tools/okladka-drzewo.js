// Okładka JAK TO DZIAŁA (układ 3) z drzewem i korzeniami. node okladka-drzewo.js out.png
const fs=require('fs'),path=require('path');const out=process.argv[2];
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const Y='#F4B63A';
const svg=`<svg viewBox="0 0 200 230" width="640" height="736" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
<path d="M58 28 a12 12 0 0 1 22 -6 a14 14 0 0 1 26 4 a10 10 0 0 1 2 20 h-48 a9 9 0 0 1 -2 -18z" stroke-opacity=".8"/>
<line x1="66" y1="54" x2="62" y2="64" stroke-opacity=".6"/><line x1="80" y1="54" x2="76" y2="64" stroke-opacity=".6"/><line x1="94" y1="54" x2="90" y2="64" stroke-opacity=".6"/>
<path d="M150 40 q10 -4 20 0 M146 52 q12 -4 26 0" stroke-opacity=".6"/>
<path d="M84 112 C62 116 54 96 66 86 C60 68 80 56 92 64 C98 50 120 52 124 66 C142 66 148 88 136 98 C144 112 124 120 116 112 Z"/>
<path d="M96 116 L96 140 M104 116 L104 140"/>
<line x1="10" y1="140" x2="190" y2="140" stroke-opacity=".5"/>
<g stroke="${Y}"><path d="M100 140 Q70 150 46 162 Q34 172 30 190"/><path d="M100 140 Q130 150 154 162 Q166 172 170 190"/><path d="M100 140 L100 200"/>
<path d="M60 156 Q56 170 62 182"/><path d="M140 156 Q144 170 138 182"/><path d="M100 168 Q86 178 80 200"/><path d="M100 168 Q114 178 120 200"/></g></svg>`;
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${css}html,body{margin:0;width:1080px;height:1920px;background:linear-gradient(180deg,#C42332 0%,#8E1426 100%);font-family:Pop}
.fr{position:absolute;left:40px;top:40px;right:40px;bottom:40px;border:9px solid rgba(244,182,58,.85);border-radius:36px}
.w{position:absolute;inset:0;padding:315px 99px 0}.top{display:flex;justify-content:space-between;align-items:center}
.tag{background:${Y};color:#11141A;font-size:45px;font-weight:800;letter-spacing:.08em;padding:22px 45px;border-radius:90px}.n{color:${Y};font-size:81px;font-weight:800}
.t{margin-top:99px;color:#fff;font-size:112px;font-weight:800;line-height:1.14}.t span{color:${Y}}.f{margin-top:40px;display:flex;justify-content:center}</style></head><body><div class="fr"></div>
<div class="w"><div class="top"><div class="tag">JAK TO DZIAŁA</div><div class="n">${process.argv[3]||1}</div></div><div class="t">Przetrwasz każdą pogodę dzięki <span>korzeniom</span></div><div class="f">${svg}</div></div></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse())for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.od.tmp.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out});await b.close();fs.unlinkSync(tmp);console.log('ok')})();
