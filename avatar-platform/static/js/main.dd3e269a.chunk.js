(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{147:function(e,t,n){e.exports=n.p+"static/media/face.2c39ddd4.png"},148:function(e,t,n){e.exports=n.p+"static/media/face.6721bc4f.png"},153:function(e,t,n){e.exports=n(400)},180:function(e,t,n){},183:function(e,t,n){},184:function(e,t,n){},185:function(e,t,n){},186:function(e,t,n){},187:function(e,t,n){},188:function(e,t,n){},207:function(e,t,n){},208:function(e,t,n){},209:function(e,t,n){},214:function(e,t,n){},215:function(e,t,n){},216:function(e,t,n){},217:function(e,t,n){},380:function(e,t,n){},381:function(e,t,n){},397:function(e,t,n){},398:function(e,t,n){},399:function(e,t,n){},400:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),o=n(24),i=n.n(o),c=n(5),l=n(28),s=n(41),u=n(7),m=n(58),d=document.createElement("canvas"),p=d.getContext("2d"),f=600,g=600;d.width=f,d.height=g;var E=function(e,t){return new Promise(function(n,a){var r=document.createElement("img");r.src=e,r.onload=function(){p.clearRect(0,0,d.width,d.height),p.drawImage(r,0,0,d.width,d.height),function(e,t){p.imageSmoothingQuality="medium",p.globalCompositeOperation="source-atop",p.fillStyle=e,p.fillRect(0,0,d.width,d.height),p.globalCompositeOperation="multiply"}(t),p.drawImage(r,0,0,d.width,d.height),n(d.toDataURL("image/png",.7))}})},h=n(59),v=n(60),w=n(90),S=n.n(w),b="http://185.181.8.53:3001/",O=null,_=new(function(){function e(){var t=this;if(Object(h.a)(this,e),this.authAxios=null,this.axiosInstance=null,this.token=null,this.signup=function(e){return t.axiosInstance.post(b+"auth/sign-up",e)},this.signupFacebook=function(e){return new Promise(function(n,a){t.axiosInstance.post(b+"auth/facebook",e).then(function(e){t.setAxiosInstance(e.data.token),localStorage.setItem("token",e.data.token),n(e)}).catch(function(e){return a(e)})})},this.signupGoogle=function(e){return new Promise(function(n,a){t.axiosInstance.post(b+"auth/google",e).then(function(e){t.setAxiosInstance(e.data.token),localStorage.setItem("token",e.data.token),n(e)}).catch(function(e){return a(e)})})},this.signin=function(e){return new Promise(function(n,a){return t.axiosInstance.post(b+"auth/login",e).then(function(e){t.setAxiosInstance(e.data.token),localStorage.setItem("token",e.data.token),n(e)}).catch(function(e){return a(e)})})},this.getProfileInfo=function(){return t.authAxios.get(b+"profile/info")},this.getDownloads=function(){return t.authAxios.get(b+"profile/downloads")},this.removeDownload=function(e){return t.authAxios.delete(b+"profile/downloads/"+e)},this.getLayers=function(e){return t.axiosInstance.get(b+"face-parts/"+e)},this.getSets=function(){return t.axiosInstance.get(b+"face-parts/sets")},this.login=function(e){return t.axiosInstance.post(b+"face-parts/login",e)},this.saveImage=function(e,n){return t.authAxios({url:b+"save-image/"+e,method:"GET",responseType:"blob",params:{data:n}})},this.logOut=function(){t.token=null,localStorage.removeItem("token")},!O){O=this;var n=localStorage.getItem("token");n&&(this.token=n),this.setAxiosInstance(n)}return O}return Object(v.a)(e,[{key:"setAxiosInstance",value:function(e){this.axiosInstance=S.a.create({baseURL:b,headers:{"Content-Type":"application/json"}}),this.authAxios=S.a.create({baseURL:b,headers:{Authorization:"jwt "+e,"Content-Type":"application/json"}})}}]),e}()),y=n(61),A=n(136),L={partsDataOriginal:new Map,partsData:new Map,PARTS:[],PARTS_WITH_COLORS:[],partSprites:[],previewIsLoading:!1,layersAreLoading:!0,savingIsLoading:!1,sets:[],hiddenParts:[],conflicts:{},currentSet:null,current:{},nextCurrent:null};var N=function(){return function(e){return e({type:"GET_SETS_REQUEST"}),new Promise(function(t){_.getSets().then(function(n){e({type:"GET_SETS_SUCCESS",payload:n}),t(n)}).catch(function(t){e({type:"GET_SETS_FAILURE",payload:t})})})}},I=function(e,t){return function(n,a){var r=[];a().preview.partsDataOriginal.forEach(function(t,n){t.inheritColorFrom===e&&r.push(n)}),a().preview.partsDataOriginal.get(e).images.forEach(function(a){E(a.value,t).then(function(r){n({type:"SET_COLOR",payload:{_id:a._id,part:e,value:r,color:t}})})}),r.forEach(function(e){a().preview.partsDataOriginal.get(e).images.forEach(function(a){E(a.value,t).then(function(r){n({type:"SET_COLOR",payload:{_id:a._id,part:e,value:r,color:t}})})})})}},C=Object(m.a)(function(e){return e.preview.partsData},function(e){return e.preview.current},function(e,t){var n=[];return e.forEach(function(e,a){if(t[a]){var r=e.images.find(function(e){return e._id===t[a]._id});n.push({zIndex:e.zIndex,value:r})}}),n=(n=n.sort(function(e,t){return e.zIndex-t.zIndex})).map(function(e){return e.value&&e.value.value})}),D=Object(m.a)(function(e){return e.preview.partsData},function(e){if(!e)return!0;var t=!0,n=!1,a=void 0;try{for(var r,o=e[Symbol.iterator]();!(t=(r=o.next()).done);t=!0)for(var i=r.value,c=0;c<i[1].images.length;c++)if(i[1].images[c].isLoading)return!0}catch(l){n=!0,a=l}finally{try{t||null==o.return||o.return()}finally{if(n)throw a}}return!1}),T=function(e,t){return function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e,a=arguments.length>1?arguments[1]:void 0;return t.hasOwnProperty(a.type)?t[a.type](n,a):n}}(L,{SELECT_PART:function(e,t){var n=t.payload,a=n._id,r=n.part,o=n.randomized,i=Object.assign({},e.current);return!o&&e.conflicts[r]&&e.conflicts[r].forEach(function(t){e.partsData.forEach(function(e){e._id===t&&i[e._id]&&(i[e._id]._id="transparent")})}),Object(u.a)({},e,{current:Object(u.a)({},i,Object(s.a)({},r,Object(u.a)({},e.current[r],{_id:a})))})},SET_COLOR_START:function(e,t){var n=t.payload.part,a=new Map(e.partsData),r=Object.assign({},a.get(n));return r.images&&r.images.forEach(function(e){return e.isLoading=!0}),a.set(n,r),Object(u.a)({},e,{partsData:a})},SET_COLOR:function(e,t){var n=t.payload,a=n._id,r=n.part,o=n.value,i=n.color,c=new Map(e.partsData),l=Object.assign({},c.get(r)),m=[].concat(e.partsData.get(r).images);return m.find(function(e){return e._id===a}).value=o,m.find(function(e){return e._id===a}).isLoading=!1,l.images=m,c.set(r,l),Object(u.a)({},e,{partsData:c,current:Object(u.a)({},e.current,Object(s.a)({},r,Object(u.a)({},e.current[r],{color:i})))})},SET_PREVIEW_IS_LOADING:function(e,t){var n=t.value;return Object(u.a)({},e,{previewIsLoading:n})},GET_SETS_SUCCESS:function(e,t){var n=t.payload;return Object(u.a)({},e,{sets:n.data})},SET_CUSTOM_LAYERS:function(e,t){var n=t.payload;return Object(u.a)({},e,{current:n,nextCurrent:n})},LOAD_LAYERS_REQUEST:function(e,t){var n=t.payload;return Object(u.a)({},e,{current:{},currentSet:n,partsDataOriginal:new Map,partsData:new Map,PARTS:[],PARTS_WITH_COLORS:[],layersAreLoading:!0})},LOAD_LAYERS_SUCCESS:function(e,t){var n=t.payload,a=Object(y.cloneDeep)(n.data),r=Object.assign({},e.current),o={},i=new Map;return a.forEach(function(t,n){t.images.unshift({_id:"transparent",value:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="}),t.images.forEach(function(e){e.isLoading=!1}),t.conflictsWith.length&&(o[t._id]?o[t._id].concat(t.conflictsWith):o[t._id]=t.conflictsWith,o[t._id]=t.conflictsWith,t.conflictsWith.forEach(function(e){o[e]?o[e].push(t._id):o[e]=[t._id]})),e.nextCurrent?r=Object.assign({},e.nextCurrent):t.showOnStart?r[t._id]={_id:t.images[1]._id}:r[t._id]={_id:"transparent"},i.set(t._id,t)}),Object(u.a)({},e,{conflicts:o,partsData:i,partsDataOriginal:Object(y.cloneDeep)(i),PARTS:n.data.map(function(e){return e._id}),PARTS_WITH_COLORS:n.data.filter(function(e){return e.colors&&e.colors.length}).map(function(e){return e._id}),layersAreLoading:!1,current:r,nextCurrent:null})},SAVE_IMAGE_REQUEST:function(e){return Object(u.a)({},e,{savingIsLoading:!0})},SAVE_IMAGE_SUCCESS:function(e){return Object(u.a)({},e,{savingIsLoading:!1})}});var j=function(e,t){return function(n){n({type:"LOGIN_REQUEST"});var a=_.signin;return"facebook"===t&&(a=_.signupFacebook),"google"===t&&(a=_.signupGoogle),a(e).then(function(e){n({type:"LOGIN_SUCCESS",payload:e})}).catch(function(e){n({type:"LOGIN_FAILURE",payload:e})})}},k=function(e,t){return function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e,a=arguments.length>1?arguments[1]:void 0;return t.hasOwnProperty(a.type)?t[a.type](n,a):n}}({profile:null,downloads:[],downloadsAreLoading:!1,deletingDownloads:[]},{GET_PROFILE_INFO_SUCCESS:function(e,t){var n=t.payload;return Object(u.a)({},e,{profile:n.data})},GET_DOWNLOADS_REQUEST:function(e){return Object(u.a)({},e,{downloadsAreLoading:!0})},GET_DOWNLOADS_SUCCESS:function(e,t){var n=t.payload;return Object(u.a)({},e,{downloads:n.data||[],downloadsAreLoading:!1})},REMOVE_DOWNLOAD_REQUEST:function(e,t){var n=t.payload.id,a=[].concat(e.deletingDownloads);return a.push(n),Object(u.a)({},e,{deletingDownloads:a})},REMOVE_DOWNLOAD_SUCCESS:function(e,t){var n=t.payload,a=n.response,r=n.id,o=[].concat(e.deletingDownloads);return o=o.filter(function(e){return e!==r}),Object(u.a)({},e,{downloads:a.data||[],deletingDownloads:o})},LOGIN_SUCCESS:function(e,t){var n=t.payload;return Object(u.a)({},e,{profile:n.data})},SIGNUP_SUCCESS:function(e,t){var n=t.payload;return Object(u.a)({},e,{profile:n.data})},LOGOUT:function(e){return Object(u.a)({},e,{profile:null})}}),R=Object(l.combineReducers)({preview:T,profile:k}),P=(n(180),n(151)),U=n(137),x=n(152),G=n(9),F=n(34),M=(n(181),n(33));n(182),n(183),n(184),n(185);function W(e){var t=e.width,n=void 0===t?300:t,a=e.height,o=void 0===a?300:a;return r.a.createElement("div",{className:"spinner",style:{width:n,height:o}},"Loading...")}var V=n(6),Q=n.n(V);n(186);var B=Object(c.b)(function(e){return{items:C(e),current:e.preview.current,previewIsLoading:e.preview.layersAreLoading||D(e)||e.preview.savingIsLoading}})(function(e){var t=e.items,n=e.previewIsLoading;return e.setId,r.a.createElement("div",{className:Q()("Preview",n&&"isLoading")},r.a.createElement("div",{className:"images"},t.map(function(e,t){return r.a.createElement("div",{className:"img",style:{backgroundImage:"url("+e+")"},key:t,alt:""})})),r.a.createElement(W,null))}),Y=n(26),z=(n(187),n(17)),H=(n(188),n(36)),q=n.n(H);function Z(e){return r.a.createElement(q.a,{isOpen:e.isOpen,onRequestClose:e.closeModal,className:"download-success-modal"},r.a.createElement("h4",null,"Great! Your download has been successful!"),r.a.createElement("img",{className:"modal-image",src:e.imgBase64,alt:""}),r.a.createElement("h6",null,"If you want to download images in high quality, you can ",r.a.createElement("strong",null,"become premium")),r.a.createElement("h6",null,"See all your downloaded avatars ",r.a.createElement(G.b,{to:"/downloads"},"here")))}q.a.setAppElement("#root");n(207),n(208);var J=n(65);function K(e){if(!e)return"Field is required"}function $(e,t){if(e.length<t)return"Min length have to be ".concat(t)}function X(e){if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e))return"Invalid email address"}n(209);var ee=n(140),te=n(141),ne=n.n(te),ae=n(142);var re=Object(c.b)(function(e){return{profile:e.preview.profile}},{login:j})(function(e){return r.a.createElement("div",{className:"SocialLogin"},e.profile?r.a.createElement("div",null,"You are logged in as ",e.profile.email):r.a.createElement("div",null,r.a.createElement(ee.GoogleLogin,{clientId:"546998968320-0cn7qut7aklej8akfljup6hi9a7najba.apps.googleusercontent.com",buttonText:"Sign in with Google",responseType:"token",onSuccess:function(t){console.log(t),e.onSuccessGoogleLogin({access_token:t.accessToken})},onFailure:function(e){return console.log(e)}}),r.a.createElement(ne.a,{appId:"375214849866140",callback:function(t){console.log(t),e.onSuccessFacebookLogin({access_token:t.accessToken})},render:function(e){return r.a.createElement("button",{className:"fb-button",onClick:e.onClick},r.a.createElement(ae.a,null),"Sign in with Facebook")}})))}),oe={email:"",password:"",repeatPassword:""},ie=function(e){var t={},n=K(e.email)||X(e.email);n&&(t.email=n);var a=K(e.password)||$(e.password,6);a&&(t.password=a);var r=K(e.repeatPassword)||function(e,t){if(e!==t)return"Passwords does not match"}(e.repeatPassword,e.password);return r&&(t.repeatPassword=r),t};var ce=Object(c.b)(function(e){return{sets:e.preview.sets}},{getSets:N,login:j,signup:function(e){return function(t){return t({type:"SIGNUP_REQUEST"}),_.signup(e).then(function(e){t({type:"SIGNUP_SUCCESS",payload:e})}).catch(function(e){t({type:"SIGNUP_FAILURE",payload:e})})}}})(function(e){return r.a.createElement("div",{className:Q()("SignupForm","place-"+e.place)},"modal"===e.place&&r.a.createElement("h5",{className:"title"},"Please sign up to download"),"page"===e.place&&r.a.createElement("h5",{className:"title"},"Sign Up"),r.a.createElement(re,{onSuccessFacebookLogin:function(t){e.login(t,"facebook").then(function(){_.getProfileInfo().then(function(){e.onSuccessFacebookLogin()})})},onSuccessGoogleLogin:function(t){e.login(t,"google").then(function(t){_.getProfileInfo().then(function(){e.onSuccessGoogleLogin()})})}}),r.a.createElement(J.a,{initialValues:oe,validate:ie,validateOnChange:!0,onSubmit:function(t,n){var a=n.setSubmitting;e.signup(t).then(function(t){e.onSuccessEmailLogin()}).catch(function(e){M.b.error("Unexpected error. Try again later.")}).finally(function(){return a(!1)})}},function(t){var n=t.values,a=t.errors,o=t.touched,i=t.isSubmitting,c=t.handleChange,l=t.handleBlur,s=t.handleSubmit;return r.a.createElement("form",{onSubmit:s},r.a.createElement("div",{className:"control form-group"},r.a.createElement("label",{htmlFor:"email",className:"label"},"Email"),r.a.createElement("input",{id:"email",name:"email",type:"text",value:n.email,placeholder:"Email",onChange:c,onBlur:l,className:Q()("input form-control",o.email&&a.email&&"error")}),o.email&&a.email&&r.a.createElement("div",{className:"error-message"},a.email)),r.a.createElement("div",{className:"control form-group"},r.a.createElement("label",{htmlFor:"password",className:"label"},"Password"),r.a.createElement("input",{id:"password",name:"password",type:"password",value:n.password,placeholder:"Password",onChange:c,className:Q()("input form-control",o.password&&a.password&&"error")}),o.password&&a.password&&r.a.createElement("div",{className:"error-message"},a.password)),r.a.createElement("div",{className:"control form-group"},r.a.createElement("label",{htmlFor:"repeatPassword",className:"label"},"Repeat your password"),r.a.createElement("input",{id:"repeatPassword",name:"repeatPassword",type:"password",value:n.repeatPassword,placeholder:"Repeat your password",onChange:c,className:Q()("input form-control",o.password&&a.password&&"error")}),o.repeatPassword&&a.repeatPassword&&r.a.createElement("div",{className:"error-message"},a.repeatPassword)),r.a.createElement("div",{className:"control form-group"},r.a.createElement("input",{type:"submit",value:"Sign Up",disabled:i,className:"submit btn btn-block btn-lg btn-primary"})),r.a.createElement("div",{className:"signin"},"page"===e.place?r.a.createElement(G.b,{to:"signin"},"Already have an account? Sign in now!"):r.a.createElement("a",{href:"",onClick:function(t){t.preventDefault(),e.onSignInClick()}},"Already have an account? Sign in now!")))}))}),le=(n(214),{email:"",password:""}),se=function(e){var t={},n=K(e.email)||X(e.email);n&&(t.email=n);var a=K(e.password)||$(e.password,6);return a&&(t.password=a),t};var ue=Object(c.b)(function(e){return{sets:e.preview.sets}},{getSets:N,login:j})(function(e){return r.a.createElement("div",{className:"SigninForm"},"modal"===e.place&&r.a.createElement("h5",{className:"title"},"Please sign in to download"),"page"===e.place&&r.a.createElement("h5",{className:"title"},"Sign In"),r.a.createElement(re,{onSuccessFacebookLogin:function(t){e.login(t,"facebook").then(function(){_.getProfileInfo().then(function(){e.onSuccessFacebookLogin()})})},onSuccessGoogleLogin:function(t){e.login(t,"google").then(function(){_.getProfileInfo().then(function(){e.onSuccessGoogleLogin()})})}}),r.a.createElement(J.a,{initialValues:le,validate:se,validateOnChange:!0,onSubmit:function(t,n){var a=n.setSubmitting;e.login(t).then(function(t){e.onSuccessEmailLogin()}).catch(function(){M.b.error("Unexpected error. Try again later.")}).finally(function(){return a(!1)})}},function(t){var n=t.values,a=t.errors,o=t.touched,i=t.isSubmitting,c=t.handleChange,l=t.handleBlur,s=t.handleSubmit;return r.a.createElement("form",{onSubmit:s},r.a.createElement("div",{className:"control form-group"},r.a.createElement("label",{htmlFor:"email",className:"label"},"Email"),r.a.createElement("input",{id:"email",name:"email",type:"text",value:n.email,placeholder:"Email",onChange:c,onBlur:l,className:Q()("input form-control",o.email&&a.email&&"error")}),o.email&&a.email&&r.a.createElement("div",{className:"error-message"},a.email)),r.a.createElement("div",{className:"control form-group"},r.a.createElement("label",{htmlFor:"password",className:"label"},"Password"),r.a.createElement("input",{id:"password",name:"password",type:"password",value:n.password,placeholder:"Password",onChange:c,className:Q()("input form-control",o.password&&a.password&&"error")}),o.password&&a.password&&r.a.createElement("div",{className:"error-message"},a.password)),r.a.createElement("div",{className:"control form-group"},r.a.createElement("input",{type:"submit",value:"Sign In",disabled:i,className:"submit btn btn-block btn-lg btn-primary"})),r.a.createElement("div",{className:"signup"},"page"===e.place?r.a.createElement(G.b,{to:"signup"},"New to Avatar Maker? Sign up now!"):r.a.createElement("a",{href:"",onClick:function(t){t.preventDefault(),e.onSignUpClick()}},"New to Avatar Maker? Sign up now!")))}))});q.a.setAppElement("#root");var me=Object(c.b)(function(e){return{profile:e.profile.profile}})(function(e){var t=Object(a.useState)(!0),n=Object(Y.a)(t,2),o=n[0],i=n[1];function c(){}function l(){}function s(){}return Object(a.useEffect)(function(){e.profile&&e.isOpen&&e.onDownload()},[e.profile,e.isOpen]),r.a.createElement(q.a,{isOpen:e.isOpen,onRequestClose:e.closeModal,className:"download-modal"},r.a.createElement("div",null,e.profile?r.a.createElement("div",{className:"isDownloading"},r.a.createElement("div",{className:"email"},"You are logged in as ",e.profile.email),r.a.createElement("p",null,"Downloading...",r.a.createElement("div",{className:"spinner-wrapper"},r.a.createElement(W,{width:100,height:100})))):o?r.a.createElement(ue,{place:"modal",onSignUpClick:function(){return i(!1)},onSuccessFacebookLogin:c,onSuccessGoogleLogin:l,onSuccessEmailLogin:s}):r.a.createElement(ce,{place:"modal",onSignInClick:function(){return i(!0)},onSuccessFacebookLogin:c,onSuccessGoogleLogin:l,onSuccessEmailLogin:s})))});var de=Object(c.b)(function(e){return{savingIsLoading:e.preview.savingIsLoading,previewIsLoading:e.preview.layersAreLoading||D(e)}},function(e){return{randomizeLayers:function(){return e(function(e,t){var n=[].concat(t().preview.PARTS).sort(function(){return Math.random()-.5}),a={};n.forEach(function(n){if(t().preview.partsData.get(n).images.length){if(Object.values(a).reduce(function(e,t){return e.concat(t)},[]).includes(t().preview.partsData.get(n)._id))return e({type:"SELECT_PART",payload:{_id:"transparent",part:n,randomized:!0}});if(t().preview.PARTS_WITH_COLORS.includes(n)){var r=Math.floor(255*Math.random()).toString(16).padStart(2,"0"),o=Math.floor(255*Math.random()).toString(16).padStart(2,"0"),i=Math.floor(255*Math.random()).toString(16).padStart(2,"0");e(I(n,"#"+r+o+i)),e({type:"SET_COLOR_START",payload:{part:n}})}var c=Math.floor(Math.random()*(t().preview.partsData.get(n).images.length-1))+1,l=t().preview.partsData.get(n).images[c]._id;e({type:"SELECT_PART",payload:{_id:l,part:n,randomized:!0}}),a[n]=t().preview.conflicts[t().preview.partsData.get(n)._id]}})})},saveImage:function(t){return e(function(e){return function(t,n){var a=n().preview.current;return t({type:"SAVE_IMAGE_REQUEST"}),new Promise(function(n,r){_.saveImage(e,a).then(function(e){Object(A.saveAs)(new Blob([e.data]),"image"+Math.floor(1e5*Math.random()+1)+".png"),t({type:"SAVE_IMAGE_SUCCESS",payload:e}),n(e)}).catch(function(e){t({type:"SAVE_IMAGE_FAILURE",payload:e}),r(e)})})}}(t))}}})(function(e){var t=Object(a.useState)(!1),n=Object(Y.a)(t,2),o=n[0],i=n[1],c=Object(a.useState)(!1),l=Object(Y.a)(c,2),s=l[0],u=l[1],m=Object(a.useState)(null),d=Object(Y.a)(m,2),p=d[0],f=d[1];return r.a.createElement("div",{className:"ButtonActions"},r.a.createElement("button",{className:"btn btn-primary btn-wide mb-2",onClick:e.randomizeLayers,disabled:e.savingIsLoading||e.previewIsLoading},r.a.createElement(z.d,null),"\xa0",r.a.createElement("span",{className:"button-text"},"Random")),r.a.createElement("br",null),r.a.createElement("button",{className:"btn btn-primary btn-wide",onClick:function(){return u(!0)},disabled:e.savingIsLoading||e.previewIsLoading},r.a.createElement(z.a,null),"\xa0",r.a.createElement("span",{className:"button-text"},"Download")),r.a.createElement(me,{isOpen:s,closeModal:function(){return u(!1)},onDownload:function(){e.saveImage(e.setId).then(function(e){var t=new FileReader;t.readAsDataURL(e.data),t.onloadend=function(){var e=t.result;f(e),i(!0),u(!1)}})}}),r.a.createElement(Z,{isOpen:o,closeModal:function(){return i(!1)},imgBase64:p}))}),pe=(n(215),n(43));n(216);function fe(e){var t=e.id,n=e.active,a=e.part,o=e.url,i=e.selectPart;return r.a.createElement("div",{className:Q()("Tile",n&&"active"),onClick:function(){return i(t,a)}},r.a.createElement("img",{src:o,alt:""}))}n(217);var ge=n(145);var Ee=Object(c.b)(function(e){return{partsData:e.preview.partsData,current:e.preview.current}},function(e){return{changeColor:function(t,n){return e(I(t,n))}}})(function(e){var t=e.part,n=e.changeColor,o=e.partsData,i=e.current,c=Object(a.useState)(!1),l=Object(Y.a)(c,2),s=l[0],u=l[1],m=Object(a.useState)(i[t]&&i[t].color||"#ffffff"),d=Object(Y.a)(m,2),p=d[0],f=d[1],g=o.get(t).colors,E=function(){u(!1)};return Object(a.useEffect)(function(){return window.addEventListener("click",E,!1),function(){window.removeEventListener("click",E)}},[]),g&&g.length?r.a.createElement("div",{className:"ColorPicker",onClick:function(e){return e.stopPropagation()}},r.a.createElement("div",{className:"color color-pipette",onClick:function(){u(!s)},style:{backgroundColor:i[t]&&i[t].color||p}},r.a.createElement(z.b,null)),g.map(function(e){return r.a.createElement("div",{className:"color",style:{background:e},key:e,onClick:function(){return n(t,e)}})}),s&&r.a.createElement(ge.ChromePicker,{className:"chromePicker",disableAlpha:!0,color:i[t]&&i[t].color||p,onChange:function(e){f(e.hex),n(t,e.hex)}})):null});var he=Object(c.b)(function(e){return{items:e.preview.partsData,current:e.preview.current}},function(e){return{changeColor:function(t,n){return e(I(t,n))},selectPart:function(t,n){return e({type:"SELECT_PART",payload:{_id:t,part:n}})}}})(function(e){var t=e.items,n=e.current,a=e.selectPart,o=e.part;return t&&t.get(o)&&t.get(o).images&&t.get(o).images.length?r.a.createElement("div",null,t.get(o).images.map(function(e){return r.a.createElement(fe,{active:n&&n[o]&&n[o]._id===e._id,key:e._id,id:e._id,part:o,url:e.value,selectPart:a})}),r.a.createElement("br",null),!t.get(o).inheritColorFrom&&r.a.createElement(Ee,{part:o})):"No items on this layer"});var ve=Object(c.b)(function(e){return{PARTS:e.preview.PARTS,partsData:e.preview.partsData}})(function(e){var t=e.PARTS,n=e.partsData;return t&&t.length?r.a.createElement("div",{className:"MainTabs"},r.a.createElement(pe.d,{defaultIndex:0},r.a.createElement(pe.b,null,t.map(function(e){return r.a.createElement(pe.a,{key:e},n.get(e).title)})),t.map(function(e){return r.a.createElement(pe.c,{key:e},r.a.createElement(he,{part:e}))}))):r.a.createElement("div",null)});n(380);var we=Object(c.b)(function(e){return{sets:e.preview.sets,profile:e.profile.profile}})(function(e){return r.a.createElement("div",{className:"AppHeader"},r.a.createElement("div",{className:"logo"},r.a.createElement(G.b,{to:"/"},r.a.createElement(z.c,null),"Avatar Maker")),r.a.createElement("ul",{className:"menu-items"},e.sets.map(function(t,n){return r.a.createElement("li",{key:n},e.match&&e.match.params.setId===t._id?r.a.createElement(G.b,{to:t._id,onClick:function(e){return e.preventDefault()},className:"disabled"},t.name):r.a.createElement(G.b,{to:t._id},t.name))})),e.profile?r.a.createElement("div",{className:"profile-name"},e.profile.email):r.a.createElement("div",{className:"signup-wrapper"},r.a.createElement(G.b,{to:"/signup"},r.a.createElement("button",{className:"btn btn-info btn-sm"},"SIGN UP"))))}),Se=(n(381),n(146));var be=Object(c.b)(function(e){return{sets:e.preview.sets,profile:e.profile.profile}},{logOut:function(){return function(e){_.logOut(),e({type:"LOGOUT"})}}})(function(e){return r.a.createElement("div",{className:"AppMenu"},r.a.createElement(Se.slide,{right:!0,width:280},e.profile?r.a.createElement(r.a.Fragment,null,r.a.createElement(G.b,{id:"downloads",className:"menu-item",to:"/downloads"},r.a.createElement(z.a,null),"\xa0",r.a.createElement("span",null,"Downloads")),r.a.createElement("a",{id:"logOut",className:"menu-item",href:"",onClick:function(t){t.preventDefault(),e.logOut()}},r.a.createElement(z.f,null),"\xa0",r.a.createElement("span",null,"Log out"))):r.a.createElement(r.a.Fragment,null,r.a.createElement(G.b,{id:"signUp",className:"menu-item",to:"/signup"},r.a.createElement(z.g,null),"\xa0",r.a.createElement("span",null,"Sign Up")),r.a.createElement(G.b,{id:"signIn",className:"menu-item",to:"/signin"},r.a.createElement(z.e,null),"\xa0",r.a.createElement("span",null,"Log In"))),r.a.createElement("ul",{className:"menu-items"},e.sets.map(function(t,n){return r.a.createElement("li",{key:n},e.match&&e.match.params.setId===t._id?r.a.createElement(G.b,{to:t._id,onClick:function(e){return e.preventDefault()},className:"disabled"},t.name):r.a.createElement(G.b,{to:t._id},t.name))}))))});var Oe=Object(c.b)(function(e){return{sets:e.preview.sets}},{loadLayers:function(e,t){return function(n,a){if(e!==a().preview.currentSet||t){n({type:"LOAD_LAYERS_REQUEST",payload:e});var r=a().preview.nextCurrent;_.getLayers(e).then(function(e){n({type:"LOAD_LAYERS_SUCCESS",payload:e}),r&&Object.entries(r).forEach(function(e){a().preview.PARTS_WITH_COLORS.includes(e[0])&&(n(I(e[0],e[1].color)),n({type:"SET_COLOR_START",payload:{part:e[0]}}))})}).catch(function(e){n({type:"LOAD_LAYERS_FAILURE",payload:e})})}}},getSets:N})(function(e){return Object(a.useEffect)(function(){e.getSets().then(function(t){e.match.params.setId||e.history.push(t.data[0]._id)})},[]),Object(a.useEffect)(function(){e.match.params.setId&&e.loadLayers(e.match.params.setId)},[e.match.params.setId]),r.a.createElement("div",{className:"AvatarPage"},r.a.createElement(be,{match:e.match}),r.a.createElement(we,{match:e.match}),r.a.createElement("aside",{className:"App-left-col"},r.a.createElement("div",{className:"left-col-container"},r.a.createElement(B,{setId:e.match.params.setId}),r.a.createElement("br",null),r.a.createElement(de,{setId:e.match.params.setId}))),r.a.createElement("main",{className:"App-main"},r.a.createElement(ve,null)))}),_e=(n(397),n(147)),ye=n.n(_e);var Ae=Object(c.b)(function(e){return{sets:e.preview.sets,currentSet:e.preview.currentSet}},{getSets:N,login:j})(function(e){function t(){e.currentSet?e.history.push("/"+e.currentSet):e.history.pushfa("/")}return r.a.createElement("div",{className:"SignupPage"},r.a.createElement(we,null),r.a.createElement(be,null),r.a.createElement("div",{className:"wrapper"},r.a.createElement("div",{className:"left-col"},r.a.createElement("img",{src:ye.a,alt:""})),r.a.createElement("div",{className:"right-col"},r.a.createElement("div",{className:"form-wrapper"},r.a.createElement(ce,{place:"page",onSuccessFacebookLogin:function(e){t()},onSuccessGoogleLogin:function(e){t()},onSuccessEmailLogin:function(e){t()}})))))}),Le=(n(398),n(148)),Ne=n.n(Le);var Ie=Object(c.b)(function(e){return{sets:e.preview.sets,currentSet:e.preview.currentSet}},{getSets:N,login:j})(function(e){function t(){e.currentSet?e.history.push("/"+e.currentSet):e.history.push("/")}return r.a.createElement("div",{className:"SigninPage"},r.a.createElement(we,null),r.a.createElement(be,null),r.a.createElement("div",{className:"wrapper"},r.a.createElement("div",{className:"left-col"},r.a.createElement("img",{src:Ne.a,alt:""})),r.a.createElement("div",{className:"right-col"},r.a.createElement("div",{className:"form-wrapper"},r.a.createElement(ue,{place:"page",onSuccessFacebookLogin:function(e){t()},onSuccessGoogleLogin:function(e){t()},onSuccessEmailLogin:function(e){t()}})))))});n(399);var Ce=Object(c.b)(function(e){return{downloads:e.profile.downloads,downloadsAreLoading:e.profile.downloadsAreLoading,deletingDownloads:e.profile.deletingDownloads}},{getDownloads:function(){return function(e){if(_.token)return e({type:"GET_DOWNLOADS_REQUEST"}),new Promise(function(t){_.getDownloads().then(function(n){e({type:"GET_DOWNLOADS_SUCCESS",payload:n}),t(n)}).catch(function(t){e({type:"GET_DOWNLOADS_FAILURE",payload:t})})})}},removeDownload:function(e){return function(t){if(_.token)return t({type:"REMOVE_DOWNLOAD_REQUEST",payload:{id:e}}),new Promise(function(n){_.removeDownload(e).then(function(a){t({type:"REMOVE_DOWNLOAD_SUCCESS",payload:{response:a,id:e}}),n(a)}).catch(function(e){t({type:"REMOVE_DOWNLOAD_FAILURE",payload:e})})})}},setCustomLayers:function(e){return function(t,n){t({type:"SET_CUSTOM_LAYERS",payload:e}),Object.entries(e).forEach(function(e){n().preview.PARTS_WITH_COLORS.includes(e[0])&&(t(I(e[0],e[1].color)),t({type:"SET_COLOR_START",payload:{part:e[0]}}))})}}})(function(e){return Object(a.useEffect)(function(){e.getDownloads()},[]),r.a.createElement("div",{className:"DownloadsPage"},r.a.createElement(we,null),r.a.createElement(be,null),r.a.createElement("div",{className:"wrapper"},r.a.createElement("div",{className:"width-wrapper"},r.a.createElement("h4",{className:"title"},"Downloads"),e.downloadsAreLoading?r.a.createElement("div",{className:"spinner-wrapper"},r.a.createElement(W,{height:"300px",width:"300px"})):r.a.createElement("div",null,(!e.downloads||!e.downloads.length)&&r.a.createElement("h6",{className:"no-downloads"},"You have no downloads yet"),e.downloads.length?e.downloads.map(function(t){return r.a.createElement("div",{key:t._id,className:Q()("preview-tile",e.deletingDownloads.includes(t._id)&&"deleting")},e.deletingDownloads.includes(t._id)&&r.a.createElement(W,{height:"100px",width:"100px"}),r.a.createElement("img",{src:t.preview,alt:""}),r.a.createElement(G.b,{className:"btn btn-primary btn-sm",to:"/"+t.setId,onClick:function(){return e.setCustomLayers(t.layers)}},"Edit"),r.a.createElement("br",null),r.a.createElement("button",{className:"btn btn-danger btn-sm",onClick:function(){return e.removeDownload(t._id)}},"Delete"))}):""))))}),De=function(e){function t(e){return Object(h.a)(this,t),e.getProfileInfo(),Object(P.a)(this,Object(U.a)(t).call(this,e))}return Object(x.a)(t,e),Object(v.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(M.a,{autoClose:4e3,hideProgressBar:!0}),r.a.createElement(G.a,null,r.a.createElement(F.c,null,r.a.createElement(F.a,{path:"/",exact:!0,component:Oe}),r.a.createElement(F.a,{path:"/downloads",exact:!0,component:Ce}),r.a.createElement(F.a,{path:"/signup",exact:!0,component:Ae}),r.a.createElement(F.a,{path:"/signin",exact:!0,component:Ie}),r.a.createElement(F.a,{path:"/:setId",exact:!0,component:Oe}))))}}]),t}(r.a.Component),Te=Object(c.b)(null,{getProfileInfo:function(){return function(e){if(_.token)return e({type:"GET_PROFILE_INFO_REQUEST"}),new Promise(function(t){_.getProfileInfo().then(function(n){e({type:"GET_PROFILE_INFO_SUCCESS",payload:n}),t(n)}).catch(function(t){e({type:"GET_PROFILE_INFO_FAILURE",payload:t})})})}}})(De);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var je=n(149),ke=n(150),Re=Object(l.createStore)(R,Object(je.composeWithDevTools)(Object(l.applyMiddleware)(ke.a)));i.a.render(r.a.createElement(c.a,{store:Re},r.a.createElement(Te,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[153,1,2]]]);
//# sourceMappingURL=main.dd3e269a.chunk.js.map