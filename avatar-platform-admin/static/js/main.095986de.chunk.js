(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{185:function(e,t,a){},224:function(e,t,a){"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=((n=a(396))&&n.__esModule?n:{default:n}).default;t.default=r},235:function(e,t,a){e.exports=a(601)},240:function(e,t,a){},244:function(e,t,a){},264:function(e,t,a){},394:function(e,t,a){},395:function(e,t,a){},396:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ColorPickerField=t.default=void 0;var n=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,a):{};n.get||n.set?Object.defineProperty(t,a,n):t[a]=e[a]}return t.default=e,t}(a(0)),r=s(a(186)),l=s(a(399)),o=s(a(400)),c=s(a(40)),i=a(401),u=s(a(402));function s(e){return e&&e.__esModule?e:{default:e}}function m(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}function d(){return(d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}var f=function(e){e.defaultValue;var t=e.onChange,a=e.convert,r=e.name,l=e.id,o=e.hintText,s=e.placeholder,m=e.floatingLabelText,f=e.label,h=e.TextFieldProps,p=e.value,v=e.showPicker,E=e.setShowPicker,g=e.internalValue,b=e.setValue;return n.default.createElement(n.Fragment,null,n.default.createElement(c.default,d({name:r,id:l,value:void 0===p?g:p,label:m||f,placeholder:o||s,onClick:function(){return E(!0)},onChange:function(e){b(e.target.value),t(e.target.value)},InputProps:{style:{color:void 0===p?g:p}}},h)),v&&n.default.createElement(u.default,{value:void 0===p?g:p,onClick:function(){E(!1),t(p)},onChange:function(e){var n=i.converters[a](e);b(n),t(n)}}))};f.propTypes={value:r.default.string,onChange:r.default.func,convert:r.default.oneOf(Object.keys(i.converters)),defaultValue:r.default.string,name:r.default.string,id:r.default.string,hintText:r.default.string,placeholder:r.default.string,label:r.default.string,floatingLabelText:r.default.string,TextFieldProps:r.default.shape(c.default.propTypes),showPicker:r.default.bool,setShowPicker:r.default.func,internalValue:r.default.string,setValue:r.default.func},f.defaultProps={convert:i.DEFAULT_CONVERTER};var h=(0,l.default)((0,o.default)("showPicker","setShowPicker",!1),(0,o.default)("internalValue","setValue",function(e){return e.defaultValue}))(f),p=function(e){var t=e.input,a=t.value,r=t.onChange,l=m(t,["value","onChange"]),o=e.meta,c=o.touched,i=o.error,u=m(e,["input","meta"]);return n.default.createElement(h,d({value:a,onChange:r,errorText:c&&i},l,u))};t.ColorPickerField=p,p.propTypes={input:r.default.object,meta:r.default.object};var v=h;t.default=v},401:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.converters=t.DEFAULT_CONVERTER=void 0;t.DEFAULT_CONVERTER="rgba_hex";var n={rgba:function(e){return"rgba(".concat(e.rgb.r,", ").concat(e.rgb.g,", ").concat(e.rgb.b,", ").concat(e.rgb.a,")")},rgb:function(e){return"rgb(".concat(e.rgb.r,", ").concat(e.rgb.g,", ").concat(e.rgb.b,")")},hex:function(e){return e.hex},rgba_rgb:function(e){return 1===e.rgb.a?n.rgb(e):n.rgba(e)},rgba_hex:function(e){return 1===e.rgb.a?n.hex(e):n.rgba(e)}};t.converters=n;var r=n;t.default=r},402:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=o(a(0)),r=o(a(186)),l=a(403);function o(e){return e&&e.__esModule?e:{default:e}}var c=function(e){var t=e.value,a=e.onClick,r=e.onChange;return n.default.createElement("div",{style:{position:"absolute",zIndex:"2"}},n.default.createElement("div",{style:{position:"fixed",top:"0px",right:"0px",bottom:"0px",left:"0px"},onClick:a}),n.default.createElement(l.ChromePicker,{disableAlpha:!0,color:t,onChange:r}))};c.propTypes={value:r.default.string,onChange:r.default.func,onClick:r.default.func};var i=c;t.default=i},570:function(e,t,a){},571:function(e,t,a){},588:function(e,t,a){},591:function(e,t,a){},601:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(22),o=a.n(l),c=(a(240),a(95)),i=a(96),u=a(233),s=a(221),m=a(234),d=a(24),f=(a(39),a(244),a(5)),h=a.n(f),p=a(98),v=a.n(p),E=a(100),g=a.n(E),b=a(20),y=a.n(b),w=a(99),k=a.n(w),C=a(47),O=a.n(C),I=a(26),S=a.n(I),j=a(106),N=a.n(j),L="http://185.181.8.53:3001/",x=null,P=new(function(){function e(){if(Object(c.a)(this,e),this.authAxios=null,this.filesAxios=null,this.token=null,!x){x=this;var t=localStorage.getItem("token");t&&(this.token=t),this.setAxiosInstance(t)}return x}return Object(i.a)(e,[{key:"login",value:function(e){var t=this;return new Promise(function(a,n){N.a.post(L+"auth/login",e).then(function(e){t.setAxiosInstance(e.data.token),localStorage.setItem("token",e.data.token),a(e)}).catch(function(e){return n(e)})})}},{key:"getSets",value:function(){return this.request("get","admin/sets")}},{key:"postSet",value:function(e){return this.request("post","admin/sets",e)}},{key:"deleteSet",value:function(e){return this.request("delete","admin/sets/"+e)}},{key:"getLayers",value:function(e){return this.request("get","admin/"+e+"/layers")}},{key:"addLayer",value:function(e,t){return this.request("post","admin/"+e+"/layers/",t)}},{key:"deleteLayer",value:function(e,t){return this.request("delete","admin/"+e+"/layers/"+t)}},{key:"getLayerItems",value:function(e,t){return this.request("get","admin/"+e+"/layers/"+t)}},{key:"patchLayerItem",value:function(e,t,a){return this.request("patch","admin/"+e+"/layers/"+t,a)}},{key:"postLayerItemColor",value:function(e,t,a){return this.request("post","admin/"+e+"/layers/"+t+"/colors",{color:a})}},{key:"deleteLayerItemColor",value:function(e,t,a){return a=a.replace("#",""),this.request("delete","admin/"+e+"/layers/"+t+"/colors/"+a)}},{key:"postLayerItemsImages",value:function(e,t,a){var n=new FormData;return a.forEach(function(e){return n.append("images",e)}),n.append("name","images"),this.filesAxios.post(L+"admin/"+e+"/layers/"+t+"/images",n)}},{key:"deleteLayerItemImage",value:function(e,t,a){return this.request("delete","admin/"+e+"/layers/"+t+"/images/"+a)}},{key:"request",value:function(e){for(var t=this,a=arguments.length,n=new Array(a>1?a-1:0),r=1;r<a;r++)n[r-1]=arguments[r];return new Promise(function(a,r){var l;(l=t.authAxios)[e].apply(l,n).then(function(e){a(e)}).catch(function(e){e.response&&401===e.response.status&&(window.location="/avatar-platform-admin/#/login"),r(e)})})}},{key:"setAxiosInstance",value:function(e){this.authAxios=N.a.create({baseURL:L,headers:{Authorization:"jwt "+e,"Content-Type":"application/json"}}),this.filesAxios=N.a.create({baseURL:L,headers:{Authorization:"jwt "+e,"Content-Type":"multipart/form-data"}})}}]),e}());a(264);function _(e){var t=e.width,a=void 0===t?200:t,n=e.height,l=void 0===n?200:n,o=e.position;return r.a.createElement("div",{className:"spinner-main-wrapper"},r.a.createElement("div",{className:h()("spinner","absolute"===o&&"absolute"),style:{width:a,height:l}},"Loading..."))}var A=a(21),T=a.n(A),F=a(40),V=a.n(F),D=a(101),q=a.n(D),z=a(46),R=a.n(z),B=a(27),M=function(e){B.b.error(e&&e.response&&e.response.data&&e.response.data.error&&e.response.data.error.errmsg||"Unexpected error. Please try again later")};function W(e){var t=Object(n.useState)([]),a=Object(d.a)(t,2),l=a[0],o=a[1],c=Object(n.useState)(!0),i=Object(d.a)(c,2),u=i[0],s=i[1],m=Object(n.useState)(""),f=Object(d.a)(m,2),h=f[0],p=f[1];return Object(n.useEffect)(function(){localStorage.getItem("token")||(window.location="/avatar-platform-admin/#/login"),s(!0),P.getSets().then(function(e){o(e.data)}).catch(M).finally(function(){return s(!1)})},[]),r.a.createElement(S.a,{className:"Paper-main Sets"},r.a.createElement("h2",null,"Art Sets"),u&&r.a.createElement(_,null),!u&&r.a.createElement(v.a,null,r.a.createElement(k.a,null,r.a.createElement(O.a,null,r.a.createElement(y.a,null,"Set name"),r.a.createElement(y.a,null))),r.a.createElement(g.a,null,l.map(function(t){return r.a.createElement(O.a,{className:"table-row",hover:!0,key:t._id,onClick:function(){return e.history.push("/"+t._id)}},r.a.createElement(y.a,{component:"td",scope:"row"},t.name),r.a.createElement(y.a,{onClick:function(e){return e.stopPropagation()},align:"right",className:"delete-button-cell"},r.a.createElement(T.a,{variant:"contained",color:"secondary",onClick:function(){return e=t._id,a=t.name,void(window.confirm('Confirm deleting "'.concat(a,'" set'))&&(s(!0),P.deleteSet(e).then(function(e){o(e.data)}).catch(M).finally(function(){return s(!1)})));var e,a},className:"delete-button"},r.a.createElement(R.a,null)," Delete")))}),r.a.createElement(O.a,{className:"table-row",hover:!0,onClick:function(){}},r.a.createElement(y.a,{component:"td",scope:"row",colspan:"100%"},r.a.createElement("div",{className:"add-form-wrapper"},r.a.createElement(V.a,{id:"title",label:"Title",value:h,onChange:function(e){return p(e.target.value)},margin:"normal",variant:"outlined",className:"add-input"}),r.a.createElement("div",null,r.a.createElement(T.a,{variant:"contained",color:"primary",onClick:function(){return e=h,s(!0),void P.postSet({name:e}).then(function(e){o(e.data),p("")}).catch(M).finally(function(){return s(!1)});var e}},r.a.createElement(q.a,null)," Add new set"))))))))}a(394);function U(e){var t=Object(n.useState)({}),a=Object(d.a)(t,2),l=a[0],o=a[1],c=Object(n.useState)(!0),i=Object(d.a)(c,2),u=i[0],s=i[1];return Object(n.useEffect)(function(){s(!0),P.getLayers(e.match.params.setId).then(function(e){o(e.data)}).catch(M).finally(function(){return s(!1)})},[]),r.a.createElement(S.a,{className:"Paper-main Layers"},r.a.createElement(T.a,{color:"primary",onClick:e.history.goBack},"Back to Sets"),r.a.createElement("h2",null,"Layers"),u&&r.a.createElement(_,null),!u&&r.a.createElement(v.a,null,r.a.createElement(k.a,null,r.a.createElement(O.a,null,r.a.createElement(y.a,null,"Title"),r.a.createElement(y.a,null,"Z-index"),r.a.createElement(y.a,null,"Colors"),r.a.createElement(y.a,null,"Images quantity"),r.a.createElement(y.a,null))),r.a.createElement(g.a,null,l.layers&&l.layers.map(function(t){return r.a.createElement(O.a,{className:"table-row",hover:!0,key:t._id,onClick:function(){return e.history.push(e.match.params.setId+"/"+t._id)}},r.a.createElement(y.a,{component:"th",scope:"row"},t.title),r.a.createElement(y.a,{component:"th",scope:"row"},t.zIndex),r.a.createElement(y.a,{component:"th",scope:"row"},t.colors&&t.colors.length?t.colors.map(function(e){return r.a.createElement("div",{className:"color",style:{background:e}})}):"No colors"),r.a.createElement(y.a,{component:"th",scope:"row"},t.images.length),r.a.createElement(y.a,{onClick:function(e){return e.stopPropagation()}},r.a.createElement(T.a,{variant:"contained",color:"secondary",onClick:function(){return a=t._id,n=t.title,void(window.confirm('Confirm deleting "'.concat(n,'" layer'))&&(s(!0),P.deleteLayer(e.match.params.setId,a).then(function(e){o(e.data)}).catch(M).finally(function(){return s(!1)})));var a,n},className:"delete-button"},r.a.createElement(R.a,null)," Delete")))}),r.a.createElement(O.a,{className:"table-row",hover:!0,onClick:function(){e.history.push(e.match.params.setId+"/add")}},r.a.createElement(y.a,{component:"th",scope:"row",colspan:"100%"},r.a.createElement("strong",null,"Add new layer"))))))}a(185);var J=a(94),Z=(a(395),a(224)),$=a.n(Z),G=a(61);function H(e){var t=Object(n.useState)("#ffffff"),a=Object(d.a)(t,2),l=a[0],o=a[1];return r.a.createElement("div",{className:"Colors"},r.a.createElement("h2",null,"Colors"),e.data&&e.data.colors&&e.data.colors.map(function(t){return r.a.createElement("div",{className:"color",style:{background:t},onClick:function(){P.deleteLayerItemColor(e.match.params.setId,e.match.params.id,t).then(function(t){e.setLayerData(t.data),B.b.info("Color was successfully deleted")}).catch(M)}},r.a.createElement("div",{className:"darken-layout"}),r.a.createElement("div",{className:"delete-icon-wrapper"},r.a.createElement(R.a,null)))}),r.a.createElement(G.a,{enableReinitialize:!0,initialValues:{color:"#ffffff"},onSubmit:function(t,a){var n=a.setSubmitting;P.postLayerItemColor(e.match.params.setId,e.match.params.id,l).then(function(t){B.b.success("Color ".concat(l," was successfully added")),e.setLayerData(t.data)}).catch(M).finally(function(){return n(!1)})}},function(e){e.values,e.errors,e.touched;var t=e.isSubmitting,a=(e.handleChange,e.handleSubmit);return r.a.createElement("form",{onSubmit:a},r.a.createElement("p",null,r.a.createElement($.a,{label:"Add new color",id:"color",name:"color",value:l,onChange:function(e){return o(e)}})),r.a.createElement("p",null,r.a.createElement(T.a,{variant:"contained",type:"submit",color:"primary",disabled:t},r.a.createElement(q.a,null)," Add color")))}))}a(570);function K(e){return r.a.createElement("div",{className:"Images"},r.a.createElement("h2",null,"Layer images"),e.isLoading&&r.a.createElement(_,{position:"absolute"}),r.a.createElement("div",null,e.data.images&&e.data.images.map(function(t){return r.a.createElement("div",{className:"image-container"},r.a.createElement("div",{className:"image-wrapper",onClick:function(){return e.onImageDelete(t._id)}},r.a.createElement("img",{src:t.value,alt:""}),r.a.createElement("div",{className:"delete-icon-wrapper"},r.a.createElement(R.a,null))))})),r.a.createElement(J.a,{multiple:!0,onDrop:function(t){return e.onImageSubmit(t)}},function(e){var t=e.getRootProps,a=e.getInputProps;return r.a.createElement("div",{className:"container"},r.a.createElement("div",Object.assign({className:"dropzone"},t()),r.a.createElement("input",a()),r.a.createElement("p",null,"Drag 'n' drop some files here, or click to select files")))}))}a(571);var Q=a(72),X=a.n(Q),Y=a(73),ee=a.n(Y),te=a(229),ae=a.n(te),ne=a(71),re=a.n(ne),le=a(70),oe=a.n(le),ce=a(51),ie=a.n(ce),ue=a(144),se=a.n(ue),me=a(227),de=a.n(me),fe=a(228),he=a.n(fe);function pe(e){var t=e.data?{title:e.data.title||"",zIndex:e.data.zIndex||"",conflictsWith:e.data.conflictsWith||[],inheritColorFrom:e.data.inheritColorFrom||null,showOnStart:e.data.showOnStart||!1}:{},a=Object(n.useState)([]),l=Object(d.a)(a,2),o=l[0],c=l[1];return Object(n.useEffect)(function(){P.getLayers(e.match.params.setId).then(function(t){if(t.data&&t.data.layers){var a=t.data.layers;a=a.filter(function(t){return t._id!==e.match.params.id}),c(a)}}).catch(M)},[]),r.a.createElement("div",{className:"Form"},r.a.createElement("h2",null,"Basic"),r.a.createElement(G.a,{enableReinitialize:!0,initialValues:t,onSubmit:function(t,a){var n=a.setSubmitting;e.onSubmit(t).then(function(e){B.b.success("Form was successfully saved")}).catch(M).finally(function(){return n(!1)})}},function(e){var t=e.values,a=e.errors,n=e.touched,l=e.isSubmitting,c=e.handleChange,i=e.handleSubmit;return r.a.createElement("form",{onSubmit:i},r.a.createElement("div",null,r.a.createElement(V.a,{id:"title",label:"Title",value:t.title,onChange:c,margin:"normal",variant:"outlined",className:"full-width"})),r.a.createElement("div",null,r.a.createElement(V.a,{id:"zIndex",label:"zIndex",type:"number",value:t.zIndex,onChange:c,margin:"normal",variant:"outlined",className:"full-width"})),r.a.createElement("div",null,r.a.createElement(de.a,{control:r.a.createElement(he.a,{id:"showOnStart",name:"showOnStart",checked:t.showOnStart,onChange:c,color:"primary"}),label:"Show layer image on start"})),r.a.createElement("div",null,r.a.createElement(oe.a,null,r.a.createElement(X.a,{id:"inheritColorFrom",name:"inheritColorFrom",className:"multiselect",value:t.inheritColorFrom,onChange:c,input:r.a.createElement(ie.a,{name:"age",id:"age-helper"})},r.a.createElement(ee.a,{value:null},"None"),o.map(function(e){return r.a.createElement(ee.a,{key:e._id,value:e._id},e.title)})),r.a.createElement(re.a,null,"Inherits colos from"))),r.a.createElement("div",null,r.a.createElement(oe.a,null,r.a.createElement(X.a,{id:"conflictsWith",name:"conflictsWith",className:"multiselect full-width",multiple:!0,value:t.conflictsWith,onChange:c,input:r.a.createElement(ie.a,{id:"select-multiple-chip"}),renderValue:function(e){return r.a.createElement("div",null,e.map(function(e){var t=o.find(function(t){return t._id===e});return t?r.a.createElement(se.a,{key:e,label:t.title}):null}))}},o.map(function(e){return r.a.createElement(ee.a,{key:e._id,value:e._id},e.title)})),r.a.createElement(re.a,null,"Conflicts with"))),a.email&&n.email&&r.a.createElement("div",{className:"input-feedback"},a.email),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(T.a,{variant:"contained",type:"submit",color:"primary",disabled:l},r.a.createElement(ae.a,null)," Submit"))}))}function ve(e){var t=Object(n.useState)({}),a=Object(d.a)(t,2),l=a[0],o=a[1],c=Object(n.useState)(!0),i=Object(d.a)(c,2),u=i[0],s=i[1];return Object(n.useEffect)(function(){s(!0),P.getLayerItems(e.match.params.setId,e.match.params.id).then(function(e){o(e.data)}).catch(M).finally(function(){return s(!1)})},[e.match.params]),r.a.createElement(S.a,{className:"Paper-main LayerItems"},r.a.createElement(T.a,{color:"primary",onClick:e.history.goBack},"Back to Layers"),r.a.createElement("div",{className:"form-container"},r.a.createElement(pe,{match:e.match,data:l,onSubmit:function(t){return P.patchLayerItem(e.match.params.setId,e.match.params.id,t).then(function(){}).catch(M)}})),r.a.createElement(H,{match:e.match,data:l,setLayerData:o}),r.a.createElement(K,{data:l,onImageDelete:function(t){s(!0),P.deleteLayerItemImage(e.match.params.setId,e.match.params.id,t).then(function(e){B.b.info("Image was successfully deleted"),o(e.data)}).catch(M).finally(function(){return s(!1)})},onImageSubmit:function(t){var a=t;s(!0),P.postLayerItemsImages(e.match.params.setId,e.match.params.id,a).then(function(e){B.b.success("Image was successfully added"),o(e.data)}).catch(M).finally(function(){return s(!1)})},isLoading:u}))}function Ee(e){var t=Object(n.useState)(!1),a=Object(d.a)(t,2);a[0],a[1];return r.a.createElement(S.a,{className:"Paper-main LayerItems"},r.a.createElement(T.a,{color:"primary",onClick:e.history.goBack},"Back to Layers"),r.a.createElement("h2",null,"Add New Layer"),r.a.createElement("div",{className:"form-container"},r.a.createElement(pe,{match:e.match,data:{},onSubmit:function(t){return P.addLayer(e.match.params.setId,t).then(function(t){e.history.push("/"+e.match.params.setId+"/"+t.data.id)})}})))}a(588);function ge(e){return r.a.createElement(S.a,{className:"Paper-main Login"},r.a.createElement("h2",null,"Login"),r.a.createElement(G.a,{enableReinitialize:!0,initialValues:{login:"",password:""},onSubmit:function(t,a){var n=a.setSubmitting;P.login(t).then(function(t){n(!1),e.history.push("../")}).catch(function(e){n(!1),B.b.error("Incorrect login or password")})}},function(e){var t=e.values,a=e.errors,n=e.touched,l=e.isSubmitting,o=e.handleChange,c=e.handleSubmit;return r.a.createElement("form",{onSubmit:c},r.a.createElement("div",null,r.a.createElement(V.a,{id:"login",label:"Login",value:t.login,onChange:o,margin:"normal",variant:"outlined",className:"full-width"})),r.a.createElement("div",null,r.a.createElement(V.a,{id:"password",label:"Password",type:"password",value:t.password,onChange:o,margin:"normal",variant:"outlined",className:"full-width"})),r.a.createElement("br",null),a.email&&n.email&&r.a.createElement("div",{className:"input-feedback"},a.email),r.a.createElement(T.a,{variant:"contained",type:"submit",color:"primary",disabled:l},"Submit"))}))}var be=a(38),ye=a(52),we=a(230),ke=a.n(we),Ce=a(231),Oe=a.n(Ce),Ie=a(105),Se=a.n(Ie),je=a(143),Ne=a.n(je),Le=a(232),xe=a.n(Le),Pe=(a(589),a(590),a(591),function(e){function t(){return Object(c.a)(this,t),Object(u.a)(this,Object(s.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(B.a,{autoClose:5e3,hideProgressBar:!0}),r.a.createElement("div",{className:"App-content"},r.a.createElement(ke.a,{position:"static"},r.a.createElement(Oe.a,null,r.a.createElement(Ne.a,{color:"inherit","aria-label":"Menu"},r.a.createElement(xe.a,null)),r.a.createElement(Se.a,{variant:"h6",color:"inherit"},"Avatar Platform Admin Panel"))),r.a.createElement(be.a,null,r.a.createElement(ye.c,null,r.a.createElement(ye.a,{path:"/",exact:!0,component:W}),r.a.createElement(ye.a,{path:"/login",exact:!0,component:ge}),r.a.createElement(ye.a,{path:"/:setId",exact:!0,component:U}),r.a.createElement(ye.a,{path:"/:setId/add",component:Ee}),r.a.createElement(ye.a,{path:"/:setId/:id",component:ve})))),r.a.createElement("footer",{className:"App-footer"},r.a.createElement(Se.a,{variant:"subtitle1",align:"center",color:"textSecondary",component:"p"},"\xa9 Some Copyright")))}}]),t}(r.a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(Pe,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[235,1,2]]]);
//# sourceMappingURL=main.095986de.chunk.js.map