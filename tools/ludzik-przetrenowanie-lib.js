
const c=document.getElementById('c'),x=c.getContext('2d');const W=1080,H=1920,Y='#F4B63A',WH='#FFFFFF',GY=1360;
const cl=v=>Math.max(0,Math.min(1,v)),ease=t=>t*t*(3-2*t),lerp=(a,b,t)=>a+(b-a)*t;
// sceny: [start, koniec, tekst (*żółte*), rysunek]
let S0=[];
let S=[];function setSpec(a){S0=a;let acc=0;S=a.map(z=>{const r=[acc,acc+(+z[0]||1),z[1],z[2]];acc+=(+z[0]||1);return r});return acc}
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
 let i=S.findIndex(s=>t<s[1]);if(i<0)i=S.length-1;const [a,b,s,key]=S[i],l=t-a,d=b-a,fa=cl(Math.min(l/0.35,(d-l)/0.35)),k=ease(cl(l/0.6));
 txt(s,i==S.length-1?Math.min(1,l/0.35):fa,(1-k)*30);
 x.globalAlpha=i==S.length-1?Math.min(1,l/0.35):fa;scene(key,l,d);x.globalAlpha=1}
function bubble(hx,hy,txtS,a){x.globalAlpha*=a;x.fillStyle=WH;[[hx+60,hy-70,12],[hx+95,hy-115,18]].forEach(c=>{x.beginPath();x.arc(c[0],c[1],c[2],0,7);x.fill()});rr(hx+20,hy-330,640,200,60);x.fill();x.fillStyle='#C9222F';x.font='800 54px Pop';x.textAlign='center';x.fillText(txtS,hx+340,hy-212);x.globalAlpha=1}
function flags(list,l,y0){list.forEach((it,k)=>{const ap=cl((l-0.4-k*0.9)/0.4);if(ap<=0)return;const yy=y0+k*90;const sv=x.globalAlpha;x.globalAlpha*=ap;line([[170,yy+24],[170,yy-46]],WH,8);x.fillStyle='#ff4d5e';x.beginPath();x.moveTo(174,yy-46);x.lineTo(236,yy-30);x.lineTo(174,yy-14);x.fill();x.fillStyle=WH;x.font='600 46px Pop';x.textAlign='left';x.fillText(it,262,yy-12);x.globalAlpha=sv})}
function meter(x0,y0,label,v,col){x.fillStyle=WH;x.font='600 34px Pop';x.textAlign='left';x.fillText(label,x0,y0-16);x.strokeStyle=WH;x.lineWidth=6;rr(x0,y0,420,46,23);x.stroke();x.fillStyle=col;rr(x0+6,y0+6,Math.max(34,408*v),34,17);x.fill()}
function scene(k,l,d){const cx=W/2;
 if(k=='npng'){const m=man({x:cx-180,y:GY,hip:170,torso:170,lean:-20,feet:[[-90,0],[90,0]],hands:[[-90,230],[90,230]]});bar(cx-180,GY-30,380,110);
  const sw=Math.sin(l*3)*6;x.fillStyle='#9FD3FF';for(let q=0;q<2;q++){x.beginPath();x.ellipse(m.head[0]-70-q*16,m.head[1]+(l*120+q*60)%120,8,13,0,0,7);x.fill()}
  x.fillStyle=WH;x.font='600 36px Pop';x.textAlign='center';x.globalAlpha*=cl(l/0.8);x.fillText('mam dość…',m.head[0]-10,GY+80);x.globalAlpha=1;bubble(m.head[0]-40+sw,m.head[1]+40,'NO PAIN, NO GAIN',cl((l-1.2)/0.5))}
 if(k=='lift'){const r=Math.abs(Math.sin(l*2.4));const m=man({x:cx,y:GY,hands:[[-150,lerp(10,-170,r)],[150,lerp(10,-170,r)]]});bar(cx,m.hands[0][1],420,lerp(120,190,cl(l/d)));arrow(800,1060,930,880,Y,12)}
 if(k=='reps'){const r=Math.abs(Math.sin(l*3));const n=11+Math.floor(l*3/Math.PI);const m=man({x:300,y:GY,s:0.8,hip:lerp(200,170,cl(l/d)),hands:[[-130,lerp(10,-160,r)],[130,lerp(10,-160,r)]],lean:-10*cl(l/d)});bar(300,m.hands[0][1],340,150);
  x.fillStyle=Y;x.font='800 120px Pop';x.textAlign='center';x.fillText(String(n),300,860);x.font='600 30px Pop';x.fillStyle=WH;x.fillText('powtórzenie',300,900);
  meter(560,1000,'zmęczenie',cl(0.25+l/d*0.75),'#ff4d5e');meter(560,1160,'forma',0.3,Y)}
 if(k=='crush'){const p=ease(cl(l/d));const m=man({x:cx,y:GY,hip:lerp(230,140,p),torso:lerp(190,170,p),feet:[[-110,0],[110,0]],hands:[[-150,lerp(-150,-60,p)],[150,lerp(-150,-60,p)]],lean:Math.sin(l*14)*6*p});bar(cx,m.hands[0][1],460,lerp(190,300,p))}
 if(k=='eq'){const p=ease(cl(l/1.2)),q=ease(cl((l-1.4)/1.5));dumb(220,1150);x.fillStyle=WH;x.font='800 110px Pop';x.textAlign='center';x.fillText('+',390,1185);bed(590,1160,p);x.fillText('=',790,1185);x.globalAlpha*=q;arrow(850,1250,950,1250-300*q,Y,16)}
 if(k=='eq0'){const p=ease(cl(l/1.2));dumb(220,1150);x.fillStyle=WH;x.font='800 110px Pop';x.textAlign='center';x.fillText('+',390,1185);const sv=x.globalAlpha;x.globalAlpha=sv*(1-p);bed(590,1160,1);x.globalAlpha=sv;x.fillStyle=WH;x.fillText('=',790,1185);line([[850,1160],[970,1160]],'rgba(255,255,255,.8)',16)}
 if(k=='nerv'){const m=man({x:cx,y:GY,hands:[[-120,110],[120,110]]});const [hx,hy]=m.head;const fl=Math.sin(l*18)>0.2||l<1.5;x.fillStyle=fl?Y:'rgba(244,182,58,.25)';x.beginPath();x.moveTo(hx+8,hy-40);x.lineTo(hx-18,hy+6);x.lineTo(hx+2,hy+6);x.lineTo(hx-10,hy+42);x.lineTo(hx+22,hy-6);x.lineTo(hx+2,hy-6);x.closePath();x.fill();
  const bl=lerp(1,0.15,cl(l/(d-1)));x.strokeStyle=WH;x.lineWidth=8;rr(770,1000,150,80,12);x.stroke();x.fillStyle=WH;rr(920,1025,14,30,4);x.fill();x.fillStyle=bl>0.4?Y:'#ff6b6b';rr(780,1010,130*bl,60,8);x.fill();x.font='600 30px Pop';x.textAlign='center';x.fillStyle=WH;x.fillText('układ nerwowy',845,1130);
  x.fillStyle='rgba(255,255,255,.85)';rr(130,1010,150,80,12);x.fill();x.fillStyle='#7E1222';x.font='600 30px Pop';x.fillText('ciało OK',205,1062)}
 if(k=='bed'){bed(cx,GY-40,1);x.strokeStyle=WH;x.lineWidth=14;x.beginPath();x.arc(cx-100,GY-150,44,0,7);x.stroke();line([[cx-56,GY-140],[cx+130,GY-120]],WH,16);
  x.fillStyle=WH;x.font='800 50px Pop';x.textAlign='left';for(let q=0;q<3;q++){const zz=(l*0.8+q*0.33)%1;const sv=x.globalAlpha;x.globalAlpha=sv*(1-zz);x.fillText('z',cx-60+zz*120+q*10,GY-240-zz*200);x.globalAlpha=sv}
  x.fillStyle=Y;rr(700,980,230,140,20);x.fill();x.fillStyle='#14161C';x.font='800 44px Pop';x.textAlign='center';x.fillText('7–14',815,1050);x.font='600 30px Pop';x.fillText('dni',815,1095)}
 if(k=='crutch'){const m=man({x:cx,y:GY,feet:[[-60,0],[40,-40]],hands:[[-150,250],[150,250]]});line([[m.hands[0][0],m.hands[0][1]-30],[m.hands[0][0]-10,GY]],Y,10);line([[m.hands[1][0],m.hands[1][1]-30],[m.hands[1][0]+10,GY]],Y,10);
  x.fillStyle=WH;rr(cx+20,GY-140,46,60,10);x.fill();const pg=Math.floor(l*2.2);x.fillStyle=WH;rr(720,960,220,200,18);x.fill();x.fillStyle='#C9222F';rr(720,960,220,50,18);x.fill();x.fillStyle='#14161C';x.font='800 46px Pop';x.textAlign='center';x.fillText('tydz. '+(1+pg),830,1105);x.font='600 26px Pop';x.fillStyle=WH;x.fillText('przerwa',830,995)}
 if(k=='q'){const sc=1+Math.sin(l*4)*0.06;man({x:cx-180,y:GY,s:0.9,hands:[[-110,120],[60,-90]]});x.save();x.translate(cx+170,1100);x.scale(sc,sc);x.fillStyle=Y;x.font='800 380px Pop';x.textAlign='center';x.fillText('?',0,130);x.restore()}
 if(k=='hr'){const wk=Math.min(3,1+Math.floor(l/1.4));const bpm=[0,52,57,63][wk];const pu=1+0.08*Math.max(0,Math.sin(l*8));x.save();x.translate(cx,960);x.scale(pu*1.4,pu*1.4);x.fillStyle='#ff4d5e';x.beginPath();x.moveTo(0,40);x.bezierCurveTo(-120,-40,-60,-120,0,-60);x.bezierCurveTo(60,-120,120,-40,0,40);x.fill();x.restore();
  x.fillStyle=WH;x.font='800 80px Pop';x.textAlign='center';x.fillText(bpm+' bpm',cx,1140);x.font='600 36px Pop';x.fillText('tydzień '+wk+', rano po przebudzeniu',cx,1200);
  for(let q=1;q<=3;q++){x.fillStyle=q<=wk?Y:'rgba(255,255,255,.25)';rr(cx-150+(q-1)*110,1250,80,[0,40,70,100][q],8);x.fill()}}
 if(k=='jump'){const jh=Math.abs(Math.sin(l*2.6))*lerp(220,70,cl(l/d));man({x:300,y:GY-jh,s:0.7,feet:[[-50,0],[50,0]],hands:[[-110,-130],[110,-130]]});line([[220,GY-250],[380,GY-250]],Y,8);x.fillStyle=Y;x.font='600 28px Pop';x.textAlign='center';x.fillText('rekord',300,GY-266);
  const dx=lerp(0,1,cl(l/d));const far=lerp(340,190,cl(l/d));line([[620,GY+40],[620+340,GY+40]],'rgba(255,255,255,.4)',6);line([[620+340,GY+20],[620+340,GY+60]],Y,8);man({x:620+far*Math.min(1,(l*0.9)%1.2),y:GY,s:0.5,lean:20,feet:[[-60,0],[60,0]],hands:[[-90,60],[90,60]]});x.fillStyle=WH;x.font='600 28px Pop';x.fillText('skok w dal',790,GY+90)}
 if(k=='grip'){const r=Math.abs(Math.sin(l*2.4));const kg=Math.round(lerp(100,75,cl(l/(d-1))));const m=man({x:cx-120,y:GY,hands:[[-150,lerp(10,-150,r)],[150,lerp(10,-150,r)]]});bar(cx-120,m.hands[0][1],420,lerp(190,120,cl(l/(d-1))));
  x.fillStyle=WH;x.font='800 80px Pop';x.textAlign='center';x.fillText(kg+' kg',cx+270,1080);arrow(cx+270,1120,cx+270,1240,'#ff4d5e',12)}
 if(k=='perf'){const pts=[[200,1250],[340,1150],[480,1080],[620,1120],[760,1200],[900,1280]];const n=Math.min(pts.length,1+Math.floor(l/0.6));line(pts.slice(0,n),Y,12);pts.slice(0,n).forEach(p=>{x.fillStyle=WH;x.beginPath();x.arc(p[0],p[1],14,0,7);x.fill()});
  x.fillStyle=WH;x.font='600 32px Pop';x.textAlign='left';x.fillText('wyniki',200,1320);x.textAlign='right';x.fillText('treningi →',900,1320);meter(200,920,'ilość treningów',cl(0.3+l/d*0.7),'#ff4d5e')}
 if(k=='fl1')flags(['gorszy sen','waga leci w dół','częste infekcje'],l,980);
 if(k=='fl2')flags(['ciągłe zmęczenie','brak chęci do treningu','problem z koncentracją'],l,980);
 if(k=='fl3')flags(['gorszy nastrój','apatia, brak motywacji'],l,1020);
 if(k=='stop'){const p=ease(cl(l/1.2));x.save();x.translate(cx,1100);x.scale(0.6+0.4*p,0.6+0.4*p);x.fillStyle='#ff4d5e';x.beginPath();for(let q=0;q<8;q++){const a=Math.PI/8+q*Math.PI/4;x.lineTo(Math.cos(a)*170,Math.sin(a)*170)}x.closePath();x.fill();x.strokeStyle=WH;x.lineWidth=10;x.stroke();x.fillStyle=WH;x.font='800 54px Pop';x.textAlign='center';x.fillText('ZWOLNIJ',0,20);x.restore();
  x.fillStyle=Y;x.font='800 46px Pop';x.textAlign='center';x.fillText('3 z listy = sygnał',cx,1370)}
 if(k=='end'){const run=l*6;man({x:cx-120,y:GY,s:0.8,lean:14,feet:[[Math.sin(run)*70,0],[-Math.sin(run)*70,0]],hands:[[Math.sin(run)*-90,90],[Math.sin(run)*90,90]]});bed(cx+260,GY-40,0.9);
  x.strokeStyle=WH;x.lineWidth=10;x.beginPath();x.arc(cx+260,1020,70,0,7);x.stroke();line([[cx+260,1020],[cx+260,975]],WH,10);line([[cx+260,1020],[cx+260+40*Math.cos(l),1020+40*Math.sin(l)]],Y,10)}
}
