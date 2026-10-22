importScripts('boundaries.js','generator-core.js');
let currentGeneration=null;
self.onmessage=async event=>{let msg=event.data;if(msg.action==='cancel'){if(currentGeneration)currentGeneration.cancelled=true;return}if(msg.action!=='start'||currentGeneration)return;let job={cancelled:false};currentGeneration=job;try{let result=await generationRun(msg.config,job,event=>self.postMessage(event));self.postMessage({kind:'done',...result,accepted:undefined})}catch(e){self.postMessage({kind:'error',message:e.message})}finally{currentGeneration=null}};
