// Logo Mądry Sport spójne z logo Staszczuk Sport Team: tarcza z geometryczną literą M + wąski napis
// node logo-madry.js outDir
const fs=require('fs'),path=require('path');
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const V={ciemne:{bg:'#0D262C',ink:'#FFFFFF'},turkus:{bg:'#15625F',ink:'#FFFFFF'},jasne:{bg:'#E6F2F1',ink:'#0D262C'}};
// tarcza jak w SST (prostokąt z ostrym dołem), w środku M z pasów tej samej grubości
const shield=ink=>`<svg viewBox="0 0 340 760" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${ink}" stroke-linejoin="miter" stroke-miterlimit="10">
  <path d="M22 22 H318 V548 L170 728 L22 548 Z" stroke-width="44"/>
  <path d="M104 560 V44 L170 300 L236 44 V560" stroke-width="44" stroke-linecap="butt"/>
</svg>`;
const fonts=`@font-face{font-family:B;font-weight:700;src:url(${F('barlow-semi-condensed/files/barlow-semi-condensed-latin-ext-700-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:B;font-weight:700;src:url(${F('barlow-semi-condensed/files/barlow-semi-condensed-latin-700-normal.woff2')})}`;
const pageFull=v=>`<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
html,body{margin:0;width:1080px;height:1350px;background:${v.bg};font-family:B}
.c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.s{width:340px;height:760px}.t{margin-top:70px;color:${v.ink};font-weight:700;font-size:150px;line-height:.98;letter-spacing:3px;text-align:center}
</style></head><body><div class="c"><div class="s">${shield(v.ink)}</div><div class="t">MĄDRY<br>SPORT</div></div></body></html>`;
const pageAvatar=(v,circle)=>`<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
html,body{margin:0;width:1080px;height:1080px;background:${circle?'#fff':v.bg};font-family:B}
.c{position:absolute;inset:0;${circle?`border-radius:50%;background:${v.bg};`:''}display:flex;flex-direction:column;align-items:center;justify-content:center}
.s{width:236px;height:527px}.t{margin-top:34px;color:${v.ink};font-weight:700;font-size:112px;line-height:.98;letter-spacing:2px;text-align:center}
</style></head><body><div class="c"><div class="s">${shield(v.ink)}</div><div class="t">MĄDRY<br>SPORT</div></div></body></html>`;
(async()=>{const out=process.argv[2];fs.mkdirSync(out,{recursive:true});const {chromium}=require('playwright');
const g=fs.readdirSync('/opt/pw-browsers').filter(d=>d.startsWith('chromium_headless_shell')).sort().reverse();
const b=await chromium.launch({executablePath:`/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`,args:['--no-sandbox']});
const tmp=path.join(__dirname,'.tmplogo.html');
const shot=async(html,w,h,file)=>{const pg=await b.newPage({viewport:{width:w,height:h}});fs.writeFileSync(tmp,html);await pg.goto('file://'+tmp);await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:path.join(out,file)});await pg.close();};
for(const [k,v] of Object.entries(V)){
  await shot(pageFull(v),1080,1350,`logo-pelne-${k}.png`);
  await shot(pageAvatar(v,0),1080,1080,`logo-${k}.png`);
  await shot(pageAvatar(v,1),1080,1080,`logo-${k}-podglad-kolko.png`);
  fs.writeFileSync(path.join(out,`znak-${k}.svg`),shield(v.ink));}
fs.unlinkSync(tmp);await b.close();})();
