import math
MOVES=[(1,'krok do przodu'),(-2,'dwa do tyłu'),('s','krok w bok'),(2,'dwa do przodu'),(1,'krok do przodu'),('s','w bok'),(-1,'krok do tyłu'),(3,'trzy do przodu'),(-1,'znowu do tyłu'),(2,'dwa do przodu'),('s','w bok'),(3,'trzy do przodu'),(-2,'dwa do tyłu'),(3,'trzy do przodu'),(2,'jeszcze dwa')]
def ss(u): u=max(0,min(1,u)); return u*u*(3-2*u)
def plan(STEP,SIDE,W_FEET,T0=1.2,TF=0.52,TB=0.62,TS=0.55,TC=0.36,PAUSE=0.35,BACK=0.75):
    """returns events list and label spans. Feet: dict foot->(s,lat). Event: (t0,t1,foot,(s0,l0),(s1,l1),lift)"""
    feet={'L':[0.0,+W_FEET/2],'R':[0.0,-W_FEET/2]}
    ev=[]; labels=[]; t=T0; nxt='R'; sidedir=1
    for m,lab in MOVES:
        start=t
        if m=='s':
            a,b=(('L','R') if sidedir>0 else ('R','L'))
            for f,dur in ((a,TS),(b,TS*0.8)):
                s0,l0=feet[f]; s1,l1=s0,l0+sidedir*SIDE
                ev.append((t,t+dur,f,(s0,l0),(s1,l1),0.06)); feet[f]=[s1,l1]; t+=dur
            sidedir*=-1
        else:
            n=abs(m); d=1 if m>0 else -1; st=STEP*(1 if d>0 else BACK); dur=TF if d>0 else TB
            base=max(feet['L'][0],feet['R'][0]) if d>0 else min(feet['L'][0],feet['R'][0])
            for k in range(1,n+1):
                f=nxt; s0,l0=feet[f]; s1=base+d*k*st
                ev.append((t,t+dur,f,(s0,l0),(s1,l0),0.13 if d>0 else 0.08)); feet[f]=[s1,l0]; t+=dur*0.92; nxt='L' if f=='R' else 'R'
            # closing step
            f=nxt; s0,l0=feet[f]; s1=base+d*n*st
            ev.append((t,t+TC,f,(s0,l0),(s1,l0),0.07)); feet[f]=[s1,l0]; t+=TC; nxt='L' if f=='R' else 'R'
        labels.append((start,t,lab)); t+=PAUSE
    return ev,labels,t
def feet_at(ev,t,W_FEET):
    feet={'L':(0.0,W_FEET/2,0.0),'R':(0.0,-W_FEET/2,0.0)}; swing=None; su=0
    for (a,b,f,p0,p1,lift) in ev:
        if t>=b: feet[f]=(p1[0],p1[1],0.0)
        elif t>=a:
            u=(t-a)/(b-a); e=ss(u)
            feet[f]=(p0[0]+(p1[0]-p0[0])*e, p0[1]+(p1[1]-p0[1])*e, lift*math.sin(math.pi*u)); swing=f; su=u
        else: break
    return feet,swing,su
