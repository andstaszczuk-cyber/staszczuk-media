const fs=require('fs'),path=require('path');const T=process.argv[2],out=process.argv[3];
const F=p=>'file://'+path.join(T,'node_modules/@fontsource',p);
const Z='data:image/png;base64,'+fs.readFileSync(path.join(T,'../madry/logo/znak-sst.png')).toString('base64');
const DG='#0D262C',TQ='#15625F',LT='#E6F2F1',PK='#F6CFD2',MI='#BCD6D2',T2='#1E7A75';
const shield=(c,h,o=1)=>`<span style="display:inline-block;flex:none;width:${h*0.425}px;height:${h}px;opacity:${o};background:${c};-webkit-mask:url(${Z}) center/contain no-repeat"></span>`;
const L=[['GŁOWA','psycholog sportowy, terapeuta'],['CIAŁO','dietetyk, trener, fizjoterapeuta'],['KARIERA','prawo, finanse, decyzje']];
// v: {name, layer(html in 3240x1350 space), tiles:[{bg,ink,acc,sub}], over:[css per tile overlay]}
const BGS=["linear-gradient(90deg,#0D262C,#124A4B)","linear-gradient(90deg,#124A4B,#17605D)","linear-gradient(90deg,#17605D,#1E7A75)"];const LN="6px solid #4FBFB3";
const row=(v)=>{const tiles=[0,1,2].map(i=>{const t=v.tiles[i];const fr=`<div style="position:absolute;top:40px;bottom:40px;left:${i==0?40:0}px;right:${i==2?40:0}px;border-top:${LN};border-bottom:${LN};${i==0?"border-left:"+LN+";":""}${i==2?"border-right:"+LN+";":""}"></div>`;return `<div class="t" style="background:${BGS[i]}">${fr}
 <div style="position:absolute;left:${-i*1080+(v.sh||[0,0,0])[i]}px;top:0;width:3240px;height:1350px">${v.layer}</div>
 <div class="b"><div class="k" style="color:${t.acc}">0${i+1}</div><div class="h" style="color:${t.ink}">${L[i][0]}</div><div class="s" style="color:${t.sub}">${L[i][1]}</div></div>
 <div class="f" style="color:${t.sub}">@madrysport.pl · 1/5</div><div class="f" style="left:auto;right:96px;color:${t.sub}">przesuń →</div></div>`}).join('');return `<div class="lab"><b>${v.n}</b> ${v.name}</div><div class="row">${tiles}</div>`};
const word=(c,fs,dot)=>`<div class="w" style="color:${c};font-size:${fs}px">MĄDRY<br>SPORT<span style="font-size:${fs*.36}px;color:${dot||c}">.pl</span></div>`;
const G=``;
const tl=[{bg:'transparent',ink:'#fff',acc:PK,sub:MI},{bg:'transparent',ink:'#fff',acc:PK,sub:MI},{bg:'transparent',ink:'#fff',acc:PK,sub:LT}];
const V=[{n:'1',sh:[0,-35,-47],name:'Ciasne litery, przerwy między Ą i D oraz P i O',tiles:tl,layer:G+`<div style="position:absolute;left:343px;top:330px;display:inline-flex;align-items:center;gap:56px">${shield('#fff',400)}<div class="w" style="color:#fff;font-size:300px;letter-spacing:-8px">M<span style="letter-spacing:55px">Ą</span><span style="letter-spacing:-19px">DRY</span><span style="letter-spacing:16px"> </span><span style="letter-spacing:-19px">S</span><span style="letter-spacing:22px">P</span>ORT<span style="font-size:110px;color:${PK};letter-spacing:0">.pl</span></div></div>`}];
const html=`<!doctype html><meta charset=utf-8><style>
@font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-ext-600-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-600-normal.woff2')})}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-ext-900-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-900-normal.woff2')})}
body{margin:0;background:#fff;font-family:M;width:1140px;padding:30px}
.lab{font-size:28px;color:#222;margin:30px 0 12px}.lab b{display:inline-block;background:${TQ};color:#fff;border-radius:50%;width:44px;height:44px;text-align:center;line-height:44px;margin-right:10px}
.row{display:flex;gap:6px}.t{width:1080px;height:1350px;position:relative;overflow:hidden;flex:none}
.w{font-weight:900;line-height:1.02;white-space:nowrap}
.b{position:absolute;left:90px;right:80px;bottom:160px}.k{font-weight:900;font-size:110px;line-height:1}.h{font-weight:900;font-size:120px;line-height:1.05;letter-spacing:-2px}.s{font-weight:600;font-size:42px;line-height:1.35;margin-top:16px}
.f{position:absolute;left:90px;bottom:88px;font-weight:600;font-size:26px}
</style>${V.map(row).join('')}`;
fs.writeFileSync(path.join(T,'.pano.html'),html);
(async()=>{const {chromium}=require('playwright');const g=fs.readdirSync('/opt/pw-browsers').filter(d=>d.startsWith('chromium_headless_shell')).sort().reverse();
const b=await chromium.launch({executablePath:`/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1200,height:800},deviceScaleFactor:1});
await p.goto('file://'+path.join(T,'.pano.html'));await p.evaluate(()=>document.fonts.ready);const els=await p.$$('.t');for(const [i,e] of els.entries()) await e.screenshot({path:out+'-'+(i+1)+'.png'});await b.close();fs.unlinkSync(path.join(T,'.pano.html'));})();
