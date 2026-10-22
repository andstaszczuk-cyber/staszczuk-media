import cairo, math, sys, os
from gait import *
W,H=1080,1920; FPS=30
Y=(0xFC/255,0xE8/255,0x6A/255); RED=(0.80,0.17,0.19); RED_D=(0.58,0.10,0.12); SKIN=(0.93,0.76,0.62); SKIN_D=(0.80,0.62,0.50)
K=1.55
TH,SH=80*K,78*K; LEG=TH+SH; STEP=100*K; SIDE=24*K; WF=10*K
ev,labels,T_ARR=plan(STEP,SIDE,WF)
fin,_,_=feet_at(ev,T_ARR,WF); GOAL=(fin['L'][0]+fin['R'][0])/2+190
T_END=T_ARR+1.8+3.4
def g(s): return -0.17*s-80*math.sin(s/330)-30*math.sin(s/105+1)
def pelvis(feet,swing,su):
    sl,ll,_=feet['L']; sr,lr,_=feet['R']
    ps=(sl+sr)/2; pl=(ll+lr)/2
    sep=abs(sl-sr); gy=(g(sl)+g(sr))/2
    h=math.sqrt(max(1,(LEG*0.985)**2-(sep/2)**2))
    sway=0
    if swing: sway=math.sin(math.pi*su)*4
    return ps,pl,gy-h-sway*0.3
# camera smoothing
N=int(T_END*FPS); cam=[]
cx=cy=None
for f in range(N):
    fe,sw,su=feet_at(ev,f/FPS,WF); ps,pl,py=pelvis(fe,sw,su)
    tx,ty=ps+60,g(ps)
    cx=tx if cx is None else cx+(tx-cx)*0.06; cy=ty if cy is None else cy+(ty-cy)*0.06
    cam.append((cx,cy))
def ik(hx,hy,fx,fy,a,b):
    dx,dy=fx-hx,fy-hy; d=min(math.hypot(dx,dy),a+b-0.5)
    ang=math.atan2(dy,dx); k=math.acos(max(-1,min(1,(a*a+d*d-b*b)/(2*a*d))))
    kx=hx+a*math.cos(ang-k); ky=hy+a*math.sin(ang-k)   # knee forward (+x) for facing right
    return kx,ky
def cap(c,x1,y1,x2,y2,w1,w2,col):
    ang=math.atan2(y2-y1,x2-x1); nx,ny=-math.sin(ang),math.cos(ang)
    c.set_source_rgb(*col)
    c.move_to(x1+nx*w1/2,y1+ny*w1/2); c.line_to(x2+nx*w2/2,y2+ny*w2/2); c.line_to(x2-nx*w2/2,y2-ny*w2/2); c.line_to(x1-nx*w1/2,y1-ny*w1/2); c.close_path(); c.fill()
    c.arc(x1,y1,w1/2,0,2*math.pi); c.fill(); c.arc(x2,y2,w2/2,0,2*math.pi); c.fill()
def txt(c,s,size,y,col,wt=1,a=1):
    c.select_font_face('Poppins',0,wt); c.set_font_size(size); e=c.text_extents(s); c.set_source_rgba(*col,a); c.move_to(W/2-e.x_advance/2,y); c.show_text(s)
def pill(c,lab):
    c.select_font_face('Poppins',0,1); c.set_font_size(66); e=c.text_extents(lab); w=e.x_advance+90; h=110; x=W/2-w/2; y=480-h/2; r=24
    c.new_sub_path(); c.arc(x+w-r,y+r,r,-math.pi/2,0); c.arc(x+w-r,y+h-r,r,0,math.pi/2); c.arc(x+r,y+h-r,r,math.pi/2,math.pi); c.arc(x+r,y+r,r,math.pi,1.5*math.pi); c.close_path(); c.set_source_rgb(*Y); c.fill()
    c.set_source_rgb(0.08,0.08,0.08); c.move_to(W/2-e.x_advance/2,502); c.show_text(lab)
def frame(f):
    t=f/FPS; camx,camy=cam[f]
    sf=cairo.ImageSurface(cairo.FORMAT_RGB24,W,H); c=cairo.Context(sf)
    gr=cairo.RadialGradient(W/2,700,50,W/2,800,1300); gr.add_color_stop_rgb(0,0.30,0.30,0.32); gr.add_color_stop_rgb(0.5,0.15,0.15,0.17); gr.add_color_stop_rgb(1,0.07,0.07,0.08); c.set_source(gr); c.paint()
    X=lambda s:W/2+(s-camx); Yy=lambda y:1420+(y-camy)
    fe,sw,su=feet_at(ev,t,WF); ps,pl,py=pelvis(fe,sw,su)
    # terrain
    s0=camx-W/2-50
    c.move_to(-10,Yy(g(s0)))
    for i in range(0,W+60,6): c.line_to(i,Yy(g(s0+i)))
    c.line_to(W+60,H); c.line_to(-10,H); c.close_path()
    lg=cairo.LinearGradient(0,1200,0,H); lg.add_color_stop_rgb(0,0.21,0.21,0.23); lg.add_color_stop_rgb(1,0.10,0.10,0.11); c.set_source(lg); c.fill()
    c.set_line_width(9); c.set_line_cap(1)
    c.move_to(-10,Yy(g(s0)))
    for i in range(0,W+60,6): c.line_to(i,Yy(g(s0+i)))
    c.set_source_rgba(1,1,1,0.22); c.stroke()
    # trail walked (max progress so far)
    mx=max(ps,0)
    c.move_to(X(0),Yy(g(0)))
    s=0
    while s<=mx: c.line_to(X(s),Yy(g(s))); s+=6
    c.set_source_rgb(*Y); c.stroke()
    # flag
    fx,fy=X(GOAL),Yy(g(GOAL))
    c.set_source_rgb(0.85,0.85,0.85); c.set_line_width(8); c.move_to(fx,fy); c.line_to(fx,fy-260); c.stroke()
    w=8*math.sin(t*5)
    c.move_to(fx,fy-260); c.curve_to(fx+40,fy-270+w,fx+80,fy-235-w,fx+120,fy-245+w); c.line_to(fx+120,fy-175+w); c.curve_to(fx+80,fy-165-w,fx+40,fy-200+w,fx,fy-190); c.close_path(); c.set_source_rgb(*Y); c.fill()
    c.select_font_face('Poppins',0,1); c.set_font_size(32); e=c.text_extents('CEL'); c.set_source_rgb(0.1,0.1,0.1); c.move_to(fx+58-e.x_advance/2,fy-207); c.show_text('CEL')
    # athlete (depth lat -> down/scale)
    dep=pl; sc=(1+dep/900)*K; oy=dep*1.0
    hx,hy=X(ps),Yy(py)+oy
    slope=(g(ps+20)-g(ps-20))/40
    lean=0.06+slope*-0.25
    arrived=t>=T_ARR
    # shadow
    c.save(); c.translate(hx,Yy(g(ps))+oy); c.scale(1,0.22); c.arc(0,0,70*sc,0,2*math.pi); c.set_source_rgba(0,0,0,0.35); c.fill(); c.restore()
    def leg(foot,col,shoe):
        s_,l_,lift=fe[foot]; fx_=X(s_); fy_=Yy(g(s_))+l_*1.0+oy*0 - lift*LEG - 6
        fy_=Yy(g(s_)-lift*LEG)+ (l_)*1.0 -6
        kx,ky=ik(hx,hy+2,fx_,fy_,TH*sc/K,SH*sc/K)
        cap(c,hx,hy,kx,ky,30*sc,24*sc,col); cap(c,kx,ky,fx_,fy_,24*sc,17*sc,col)
        toe=-0.25*math.sin(math.pi*(su if sw==foot else 0))
        c.save(); c.translate(fx_,fy_); c.rotate(toe)
        c.set_source_rgb(*shoe); c.new_sub_path(); c.arc(-6,4,12*sc,math.pi/2,1.5*math.pi); c.line_to(30*sc,-8*sc); c.arc(30*sc,4*sc,12*sc,-math.pi/2,math.pi/2); c.close_path(); c.fill()
        c.restore()
        return fx_,fy_
    # far leg (R) first darker
    sh=math.atan2(0,1)
    tx_,ty_=hx+math.sin(lean)*-118*sc*-1, hy-118*sc*math.cos(lean)  # shoulder
    sx,sy=hx+118*sc*math.sin(lean), hy-118*sc*math.cos(lean)
    armL=(fe['R'][0]-fe['L'][0])/STEP*0.55; armR=-armL
    def arm(phi,col,cheer=False):
        if cheer:
            r=math.sin(t*7)*0.12
            ex,ey=sx+20*sc,sy-58*sc; wx,wy=sx+12*sc,sy-112*sc+r*20
        else:
            ex=sx+math.sin(phi)*58*sc; ey=sy+math.cos(phi)*58*sc
            ph2=phi+0.45
            wx=ex+math.sin(ph2)*52*sc; wy=ey+math.cos(ph2)*52*sc
        cap(c,sx,sy,ex,ey,22*sc,18*sc,col); cap(c,ex,ey,wx,wy,18*sc,14*sc,col)
        c.set_source_rgb(*col); c.arc(wx,wy,10*sc,0,2*math.pi); c.fill()
    arm(armR,SKIN_D,arrived); leg('R',SKIN_D,(0.80,0.80,0.80))
    # torso + shorts
    c.save(); c.translate(hx,hy); c.rotate(lean)
    c.set_source_rgb(*RED_D); c.new_sub_path(); c.rectangle(-30*sc,-10*sc,60*sc,44*sc); c.fill()
    c.set_source_rgb(*RED); c.move_to(-30*sc,-4*sc); c.curve_to(-36*sc,-60*sc,-34*sc,-110*sc,-20*sc,-128*sc); c.line_to(22*sc,-128*sc); c.curve_to(38*sc,-108*sc,38*sc,-60*sc,30*sc,-4*sc); c.close_path(); c.fill()
    c.set_source_rgb(1,1,1); c.select_font_face('Poppins',0,1); c.set_font_size(40*sc); e=c.text_extents('7'); c.move_to(-e.x_advance/2+4*sc,-52*sc); c.show_text('7')
    # neck+head
    c.set_source_rgb(*SKIN); c.rectangle(-8*sc,-142*sc,16*sc,18*sc); c.fill()
    c.arc(4*sc,-172*sc,30*sc,0,2*math.pi); c.fill()
    c.set_source_rgb(0.42,0.30,0.20); c.arc(0,-178*sc,30*sc,math.pi*0.95,math.pi*1.9); c.fill()
    c.set_source_rgb(0.2,0.15,0.12); c.arc(22*sc,-176*sc,3.5*sc,0,2*math.pi); c.fill()
    c.restore()
    leg('L',SKIN,(1,1,1)); arm(armL,SKIN,arrived)
    lab=None
    for a,b,l in labels:
        if a<=t<=b+0.35: lab=l
    if os.environ.get('COVER'):
        sf.write_to_png('cover_raw.png'); return
    if not arrived and lab: pill(c,lab)
    txt(c,'@psychologsportowy',30,120,(0.65,0.65,0.65),0)
    txt(c,'Droga do celu?',78,240,(1,1,1)); txt(c,'Tak to wygląda w sporcie.',44,310,(0.82,0.82,0.82),0)
    if t>T_ARR+1.8:
        u=min(1,(t-T_ARR-1.8)/0.6)
        c.set_source_rgba(0.07,0.07,0.08,0.88*u); c.paint()
        c.select_font_face('Poppins',0,1); c.set_font_size(110)
        for k,(l,col) in enumerate([('Tak wygląda',(1,1,1)),('proces.',Y)]):
            e=c.text_extents(l); c.set_source_rgba(*col,u); c.move_to(W/2-e.x_advance/2,900+k*130); c.show_text(l)
        c.set_source_rgba(*Y,u); c.rectangle(W/2-70,1090,140,12); c.fill()
        for i,l in enumerate(['Krok do przodu, dwa do tyłu, jeden w bok.','A i tak jesteś bliżej niż wczoraj.']): txt(c,l,44,1200+i*64,(0.85,0.85,0.85),0,u)
    sf.write_to_png(f'fs/{f:04d}.png')
import os; os.makedirs('fs',exist_ok=True)
fs=[int(a) for a in sys.argv[1:]] or range(N)
for f in fs: frame(f)
print(N, T_ARR)
