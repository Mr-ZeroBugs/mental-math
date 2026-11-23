import numpy as np,random,time,json,sys
from numpy.lib.stride_tricks import sliding_window_view as swv
from data import *
random.seed(0);np.random.seed(0)
t0=time.time()
xtr,ytr,xte,yte=load_mnist()
# dataset: MNIST x2 augmented (+ raw), synthetic stroke digits
X=[];Y=[]
for i in range(len(xtr)):
    X.append(xtr[i]/255.);Y.append(ytr[i])
    if i%2==0: X.append(aug(xtr[i]/255.));Y.append(ytr[i])
    if i%2==1: X.append(aug(xtr[i]/255.));Y.append(ytr[i])
NS=60000
for k in range(NS):
    d=k%10;X.append(synth(d));Y.append(d)
X=np.array(X,np.float32)[:,None];Y=np.array(Y)
Xs=np.array([synth(k%10) for k in range(3000)],np.float32)[:,None];Ys=np.arange(3000)%10   # held-out synthetic
Xt=(xte/255.).astype(np.float32)[:,None]
print('data',X.shape,time.time()-t0,flush=True)
def he(*s):return (np.random.randn(*s)*np.sqrt(2./np.prod(s[1:]))).astype(np.float32)
P={'w1':he(8,1,3,3),'b1':np.zeros(8,np.float32),'w2':he(16,8,3,3),'b2':np.zeros(16,np.float32),
   'w3':he(64,400),'b3':np.zeros(64,np.float32),'w4':he(10,64)*.5,'b4':np.zeros(10,np.float32)}
def conv(x,w,b):
    N,C,H,W=x.shape;F=w.shape[0]
    cols=swv(x,(3,3),axis=(2,3)).transpose(0,2,3,1,4,5).reshape(N,H-2,W-2,C*9)
    out=cols@w.reshape(F,-1).T+b
    return out.transpose(0,3,1,2),cols
def pool(x):
    N,C,H,W=x.shape;h,w=H//2,W//2
    r=x[:,:,:h*2,:w*2].reshape(N,C,h,2,w,2)
    o=r.max((3,5));m=(r==o[:,:,:,None,:,None])
    m=m/m.sum((3,5),keepdims=True)
    return o,m
def fwd(x,train=False):
    a1,c1=conv(x,P['w1'],P['b1']);r1=np.maximum(a1,0);p1,m1=pool(r1)
    a2,c2=conv(p1,P['w2'],P['b2']);r2=np.maximum(a2,0);p2,m2=pool(r2)
    f=p2.reshape(len(x),-1);h=np.maximum(f@P['w3'].T+P['b3'],0)
    if train:
        keep=(np.random.rand(*h.shape)>.2).astype(np.float32)/.8;h=h*keep
    else: keep=None
    z=h@P['w4'].T+P['b4']
    return z,(x,c1,a1,m1,p1,c2,a2,m2,f,h,keep,r1,r2)
def softmax(z):
    z=z-z.max(1,keepdims=True);e=np.exp(z);return e/e.sum(1,keepdims=True)
def bwd(z,y,cache):
    x,c1,a1,m1,p1,c2,a2,m2,f,h,keep,r1,r2=cache;N=len(y)
    p=softmax(z);loss=-np.log(p[np.arange(N),y]+1e-9).mean()
    dz=p;dz[np.arange(N),y]-=1;dz/=N
    G={}
    G['w4']=dz.T@h;G['b4']=dz.sum(0);dh=dz@P['w4']
    if keep is not None: dh=dh*keep
    dh=dh*((f@P['w3'].T+P['b3'])>0)
    G['w3']=dh.T@f;G['b3']=dh.sum(0);df=dh@P['w3']
    dp2=df.reshape(N,16,5,5)
    dr2=np.zeros_like(r2);dr2[:,:,:10,:10]=(m2*dp2[:,:,:,None,:,None]).reshape(N,16,10,10)
    da2=dr2*(a2>0)
    # conv2 grads
    d2=da2.transpose(0,2,3,1).reshape(-1,16);cols2=c2.reshape(-1,c2.shape[-1])
    G['w2']=(d2.T@cols2).reshape(P['w2'].shape);G['b2']=d2.sum(0)
    # dx for p1: full conv of da2 with flipped weights
    pad=np.pad(da2,((0,0),(0,0),(2,2),(2,2)))
    wf=P['w2'][:,:,::-1,::-1].transpose(1,0,2,3)
    dp1,_=conv(pad,wf,np.zeros(8,np.float32))
    dr1=np.zeros_like(r1);dr1[:,:,:26,:26]=(m1*dp1[:,:,:,None,:,None]).reshape(N,8,26,26) if False else 0
    dr1=np.zeros_like(r1);dr1[:,:,:26,:26]=(m1*dp1.reshape(N,8,13,1,13,1)).reshape(N,8,26,26)
    da1=dr1*(a1>0)
    d1=da1.transpose(0,2,3,1).reshape(-1,8);cols1=c1.reshape(-1,9)
    G['w1']=(d1.T@cols1).reshape(P['w1'].shape);G['b1']=d1.sum(0)
    return loss,G
M={k:np.zeros_like(v) for k,v in P.items()};V={k:np.zeros_like(v) for k,v in P.items()}
def acc(Xe,Ye):
    c=0
    for i in range(0,len(Xe),1000):
        z,_=fwd(Xe[i:i+1000]);c+=(z.argmax(1)==Ye[i:i+1000]).sum()
    return c/len(Xe)
EP=int(sys.argv[1]) if len(sys.argv)>1 else 6;B=128;step=0;n=len(X)
for ep in range(EP):
    perm=np.random.permutation(n);lr=2e-3*(0.5**ep) if ep>=3 else 2e-3;tl=0;nb=0
    for i in range(0,n-B+1,B):
        idx=perm[i:i+B];z,cache=fwd(X[idx],True);loss,G=bwd(z,Y[idx],cache);step+=1
        for k in P:
            M[k]=.9*M[k]+.1*G[k];V[k]=.999*V[k]+.001*G[k]**2
            P[k]-=lr*(M[k]/(1-.9**step))/(np.sqrt(V[k]/(1-.999**step))+1e-8)
        tl+=loss;nb+=1
        if nb%200==0:print(' ep',ep,nb,round(tl/nb,4),round(time.time()-t0),flush=True)
    print('EPOCH',ep,'loss',round(tl/nb,4),'mnist_test',acc(Xt,yte),'synth_test',acc(Xs,Ys),round(time.time()-t0),flush=True)
    np.savez('/tmp/ml/model.npz',**P)
