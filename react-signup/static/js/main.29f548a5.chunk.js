(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{33:function(e,a,r){e.exports=r(78)},38:function(e,a,r){},65:function(e,a,r){},66:function(e,a,r){},67:function(e,a,r){},68:function(e,a,r){},75:function(e,a,r){},77:function(e,a,r){},78:function(e,a,r){"use strict";r.r(a);var n=r(0),t=r.n(n),s=r(7),o=r.n(s),i=(r(38),r(32)),l=r(6);function c(e){if(!e)return"Field is required"}function m(e,a){if(e.length<a)return"Min length have to be ".concat(a)}var u=r(16),d=r.n(u),p="http://185.181.8.53:3002/",f=function(e){return d.a.post(p+"signup",e)},w=r(10),h=r(4),v=r.n(h);r(65);function g(e){var a=e.id,r=(e.form,e.label),n=e.className,s=e.formGroupClassName,o=e.error,i=Object(w.a)(e,["id","form","label","className","formGroupClassName","error"]);return t.a.createElement("div",{className:v()("TextField-component",s)},t.a.createElement("label",{htmlFor:a,className:"label"},r),t.a.createElement("input",Object.assign({id:a,className:v()(n,o&&"error")},i)),o&&t.a.createElement("div",{className:"error-message"},o))}r(66);function b(e){var a=e.size,r=void 0===a?25:a,n=e.color,s=void 0===n?"white":n;return t.a.createElement("div",{className:"Spinner-component"},t.a.createElement("svg",{width:r,height:r,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid",className:"lds-rolling"},t.a.createElement("circle",{cx:"50",cy:"50",fill:"none",stroke:s,strokeWidth:"10",r:"30",strokeDasharray:"141.37166941154067 49.12388980384689",transform:"rotate(341.799 50 50)"},t.a.createElement("animateTransform",{attributeName:"transform",type:"rotate",calcMode:"linear",values:"0 50 50;360 50 50",keyTimes:"0;1",dur:"1s",begin:"0s",repeatCount:"indefinite"}))))}r(67);function E(e){var a=e.children,r=e.block,n=e.className,s=e.isLoading,o=Object(w.a)(e,["children","block","className","isLoading"]);return t.a.createElement("button",Object.assign({className:v()("Button-component",r&&"block",n)},o),t.a.createElement("span",null,a),"\xa0",s&&t.a.createElement(b,null))}r(68);var y={email:"",username:"",password:"",repeatPassword:""},N=function(e){var a={},r=c(e.email)||function(e){if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e))return"Invalid email address"}(e.email);r&&(a.email=r);var n=c(e.username)||function(e){if(!/^[^`~!@#$%^&*()+=[{\]}|\\'<,.>?";:]+$/.test(e))return"No special characters allowed"}(e.username)||m(e.username,3);n&&(a.username=n);var t=c(e.password)||m(e.password,6);t&&(a.password=t);var s,o=c(e.repeatPassword)||function(e,a){if(e!==a)return"Passwords does not match"}(e.repeatPassword,e.password);return o&&(a.repeatPassword=o),Object.keys(a).length?a:(s=e,d.a.post(p+"check",s)).then(function(){}).catch(function(e){var r=e&&e.response&&e.response.data&&e.response.data.errors;if(!r)return{};var n=Object.keys(y);for(var t in r)r.hasOwnProperty(t)&&(n.includes(t)?a[t]=r[t].message:l.b.error(r[t].message));if(Object.keys(r).length)throw a})};function k(){return t.a.createElement("div",{className:"SignupForm-component"},t.a.createElement(i.a,{initialValues:y,validate:N,validateOnChange:!0,onSubmit:function(e,a){var r=a.setSubmitting;f(e).then(function(){l.b.success("You were successfully signed up!")}).catch(function(e){var a=e&&e.response&&e.response.data&&e.response.data.errors;for(var r in a||l.b.error("Unexpected error. Please try again later"),a)a.hasOwnProperty(r)&&l.b.error(a[r].message)}).finally(function(){return r(!1)})}},function(e){var a=e.values,r=e.errors,n=e.touched,s=e.isSubmitting,o=e.handleChange,i=e.handleSubmit;return t.a.createElement("form",{onSubmit:i},t.a.createElement(g,{id:"email",name:"email",type:"email",value:a.email,label:"Email",placeholder:"Email",onChange:o,error:n.email&&r.email}),t.a.createElement(g,{id:"username",name:"username",type:"text",value:a.username,label:"Choose username",placeholder:"Username",onChange:o,error:n.username&&r.username}),t.a.createElement(g,{id:"password",name:"password",type:"password",value:a.password,label:"Password",placeholder:"Password",onChange:o,error:n.password&&r.password}),t.a.createElement(g,{id:"repeatPassword",name:"repeatPassword",type:"password",value:a.repeatPassword,label:"Repeat your password",placeholder:"Repeat your password",onChange:o,error:n.repeatPassword&&r.repeatPassword}),t.a.createElement(E,{type:"submit",disabled:s,isLoading:s,block:!0,className:"submit"},"Sign Up"))}))}r(75);function P(){return t.a.createElement("div",{className:"Signup-component"},t.a.createElement("div",{className:"wrapper"},t.a.createElement("h2",{className:"title"},"Sign Up to Coins.ph!"),t.a.createElement(k,null)))}r(76),r(77);var C=function(){return t.a.createElement("div",{className:"App-component"},t.a.createElement(P,null),t.a.createElement(l.a,{autoClose:4e3,hideProgressBar:!0}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(t.a.createElement(C,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[33,1,2]]]);
//# sourceMappingURL=main.29f548a5.chunk.js.map