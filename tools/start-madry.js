// Mądry Sport: karuzela startowa (IG/FB 1080x1350). node start-madry.js outDir
const fs=require('fs'),path=require('path');const out=process.argv[2];
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const Z='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'../madry/logo/znak-sst.png')).toString('base64');
const PK='#F6CFD2',MI='#BCD6D2',LINE='#4FBFB3';
const BG=['linear-gradient(160deg,#0D262C 0%,#124A4B 100%)','linear-gradient(160deg,#0D262C 0%,#15625F 100%)','linear-gradient(160deg,#124A4B 0%,#1E7A75 100%)'];
const hl=s=>s.replace(/\*(.+?)\*/g,`<span style="color:${PK}">$1</span>`);
const sh=(h,c='#fff')=>`<span style="display:inline-block;width:${h*.425}px;height:${h}px;background:${c};-webkit-mask:url(${Z}) center/contain no-repeat;flex:none"></span>`;
const I={brain:'<path d="M44 20 C26 20 18 34 22 46 C12 52 14 70 26 74 C24 90 40 100 54 94 L54 22 C52 21 48 20 44 20Z"/><path d="M76 20 C94 20 102 34 98 46 C108 52 106 70 94 74 C96 90 80 100 66 94 L66 22 C68 21 72 20 76 20Z"/>',
 run:'<circle cx="70" cy="18" r="10"/><path d="M60 36 L44 60 L60 72 L52 102"/><path d="M60 36 L80 54 L96 50"/><path d="M44 60 L26 62"/><path d="M60 72 L84 84 L92 104"/>',
 brief:'<rect x="14" y="36" width="92" height="64" rx="8"/><path d="M44 36 V26 Q44 18 52 18 H68 Q76 18 76 26 V36"/><line x1="14" y1="62" x2="106" y2="62"/>'};
const ic=(k,c=PK)=>`<svg viewBox="0 0 120 120" width="110" height="110" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${I[k]}</svg>`;
const frame=`<div style="position:absolute;inset:40px;border:6px solid ${LINE}"></div>`;
const foot=(i,n)=>`<div style="position:absolute;left:96px;right:96px;bottom:88px;display:flex;justify-content:space-between;font-weight:600;font-size:26px;color:${MI}"><span>@madrysport.pl · ${i}/${n}</span>${i<n?'<span>przesuń →</span>':''}</div>`;
const kick=t=>`<div style="font-weight:900;font-size:28px;letter-spacing:7px;color:${MI}">${t}</div>`;
const S=[
 [0,`<div style="position:absolute;left:96px;right:96px;top:150px">${kick('NOWY ROZDZIAŁ')}</div>
  <div style="position:absolute;left:96px;right:96px;top:330px;font-weight:900;font-size:128px;line-height:1;letter-spacing:-5px;color:#fff">Startujemy<span style="color:${PK}">.</span><div style="margin-top:30px;font-weight:600;font-size:46px;line-height:1.35;letter-spacing:0;color:${MI}">Nowy zespół dla zawodników<br>i wszystkich osób wokół nich.</div></div>
  <div style="position:absolute;left:96px;right:96px;top:800px;display:flex;align-items:center;gap:30px">${sh(150)}<div style="font-weight:900;font-size:92px;line-height:1;letter-spacing:-3px;color:#fff">MĄDRY<br>SPORT<span style="font-size:36px;color:${PK};letter-spacing:0">.pl</span></div></div>
  <div style="position:absolute;left:96px;right:96px;top:1030px;font-weight:600;font-size:40px;color:${MI}">zdrowie psychiczne i fizyczne w sporcie</div>`],
 [1,`<div style="position:absolute;left:96px;right:96px;top:150px">${kick('Z CZYM PRZYCHODZĄ ZAWODNICY')}</div>
  <div style="position:absolute;left:96px;right:96px;top:260px;display:flex;flex-direction:column;gap:26px">
   ${['Psycholog w jednym miejscu','Dietetyk w drugim','Fizjoterapeuta w trzecim'].map((t,i)=>`<div style="display:flex;align-items:center;gap:28px;background:rgba(255,255,255,.07);border-left:8px solid ${LINE};padding:30px 36px;font-weight:900;font-size:50px;color:#fff;opacity:${1-i*.15}"><span style="font-size:40px;color:${MI}">0${i+1}</span>${t}</div>`).join('')}</div>
  <div style="position:absolute;left:96px;right:96px;top:860px;font-weight:900;font-size:84px;line-height:1.08;letter-spacing:-2px;color:#fff">I nikt ze sobą<br><span style="color:${PK}">nie rozmawia.</span></div>`],
 [2,`<div style="position:absolute;left:96px;right:96px;top:150px">${kick('WSZYSTKO W JEDNYM MIEJSCU')}</div>
  <div style="position:absolute;left:96px;right:96px;top:250px;display:flex;flex-direction:column;gap:46px">
   ${[['brain','Głowa','psycholodzy sportowi i terapeuta'],['run','Ciało','dietetyk, trener motoryczny, fizjoterapeuta'],['brief','Kariera','prawo, finanse, decyzje poza boiskiem']].map(([k,h,s])=>`<div style="display:flex;align-items:center;gap:40px">${ic(k)}<div><div style="font-weight:900;font-size:88px;line-height:1;color:#fff;letter-spacing:-2px">${h}</div><div style="margin-top:12px;font-weight:600;font-size:38px;color:${MI}">${s}</div></div></div>`).join('')}</div>
  <div style="position:absolute;left:96px;right:96px;top:1010px;font-weight:600;font-size:40px;line-height:1.4;color:#fff">Jeden zespół, który rozmawia ze sobą o tobie.</div>`],
 [1,`<div style="position:absolute;left:96px;right:96px;top:150px">${kick('NASZA MISJA')}</div>
  <div style="position:absolute;left:96px;right:96px;top:330px;font-weight:900;font-size:120px;line-height:1.02;letter-spacing:-4px;color:#fff">Dobry wynik<br>nie powinien<br>kosztować<br><span style="color:${PK}">zdrowia.</span></div>
  <div style="position:absolute;left:96px;width:140px;top:1000px;height:10px;background:${LINE};border-radius:5px"></div>`],
 [0,`<div style="position:absolute;left:96px;right:96px;top:150px">${kick('W CO WIERZYMY')}</div>
  <div style="position:absolute;left:96px;right:96px;top:250px;display:flex;flex-direction:column;gap:60px">
   ${[['Najpierw człowiek,','potem sportowiec.'],['Od amatorów','po olimpijczyków.'],['Konkret','zamiast obietnic.'],['Głowa i ciało','to jedna całość.']].map(([a,b])=>`<div style="font-weight:900;font-size:72px;line-height:1.05;letter-spacing:-2px;color:#fff">${a}<br><span style="color:${PK}">${b}</span></div>`).join('')}</div>`],
 [2,`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 110px">${sh(220)}
  <div style="margin-top:60px;font-weight:900;font-size:104px;line-height:1.04;letter-spacing:-3px;color:#fff">Pierwsza rozmowa<br><span style="color:${PK}">bezpłatnie</span></div>
  <div style="margin-top:50px;font-weight:600;font-size:40px;line-height:1.4;color:${MI}">Opowiadasz, z czym przychodzisz.<br>Dobieramy osobę z zespołu.</div>
  <div style="margin-top:60px;background:${PK};color:#0D262C;border-radius:999px;font-weight:900;font-size:44px;padding:26px 56px">madrysport.pl</div></div>`],
];
const doc=(bg,inner)=>`<!doctype html><meta charset=utf-8><style>
@font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-ext-600-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-600-normal.woff2')})}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-ext-900-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:M;font-weight:900;src:url(${F('mulish/files/mulish-latin-900-normal.woff2')})}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden;position:relative;font-family:M;background:${bg}}</style>${inner}${frame}`;
(async()=>{fs.mkdirSync(out,{recursive:true});const {chromium}=require('playwright');const g=fs.readdirSync('/opt/pw-browsers').filter(d=>d.startsWith('chromium_headless_shell')).sort().reverse();
const b=await chromium.launch({executablePath:`/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1350}});const tmp=path.join(__dirname,'.tmps.html');
for(const [i,[bg,s]] of S.entries()){fs.writeFileSync(tmp,doc(BG[bg],s+foot(i+1,S.length)));await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(out,`${i+1}.png`)});}
fs.unlinkSync(tmp);await b.close();})();
