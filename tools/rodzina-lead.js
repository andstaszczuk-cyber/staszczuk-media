// Relacja IG 1080x1920 dla @sportowarodzina zachęcająca do pobrania poradnika dla rodziców (styl profilu: krem, bordo, odręczna czcionka).
// Użycie: node rodzina-lead.js '{"hook":"Twoje dziecko przegrało i milczy w samochodzie?"}' ../rodzina/relacje-lead/RRRR-MM-DD.png
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const o=JSON.parse(process.argv[2]),out=process.argv[3];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/[„”“"]/g,'');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:AD;src:url(${F('architects-daughter/files/architects-daughter-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:AD;src:url(${F('architects-daughter/files/architects-daughter-latin-400-normal.woff2')})}
html,body{margin:0;width:1080px;height:1920px;background:#F4F1E6;color:#2A2622;font-family:AD}
.w{position:absolute;inset:0;padding:0 100px;display:flex;flex-direction:column;justify-content:center}
.h{font-size:76px;line-height:1.2;color:#7A2423}
.l{width:180px;height:6px;background:#AE4549;border-radius:3px;margin:60px 0}
.k{background:#fff;border:5px solid #7A2423;border-radius:36px;padding:56px 60px;box-shadow:14px 14px 0 #C4C18E}
.k .a{font-size:36px;color:#AE4549}.k .t{font-size:62px;line-height:1.18;margin:16px 0 22px}.k .d{font-size:36px;line-height:1.35}
.c{margin-top:70px;font-size:48px;text-align:center}.c b{color:#7A2423;font-weight:400;text-decoration:underline}
.f{position:absolute;bottom:130px;left:0;right:0;text-align:center;font-size:34px;opacity:.7}</style></head><body><div class="w">
<div class="h">${esc(o.hook)}</div><div class="l"></div>
<div class="k"><div class="a">darmowy poradnik dla rodziców</div><div class="t">Jak rozmawiać z dzieckiem po przegranej?</div><div class="d">12 sytuacji po zawodach: co dziecko może czuć, czego lepiej nie mówić i co powiedzieć zamiast tego.</div></div>
<div class="c">Pobierz za darmo: <b>link w bio</b></div></div><div class="f">@sportowarodzina</div></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});
const tmp=path.join(__dirname,'.rl.tmp.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);
fs.mkdirSync(path.dirname(out),{recursive:true});await p.screenshot({path:out});await b.close();fs.unlinkSync(tmp);console.log('ok',out);})();
