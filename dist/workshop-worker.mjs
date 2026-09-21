import {train} from './workshop-engine.mjs';
self.onmessage=({data})=>{try{const run=train(data,p=>self.postMessage({type:'progress',...p}));self.postMessage({type:'done',run});}catch(e){self.postMessage({type:'error',message:e.message});}};
