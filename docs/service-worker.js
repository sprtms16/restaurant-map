if(!self.define){let e,r={};const n=(n,s)=>(n=new URL(n+".js",s).href,r[n]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=r,document.head.appendChild(e)}else e=n,importScripts(n),r()})).then((()=>{let e=r[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,t)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(r[a])return;let i={};const o=e=>n(e,a),l={module:{uri:a},exports:i,require:o};r[a]=Promise.all(s.map((e=>l[e]||o(e)))).then((e=>(t(...e),i)))}}define(["./workbox-d169e1d7"],(function(e){"use strict";e.setCacheNameDetails({prefix:"restaurant-map"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/restaurant-map/css/app.f480a34b.css",revision:null},{url:"/restaurant-map/css/chunk-vendors.dc292880.css",revision:null},{url:"/restaurant-map/fonts/materialdesignicons-webfont.21f691f0.ttf",revision:null},{url:"/restaurant-map/fonts/materialdesignicons-webfont.54b0f60d.woff2",revision:null},{url:"/restaurant-map/fonts/materialdesignicons-webfont.5d875350.eot",revision:null},{url:"/restaurant-map/fonts/materialdesignicons-webfont.d671cbf6.woff",revision:null},{url:"/restaurant-map/index.html",revision:"9091bff1dfe9f0ce67fd3512d149d070"},{url:"/restaurant-map/js/app.68bae087.js",revision:null},{url:"/restaurant-map/js/chunk-vendors.53e005e3.js",revision:null},{url:"/restaurant-map/js/webfontloader.1d5f5fa5.js",revision:null},{url:"/restaurant-map/manifest.json",revision:"67abee1a7ed83dd82357486cf15a21f1"},{url:"/restaurant-map/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map
