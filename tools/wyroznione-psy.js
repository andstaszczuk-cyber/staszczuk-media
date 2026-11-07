// Okładki wyróżnionych relacji dla @psychologsportowy (grafit + żółty #FCE86A). node wyroznione-psy.js outDir
const fs=require('fs'),path=require('path');const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
const Y='#FCE86A',S=`fill="none" stroke="${Y}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
const I={
 zawodnicy:`<circle cx="60" cy="30" r="14" ${S}/><path d="M34 100 V72 a26 26 0 0 1 52 0 V100" ${S}/><path d="M60 58 l6 10 h-12 z" fill="${Y}"/>`,
 farmazoniarze:`<path d="M60 14 L108 100 H12 Z" ${S}/><path d="M60 48 V72" ${S}/><circle cx="60" cy="86" r="4.5" fill="${Y}"/>`,
 postawa:`<path d="M10 102 L46 46 L64 72 L80 52 L110 102 Z" ${S}/><path d="M46 46 V16 L70 24 L46 32" ${S}/>`,
 rekomendacje:`<path d="M60 12 L74 44 L108 47 L82 70 L90 104 L60 86 L30 104 L38 70 L12 47 L46 44 Z" ${S}/>`,
 media:`<rect x="14" y="26" width="92" height="62" rx="10" ${S}/><path d="M44 104 H76 M60 88 V104" ${S}/><path d="M50 44 L74 57 L50 70 Z" fill="${Y}"/>`,
 podcast:`<path d="M20 74 V60 a40 40 0 0 1 80 0 V74" ${S}/><rect x="14" y="70" width="20" height="32" rx="7" fill="${Y}"/><rect x="86" y="70" width="20" height="32" rx="7" fill="${Y}"/>`,
 qa:`<path d="M16 22 H104 V80 H56 L34 100 V80 H16 Z" ${S}/><path d="M48 42 a12 12 0 1 1 18 10 c-4 3 -6 5 -6 10" ${S}/><circle cx="60" cy="70" r="4" fill="${Y}"/>`,
 ksiazki:`<path d="M60 30 C46 20 26 20 12 24 V96 C26 92 46 92 60 102 C74 92 94 92 108 96 V24 C94 20 74 20 60 30 Z M60 30 V102" ${S}/>`,
 wspolpraca:`<path d="M10 58 L34 36 L54 44 L72 34 L110 58 L84 84 L60 98 L34 78 Z" ${S}/><path d="M54 44 L42 58 a7 7 0 0 0 10 8 L66 54" ${S}/>`
};
const html=k=>`<!doctype html><html><body style="margin:0;width:1080px;height:1920px;background:radial-gradient(70% 45% at 50% 50%,#4b4b4f 0%,#26262a 50%,#121214 100%)"><svg viewBox="0 0 120 120" style="position:absolute;left:340px;top:760px;width:400px;height:400px">${I[k]}</svg></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;try{for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()){for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;}}catch(e){}
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.wy.tmp.html');
for(const k of Object.keys(I)){fs.writeFileSync(tmp,html(k));await p.goto('file://'+tmp);await p.screenshot({path:path.join(out,k+'.png')});}
await b.close();fs.unlinkSync(tmp);console.log('ok');})();
