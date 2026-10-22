import cairo, math, sys, os
from gait import *
W,H=1080,1920; FPS=30
Y=(0xFC/255,0xE8/255,0x6A/255); RED=(0.80,0.17,0.19); SKIN=(0.93,0.76,0.62)
STEP=0.62; SIDE=0.30; WF=0.24; LEG=0.92; EYE=1.62
ev,labels,T_ARR=plan(STEP,SIDE,WF)
fin,_,_=feet_at(ev,T_ARR,WF); GOAL=(fin['L'][0]+fin['R'][0])/2+7.5
T_END=T_ARR+1.8+3.4
def hgt(z): return 0.9*math.sin(z/4.2)+0.35*math.sin(z/1.7+1)+0.05*z
def curve(z): return 1.2*math.sin(z/7)
HOR=760; F=1000; SEG=0.4; DRAW=34
def body(t):
    fe,sw,su=feet_at(ev,t,WF)
    sl,ll,_=fe['L']; sr,lr,_=fe['R']
    ps=(sl+sr)/2; pl=(ll+lr)/2; sep=abs(sl-sr)
    dip=LEG-math.sqrt(max(0.01,LEG**2-(sep/2)**2))
    lat=0
    if sw: st='R' if sw=='L' else 'L'; lat=(fe[st][1]-pl)*0.25*math.sin(math.pi*su)
    return fe,sw,su,ps,pl+lat,dip
N=int(T_END*FPS)
# smooth camera a little (head stabilisation)
raw=[body(f/FPS) for f in range(N)]
cam=[]; prev=None
for r in raw:
    v=(r[3],r[4],r[5])
    prev=v if prev is None else tuple(prev[i]+(v[i]-prev[i])*0.55 for i in range(3))
    cam.append(prev)
def mix(a,b,k): return tuple(a[i]*(1-k)+b[i]*k for i in range(3))
SKY_T=(0.10,0.10,0.12); SKY_B=(0.25,0.25,0.28)
def txt(c,s,size,y,col,wt=1,a=1):
    c.select_font_face('Poppins',0,wt); c.set_font_size(size); e=c.text_extents(s); c.set_source_rgba(*col,a); c.move_to(W/2-e.x_advance/2,y); c.show_text(s)
def pill(c,lab):
    c.select_font_face('Poppins',0,1); c.set_font_size(66); e=c.text_extents(lab); w=e.x_advance+90; h=110; x=W/2-w/2; y=480-h/2; r=24
    c.new_sub_path(); c.arc(x+w-r,y+r,r,-math.pi/2,0); c.arc(x+w-r,y+h-r,r,0,math.pi/2); c.arc(x+r,y+h-r,r,math.pi/2,math.pi); c.arc(x+r,y+r,r,math.pi,1.5*math.pi); c.close_path(); c.set_source_rgb(*Y); c.fill()
    c.set_source_rgb(0.08,0.08,0.08); c.move_to(W/2-e.x_advance/2,502); c.show_text(lab)
def frame(f):
    t=f/FPS; fe,sw,su,_,_,_=raw[f]; cz,cl,dip=cam[f]
    arrived=t>=T_ARR
    camx=curve(cz)+cl; camy=hgt(cz)+EYE-dip
    roll=(cl-curve(0)*0)*0.0+ (raw[f][4]-cl)*0.6
    sf=cairo.ImageSurface(cairo.FORMAT_RGB24,W,H); c=cairo.Context(sf)
    g=cairo.LinearGradient(0,0,0,H); g.add_color_stop_rgb(0,*SKY_T); g.add_color_stop_rgb(0.42,*SKY_B); g.add_color_stop_rgb(1,*SKY_B); c.set_source(g); c.paint()
    c.save(); c.translate(W/2,H*0.6); c.rotate(roll*0.25); c.translate(-W/2,-H*0.6)
    def proj(x,y,z):
        dz=z-cz; return W/2+(x-camx)*F/dz, HOR-(y-camy)*F/dz
    zs=[cz+0.5+i*SEG for i in range(int(DRAW/SEG))]
    for i in range(len(zs)-1,0,-1):
        z1,z2=zs[i-1],zs[i]
        a=proj(curve(z1),hgt(z1),z1); b=proj(curve(z2),hgt(z2),z2)
        if b[1]>=a[1]: continue
        fog=min(1,(z2-cz)/DRAW)**1.2; k=int(z2/SEG)%2
        c.set_source_rgb(*mix((0.17,0.17,0.19) if k else (0.155,0.155,0.175),SKY_B,fog)); c.rectangle(0,b[1],W,a[1]-b[1]+1); c.fill()
        def wp(p,z,dx): return p[0]+dx*F/(z-cz)
        for half,col in((1.75,mix((0.88,0.88,0.88) if k else RED,SKY_B,fog)),(1.5,mix((0.38,0.38,0.40) if k else (0.36,0.36,0.38),SKY_B,fog))):
            c.set_source_rgb(*col); c.move_to(wp(a,z1,-half),a[1]); c.line_to(wp(a,z1,half),a[1]); c.line_to(wp(b,z2,half),b[1]); c.line_to(wp(b,z2,-half),b[1]); c.close_path(); c.fill()
        if (int(z2/(SEG*2))%2) and z2<GOAL:
            c.set_source_rgb(*mix(Y,SKY_B,fog)); w=0.05
            c.move_to(wp(a,z1,-w),a[1]); c.line_to(wp(a,z1,w),a[1]); c.line_to(wp(b,z2,w),b[1]); c.line_to(wp(b,z2,-w),b[1]); c.close_path(); c.fill()
    if GOAL-cz>0.8:
        fx=curve(GOAL)+1.0; base=proj(fx,hgt(GOAL),GOAL); top=proj(fx,hgt(GOAL)+2.4,GOAL); sc=F/(GOAL-cz)
        c.set_source_rgb(0.9,0.9,0.9); c.set_line_width(max(2,0.07*sc)); c.move_to(*base); c.line_to(*top); c.stroke()
        w=0.1*sc*math.sin(t*5); fw=1.3*sc; fh=0.8*sc
        c.move_to(*top); c.curve_to(top[0]+fw*0.4,top[1]-w,top[0]+fw*0.7,top[1]+w,top[0]+fw,top[1]); c.line_to(top[0]+fw,top[1]+fh); c.curve_to(top[0]+fw*0.7,top[1]+fh+w,top[0]+fw*0.4,top[1]+fh-w,top[0],top[1]+fh); c.close_path(); c.set_source_rgb(*Y); c.fill()
        c.select_font_face('Poppins',0,1); c.set_font_size(max(8,0.42*sc)); e=c.text_extents('CEL'); c.set_source_rgb(0.1,0.1,0.1); c.move_to(top[0]+fw/2-e.x_advance/2,top[1]+fh/2+e.height/2); c.show_text('CEL')
    # own legs/feet seen from above, positioned by real foot positions relative to the eyes
    order=sorted(['L','R'],key=lambda k:-(fe[k][0]-cz))
    for k in order:
        s,l,lift=fe[k]; rel=s-cz; lr=l-cl
        sy=H-360-rel*620-lift*420; sx=W/2+lr*1150
        scl=max(0.6,1-rel*0.35-lift*0.4)
        if sy>H+260: continue
        # shin going down toward the body (bottom of frame)
        kxb=W/2+(lr*0.6)*1150; c.set_source_rgb(*SKIN)
        c.move_to(sx-50*scl,sy+60*scl); c.line_to(sx+50*scl,sy+60*scl); c.line_to(kxb+80,H+300); c.line_to(kxb-80,H+300); c.close_path(); c.fill()
        c.set_source_rgb(*RED); c.move_to(sx-56*scl,sy+50*scl); c.line_to(sx+56*scl,sy+50*scl); c.line_to(sx+60*scl,sy+130*scl); c.line_to(sx-60*scl,sy+130*scl); c.close_path(); c.fill()
        c.save(); c.translate(sx,sy); c.scale(scl,scl*1.0)
        c.save(); c.scale(1,1.6); c.set_source_rgb(0.5,0.5,0.53); c.arc(0,-28,80,0,2*math.pi); c.fill(); c.set_source_rgb(0.97,0.97,0.97); c.arc(0,-31,72,0,2*math.pi); c.fill(); c.restore()
        c.set_source_rgb(*RED); c.set_line_width(14); c.set_line_cap(1); c.move_to(-58,10); c.curve_to(-20,-40,30,-40,60,-90); c.stroke()
        c.set_source_rgb(0.72,0.72,0.75); c.set_line_width(7)
        for j in range(4): yy=-70+j*26; c.move_to(-22,yy); c.line_to(22,yy); c.stroke()
        c.restore()
    c.restore()
    if arrived:
        r=math.sin(t*7)*18
        for sgn in(-1,1):
            c.set_source_rgb(*SKIN); c.set_line_width(72); c.set_line_cap(1); c.move_to(W/2+sgn*270,H+60); c.line_to(W/2+sgn*360,H-560+r*sgn); c.stroke(); c.arc(W/2+sgn*362,H-600+r*sgn,50,0,2*math.pi); c.fill()
            c.set_source_rgb(*RED); c.set_line_width(86); c.move_to(W/2+sgn*255,H+80); c.line_to(W/2+sgn*290,H-120); c.stroke()
    lab=None
    for a,b,l in labels:
        if a<=t<=b+0.35: lab=l
    if lab and not arrived: pill(c,lab)
    txt(c,'@psychologsportowy',30,120,(0.7,0.7,0.7),0)
    txt(c,'Droga do celu?',78,240,(1,1,1)); txt(c,'Z twojej perspektywy.',44,310,(0.82,0.82,0.82),0)
    if t>T_ARR+1.8:
        u=min(1,(t-T_ARR-1.8)/0.6)
        c.set_source_rgba(0.07,0.07,0.08,0.88*u); c.paint()
        c.select_font_face('Poppins',0,1); c.set_font_size(110)
        for k2,(l,col) in enumerate([('Tak wygląda',(1,1,1)),('proces.',Y)]):
            e=c.text_extents(l); c.set_source_rgba(*col,u); c.move_to(W/2-e.x_advance/2,900+k2*130); c.show_text(l)
        c.set_source_rgba(*Y,u); c.rectangle(W/2-70,1090,140,12); c.fill()
        for i,l in enumerate(['Krok do przodu, dwa do tyłu, jeden w bok.','A i tak jesteś bliżej niż wczoraj.']): txt(c,l,44,1200+i*64,(0.85,0.85,0.85),0,u)
    sf.write_to_png(f'fp/{f:04d}.png')
os.makedirs('fp',exist_ok=True)
fs=[int(a) for a in sys.argv[1:]] or range(N)
for f in fs: frame(f)
print(N,T_ARR)
