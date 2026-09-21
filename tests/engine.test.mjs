import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,step,presets,train,rollout} from '../dist/engine.mjs';
test('pickup-drop can earn proxy reward without disposing of trash',()=>{
 let s=initial('pickup');s.x=2;s.y=3;
 const a=step('pickup',s,4,presets.pickup.bad),b=step('pickup',a.state,4,presets.pickup.bad);
 assert.ok(a.reward+b.reward>0);assert.equal(b.state.item,23);assert.equal(b.state.done,false);
});
test('disposal is terminal and cannot be rewarded twice',()=>{
 let s={...initial('pickup'),x:5,y:1,item:-1};
 const a=step('pickup',s,4,presets.pickup.good);
 assert.equal(a.state.done,true);assert.equal(a.state.item,-2);assert.equal(step('pickup',a.state,4,presets.pickup.good).reward,0);
});
test('hidden rubbish is distinct from disposed rubbish',()=>{
 const a=step('hide',{...initial('hide'),x:3,y:3,item:-1},4,presets.hide.bad);
 assert.equal(a.state.item,-3);assert.equal(a.state.done,true);
});
test('collision penalty changes reward but not recorded damage',()=>{
 const s={...initial('delivery'),x:2,y:2};
 const a=step('delivery',s,1,presets.delivery.bad),b=step('delivery',s,1,presets.delivery.good);
 assert.equal(a.state.broken,true);assert.equal(b.state.broken,true);assert.ok(b.reward<a.reward);
});
test('learned baseline and repaired policies exhibit the intended contrast across seeds',()=>{
 for(const seed of [7,29,103])for(const task of ['pickup','delivery','hide']){
  const bad=rollout(task,train(task,presets[task].bad,seed).q,presets[task].bad);
  const good=rollout(task,train(task,presets[task].good,seed).q,presets[task].good);
  if(task==='pickup'){assert.ok(bad.picks>3);assert.equal(bad.final.item!==-2,true);assert.equal(good.final.item,-2);}
  if(task==='delivery'){assert.equal(bad.final.broken,true);assert.equal(good.final.broken,false);assert.equal(good.final.done,true);}
  if(task==='hide'){assert.equal(bad.final.item,-3);assert.equal(good.final.item,-2);}
 }
});
