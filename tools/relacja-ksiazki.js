// Relacja IG 1080x1920: moje książki (okładki 3D z okladki-3d) i hasło. node relacja-ksiazki.js out.png
const fs=require('fs'),path=require('path');const out=process.argv[2];
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const img=n=>'data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'../okladki-3d',n)).toString('base64');
const ff=`@font-face{font-family:Pop;font-weight:${800};src:url(${F('poppins/files/poppins-latin-ext-800-normal.woff2')});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:800;src:url(${F('poppins/files/poppins-latin-800-normal.woff2')})}
@font-face{font-family:Pop;font-weight:500;src:url(${F('poppins/files/poppins-latin-ext-500-normal.woff2')});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:500;src:url(${F('poppins/files/poppins-latin-500-normal.woff2')})}`;
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${ff}
html,body{margin:0;width:1080px;height:1920px;font-family:Pop;color:#fff;overflow:hidden;background:radial-gradient(80% 45% at 50% 60%,#4A181B 0%,#18141A 55%,#0E1014 100%)}
.q{position:absolute;top:230px;left:80px;right:80px;text-align:center;font-size:104px;font-weight:800;line-height:1.04}.q span{color:#F4B63A}
.b{position:absolute;width:430px;filter:drop-shadow(24px 34px 40px #000d)}
.c{position:absolute;bottom:200px;left:0;right:0;text-align:center}
.c div{display:inline-block;background:#F4B63A;color:#11141A;font-weight:800;font-size:46px;padding:22px 52px;border-radius:60px}</style></head><body>
<div class="q">Rozwiąż swój problem <span>samodzielnie</span></div>
<img class="b" src="${img('Sen-w-sporcie-ksiazka-3d.png')}" style="left:40px;top:860px;transform:rotate(-7deg)">
<img class="b" src="${img('Trening-a-zawody-ksiazka-3d.png')}" style="left:610px;top:860px;transform:rotate(7deg)">
<img class="b" src="${img('Pewnosc-siebie-w-sporcie-ksiazka-3d.png')}" style="left:325px;top:780px;width:470px;z-index:2">
<div class="c"><div>Link w bio</div></div></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.rk.tmp.html');
fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:out});await b.close();fs.unlinkSync(tmp);console.log('ok');})();
