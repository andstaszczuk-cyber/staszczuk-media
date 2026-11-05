// Logo Sportowa Rodzina do kółka FB/IG: tarcza z S (Staszczuk Sport Team) po lewej, napis SPORTOWA RODZINA w kolorach marki
// node logo-madry.js outDir   (znak: madry/logo/znak-sst.png, białe S na przezroczystym tle)
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const V={bordo:{bg:'#7A2423',ink:'#FFFFFF',znak:'#FFFFFF',f:'M'}};
const ZNAK='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'../madry/logo/znak-sst.png')).toString('base64');
const html=(v,circle)=>`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-ext-900-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-900-normal.woff2')})}
@font-face{font-family:M;font-weight:800;src:url(${F('mulish/files/mulish-latin-800-normal.woff2')})}
html,body{margin:0;width:1080px;height:1080px;background:${circle?'#fff':v.bg};font-family:M}
@font-face{font-family:AD;src:url(${F('architects-daughter/files/architects-daughter-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:AD;src:url(${F('architects-daughter/files/architects-daughter-latin-400-normal.woff2')})}
.c{position:absolute;inset:0;${circle?`border-radius:50%;background:${v.bg};`:''}display:flex;align-items:center;justify-content:center;gap:40px}
.z{width:100px;height:236px;flex:none;background:${v.znak};-webkit-mask:url(${ZNAK}) center/contain no-repeat;mask:url(${ZNAK}) center/contain no-repeat}
.w{font-family:${v.f};font-weight:900;color:${v.ink};font-size:${v.f=='AD'?118:112}px;line-height:1.08;letter-spacing:${v.f=='AD'?0:-2}px;margin-top:6px}
.pl{font-weight:800;font-size:56px;letter-spacing:0;margin-left:6px}
</style></head><body><div class="c"><div class="z"></div><div class="w">SPORTOWA<br>RODZINA</div></div></body></html>`;
(async()=>{const out=process.argv[2];const {chromium}=require('playwright');
const g=fs.readdirSync('/opt/pw-browsers').filter(d=>d.startsWith('chromium_headless_shell')).sort().reverse();
const b=await chromium.launch({executablePath:`/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`,args:['--no-sandbox']});
const pg=await b.newPage({viewport:{width:1080,height:1080}});const tmp=path.join(__dirname,'.tmplogo.html');
for(const [k,v] of Object.entries(V))for(const c of [0,1]){fs.writeFileSync(tmp,html(v,c));await pg.goto('file://'+tmp);await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:path.join(out,`logo-${k}${c?'-podglad-kolko':''}.png`)});}
fs.unlinkSync(tmp);await b.close();})();
