import test from 'node:test';
import assert from 'node:assert/strict';
import {example,validate,initial,step,train} from '../dist/workshop-engine.mjs';
test('scene validation bounds state size and imported rewards',()=>{const c=example();assert.deepEqual(validate(c),c);assert.throws(()=>validate({...c,seed:NaN}));assert.throws(()=>validate({...c,rewards:{...c.rewards,pick:Infinity}}));assert.throws(()=>validate({...c,cells:Array(35).fill('plant')}));assert.throws(()=>validate({...c,start:12}));});
test('disposal does not end workshop and cannot repeatedly pay',()=>{const c=example(),s={x:5,y:1,item:-1,broken:0};const o=step(c,s,4);assert.equal(o.state.item,-2);assert.equal(o.reward,7.9);assert.equal(step(c,o.state,4).reward,-.1);assert.equal(step(c,o.state,1).state.x,6);});
test('walls block, pads pay on entry, plants pay once',()=>{const c=example();c.cells[1]='wall';let s={x:0,y:0,item:23,broken:0};assert.equal(step(c,s,1).state.x,0);c.cells[1]='pad';c.rewards.pad=2;s=step(c,s,1).state;assert.equal(step(c,{...s,x:0},1).reward,1.9);assert.equal(step(c,s,4).reward,-.1);c.cells[1]='plant';const o=step(c,{...s,x:0},1);assert.equal(o.reward,-4.1);assert.equal(step(c,{...o.state,x:0},1).reward,-.1);});
test('seeded learning yields actual repeated pickup behavior for 80 steps',()=>{const c=example(),a=train(c),b=train(c);assert.deepEqual(a,b);assert.equal(a.frames.length,81);assert.ok(a.counts.pick>10);assert.equal(a.counts.bin,0);assert.ok(a.frames.every(f=>Number.isFinite(f.total)));});

test('import rejects coercible non-string tile types',()=>{const c=example();c.cells[0]=['wall'];assert.throws(()=>validate(c));});
