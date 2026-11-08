// Rolka 1080x1920: drzewo w zmiennej pogodzie, korzenie ze słowami, na koniec słońce i tekst.
// Użycie: node rolka-drzewo.js out.mp4 [klatki_testowe np. 100,400]
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const [,,out,test]=process.argv;
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['600','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${css}html,body{margin:0;background:#000}</style></head><body><canvas id=c width=1080 height=1920></canvas><script>
const c=document.getElementById('c'),x=c.getContext('2d');const W=1080,H=1920,G=1060,BX=540;
let seed=1;const R=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const lerp=(a,b,t)=>a+(b-a)*t,cl=v=>Math.max(0,Math.min(1,v)),ease=t=>t*t*(3-2*t);
const hx=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));const mix=(a,b,t)=>{a=hx(a);b=hx(b);return 'rgb('+a.map((v,i)=>Math.round(lerp(v,b[i],t))).join(',')+')'};
// fazy: [start,end,nazwa,niebo góra,niebo dół,wiatr]
const P=[[0,3,'','#7FB6D9','#CFE6F2',0.15],[3,6.5,'DESZCZ','#4E5D6C','#8A99A6',0.35],[6.5,10,'ŚNIEG','#8C99A8','#D5DCE3',0.25],[10,13.5,'WICHURA','#5C6B78','#A2ADB5',1],[13.5,17,'BURZA','#1E242E','#3A4452',0.8],[17,20.5,'TRĄBA POWIETRZNA','#3B4048','#7B7F86',1.4],[20.5,24,'GRAD','#46505C','#8C96A0',0.6],[24,27.5,'UPAŁ I SUSZA','#E8862E','#F6C25A',0.1],[27.5,34,'','#6FB8E6','#FFE8A3',0.08]];
function phase(t){for(let i=0;i<P.length;i++)if(t<P[i][1])return i;return P.length-1}
function blend(t){const i=phase(t),p=P[i],tr=0.8;let k=0,j=i;if(i>0&&t<p[0]+tr){j=i-1;k=1-(t-p[0])/tr}const q=P[j];k=ease(k);
 return {i,top:mix(p[3],q[3],k),bot:mix(p[4],q[4],k),wind:lerp(p[5],q[5],k),loc:t-p[0],dur:p[1]-p[0],name:p[2],k}}
const ROOTS=[ // [rodzic, x, y, słowo]
 [-1,230,1225,'Przyjaciele'],[-1,540,1255,'Wartości'],[-1,850,1225,'Rodzina'],
 [0,165,1445,'Wiedza'],[1,540,1475,'Świadomość'],[2,870,1445,'Kompetencje'],
 [3,235,1685,'Dobry zespół'],[4,540,1720,'Nawyki'],[5,850,1685,'Pieniądze']];
const rain=[],snow=[],hail=[],leaves=[];for(let i=0;i<260;i++)rain.push([R()*W*1.4-200,R()*G,0.7+R()*0.6]);for(let i=0;i<200;i++)snow.push([R()*W,R()*G,R()*6.28,3+R()*5]);for(let i=0;i<120;i++)hail.push([R()*W,R()*G,4+R()*5]);for(let i=0;i<40;i++)leaves.push([R()*W,R()*G,R()*6.28]);
const blobs=[];for(let i=0;i<46;i++){const a=R()*6.28,r=R();blobs.push([Math.cos(a)*r*230,-Math.sin(a)*r*150-20,70+R()*50,R()])}
function draw(t){seed=7;const b=blend(t);
 // niebo
 let g=x.createLinearGradient(0,0,0,G);g.addColorStop(0,b.top);g.addColorStop(1,b.bot);x.fillStyle=g;x.fillRect(0,0,W,G);
 // słońce w upale i na końcu
 const heat=b.i==7?cl(b.loc/0.8):(b.i==8?1-cl(b.loc/0.8):0), fin=b.i==8?ease(cl((t-27.5)/1.5)):0;
 if(heat>0){x.fillStyle='rgba(255,230,120,'+heat+')';x.beginPath();x.arc(820,330,150,0,7);x.fill();x.fillStyle='rgba(255,200,80,'+heat*0.3+')';x.beginPath();x.arc(820,330,230,0,7);x.fill()}
 if(fin>0){const sy=lerp(900,560,fin);x.fillStyle='rgba(255,214,90,'+fin*0.35+')';x.beginPath();x.arc(820,sy,240,0,7);x.fill();x.fillStyle='rgba(255,214,90,'+fin+')';x.beginPath();x.arc(820,sy,140,0,7);x.fill();
  x.strokeStyle='rgba(255,214,90,'+fin*0.8+')';x.lineWidth=10;x.lineCap='round';for(let a=0;a<12;a++){const an=a/12*6.28+t*0.3;x.beginPath();x.moveTo(820+Math.cos(an)*175,sy+Math.sin(an)*175);x.lineTo(820+Math.cos(an)*225,sy+Math.sin(an)*225);x.stroke()}}
 // chmury
 const cloud=[0,1,1,1,1.3,1.2,1,0,0][b.i]*(b.k>0?1:1);if(b.i>0&&b.i<7){x.fillStyle=b.i==4?'rgba(20,24,30,.85)':'rgba(70,78,88,.55)';for(let i=0;i<7;i++){const cx=((i*190+t*40*b.wind)%1400)-160;x.beginPath();x.ellipse(cx,120+(i%3)*60,170,70,0,0,7);x.fill()}}
 // błyskawica
 if(b.i==4){const fl=[0.6,0.75,2.1,2.3].some(s=>Math.abs(b.loc-s)<0.06);if(fl){x.fillStyle='rgba(255,255,255,.55)';x.fillRect(0,0,W,G);x.strokeStyle='#FFF6B0';x.lineWidth=9;x.beginPath();let lx=b.loc<1.5?260:820,ly=80;x.moveTo(lx,ly);while(ly<G-150){lx+=(R()-0.5)*120;ly+=70+R()*60;x.lineTo(lx,ly)}x.stroke()}}
 // wiatr kołysze drzewem
 const torn=b.i==5?b.loc/b.dur:-1, tx=torn>=0?lerp(1350,-300,torn):9999, near=torn>=0?Math.max(0,1-Math.abs(tx-BX)/500):0;
 const sway=(Math.sin(t*2.3)*0.6+Math.sin(t*5.1)*0.4)*0.07*b.wind+near*0.22*Math.sin(t*9)+(b.i==3?0.08:0);
 // ziemia
 g=x.createLinearGradient(0,G,0,H);g.addColorStop(0,'#4A3426');g.addColorStop(1,'#241811');x.fillStyle=g;x.fillRect(0,G,W,H-G);
 x.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<90;i++){x.beginPath();x.arc(R()*W,G+40+R()*(H-G),2+R()*5,0,7);x.fill()}
 const dry=b.i==7?cl(b.loc/1):(b.i==8?1-cl(b.loc/1.5):0);x.fillStyle=mix('#5E9E3A','#B8A04A',dry);x.fillRect(0,G-14,W,30);
 // śnieg na ziemi
 const sn=b.i==2?cl(b.loc/2):(b.i==3?1-cl(b.loc/1.2):0);if(sn>0){x.fillStyle='rgba(255,255,255,'+sn+')';x.fillRect(0,G-24,W,22+sn*8)}
 // korzenie
 const grow=cl(t/3);x.lineCap='round';
 function base(i){return ROOTS[i][0]<0?[BX,G+10]:ROOTS[ROOTS[i][0]].slice(1,3)}
 ROOTS.forEach((r,i)=>{const lvl=i<3?0:i<6?1:2,p=ease(cl(grow*3.2-lvl*0.9-(i%3)*0.15));if(p<=0)return;const [sx,sy]=base(i),ex=r[1],ey=r[2],mx=(sx+ex)/2+(ex-sx)*0.15,my=sy+(ey-sy)*0.25;
  x.strokeStyle='#C9A27A';x.lineWidth=[26,18,12][lvl];x.beginPath();x.moveTo(sx,sy);for(let s=1;s<=30*p;s++){const u=s/30;x.lineTo((1-u)*(1-u)*sx+2*u*(1-u)*mx+u*u*ex,(1-u)*(1-u)*sy+2*u*(1-u)*my+u*u*ey)}x.stroke();
  x.lineWidth=4;for(let k=0;k<4;k++){const u=0.3+k*0.18;if(u>p)break;const px=(1-u)*(1-u)*sx+2*u*(1-u)*mx+u*u*ex,py=(1-u)*(1-u)*sy+2*u*(1-u)*my+u*u*ey,d=k%2?1:-1;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+d*30,py+10,px+d*50,py+40);x.stroke()}});
 x.font='800 38px Pop';x.textAlign='center';x.textBaseline='middle';
 ROOTS.forEach((r,i)=>{const lvl=i<3?0:i<6?1:2,p=cl((grow*3.2-lvl*0.9-(i%3)*0.15-0.7)*3);if(p<=0)return;const w=x.measureText(r[3]).width+50;x.globalAlpha=p;x.fillStyle='#F4B63A';rr(r[1]-w/2,r[2]-34,w,68,34);x.fill();x.fillStyle='#11141A';x.fillText(r[3],r[1],r[2]+2);x.globalAlpha=1});
 // pień i korona
 x.save();x.translate(BX,G);const top=[Math.sin(sway)*400,-Math.cos(sway)*400];
 x.fillStyle='#6B4A33';x.beginPath();x.moveTo(-48,10);x.quadraticCurveTo(-30,-200,top[0]-22,top[1]);x.lineTo(top[0]+22,top[1]);x.quadraticCurveTo(30,-200,48,10);x.fill();
 x.strokeStyle='#6B4A33';x.lineWidth=18;x.lineCap='round';[[-1,0.55],[1,0.7]].forEach(([d,u])=>{const bx=top[0]*u*u,by=top[1]*u;x.beginPath();x.moveTo(bx,by);x.lineTo(bx+d*120+top[0]*0.3,by-110);x.stroke()});
 x.translate(top[0],top[1]);x.rotate(sway*0.6);
 const lc=mix('#3F8A3A','#8C8A3A',dry),lc2=mix('#5BAA45','#A9A54C',dry);
 blobs.forEach(o=>{x.fillStyle=o[3]>0.5?lc:lc2;x.beginPath();x.arc(o[0]+Math.sin(t*4+o[3]*9)*b.wind*6,o[1],o[2],0,7);x.fill()});
 if(sn>0){x.fillStyle='rgba(255,255,255,'+sn*0.9+')';blobs.forEach(o=>{if(o[1]<-60){x.beginPath();x.ellipse(o[0],o[1]-o[2]*0.6,o[2]*0.7,o[2]*0.3,0,0,7);x.fill()}})}
 x.restore();
 // opady
 if(b.i==1||b.i==4){x.strokeStyle='rgba(200,225,255,.7)';x.lineWidth=3;rain.forEach(d=>{const y=(d[1]+t*1600*d[2])%G,xx=d[0]+y*0.25*b.wind;x.beginPath();x.moveTo(xx,y);x.lineTo(xx+8*b.wind,y+38);x.stroke()})}
 if(b.i==2){x.fillStyle='#fff';snow.forEach(d=>{const y=(d[1]+t*140)%G,xx=(d[0]+Math.sin(t+d[2])*30+t*30)%W;x.beginPath();x.arc(xx,y,d[3],0,7);x.fill()})}
 if(b.i==6){x.fillStyle='#EEF4F8';hail.forEach(d=>{const y=(d[1]+t*1300)%G;x.beginPath();x.arc(d[0],y,d[2],0,7);x.fill()})}
 if(b.i==3||b.i==5){x.fillStyle=lc2;leaves.forEach(d=>{const xx=(d[0]+t*900)%(W+100)-50,y=(d[1]+Math.sin(t*3+d[2])*80)%G;x.save();x.translate(xx,y);x.rotate(t*6+d[2]);x.beginPath();x.ellipse(0,0,14,7,0,0,7);x.fill();x.restore()});
  x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=5;for(let i=0;i<8;i++){const yy=180+i*105,xx=((i*317+t*1400)%1600)-300;x.beginPath();x.moveTo(xx,yy);x.quadraticCurveTo(xx+120,yy-25,xx+260,yy);x.stroke()}}
 if(torn>=0){for(let k=0;k<26;k++){const u=k/26,yy=lerp(150,G-10,u),w=lerp(260,40,u),wob=Math.sin(t*6+u*8)*40*u;x.fillStyle='rgba(60,62,68,'+(0.55-u*0.2)+')';x.beginPath();x.ellipse(tx+wob,yy,w,34,0,0,7);x.fill()}
  x.fillStyle='rgba(120,100,80,.5)';x.beginPath();x.ellipse(tx,G,160,40,0,0,7);x.fill()}
 if(heat>0){x.strokeStyle='rgba(255,255,255,'+0.25*heat+')';x.lineWidth=4;for(let i=0;i<6;i++){const yy=G-60-i*90;x.beginPath();for(let xx=0;xx<=W;xx+=20)x.lineTo(xx,yy+Math.sin(xx/60+t*5+i)*8);x.stroke()}}
 // nazwa warunków
 if(b.name){const a=cl(Math.min(b.loc/0.4,(b.dur-b.loc)/0.4));x.globalAlpha=a;x.font='800 44px Pop';const w=x.measureText(b.name).width+70;x.fillStyle='rgba(17,20,26,.75)';rr(W/2-w/2,190,w,84,42);x.fill();x.fillStyle='#fff';x.fillText(b.name,W/2,234);x.globalAlpha=1}
 // tekst końcowy
 const ta=cl((t-29)/0.8);if(ta>0){x.globalAlpha=ta;x.fillStyle='rgba(17,20,26,.82)';rr(70,140,940,330,40);x.fill();x.font='800 62px Pop';x.fillStyle='#fff';x.fillText('Możesz przetrwać',W/2,225);x.fillText('każde warunki,',W/2,300);x.fillText('jeżeli masz',W/2,375);x.fillStyle='#F4B63A';x.fillText('mocne korzenie.',W/2,375+75);x.globalAlpha=1}
}
function rr(a,b,w,h,r){x.beginPath();x.roundRect(a,b,w,h,r)}
</script></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse())for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;
const br=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await br.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.drzewo.tmp.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>Promise.all([document.fonts.load('800 40px Pop','abcŚśćąęłóżźń'),document.fonts.load('800 40px Pop','abc')]));await p.evaluate(()=>document.fonts.ready);
const el=await p.$('canvas');
if(test){for(const f of test.split(',')){await p.evaluate(t=>draw(t),+f/30);await el.screenshot({path:`${out}-${f}.jpg`,type:'jpeg',quality:85})}}
else{const N=34*30,tmpOut=out.replace(/\.mp4$/,'.part.mp4');const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',tmpOut],{stdio:['pipe','ignore','inherit']});
for(let f=0;f<N;f++){await p.evaluate(t=>draw(t),f/30);const buf=await el.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
ff.stdin.end();await new Promise((r,j)=>ff.on('close',c=>c?j(c):r()));fs.renameSync(tmpOut,out)}
await br.close();fs.unlinkSync(tmp);console.log('ok')})();
