import{r as o}from"./index-DInWseWa.js";function f(e,t=400){const[s,u]=o.useState(()=>e);return o.useEffect(()=>{let r=!0;const c=setTimeout(()=>{r&&u(e)},t);return()=>{r=!1,clearTimeout(c)}},[e,t]),s}export{f as u};
//# sourceMappingURL=useDebounce-BImzfZHw.js.map
