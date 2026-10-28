export const DIR=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
export const names=['Inerte','Hifas de Plomo','Cianobacterias','Criptolíquen','Caña de Silicato','Briofita Melífera','Manto-avispa','Quelonio Rizomático','Dendro-titán'];
export const level=t=>t<1?0:t<=2?1:t<=5?2:t<=7?3:4;
export const dist=(a,b)=>Math.max(Math.abs(a.q-b.q),Math.abs(a.r-b.r),Math.abs(a.q+a.r-b.q-b.r));
export class World{
 constructor(){this.cells=[];this.tick=0;this.ether=145;this.spent=0;this.stable=0;this.won=false;this.wind=0;this.events=[];this.maxLevel=0;this.totalSpent=0;this.actions=0;
 for(let q=-8;q<=8;q++)for(let r=-8;r<=8;r++)if(dist({q,r},{q:0,r:0})<=8){let tox=q>3?.65:q>0?.25:.08;let mat=(q%3===0&&r%3===0)?'concrete':'soil';if(q===5&&r===-2)mat='leak';if(q===-4&&r===3)mat='alloy';this.cells.push({q,r,h:Math.max(0,Math.round((Math.sin(q*.6)+Math.cos(r*.55))*.6)),t:0,p:0,tox,e:.2,mat,lock:0,age:0,mature:0,fertile:false,over:0,starve:0});}
 this.index=new Map(this.cells.map((c,i)=>[`${c.q},${c.r}`,i]));this.adj=this.cells.map(c=>DIR.map(([q,r])=>this.index.get(`${c.q+q},${c.r+r}`)).filter(i=>i!==undefined));
 this.say('Sector estéril. Siembra Hifas y Cianobacterias alrededor del hormigón.');
 }
 phase(){return ['Génesis','Expansión','Reposo'][Math.floor(this.tick/20)%3]}
 metrics(){let alive=0,tox=0,l4=0;for(const c of this.cells){alive+=c.t>0;tox+=c.tox;l4+=c.t===8}return {coverage:alive/this.cells.length,purity:1-tox/this.cells.length,l4}}
 say(s){this.events.unshift({at:this.tick,text:s});this.events=this.events.slice(0,6)}
 cost(tool){return ({hypha:15,cyano:15,ether:35,purify:10}[tool]||0)*(2-this.metrics().purity)}
 act(i,tool){const c=this.cells[i];if(!c)return 'Selecciona una celda';const cost=this.cost(tool);if(this.ether+1e-7<cost)return 'Éter insuficiente: la biodiversidad regenera la reserva';if(['hypha','cyano'].includes(tool)&&(c.t||c.mat==='leak'||c.mat==='alloy'||(c.mat==='crystal'&&tool!=='hypha')))return 'Ese sustrato no admite esta siembra';
 this.ether-=cost;this.spent+=cost;this.totalSpent+=cost;this.actions++;
 if(tool==='hypha'||tool==='cyano'){c.t=tool==='hypha'?1:2;c.p=.8;c.e=Math.max(c.e,.2)}
 if(tool==='ether'){c.e=Math.min(1,c.e+.35);this.wind=1}
 if(tool==='purify'){c.tox=Math.max(0,c.tox-.3)}return null}
 step(){const old=this.cells;const next=old.map(c=>({...c,lock:Math.max(0,c.lock-1)}));const rest=this.phase()==='Reposo';let regen=0;
 for(let i=0;i<old.length;i++){let c=old[i],n=next[i],ns=this.adj[i].map(k=>old[k]);let bio=ns.reduce((a,c)=>a+c.p,0);let hy=ns.filter(c=>c.t===1).length+(c.t===1?1:0),cy=ns.filter(c=>c.t===2).length;let lev=level(c.t);
 n.tox=Math.max(0,c.tox-hy*.025*(rest?2:1));if(n.tox<.00001)n.tox=0;
 if(['concrete','crystal','soil'].includes(c.mat)){n.age=hy?c.age+1:0;if(n.age>=8){n.mat='soil';n.tox=0}}
 if(c.t){let lower=[0,.25,.45,.4,0][lev]+c.tox*.6;n.p=Math.max(0,Math.min(1,c.p+(bio<lower?-.055:bio>6?-.1:.045)));if(!n.p)n.t=0;
 if(lev===3){n.starve=old.some(k=>level(k.t)===2&&dist(c,k)<=4)?0:c.starve+1;if(n.starve>=3){n.t=0;n.p=0;n.tox=Math.min(1,n.tox+.4)}}
 let species=new Set(ns.filter(c=>c.t).map(c=>c.t));if(species.size>=2)regen+=.10;if(lev===3)regen+=.08;if(lev===4)regen+=.25;
 }else if(!rest&&c.tox<.3&&c.e>=.15&&c.mat==='soil'){let l1=ns.filter(c=>level(c.t)===1&&!c.lock);if(l1.length>=2&&l1.length<=3){n.t=l1.filter(c=>c.t===2).length>l1.length/2?2:1;n.p=.5}}
 if(c.t===3&&c.p>=.9){n.mature=c.mature+1;if(n.mature>=6){if(c.e>=.6)n.t=5;else if(ns.some(k=>k.mat==='alloy'||k.mat==='concrete')||(c.q-c.r)%2===0)n.t=4;else if((c.q+c.r)%3!==0&&ns.filter(k=>k.t===2).length>=1)n.t=5;}}
 if(c.e>=.9&&bio<1){n.over=c.over+1;if(n.over>=3){n.mat='crystal';n.t=0;n.p=0}}else n.over=0;
 }
 // Ruin effects and trophic support use a synchronous snapshot.
 for(let j=0;j<old.length;j++){const c=old[j],ns=this.adj[j].map(k=>old[k]);if(c.mat==='leak'&&!(ns.length===6&&ns.every(c=>c.t===1)))for(let i=0;i<old.length;i++){let d=dist(c,old[i]);if(d<=3){next[i].tox=Math.max(next[i].tox,.8*Math.exp(-.7*d));if(level(old[i].t)>=2){next[i].t=0;next[i].p=0}}}
 if(c.t===6)for(let i=0;i<old.length;i++)if(level(old[i].t)===2&&old[i].p<.4&&dist(c,old[i])<=4&&next[i].t)next[i].p=1;
 if(c.t===8)for(let i=0;i<old.length;i++)if(dist(c,old[i])<=7){next[i].fertile=true;next[i].tox=0;next[i].e=Math.min(1,next[i].e+.05)}
 if(c.mat==='alloy'&&ns.filter(c=>c.t===1).length>=3)for(let i of this.adj[j])next[i].e=Math.min(1,next[i].e+.05);
 }
 const reserved=new Set();
 for(let i=0;i<old.length&&!rest;i++){const c=old[i],n=next[i],ni=this.adj[i],ns=ni.map(k=>old[k]);if(c.lock||reserved.has(i))continue;let target=0;
 if(level(c.t)<2&&(c.mat==='concrete'||(c.mat==='soil'&&c.age>=8))&&c.tox<.2&&ns.filter(c=>c.t===1&&!c.lock).length+(c.t===1?1:0)>=2&&ns.filter(c=>c.t===2&&!c.lock).length+(c.t===2?1:0)>=2)target=3;
 if(level(c.t)===2&&c.tox===0&&this.wind){const ring=old.filter(k=>dist(c,k)<=2).map(k=>k.t);if(ring.filter(t=>t===4||t===5).length>=3&&ring.includes(4)&&ring.includes(5))target=6;}
 if(c.t===3&&c.p>=.9&&c.tox===0&&ns.filter(c=>c.t===4).length>=2&&ns.filter(c=>c.t===1).length>=2)target=7;
 if(level(c.t)===3){let area=old.filter(k=>dist(c,k)<=2);let valid=area.filter(k=>k.t).length>=12&&area.every(k=>k.tox===0)&&area.some(k=>k.t===6)&&area.some(k=>k.t===7)&&area.some(k=>k.t===3&&k.p>=.999);n.mature=valid?c.mature+1:0;if(n.mature>=30)target=8;}
 if(target&&!ni.some(k=>reserved.has(k))){n.t=target;n.p=1;n.tox=0;n.mat='soil';n.mature=0;for(let k of ni){next[k].lock=3;reserved.add(k)}reserved.add(i);const l=level(target);if(l>this.maxLevel){this.maxLevel=l;this.say(`Simbiosis L${l}: ${names[target]} emergente.`)}}
 }
 for(const c of next)if(c.fertile){c.tox=0;if(c.mat!=='alloy')c.mat='soil'}
 this.cells=next;this.ether=Math.min(200,this.ether+regen);this.tick++;
 const m=this.metrics();const valid=m.coverage>=.85&&m.purity>=.99&&m.l4>=5&&this.spent===0&&regen>=0;this.stable=valid?this.stable+1:0;this.won=this.stable>=50;this.spent=0;this.wind=0;return this.won;
 }
 validate(){return this.cells.every(c=>Number.isFinite(c.p)&&c.p>=0&&c.p<=1&&c.tox>=0&&c.tox<=1&&c.e>=0&&c.e<=1&&(!c.t||c.p>0))&&this.ether>=0&&this.ether<=200}
}
