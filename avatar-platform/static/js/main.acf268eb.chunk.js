(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{138:function(e,t,a){e.exports=a(362)},166:function(e,t,a){},168:function(e,t,a){},169:function(e,t,a){},170:function(e,t,a){},171:function(e,t,a){},179:function(e,t,a){},180:function(e,t,a){},191:function(e,t,a){},194:function(e,t,a){},195:function(e,t,a){},360:function(e,t,a){},361:function(e,t,a){},362:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),c=a(37),o=a.n(c),i=a(5),l=a(30),u=a(6),s=a(26),m=a(76),f=document.createElement("canvas"),d=f.getContext("2d"),p=600,g=600;f.width=p,f.height=g;var E=function(e,t){return new Promise(function(a,n){var r=document.createElement("img");r.src=e,r.onload=function(){d.clearRect(0,0,f.width,f.height),d.drawImage(r,0,0,f.width,f.height),function(e,t){d.imageSmoothingQuality="medium",d.globalCompositeOperation="source-atop",d.fillStyle=e,d.fillRect(0,0,f.width,f.height),d.globalCompositeOperation="multiply"}(t),d.drawImage(r,0,0,f.width,f.height),a(f.toDataURL("image/png",.7))}})},v=a(77),h=a.n(v),b="http://185.181.8.53:3001/";console.log(b);var O=h.a.create({headers:{"Content-Type":"application/json"}});var S=a(40),A=a(125),_=Object(s.a)({profile:null,partsDataOriginal:{},partsData:{},PARTS:[],PARTS_WITH_COLORS:[],partSprites:[],current:{},previewIsLoading:!1,facePartsAreLoading:!0,savingIsLoading:!1,sets:[],hiddenParts:[],conflicts:{}},"current",{});var y=function(e){return function(t,a){var n=a().current;return t({type:"SAVE_IMAGE_REQUEST"}),new Promise(function(a,r){(function(e,t){return h()({url:b+"save-image/"+e,method:"GET",responseType:"blob",params:{data:t}})})(e,n).then(function(e){Object(A.saveAs)(new Blob([e.data]),"image"+Math.floor(1e5*Math.random()+1)+".png"),t({type:"SAVE_IMAGE_SUCCESS",payload:e}),a(e)}).catch(function(e){t({type:"SAVE_IMAGE_FAILURE",payload:e}),r(e)})})}},C=function(e,t){return function(a,n){var r=[];n().partsDataOriginal.forEach(function(t,a){t.inheritColorFrom===n().partsDataOriginal[e]._id&&r.push(a)}),n().partsDataOriginal[e].images.forEach(function(n){E(n.value,t).then(function(r){a({type:"SET_COLOR",payload:{_id:n._id,part:e,value:r,color:t}})})}),r.forEach(function(e){n().partsDataOriginal[e].images.forEach(function(n){E(n.value,t).then(function(r){a({type:"SET_COLOR",payload:{_id:n._id,part:e,value:r,color:t}})})})})}},j=function(){return function(e,t){for(var a in t().partsData)if(t().PARTS_WITH_COLORS.includes(a)&&t().partsData[a].images)for(var n=0;n<t().partsData[a].images.length;n++)t().partsData[a].images[n].isLoading=!0;t().PARTS_WITH_COLORS.forEach(function(t){var a=Math.floor(255*Math.random()).toString(16).padStart(2,"0"),n=Math.floor(255*Math.random()).toString(16).padStart(2,"0"),r=Math.floor(255*Math.random()).toString(16).padStart(2,"0");e(C(t,"#"+a+n+r))});var r=[].concat(t().PARTS).sort(function(){return Math.random()-.5}),c={};r.forEach(function(a){if(t().partsData[a].images.length){if(Object.values(c).reduce(function(e,t){return e.concat(t)},[]).includes(t().partsData[a]._id))return e({type:"SELECT_PART",payload:{_id:"transparent",part:a,randomized:!0}});var n=Math.floor(Math.random()*(t().partsData[a].images.length-1))+1,r=t().partsData[a].images[n]._id;e({type:"SELECT_PART",payload:{_id:r,part:a,randomized:!0}}),c[a]=t().conflicts[t().partsData[a]._id]}})}},L=Object(m.a)(function(e){return e.partsData},function(e){return e.current},function(e,t){for(var a=Object.entries(e),n=[],r=function(e){var r=a[e][0];if(!t[r])return"continue";var c=a[e][1].images.find(function(e){return e._id==t[r]._id});n.push({zIndex:a[e][1].zIndex,value:c})},c=0;c<a.length;c++)r(c);return n=(n=n.sort(function(e,t){return e.zIndex-t.zIndex})).map(function(e){return e.value&&e.value.value})}),w=Object(m.a)(function(e){return e.partsData},function(e){var t=!1;if(!e)return!0;for(var a in e)for(var n=0;n<e[a].images.length;n++)e[a].images[n].isLoading&&(t=!0);return t}),I=function(e,t){return function(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e,n=arguments.length>1?arguments[1]:void 0;return t.hasOwnProperty(n.type)?t[n.type](a,n):a}}(_,{SELECT_PART:function(e,t){var a=t.payload,n=a._id,r=a.part,c=a.randomized,o=Object.assign({},e.current),i=e.partsData[r]._id;return!c&&e.conflicts[i]&&e.conflicts[i].forEach(function(t){for(var a in e.partsData)e.partsData[a]._id===t&&o[a]&&(o[a]._id="transparent")}),Object(u.a)({},e,{current:Object(u.a)({},o,Object(s.a)({},r,Object(u.a)({},e.current[r],{_id:n})))})},SET_COLOR:function(e,t){var a=t.payload,n=a._id,r=a.part,c=a.value,o=a.color,i=[].concat(e.partsData[r].images);return i.find(function(e){return e._id===n}).value=c,i.find(function(e){return e._id===n}).isLoading=!1,Object(u.a)({},e,{partsData:Object(u.a)({},e.partsData,Object(s.a)({},r,Object(u.a)({},e.partsData[r],{images:i}))),current:Object(u.a)({},e.current,Object(s.a)({},r,Object(u.a)({},e.current[r],{color:o})))})},LOGIN_SUCCESS:function(e,t){var a=t.payload;return Object(u.a)({},e,{profile:a.data.profile})},SET_PREVIEW_IS_LOADING:function(e,t){var a=t.value;return Object(u.a)({},e,{previewIsLoading:a})},GET_SETS_SUCCESS:function(e,t){var a=t.payload;return Object(u.a)({},e,{sets:a.data})},LOAD_FACE_PARTS_REQUEST:function(e,t){t.payload;return Object(u.a)({},e,{current:{},facePartsAreLoading:!0})},LOAD_FACE_PARTS_SUCCESS:function(e,t){var a=t.payload,n=Object(S.cloneDeep)(a.data),r={};n.forEach(function(e){e.images.unshift({_id:"transparent",value:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="}),e.images.forEach(function(e){e.isLoading=!1}),e.conflictsWith.length&&(r[e._id]?r[e._id].concat(e.conflictsWith):r[e._id]=e.conflictsWith,r[e._id]=e.conflictsWith,e.conflictsWith.forEach(function(t){r[t]?r[t].push(e._id):r[t]=[e._id]}))});var c=Object(S.cloneDeep)(a.data).map(function(e){return function(e){var t=document.createElement("canvas"),a=t.getContext("2d");return t.width=e.length*p,t.height=g,new Promise(function(a){for(var r=[],c=0;c<e.length;c++)r.push(n(e[c],c*p,0));Promise.all(r).then(function(){a(t.toDataURL("image/png",1))})});function n(e,t,n){return new Promise(function(r){var c=document.createElement("img");c.src=e,c.onload=function(){a.drawImage(c,t,n,p,g),r()}})}}(e.images.map(function(e){return e.value}))});return Object(u.a)({},e,{conflicts:r,partsData:n,partsDataOriginal:Object(S.cloneDeep)(n),PARTS:Object.keys(a.data),PARTS_WITH_COLORS:Object.keys(Object(S.pickBy)(a.data,function(e){return e.colors&&e.colors.length})),sprites:c,facePartsAreLoading:!1})},SAVE_IMAGE_REQUEST:function(e){return Object(u.a)({},e,{savingIsLoading:!0})},SAVE_IMAGE_SUCCESS:function(e){return Object(u.a)({},e,{savingIsLoading:!1})}}),R=(a(166),a(126)),T=a(127),P=a(136),D=a(128),N=a(137),k=a(23),M=a(24);a(167),a(168),a(169),a(170);function U(e){var t=e.width,a=void 0===t?300:t,n=e.height,c=void 0===n?300:n;return r.a.createElement("div",{className:"spinner",style:{width:a,height:c}},"Loading...")}var x=a(14),F=a.n(x),G=a(25);a(171);var z=Object(i.b)(function(e){return{items:L(e),current:e.current,previewIsLoading:e.facePartsAreLoading||w(e)}})(function(e){var t=e.items,a=e.previewIsLoading;return e.setName,r.a.createElement("div",{className:F()("Preview",a&&"isLoading")},r.a.createElement("div",{className:"change-art"},r.a.createElement(k.b,{to:"../"},r.a.createElement("button",{className:"btn btn-info"},r.a.createElement(G.c,null),"\xa0 Change Art Set"))),r.a.createElement("div",{className:"images"},t.map(function(e,t){return r.a.createElement("div",{className:"img",style:{backgroundImage:"url("+e+")"},key:t,alt:""})})),r.a.createElement(U,null))}),W=a(31),B=(a(179),a(180),a(79)),Q=a.n(B);function V(e){return r.a.createElement(Q.a,{isOpen:e.isOpen,onRequestClose:e.closeModal,contentLabel:"Example Modal",className:"download-success-modal"},r.a.createElement("h4",null,"Great! Your download has been successful!"),r.a.createElement("img",{className:"modal-image",src:e.imgBase64}),r.a.createElement("h6",null,"If you want to download images in high quality, you can ",r.a.createElement("strong",null,"become premium")))}Q.a.setAppElement("#root");var H=Object(i.b)(function(e){return{savingIsLoading:e.savingIsLoading,previewIsLoading:e.facePartsAreLoading||w(e)}},function(e){return{randomizeFace:function(){return e(j())},saveImage:function(t){return e(y(t))}}})(function(e){var t=Object(n.useState)(!1),a=Object(W.a)(t,2),c=a[0],o=a[1],i=Object(n.useState)(null),l=Object(W.a)(i,2),u=l[0],s=l[1];return r.a.createElement("div",{className:"ButtonActions"},r.a.createElement("button",{className:"btn btn-primary btn-wide mb-2",onClick:e.randomizeFace,disabled:e.savingIsLoading||e.previewIsLoading},r.a.createElement(G.d,null),"\xa0 Random"),r.a.createElement("br",null),r.a.createElement("button",{className:"btn btn-primary btn-wide",onClick:function(){e.saveImage(e.setName).then(function(e){var t=new FileReader;t.readAsDataURL(e.data),t.onloadend=function(){var e=t.result;s(e),o(!0)}})},disabled:e.savingIsLoading||e.previewIsLoading},r.a.createElement(G.a,null),"\xa0 Download"),r.a.createElement(V,{isOpen:c,closeModal:function(){return o(!1)},imgBase64:u}))}),Y=(a(191),a(41));a(194);function q(e){var t=e.id,a=e.active,n=e.part,c=e.url,o=e.selectPart;return r.a.createElement("div",{className:F()("FacePartContainer",a&&"active"),onClick:function(){return o(t,n)}},r.a.createElement("img",{src:c,alt:""}))}a(195);var J=a(130);function K(){return(K=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}function $(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var X=r.a.createElement("g",null,r.a.createElement("g",null,r.a.createElement("path",{d:"M489.265,22.762C474.586,8.083,455.071,0,434.313,0s-40.273,8.083-54.951,22.762L221.761,180.361 c-9.158-4.089-20.268-2.402-27.783,5.111c-9.733,9.731-9.733,25.511,0,35.244l8.448,8.448L54.402,377.189 c-2.564,2.564-4.537,5.656-5.782,9.06l-15.674,42.847c-7.766,1.691-14.9,5.556-20.652,11.309 c-7.925,7.923-12.288,18.457-12.288,29.663c0,11.203,4.363,21.738,12.288,29.663c8.178,8.176,18.921,12.265,29.662,12.265 s21.484-4.089,29.662-12.265c0-0.002,0.002-0.002,0.002-0.003c5.752-5.754,9.618-12.886,11.309-20.65l42.847-15.674 c3.404-1.246,6.496-3.22,9.06-5.782l148.026-148.026l8.448,8.448c4.866,4.866,11.245,7.3,17.621,7.3 c6.377,0,12.757-2.434,17.621-7.3c7.515-7.515,9.201-18.625,5.111-27.783l157.601-157.599 C519.565,102.365,519.565,53.063,489.265,22.762z M41.957,477.967c-2.08-0.002-4.115-0.846-5.582-2.313 c-1.47-1.47-2.313-3.504-2.313-5.582s0.842-4.112,2.311-5.581l11.165,11.163C46.069,477.125,44.033,477.967,41.957,477.967z  M47.537,475.653l-11.163-11.165c1.539-1.538,3.559-2.308,5.579-2.308c2.022,0,4.044,0.771,5.584,2.309 c1.469,1.47,2.311,3.504,2.311,5.582S49.006,474.186,47.537,475.653z M103.481,418.489l-15.681,5.737l5.737-15.681 l144.133-144.133l9.944,9.944L103.481,418.489z M454.019,97.422L297.594,253.847l-39.414-39.414L414.607,58.008 c5.263-5.265,12.261-8.164,19.706-8.164c7.445,0,14.443,2.899,19.706,8.163C464.887,68.873,464.887,86.555,454.019,97.422z"}))),Z=r.a.createElement("g",null),ee=r.a.createElement("g",null),te=r.a.createElement("g",null),ae=r.a.createElement("g",null),ne=r.a.createElement("g",null),re=r.a.createElement("g",null),ce=r.a.createElement("g",null),oe=r.a.createElement("g",null),ie=r.a.createElement("g",null),le=r.a.createElement("g",null),ue=r.a.createElement("g",null),se=r.a.createElement("g",null),me=r.a.createElement("g",null),fe=r.a.createElement("g",null),de=r.a.createElement("g",null),pe=function(e){var t=e.svgRef,a=$(e,["svgRef"]);return r.a.createElement("svg",K({id:"Layer_1",x:"0px",y:"0px",viewBox:"0 0 511.997 511.997",style:{enableBackground:"new 0 0 511.997 511.997"},xmlSpace:"preserve",ref:t},a),X,Z,ee,te,ae,ne,re,ce,oe,ie,le,ue,se,me,fe,de)};r.a.forwardRef(function(e,t){return r.a.createElement(pe,K({svgRef:t},e))}),a.p;var ge=Object(i.b)(function(e){return{partsData:e.partsData,current:e.current}},function(e){return{changeColor:function(t,a){return e(C(t,a))}}})(function(e){var t=e.part,a=e.changeColor,c=e.partsData,o=e.current,i=Object(n.useState)(!1),l=Object(W.a)(i,2),u=l[0],s=l[1],m=Object(n.useState)(o[t]&&o[t].color||"#ffffff"),f=Object(W.a)(m,2),d=f[0],p=f[1],g=c[t].colors,E=function(){s(!1)};return Object(n.useEffect)(function(){return window.addEventListener("click",E,!1),function(){window.removeEventListener("click",E)}},[]),g&&g.length?r.a.createElement("div",{className:"ColorPicker",onClick:function(e){return e.stopPropagation()}},r.a.createElement("div",{className:"color color-pipette",onClick:function(){s(!u)},style:{backgroundColor:o[t]&&o[t].color||d}},r.a.createElement(G.b,null)),g.map(function(e){return r.a.createElement("div",{className:"color",style:{background:e},key:e,onClick:function(){return a(t,e)}})}),u&&r.a.createElement(J.ChromePicker,{className:"chromePicker",disableAlpha:!0,color:o[t]&&o[t].color||d,onChange:function(e){p(e.hex),a(t,e.hex)}})):null});var Ee=Object(i.b)(function(e){return{items:e.partsData,current:e.current}},function(e){return{changeColor:function(t,a){return e(C(t,a))},selectPart:function(t,a){return e({type:"SELECT_PART",payload:{_id:t,part:a}})}}})(function(e){var t=e.items,a=e.current,n=(e.changeColor,e.selectPart),c=e.part;return e.noColors,t&&t[c]&&t[c].images&&t[c].images.length?r.a.createElement("div",null,t[c].images.map(function(e){return r.a.createElement(q,{active:a&&a[c]&&a[c]._id===e._id,key:e._id,id:e._id,part:c,url:e.value,selectPart:n})}),r.a.createElement("br",null),!t[c].inheritColorFrom&&r.a.createElement(ge,{part:c})):"No items on this layer"});var ve=Object(i.b)(function(e){return{PARTS:e.PARTS,partsData:e.partsData}})(function(e){var t=e.PARTS,a=e.partsData;return t&&t.length?r.a.createElement("div",{className:"MainTabs"},r.a.createElement(Y.d,{defaultIndex:0},r.a.createElement(Y.b,null,t.map(function(e,t){return r.a.createElement(Y.a,{key:t},a[e].title)})),t.map(function(e,t){return r.a.createElement(Y.c,null,r.a.createElement(Ee,{key:t,part:e}))}))):r.a.createElement("div",null)});var he=Object(i.b)(null,{loadFaceParts:function(e){return function(t){t({type:"LOAD_FACE_PARTS_REQUEST"}),function(e){return O.get(b+"face-parts/"+e)}(e).then(function(e){t({type:"LOAD_FACE_PARTS_SUCCESS",payload:e}),setTimeout(function(){t(j())},10)}).catch(function(e){t({type:"LOAD_FACE_PARTS_FAILURE",payload:e})})}}})(function(e){return Object(n.useEffect)(function(){e.loadFaceParts(e.match.params.setName)},[]),r.a.createElement("div",{className:"AvatarPage"},r.a.createElement("aside",{className:"App-left-col"},r.a.createElement("div",{className:"left-col-container"},r.a.createElement(z,{setName:e.match.params.setName}),r.a.createElement("br",null),r.a.createElement(H,{setName:e.match.params.setName}))),r.a.createElement("main",{className:"App-main"},r.a.createElement(ve,null)))}),be=(a(360),a(361),a(131)),Oe=a(132),Se=a.n(Oe),Ae=a(133);var _e=Object(i.b)(function(e){return{profile:e.profile}},{login:function(e){return function(t){t({type:"LOGIN_REQUEST"}),function(e){return O.post(b+"face-parts/login",e)}(e).then(function(e){t({type:"LOGIN_SUCCESS",payload:e})}).catch(function(e){t({type:"LOGIN_FAILURE",payload:e})})}}})(function(e){return r.a.createElement("div",{className:"SocialLogin"},e.profile?r.a.createElement("div",null,"You are logged in as ",e.profile.name):r.a.createElement("div",null,r.a.createElement("p",null,"Sign in with a social network:"),r.a.createElement(be.GoogleLogin,{clientId:"546998968320-0cn7qut7aklej8akfljup6hi9a7najba.apps.googleusercontent.com",buttonText:"Google",onSuccess:function(t){e.login({profile:t.profileObj})},onFailure:function(e){return console.log(e)}}),r.a.createElement(Se.a,{appId:"375214849866140",callback:function(t){e.login({profile:t})},fields:"name,email,picture",render:function(e){return r.a.createElement("button",{className:"fb-button",onClick:e.onClick},r.a.createElement(Ae.a,null),"Facebook")}})))});var ye=Object(i.b)(function(e){return{sets:e.sets}},{getSets:function(){return function(e){e({type:"GET_SETS_REQUEST"}),O.get(b+"face-parts/sets").then(function(t){e({type:"GET_SETS_SUCCESS",payload:t})}).catch(function(t){e({type:"GET_SETS_FAILURE",payload:t})})}}})(function(e){return Object(n.useEffect)(function(){e.getSets()},[]),r.a.createElement("div",{className:"SelectSet"},r.a.createElement("h3",null,"Select Art Set"),r.a.createElement("ul",null,e.sets.map(function(e){return r.a.createElement("li",null,r.a.createElement(k.b,{to:e._id},e.name))})),r.a.createElement(_e,null))}),Ce=function(e){function t(){return Object(R.a)(this,t),Object(P.a)(this,Object(D.a)(t).apply(this,arguments))}return Object(N.a)(t,e),Object(T.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(k.a,{basename:"/avatar-platform"},r.a.createElement(M.c,null,r.a.createElement(M.a,{path:"/",exact:!0,component:ye}),r.a.createElement(M.a,{path:"/:setName",exact:!0,component:he}))))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var je=a(134),Le=a(135),we=Object(l.createStore)(I,Object(je.composeWithDevTools)(Object(l.applyMiddleware)(Le.a)));o.a.render(r.a.createElement(i.a,{store:we},r.a.createElement(Ce,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[138,1,2]]]);
//# sourceMappingURL=main.acf268eb.chunk.js.map