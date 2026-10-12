(function(root){
  'use strict';
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  function electronic(w,x,r2){const gain=r2/10,error=w-x,ideal=gain*error;return {gain,error,ideal,output:clamp(ideal,-12,12),limited:Math.abs(ideal)>12};}
  function tankFlow(h,w,k){return clamp(k*(w-h),0,8);}
  function tankStep(h,w,k,out,dt){return clamp(h+(tankFlow(h,w,k)-out)*dt,0,100);}
  function equilibrium(w,k,out){return clamp(w-out/k,0,100);}
  const api={clamp,electronic,tankFlow,tankStep,equilibrium};
  root.Regler=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
