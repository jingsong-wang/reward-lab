export const W=7,H=5,HORIZON=80,EPISODES=6000;
export const presets={pickup:{bad:{pick:3,finish:8,hide:0,damage:0,cost:.08},good:{pick:0,finish:12,hide:0,damage:0,cost:.08}},delivery:{bad:{pick:0,finish:12,hide:0,damage:0,cost:.5},good:{pick:0,finish:12,hide:0,damage:8,cost:.5}},hide:{bad:{pick:0,finish:8,hide:8,damage:0,cost:.2},good:{pick:0,finish:12,hide:0,damage:0,cost:.2}}};
export const initial=task=>({x:1,y:task==='delivery'?2:3,item:task==='delivery'?-1:23,broken:false,done:false});
export const key=s=>`${s.x},${s.y},${s.item},${+s.broken}`;
export function step(task,s,action,r){
 if(s.done)return {state:{...s},reward:0,event:'结束'};
 const n={...s};let reward=-r.cost,event='移动';
 if(action<4){const [dx,dy]=[[0,-1],[1,0],[0,1],[-1,0]][action];n.x=Math.max(0,Math.min(W-1,s.x+dx));n.y=Math.max(0,Math.min(H-1,s.y+dy));if(n.x===s.x&&n.y===s.y)event='碰到墙壁';
  if(task==='delivery'&&n.x===3&&n.y===2&&!n.broken){n.broken=true;reward-=r.damage;event='撞碎花盆';}
 }else if(task!=='delivery'){
  if(n.item===n.y*W+n.x){n.item=-1;reward+=r.pick;event='捡起垃圾';}
  else if(n.item===-1){
   if(n.x===5&&n.y===1){n.item=-2;n.done=true;reward+=r.finish;event='垃圾入桶';}
   else if(task==='hide'&&n.x===3&&n.y===3){n.item=-3;n.done=true;reward+=r.hide;event='藏进地毯';}
   else {n.item=n.y*W+n.x;event='放下垃圾';}
  }else event='原地检查';
 }else event='原地等待';
 if(task==='delivery'&&n.x===5&&n.y===2){n.done=true;n.item=-2;reward+=r.finish;event=n.broken?'送达，但花盆碎了':'完好送达';}
 return {state:n,reward,event};
}
const random=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
function values(q,s){const k=key(s);return q[k]||(q[k]=[0,0,0,0,0]);}
function best(v,rng){const m=Math.max(...v),ties=[];v.forEach((x,i)=>{if(x===m)ties.push(i);});return ties[rng?Math.floor(rng()*ties.length):0];}
export function train(task,r,seed=7,progress=()=>{}){
 const q=Object.create(null),rng=random(seed),curve=[];let sum=0;
 for(let ep=0;ep<EPISODES;ep++){
  let s=initial(task),total=0;const epsilon=.08+.85*(1-ep/EPISODES)**2;
  for(let t=0;t<HORIZON&&!s.done;t++){
   const v=values(q,s),a=rng()<epsilon?Math.floor(rng()*5):best(v,rng),out=step(task,s,a,r);
   const target=out.reward+(out.state.done?0:.96*Math.max(...values(q,out.state)));
   v[a]+=.18*(target-v[a]);s=out.state;total+=out.reward;
  }
  sum+=total;if((ep+1)%200===0){curve.push(sum/200);sum=0;progress({episode:ep+1,total:EPISODES,curve:[...curve]});}
 }
 return {q,curve,seed,episodes:EPISODES};
}
export function rollout(task,q,r){let s=initial(task),total=0,picks=0;const frames=[{state:{...s},reward:0,total:0,event:'开始上班'}];
 for(let t=0;t<HORIZON&&!s.done;t++){const action=best(q[key(s)]||[0,0,0,0,0]);const out=step(task,s,action,r);s=out.state;total+=out.reward;if(out.event==='捡起垃圾')picks++;frames.push({...out,total,action});}
 return {frames,total,picks,final:s};
}
