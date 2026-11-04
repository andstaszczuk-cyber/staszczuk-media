// Logo Mądry Sport do kółka FB/IG: node logo-madry.js outDir
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const V={ciemne:{bg:'#0D262C',ink:'#FFFFFF',dot:'#F6CFD2'},turkus:{bg:'#15625F',ink:'#FFFFFF',dot:'#F6CFD2'},jasne:{bg:'#E6F2F1',ink:'#0D262C',dot:'#15625F'}};
const html=(v,circle)=>`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-ext-900-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-900-normal.woff2')})}
html,body{margin:0;width:1080px;height:1080px;background:${circle?'#fff':v.bg};font-family:M}
.c{position:absolute;inset:0;${circle?`border-radius:50%;background:${v.bg};`:''}display:flex;align-items:center;justify-content:center}
.w{font-weight:900;color:${v.ink};font-size:196px;line-height:1.06;letter-spacing:-4px;position:relative;left:-14px}
.d{display:inline-block;width:54px;height:54px;border-radius:50%;background:${v.dot};margin-left:14px}
</style></head><body><div class="c"><div class="w">MĄDRY<br>SPORT<span class="d"></span></div></div></body></html>`;
(async()=>{const out=process.argv[2];const {chromium}=require('playwright');
const g=fs.readdirSync('/opt/pw-browsers').filter(d=>d.startsWith('chromium_headless_shell')).sort().reverse();
const b=await chromium.launch({executablePath:`/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`,args:['--no-sandbox']});
const pg=await b.newPage({viewport:{width:1080,height:1080}});const tmp=path.join(__dirname,'.tmplogo.html');
for(const [k,v] of Object.entries(V))for(const c of [0,1]){fs.writeFileSync(tmp,html(v,c));await pg.goto('file://'+tmp);await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:path.join(out,`logo-${k}${c?'-podglad-kolko':''}.png`)});}
fs.unlinkSync(tmp);await b.close();})();
