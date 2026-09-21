const X=49,Y=135,TW=106,TH=78;
const center=(x,y)=>[X+(x+.5)*TW,Y+(y+.5)*TH];
function round(g,x,y,w,h,r,fill){g.fillStyle=fill;g.beginPath();g.roundRect(x,y,w,h,r);g.fill();}
function paper(g,x,y){g.save();g.translate(x,y);g.rotate(-.15);round(g,-12,-10,25,22,3,'#faf8ee');g.strokeStyle='#b3b7a5';g.lineWidth=2;g.beginPath();g.moveTo(-6,-4);g.lineTo(5,-2);g.lineTo(-2,4);g.lineTo(8,7);g.stroke();g.restore();}
function plant(g,x,y,broken){if(broken){g.fillStyle='#c17d5b';for(const [dx,dy] of [[-13,3],[8,-2],[0,13]]){g.beginPath();g.moveTo(x+dx,y+dy);g.lineTo(x+dx+13,y+dy+3);g.lineTo(x+dx+5,y+dy+10);g.fill();}g.fillStyle='#657c50';g.beginPath();g.ellipse(x+4,y-8,21,6,-.4,0,Math.PI*2);g.fill();return;}
 round(g,x-14,y-6,28,26,6,'#b98669');g.strokeStyle='#6c8155';g.lineWidth=4;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-34);g.stroke();g.fillStyle='#829868';for(const [dx,dy,rot]of [[-10,-25,-.7],[10,-35,.7],[-8,-43,-.5]]){g.beginPath();g.ellipse(x+dx,y+dy,13,7,rot,0,Math.PI*2);g.fill();}}
export function drawRoom(canvas,task,frame,previous,blend=1,trail=[],scene=null){const g=canvas.getContext('2d'),s=frame.state;g.clearRect(0,0,840,600);g.fillStyle='#e5e8dc';g.fillRect(0,0,840,600);
 round(g,39,113,762,429,16,'#c3cbb7');round(g,39,103,762,429,16,'#f0efe5');
 g.fillStyle='#d5dccb';g.beginPath();g.moveTo(39,103);g.lineTo(70,62);g.lineTo(770,62);g.lineTo(801,103);g.fill();
 round(g,79,35,185,49,5,'#b9c5ad');round(g,85,41,173,36,3,'#e8eede');g.strokeStyle='#bec9b0';g.lineWidth=3;g.beginPath();g.moveTo(170,42);g.lineTo(170,76);g.stroke();
 g.font='11px monospace';g.fillStyle='#849273';g.fillText('R-003 / LEARNING TO WORK',316,84);plant(g,741,95,false);
 for(let y=0;y<5;y++)for(let x=0;x<7;x++){g.fillStyle=(x+y)%2?'#e9eadf':'#e4e7da';g.fillRect(X+x*TW+1,Y+y*TH+1,TW-2,TH-2);}
 g.font='10px monospace';g.fillStyle='#a3ad96';for(let x=0;x<7;x++)g.fillText(String(x+1),X+x*TW+TW/2-3,124);
 if(scene){let plantIndex=0;scene.cells.forEach((type,i)=>{const [x,y]=center(i%7,Math.floor(i/7));if(type==='plant'){plant(g,x,y,!!(s.broken&(1<<plantIndex++)));return;}const colors={wall:'#8a9482',bin:'#687e64',rug:'#bfcbac',goal:'#d5dbc8',pad:'#efd095'};if(colors[type]){round(g,x-39,y-28,78,56,7,colors[type]);g.fillStyle=type==='bin'?'#f4f5df':'#56634c';g.font='15px sans-serif';g.textAlign='center';g.fillText({wall:'墙壁',bin:'垃圾桶',rug:'地毯',goal:'收件点',pad:'＋ 奖励格'}[type],x,y+5);g.textAlign='left';}});}else{
 if(task==='hide'){const [rx,ry]=center(3,3);round(g,rx-46,ry-30,92,60,6,'#bfcbac');g.strokeStyle='#9eae86';g.lineWidth=2;g.strokeRect(rx-38,ry-23,76,46);if(s.item===-3){g.fillStyle='#99a680';g.beginPath();g.ellipse(rx,ry,16,7,0,0,Math.PI*2);g.fill();}g.fillStyle='#657554';g.font='11px sans-serif';g.fillText('地毯',rx-12,ry+23);}
 const [bx,by]=center(5,task==='delivery'?2:1);
 if(task==='delivery'){round(g,bx-33,by-27,66,54,6,'#d5dbc8');g.setLineDash([4,4]);g.strokeStyle='#81916a';g.strokeRect(bx-31,by-25,62,50);g.setLineDash([]);g.font='12px sans-serif';g.fillStyle='#657554';g.fillText('收件处',bx-18,by+5);const [px,py]=center(3,2);plant(g,px,py,s.broken);}else{round(g,bx-21,by-24,42,50,7,'#687e64');round(g,bx-26,by-29,52,9,4,'#92a48b');g.fillStyle='#c3cfba';g.font='22px sans-serif';g.fillText('↻',bx-10,by+9);g.font='11px sans-serif';g.fillStyle='#67745b';g.fillText('垃圾桶',bx-18,by+42);}
 }
 if(trail.length>1){g.strokeStyle='#d79b7b';g.globalAlpha=.42;g.lineWidth=3;g.setLineDash([3,7]);g.beginPath();trail.forEach((f,i)=>{const [x,y]=center(f.state.x,f.state.y);if(i===0)g.moveTo(x,y);else g.lineTo(x,y);});g.stroke();g.setLineDash([]);g.globalAlpha=1;}
 if(s.item>=0){const [px,py]=center(s.item%7,Math.floor(s.item/7));paper(g,px,py);}
 const prev=previous?.state||s,rx=prev.x+(s.x-prev.x)*blend,ry=prev.y+(s.y-prev.y)*blend,[cx,cy]=center(rx,ry);
 g.fillStyle='#73846435';g.beginPath();g.ellipse(cx,cy+23,32,10,0,0,Math.PI*2);g.fill();
 round(g,cx-31,cy-10,9,25,4,'#7c8971');round(g,cx+22,cy-10,9,25,4,'#7c8971');round(g,cx-25,cy-26,50,49,15,'#c2cf85');round(g,cx-22,cy-30,44,45,13,'#e0e9a9');round(g,cx-17,cy-18,34,21,8,'#34483c');
 g.fillStyle='#eff6ca';for(const dx of [-8,8]){g.beginPath();g.arc(cx+dx,cy-8,3.5,0,Math.PI*2);g.fill();}g.strokeStyle='#859665';g.lineWidth=3;g.beginPath();g.moveTo(cx,cy-29);g.lineTo(cx,cy-40);g.stroke();g.fillStyle='#dc6748';g.beginPath();g.arc(cx,cy-42,4,0,Math.PI*2);g.fill();
 if(s.item===-1){if(task==='delivery'){round(g,cx+12,cy+8,26,22,3,'#c79461');g.fillStyle='#efce93';g.fillRect(cx+22,cy+8,6,22);}else paper(g,cx+24,cy+17);}
 g.font='10px monospace';g.fillStyle='#98a58d';g.fillText('SIMULATED OFFICE  /  TABULAR Q-LEARNING',50,571);
}
export function drawCurve(canvas,values){const g=canvas.getContext('2d'),w=canvas.width,h=canvas.height;g.clearRect(0,0,w,h);g.strokeStyle='#d7decb';g.lineWidth=1;for(let y=30;y<h;y+=40){g.beginPath();g.moveTo(32,y);g.lineTo(w-8,y);g.stroke();}if(!values.length)return;const min=Math.min(0,...values),max=Math.max(1,...values);g.fillStyle='#879276';g.font='16px monospace';g.fillText(max.toFixed(0),0,20);g.fillText(min.toFixed(0),0,h-8);g.strokeStyle='#dc6748';g.lineWidth=3;g.beginPath();values.forEach((v,i)=>{const x=35+i/(Math.max(1,values.length-1))*(w-45),y=15+(max-v)/(max-min)*(h-35);if(i===0)g.moveTo(x,y);else g.lineTo(x,y);});g.stroke();}
