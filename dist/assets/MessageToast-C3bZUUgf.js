import{j as e,r as l}from"./index-D0jo8c7A.js";const c=({className:t="w-6 h-6"})=>e.jsxs("svg",{className:t,viewBox:"0 0 512 512",xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0,children:[e.jsx("circle",{cx:"256",cy:"256",r:"246",fill:"#2E9E37",stroke:"#A5D6A7",strokeWidth:"20"}),e.jsx("path",{fill:"white",d:"M216.3 334.7L130.6 249c-7.8-7.8-7.8-20.5 0-28.3 7.8-7.8 20.5-7.8 28.3 0l57.4 57.4 137.8-137.8c7.8-7.8 20.5-7.8 28.3 0 7.8 7.8 7.8 20.5 0 28.3L244.6 334.7c-3.9 3.9-9 5.9-14.2 5.9s-10.3-2-14.1-5.9z"})]});function d({message:t,onClose:r,duration:s=3e3}){if(l.useEffect(()=>{if(t&&s){const i=setTimeout(()=>{r?.()},s);return()=>clearTimeout(i)}},[t,s,r]),!t)return null;const{type:n="info",text:o=""}=t,a={success:"bg-green-100 text-green-800 border-green-300",error:"bg-red-100 text-red-800 border-red-300",info:"bg-blue-100 text-blue-800 border-blue-300"};return e.jsxs("div",{className:"fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-slideDownUp",children:[e.jsxs("div",{className:`flex items-center justify-between px-6 py-3 border rounded-lg shadow-md ${a[n]}`,children:[n==="success"&&e.jsx(c,{className:"w-5 h-5 text-green-600 mr-3",strokeWidth:2}),e.jsx("span",{children:o}),e.jsx("button",{onClick:r,className:"ml-4 text-gray-600 hover:text-gray-900 font-bold",children:"×"})]}),e.jsx("style",{children:`
        @keyframes slideDownUp {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          60% {
            transform: translateY(15px);
            opacity: 1;
          }
          80% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-slideDownUp {
          animation: slideDownUp 0.6s ease-out forwards;
        }
      `})]})}export{d as M};
//# sourceMappingURL=MessageToast-C3bZUUgf.js.map
