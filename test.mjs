import assert from 'node:assert/strict';import{World,level}from './sim.js';import fs from 'node:fs';
let recipe=JSON.parse(fs.readFileSync(new URL('./legal-replay.json',import.meta.url))).actions;
let w=new World();for(let tick=0;tick<259;tick++){for(let[at,q,r,t]of recipe)if(at===tick)assert.equal(w.act(w.index.get(`${q},${r}`),t),null);w.step();assert(w.validate());if(tick<149)assert(!w.cells.some(c=>c.t===8));if(tick===258){assert(w.won);assert.equal(w.stable,50);assert(w.metrics().l4>=5);assert(w.metrics().coverage>=.85);assert(w.metrics().purity>=.99)}}
let empty=new World();for(let i=0;i<100;i++)empty.step();assert(empty.cells.every(c=>c.t===0));assert(!empty.won);
for(let seed=1;seed<=30;seed++){let v=new World(),s=seed;for(let t=0;t<200;t++){s=(s*1664525+1013904223)>>>0;if(t%3===0)v.act(s%v.cells.length,['hypha','cyano','ether','purify'][s%4]);v.step();assert(v.validate())}}
let fresh=new World(),before=fresh.ether;assert(fresh.act(fresh.cells.findIndex(c=>c.mat==='leak'),'hypha'));assert.equal(fresh.ether,before);assert.equal(fresh.act(fresh.index.get('0,0'),'hypha'),null);assert(fresh.ether<before);let after=fresh.ether;assert(fresh.act(fresh.index.get('0,0'),'cyano'));assert.equal(fresh.ether,after);
console.log('PASS: sterile start, legal full replay, 50-cycle victory, invalid action costs, 6000 randomized pulses.');
