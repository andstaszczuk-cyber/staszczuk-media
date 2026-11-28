// Rolka JTD 36 (ludzik): Progres czy przetrenowanie. 1080x1920, 30 fps, bez dźwięku (głos Andrzeja dogrywany osobno).
// Użycie: node rolka-przetrenowanie.js out.mp4 [klatki_testowe|-] [sceny.json]
// Rysunki scen: ludzik-przetrenowanie-lib.js (ten sam kod działa w panelu rolki)
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const [,,out,test]=process.argv;
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['600','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const specPath=process.argv[4]||path.join(__dirname,'../psychologsportu/rolki/2027-02-28-progres-czy-przetrenowanie/sceny.json');
const spec=JSON.parse(fs.readFileSync(specPath,'utf8')).sceny.map(z=>[+z.czas,z.tekst,z.rys]);
const lib=fs.readFileSync(path.join(__dirname,'ludzik-przetrenowanie-lib.js'),'utf8');
const DUR=spec.reduce((s,z)=>s+z[0],0);
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${css}html,body{margin:0;background:#000}</style></head><body><canvas id=c width=1080 height=1920></canvas><script>${lib}\nsetSpec(${JSON.stringify(spec)});</script></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse())for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;
const br=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await br.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.przetren.tmp.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>Promise.all([document.fonts.load('800 40px Pop','abcŚśćąęłóżźń'),document.fonts.load('600 40px Pop','abcąę')]));await p.evaluate(()=>document.fonts.ready);
const el=await p.$('canvas');
if(test&&test!=="-"){for(const f of test.split(',')){await p.evaluate(t=>draw(t),+f/30);await el.screenshot({path:`${out}-${f}.jpg`,type:'jpeg',quality:80})}}
else{const N=DUR*30,tmpOut=out.replace(/\.mp4$/,'.part.mp4');const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',tmpOut],{stdio:['pipe','ignore','inherit']});
for(let f=0;f<N;f++){await p.evaluate(t=>draw(t),f/30);const buf=await el.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
ff.stdin.end();await new Promise((r,j)=>ff.on('close',c=>c?j(c):r()));fs.renameSync(tmpOut,out)}
await br.close();fs.unlinkSync(tmp);console.log('ok')})();
