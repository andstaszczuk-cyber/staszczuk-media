// Rolka JTD 36 (ludzik): Progres czy przetrenowanie. 1080x1920, 30 fps, bez dźwięku (głos Andrzeja dogrywany osobno).
// Użycie: node rolka-przetrenowanie.js out.mp4 [klatki_testowe np. 60,300]
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const [,,out,test]=process.argv;
const F=p=>'file://'+path.join(__dirname,'node_modules/@fontsource',p);
const css=['600','800'].map(w=>`@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)});unicode-range:U+0100-024F}@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)})}`).join('');
const DUR=58;
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${css}html,body{margin:0;background:#000}</style></head><body><canvas id=c width=1080 height=1920></canvas><script>
const c=document.getElementById('c'),x=c.getContext('2d');const W=1080,H=1920,Y='#F4B63A',WH='#FFFFFF',GY=1360;
const cl=v=>Math.max(0,Math.min(1,v)),ease=t=>t*t*(3-2*t),lerp=(a,b,t)=>a+(b-a)*t;
// sceny: [start, koniec, tekst (*żółte*)]
const S=[[0,5,'Wydaje Ci się, że robisz *progres*?'],[5,10,'A tak naprawdę się *przetrenowujesz*.'],[10,15,'Trening + regeneracja = *forma*'],[15,20,'Bez regeneracji zostaje Ci samo *obciążenie*'],
[20,26,'Najpierw męczy się *układ nerwowy*. Ciało pokaże to dużo później.'],[26,31,'Złapiesz to wcześnie? *Tydzień, dwa* luzu i wracasz.'],[31,36,'Udajesz, że nic się nie dzieje? Przerwa na *tygodnie*, czasem miesiące.'],
[36,40,'Po czym poznasz, że jest *za dużo*?'],[40,46,'*Tętno spoczynkowe* rośnie z tygodnia na tydzień. Słabiej skaczesz i ściskasz dłoń.'],[46,53,'Gorzej śpisz, łapiesz infekcje, nie chce Ci się trenować. *Trzy takie sygnały? Zwolnij.*'],[53,58,'Skup się na *procesie*.']];
function rr(a,b,w,h,r){x.beginPath();x.roundRect(a,b,w,h,r)}
function line(pts,col,w){x.strokeStyle=col||WH;x.lineWidth=w||16;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))x.lineTo(p[0],p[1]);x.stroke()}
// ludzik: o = {x,y (stopy), hy (wysokość bioder), hands:[[x,y],[x,y]] względnie, feet, lean}
function man(o){const X=o.x,Yb=o.y,s=o.s||1,hipY=Yb-(o.hip||230)*s,neckY=hipY-(o.torso||190)*s,lean=(o.lean||0)*s;
 const hx=X+lean,nx=X+lean*1.4;const f=o.feet||[[-70,0],[70,0]];
 line([[X+f[0][0]*s,Yb+f[0][1]*s],[hx,hipY],[X+f[1][0]*s,Yb+f[1][1]*s]],WH,16);
 line([[hx,hipY],[nx,neckY]],WH,16);
 const hd=o.hands||[[-110,120],[110,120]];line([[nx+hd[0][0]*s,neckY+hd[0][1]*s],[nx,neckY+12*s],[nx+hd[1][0]*s,neckY+hd[1][1]*s]],WH,16);
 x.lineWidth=14;x.strokeStyle=WH;x.beginPath();x.arc(nx,neckY-62*s,52*s,0,7);x.stroke();
 return {neck:[nx,neckY],head:[nx,neckY-62*s],hands:hd.map(h=>[nx+h[0]*s,neckY+h[1]*s])}}
function bar(cx,cy,w,plate){line([[cx-w/2,cy],[cx+w/2,cy]],'#ddd',12);x.fillStyle=Y;for(const sg of[-1,1]){rr(cx+sg*w/2-(sg>0?plate*0.35:-plate*0.35)-plate*0.175,cy-plate/2,plate*0.35,plate,10);x.fill()}}
function bed(cx,cy,a){x.globalAlpha*=a;x.strokeStyle=Y;x.lineWidth=12;x.lineCap='round';rr(cx-150,cy-40,300,70,18);x.stroke();line([[cx-150,cy-90],[cx-150,cy+70]],Y,12);line([[cx+150,cy-20],[cx+150,cy+70]],Y,12);x.fillStyle=Y;rr(cx-130,cy-80,70,40,14);x.fill();x.globalAlpha=1}
function dumb(cx,cy){line([[cx-90,cy],[cx+90,cy]],'#ddd',14);x.fillStyle=Y;rr(cx-110,cy-45,34,90,10);x.fill();rr(cx+76,cy-45,34,90,10);x.fill()}
function arrow(x1,y1,x2,y2,col,w){line([[x1,y1],[x2,y2]],col,w);const a=Math.atan2(y2-y1,x2-x1);line([[x2-50*Math.cos(a-0.5),y2-50*Math.sin(a-0.5)],[x2,y2],[x2-50*Math.cos(a+0.5),y2-50*Math.sin(a+0.5)]],col,w)}
function txt(s,a,dy){x.globalAlpha=a;x.font='800 70px Pop';x.textAlign='left';x.textBaseline='alphabetic';
 const words=[];let yel=false;for(const part of s.split('*')){part.split(' ').forEach((w,j)=>{if(!w)return;if(j==0&&/^[?.,!:]/.test(w)&&words.length&&!part.startsWith(' ')){words[words.length-1].push([w,yel])}else words.push([w,yel])});yel=!yel}
 const wl=w=>x.measureText(w[0]).width+(w[2]?x.measureText(w[2][0]).width:0);const lines=[[]];let lw=0;const maxW=900,sp=x.measureText(' ').width;for(const w of words){const ww=wl(w);if(lw+ww>maxW&&lines[lines.length-1].length){lines.push([]);lw=0}lines[lines.length-1].push(w);lw+=ww+sp}
 const LH=86,y0=330+dy;lines.forEach((ln,i)=>{const tw=ln.reduce((s,w)=>s+wl(w),0)+sp*(ln.length-1);let xx=W/2-tw/2;for(const w of ln){x.fillStyle=w[1]?Y:WH;x.fillText(w[0],xx,y0+i*LH);let ex=x.measureText(w[0]).width;if(w[2]){x.fillStyle=w[2][1]?Y:WH;x.fillText(w[2][0],xx+ex,y0+i*LH);ex+=x.measureText(w[2][0]).width}xx+=ex+sp}});x.globalAlpha=1}
function draw(t){
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#C9222F');g.addColorStop(1,'#7E1222');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.strokeStyle=Y;x.lineWidth=8;rr(44,44,W-88,H-88,44);x.stroke();
 x.fillStyle=Y;rr(100,130,330,74,37);x.fill();x.fillStyle='#14161C';x.font='800 30px Pop';x.textAlign='center';x.textBaseline='middle';x.fillText('JAK TO DZIAŁA',265,168);
 x.font='700 30px Pop';x.fillStyle='rgba(255,255,255,.85)';x.fillText('@PSYCHOLOGSPORTU',W/2,H-120);x.textBaseline='alphabetic';
 line([[160,GY+20],[920,GY+20]],'rgba(255,255,255,.3)',10);
 let i=S.findIndex(s=>t<s[1]);if(i<0)i=S.length-1;const [a,b,s]=S[i],l=t-a,d=b-a,fa=cl(Math.min(l/0.35,(d-l)/0.35)),k=ease(cl(l/0.6));
 txt(s,i==S.length-1?Math.min(1,l/0.35):fa,(1-k)*30);
 x.globalAlpha=i==S.length-1?Math.min(1,l/0.35):fa;scene(i,l,d);x.globalAlpha=1}
function scene(i,l,d){const cx=W/2;
 if(i==0){const r=Math.abs(Math.sin(l*2.4));const up=lerp(0,1,r);const m=man({x:cx,y:GY,hands:[[-150,lerp(10,-170,up)],[150,lerp(10,-170,up)]]});bar(cx,m.hands[0][1],420,lerp(120,190,cl(l/d)));
  x.globalAlpha*=0.9;arrow(800,1060,930,880,Y,12)}
 if(i==1){const p=ease(cl(l/d));const sq=lerp(0,1,p);const m=man({x:cx,y:GY,hip:lerp(230,140,sq),torso:lerp(190,170,sq),feet:[[-110,0],[110,0]],hands:[[-150,lerp(-150,-60,sq)],[150,lerp(-150,-60,sq)]],lean:Math.sin(l*14)*6*sq});bar(cx,m.hands[0][1],460,lerp(190,300,p));
  x.fillStyle='#9FD3FF';for(let k=0;k<3;k++){const yy=(l*300+k*70)%160;x.beginPath();x.ellipse(m.head[0]+70+k*14,m.head[1]-20+yy,9,14,0,0,7);x.fill()}}
 if(i==2){const p=ease(cl(l/1.2)),q=ease(cl((l-1.4)/1.5));dumb(220,1150);x.fillStyle=WH;x.font='800 110px Pop';x.textAlign='center';x.fillText('+',390,1185);bed(590,1160,p);x.fillText('=',790,1185);x.globalAlpha*=q;arrow(850,1250,950,1250-300*q,Y,16)}
 if(i==3){const p=ease(cl(l/1.2));dumb(220,1150);x.fillStyle=WH;x.font='800 110px Pop';x.textAlign='center';x.fillText('+',390,1185);x.globalAlpha=1-p;bed(590,1160,1);x.globalAlpha=1;x.fillStyle=WH;x.fillText('=',790,1185);line([[850,1160],[970,1160]],'rgba(255,255,255,.8)',16)}
 if(i==4){const m=man({x:cx,y:GY,hands:[[-120,110],[120,110]]});const [hx,hy]=m.head;const fl=Math.sin(l*18)>0.2||l<1.5;x.fillStyle=fl?Y:'rgba(244,182,58,.25)';x.beginPath();x.moveTo(hx+8,hy-40);x.lineTo(hx-18,hy+6);x.lineTo(hx+2,hy+6);x.lineTo(hx-10,hy+42);x.lineTo(hx+22,hy-6);x.lineTo(hx+2,hy-6);x.closePath();x.fill();
  const bl=lerp(1,0.15,cl(l/(d-1)));x.strokeStyle=WH;x.lineWidth=8;rr(770,1000,150,80,12);x.stroke();x.fillStyle=WH;rr(920,1025,14,30,4);x.fill();x.fillStyle=bl>0.4?Y:'#ff6b6b';rr(780,1010,130*bl,60,8);x.fill();x.font='600 30px Pop';x.textAlign='center';x.fillStyle=WH;x.fillText('układ nerwowy',845,1130);
  x.fillStyle='rgba(255,255,255,.85)';rr(130,1010,150,80,12);x.fill();x.fillStyle='#7E1222';x.font='600 30px Pop';x.fillText('ciało OK',205,1062)}
 if(i==5){const p=ease(cl(l/1.5));bed(cx,GY-40,1);
  x.strokeStyle=WH;x.lineWidth=14;x.beginPath();x.arc(cx-100,GY-150,44,0,7);x.stroke();line([[cx-56,GY-140],[cx+130,GY-120]],WH,16);
  x.fillStyle=WH;x.font='800 50px Pop';x.textAlign='left';for(let k=0;k<3;k++){const zz=(l*0.8+k*0.33)%1;x.globalAlpha=Math.min(x.globalAlpha,1-zz);x.fillText('z',cx-60+zz*120+k*10,GY-240-zz*200)}x.globalAlpha=1;
  x.fillStyle=Y;rr(700,980,230,140,20);x.fill();x.fillStyle='#14161C';x.font='800 44px Pop';x.textAlign='center';x.fillText('7–14',815,1050);x.font='600 30px Pop';x.fillText('dni',815,1095)}
 if(i==6){const m=man({x:cx,y:GY,feet:[[-60,0],[40,-40]],hands:[[-150,250],[150,250]]});line([[m.hands[0][0],m.hands[0][1]-30],[m.hands[0][0]-10,GY]],Y,10);line([[m.hands[1][0],m.hands[1][1]-30],[m.hands[1][0]+10,GY]],Y,10);
  x.fillStyle=WH;rr(cx+20,GY-140,46,60,10);x.fill();
  const pg=Math.floor(l*2.2);x.fillStyle=WH;rr(720,960,220,200,18);x.fill();x.fillStyle='#C9222F';rr(720,960,220,50,18);x.fill();x.fillStyle='#14161C';x.font='800 60px Pop';x.textAlign='center';x.fillText(String(1+pg*7%28),830,1110);x.font='600 26px Pop';x.fillStyle=WH;x.fillText('przerwa',830,995)}
 if(i==7){const sc=1+Math.sin(l*4)*0.06;man({x:cx-180,y:GY,s:0.9,hands:[[-110,120],[60,-90]]});x.save();x.translate(cx+170,1100);x.scale(sc,sc);x.fillStyle=Y;x.font='800 380px Pop';x.textAlign='center';x.fillText('?',0,130);x.restore()}
 if(i==8){const bpm=Math.round(lerp(52,64,cl(l/(d-1.5))));const pu=1+0.08*Math.max(0,Math.sin(l*8));x.save();x.translate(290,1010);x.scale(pu,pu);x.fillStyle='#ff4d5e';x.beginPath();x.moveTo(0,40);x.bezierCurveTo(-120,-40,-60,-120,0,-60);x.bezierCurveTo(60,-120,120,-40,0,40);x.fill();x.restore();
  x.fillStyle=WH;x.font='800 64px Pop';x.textAlign='left';x.fillText(bpm+' bpm',190,1170);x.font='600 30px Pop';x.fillText('rano, tydzień po tygodniu',190,1220);
  const jh=Math.abs(Math.sin(l*3))*lerp(160,50,cl(l/d));const m=man({x:cx+260,y:GY-jh,s:0.7,feet:[[-60,0],[60,0]],hands:[[-120,-120],[120,-120]]});line([[cx+330,GY-150],[cx+410,GY-150]],Y,8);x.fillStyle=Y;x.font='600 28px Pop';x.fillText('rekord',cx+325,GY-170)}
 if(i==9){const items=['gorszy sen','infekcje','zmęczenie','brak chęci','słabsza koncentracja'];items.forEach((it,k)=>{const ap=cl((l-0.5-k*0.8)/0.4);if(ap<=0)return;const yy=980+k*72;x.globalAlpha*=ap;line([[180,yy+20],[180,yy-40]],WH,8);x.fillStyle='#ff4d5e';x.beginPath();x.moveTo(184,yy-40);x.lineTo(240,yy-26);x.lineTo(184,yy-12);x.fill();x.fillStyle=WH;x.font='600 40px Pop';x.textAlign='left';x.fillText(it,265,yy-12);x.globalAlpha=1});
  man({x:850,y:GY,s:0.7,hands:[[-100,140],[100,140]],lean:-12})}
 if(i==10){const run=l*6;man({x:cx-120,y:GY,s:0.8,lean:14,feet:[[Math.sin(run)*70,0],[-Math.sin(run)*70,0]],hands:[[Math.sin(run)*-90,90],[Math.sin(run)*90,90]]});bed(cx+260,GY-40,0.9);
  x.strokeStyle=WH;x.lineWidth=10;x.beginPath();x.arc(cx+260,1020,70,0,7);x.stroke();line([[cx+260,1020],[cx+260,975]],WH,10);line([[cx+260,1020],[cx+260+40*Math.cos(l),1020+40*Math.sin(l)]],Y,10)}
}
</script></body></html>`;
(async()=>{const {chromium}=require('playwright');let exe;for(const d of fs.readdirSync('/opt/pw-browsers').sort().reverse())for(const c of [`/opt/pw-browsers/${d}/chrome-linux64/chrome`,`/opt/pw-browsers/${d}/chrome-linux/headless_shell`])if(!exe&&fs.existsSync(c))exe=c;
const br=await chromium.launch({executablePath:exe,args:['--no-sandbox']});const p=await br.newPage({viewport:{width:1080,height:1920}});const tmp=path.join(__dirname,'.przetren.tmp.html');fs.writeFileSync(tmp,html);await p.goto('file://'+tmp);await p.evaluate(()=>Promise.all([document.fonts.load('800 40px Pop','abcŚśćąęłóżźń'),document.fonts.load('600 40px Pop','abcąę')]));await p.evaluate(()=>document.fonts.ready);
const el=await p.$('canvas');
if(test){for(const f of test.split(',')){await p.evaluate(t=>draw(t),+f/30);await el.screenshot({path:`${out}-${f}.jpg`,type:'jpeg',quality:80})}}
else{const N=DUR*30,tmpOut=out.replace(/\.mp4$/,'.part.mp4');const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',tmpOut],{stdio:['pipe','ignore','inherit']});
for(let f=0;f<N;f++){await p.evaluate(t=>draw(t),f/30);const buf=await el.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
ff.stdin.end();await new Promise((r,j)=>ff.on('close',c=>c?j(c):r()));fs.renameSync(tmpOut,out)}
await br.close();fs.unlinkSync(tmp);console.log('ok')})();
