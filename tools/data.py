import numpy as np, cv2, gzip, math, random
from scipy import ndimage

def load_mnist():
    d='/tmp/mn/TensorFlow-MNIST/mnist/data/'
    def im(f):
        return np.frombuffer(gzip.open(d+f).read(),np.uint8,offset=16).reshape(-1,28,28)
    def lb(f):
        return np.frombuffer(gzip.open(d+f).read(),np.uint8,offset=8)
    return im('train-images-idx3-ubyte.gz'),lb('train-labels-idx1-ubyte.gz'),im('t10k-images-idx3-ubyte.gz'),lb('t10k-labels-idx1-ubyte.gz')

# ---- stroke renderer (mirrors js/pen.js) ----
def _draw(strokes,w,dx=0.0,dy=0.0,S=4):
    img=np.zeros((28*S,28*S),np.uint8)
    th=max(1,int(round(w*S)))
    for st in strokes:
        pts=np.round((np.asarray(st)+[dx,dy])*S).astype(np.int32).reshape(-1,1,2)
        if len(pts)==1: cv2.circle(img,tuple(pts[0,0]),max(1,th//2),255,-1,cv2.LINE_AA)
        else: cv2.polylines(img,[pts],False,255,th,cv2.LINE_AA)
    return cv2.resize(img,(28,28),interpolation=cv2.INTER_AREA).astype(np.float32)/255
def render(strokes,w=2.4):
    allp=np.vstack([np.asarray(s) for s in strokes])
    mn,mx=allp.min(0),allp.max(0);size=max(mx[0]-mn[0],mx[1]-mn[1],1e-6)
    sc=20.0/size;c=(mn+mx)/2
    norm=[((np.asarray(s)-c)*sc+14) for s in strokes]
    img=_draw(norm,w)
    tot=img.sum()
    if tot>0:
        ys,xs=np.mgrid[0:28,0:28];cx=(img*xs).sum()/tot+.5;cy=(img*ys).sum()/tot+.5
        img=_draw(norm,w,14-cx,14-cy)
    return img

# ---- synthetic pen digits ----
def spline(ctrl,n=24):
    P=np.asarray(ctrl,float)
    if len(P)<3: return np.linspace(P[0],P[-1],n)
    P=np.vstack([P[0],P,P[-1]]);out=[]
    per=max(4,n//(len(P)-3))
    for i in range(1,len(P)-2):
        p0,p1,p2,p3=P[i-1],P[i],P[i+1],P[i+2]
        for t in np.linspace(0,1,per,endpoint=False):
            out.append(.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t**3))
    out.append(P[-2]);return np.array(out)
SH={
 0:[[[.5,0],[.15,.2],[.1,.5],[.2,.85],[.5,1],[.8,.85],[.9,.5],[.8,.2],[.5,0],[.3,.06]]],
 1:[[[.5,0],[.5,1]]],
 2:[[[.2,.28],[.35,.05],[.62,.02],[.8,.25],[.62,.55],[.2,1],[.85,1]]],
 3:[[[.2,.1],[.5,0],[.78,.2],[.5,.48],[.3,.5],[.55,.5],[.82,.72],[.5,1],[.15,.88]]],
 4:[[[.65,0],[.15,.65],[.9,.65]],[[.65,.3],[.65,1]]],
 5:[[[.8,0],[.25,0],[.2,.45],[.55,.38],[.82,.62],[.55,.98],[.15,.85]]],
 6:[[[.7,.05],[.35,.3],[.2,.65],[.4,1],[.75,.85],[.7,.55],[.4,.5],[.22,.7]]],
 7:[[[.15,.05],[.85,.05],[.4,1]]],
 8:[[[.5,.5],[.2,.25],[.5,0],[.8,.25],[.5,.5],[.2,.75],[.5,1],[.8,.75],[.5,.5]]],
 9:[[[.75,.3],[.5,0],[.22,.25],[.5,.5],[.78,.28],[.72,.7],[.4,1]]],
}
def variants(d):
    s=[[list(p) for p in st] for st in SH[d]]
    r=random.random()
    if d==1:
        if r<.5: s=[[[.25,.25],[.5,0],[.5,1]]]
        if r<.2: s.append([[.25,1],[.75,1]])
    if d==4:
        if r<.4: s=[[[.2,0],[.2,.55],[.85,.55]],[[.65,0],[.65,1]]]
        elif r<.55: s=[[[.65,0],[.15,.65],[.9,.65]],[[.65,0],[.65,1]]]
    if d==5 and r<.4: s=[[[.25,0],[.8,0]],[[.25,0],[.2,.45],[.55,.38],[.82,.62],[.55,.98],[.15,.85]]]
    if d==7 and r<.35: s.append([[.3,.55],[.7,.55]])
    if d==9 and r<.3: s=[[[.75,.3],[.5,0],[.22,.25],[.5,.5],[.78,.28]],[[.78,.28],[.72,.7],[.4,1]]]
    if d==0 and r<.15: s=[[[.5,0],[.15,.25],[.15,.75],[.5,1],[.85,.75],[.85,.25],[.5,0]]]
    if d==6 and r<.3: s=[[[.65,0],[.25,.5],[.22,.8],[.5,1],[.8,.8],[.5,.5],[.25,.6]]]
    if d==2 and r<.25: s=[[[.2,.3],[.5,0],[.8,.3],[.2,1],[.85,1]]]
    if d==8 and r<.3: s=[[[.5,.48],[.25,.25],[.5,0],[.75,.25],[.5,.48],[.2,.74],[.5,1],[.8,.74],[.5,.48]]]
    return s
def synth(d):
    s=variants(d)
    th=random.uniform(-.2,.2);sh=random.uniform(-.3,.3);sx=random.uniform(.55,1.1);sy=random.uniform(.9,1.1)
    A=np.array([[math.cos(th),-math.sin(th)],[math.sin(th),math.cos(th)]])@np.array([[sx,sh],[0,sy]])
    out=[]
    for st in s:
        pts=spline(st)+np.random.normal(0,.018,(len(spline(st)),2))
        pts=ndimage.gaussian_filter1d(pts,1.0,axis=0,mode='nearest') if len(pts)>5 else pts
        out.append((pts-.5)@A.T+.5)
    return render(out,random.uniform(1.9,3.4))

# ---- MNIST augmentation ----
def aug(img):
    a=random.uniform(-.2,.2);sc=random.uniform(.85,1.15);sh=random.uniform(-.2,.2)
    M=np.array([[math.cos(a),-math.sin(a)],[math.sin(a),math.cos(a)]])@np.array([[sc,sh],[0,sc*random.uniform(.9,1.1)]])
    Mi=np.linalg.inv(M);c=np.array([14,14]);off=c-Mi@c+np.random.uniform(-1.5,1.5,2)
    out=ndimage.affine_transform(img.astype(np.float32),Mi,offset=off,order=1)
    r=random.random()
    if r<.25: out=ndimage.grey_dilation(out,size=2)
    elif r<.4: out=ndimage.grey_erosion(out,size=2)
    return np.clip(out,0,1)
