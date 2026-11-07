// Płaska okładka i grzbiet książki w stylu serii (czerwień, Anton + mono, znak SST). node ksiazka-flat.js outDir
const fs=require('fs'),path=require('path');const out=process.argv[2];
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const SH='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'sst_shield.png')).toString('base64');
const ff=`@font-face{font-family:Pop;font-weight:800;font-style:italic;src:url(${F('poppins/files/poppins-latin-ext-800-italic.woff2')});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:800;font-style:italic;src:url(${F('poppins/files/poppins-latin-800-italic.woff2')})}
@font-face{font-family:Anton;src:url(${F('anton/files/anton-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F}@font-face{font-family:Anton;src:url(${F('anton/files/anton-latin-400-normal.woff2')})}
@font-face{font-family:Mono;src:url(file:///usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf)}`;
const front=`<!doctype html><html><head><meta charset="utf-8"><style>${ff}html,body{margin:0;width:1280px;height:2520px;background:#C3363C;color:#fff;overflow:hidden}
.fr{position:absolute;border:3px solid #ffffff30}
.c{position:absolute;left:0;right:0;text-align:center}</style></head><body>
<div class="fr" style="left:80px;top:150px;width:300px;height:300px;border-right:none;border-bottom:none"></div>
<div class="fr" style="right:80px;bottom:420px;width:300px;height:300px;border-left:none;border-top:none"></div>
<div class="c" style="top:200px;font-family:Mono;font-size:44px;letter-spacing:5px">Andrzej Staszczuk</div>
<div class="c" style="top:760px;font-family:Anton;font-size:170px;letter-spacing:10px">PSYCHOLOGIA</div>
<div class="c" style="top:1000px;font-family:Mono;font-size:76px;letter-spacing:16px">SPORTU</div>
<div class="c" style="top:1180px;font-family:Pop;font-weight:800;font-style:italic;font-size:46px;line-height:1.35">CZYLI JAK DZIAŁA GŁOWA ZAWODNIKA<br>I CO Z TYM ZROBIĆ</div>
<svg style="position:absolute;left:180px;top:1430px;width:920px" viewBox="0 0 400 80" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M0 50 H150 L165 50 L178 15 L192 72 L204 38 L214 50 H400"/></svg>
<div class="c" style="top:1900px;font-family:Mono;font-size:34px;letter-spacing:4px">KSIĄŻKA</div>
<div style="position:absolute;left:50%;top:2100px;transform:translateX(-50%);width:110px;height:260px;background:#fff;-webkit-mask:url(${SH}) center/contain no-repeat"></div>
</body></html>`;
const spine=`<!doctype html><html><head><meta charset="utf-8"><style>${ff}html,body{margin:0;width:300px;height:2760px;background:#B8303A;color:#fff;overflow:hidden}</style></head><body>
<div style="position:absolute;left:50%;top:150px;transform:translateX(-50%);writing-mode:vertical-rl;font-family:Anton;font-size:150px;letter-spacing:8px;white-space:nowrap">PSYCHOLOGIA SPORTU</div>
<div style="position:absolute;left:50%;top:1700px;transform:translateX(-50%);writing-mode:vertical-rl;font-family:Mono;font-size:44px;letter-spacing:6px;white-space:nowrap">Andrzej Staszczuk</div>
<div style="position:absolute;left:50%;bottom:110px;transform:translateX(-50%);width:110px;height:260px;background:#fff;-webkit-mask:url(${SH}) center/contain no-repeat"></div>
</body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const tmp=path.join(__dirname,'.kf.tmp.html');
for(const [h,w,ht,n] of [[front,1280,2520,'front.png'],[spine,300,2760,'spine.png']]){const p=await b.newPage({viewport:{width:w,height:ht}});fs.writeFileSync(tmp,h);await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(out,n)});await p.close();}
await b.close();fs.unlinkSync(tmp);console.log('ok');})();
