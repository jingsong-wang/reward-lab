export const labels={pick:'捡起物件',drop:'放下物件',bin:'投入垃圾桶',rug:'藏进地毯',goal:'交到收件点',plant:'撞碎花盆',pad:'进入奖励格',step:'每一步'};
export const tiles={empty:'空地',wall:'墙壁',bin:'垃圾桶',rug:'地毯',goal:'收件点',plant:'花盆',pad:'奖励格'};
export const HORIZON=80,EPISODES=6000;
export function example(){const cells=Array(35).fill('empty');cells[12]='bin';cells[24]='rug';cells[19]='goal';cells[17]='plant';cells[8]='pad';return {version:1,start:22,item:23,cells,rewards:{pick:3,drop:0,bin:8,rug:0,goal:6,plant:-4,pad:0,step:-.1},seed:7};}
export function validate(raw){if(!raw||raw.version!==1||!Array.isArray(raw.cells)||raw.cells.length!==35||raw.cells.some(t=>typeof t!=='string'||!Object.hasOwn(tiles,t)))throw Error('配置需要 35 个合法格子及 version: 1。');
 for(const k of ['start','item'])if(!Number.isInteger(raw[k])||raw[k]<0||raw[k]>34||raw.cells[raw[k]]!=='empty')throw Error('机器人和物件必须放在空地上。');
 if(raw.cells.filter(t=>t==='plant').length>3)throw Error('最多放置 3 个花盆，以控制本地训练开销。');
 if(!Number.isInteger(raw.seed)||raw.seed<0||raw.seed>999999)throw Error('种子需要是 0–999999 的整数。');
 const rewards={};for(const k of Object.keys(labels)){const n=raw.rewards?.[k];if(typeof n!=='number'||!Number.isFinite(n)||Math.abs(n)>20)throw Error('各项分数需要在 −20 到 20 之间。');rewards[k]=n;}
 return {version:1,start:raw.start,item:raw.item,cells:[...raw.cells],rewards,seed:raw.seed};}
export const initial=c=>({x:c.start%7,y:Math.floor(c.start/7),item:c.item,broken:0});
const key=s=>`${s.x},${s.y},${s.item},${s.broken}`;
export function step(c,s,a){const n={...s},events=[];let reward=c.rewards.step;
 if(a<4){const [dx,dy]=[[0,-1],[1,0],[0,1],[-1,0]][a],x=s.x+dx,y=s.y+dy,p=y*7+x;
  if(x<0||x>6||y<0||y>4||c.cells[p]==='wall')events.push('wall');else{n.x=x;n.y=y;const t=c.cells[p];if(t==='pad'){reward+=c.rewards.pad;events.push('pad');}if(t==='plant'){const bit=1<<c.cells.slice(0,p).filter(t=>t==='plant').length;if(!(n.broken&bit)){n.broken|=bit;reward+=c.rewards.plant;events.push('plant');}}}
 }else{const p=n.y*7+n.x,t=c.cells[p];if(n.item===p){n.item=-1;reward+=c.rewards.pick;events.push('pick');}else if(n.item===-1){if(['bin','rug','goal'].includes(t)){n.item={bin:-2,rug:-3,goal:-4}[t];reward+=c.rewards[t];events.push(t);}else{n.item=p;reward+=c.rewards.drop;events.push('drop');}}else events.push('wait');}
 return {state:n,reward,events,event:events.map(e=>labels[e]||({wall:'碰到墙壁',wait:'原地检查'}[e])).join(' · ')||'移动'};}
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function best(v,r){const m=Math.max(...v),a=[];v.forEach((n,i)=>{if(n===m)a.push(i);});return a[r?Math.floor(r()*a.length):0];}
export function train(raw,progress=()=>{}){const c=validate(raw),q=Object.create(null),random=rng(c.seed),curve=[];const values=s=>q[key(s)]||(q[key(s)]=[0,0,0,0,0]);let sum=0;
 for(let ep=0;ep<EPISODES;ep++){let s=initial(c);const epsilon=.08+.85*(1-ep/EPISODES)**2;for(let t=0;t<HORIZON;t++){const v=values(s),a=random()<epsilon?Math.floor(random()*5):best(v,random),o=step(c,s,a);v[a]+=.18*(o.reward+.96*Math.max(...values(o.state))-v[a]);s=o.state;sum+=o.reward;}if((ep+1)%200===0){curve.push(sum/200);sum=0;progress({episode:ep+1,curve:[...curve]});}}
 let s=initial(c),total=0;const counts=Object.fromEntries(Object.keys(labels).map(k=>[k,0])),frames=[{state:s,total:0,reward:0,event:'开始自由探索'}];for(let i=0;i<HORIZON;i++){const action=best(q[key(s)]||[0,0,0,0,0]),o=step(c,s,action);s=o.state;total+=o.reward;counts.step++;o.events.forEach(e=>{if(e in counts)counts[e]++;});frames.push({...o,total,action});}return {frames,counts,curve,states:Object.keys(q).length};}
