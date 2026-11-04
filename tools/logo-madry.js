// Logo Mądry Sport do kółka FB/IG: napis MĄDRY SPORT (Mulish), zamiast kropki tarcza z S z logo Staszczuk Sport Team
// node logo-madry.js outDir   (znak: madry/logo/znak-sst.png, białe S na przezroczystym tle)
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const V={turkus:{bg:'#15625F',ink:'#FFFFFF',znak:'#FFFFFF'},ciemne:{bg:'#0D262C',ink:'#FFFFFF',znak:'#FFFFFF'},jasne:{bg:'#E6F2F1',ink:'#0D262C',znak:'#15625F'}};
const ZNAK='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'../madry/logo/znak-sst.png')).toString('base64');
const html=(v,circle)=>`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-ext-900-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-900-normal.woff2')})}
html,body{margin:0;width:1080px;height:1080px;background:${circle?'#fff':v.bg};font-family:M}
.c{position:absolute;inset:0;${circle?`border-radius:50%;background:${v.bg};`:''}display:flex;align-items:center;justify-content:center}
.w{font-weight:900;color:${v.ink};font-size:196px;line-height:1.06;letter-spacing:-4px;position:relative;left:-44px}
.z{display:inline-block;width:84px;height:198px;margin-left:36px;vertical-align:-12px;background:${v.znak};
  -webkit-mask:url(${ZNAK}) center/contain no-repeat;mask:url(${ZNAK}) center/contain no-repeat}
</style></head><body><div class="c"><div class="w">MĄDRY<br>SPORT<span class="z"></span></div></div></body></html>`;
(async()=>{const out=process.argv[2];const {chromium}=require('playwright');
const g=fs.readdirSync('/opt/pw-browsers').filter(d=>d.startsWith('chromium_headless_shell')).sort().reverse();
const b=await chromium.launch({executablePath:`/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`,args:['--no-sandbox']});
const pg=await b.newPage({viewport:{width:1080,height:1080}});const tmp=path.join(__dirname,'.tmplogo.html');
for(const [k,v] of Object.entries(V))for(const c of [0,1]){fs.writeFileSync(tmp,html(v,c));await pg.goto('file://'+tmp);await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:path.join(out,`logo-${k}${c?'-podglad-kolko':''}.png`)});}
fs.unlinkSync(tmp);await b.close();})();
