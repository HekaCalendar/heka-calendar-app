var e={};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=63&i|128):55296==(64512&i)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++r)),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=63&i|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=63&i|128)}return t},n={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){const t=e[i],s=i+1<e.length,o=s?e[i+1]:0,a=i+2<e.length,c=a?e[i+2]:0,u=t>>2,l=(3&t)<<4|o>>4;let h=(15&o)<<2|c>>6,d=63&c;a||(d=64,s||(h=64)),r.push(n[u],n[l],n[h],n[d])}return r.join("")},encodeString(e,n){return this.HAS_NATIVE_SUPPORT&&!n?btoa(e):this.encodeByteArray(t(e),n)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,r=0;for(;n<e.length;){const i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=e[n++];t[r++]=String.fromCharCode((31&i)<<6|63&s)}else if(i>239&&i<365){const s=((7&i)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(s>>10)),t[r++]=String.fromCharCode(56320+(1023&s))}else{const s=e[n++],o=e[n++];t[r++]=String.fromCharCode((15&i)<<12|(63&s)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<e.length;){const t=n[e.charAt(s++)],o=s<e.length?n[e.charAt(s)]:0;++s;const a=s<e.length?n[e.charAt(s)]:64;++s;const c=s<e.length?n[e.charAt(s)]:64;if(++s,null==t||null==o||null==a||null==c)throw new r;const u=t<<2|o>>4;if(i.push(u),64!==a){const e=o<<4&240|a>>2;if(i.push(e),64!==c){const e=a<<6&192|c;i.push(e)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class r extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const i=function(e){return function(e){const r=t(e);return n.encodeByteArray(r,!0)}(e).replace(/\./g,"")},s=function(e){try{return n.decodeString(e,!0)}catch(t){}return null};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function o(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a=()=>{try{return o().__FIREBASE_DEFAULTS__||(()=>{if("undefined"==typeof process)return;const t=e.__FIREBASE_DEFAULTS__;return t?JSON.parse(t):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&s(e[1]);return t&&JSON.parse(t)})()}catch(t){return}},c=e=>{var t,n;return null==(n=null==(t=a())?void 0:t.emulatorHosts)?void 0:n[e]},u=e=>{const t=c(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),r]:[t.substring(0,n),r]},l=()=>{var e;return null==(e=a())?void 0:e.config},h=e=>{var t;return null==(t=a())?void 0:t[`_${e}`]};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class d{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function p(e){return(await fetch(e,{credentials:"include"})).ok}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m={};let g=!1;function y(e,t){if("undefined"==typeof window||"undefined"==typeof document||!f(window.location.host)||m[e]===t||m[e]||g)return;function n(e){return`__firebase__banner__${e}`}m[e]=t;const r="__firebase__banner",i=function(){const e={prod:[],emulator:[]};for(const t of Object.keys(m))m[t]?e.emulator.push(t):e.prod.push(t);return e}().prod.length>0;function s(){const e=document.createElement("span");return e.style.cursor="pointer",e.style.marginLeft="16px",e.style.fontSize="24px",e.innerHTML=" &times;",e.onclick=()=>{g=!0,function(){const e=document.getElementById(r);e&&e.remove()}()},e}function o(){const e=function(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}(r),t=n("text"),o=document.getElementById(t)||document.createElement("span"),a=n("learnmore"),c=document.getElementById(a)||document.createElement("a"),u=n("preprendIcon"),l=document.getElementById(u)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(e.created){const t=e.element;!function(e){e.style.display="flex",e.style.background="#7faaf0",e.style.position="fixed",e.style.bottom="5px",e.style.left="5px",e.style.padding=".5em",e.style.borderRadius="5px",e.style.alignItems="center"}(t),function(e,t){e.setAttribute("id",t),e.innerText="Learn more",e.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",e.setAttribute("target","__blank"),e.style.paddingLeft="5px",e.style.textDecoration="underline"}(c,a);const n=s();!function(e,t){e.setAttribute("width","24"),e.setAttribute("id",t),e.setAttribute("height","24"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.style.marginLeft="-6px"}(l,u),t.append(l,o,c,n),document.body.appendChild(t)}i?(o.innerText="Preview backend disconnected.",l.innerHTML='<g clip-path="url(#clip0_6013_33858)">\n<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6013_33858">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>'):(l.innerHTML='<g clip-path="url(#clip0_6083_34804)">\n<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6083_34804">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>',o.innerText="Preview backend running in this workspace."),o.setAttribute("id",t)}"loading"===document.readyState?window.addEventListener("DOMContentLoaded",o):o()}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function w(){var e;const t=null==(e=a())?void 0:e.forceEnvironment;if("node"===t)return!0;if("browser"===t)return!1;try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(n){return!1}}function I(){return!w()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function _(){return!w()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function b(){try{return"object"==typeof indexedDB}catch(e){return!1}}function T(){return new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var e;t((null==(e=i.error)?void 0:e.message)||"")}}catch(n){t(n)}})}class E extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,E.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,S.prototype.create)}}class S{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],s=i?function(e,t){return e.replace(A,(e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`})}(i,n):"Error",o=`${this.serviceName}: ${s} (${r}).`;return new E(r,o,n)}}const A=/\{\$([^}]+)}/g;function C(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const i of n){if(!r.includes(i))return!1;const n=e[i],s=t[i];if(k(n)&&k(s)){if(!C(n,s))return!1}else if(n!==s)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function k(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N(e){const t=[];for(const[n,r]of Object.entries(e))Array.isArray(r)?r.forEach(e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function D(e){const t={};return e.replace(/^\?/,"").split("&").forEach(e=>{if(e){const[n,r]=e.split("=");t[decodeURIComponent(n)]=decodeURIComponent(r)}}),t}function R(e){const t=e.indexOf("?");if(!t)return"";const n=e.indexOf("#",t);return e.substring(t,n>0?n:void 0)}class P{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");r=function(e,t){if("object"!=typeof e||null===e)return!1;for(const n of t)if(n in e&&"function"==typeof e[n])return!0;return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===r.next&&(r.next=O),void 0===r.error&&(r.error=O),void 0===r.complete&&(r.complete=O);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch(e){}}),this.observers.push(r),i}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(n){"undefined"!=typeof console&&console.error}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function O(){}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(e){return e&&e._delegate?e._delegate:e}class L{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new d;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=(null==e?void 0:e.optional)??!1;if(!this.isInitialized(t)&&!this.shouldAutoInitialize()){if(n)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(n)return null;throw r}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:M})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=M){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=M){return this.instances.has(e)}getOptions(e=M){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,s]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(i)&&s.resolve(r)}return r}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(n)??new Set;r.add(e),this.onInitCallbacks.set(n,r);const i=this.instances.get(n);return i&&e(i,n),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const r of n)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===M?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}var r;return n||null}normalizeInstanceIdentifier(e=M){return this.component?this.component.multipleInstances?e:M:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class V{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new F(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var U,q;(q=U||(U={}))[q.DEBUG=0]="DEBUG",q[q.VERBOSE=1]="VERBOSE",q[q.INFO=2]="INFO",q[q.WARN=3]="WARN",q[q.ERROR=4]="ERROR",q[q.SILENT=5]="SILENT";const j={debug:U.DEBUG,verbose:U.VERBOSE,info:U.INFO,warn:U.WARN,error:U.ERROR,silent:U.SILENT},B=U.INFO,z={[U.DEBUG]:"log",[U.VERBOSE]:"log",[U.INFO]:"info",[U.WARN]:"warn",[U.ERROR]:"error"},$=(e,t,...n)=>{if(t<e.logLevel)return;(new Date).toISOString();if(!z[t])throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class K{constructor(e){this.name=e,this._logLevel=B,this._logHandler=$,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in U))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?j[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,U.DEBUG,...e),this._logHandler(this,U.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,U.VERBOSE,...e),this._logHandler(this,U.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,U.INFO,...e),this._logHandler(this,U.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,U.WARN,...e),this._logHandler(this,U.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,U.ERROR,...e),this._logHandler(this,U.ERROR,...e)}}let G,H;const W=new WeakMap,Q=new WeakMap,J=new WeakMap,Y=new WeakMap,X=new WeakMap;let Z={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return Q.get(e);if("objectStoreNames"===t)return e.objectStoreNames||J.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ne(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function ee(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(H||(H=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(re(this),t),ne(W.get(this))}:function(...t){return ne(e.apply(re(this),t))}:function(t,...n){const r=e.call(re(this),t,...n);return J.set(r,t.sort?t.sort():[t]),ne(r)}}function te(e){return"function"==typeof e?ee(e):(e instanceof IDBTransaction&&function(e){if(Q.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});Q.set(e,t)}(e),t=e,(G||(G=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(e=>t instanceof e)?new Proxy(e,Z):e);var t}function ne(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{t(ne(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&W.set(t,e)}).catch(()=>{}),X.set(t,e),t}(e);if(Y.has(e))return Y.get(e);const t=te(e);return t!==e&&(Y.set(e,t),X.set(t,e)),t}const re=e=>X.get(e);function ie(e,t,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(e,t),a=ne(o);return r&&o.addEventListener("upgradeneeded",e=>{r(ne(o.result),e.oldVersion,e.newVersion,ne(o.transaction),e)}),n&&o.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{s&&e.addEventListener("close",()=>s()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}function se(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",e=>t(e.oldVersion,e)),ne(n).then(()=>{})}const oe=["get","getKey","getAll","getAllKeys","count"],ae=["put","add","delete","clear"],ce=new Map;function ue(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(ce.get(t))return ce.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=ae.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!oe.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,i?"readwrite":"readonly");let o=s.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&s.done]))[0]};return ce.set(t,s),s}Z=(e=>({...e,get:(t,n,r)=>ue(t,n)||e.get(t,n,r),has:(t,n)=>!!ue(t,n)||e.has(t,n)}))(Z);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class le{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}const he="@firebase/app",de="0.14.8",fe=new K("@firebase/app"),pe="@firebase/app-compat",me="@firebase/analytics-compat",ge="@firebase/analytics",ye="@firebase/app-check-compat",ve="@firebase/app-check",we="@firebase/auth",Ie="@firebase/auth-compat",_e="@firebase/database",be="@firebase/data-connect",Te="@firebase/database-compat",Ee="@firebase/functions",Se="@firebase/functions-compat",Ae="@firebase/installations",Ce="@firebase/installations-compat",ke="@firebase/messaging",Ne="@firebase/messaging-compat",De="@firebase/performance",Re="@firebase/performance-compat",Pe="@firebase/remote-config",Oe="@firebase/remote-config-compat",xe="@firebase/storage",Le="@firebase/storage-compat",Me="@firebase/firestore",Fe="@firebase/ai",Ve="@firebase/firestore-compat",Ue="firebase",qe="[DEFAULT]",je={[he]:"fire-core",[pe]:"fire-core-compat",[ge]:"fire-analytics",[me]:"fire-analytics-compat",[ve]:"fire-app-check",[ye]:"fire-app-check-compat",[we]:"fire-auth",[Ie]:"fire-auth-compat",[_e]:"fire-rtdb",[be]:"fire-data-connect",[Te]:"fire-rtdb-compat",[Ee]:"fire-fn",[Se]:"fire-fn-compat",[Ae]:"fire-iid",[Ce]:"fire-iid-compat",[ke]:"fire-fcm",[Ne]:"fire-fcm-compat",[De]:"fire-perf",[Re]:"fire-perf-compat",[Pe]:"fire-rc",[Oe]:"fire-rc-compat",[xe]:"fire-gcs",[Le]:"fire-gcs-compat",[Me]:"fire-fst",[Ve]:"fire-fst-compat",[Fe]:"fire-vertex","fire-js":"fire-js",[Ue]:"fire-js-all"},Be=new Map,ze=new Map,$e=new Map;function Ke(e,t){try{e.container.addComponent(t)}catch(n){fe.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function Ge(e){const t=e.name;if($e.has(t))return fe.debug(`There were multiple attempts to register component ${t}.`),!1;$e.set(t,e);for(const n of Be.values())Ke(n,e);for(const n of ze.values())Ke(n,e);return!0}function He(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function We(e){return null!=e&&void 0!==e.settings}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe=new S("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Je{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new L("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Qe.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye="12.9.0";function Xe(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const r={name:qe,automaticDataCollectionEnabled:!0,...t},i=r.name;if("string"!=typeof i||!i)throw Qe.create("bad-app-name",{appName:String(i)});if(n||(n=l()),!n)throw Qe.create("no-options");const s=Be.get(i);if(s){if(C(n,s.options)&&C(r,s.config))return s;throw Qe.create("duplicate-app",{appName:i})}const o=new V(i);for(const c of $e.values())o.addComponent(c);const a=new Je(n,r,o);return Be.set(i,a),a}function Ze(e=qe){const t=Be.get(e);if(!t&&e===qe&&l())return Xe();if(!t)throw Qe.create("no-app",{appName:e});return t}function et(){return Array.from(Be.values())}async function tt(e){let t=!1;const n=e.name;if(Be.has(n))t=!0,Be.delete(n);else if(ze.has(n)){e.decRefCount()<=0&&(ze.delete(n),t=!0)}t&&(await Promise.all(e.container.getProviders().map(e=>e.delete())),e.isDeleted=!0)}function nt(e,t,n){let r=je[e]??e;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=t.match(/\s|\//);if(i||s){const e=[`Unable to register library "${r}" with version "${t}":`];return i&&e.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&e.push("and"),s&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void fe.warn(e.join(" "))}Ge(new L(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rt="firebase-heartbeat-store";let it=null;function st(){return it||(it=ie("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(rt)}catch(n){}}}).catch(e=>{throw Qe.create("idb-open",{originalErrorMessage:e.message})})),it}async function ot(e,t){try{const n=(await st()).transaction(rt,"readwrite"),r=n.objectStore(rt);await r.put(t,at(e)),await n.done}catch(n){if(n instanceof E)fe.warn(n.message);else{const e=Qe.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});fe.warn(e.message)}}}function at(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new lt(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=ut();if(null==(null==(e=this._heartbeatsCache)?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null==(t=this._heartbeatsCache)?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(e=>e.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){fe.warn(n)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null==(e=this._heartbeatsCache)?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=ut(),{heartbeatsToSend:n,unsentEntries:r}=function(e,t=1024){const n=[];let r=e.slice();for(const i of e){const e=n.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),ht(n)>t){e.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),ht(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),s=i(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return fe.warn(t),""}}}function ut(){return(new Date).toISOString().substring(0,10)}class lt{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!b()&&T().then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await st()).transaction(rt),n=await t.objectStore(rt).get(at(e));return await t.done,n}catch(t){if(t instanceof E)fe.warn(t.message);else{const e=Qe.create("idb-get",{originalErrorMessage:null==t?void 0:t.message});fe.warn(e.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return ot(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return ot(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:[...t.heartbeats,...e.heartbeats]})}}}function ht(e){return i(JSON.stringify({version:2,heartbeats:e})).length}var dt;dt="",Ge(new L("platform-logger",e=>new le(e),"PRIVATE")),Ge(new L("heartbeat",e=>new ct(e),"PRIVATE")),nt(he,de,dt),nt(he,de,"esm2020"),nt("fire-js","");
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
nt("firebase","12.9.0","app");function ft(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const pt=
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registered for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements.","invalid-hosting-link-domain":"The provided Hosting link domain is not configured in Firebase Hosting or is not owned by the current project. This cannot be a default Hosting domain (`web.app` or `firebaseapp.com`)."}},mt=ft,gt=new S("auth","Firebase",{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}),yt=new K("@firebase/auth");function vt(e,...t){yt.logLevel<=U.ERROR&&yt.error(`Auth (${Ye}): ${e}`,...t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wt(e,...t){throw Et(e,...t)}function It(e,...t){return Et(e,...t)}function _t(e,t,n){const r={...mt(),[t]:n};return new S("auth","Firebase",r).create(t,{appName:e.name})}function bt(e){return _t(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Tt(e,t,n){if(!(t instanceof n))throw n.name!==t.constructor.name&&wt(e,"argument-error"),_t(e,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Et(e,...t){if("string"!=typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return gt.create(e,...t)}function St(e,t,...n){if(!e)throw Et(t,...n)}function At(e){const t="INTERNAL ASSERTION FAILED: "+e;throw vt(t),new Error(t)}function Ct(e,t){e||At(t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kt(){var e;return"undefined"!=typeof self&&(null==(e=self.location)?void 0:e.href)||""}function Nt(){return"http:"===Dt()||"https:"===Dt()}function Dt(){var e;return"undefined"!=typeof self&&(null==(e=self.location)?void 0:e.protocol)||null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rt(){return!("undefined"!=typeof navigator&&navigator&&"onLine"in navigator&&"boolean"==typeof navigator.onLine&&(Nt()||function(){const e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}()||"connection"in navigator))||navigator.onLine}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pt{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ct(t>e,"Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(v())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return Rt()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ot(e,t){Ct(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void At("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void At("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void At("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lt={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},Mt=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Ft=new Pt(3e4,6e4);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vt(e,t){return e.tenantId&&!t.tenantId?{...t,tenantId:e.tenantId}:t}async function Ut(e,t,n,r,i={}){return qt(e,i,async()=>{let i={},s={};r&&("GET"===t?s=r:i={body:JSON.stringify(r)});const o=N({key:e.config.apiKey,...s}).slice(1),a=await e._getAdditionalHeaders();a["Content-Type"]="application/json",e.languageCode&&(a["X-Firebase-Locale"]=e.languageCode);const c={method:t,headers:a,...i};return"undefined"!=typeof navigator&&"Cloudflare-Workers"===navigator.userAgent||(c.referrerPolicy="no-referrer"),e.emulatorConfig&&f(e.emulatorConfig.host)&&(c.credentials="include"),xt.fetch()(await Bt(e,e.config.apiHost,n,o),c)})}async function qt(e,t,n){e._canInitEmulator=!1;const r={...Lt,...t};try{const t=new $t(e),i=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const s=await i.json();if("needConfirmation"in s)throw Kt(e,"account-exists-with-different-credential",s);if(i.ok&&!("errorMessage"in s))return s;{const t=i.ok?s.errorMessage:s.error.message,[n,o]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===n)throw Kt(e,"credential-already-in-use",s);if("EMAIL_EXISTS"===n)throw Kt(e,"email-already-in-use",s);if("USER_DISABLED"===n)throw Kt(e,"user-disabled",s);const a=r[n]||n.toLowerCase().replace(/[_\s]+/g,"-");if(o)throw _t(e,a,o);wt(e,a)}}catch(i){if(i instanceof E)throw i;wt(e,"network-request-failed",{message:String(i)})}}async function jt(e,t,n,r,i={}){const s=await Ut(e,t,n,r,i);return"mfaPendingCredential"in s&&wt(e,"multi-factor-auth-required",{_serverResponse:s}),s}async function Bt(e,t,n,r){const i=`${t}${n}?${r}`,s=e,o=s.config.emulator?Ot(e.config,i):`${e.config.apiScheme}://${i}`;if(Mt.includes(n)&&(await s._persistenceManagerAvailable,"COOKIE"===s._getPersistenceType())){return s._getPersistence()._getFinalTarget(o).toString()}return o}function zt(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class $t{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(It(this.auth,"network-request-failed")),Ft.get())})}}function Kt(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=It(e,t,r);return i.customData._tokenResponse=n,i}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gt(e){return void 0!==e&&void 0!==e.getResponse}function Ht(e){return void 0!==e&&void 0!==e.enterprise}class Wt{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return zt(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qt(e,t){return Ut(e,"GET","/v2/recaptchaConfig",Vt(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jt(e,t){return Ut(e,"POST","/v1/accounts:lookup",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yt(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xt(e,t=!1){const n=x(e),r=await n.getIdToken(t),i=en(r);St(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s="object"==typeof i.firebase?i.firebase:void 0,o=null==s?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Yt(Zt(i.auth_time)),issuedAtTime:Yt(Zt(i.iat)),expirationTime:Yt(Zt(i.exp)),signInProvider:o||null,signInSecondFactor:(null==s?void 0:s.sign_in_second_factor)||null}}function Zt(e){return 1e3*Number(e)}function en(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return vt("JWT malformed, contained fewer than 3 sections"),null;try{const e=s(n);return e?JSON.parse(e):(vt("Failed to decode base64 JWT payload"),null)}catch(i){return vt("Caught error parsing JWT payload as JSON",null==i?void 0:i.toString()),null}}function tn(e){const t=en(e);return St(t,"internal-error"),St(void 0!==t.exp,"internal-error"),St(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nn(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof E&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}class rn{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===(null==e?void 0:e.code)&&this.schedule(!0))}this.schedule()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Yt(this.lastLoginAt),this.creationTime=Yt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function on(e){var t;const n=e.auth,r=await e.getIdToken(),i=await nn(e,Jt(n,{idToken:r}));St(null==i?void 0:i.users.length,n,"internal-error");const s=i.users[0];e._notifyReloadListener(s);const o=(null==(t=s.providerUserInfo)?void 0:t.length)?cn(s.providerUserInfo):[],a=(c=e.providerData,u=o,[...c.filter(e=>!u.some(t=>t.providerId===e.providerId)),...u]);var c,u;const l=e.isAnonymous,h=!(e.email&&s.passwordHash||(null==a?void 0:a.length)),d=!!l&&h,f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new sn(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(e,f)}async function an(e){const t=x(e);await on(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function cn(e){return e.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class un{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){St(e.idToken,"internal-error"),St(void 0!==e.idToken,"internal-error"),St(void 0!==e.refreshToken,"internal-error");const t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):tn(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){St(0!==e.length,"internal-error");const t=tn(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(St(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null):this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:i}=await async function(e,t){const n=await qt(e,{},async()=>{const n=N({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:i}=e.config,s=await Bt(e,r,"/v1/token",`key=${i}`),o=await e._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const a={method:"POST",headers:o,body:n};return e.emulatorConfig&&f(e.emulatorConfig.host)&&(a.credentials="include"),xt.fetch()(s,a)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}(e,t);this.updateTokensAndExpiration(n,r,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:i}=t,s=new un;return n&&(St("string"==typeof n,"internal-error",{appName:e}),s.refreshToken=n),r&&(St("string"==typeof r,"internal-error",{appName:e}),s.accessToken=r),i&&(St("number"==typeof i,"internal-error",{appName:e}),s.expirationTime=i),s}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new un,this.toJSON())}_performRefresh(){return At("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ln(e,t){St("string"==typeof e||void 0===e,"internal-error",{appName:t})}class hn{constructor({uid:e,auth:t,stsTokenManager:n,...r}){this.providerId="firebase",this.proactiveRefresh=new rn(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new sn(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await nn(this,this.stsTokenManager.getToken(this.auth,e));return St(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Xt(this,e)}reload(){return an(this)}_assign(e){this!==e&&(St(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>({...e})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new hn({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){St(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await on(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(We(this.auth.app))return Promise.reject(bt(this.auth));const e=await this.getIdToken();return await nn(this,async function(e,t){return Ut(e,"POST","/v1/accounts:delete",t)}(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,r=t.email??void 0,i=t.phoneNumber??void 0,s=t.photoURL??void 0,o=t.tenantId??void 0,a=t._redirectEventId??void 0,c=t.createdAt??void 0,u=t.lastLoginAt??void 0,{uid:l,emailVerified:h,isAnonymous:d,providerData:f,stsTokenManager:p}=t;St(l&&p,e,"internal-error");const m=un.fromJSON(this.name,p);St("string"==typeof l,e,"internal-error"),ln(n,e.name),ln(r,e.name),St("boolean"==typeof h,e,"internal-error"),St("boolean"==typeof d,e,"internal-error"),ln(i,e.name),ln(s,e.name),ln(o,e.name),ln(a,e.name),ln(c,e.name),ln(u,e.name);const g=new hn({uid:l,auth:e,email:r,emailVerified:h,displayName:n,isAnonymous:d,photoURL:s,phoneNumber:i,tenantId:o,stsTokenManager:m,createdAt:c,lastLoginAt:u});return f&&Array.isArray(f)&&(g.providerData=f.map(e=>({...e}))),a&&(g._redirectEventId=a),g}static async _fromIdTokenResponse(e,t,n=!1){const r=new un;r.updateFromServerResponse(t);const i=new hn({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await on(i),i}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];St(void 0!==r.localId,"internal-error");const i=void 0!==r.providerUserInfo?cn(r.providerUserInfo):[],s=!(r.email&&r.passwordHash||(null==i?void 0:i.length)),o=new un;o.updateFromIdToken(n);const a=new hn({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:s}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new sn(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash||(null==i?void 0:i.length))};return Object.assign(a,c),a}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dn=new Map;function fn(e){Ct(e instanceof Function,"Expected a class definition");let t=dn.get(e);return t?(Ct(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,dn.set(e,t),t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}pn.type="NONE";const mn=pn;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gn(e,t,n){return`firebase:${e}:${t}:${n}`}class yn{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:i}=this.auth;this.fullUserKey=gn(this.userKey,r.apiKey,i),this.fullPersistenceKey=gn("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if("string"==typeof e){const t=await Jt(this.auth,{idToken:e}).catch(()=>{});return t?hn._fromGetAccountInfoResponse(this.auth,t,e):null}return hn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new yn(fn(mn),e,n);const r=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e);let i=r[0]||fn(mn);const s=gn(n,e.config.apiKey,e.name);let o=null;for(const c of t)try{const t=await c._get(s);if(t){let n;if("string"==typeof t){const r=await Jt(e,{idToken:t}).catch(()=>{});if(!r)break;n=await hn._fromGetAccountInfoResponse(e,r,t)}else n=hn._fromJSON(e,t);c!==i&&(o=n),i=c;break}}catch{}const a=r.filter(e=>e._shouldAllowMigration);return i._shouldAllowMigration&&a.length?(i=a[0],o&&await i._set(s,o.toJSON()),await Promise.all(t.map(async e=>{if(e!==i)try{await e._remove(s)}catch{}})),new yn(i,e,n)):new yn(i,e,n)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vn(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(bn(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(wn(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(En(t))return"Blackberry";if(Sn(t))return"Webos";if(In(t))return"Safari";if((t.includes("chrome/")||_n(t))&&!t.includes("edge/"))return"Chrome";if(Tn(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===(null==n?void 0:n.length))return n[1]}return"Other"}function wn(e=v()){return/firefox\//i.test(e)}function In(e=v()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function _n(e=v()){return/crios\//i.test(e)}function bn(e=v()){return/iemobile/i.test(e)}function Tn(e=v()){return/android/i.test(e)}function En(e=v()){return/blackberry/i.test(e)}function Sn(e=v()){return/webos/i.test(e)}function An(e=v()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function Cn(){return function(){const e=v();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}()&&10===document.documentMode}function kn(e=v()){return An(e)||Tn(e)||Sn(e)||En(e)||/windows phone/i.test(e)||bn(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nn(e,t=[]){let n;switch(e){case"Browser":n=vn(v());break;case"Worker":n=`${vn(v())}-${e}`;break;default:n=e}const r=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ye}/${r}`}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=t=>new Promise((n,r)=>{try{n(e(t))}catch(i){r(i)}});n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const e of t)try{e()}catch(r){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==n?void 0:n.message})}}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn{constructor(e){var t;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??6,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),void 0!==n.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),void 0!==n.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),void 0!==n.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),void 0!==n.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(null==(t=e.allowedNonAlphanumericCharacters)?void 0:t.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){let n;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new xn(this),this.idTokenSubscription=new xn(this),this.beforeStateQueue=new Dn(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=gt,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(e=>this._resolvePersistenceManagerAvailable=e)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=fn(t)),this._initializationPromise=this.queue(async()=>{var n,r,i;if(!this._deleted&&(this.persistenceManager=await yn.create(this,e),null==(n=this._resolvePersistenceManagerAvailable)||n.call(this),!this._deleted)){if(null==(r=this._popupRedirectResolver)?void 0:r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(s){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null==(i=this.currentUser)?void 0:i.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void(await this.currentUser.getIdToken())):void(await this._updateCurrentUser(e,!0)):void 0}async initializeCurrentUserFromIdToken(e){try{const t=await Jt(this,{idToken:e}),n=await hn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(We(this.app)){const e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const n=null==(t=this.redirectUser)?void 0:t._redirectEventId,s=null==r?void 0:r._redirectEventId,o=await this.tryRedirectSignIn(e);n&&n!==s||!(null==o?void 0:o.user)||(r=o.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(s){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(s))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return St(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await on(e)}catch(t){if("auth/network-request-failed"!==(null==t?void 0:t.code))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(We(this.app))return Promise.reject(bt(this));const t=e?x(e):null;return t&&St(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&St(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return We(this.app)?Promise.reject(bt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return We(this.app)?Promise.reject(bt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(fn(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await async function(e,t={}){return Ut(e,"GET","/v2/passwordPolicy",Vt(e,t))}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this),t=new Rn(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new S("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:await this.currentUser.getIdToken()};null!=this.tenantId&&(t.tenantId=this.tenantId),await async function(e,t){return Ut(e,"POST","/v2/accounts:revokeToken",Vt(e,t))}(this,t)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null==(e=this._currentUser)?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&fn(e)||this._popupRedirectResolver;St(t,this,"argument-error"),this.redirectPersistenceManager=await yn.create(this,[fn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),(null==(t=this._currentUser)?void 0:t._redirectEventId)===e?this._currentUser:(null==(n=this.redirectUser)?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const t=(null==(e=this.currentUser)?void 0:e.uid)??null;this.lastNotifiedUid!==t&&(this.lastNotifiedUid=t,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const i="function"==typeof t?t:t.next.bind(t);let s=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(St(o,this,"internal-error"),o.then(()=>{s||i(this.currentUser)}),"function"==typeof t){const i=e.addObserver(t,n,r);return()=>{s=!0,i()}}{const n=e.addObserver(t);return()=>{s=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return St(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Nn(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await(null==(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(We(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await(null==(e=this.appCheckServiceProvider.getImmediate({optional:!0}))?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){yt.logLevel<=U.WARN&&yt.warn(`Auth (${Ye}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}}function On(e){return x(e)}class xn{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e,t){const n=new P(e,t);return n.subscribe.bind(n)}(e=>this.observer=e)}get next(){return St(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ln={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Mn(e){return Ln.loadJS(e)}function Fn(e){return`__${e}${Math.floor(1e6*Math.random())}`}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vn=1e12;class Un{constructor(e){this.auth=e,this.counter=Vn,this._widgets=new Map}render(e,t){const n=this.counter;return this._widgets.set(n,new Bn(e,this.auth.name,t||{})),this.counter++,n}reset(e){var t;const n=e||Vn;null==(t=this._widgets.get(n))||t.delete(),this._widgets.delete(n)}getResponse(e){var t;const n=e||Vn;return(null==(t=this._widgets.get(n))?void 0:t.getResponse())||""}async execute(e){var t;const n=e||Vn;return null==(t=this._widgets.get(n))||t.execute(),""}}class qn{constructor(){this.enterprise=new jn}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class jn{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Bn{constructor(e,t,n){this.params=n,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const r="string"==typeof e?document.getElementById(e):e;St(r,"argument-error",{appName:t}),this.container=r,this.isVisible="invisible"!==this.params.size,this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),this.timerId||(this.timerId=window.setTimeout(()=>{this.responseToken=function(e){const t=[],n="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let r=0;r<e;r++)t.push(n.charAt(Math.floor(Math.random()*n.length)));return t.join("")}(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch(n){}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch(n){}this.isVisible&&this.execute()},6e4)},500))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}const zn="NO_RECAPTCHA";class $n{constructor(e){this.type="recaptcha-enterprise",this.auth=On(e)}async verify(e="verify",t=!1){function n(t,n,r){const i=window.grecaptcha;Ht(i)?i.enterprise.ready(()=>{i.enterprise.execute(t,{action:e}).then(e=>{n(e)}).catch(()=>{n(zn)})}):r(Error("No reCAPTCHA enterprise script loaded."))}if(this.auth.settings.appVerificationDisabledForTesting){return(new qn).execute("siteKey",{action:"verify"})}return new Promise((e,r)=>{(async function(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,n)=>{Qt(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(r=>{if(void 0!==r.recaptchaKey){const n=new Wt(r);return null==e.tenantId?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,t(n.siteKey)}n(new Error("recaptcha Enterprise site key undefined"))}).catch(e=>{n(e)})})})(this.auth).then(i=>{if(!t&&Ht(window.grecaptcha))n(i,e,r);else{if("undefined"==typeof window)return void r(new Error("RecaptchaVerifier is only supported in browser"));let t=Ln.recaptchaEnterpriseScript;0!==t.length&&(t+=i),Mn(t).then(()=>{n(i,e,r)}).catch(e=>{r(e)})}}).catch(e=>{r(e)})})}}async function Kn(e,t,n,r=!1,i=!1){const s=new $n(e);let o;if(i)o=zn;else try{o=await s.verify(n)}catch(c){o=await s.verify(n,!0)}const a={...t};if("mfaSmsEnrollment"===n||"mfaSmsSignIn"===n){if("phoneEnrollmentInfo"in a){const e=a.phoneEnrollmentInfo.phoneNumber,t=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:t,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const e=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:e,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Gn(e,t,n,r,i){var s,o;if("EMAIL_PASSWORD_PROVIDER"===i){if(null==(s=e._getRecaptchaConfig())?void 0:s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Kn(e,t,n,"getOobCode"===n);return r(e,i)}return r(e,t).catch(async i=>{if("auth/missing-recaptcha-token"===i.code){const i=await Kn(e,t,n,"getOobCode"===n);return r(e,i)}return Promise.reject(i)})}if("PHONE_PROVIDER"===i){if(null==(o=e._getRecaptchaConfig())?void 0:o.isProviderEnabled("PHONE_PROVIDER")){const i=await Kn(e,t,n);return r(e,i).catch(async i=>{var s;if("AUDIT"===(null==(s=e._getRecaptchaConfig())?void 0:s.getProviderEnforcementState("PHONE_PROVIDER"))&&("auth/missing-recaptcha-token"===i.code||"auth/invalid-app-credential"===i.code)){const i=await Kn(e,t,n,!1,!0);return r(e,i)}return Promise.reject(i)})}{const i=await Kn(e,t,n,!1,!0);return r(e,i)}}return Promise.reject(i+" provider is not supported.")}async function Hn(e){const t=On(e),n=await Qt(t,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new Wt(n);if(null==t.tenantId?t._agentRecaptchaConfig=r:t._tenantRecaptchaConfigs[t.tenantId]=r,r.isAnyProviderEnabled()){new $n(t).verify()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wn(e,t){const n=He(e,"auth");if(n.isInitialized()){const e=n.getImmediate();if(C(n.getOptions(),t??{}))return e;wt(e,"already-initialized")}return n.initialize({options:t})}function Qn(e,t,n){const r=On(e);St(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const i=!!(null==n?void 0:n.disableWarnings),s=Jn(t),{host:o,port:a}=function(e){const t=Jn(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const e=i[1];return{host:e,port:Yn(r.substr(e.length+1))}}{const[e,t]=r.split(":");return{host:e,port:Yn(t)}}}(t),c=null===a?"":`:${a}`,u={url:`${s}//${o}${c}/`},l=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator)return St(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),void St(C(u,r.config.emulator)&&C(l,r.emulatorConfig),r,"emulator-config-failed");r.config.emulator=u,r.emulatorConfig=l,r.settings.appVerificationDisabledForTesting=!0,f(o)?(p(`${s}//${o}${c}`),y("Auth",!0)):i||function(){function e(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&console.info;"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */()}function Jn(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function Yn(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}class Xn{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return At("not implemented")}_getIdTokenResponse(e){return At("not implemented")}_linkToIdToken(e,t){return At("not implemented")}_getReauthenticationResolver(e){return At("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zn(e,t){return Ut(e,"POST","/v1/accounts:resetPassword",Vt(e,t))}async function er(e,t){return Ut(e,"POST","/v1/accounts:signUp",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function tr(e,t){return jt(e,"POST","/v1/accounts:signInWithPassword",Vt(e,t))}async function nr(e,t){return Ut(e,"POST","/v1/accounts:sendOobCode",Vt(e,t))}async function rr(e,t){return nr(e,t)}async function ir(e,t){return nr(e,t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class sr extends Xn{constructor(e,t,n,r=null){super("password",n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new sr(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new sr(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":return Gn(e,{returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signInWithPassword",tr,"EMAIL_PASSWORD_PROVIDER");case"emailLink":
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return async function(e,t){return jt(e,"POST","/v1/accounts:signInWithEmailLink",Vt(e,t))}(e,{email:this._email,oobCode:this._password});default:wt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return Gn(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",er,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return async function(e,t){return jt(e,"POST","/v1/accounts:signInWithEmailLink",Vt(e,t))}(e,{idToken:t,email:this._email,oobCode:this._password});default:wt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function or(e,t){return jt(e,"POST","/v1/accounts:signInWithIdp",Vt(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar extends Xn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ar(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):wt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r,...i}=t;if(!n||!r)return null;const s=new ar(n,r);return s.idToken=i.idToken||void 0,s.accessToken=i.accessToken||void 0,s.secret=i.secret,s.nonce=i.nonce,s.pendingToken=i.pendingToken||null,s}_getIdTokenResponse(e){return or(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,or(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,or(e,t)}buildRequest(){const e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=N(t)}return e}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cr(e,t){return Ut(e,"POST","/v1/accounts:sendVerificationCode",Vt(e,t))}const ur={USER_NOT_FOUND:"user-not-found"};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class lr extends Xn{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new lr({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new lr({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return async function(e,t){return jt(e,"POST","/v1/accounts:signInWithPhoneNumber",Vt(e,t))}(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return async function(e,t){const n=await jt(e,"POST","/v1/accounts:signInWithPhoneNumber",Vt(e,t));if(n.temporaryProof)throw Kt(e,"account-exists-with-different-credential",n);return n}(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return async function(e,t){return jt(e,"POST","/v1/accounts:signInWithPhoneNumber",Vt(e,{...t,operation:"REAUTH"}),ur)}(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:n,verificationCode:r}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:n,code:r}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){"string"==typeof e&&(e=JSON.parse(e));const{verificationId:t,verificationCode:n,phoneNumber:r,temporaryProof:i}=e;return n||t||r||i?new lr({verificationId:t,verificationCode:n,phoneNumber:r,temporaryProof:i}):null}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(e){const t=D(R(e)),n=t.apiKey??null,r=t.oobCode??null,i=function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(t.mode??null);St(n&&r&&i,"argument-error"),this.apiKey=n,this.operation=i,this.code=r,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=function(e){const t=D(R(e)).link,n=t?D(R(t)).deep_link_id:null,r=D(R(e)).deep_link_id;return(r?D(R(r)).link:null)||r||n||t||e}(e);try{return new hr(t)}catch{return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class dr{constructor(){this.providerId=dr.PROVIDER_ID}static credential(e,t){return sr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=hr.parseLink(t);return St(n,"argument-error"),sr._fromEmailAndCode(e,n.code,n.tenantId)}}dr.PROVIDER_ID="password",dr.EMAIL_PASSWORD_SIGN_IN_METHOD="password",dr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class fr{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pr extends fr{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class mr extends pr{static credentialFromJSON(e){const t="string"==typeof e?JSON.parse(e):e;return St("providerId"in t&&"signInMethod"in t,"argument-error"),ar._fromParams(t)}credential(e){return this._credential({...e,nonce:e.rawNonce})}_credential(e){return St(e.idToken||e.accessToken,"argument-error"),ar._fromParams({...e,providerId:this.providerId,signInMethod:this.providerId})}static credentialFromResult(e){return mr.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return mr.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n,oauthTokenSecret:r,pendingToken:i,nonce:s,providerId:o}=e;if(!(n||r||t||i))return null;if(!o)return null;try{return new mr(o)._credential({idToken:t,accessToken:n,nonce:s,pendingToken:i})}catch(a){return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr extends pr{constructor(){super("facebook.com")}static credential(e){return ar._fromParams({providerId:gr.PROVIDER_ID,signInMethod:gr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return gr.credentialFromTaggedObject(e)}static credentialFromError(e){return gr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return gr.credential(e.oauthAccessToken)}catch{return null}}}gr.FACEBOOK_SIGN_IN_METHOD="facebook.com",gr.PROVIDER_ID="facebook.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class yr extends pr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ar._fromParams({providerId:yr.PROVIDER_ID,signInMethod:yr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return yr.credentialFromTaggedObject(e)}static credentialFromError(e){return yr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return yr.credential(t,n)}catch{return null}}}yr.GOOGLE_SIGN_IN_METHOD="google.com",yr.PROVIDER_ID="google.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class vr extends pr{constructor(){super("github.com")}static credential(e){return ar._fromParams({providerId:vr.PROVIDER_ID,signInMethod:vr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return vr.credentialFromTaggedObject(e)}static credentialFromError(e){return vr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return vr.credential(e.oauthAccessToken)}catch{return null}}}vr.GITHUB_SIGN_IN_METHOD="github.com",vr.PROVIDER_ID="github.com";class wr extends Xn{constructor(e,t){super(e,e),this.pendingToken=t}_getIdTokenResponse(e){return or(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,or(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,or(e,t)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r,pendingToken:i}=t;return n&&r&&i&&n===r?new wr(n,i):null}static _create(e,t){return new wr(e,t)}buildRequest(){return{requestUri:"http://localhost",returnSecureToken:!0,pendingToken:this.pendingToken}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ir extends fr{constructor(e){St(e.startsWith("saml."),"argument-error"),super(e)}static credentialFromResult(e){return Ir.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return Ir.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){const t=wr.fromJSON(e);return St(t,"argument-error"),t}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{pendingToken:t,providerId:n}=e;if(!t||!n)return null;try{return wr._create(n,t)}catch(r){return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _r extends pr{constructor(){super("twitter.com")}static credential(e,t){return ar._fromParams({providerId:_r.PROVIDER_ID,signInMethod:_r.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return _r.credentialFromTaggedObject(e)}static credentialFromError(e){return _r.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return _r.credential(t,n)}catch{return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function br(e,t){return jt(e,"POST","/v1/accounts:signUp",Vt(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */_r.TWITTER_SIGN_IN_METHOD="twitter.com",_r.PROVIDER_ID="twitter.com";class Tr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const i=await hn._fromIdTokenResponse(e,n,r),s=Er(n);return new Tr({user:i,providerId:s,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=Er(n);return new Tr({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function Er(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sr(e){var t;if(We(e.app))return Promise.reject(bt(e));const n=On(e);if(await n._initializationPromise,null==(t=n.currentUser)?void 0:t.isAnonymous)return new Tr({user:n.currentUser,providerId:null,operationType:"signIn"});const r=await br(n,{returnSecureToken:!0}),i=await Tr._fromIdTokenResponse(n,"signIn",r,!0);return await n._updateCurrentUser(i.user),i}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ar extends E{constructor(e,t,n,r){super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Ar.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Ar(e,t,n,r)}}function Cr(e,t,n,r){return("reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(n=>{if("auth/multi-factor-auth-required"===n.code)throw Ar._fromErrorAndOperation(e,n,t,r);throw n})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kr(e){return new Set(e.map(({providerId:e})=>e).filter(e=>!!e))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nr(e,t){const n=x(e);await Rr(!0,n,t);const{providerUserInfo:r}=await async function(e,t){return Ut(e,"POST","/v1/accounts:update",t)}(n.auth,{idToken:await n.getIdToken(),deleteProvider:[t]}),i=kr(r||[]);return n.providerData=n.providerData.filter(e=>i.has(e.providerId)),i.has("phone")||(n.phoneNumber=null),await n.auth._persistUserIfCurrent(n),n}async function Dr(e,t,n=!1){const r=await nn(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return Tr._forOperation(e,"link",r)}async function Rr(e,t,n){await on(t);const r=!1===e?"provider-already-linked":"no-such-provider";St(kr(t.providerData).has(n)===e,t.auth,r)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pr(e,t,n=!1){const{auth:r}=e;if(We(r.app))return Promise.reject(bt(r));const i="reauthenticate";try{const s=await nn(e,Cr(r,i,t,e),n);St(s.idToken,r,"internal-error");const o=en(s.idToken);St(o,r,"internal-error");const{sub:a}=o;return St(e.uid===a,r,"user-mismatch"),Tr._forOperation(e,i,s)}catch(s){throw"auth/user-not-found"===(null==s?void 0:s.code)&&wt(r,"user-mismatch"),s}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Or(e,t,n=!1){if(We(e.app))return Promise.reject(bt(e));const r="signIn",i=await Cr(e,r,t),s=await Tr._fromIdTokenResponse(e,r,i);return n||await e._updateCurrentUser(s.user),s}async function xr(e,t){return Or(On(e),t)}async function Lr(e,t){const n=x(e);return await Rr(!1,n,t.providerId),Dr(n,t)}async function Mr(e,t){return Pr(x(e),t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Fr(e,t){if(We(e.app))return Promise.reject(bt(e));const n=On(e),r=await async function(e,t){return jt(e,"POST","/v1/accounts:signInWithCustomToken",Vt(e,t))}(n,{token:t,returnSecureToken:!0}),i=await Tr._fromIdTokenResponse(n,"signIn",r);return await n._updateCurrentUser(i.user),i}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vr{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?Ur._fromServerResponse(e,t):"totpInfo"in t?qr._fromServerResponse(e,t):wt(e,"internal-error")}}class Ur extends Vr{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new Ur(t)}}class qr extends Vr{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new qr(t)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jr(e,t,n){var r;St((null==(r=n.url)?void 0:r.length)>0,e,"invalid-continue-uri"),St(void 0===n.dynamicLinkDomain||n.dynamicLinkDomain.length>0,e,"invalid-dynamic-link-domain"),St(void 0===n.linkDomain||n.linkDomain.length>0,e,"invalid-hosting-link-domain"),t.continueUrl=n.url,t.dynamicLinkDomain=n.dynamicLinkDomain,t.linkDomain=n.linkDomain,t.canHandleCodeInApp=n.handleCodeInApp,n.iOS&&(St(n.iOS.bundleId.length>0,e,"missing-ios-bundle-id"),t.iOSBundleId=n.iOS.bundleId),n.android&&(St(n.android.packageName.length>0,e,"missing-android-pkg-name"),t.androidInstallApp=n.android.installApp,t.androidMinimumVersionCode=n.android.minimumVersion,t.androidPackageName=n.android.packageName)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Br(e){const t=On(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function zr(e,t,n){const r=On(e),i={requestType:"PASSWORD_RESET",email:t,clientType:"CLIENT_TYPE_WEB"};n&&jr(r,i,n),await Gn(r,i,"getOobCode",rr,"EMAIL_PASSWORD_PROVIDER")}async function $r(e,t,n){await Zn(x(e),{oobCode:t,newPassword:n}).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Br(e),t})}async function Kr(e,t){await async function(e,t){return Ut(e,"POST","/v1/accounts:update",Vt(e,t))}(x(e),{oobCode:t})}async function Gr(e,t){const n=x(e),r=await Zn(n,{oobCode:t}),i=r.requestType;switch(St(i,n,"internal-error"),i){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":St(r.newEmail,n,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":St(r.mfaInfo,n,"internal-error");default:St(r.email,n,"internal-error")}let s=null;return r.mfaInfo&&(s=Vr._fromServerResponse(On(n),r.mfaInfo)),{data:{email:("VERIFY_AND_CHANGE_EMAIL"===r.requestType?r.newEmail:r.email)||null,previousEmail:("VERIFY_AND_CHANGE_EMAIL"===r.requestType?r.email:r.newEmail)||null,multiFactorInfo:s},operation:i}}async function Hr(e,t,n){if(We(e.app))return Promise.reject(bt(e));const r=On(e),i=Gn(r,{returnSecureToken:!0,email:t,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",br,"EMAIL_PASSWORD_PROVIDER"),s=await i.catch(t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Br(e),t}),o=await Tr._fromIdTokenResponse(r,"signIn",s);return await r._updateCurrentUser(o.user),o}function Wr(e,t,n){return We(e.app)?Promise.reject(bt(e)):xr(x(e),dr.credential(t,n)).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Br(e),t})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qr(e,t,n){const r=On(e),i={requestType:"EMAIL_SIGNIN",email:t,clientType:"CLIENT_TYPE_WEB"};var s,o;s=i,St((o=n).handleCodeInApp,r,"argument-error"),o&&jr(r,s,o),await Gn(r,i,"getOobCode",ir,"EMAIL_PASSWORD_PROVIDER")}function Jr(e,t){const n=hr.parseLink(t);return"EMAIL_SIGNIN"===(null==n?void 0:n.operation)}async function Yr(e,t,n){if(We(e.app))return Promise.reject(bt(e));const r=x(e),i=dr.credentialWithLink(t,n||kt());return St(i._tenantId===(r.tenantId||null),r,"tenant-id-mismatch"),xr(r,i)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Xr(e,t){const n={identifier:t,continueUri:Nt()?kt():"http://localhost"},{signinMethods:r}=await async function(e,t){return Ut(e,"POST","/v1/accounts:createAuthUri",Vt(e,t))}(x(e),n);return r||[]}async function Zr(e,t){const n=x(e),r={requestType:"VERIFY_EMAIL",idToken:await e.getIdToken()};t&&jr(n.auth,r,t);const{email:i}=await async function(e,t){return nr(e,t)}(n.auth,r);i!==e.email&&await e.reload()}async function ei(e,t,n){const r=x(e),i={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await e.getIdToken(),newEmail:t};n&&jr(r.auth,i,n);const{email:s}=await async function(e,t){return nr(e,t)}(r.auth,i);s!==e.email&&await e.reload()}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function ti(e,{displayName:t,photoURL:n}){if(void 0===t&&void 0===n)return;const r=x(e),i={idToken:await r.getIdToken(),displayName:t,photoUrl:n,returnSecureToken:!0},s=await nn(r,async function(e,t){return Ut(e,"POST","/v1/accounts:update",t)}(r.auth,i));r.displayName=s.displayName||null,r.photoURL=s.photoUrl||null;const o=r.providerData.find(({providerId:e})=>"password"===e);o&&(o.displayName=r.displayName,o.photoURL=r.photoURL),await r._updateTokensIfNecessary(s)}function ni(e,t){const n=x(e);return We(n.auth.app)?Promise.reject(bt(n.auth)):ii(n,t,null)}function ri(e,t){return ii(x(e),null,t)}async function ii(e,t,n){const{auth:r}=e,i={idToken:await e.getIdToken(),returnSecureToken:!0};t&&(i.email=t),n&&(i.password=n);const s=await nn(e,async function(e,t){return Ut(e,"POST","/v1/accounts:update",t)}(r,i));await e._updateTokensIfNecessary(s,!0)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(e,t,n={}){this.isNewUser=e,this.providerId=t,this.profile=n}}class oi extends si{constructor(e,t,n,r){super(e,t,n),this.username=r}}class ai extends si{constructor(e,t){super(e,"facebook.com",t)}}class ci extends oi{constructor(e,t){super(e,"github.com",t,"string"==typeof(null==t?void 0:t.login)?null==t?void 0:t.login:null)}}class ui extends si{constructor(e,t){super(e,"google.com",t)}}class li extends oi{constructor(e,t,n){super(e,"twitter.com",t,n)}}function hi(e){const{user:t,_tokenResponse:n}=e;return t.isAnonymous&&!n?{providerId:null,isNewUser:!1,profile:null}:function(e){var t,n;if(!e)return null;const{providerId:r}=e,i=e.rawUserInfo?JSON.parse(e.rawUserInfo):{},s=e.isNewUser||"identitytoolkit#SignupNewUserResponse"===e.kind;if(!r&&(null==e?void 0:e.idToken)){const r=null==(n=null==(t=en(e.idToken))?void 0:t.firebase)?void 0:n.sign_in_provider;if(r)return new si(s,"anonymous"!==r&&"custom"!==r?r:null)}if(!r)return null;switch(r){case"facebook.com":return new ai(s,i);case"github.com":return new ci(s,i);case"google.com":return new ui(s,i);case"twitter.com":return new li(s,i,e.screenName||null);case"custom":case"anonymous":return new si(s,null);default:return new si(s,r,i)}}(n)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function di(e,t){return x(e).setPersistence(t)}function fi(e,t,n,r){return x(e).onIdTokenChanged(t,n,r)}function pi(e,t,n){return x(e).beforeAuthStateChanged(t,n)}function mi(e,t,n,r){return x(e).onAuthStateChanged(t,n,r)}function gi(e){return x(e).signOut()}function yi(e,t){return On(e).revokeAccessToken(t)}async function vi(e){return x(e).delete()}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi{constructor(e,t,n){this.type=e,this.credential=t,this.user=n}static _fromIdtoken(e,t){return new wi("enroll",e,t)}static _fromMfaPendingCredential(e){return new wi("signin",e)}toJSON(){const e="enroll"===this.type?"idToken":"pendingCredential";return{multiFactorSession:{[e]:this.credential}}}static fromJSON(e){var t,n;if(null==e?void 0:e.multiFactorSession){if(null==(t=e.multiFactorSession)?void 0:t.pendingCredential)return wi._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if(null==(n=e.multiFactorSession)?void 0:n.idToken)return wi._fromIdtoken(e.multiFactorSession.idToken)}return null}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii{constructor(e,t,n){this.session=e,this.hints=t,this.signInResolver=n}static _fromError(e,t){const n=On(e),r=t.customData._serverResponse,i=(r.mfaInfo||[]).map(e=>Vr._fromServerResponse(n,e));St(r.mfaPendingCredential,n,"internal-error");const s=wi._fromMfaPendingCredential(r.mfaPendingCredential);return new Ii(s,i,async e=>{const i=await e._process(n,s);delete r.mfaInfo,delete r.mfaPendingCredential;const o={...r,idToken:i.idToken,refreshToken:i.refreshToken};switch(t.operationType){case"signIn":const e=await Tr._fromIdTokenResponse(n,t.operationType,o);return await n._updateCurrentUser(e.user),e;case"reauthenticate":return St(t.user,n,"internal-error"),Tr._forOperation(t.user,t.operationType,o);default:wt(n,"internal-error")}})}async resolveSignIn(e){const t=e;return this.signInResolver(t)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _i(e,t){return Ut(e,"POST","/v2/accounts/mfaEnrollment:start",Vt(e,t))}class bi{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(t=>{t.mfaInfo&&(this.enrolledFactors=t.mfaInfo.map(t=>Vr._fromServerResponse(e.auth,t)))})}static _fromUser(e){return new bi(e)}async getSession(){return wi._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,t){const n=e,r=await this.getSession(),i=await nn(this.user,n._process(this.user.auth,r,t));return await this.user._updateTokensIfNecessary(i),this.user.reload()}async unenroll(e){const t="string"==typeof e?e:e.uid,n=await this.user.getIdToken();try{const e=await nn(this.user,(r=this.user.auth,i={idToken:n,mfaEnrollmentId:t},Ut(r,"POST","/v2/accounts/mfaEnrollment:withdraw",Vt(r,i))));this.enrolledFactors=this.enrolledFactors.filter(({uid:e})=>e!==t),await this.user._updateTokensIfNecessary(e),await this.user.reload()}catch(s){throw s}var r,i}}const Ti=new WeakMap;const Ei="__sak";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ei,"1"),this.storage.removeItem(Ei),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ai extends Si{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=kn(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys((e,t,n)=>{this.notifyListeners(e,n)});const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},i=this.storage.getItem(n);Cn()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,10):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ai.type="LOCAL";const Ci=Ai;
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ki(e){var t;const n=e.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),r=RegExp(`${n}=([^;]+)`);return(null==(t=document.cookie.match(r))?void 0:t[1])??null}function Ni(e){return`${"http:"===window.location.protocol?"__dev_":"__HOST-"}FIREBASE_${e.split(":")[3]}`}class Di{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(void 0===typeof window)return e;const t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return!("boolean"==typeof isSecureContext&&!isSecureContext)&&("undefined"!=typeof navigator&&"undefined"!=typeof document&&(navigator.cookieEnabled??!0))}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;const t=Ni(e);if(window.cookieStore){const e=await window.cookieStore.get(t);return null==e?void 0:e.value}return ki(t)}async _remove(e){if(!this._isAvailable())return;if(!(await this._get(e)))return;const t=Ni(e);document.cookie=`${t}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;const n=Ni(e);if(window.cookieStore){const e=e=>{const r=e.changed.find(e=>e.name===n);r&&t(r.value);e.deleted.find(e=>e.name===n)&&t(null)},r=()=>window.cookieStore.removeEventListener("change",e);return this.listenerUnsubscribes.set(t,r),window.cookieStore.addEventListener("change",e)}let r=ki(n);const i=setInterval(()=>{const e=ki(n);e!==r&&(t(e),r=e)},1e3);this.listenerUnsubscribes.set(t,()=>clearInterval(i))}_removeListener(e,t){const n=this.listenerUnsubscribes.get(t);n&&(n(),this.listenerUnsubscribes.delete(t))}}Di.type="COOKIE";const Ri=Di;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi extends Si{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Pi.type="SESSION";const Oi=Pi;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class xi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;const n=new xi(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:i}=t.data,s=this.handlersMap[r];if(!(null==s?void 0:s.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const o=Array.from(s).map(async e=>e(t.origin,i)),a=await function(e){return Promise.all(e.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}(o);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Li(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */xi.receivers=[];class Mi{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,s;return new Promise((o,a)=>{const c=Li("",20);r.port1.start();const u=setTimeout(()=>{a(new Error("unsupported_event"))},n);s={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===c)switch(t.data.status){case"ack":clearTimeout(u),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),o(t.data.response);break;default:clearTimeout(u),clearTimeout(i),a(new Error("invalid_response"))}}},this.handlers.add(s),r.port1.addEventListener("message",s.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[r.port2])}).finally(()=>{s&&this.removeMessageHandler(s)})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fi(){return window}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Vi(){return void 0!==Fi().WorkerGlobalScope&&"function"==typeof Fi().importScripts}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ui="firebaseLocalStorageDb",qi="firebaseLocalStorage",ji="fbase_key";class Bi{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function zi(e,t){return e.transaction([qi],t?"readwrite":"readonly").objectStore(qi)}function $i(){const e=indexedDB.open(Ui,1);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const t=e.result;try{t.createObjectStore(qi,{keyPath:ji})}catch(r){n(r)}}),e.addEventListener("success",async()=>{const n=e.result;n.objectStoreNames.contains(qi)?t(n):(n.close(),await function(){const e=indexedDB.deleteDatabase(Ui);return new Bi(e).toPromise()}(),t(await $i()))})})}async function Ki(e,t,n){const r=zi(e,!0).put({[ji]:t,value:n});return new Bi(r).toPromise()}function Gi(e,t){const n=zi(e,!0).delete(t);return new Bi(n).toPromise()}class Hi{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await $i()),this.db}async _withRetries(e){let t=0;for(;;)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>3)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Vi()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=xi._getInstance(Vi()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await async function(){if(!(null==navigator?void 0:navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}(),!this.activeServiceWorker)return;this.sender=new Mi(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&(null==(e=n[0])?void 0:e.fulfilled)&&(null==(t=n[0])?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null==(t=null==navigator?void 0:navigator.serviceWorker)?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await $i();return await Ki(e,Ei,"1"),await Gi(e,Ei),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ki(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(t=>async function(e,t){const n=zi(e,!1).get(t),r=await new Bi(n).toPromise();return void 0===r?null:r.value}(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Gi(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(e=>{const t=zi(e,!1).getAll();return new Bi(t).toPromise()});if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;if(0!==e.length)for(const{fbase_key:r,value:i}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}Hi.type="LOCAL";const Wi=Hi;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qi(e,t){return Ut(e,"POST","/v2/accounts/mfaSignIn:start",Vt(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ji=Fn("rcb"),Yi=new Pt(3e4,6e4);class Xi{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!(null==(e=Fi().grecaptcha)?void 0:e.render)}load(e,t=""){return St(function(e){return e.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(e)}(t),e,"argument-error"),this.shouldResolveImmediately(t)&&Gt(Fi().grecaptcha)?Promise.resolve(Fi().grecaptcha):new Promise((n,r)=>{const i=Fi().setTimeout(()=>{r(It(e,"network-request-failed"))},Yi.get());Fi()[Ji]=()=>{Fi().clearTimeout(i),delete Fi()[Ji];const s=Fi().grecaptcha;if(!s||!Gt(s))return void r(It(e,"internal-error"));const o=s.render;s.render=(e,t)=>{const n=o(e,t);return this.counter++,n},this.hostLanguage=t,n(s)};Mn(`${Ln.recaptchaV2Script}?${N({onload:Ji,render:"explicit",hl:t})}`).catch(()=>{clearTimeout(i),r(It(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!(null==(t=Fi().grecaptcha)?void 0:t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}class Zi{async load(e){return new Un(e)}clearedOneInstance(){}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const es="recaptcha",ts={theme:"light",type:"image"};class ns{constructor(e,t,n={...ts}){this.parameters=n,this.type=es,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=On(e),this.isInvisible="invisible"===this.parameters.size,St("undefined"!=typeof document,this.auth,"operation-not-supported-in-this-environment");const r="string"==typeof t?document.getElementById(t):t;St(r,this.auth,"argument-error"),this.container=r,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new Zi:new Xi,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),n=t.getResponse(e);return n||new Promise(n=>{const r=e=>{e&&(this.tokenChangeListeners.delete(r),n(e))};this.tokenChangeListeners.add(r),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise||(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e})),this.renderPromise}_reset(){this.assertNotDestroyed(),null!==this.widgetId&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){St(!this.parameters.sitekey,this.auth,"argument-error"),St(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),St("undefined"!=typeof document,this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(e=>e(t)),"function"==typeof e)e(t);else if("string"==typeof e){const n=Fi()[e];"function"==typeof n&&n(t)}}}assertNotDestroyed(){St(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){St(Nt()&&!Vi(),this.auth,"internal-error"),await function(){let e=null;return new Promise(t=>{"complete"!==document.readyState?(e=()=>t(),window.addEventListener("load",e)):t()}).catch(t=>{throw e&&window.removeEventListener("load",e),t})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await async function(e){return(await Ut(e,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}(this.auth);St(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return St(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}class rs{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=lr._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function is(e,t,n){if(We(e.app))return Promise.reject(bt(e));const r=On(e),i=await os(r,t,x(n));return new rs(i,e=>xr(r,e))}async function ss(e,t,n){const r=x(e);await Rr(!1,r,"phone");const i=await os(r.auth,t,x(n));return new rs(i,e=>Lr(r,e))}async function os(e,t,n){var r;if(!e._getRecaptchaConfig())try{await Hn(e)}catch(i){}try{let i;if(i="string"==typeof t?{phoneNumber:t}:t,"session"in i){const t=i.session;if("phoneNumber"in i){St("enroll"===t.type,e,"internal-error");const r={idToken:t.credential,phoneEnrollmentInfo:{phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"}},s=Gn(e,r,"mfaSmsEnrollment",async(e,t)=>{if(t.phoneEnrollmentInfo.captchaResponse===zn){St((null==n?void 0:n.type)===es,e,"argument-error");return _i(e,await as(e,t,n))}return _i(e,t)},"PHONE_PROVIDER");return(await s.catch(e=>Promise.reject(e))).phoneSessionInfo.sessionInfo}{St("signin"===t.type,e,"internal-error");const s=(null==(r=i.multiFactorHint)?void 0:r.uid)||i.multiFactorUid;St(s,e,"missing-multi-factor-info");const o={mfaPendingCredential:t.credential,mfaEnrollmentId:s,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}},a=Gn(e,o,"mfaSmsSignIn",async(e,t)=>{if(t.phoneSignInInfo.captchaResponse===zn){St((null==n?void 0:n.type)===es,e,"argument-error");return Qi(e,await as(e,t,n))}return Qi(e,t)},"PHONE_PROVIDER");return(await a.catch(e=>Promise.reject(e))).phoneResponseInfo.sessionInfo}}{const t={phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"},r=Gn(e,t,"sendVerificationCode",async(e,t)=>{if(t.captchaResponse===zn){St((null==n?void 0:n.type)===es,e,"argument-error");return cr(e,await as(e,t,n))}return cr(e,t)},"PHONE_PROVIDER");return(await r.catch(e=>Promise.reject(e))).sessionInfo}}finally{null==n||n._reset()}}async function as(e,t,n){St(n.type===es,e,"argument-error");const r=await n.verify();St("string"==typeof r,e,"argument-error");const i={...t};if("phoneEnrollmentInfo"in i){const e=i.phoneEnrollmentInfo.phoneNumber,t=i.phoneEnrollmentInfo.captchaResponse,n=i.phoneEnrollmentInfo.clientType,s=i.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(i,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:r,captchaResponse:t,clientType:n,recaptchaVersion:s}}),i}if("phoneSignInInfo"in i){const e=i.phoneSignInInfo.captchaResponse,t=i.phoneSignInInfo.clientType,n=i.phoneSignInInfo.recaptchaVersion;return Object.assign(i,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:e,clientType:t,recaptchaVersion:n}}),i}return Object.assign(i,{recaptchaToken:r}),i}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cs{constructor(e){this.providerId=cs.PROVIDER_ID,this.auth=On(e)}verifyPhoneNumber(e,t){return os(this.auth,e,x(t))}static credential(e,t){return lr._fromVerification(e,t)}static credentialFromResult(e){const t=e;return cs.credentialFromTaggedObject(t)}static credentialFromError(e){return cs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:t,temporaryProof:n}=e;return t&&n?lr._fromTokenResponse(t,n):null}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function us(e,t){return t?fn(t):(St(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */cs.PROVIDER_ID="phone",cs.PHONE_SIGN_IN_METHOD="phone";class ls extends Xn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return or(e,this._buildIdpRequest())}_linkToIdToken(e,t){return or(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return or(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function hs(e){return Or(e.auth,new ls(e),e.bypassAuthState)}function ds(e){const{auth:t,user:n}=e;return St(n,t,"internal-error"),Pr(n,new ls(e),e.bypassAuthState)}async function fs(e){const{auth:t,user:n}=e;return St(n,t,"internal-error"),Dr(n,new ls(e),e.bypassAuthState)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ps{constructor(e,t,n,r,i=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:i,error:s,type:o}=e;if(s)return void this.reject(s);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return hs;case"linkViaPopup":case"linkViaRedirect":return fs;case"reauthViaPopup":case"reauthViaRedirect":return ds;default:wt(this.auth,"internal-error")}}resolve(e){Ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ms=new Pt(2e3,1e4);async function gs(e,t,n){if(We(e.app))return Promise.reject(It(e,"operation-not-supported-in-this-environment"));const r=On(e);Tt(e,t,fr);const i=us(r,n);return new vs(r,"signInViaPopup",t,i).executeNotNull()}async function ys(e,t,n){const r=x(e);Tt(r.auth,t,fr);const i=us(r.auth,n);return new vs(r.auth,"linkViaPopup",t,i,r).executeNotNull()}class vs extends ps{constructor(e,t,n,r,i){super(e,t,r,i),this.provider=n,this.authWindow=null,this.pollId=null,vs.currentPopupAction&&vs.currentPopupAction.cancel(),vs.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return St(e,this.auth,"internal-error"),e}async onExecution(){Ct(1===this.filter.length,"Popup operations only handle one event");const e=Li();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(It(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null==(e=this.authWindow)?void 0:e.associatedEvent)||null}cancel(){this.reject(It(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,vs.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;(null==(n=null==(t=this.authWindow)?void 0:t.window)?void 0:n.closed)?this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(It(this.auth,"popup-closed-by-user"))},8e3):this.pollId=window.setTimeout(e,ms.get())};e()}}vs.currentPopupAction=null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ws=new Map;class Is extends ps{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=ws.get(this.auth._key());if(!e){try{const t=await async function(e,t){const n=Es(t),r=Ts(e);if(!(await r._isAvailable()))return!1;const i="true"===await r._get(n);return await r._remove(n),i}(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}ws.set(this.auth._key(),e)}return this.bypassAuthState||ws.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}async function _s(e,t){return Ts(e)._set(Es(t),"true")}function bs(e,t){ws.set(e._key(),t)}function Ts(e){return fn(e._redirectPersistence)}function Es(e){return gn("pendingRedirect",e.config.apiKey,e.name)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ss(e,t,n){return async function(e,t,n){if(We(e.app))return Promise.reject(bt(e));const r=On(e);Tt(e,t,fr),await r._initializationPromise;const i=us(r,n);return await _s(i,r),i._openRedirect(r,t,"signInViaRedirect")}(e,t,n)}function As(e,t,n){return async function(e,t,n){const r=x(e);Tt(r.auth,t,fr),await r.auth._initializationPromise;const i=us(r.auth,n);await Rr(!1,r,t.providerId),await _s(i,r.auth);const s=await Ns(r);return i._openRedirect(r.auth,t,"linkViaRedirect",s)}(e,t,n)}async function Cs(e,t){return await On(e)._initializationPromise,ks(e,t,!1)}async function ks(e,t,n=!1){if(We(e.app))return Promise.reject(bt(e));const r=On(e),i=us(r,t),s=new Is(r,i,n),o=await s.execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,t)),o}async function Ns(e){const t=Li(`${e.uid}:::`);return e._redirectEventId=t,await e.auth._setRedirectUser(e),await e.auth._persistUserIfCurrent(e),t}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Ps(e);default:return!1}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!Ps(e)){const r=(null==(n=e.error.code)?void 0:n.split("auth/")[1])||"internal-error";t.onError(It(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(Rs(e))}saveEventToCache(e){this.cachedEventUids.add(Rs(e)),this.lastProcessedEventTime=Date.now()}}function Rs(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function Ps({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===(null==t?void 0:t.code)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Os=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,xs=/^https?/;async function Ls(e){if(e.config.emulator)return;const{authorizedDomains:t}=await async function(e,t={}){return Ut(e,"GET","/v1/projects",t)}(e);for(const n of t)try{if(Ms(n))return}catch{}wt(e,"unauthorized-domain")}function Ms(e){const t=kt(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const i=new URL(e);return""===i.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&i.hostname===r}if(!xs.test(n))return!1;if(Os.test(e))return r===e;const i=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fs=new Pt(3e4,6e4);function Vs(){const e=Fi().___jsl;if(null==e?void 0:e.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}function Us(e){return new Promise((t,n)=>{var r,i,s;function o(){Vs(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Vs(),n(It(e,"network-request-failed"))},timeout:Fs.get()})}if(null==(i=null==(r=Fi().gapi)?void 0:r.iframes)?void 0:i.Iframe)t(gapi.iframes.getContext());else{if(!(null==(s=Fi().gapi)?void 0:s.load)){const t=Fn("iframefcb");return Fi()[t]=()=>{gapi.load?o():n(It(e,"network-request-failed"))},Mn(`${Ln.gapiScript}?onload=${t}`).catch(e=>n(e))}o()}}).catch(e=>{throw qs=null,e})}let qs=null;
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const js=new Pt(5e3,15e3),Bs={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},zs=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function $s(e){const t=e.config;St(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?Ot(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,r={apiKey:t.apiKey,appName:e.name,v:Ye},i=zs.get(e.config.apiHost);i&&(r.eid=i);const s=e._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${N(r).slice(1)}`}async function Ks(e){const t=await function(e){return qs=qs||Us(e),qs}(e),n=Fi().gapi;return St(n,e,"internal-error"),t.open({where:document.body,url:$s(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Bs,dontclear:!0},t=>new Promise(async(n,r)=>{await t.restyle({setHideOnLeave:!1});const i=It(e,"network-request-failed"),s=Fi().setTimeout(()=>{r(i)},js.get());function o(){Fi().clearTimeout(s),n(t)}t.ping(o).then(o,()=>{r(i)})}))}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gs={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};class Hs{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function Ws(e,t,n,r=500,i=600){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c={...Gs,width:r.toString(),height:i.toString(),top:s,left:o},u=v().toLowerCase();n&&(a=_n(u)?"_blank":n),wn(u)&&(t=t||"http://localhost",c.scrollbars="yes");const l=Object.entries(c).reduce((e,[t,n])=>`${e}${t}=${n},`,"");if(function(e=v()){var t;return An(e)&&!!(null==(t=window.navigator)?void 0:t.standalone)}(u)&&"_self"!==a)return function(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t||"",a),new Hs(null);const h=window.open(t||"",a,l);St(h,e,"popup-blocked");try{h.focus()}catch(d){}return new Hs(h)}const Qs="__/auth/handler",Js="emulator/auth/handler",Ys=encodeURIComponent("fac");async function Xs(e,t,n,r,i,s){St(e.config.authDomain,e,"auth-domain-config-required"),St(e.config.apiKey,e,"invalid-api-key");const o={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:Ye,eventId:i};if(t instanceof fr){t.setDefaultLanguage(e.languageCode),o.providerId=t.providerId||"",function(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries({}))o[e]=t}if(t instanceof pr){const e=t.getScopes().filter(e=>""!==e);e.length>0&&(o.scopes=e.join(","))}e.tenantId&&(o.tid=e.tenantId);const a=o;for(const l of Object.keys(a))void 0===a[l]&&delete a[l];const c=await e._getAppCheckToken(),u=c?`#${Ys}=${encodeURIComponent(c)}`:"";return`${function({config:e}){if(!e.emulator)return`https://${e.authDomain}/${Qs}`;return Ot(e,Js)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)}?${N(a).slice(1)}${u}`}const Zs="webStorageSupport";const eo=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Oi,this._completeRedirectFn=ks,this._overrideRedirectResult=bs}async _openPopup(e,t,n,r){var i;Ct(null==(i=this.eventManagers[e._key()])?void 0:i.manager,"_initialize() not called before _openPopup()");return Ws(e,await Xs(e,t,n,kt(),r),Li())}async _openRedirect(e,t,n,r){await this._originValidation(e);return function(e){Fi().location.href=e}(await Xs(e,t,n,kt(),r)),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(Ct(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await Ks(e),n=new Ds(e);return t.register("authEvent",t=>{St(null==t?void 0:t.authEvent,e,"invalid-auth-event");return{status:n.onEvent(t.authEvent)?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Zs,{type:Zs},n=>{var r;const i=null==(r=null==n?void 0:n[0])?void 0:r[Zs];void 0!==i&&t(!!i),wt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Ls(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return kn()||In()||An()}};class to{constructor(e){this.factorId=e}_process(e,t,n){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,n);case"signin":return this._finalizeSignIn(e,t.credential);default:return At("unexpected MultiFactorSessionType")}}}class no extends to{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new no(e)}_finalizeEnroll(e,t,n){return function(e,t){return Ut(e,"POST","/v2/accounts/mfaEnrollment:finalize",Vt(e,t))}(e,{idToken:t,displayName:n,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return function(e,t){return Ut(e,"POST","/v2/accounts/mfaSignIn:finalize",Vt(e,t))}(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class ro{constructor(){}static assertion(e){return no._fromCredential(e)}}ro.FACTOR_ID="phone";class io{static assertionForEnrollment(e,t){return so._fromSecret(e,t)}static assertionForSignIn(e,t){return so._fromEnrollmentId(e,t)}static async generateSecret(e){var t;const n=e;St(void 0!==(null==(t=n.user)?void 0:t.auth),"internal-error");const r=await(i=n.user.auth,s={idToken:n.credential,totpEnrollmentInfo:{}},Ut(i,"POST","/v2/accounts/mfaEnrollment:start",Vt(i,s)));var i,s;return oo._fromStartTotpMfaEnrollmentResponse(r,n.user.auth)}}io.FACTOR_ID="totp";class so extends to{constructor(e,t,n){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=n}static _fromSecret(e,t){return new so(t,void 0,e)}static _fromEnrollmentId(e,t){return new so(t,e)}async _finalizeEnroll(e,t,n){return St(void 0!==this.secret,e,"argument-error"),function(e,t){return Ut(e,"POST","/v2/accounts/mfaEnrollment:finalize",Vt(e,t))}(e,{idToken:t,displayName:n,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){St(void 0!==this.enrollmentId&&void 0!==this.otp,e,"argument-error");const n={verificationCode:this.otp};return function(e,t){return Ut(e,"POST","/v2/accounts/mfaSignIn:finalize",Vt(e,t))}(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:n})}}class oo{constructor(e,t,n,r,i,s,o){this.sessionInfo=s,this.auth=o,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=n,this.codeIntervalSeconds=r,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(e,t){return new oo(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var n;let r=!1;return(ao(e)||ao(t))&&(r=!0),r&&(ao(e)&&(e=(null==(n=this.auth.currentUser)?void 0:n.email)||"unknownuser"),ao(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function ao(e){return void 0===e||0===(null==e?void 0:e.length)}var co="@firebase/auth",uo="1.12.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class lo{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null==(e=this.auth.currentUser)?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;return{accessToken:await this.auth.currentUser.getIdToken(e)}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){St(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ho=h("authIdTokenMaxAge")||300;let fo=null;function po(e=Ze()){const t=He(e,"auth");if(t.isInitialized())return t.getImmediate();const n=Wn(e,{popupRedirectResolver:eo,persistence:[Wi,Ci,Oi]}),r=h("authTokenSyncURL");if(r&&"boolean"==typeof isSecureContext&&isSecureContext){const e=new URL(r,location.origin);if(location.origin===e.origin){const t=(i=e.toString(),async e=>{const t=e&&await e.getIdTokenResult(),n=t&&((new Date).getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>ho)return;const r=null==t?void 0:t.token;fo!==r&&(fo=r,await fetch(i,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))});pi(n,t,()=>t(n.currentUser)),fi(n,e=>t(e))}}var i;const s=c("auth");return s&&Qn(n,`http://${s}`),n}var mo;Ln={loadJS:e=>new Promise((t,n)=>{const r=document.createElement("script");var i;r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=It("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",((null==(i=document.getElementsByTagName("head"))?void 0:i[0])??document).appendChild(r)}),gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="},mo="Browser",Ge(new L("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:s,authDomain:o}=n.options;St(s&&!s.includes(":"),"invalid-api-key",{appName:n.name});const a={apiKey:s,authDomain:o,clientPlatform:mo,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Nn(mo)},c=new Pn(n,r,i,a);return function(e,t){const n=(null==t?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(fn);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,null==t?void 0:t.popupRedirectResolver)}(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Ge(new L("auth-internal",e=>{const t=On(e.getProvider("auth").getImmediate());return new lo(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),nt(co,uo,function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(mo)),nt(co,uo,"esm2020");const go=Object.freeze(Object.defineProperty({__proto__:null,ActionCodeOperation:{EMAIL_SIGNIN:"EMAIL_SIGNIN",PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:"REVERT_SECOND_FACTOR_ADDITION",VERIFY_AND_CHANGE_EMAIL:"VERIFY_AND_CHANGE_EMAIL",VERIFY_EMAIL:"VERIFY_EMAIL"},ActionCodeURL:hr,AuthCredential:Xn,AuthErrorCodes:{ADMIN_ONLY_OPERATION:"auth/admin-restricted-operation",ARGUMENT_ERROR:"auth/argument-error",APP_NOT_AUTHORIZED:"auth/app-not-authorized",APP_NOT_INSTALLED:"auth/app-not-installed",CAPTCHA_CHECK_FAILED:"auth/captcha-check-failed",CODE_EXPIRED:"auth/code-expired",CORDOVA_NOT_READY:"auth/cordova-not-ready",CORS_UNSUPPORTED:"auth/cors-unsupported",CREDENTIAL_ALREADY_IN_USE:"auth/credential-already-in-use",CREDENTIAL_MISMATCH:"auth/custom-token-mismatch",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"auth/requires-recent-login",DEPENDENT_SDK_INIT_BEFORE_AUTH:"auth/dependent-sdk-initialized-before-auth",DYNAMIC_LINK_NOT_ACTIVATED:"auth/dynamic-link-not-activated",EMAIL_CHANGE_NEEDS_VERIFICATION:"auth/email-change-needs-verification",EMAIL_EXISTS:"auth/email-already-in-use",EMULATOR_CONFIG_FAILED:"auth/emulator-config-failed",EXPIRED_OOB_CODE:"auth/expired-action-code",EXPIRED_POPUP_REQUEST:"auth/cancelled-popup-request",INTERNAL_ERROR:"auth/internal-error",INVALID_API_KEY:"auth/invalid-api-key",INVALID_APP_CREDENTIAL:"auth/invalid-app-credential",INVALID_APP_ID:"auth/invalid-app-id",INVALID_AUTH:"auth/invalid-user-token",INVALID_AUTH_EVENT:"auth/invalid-auth-event",INVALID_CERT_HASH:"auth/invalid-cert-hash",INVALID_CODE:"auth/invalid-verification-code",INVALID_CONTINUE_URI:"auth/invalid-continue-uri",INVALID_CORDOVA_CONFIGURATION:"auth/invalid-cordova-configuration",INVALID_CUSTOM_TOKEN:"auth/invalid-custom-token",INVALID_DYNAMIC_LINK_DOMAIN:"auth/invalid-dynamic-link-domain",INVALID_EMAIL:"auth/invalid-email",INVALID_EMULATOR_SCHEME:"auth/invalid-emulator-scheme",INVALID_IDP_RESPONSE:"auth/invalid-credential",INVALID_LOGIN_CREDENTIALS:"auth/invalid-credential",INVALID_MESSAGE_PAYLOAD:"auth/invalid-message-payload",INVALID_MFA_SESSION:"auth/invalid-multi-factor-session",INVALID_OAUTH_CLIENT_ID:"auth/invalid-oauth-client-id",INVALID_OAUTH_PROVIDER:"auth/invalid-oauth-provider",INVALID_OOB_CODE:"auth/invalid-action-code",INVALID_ORIGIN:"auth/unauthorized-domain",INVALID_PASSWORD:"auth/wrong-password",INVALID_PERSISTENCE:"auth/invalid-persistence-type",INVALID_PHONE_NUMBER:"auth/invalid-phone-number",INVALID_PROVIDER_ID:"auth/invalid-provider-id",INVALID_RECIPIENT_EMAIL:"auth/invalid-recipient-email",INVALID_SENDER:"auth/invalid-sender",INVALID_SESSION_INFO:"auth/invalid-verification-id",INVALID_TENANT_ID:"auth/invalid-tenant-id",MFA_INFO_NOT_FOUND:"auth/multi-factor-info-not-found",MFA_REQUIRED:"auth/multi-factor-auth-required",MISSING_ANDROID_PACKAGE_NAME:"auth/missing-android-pkg-name",MISSING_APP_CREDENTIAL:"auth/missing-app-credential",MISSING_AUTH_DOMAIN:"auth/auth-domain-config-required",MISSING_CODE:"auth/missing-verification-code",MISSING_CONTINUE_URI:"auth/missing-continue-uri",MISSING_IFRAME_START:"auth/missing-iframe-start",MISSING_IOS_BUNDLE_ID:"auth/missing-ios-bundle-id",MISSING_OR_INVALID_NONCE:"auth/missing-or-invalid-nonce",MISSING_MFA_INFO:"auth/missing-multi-factor-info",MISSING_MFA_SESSION:"auth/missing-multi-factor-session",MISSING_PHONE_NUMBER:"auth/missing-phone-number",MISSING_PASSWORD:"auth/missing-password",MISSING_SESSION_INFO:"auth/missing-verification-id",MODULE_DESTROYED:"auth/app-deleted",NEED_CONFIRMATION:"auth/account-exists-with-different-credential",NETWORK_REQUEST_FAILED:"auth/network-request-failed",NULL_USER:"auth/null-user",NO_AUTH_EVENT:"auth/no-auth-event",NO_SUCH_PROVIDER:"auth/no-such-provider",OPERATION_NOT_ALLOWED:"auth/operation-not-allowed",OPERATION_NOT_SUPPORTED:"auth/operation-not-supported-in-this-environment",POPUP_BLOCKED:"auth/popup-blocked",POPUP_CLOSED_BY_USER:"auth/popup-closed-by-user",PROVIDER_ALREADY_LINKED:"auth/provider-already-linked",QUOTA_EXCEEDED:"auth/quota-exceeded",REDIRECT_CANCELLED_BY_USER:"auth/redirect-cancelled-by-user",REDIRECT_OPERATION_PENDING:"auth/redirect-operation-pending",REJECTED_CREDENTIAL:"auth/rejected-credential",SECOND_FACTOR_ALREADY_ENROLLED:"auth/second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"auth/maximum-second-factor-count-exceeded",TENANT_ID_MISMATCH:"auth/tenant-id-mismatch",TIMEOUT:"auth/timeout",TOKEN_EXPIRED:"auth/user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"auth/too-many-requests",UNAUTHORIZED_DOMAIN:"auth/unauthorized-continue-uri",UNSUPPORTED_FIRST_FACTOR:"auth/unsupported-first-factor",UNSUPPORTED_PERSISTENCE:"auth/unsupported-persistence-type",UNSUPPORTED_TENANT_OPERATION:"auth/unsupported-tenant-operation",UNVERIFIED_EMAIL:"auth/unverified-email",USER_CANCELLED:"auth/user-cancelled",USER_DELETED:"auth/user-not-found",USER_DISABLED:"auth/user-disabled",USER_MISMATCH:"auth/user-mismatch",USER_SIGNED_OUT:"auth/user-signed-out",WEAK_PASSWORD:"auth/weak-password",WEB_STORAGE_UNSUPPORTED:"auth/web-storage-unsupported",ALREADY_INITIALIZED:"auth/already-initialized",RECAPTCHA_NOT_ENABLED:"auth/recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"auth/missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"auth/invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"auth/invalid-recaptcha-action",MISSING_CLIENT_TYPE:"auth/missing-client-type",MISSING_RECAPTCHA_VERSION:"auth/missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"auth/invalid-recaptcha-version",INVALID_REQ_TYPE:"auth/invalid-req-type",INVALID_HOSTING_LINK_DOMAIN:"auth/invalid-hosting-link-domain"},EmailAuthCredential:sr,EmailAuthProvider:dr,FacebookAuthProvider:gr,FactorId:{PHONE:"phone",TOTP:"totp"},GithubAuthProvider:vr,GoogleAuthProvider:yr,OAuthCredential:ar,OAuthProvider:mr,OperationType:{LINK:"link",REAUTHENTICATE:"reauthenticate",SIGN_IN:"signIn"},PhoneAuthCredential:lr,PhoneAuthProvider:cs,PhoneMultiFactorGenerator:ro,ProviderId:{FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PASSWORD:"password",PHONE:"phone",TWITTER:"twitter.com"},RecaptchaVerifier:ns,SAMLAuthProvider:Ir,SignInMethod:{EMAIL_LINK:"emailLink",EMAIL_PASSWORD:"password",FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PHONE:"phone",TWITTER:"twitter.com"},TotpMultiFactorGenerator:io,TotpSecret:oo,TwitterAuthProvider:_r,applyActionCode:Kr,beforeAuthStateChanged:pi,browserCookiePersistence:Ri,browserLocalPersistence:Ci,browserPopupRedirectResolver:eo,browserSessionPersistence:Oi,checkActionCode:Gr,confirmPasswordReset:$r,connectAuthEmulator:Qn,createUserWithEmailAndPassword:Hr,debugErrorMap:pt,deleteUser:vi,fetchSignInMethodsForEmail:Xr,getAdditionalUserInfo:hi,getAuth:po,getIdToken:function(e,t=!1){return x(e).getIdToken(t)},getIdTokenResult:Xt,getMultiFactorResolver:function(e,t){var n;const r=x(e),i=t;return St(t.customData.operationType,r,"argument-error"),St(null==(n=i.customData._serverResponse)?void 0:n.mfaPendingCredential,r,"argument-error"),Ii._fromError(r,i)},getRedirectResult:Cs,inMemoryPersistence:mn,indexedDBLocalPersistence:Wi,initializeAuth:Wn,initializeRecaptchaConfig:function(e){return Hn(e)},isSignInWithEmailLink:Jr,linkWithCredential:Lr,linkWithPhoneNumber:ss,linkWithPopup:ys,linkWithRedirect:As,multiFactor:function(e){const t=x(e);return Ti.has(t)||Ti.set(t,bi._fromUser(t)),Ti.get(t)},onAuthStateChanged:mi,onIdTokenChanged:fi,parseActionCodeURL:function(e){return hr.parseLink(e)},prodErrorMap:mt,reauthenticateWithCredential:Mr,reauthenticateWithPhoneNumber:async function(e,t,n){const r=x(e);if(We(r.auth.app))return Promise.reject(bt(r.auth));const i=await os(r.auth,t,x(n));return new rs(i,e=>Mr(r,e))},reauthenticateWithPopup:async function(e,t,n){const r=x(e);if(We(r.auth.app))return Promise.reject(It(r.auth,"operation-not-supported-in-this-environment"));Tt(r.auth,t,fr);const i=us(r.auth,n);return new vs(r.auth,"reauthViaPopup",t,i,r).executeNotNull()},reauthenticateWithRedirect:function(e,t,n){return async function(e,t,n){const r=x(e);if(Tt(r.auth,t,fr),We(r.auth.app))return Promise.reject(bt(r.auth));await r.auth._initializationPromise;const i=us(r.auth,n);await _s(i,r.auth);const s=await Ns(r);return i._openRedirect(r.auth,t,"reauthViaRedirect",s)}(e,t,n)},reload:an,revokeAccessToken:yi,sendEmailVerification:Zr,sendPasswordResetEmail:zr,sendSignInLinkToEmail:Qr,setPersistence:di,signInAnonymously:Sr,signInWithCredential:xr,signInWithCustomToken:Fr,signInWithEmailAndPassword:Wr,signInWithEmailLink:Yr,signInWithPhoneNumber:is,signInWithPopup:gs,signInWithRedirect:Ss,signOut:gi,unlink:Nr,updateCurrentUser:function(e,t){return x(e).updateCurrentUser(t)},updateEmail:ni,updatePassword:ri,updatePhoneNumber:async function(e,t){const n=x(e);if(We(n.auth.app))return Promise.reject(bt(n.auth));await Dr(n,t)},updateProfile:ti,useDeviceLanguage:function(e){x(e).useDeviceLanguage()},validatePassword:async function(e,t){return On(e).validatePassword(t)},verifyBeforeUpdateEmail:ei,verifyPasswordResetCode:async function(e,t){const{data:n}=await Gr(x(e),t);return n.email}},Symbol.toStringTag,{value:"Module"}));var yo,vo,wo="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e;
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function t(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}function n(e,t,n){n||(n=0);const r=Array(16);if("string"==typeof t)for(var i=0;i<16;++i)r[i]=t.charCodeAt(n++)|t.charCodeAt(n++)<<8|t.charCodeAt(n++)<<16|t.charCodeAt(n++)<<24;else for(i=0;i<16;++i)r[i]=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24;t=e.g[0],n=e.g[1],i=e.g[2];let s,o=e.g[3];s=t+(o^n&(i^o))+r[0]+3614090360&4294967295,s=o+(i^(t=n+(s<<7&4294967295|s>>>25))&(n^i))+r[1]+3905402710&4294967295,o=t+(s<<12&4294967295|s>>>20),s=i+(n^o&(t^n))+r[2]+606105819&4294967295,s=n+(t^(i=o+(s<<17&4294967295|s>>>15))&(o^t))+r[3]+3250441966&4294967295,s=t+(o^(n=i+(s<<22&4294967295|s>>>10))&(i^o))+r[4]+4118548399&4294967295,s=o+(i^(t=n+(s<<7&4294967295|s>>>25))&(n^i))+r[5]+1200080426&4294967295,o=t+(s<<12&4294967295|s>>>20),s=i+(n^o&(t^n))+r[6]+2821735955&4294967295,s=n+(t^(i=o+(s<<17&4294967295|s>>>15))&(o^t))+r[7]+4249261313&4294967295,s=t+(o^(n=i+(s<<22&4294967295|s>>>10))&(i^o))+r[8]+1770035416&4294967295,s=o+(i^(t=n+(s<<7&4294967295|s>>>25))&(n^i))+r[9]+2336552879&4294967295,o=t+(s<<12&4294967295|s>>>20),s=i+(n^o&(t^n))+r[10]+4294925233&4294967295,s=n+(t^(i=o+(s<<17&4294967295|s>>>15))&(o^t))+r[11]+2304563134&4294967295,s=t+(o^(n=i+(s<<22&4294967295|s>>>10))&(i^o))+r[12]+1804603682&4294967295,s=o+(i^(t=n+(s<<7&4294967295|s>>>25))&(n^i))+r[13]+4254626195&4294967295,o=t+(s<<12&4294967295|s>>>20),s=i+(n^o&(t^n))+r[14]+2792965006&4294967295,s=n+(t^(i=o+(s<<17&4294967295|s>>>15))&(o^t))+r[15]+1236535329&4294967295,s=t+(i^o&((n=i+(s<<22&4294967295|s>>>10))^i))+r[1]+4129170786&4294967295,s=o+(n^i&((t=n+(s<<5&4294967295|s>>>27))^n))+r[6]+3225465664&4294967295,o=t+(s<<9&4294967295|s>>>23),s=i+(t^n&(o^t))+r[11]+643717713&4294967295,s=n+(o^t&((i=o+(s<<14&4294967295|s>>>18))^o))+r[0]+3921069994&4294967295,s=t+(i^o&((n=i+(s<<20&4294967295|s>>>12))^i))+r[5]+3593408605&4294967295,s=o+(n^i&((t=n+(s<<5&4294967295|s>>>27))^n))+r[10]+38016083&4294967295,o=t+(s<<9&4294967295|s>>>23),s=i+(t^n&(o^t))+r[15]+3634488961&4294967295,s=n+(o^t&((i=o+(s<<14&4294967295|s>>>18))^o))+r[4]+3889429448&4294967295,s=t+(i^o&((n=i+(s<<20&4294967295|s>>>12))^i))+r[9]+568446438&4294967295,s=o+(n^i&((t=n+(s<<5&4294967295|s>>>27))^n))+r[14]+3275163606&4294967295,o=t+(s<<9&4294967295|s>>>23),s=i+(t^n&(o^t))+r[3]+4107603335&4294967295,s=n+(o^t&((i=o+(s<<14&4294967295|s>>>18))^o))+r[8]+1163531501&4294967295,s=t+(i^o&((n=i+(s<<20&4294967295|s>>>12))^i))+r[13]+2850285829&4294967295,s=o+(n^i&((t=n+(s<<5&4294967295|s>>>27))^n))+r[2]+4243563512&4294967295,o=t+(s<<9&4294967295|s>>>23),s=i+(t^n&(o^t))+r[7]+1735328473&4294967295,s=n+(o^t&((i=o+(s<<14&4294967295|s>>>18))^o))+r[12]+2368359562&4294967295,s=t+((n=i+(s<<20&4294967295|s>>>12))^i^o)+r[5]+4294588738&4294967295,s=o+((t=n+(s<<4&4294967295|s>>>28))^n^i)+r[8]+2272392833&4294967295,o=t+(s<<11&4294967295|s>>>21),s=i+(o^t^n)+r[11]+1839030562&4294967295,s=n+((i=o+(s<<16&4294967295|s>>>16))^o^t)+r[14]+4259657740&4294967295,s=t+((n=i+(s<<23&4294967295|s>>>9))^i^o)+r[1]+2763975236&4294967295,s=o+((t=n+(s<<4&4294967295|s>>>28))^n^i)+r[4]+1272893353&4294967295,o=t+(s<<11&4294967295|s>>>21),s=i+(o^t^n)+r[7]+4139469664&4294967295,s=n+((i=o+(s<<16&4294967295|s>>>16))^o^t)+r[10]+3200236656&4294967295,s=t+((n=i+(s<<23&4294967295|s>>>9))^i^o)+r[13]+681279174&4294967295,s=o+((t=n+(s<<4&4294967295|s>>>28))^n^i)+r[0]+3936430074&4294967295,o=t+(s<<11&4294967295|s>>>21),s=i+(o^t^n)+r[3]+3572445317&4294967295,s=n+((i=o+(s<<16&4294967295|s>>>16))^o^t)+r[6]+76029189&4294967295,s=t+((n=i+(s<<23&4294967295|s>>>9))^i^o)+r[9]+3654602809&4294967295,s=o+((t=n+(s<<4&4294967295|s>>>28))^n^i)+r[12]+3873151461&4294967295,o=t+(s<<11&4294967295|s>>>21),s=i+(o^t^n)+r[15]+530742520&4294967295,s=n+((i=o+(s<<16&4294967295|s>>>16))^o^t)+r[2]+3299628645&4294967295,s=t+(i^((n=i+(s<<23&4294967295|s>>>9))|~o))+r[0]+4096336452&4294967295,s=o+(n^((t=n+(s<<6&4294967295|s>>>26))|~i))+r[7]+1126891415&4294967295,o=t+(s<<10&4294967295|s>>>22),s=i+(t^(o|~n))+r[14]+2878612391&4294967295,s=n+(o^((i=o+(s<<15&4294967295|s>>>17))|~t))+r[5]+4237533241&4294967295,s=t+(i^((n=i+(s<<21&4294967295|s>>>11))|~o))+r[12]+1700485571&4294967295,s=o+(n^((t=n+(s<<6&4294967295|s>>>26))|~i))+r[3]+2399980690&4294967295,o=t+(s<<10&4294967295|s>>>22),s=i+(t^(o|~n))+r[10]+4293915773&4294967295,s=n+(o^((i=o+(s<<15&4294967295|s>>>17))|~t))+r[1]+2240044497&4294967295,s=t+(i^((n=i+(s<<21&4294967295|s>>>11))|~o))+r[8]+1873313359&4294967295,s=o+(n^((t=n+(s<<6&4294967295|s>>>26))|~i))+r[15]+4264355552&4294967295,o=t+(s<<10&4294967295|s>>>22),s=i+(t^(o|~n))+r[6]+2734768916&4294967295,s=n+(o^((i=o+(s<<15&4294967295|s>>>17))|~t))+r[13]+1309151649&4294967295,s=t+(i^((n=i+(s<<21&4294967295|s>>>11))|~o))+r[4]+4149444226&4294967295,s=o+(n^((t=n+(s<<6&4294967295|s>>>26))|~i))+r[11]+3174756917&4294967295,o=t+(s<<10&4294967295|s>>>22),s=i+(t^(o|~n))+r[2]+718787259&4294967295,s=n+(o^((i=o+(s<<15&4294967295|s>>>17))|~t))+r[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(i+(s<<21&4294967295|s>>>11))&4294967295,e.g[2]=e.g[2]+i&4294967295,e.g[3]=e.g[3]+o&4294967295}function r(e,t){this.h=t;const n=[];let r=!0;for(let i=e.length-1;i>=0;i--){const s=0|e[i];r&&s==t||(n[i]=s,r=!1)}this.g=n}!function(e,t){function n(){}n.prototype=t.prototype,e.F=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.D=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}(t,function(){this.blockSize=-1}),t.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},t.prototype.v=function(e,t){void 0===t&&(t=e.length);const r=t-this.blockSize,i=this.C;let s=this.h,o=0;for(;o<t;){if(0==s)for(;o<=r;)n(this,e,o),o+=this.blockSize;if("string"==typeof e){for(;o<t;)if(i[s++]=e.charCodeAt(o++),s==this.blockSize){n(this,i),s=0;break}}else for(;o<t;)if(i[s++]=e[o++],s==this.blockSize){n(this,i),s=0;break}}this.h=s,this.o+=t},t.prototype.A=function(){var e=Array((this.h<56?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;t=8*this.o;for(var n=e.length-8;n<e.length;++n)e[n]=255&t,t/=256;for(this.v(e),e=Array(16),t=0,n=0;n<4;++n)for(let r=0;r<32;r+=8)e[t++]=this.g[n]>>>r&255;return e};var i={};function s(e){return-128<=e&&e<128?function(e,t){var n=i;return Object.prototype.hasOwnProperty.call(n,e)?n[e]:n[e]=t(e)}(e,function(e){return new r([0|e],e<0?-1:0)}):new r([0|e],e<0?-1:0)}function o(e){if(isNaN(e)||!isFinite(e))return a;if(e<0)return d(o(-e));const t=[];let n=1;for(let r=0;e>=n;r++)t[r]=e/n|0,n*=4294967296;return new r(t,0)}var a=s(0),c=s(1),u=s(16777216);function l(e){if(0!=e.h)return!1;for(let t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function h(e){return-1==e.h}function d(e){const t=e.g.length,n=[];for(let r=0;r<t;r++)n[r]=~e.g[r];return new r(n,~e.h).add(c)}function f(e,t){return e.add(d(t))}function p(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function m(e,t){this.g=e,this.h=t}function g(e,t){if(l(t))throw Error("division by zero");if(l(e))return new m(a,a);if(h(e))return t=g(d(e),t),new m(d(t.g),d(t.h));if(h(t))return t=g(e,d(t)),new m(d(t.g),t.h);if(e.g.length>30){if(h(e)||h(t))throw Error("slowDivide_ only works with positive integers.");for(var n=c,r=t;r.l(e)<=0;)n=y(n),r=y(r);var i=v(n,1),s=v(r,1);for(r=v(r,2),n=v(n,2);!l(r);){var u=s.add(r);u.l(e)<=0&&(i=i.add(n),s=u),r=v(r,1),n=v(n,1)}return t=f(e,i.j(t)),new m(i,t)}for(i=a;e.l(t)>=0;){for(n=Math.max(1,Math.floor(e.m()/t.m())),r=(r=Math.ceil(Math.log(n)/Math.LN2))<=48?1:Math.pow(2,r-48),u=(s=o(n)).j(t);h(u)||u.l(e)>0;)u=(s=o(n-=r)).j(t);l(s)&&(s=c),i=i.add(s),e=f(e,u)}return new m(i,e)}function y(e){const t=e.g.length+1,n=[];for(let r=0;r<t;r++)n[r]=e.i(r)<<1|e.i(r-1)>>>31;return new r(n,e.h)}function v(e,t){const n=t>>5;t%=32;const i=e.g.length-n,s=[];for(let r=0;r<i;r++)s[r]=t>0?e.i(r+n)>>>t|e.i(r+n+1)<<32-t:e.i(r+n);return new r(s,e.h)}(e=r.prototype).m=function(){if(h(this))return-d(this).m();let e=0,t=1;for(let n=0;n<this.g.length;n++){const r=this.i(n);e+=(r>=0?r:4294967296+r)*t,t*=4294967296}return e},e.toString=function(e){if((e=e||10)<2||36<e)throw Error("radix out of range: "+e);if(l(this))return"0";if(h(this))return"-"+d(this).toString(e);const t=o(Math.pow(e,6));var n=this;let r="";for(;;){const i=g(n,t).g;let s=(((n=f(n,i.j(t))).g.length>0?n.g[0]:n.h)>>>0).toString(e);if(l(n=i))return s+r;for(;s.length<6;)s="0"+s;r=s+r}},e.i=function(e){return e<0?0:e<this.g.length?this.g[e]:this.h},e.l=function(e){return h(e=f(this,e))?-1:l(e)?0:1},e.abs=function(){return h(this)?d(this):this},e.add=function(e){const t=Math.max(this.g.length,e.g.length),n=[];let i=0;for(let r=0;r<=t;r++){let t=i+(65535&this.i(r))+(65535&e.i(r)),s=(t>>>16)+(this.i(r)>>>16)+(e.i(r)>>>16);i=s>>>16,t&=65535,s&=65535,n[r]=s<<16|t}return new r(n,-2147483648&n[n.length-1]?-1:0)},e.j=function(e){if(l(this)||l(e))return a;if(h(this))return h(e)?d(this).j(d(e)):d(d(this).j(e));if(h(e))return d(this.j(d(e)));if(this.l(u)<0&&e.l(u)<0)return o(this.m()*e.m());const t=this.g.length+e.g.length,n=[];for(var i=0;i<2*t;i++)n[i]=0;for(i=0;i<this.g.length;i++)for(let t=0;t<e.g.length;t++){const r=this.i(i)>>>16,s=65535&this.i(i),o=e.i(t)>>>16,a=65535&e.i(t);n[2*i+2*t]+=s*a,p(n,2*i+2*t),n[2*i+2*t+1]+=r*a,p(n,2*i+2*t+1),n[2*i+2*t+1]+=s*o,p(n,2*i+2*t+1),n[2*i+2*t+2]+=r*o,p(n,2*i+2*t+2)}for(e=0;e<t;e++)n[e]=n[2*e+1]<<16|n[2*e];for(e=t;e<2*t;e++)n[e]=0;return new r(n,0)},e.B=function(e){return g(this,e).h},e.and=function(e){const t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)&e.i(r);return new r(n,this.h&e.h)},e.or=function(e){const t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)|e.i(r);return new r(n,this.h|e.h)},e.xor=function(e){const t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)^e.i(r);return new r(n,this.h^e.h)},t.prototype.digest=t.prototype.A,t.prototype.reset=t.prototype.u,t.prototype.update=t.prototype.v,vo=t,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.B,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=o,r.fromString=function e(t,n){if(0==t.length)throw Error("number format error: empty string");if((n=n||10)<2||36<n)throw Error("radix out of range: "+n);if("-"==t.charAt(0))return d(e(t.substring(1),n));if(t.indexOf("-")>=0)throw Error('number format error: interior "-" character');const r=o(Math.pow(n,8));let i=a;for(let a=0;a<t.length;a+=8){var s=Math.min(8,t.length-a);const e=parseInt(t.substring(a,a+s),n);s<8?(s=o(Math.pow(n,s)),i=i.j(s).add(o(e))):(i=i.j(r),i=i.add(o(e)))}return i},yo=r}).apply(void 0!==wo?wo:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var Io,_o,bo,To,Eo,So,Ao,Co,ko="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e,t=Object.defineProperty;var n=function(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof ko&&ko];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);function r(e,r){if(r)e:{var i=n;e=e.split(".");for(var s=0;s<e.length-1;s++){var o=e[s];if(!(o in i))break e;i=i[o]}(r=r(s=i[e=e[e.length-1]]))!=s&&null!=r&&t(i,e,{configurable:!0,writable:!0,value:r})}}r("Symbol.dispose",function(e){return e||Symbol("Symbol.dispose")}),r("Array.prototype.values",function(e){return e||function(){return this[Symbol.iterator]()}}),r("Object.entries",function(e){return e||function(e){var t,n=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&n.push([t,e[t]]);return n}});
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
var i=i||{},s=this||self;function o(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function a(e,t,n){return e.call.apply(e.bind,arguments)}function c(e,t,n){return(c=a).apply(null,arguments)}function u(e,t){var n=Array.prototype.slice.call(arguments,1);return function(){var t=n.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function l(e,t){function n(){}n.prototype=t.prototype,e.Z=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.Ob=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}var h="undefined"!=typeof AsyncContext&&"function"==typeof AsyncContext.Snapshot?e=>e&&AsyncContext.Snapshot.wrap(e):e=>e;function d(e){const t=e.length;if(t>0){const n=Array(t);for(let r=0;r<t;r++)n[r]=e[r];return n}return[]}function f(e,t){for(let r=1;r<arguments.length;r++){const t=arguments[r];var n=typeof t;if("array"==(n="object"!=n?n:t?Array.isArray(t)?"array":n:"null")||"object"==n&&"number"==typeof t.length){n=e.length||0;const r=t.length||0;e.length=n+r;for(let i=0;i<r;i++)e[n+i]=t[i]}else e.push(t)}}function p(e){s.setTimeout(()=>{throw e},0)}function m(){var e=I;let t=null;return e.g&&(t=e.g,e.g=e.g.next,e.g||(e.h=null),t.next=null),t}var g=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return this.h>0?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}(()=>new y,e=>e.reset());class y{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let v,w=!1,I=new class{constructor(){this.h=this.g=null}add(e,t){const n=g.get();n.set(e,t),this.h?this.h.next=n:this.g=n,this.h=n}},_=()=>{const e=Promise.resolve(void 0);v=()=>{e.then(b)}};function b(){for(var e;e=m();){try{e.h.call(e.g)}catch(n){p(n)}var t=g;t.j(e),t.h<100&&(t.h++,e.next=t.g,t.g=e)}w=!1}function T(){this.u=this.u,this.C=this.C}function E(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}T.prototype.u=!1,T.prototype.dispose=function(){this.u||(this.u=!0,this.N())},T.prototype[Symbol.dispose]=function(){this.dispose()},T.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},E.prototype.h=function(){this.defaultPrevented=!0};var S=function(){if(!s.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{const e=()=>{};s.addEventListener("test",e,t),s.removeEventListener("test",e,t)}catch(n){}return e}();function A(e){return/^[\s\xa0]*$/.test(e)}function C(e,t){E.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e&&this.init(e,t)}l(C,E),C.prototype.init=function(e,t){const n=this.type=e.type,r=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;this.target=e.target||e.srcElement,this.g=t,(t=e.relatedTarget)||("mouseover"==n?t=e.fromElement:"mouseout"==n&&(t=e.toElement)),this.relatedTarget=t,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType=e.pointerType,this.state=e.state,this.i=e,e.defaultPrevented&&C.Z.h.call(this)},C.prototype.h=function(){C.Z.h.call(this);const e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var k="closure_listenable_"+(1e6*Math.random()|0),N=0;function D(e,t,n,r,i){this.listener=e,this.proxy=null,this.src=t,this.type=n,this.capture=!!r,this.ha=i,this.key=++N,this.da=this.fa=!1}function R(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function P(e,t,n){for(const r in e)t.call(n,e[r],r,e)}function O(e){const t={};for(const n in e)t[n]=e[n];return t}const x="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function L(e,t){let n,r;for(let i=1;i<arguments.length;i++){for(n in r=arguments[i],r)e[n]=r[n];for(let t=0;t<x.length;t++)n=x[t],Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}}function M(e){this.src=e,this.g={},this.h=0}function F(e,t){const n=t.type;if(n in e.g){var r,i=e.g[n],s=Array.prototype.indexOf.call(i,t,void 0);(r=s>=0)&&Array.prototype.splice.call(i,s,1),r&&(R(t),0==e.g[n].length&&(delete e.g[n],e.h--))}}function V(e,t,n,r){for(let i=0;i<e.length;++i){const s=e[i];if(!s.da&&s.listener==t&&s.capture==!!n&&s.ha==r)return i}return-1}M.prototype.add=function(e,t,n,r,i){const s=e.toString();(e=this.g[s])||(e=this.g[s]=[],this.h++);const o=V(e,t,r,i);return o>-1?(t=e[o],n||(t.fa=!1)):((t=new D(t,this.src,s,!!r,i)).fa=n,e.push(t)),t};var U="closure_lm_"+(1e6*Math.random()|0),q={};function j(e,t,n,r,i){if(Array.isArray(t)){for(let s=0;s<t.length;s++)j(e,t[s],n,r,i);return null}return n=W(n),e&&e[k]?e.J(t,n,!!o(r)&&!!r.capture,i):function(e,t,n,r,i,s){if(!t)throw Error("Invalid event type");const a=o(i)?!!i.capture:!!i;let c=G(e);if(c||(e[U]=c=new M(e)),n=c.add(t,n,r,a,s),n.proxy)return n;if(r=function(){function e(n){return t.call(e.src,e.listener,n)}const t=K;return e}(),n.proxy=r,r.src=e,r.listener=n,e.addEventListener)S||(i=a),void 0===i&&(i=!1),e.addEventListener(t.toString(),r,i);else if(e.attachEvent)e.attachEvent($(t.toString()),r);else{if(!e.addListener||!e.removeListener)throw Error("addEventListener and attachEvent are unavailable.");e.addListener(r)}return n}(e,t,n,!1,r,i)}function B(e,t,n,r,i){if(Array.isArray(t))for(var s=0;s<t.length;s++)B(e,t[s],n,r,i);else r=o(r)?!!r.capture:!!r,n=W(n),e&&e[k]?(e=e.i,(s=String(t).toString())in e.g&&((n=V(t=e.g[s],n,r,i))>-1&&(R(t[n]),Array.prototype.splice.call(t,n,1),0==t.length&&(delete e.g[s],e.h--)))):e&&(e=G(e))&&(t=e.g[t.toString()],e=-1,t&&(e=V(t,n,r,i)),(n=e>-1?t[e]:null)&&z(n))}function z(e){if("number"!=typeof e&&e&&!e.da){var t=e.src;if(t&&t[k])F(t.i,e);else{var n=e.type,r=e.proxy;t.removeEventListener?t.removeEventListener(n,r,e.capture):t.detachEvent?t.detachEvent($(n),r):t.addListener&&t.removeListener&&t.removeListener(r),(n=G(t))?(F(n,e),0==n.h&&(n.src=null,t[U]=null)):R(e)}}}function $(e){return e in q?q[e]:q[e]="on"+e}function K(e,t){if(e.da)e=!0;else{t=new C(t,this);const n=e.listener,r=e.ha||e.src;e.fa&&z(e),e=n.call(r,t)}return e}function G(e){return(e=e[U])instanceof M?e:null}var H="__closure_events_fn_"+(1e9*Math.random()>>>0);function W(e){return"function"==typeof e?e:(e[H]||(e[H]=function(t){return e.handleEvent(t)}),e[H])}function Q(){T.call(this),this.i=new M(this),this.M=this,this.G=null}function J(e,t){var n,r=e.G;if(r)for(n=[];r;r=r.G)n.push(r);if(e=e.M,r=t.type||t,"string"==typeof t)t=new E(t,e);else if(t instanceof E)t.target=t.target||e;else{var i=t;L(t=new E(r,e),i)}let s,o;if(i=!0,n)for(o=n.length-1;o>=0;o--)s=t.g=n[o],i=Y(s,r,!0,t)&&i;if(s=t.g=e,i=Y(s,r,!0,t)&&i,i=Y(s,r,!1,t)&&i,n)for(o=0;o<n.length;o++)s=t.g=n[o],i=Y(s,r,!1,t)&&i}function Y(e,t,n,r){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();let i=!0;for(let s=0;s<t.length;++s){const o=t[s];if(o&&!o.da&&o.capture==n){const t=o.listener,n=o.ha||o.src;o.fa&&F(e.i,o),i=!1!==t.call(n,r)&&i}}return i&&!r.defaultPrevented}function X(e){e.g=function(e,t){if("function"!=typeof e){if(!e||"function"!=typeof e.handleEvent)throw Error("Invalid listener argument");e=c(e.handleEvent,e)}return Number(t)>2147483647?-1:s.setTimeout(e,t||0)}(()=>{e.g=null,e.i&&(e.i=!1,X(e))},e.l);const t=e.h;e.h=null,e.m.apply(null,t)}l(Q,T),Q.prototype[k]=!0,Q.prototype.removeEventListener=function(e,t,n,r){B(this,e,t,n,r)},Q.prototype.N=function(){if(Q.Z.N.call(this),this.i){var e=this.i;for(const t in e.g){const n=e.g[t];for(let e=0;e<n.length;e++)R(n[e]);delete e.g[t],e.h--}}this.G=null},Q.prototype.J=function(e,t,n,r){return this.i.add(String(e),t,!1,n,r)},Q.prototype.K=function(e,t,n,r){return this.i.add(String(e),t,!0,n,r)};class Z extends T{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:X(this)}N(){super.N(),this.g&&(s.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ee(e){T.call(this),this.h=e,this.g={}}l(ee,T);var te=[];function ne(e){P(e.g,function(e,t){this.g.hasOwnProperty(t)&&z(e)},e),e.g={}}ee.prototype.N=function(){ee.Z.N.call(this),ne(this)},ee.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var re=s.JSON.stringify,ie=s.JSON.parse,se=class{stringify(e){return s.JSON.stringify(e,void 0)}parse(e){return s.JSON.parse(e,void 0)}};function oe(){}function ae(){}var ce={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function ue(){E.call(this,"d")}function le(){E.call(this,"c")}l(ue,E),l(le,E);var he={},de=null;function fe(){return de=de||new Q}function pe(e){E.call(this,he.Ia,e)}function me(e){const t=fe();J(t,new pe(t))}function ge(e,t){E.call(this,he.STAT_EVENT,e),this.stat=t}function ye(e){const t=fe();J(t,new ge(t,e))}function ve(e,t){E.call(this,he.Ja,e),this.size=t}function we(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return s.setTimeout(function(){e()},t)}function Ie(){this.g=!0}function _e(e,t,n,r){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{const s=JSON.parse(t);if(s)for(e=0;e<s.length;e++)if(Array.isArray(s[e])){var n=s[e];if(!(n.length<2)){var r=n[1];if(Array.isArray(r)&&!(r.length<1)){var i=r[0];if("noop"!=i&&"stop"!=i&&"close"!=i)for(let e=1;e<r.length;e++)r[e]=""}}}return re(s)}catch(s){return t}}(e,n)+(r?" "+r:"")})}he.Ia="serverreachability",l(pe,E),he.STAT_EVENT="statevent",l(ge,E),he.Ja="timingevent",l(ve,E),Ie.prototype.ua=function(){this.g=!1},Ie.prototype.info=function(){};var be,Te={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Ee={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"};function Se(){}function Ae(e){return encodeURIComponent(String(e))}function Ce(e){var t=1;e=e.split(":");const n=[];for(;t>0&&e.length;)n.push(e.shift()),t--;return e.length&&n.push(e.join(":")),n}function ke(e,t,n,r){this.j=e,this.i=t,this.l=n,this.S=r||1,this.V=new ee(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Ne}function Ne(){this.i=null,this.g="",this.h=!1}l(Se,oe),Se.prototype.g=function(){return new XMLHttpRequest},be=new Se;var De={},Re={};function Pe(e,t,n){e.M=1,e.A=rt(Xe(t)),e.u=n,e.R=!0,Oe(e,null)}function Oe(e,t){e.F=Date.now(),Me(e),e.B=Xe(e.A);var n=e.B,r=e.S;Array.isArray(r)||(r=[String(r)]),yt(n.i,"t",r),e.C=0,n=e.j.L,e.h=new Ne,e.g=rn(e.j,n?t:null,!e.u),e.P>0&&(e.O=new Z(c(e.Y,e,e.g),e.P)),t=e.V,n=e.g,r=e.ba;var i="readystatechange";Array.isArray(i)||(i&&(te[0]=i.toString()),i=te);for(let s=0;s<i.length;s++){const e=j(n,i[s],r||t.handleEvent,!1,t.h||t);if(!e)break;t.g[e.key]=e}t=e.J?O(e.J):{},e.u?(e.v||(e.v="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.B,e.v,e.u,t)):(e.v="GET",e.g.ea(e.B,e.v,null,t)),me(),function(e,t,n,r,i,s){e.info(function(){if(e.g)if(s){var o="",a=s.split("&");for(let e=0;e<a.length;e++){var c=a[e].split("=");if(c.length>1){const e=c[0];c=c[1];const t=e.split("_");o=t.length>=2&&"type"==t[1]?o+(e+"=")+c+"&":o+(e+"=redacted&")}}}else o=null;else o=s;return"XMLHTTP REQ ("+r+") [attempt "+i+"]: "+t+"\n"+n+"\n"+o})}(e.i,e.v,e.B,e.l,e.S,e.u)}function xe(e){return!!e.g&&("GET"==e.v&&2!=e.M&&e.j.Aa)}function Le(e,t){var n=e.C,r=t.indexOf("\n",n);return-1==r?Re:(n=Number(t.substring(n,r)),isNaN(n)?De:(r+=1)+n>t.length?Re:(t=t.slice(r,r+n),e.C=r+n,t))}function Me(e){e.T=Date.now()+e.H,Fe(e,e.H)}function Fe(e,t){if(null!=e.D)throw Error("WatchDog timer not null");e.D=we(c(e.aa,e),t)}function Ve(e){e.D&&(s.clearTimeout(e.D),e.D=null)}function Ue(e){0==e.j.I||e.K||Xt(e.j,e)}function qe(e){Ve(e);var t=e.O;t&&"function"==typeof t.dispose&&t.dispose(),e.O=null,ne(e.V),e.g&&(t=e.g,e.g=null,t.abort(),t.dispose())}function je(e,t){try{var n=e.j;if(0!=n.I&&(n.g==e||Ge(n.h,e)))if(!e.L&&Ge(n.h,e)&&3==n.I){try{var r=n.Ba.g.parse(t)}catch(l){r=null}if(Array.isArray(r)&&3==r.length){var i=r;if(0==i[0]){e:if(!n.v){if(n.g){if(!(n.g.F+3e3<e.F))break e;Yt(n),jt(n)}Wt(n),ye(18)}}else n.xa=i[1],0<n.xa-n.K&&i[2]<37500&&n.F&&0==n.A&&!n.C&&(n.C=we(c(n.Va,n),6e3));Ke(n.h)<=1&&n.ta&&(n.ta=void 0)}else en(n,11)}else if((e.L||n.g==e)&&Yt(n),!A(t))for(i=n.Ba.g.parse(t),t=0;t<i.length;t++){let c=i[t];const l=c[0];if(!(l<=n.K))if(n.K=l,c=c[1],2==n.I)if("c"==c[0]){n.M=c[1],n.ba=c[2];const t=c[3];null!=t&&(n.ka=t,n.j.info("VER="+n.ka));const i=c[4];null!=i&&(n.za=i,n.j.info("SVER="+n.za));const l=c[5];null!=l&&"number"==typeof l&&l>0&&(r=1.5*l,n.O=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const h=e.g;if(h){const e=h.g?h.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var s=r.h;s.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(s.j=s.l,s.g=new Set,s.h&&(He(s,s.h),s.h=null))}if(r.G){const e=h.g?h.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(r.wa=e,nt(r.J,r.G,e))}}n.I=3,n.l&&n.l.ra(),n.aa&&(n.T=Date.now()-e.F,n.j.info("Handshake RTT: "+n.T+"ms"));var o=e;if((r=n).na=nn(r,r.L?r.ba:null,r.W),o.L){We(r.h,o);var a=o,u=r.O;u&&(a.H=u),a.D&&(Ve(a),Me(a)),r.g=o}else Ht(r);n.i.length>0&&zt(n)}else"stop"!=c[0]&&"close"!=c[0]||en(n,7);else 3==n.I&&("stop"==c[0]||"close"==c[0]?"stop"==c[0]?en(n,7):qt(n):"noop"!=c[0]&&n.l&&n.l.qa(c),n.A=0)}me()}catch(l){}}ke.prototype.ba=function(e){e=e.target;const t=this.O;t&&3==Mt(e)?t.j():this.Y(e)},ke.prototype.Y=function(e){try{if(e==this.g)e:{const c=Mt(this.g),u=this.g.ya();this.g.ca();if(!(c<3)&&(3!=c||this.g&&(this.h.h||this.g.la()||Ft(this.g)))){this.K||4!=c||7==u||me(),Ve(this);var t=this.g.ca();this.X=t;var n=function(e){if(!xe(e))return e.g.la();const t=Ft(e.g);if(""===t)return"";let n="";const r=t.length,i=4==Mt(e.g);if(!e.h.i){if("undefined"==typeof TextDecoder)return qe(e),Ue(e),"";e.h.i=new s.TextDecoder}for(let s=0;s<r;s++)e.h.h=!0,n+=e.h.i.decode(t[s],{stream:!(i&&s==r-1)});return t.length=0,e.h.g+=n,e.C=0,e.h.g}(this);if(this.o=200==t,function(e,t,n,r,i,s,o){e.info(function(){return"XMLHTTP RESP ("+r+") [ attempt "+i+"]: "+t+"\n"+n+"\n"+s+" "+o})}(this.i,this.v,this.B,this.l,this.S,c,t),this.o){if(this.U&&!this.L){t:{if(this.g){var r,i=this.g;if((r=i.g?i.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!A(r)){var o=r;break t}}o=null}if(!(e=o)){this.o=!1,this.m=3,ye(12),qe(this),Ue(this);break e}_e(this.i,this.l,e,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,je(this,e)}if(this.R){let t;for(e=!0;!this.K&&this.C<n.length;){if(t=Le(this,n),t==Re){4==c&&(this.m=4,ye(14),e=!1),_e(this.i,this.l,null,"[Incomplete Response]");break}if(t==De){this.m=4,ye(15),_e(this.i,this.l,n,"[Invalid Chunk]"),e=!1;break}_e(this.i,this.l,t,null),je(this,t)}if(xe(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=c||0!=n.length||this.h.h||(this.m=1,ye(16),e=!1),this.o=this.o&&e,e){if(n.length>0&&!this.W){this.W=!0;var a=this.j;a.g==this&&a.aa&&!a.P&&(a.j.info("Great, no buffering proxy detected. Bytes received: "+n.length),Qt(a),a.P=!0,ye(11))}}else _e(this.i,this.l,n,"[Invalid Chunked Response]"),qe(this),Ue(this)}else _e(this.i,this.l,n,null),je(this,n);4==c&&qe(this),this.o&&!this.K&&(4==c?Xt(this.j,this):(this.o=!1,Me(this)))}else(function(e){const t={};e=(e.g&&Mt(e)>=2&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<e.length;r++){if(A(e[r]))continue;var n=Ce(e[r]);const i=n[0];if("string"!=typeof(n=n[1]))continue;n=n.trim();const s=t[i]||[];t[i]=s,s.push(n)}!function(e,t){for(const n in e)t.call(void 0,e[n],n,e)}(t,function(e){return e.join(", ")})})(this.g),400==t&&n.indexOf("Unknown SID")>0?(this.m=3,ye(12)):(this.m=0,ye(13)),qe(this),Ue(this)}}}catch(c){}},ke.prototype.cancel=function(){this.K=!0,qe(this)},ke.prototype.aa=function(){this.D=null;const e=Date.now();e-this.T>=0?(function(e,t){e.info(function(){return"TIMEOUT: "+t})}(this.i,this.B),2!=this.M&&(me(),ye(17)),qe(this),this.m=2,Ue(this)):Fe(this,this.T-e)};var Be=class{constructor(e,t){this.g=e,this.map=t}};function ze(e){this.l=e||10,s.PerformanceNavigationTiming?e=(e=s.performance.getEntriesByType("navigation")).length>0&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):e=!!(s.chrome&&s.chrome.loadTimes&&s.chrome.loadTimes()&&s.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function $e(e){return!!e.h||!!e.g&&e.g.size>=e.j}function Ke(e){return e.h?1:e.g?e.g.size:0}function Ge(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function He(e,t){e.g?e.g.add(t):e.h=t}function We(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function Qe(e){if(null!=e.h)return e.i.concat(e.h.G);if(null!=e.g&&0!==e.g.size){let t=e.i;for(const n of e.g.values())t=t.concat(n.G);return t}return d(e.i)}ze.prototype.cancel=function(){if(this.i=Qe(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const e of this.g.values())e.cancel();this.g.clear()}};var Je=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ye(e){let t;this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1,e instanceof Ye?(this.l=e.l,Ze(this,e.j),this.o=e.o,this.g=e.g,et(this,e.u),this.h=e.h,tt(this,vt(e.i)),this.m=e.m):e&&(t=String(e).match(Je))?(this.l=!1,Ze(this,t[1]||"",!0),this.o=it(t[2]||""),this.g=it(t[3]||"",!0),et(this,t[4]),this.h=it(t[5]||"",!0),tt(this,t[6]||"",!0),this.m=it(t[7]||"")):(this.l=!1,this.i=new dt(null,this.l))}function Xe(e){return new Ye(e)}function Ze(e,t,n){e.j=n?it(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function et(e,t){if(t){if(t=Number(t),isNaN(t)||t<0)throw Error("Bad port number "+t);e.u=t}else e.u=null}function tt(e,t,n){t instanceof dt?(e.i=t,function(e,t){t&&!e.j&&(ft(e),e.i=null,e.g.forEach(function(e,t){const n=t.toLowerCase();t!=n&&(pt(this,t),yt(this,n,e))},e)),e.j=t}(e.i,e.l)):(n||(t=st(t,lt)),e.i=new dt(t,e.l))}function nt(e,t,n){e.i.set(t,n)}function rt(e){return nt(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function it(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function st(e,t,n){return"string"==typeof e?(e=encodeURI(e).replace(t,ot),n&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function ot(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}Ye.prototype.toString=function(){const e=[];var t=this.j;t&&e.push(st(t,at,!0),":");var n=this.g;return(n||"file"==t)&&(e.push("//"),(t=this.o)&&e.push(st(t,at,!0),"@"),e.push(Ae(n).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.u)&&e.push(":",String(n))),(n=this.h)&&(this.g&&"/"!=n.charAt(0)&&e.push("/"),e.push(st(n,"/"==n.charAt(0)?ut:ct,!0))),(n=this.i.toString())&&e.push("?",n),(n=this.m)&&e.push("#",st(n,ht)),e.join("")},Ye.prototype.resolve=function(e){const t=Xe(this);let n=!!e.j;n?Ze(t,e.j):n=!!e.o,n?t.o=e.o:n=!!e.g,n?t.g=e.g:n=null!=e.u;var r=e.h;if(n)et(t,e.u);else if(n=!!e.h){if("/"!=r.charAt(0))if(this.g&&!this.h)r="/"+r;else{var i=t.h.lastIndexOf("/");-1!=i&&(r=t.h.slice(0,i+1)+r)}if(".."==(i=r)||"."==i)r="";else if(-1!=i.indexOf("./")||-1!=i.indexOf("/.")){r=0==i.lastIndexOf("/",0),i=i.split("/");const e=[];for(let t=0;t<i.length;){const n=i[t++];"."==n?r&&t==i.length&&e.push(""):".."==n?((e.length>1||1==e.length&&""!=e[0])&&e.pop(),r&&t==i.length&&e.push("")):(e.push(n),r=!0)}r=e.join("/")}else r=i}return n?t.h=r:n=""!==e.i.toString(),n?tt(t,vt(e.i)):n=!!e.m,n&&(t.m=e.m),t};var at=/[#\/\?@]/g,ct=/[#\?:]/g,ut=/[#\?]/g,lt=/[#\?@]/g,ht=/#/g;function dt(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function ft(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(let n=0;n<e.length;n++){const r=e[n].indexOf("=");let i,s=null;r>=0?(i=e[n].substring(0,r),s=e[n].substring(r+1)):i=e[n],t(i,s?decodeURIComponent(s.replace(/\+/g," ")):"")}}}(e.i,function(t,n){e.add(decodeURIComponent(t.replace(/\+/g," ")),n)}))}function pt(e,t){ft(e),t=wt(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function mt(e,t){return ft(e),t=wt(e,t),e.g.has(t)}function gt(e,t){ft(e);let n=[];if("string"==typeof t)mt(e,t)&&(n=n.concat(e.g.get(wt(e,t))));else for(e=Array.from(e.g.values()),t=0;t<e.length;t++)n=n.concat(e[t]);return n}function yt(e,t,n){pt(e,t),n.length>0&&(e.i=null,e.g.set(wt(e,t),d(n)),e.h+=n.length)}function vt(e){const t=new dt;return t.i=e.i,e.g&&(t.g=new Map(e.g),t.h=e.h),t}function wt(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function It(e,t,n,r,i){try{i&&(i.onload=null,i.onerror=null,i.onabort=null,i.ontimeout=null),r(n)}catch(s){}}function _t(){this.g=new se}function bt(e){this.i=e.Sb||null,this.h=e.ab||!1}function Tt(e,t){Q.call(this),this.H=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}function Et(e){e.j.read().then(e.Ma.bind(e)).catch(e.ga.bind(e))}function St(e){e.readyState=4,e.l=null,e.j=null,e.B=null,At(e)}function At(e){e.onreadystatechange&&e.onreadystatechange.call(e)}function Ct(e){let t="";return P(e,function(e,n){t+=n,t+=":",t+=e,t+="\r\n"}),t}function kt(e,t,n){e:{for(r in n){var r=!1;break e}r=!0}r||(n=Ct(n),"string"==typeof e?null!=n&&Ae(n):nt(e,t,n))}function Nt(e){Q.call(this),this.headers=new Map,this.L=e||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}(e=dt.prototype).add=function(e,t){ft(this),this.i=null,e=wt(this,e);let n=this.g.get(e);return n||this.g.set(e,n=[]),n.push(t),this.h+=1,this},e.forEach=function(e,t){ft(this),this.g.forEach(function(n,r){n.forEach(function(n){e.call(t,n,r,this)},this)},this)},e.set=function(e,t){return ft(this),this.i=null,mt(this,e=wt(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e.get=function(e,t){return e&&(e=gt(this,e)).length>0?String(e[0]):t},e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const e=[],t=Array.from(this.g.keys());for(let r=0;r<t.length;r++){var n=t[r];const i=Ae(n);n=gt(this,n);for(let t=0;t<n.length;t++){let r=i;""!==n[t]&&(r+="="+Ae(n[t])),e.push(r)}}return this.i=e.join("&")},l(bt,oe),bt.prototype.g=function(){return new Tt(this.i,this.h)},l(Tt,Q),(e=Tt.prototype).open=function(e,t){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.F=e,this.D=t,this.readyState=1,At(this)},e.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const t={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};e&&(t.body=e),(this.H||s).fetch(new Request(this.D,t)).then(this.Pa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&4!=this.readyState&&(this.g=!1,St(this)),this.readyState=0},e.Pa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,At(this)),this.g&&(this.readyState=3,At(this),this.g)))if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(void 0!==s.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Et(this)}else e.text().then(this.Oa.bind(this),this.ga.bind(this))},e.Ma=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array(0);(t=this.B.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?St(this):At(this),3==this.readyState&&Et(this)}},e.Oa=function(e){this.g&&(this.response=this.responseText=e,St(this))},e.Na=function(e){this.g&&(this.response=e,St(this))},e.ga=function(){this.g&&St(this)},e.setRequestHeader=function(e,t){this.A.append(e,t)},e.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const e=[],t=this.h.entries();for(var n=t.next();!n.done;)n=n.value,e.push(n[0]+": "+n[1]),n=t.next();return e.join("\r\n")},Object.defineProperty(Tt.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}}),l(Nt,Q);var Dt=/^https?$/i,Rt=["POST","PUT"];function Pt(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.o=5,Ot(e),Lt(e)}function Ot(e){e.A||(e.A=!0,J(e,"complete"),J(e,"error"))}function xt(e){if(e.h&&void 0!==i)if(e.v&&4==Mt(e))setTimeout(e.Ca.bind(e),0);else if(J(e,"readystatechange"),4==Mt(e)){e.h=!1;try{const i=e.ca();e:switch(i){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t=!0;break e;default:t=!1}var n;if(!(n=t)){var r;if(r=0===i){let t=String(e.D).match(Je)[1]||null;!t&&s.self&&s.self.location&&(t=s.self.location.protocol.slice(0,-1)),r=!Dt.test(t?t.toLowerCase():"")}n=r}if(n)J(e,"complete"),J(e,"success");else{e.o=6;try{var o=Mt(e)>2?e.g.statusText:""}catch(a){o=""}e.l=o+" ["+e.ca()+"]",Ot(e)}}finally{Lt(e)}}}function Lt(e,t){if(e.g){e.m&&(clearTimeout(e.m),e.m=null);const r=e.g;e.g=null,t||J(e,"ready");try{r.onreadystatechange=null}catch(n){}}}function Mt(e){return e.g?e.g.readyState:0}function Ft(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.F){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(t){return null}}function Vt(e,t,n){return n&&n.internalChannelParams&&n.internalChannelParams[e]||t}function Ut(e){this.za=0,this.i=[],this.j=new Ie,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Vt("failFast",!1,e),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Vt("baseRetryDelayMs",5e3,e),this.Za=Vt("retryDelaySeedMs",1e4,e),this.Ta=Vt("forwardChannelMaxRetries",2,e),this.va=Vt("forwardChannelRequestTimeoutMs",2e4,e),this.ma=e&&e.xmlHttpFactory||void 0,this.Ua=e&&e.Rb||void 0,this.Aa=e&&e.useFetchStreams||!1,this.O=void 0,this.L=e&&e.supportsCrossDomainXhr||!1,this.M="",this.h=new ze(e&&e.concurrentRequestLimit),this.Ba=new _t,this.S=e&&e.fastHandshake||!1,this.R=e&&e.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=e&&e.Pb||!1,e&&e.ua&&this.j.ua(),e&&e.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&e&&e.detectBufferingProxy||!1,this.ia=void 0,e&&e.longPollingTimeout&&e.longPollingTimeout>0&&(this.ia=e.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}function qt(e){if(Bt(e),3==e.I){var t=e.V++,n=Xe(e.J);if(nt(n,"SID",e.M),nt(n,"RID",t),nt(n,"TYPE","terminate"),Kt(e,n),(t=new ke(e,e.j,t)).M=2,t.A=rt(Xe(n)),n=!1,s.navigator&&s.navigator.sendBeacon)try{n=s.navigator.sendBeacon(t.A.toString(),"")}catch(r){}!n&&s.Image&&((new Image).src=t.A,n=!0),n||(t.g=rn(t.j,null),t.g.ea(t.A)),t.F=Date.now(),Me(t)}tn(e)}function jt(e){e.g&&(Qt(e),e.g.cancel(),e.g=null)}function Bt(e){jt(e),e.v&&(s.clearTimeout(e.v),e.v=null),Yt(e),e.h.cancel(),e.m&&("number"==typeof e.m&&s.clearTimeout(e.m),e.m=null)}function zt(e){if(!$e(e.h)&&!e.m){e.m=!0;var t=e.Ea;v||_(),w||(v(),w=!0),I.add(t,e),e.D=0}}function $t(e,t){var n;n=t?t.l:e.V++;const r=Xe(e.J);nt(r,"SID",e.M),nt(r,"RID",n),nt(r,"AID",e.K),Kt(e,r),e.u&&e.o&&kt(r,e.u,e.o),n=new ke(e,e.j,n,e.D+1),null===e.u&&(n.J=e.o),t&&(e.i=t.G.concat(e.i)),t=Gt(e,n,1e3),n.H=Math.round(.5*e.va)+Math.round(.5*e.va*Math.random()),He(e.h,n),Pe(n,r,t)}function Kt(e,t){e.H&&P(e.H,function(e,n){nt(t,n,e)}),e.l&&P({},function(e,n){nt(t,n,e)})}function Gt(e,t,n){n=Math.min(e.i.length,n);const r=e.l?c(e.l.Ka,e.l,e):null;e:{var i=e.i;let t=-1;for(;;){const e=["count="+n];-1==t?n>0?(t=i[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let c=!0;for(let l=0;l<n;l++){var s=i[l].g;const n=i[l].map;if((s-=t)<0)t=Math.max(0,i[l].g-100),c=!1;else try{s="req"+s+"_"||"";try{var a=n instanceof Map?n:Object.entries(n);for(const[t,n]of a){let r=n;o(n)&&(r=re(n)),e.push(s+t+"="+encodeURIComponent(r))}}catch(u){throw e.push(s+"type="+encodeURIComponent("_badmap")),u}}catch(u){r&&r(n)}}if(c){a=e.join("&");break e}}a=void 0}return e=e.i.splice(0,n),t.G=e,a}function Ht(e){if(!e.g&&!e.v){e.Y=1;var t=e.Da;v||_(),w||(v(),w=!0),I.add(t,e),e.A=0}}function Wt(e){return!(e.g||e.v||e.A>=3)&&(e.Y++,e.v=we(c(e.Da,e),Zt(e,e.A)),e.A++,!0)}function Qt(e){null!=e.B&&(s.clearTimeout(e.B),e.B=null)}function Jt(e){e.g=new ke(e,e.j,"rpc",e.Y),null===e.u&&(e.g.J=e.o),e.g.P=0;var t=Xe(e.na);nt(t,"RID","rpc"),nt(t,"SID",e.M),nt(t,"AID",e.K),nt(t,"CI",e.F?"0":"1"),!e.F&&e.ia&&nt(t,"TO",e.ia),nt(t,"TYPE","xmlhttp"),Kt(e,t),e.u&&e.o&&kt(t,e.u,e.o),e.O&&(e.g.H=e.O);var n=e.g;e=e.ba,n.M=1,n.A=rt(Xe(t)),n.u=null,n.R=!0,Oe(n,e)}function Yt(e){null!=e.C&&(s.clearTimeout(e.C),e.C=null)}function Xt(e,t){var n=null;if(e.g==t){Yt(e),Qt(e),e.g=null;var r=2}else{if(!Ge(e.h,t))return;n=t.G,We(e.h,t),r=1}if(0!=e.I)if(t.o)if(1==r){n=t.u?t.u.length:0,t=Date.now()-t.F;var i=e.D;J(r=fe(),new ve(r,n)),zt(e)}else Ht(e);else if(3==(i=t.m)||0==i&&t.X>0||!(1==r&&function(e,t){return!(Ke(e.h)>=e.h.j-(e.m?1:0)||(e.m?(e.i=t.G.concat(e.i),0):1==e.I||2==e.I||e.D>=(e.Sa?0:e.Ta)||(e.m=we(c(e.Ea,e,t),Zt(e,e.D)),e.D++,0)))}(e,t)||2==r&&Wt(e)))switch(n&&n.length>0&&(t=e.h,t.i=t.i.concat(n)),i){case 1:en(e,5);break;case 4:en(e,10);break;case 3:en(e,6);break;default:en(e,2)}}function Zt(e,t){let n=e.Qa+Math.floor(Math.random()*e.Za);return e.isActive()||(n*=2),n*t}function en(e,t){if(e.j.info("Error code "+t),2==t){var n=c(e.bb,e),r=e.Ua;const t=!r;r=new Ye(r||"//www.google.com/images/cleardot.gif"),s.location&&"http"==s.location.protocol||Ze(r,"https"),rt(r),t?function(e,t){const n=new Ie;if(s.Image){const r=new Image;r.onload=u(It,n,"TestLoadImage: loaded",!0,t,r),r.onerror=u(It,n,"TestLoadImage: error",!1,t,r),r.onabort=u(It,n,"TestLoadImage: abort",!1,t,r),r.ontimeout=u(It,n,"TestLoadImage: timeout",!1,t,r),s.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=e}else t(!1)}(r.toString(),n):function(e,t){new Ie;const n=new AbortController,r=setTimeout(()=>{n.abort(),It(0,0,!1,t)},1e4);fetch(e,{signal:n.signal}).then(e=>{clearTimeout(r),e.ok?It(0,0,!0,t):It(0,0,!1,t)}).catch(()=>{clearTimeout(r),It(0,0,!1,t)})}(r.toString(),n)}else ye(2);e.I=0,e.l&&e.l.pa(t),tn(e),Bt(e)}function tn(e){if(e.I=0,e.ja=[],e.l){const t=Qe(e.h);0==t.length&&0==e.i.length||(f(e.ja,t),f(e.ja,e.i),e.h.i.length=0,d(e.i),e.i.length=0),e.l.oa()}}function nn(e,t,n){var r=n instanceof Ye?Xe(n):new Ye(n);if(""!=r.g)t&&(r.g=t+"."+r.g),et(r,r.u);else{var i=s.location;r=i.protocol,t=t?t+"."+i.hostname:i.hostname,i=+i.port;const e=new Ye(null);r&&Ze(e,r),t&&(e.g=t),i&&et(e,i),n&&(e.h=n),r=e}return n=e.G,t=e.wa,n&&t&&nt(r,n,t),nt(r,"VER",e.ka),Kt(e,r),r}function rn(e,t,n){if(t&&!e.L)throw Error("Can't create secondary domain capable XhrIo object.");return(t=e.Aa&&!e.ma?new Nt(new bt({ab:n})):new Nt(e.ma)).Fa(e.L),t}function sn(){}function on(){}function an(e,t){Q.call(this),this.g=new Ut(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.sa&&(e?e["X-WebChannel-Client-Profile"]=t.sa:e={"X-WebChannel-Client-Profile":t.sa}),this.g.U=e,(e=t&&t.Qb)&&!A(e)&&(this.g.u=e),this.A=t&&t.supportsCrossDomainXhr||!1,this.v=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!A(t)&&(this.g.G=t,null!==(e=this.h)&&t in e&&(t in(e=this.h)&&delete e[t])),this.j=new ln(this)}function cn(e){ue.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(const n in t){e=n;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function un(){le.call(this),this.status=1}function ln(e){this.g=e}(e=Nt.prototype).Fa=function(e){this.H=e},e.ea=function(e,t,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);t=t?t.toUpperCase():"GET",this.D=e,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():be.g(),this.g.onreadystatechange=h(c(this.Ca,this));try{this.B=!0,this.g.open(t,String(e),!0),this.B=!1}catch(o){return void Pt(this,o)}if(e=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var i in r)n.set(i,r[i]);else{if("function"!=typeof r.keys||"function"!=typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const e of r.keys())n.set(e,r.get(e))}r=Array.from(n.keys()).find(e=>"content-type"==e.toLowerCase()),i=s.FormData&&e instanceof s.FormData,!(Array.prototype.indexOf.call(Rt,t,void 0)>=0)||r||i||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[s,a]of n)this.g.setRequestHeader(s,a);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(e),this.v=!1}catch(o){Pt(this,o)}},e.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=e||7,J(this,"complete"),J(this,"abort"),Lt(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Lt(this,!0)),Nt.Z.N.call(this)},e.Ca=function(){this.u||(this.B||this.v||this.j?xt(this):this.Xa())},e.Xa=function(){xt(this)},e.isActive=function(){return!!this.g},e.ca=function(){try{return Mt(this)>2?this.g.status:-1}catch(e){return-1}},e.la=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},e.La=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),ie(t)}},e.ya=function(){return this.o},e.Ha=function(){return"string"==typeof this.l?this.l:String(this.l)},(e=Ut.prototype).ka=8,e.I=1,e.connect=function(e,t,n,r){ye(0),this.W=e,this.H=t||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.J=nn(this,null,this.W),zt(this)},e.Ea=function(e){if(this.m)if(this.m=null,1==this.I){if(!e){this.V=Math.floor(1e5*Math.random()),e=this.V++;const i=new ke(this,this.j,e);let s=this.o;if(this.U&&(s?(s=O(s),L(s,this.U)):s=this.U),null!==this.u||this.R||(i.J=s,s=null),this.S)e:{for(var t=0,n=0;n<this.i.length;n++){var r=this.i[n];if(void 0===(r="__data__"in r.map&&"string"==typeof(r=r.map.__data__)?r.length:void 0))break;if((t+=r)>4096){t=n;break e}if(4096===t||n===this.i.length-1){t=n+1;break e}}t=1e3}else t=1e3;t=Gt(this,i,t),nt(n=Xe(this.J),"RID",e),nt(n,"CVER",22),this.G&&nt(n,"X-HTTP-Session-Id",this.G),Kt(this,n),s&&(this.R?t="headers="+Ae(Ct(s))+"&"+t:this.u&&kt(n,this.u,s)),He(this.h,i),this.Ra&&nt(n,"TYPE","init"),this.S?(nt(n,"$req",t),nt(n,"SID","null"),i.U=!0,Pe(i,n,null)):Pe(i,n,t),this.I=2}}else 3==this.I&&(e?$t(this,e):0==this.i.length||$e(this.h)||$t(this))},e.Da=function(){if(this.v=null,Jt(this),this.aa&&!(this.P||null==this.g||this.T<=0)){var e=4*this.T;this.j.info("BP detection timer enabled: "+e),this.B=we(c(this.Wa,this),e)}},e.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,ye(10),jt(this),Jt(this))},e.Va=function(){null!=this.C&&(this.C=null,jt(this),Wt(this),ye(19))},e.bb=function(e){e?(this.j.info("Successfully pinged google.com"),ye(2)):(this.j.info("Failed to ping google.com"),ye(1))},e.isActive=function(){return!!this.l&&this.l.isActive(this)},(e=sn.prototype).ra=function(){},e.qa=function(){},e.pa=function(){},e.oa=function(){},e.isActive=function(){return!0},e.Ka=function(){},on.prototype.g=function(e,t){return new an(e,t)},l(an,Q),an.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},an.prototype.close=function(){qt(this.g)},an.prototype.o=function(e){var t=this.g;if("string"==typeof e){var n={};n.__data__=e,e=n}else this.v&&((n={}).__data__=re(e),e=n);t.i.push(new Be(t.Ya++,e)),3==t.I&&zt(t)},an.prototype.N=function(){this.g.l=null,delete this.j,qt(this.g),delete this.g,an.Z.N.call(this)},l(cn,ue),l(un,le),l(ln,sn),ln.prototype.ra=function(){J(this.g,"a")},ln.prototype.qa=function(e){J(this.g,new cn(e))},ln.prototype.pa=function(e){J(this.g,new un)},ln.prototype.oa=function(){J(this.g,"b")},on.prototype.createWebChannel=on.prototype.g,an.prototype.send=an.prototype.o,an.prototype.open=an.prototype.m,an.prototype.close=an.prototype.close,Co=function(){return new on},Ao=function(){return fe()},So=he,Eo={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Te.NO_ERROR=0,Te.TIMEOUT=8,Te.HTTP_ERROR=6,To=Te,Ee.COMPLETE="complete",bo=Ee,ae.EventType=ce,ce.OPEN="a",ce.CLOSE="b",ce.ERROR="c",ce.MESSAGE="d",Q.prototype.listen=Q.prototype.J,_o=ae,Nt.prototype.listenOnce=Nt.prototype.K,Nt.prototype.getLastError=Nt.prototype.Ha,Nt.prototype.getLastErrorCode=Nt.prototype.ya,Nt.prototype.getStatus=Nt.prototype.ca,Nt.prototype.getResponseJson=Nt.prototype.La,Nt.prototype.getResponseText=Nt.prototype.la,Nt.prototype.send=Nt.prototype.ea,Nt.prototype.setWithCredentials=Nt.prototype.Fa,Io=Nt}).apply(void 0!==ko?ko:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class No{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}No.UNAUTHENTICATED=new No(null),No.GOOGLE_CREDENTIALS=new No("google-credentials-uid"),No.FIRST_PARTY=new No("first-party-uid"),No.MOCK_USER=new No("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Do="12.9.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ro=new K("@firebase/firestore");function Po(){return Ro.logLevel}function Oo(e,...t){if(Ro.logLevel<=U.DEBUG){const n=t.map(Mo);Ro.debug(`Firestore (${Do}): ${e}`,...n)}}function xo(e,...t){if(Ro.logLevel<=U.ERROR){const n=t.map(Mo);Ro.error(`Firestore (${Do}): ${e}`,...n)}}function Lo(e,...t){if(Ro.logLevel<=U.WARN){const n=t.map(Mo);Ro.warn(`Firestore (${Do}): ${e}`,...n)}}function Mo(e){if("string"==typeof e)return e;try{return t=e,JSON.stringify(t)}catch(n){return e}var t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fo(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,Vo(e,r,n)}function Vo(e,t,n){let r=`FIRESTORE (${Do}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(i){r+=" CONTEXT: "+n}throw xo(r),new Error(r)}function Uo(e,t,n,r){let i="Unexpected state";"string"==typeof n?i=n:r=n,e||Vo(t,i,r)}function qo(e,t){return e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jo={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Bo extends E{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $o{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Ko{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(No.UNAUTHENTICATED))}shutdown(){}}class Go{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Ho{constructor(e){this.t=e,this.currentUser=No.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Uo(void 0===this.o,42304);let n=this.i;const r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve();let i=new zo;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new zo,e.enqueueRetryable(()=>r(this.currentUser))};const s=()=>{const t=i;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},o=e=>{Oo("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),s())};this.t.onInit(e=>o(e)),setTimeout(()=>{if(!this.auth){const e=this.t.getImmediate({optional:!0});e?o(e):(Oo("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new zo)}},0),s()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(Oo("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(Uo("string"==typeof t.accessToken,31837,{l:t}),new $o(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Uo(null===e||"string"==typeof e,2055,{h:e}),new No(e)}}class Wo{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=No.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class Qo{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Wo(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(No.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Jo{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Yo{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,We(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Uo(void 0===this.o,3512);const n=e=>{null!=e.error&&Oo("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);const n=e.token!==this.m;return this.m=e.token,Oo("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};const r=e=>{Oo("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){const e=this.V.getImmediate({optional:!0});e?r(e):Oo("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new Jo(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?(Uo("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new Jo(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Xo(e){const t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{static newId(){const e=62*Math.floor(256/62);let t="";for(;t.length<20;){const n=Xo(40);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function ea(e,t){return e<t?-1:e>t?1:0}function ta(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=e.charAt(r),i=t.charAt(r);if(n!==i)return ia(n)===ia(i)?ea(n,i):ia(n)?1:-1}return ea(e.length,t.length)}const na=55296,ra=57343;function ia(e){const t=e.charCodeAt(0);return t>=na&&t<=ra}function sa(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}function oa(e){return e+"\0"}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aa="__name__";class ca{constructor(e,t,n){void 0===t?t=0:t>e.length&&Fo(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&Fo(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===ca.comparator(this,e)}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ca?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=ca.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return ea(e.length,t.length)}static compareSegments(e,t){const n=ca.isNumericId(e),r=ca.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?ca.extractNumericId(e).compare(ca.extractNumericId(t)):ta(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return yo.fromString(e.substring(4,e.length-2))}}class ua extends ca{construct(e,t,n){return new ua(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new Bo(jo.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new ua(t)}static emptyPath(){return new ua([])}}const la=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ha extends ca{construct(e,t,n){return new ha(e,t,n)}static isValidIdentifier(e){return la.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ha.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===aa}static keyField(){return new ha([aa])}static fromServerFormat(e){const t=[];let n="",r=0;const i=()=>{if(0===n.length)throw new Bo(jo.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let s=!1;for(;r<e.length;){const t=e[r];if("\\"===t){if(r+1===e.length)throw new Bo(jo.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new Bo(jo.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?(s=!s,r++):"."!==t||s?(n+=t,r++):(i(),r++)}if(i(),s)throw new Bo(jo.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ha(t)}static emptyPath(){return new ha([])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class da{constructor(e){this.path=e}static fromPath(e){return new da(ua.fromString(e))}static fromName(e){return new da(ua.fromString(e).popFirst(5))}static empty(){return new da(ua.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===ua.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return ua.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new da(new ua(e.slice()))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fa(e,t,n){if(!n)throw new Bo(jo.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function pa(e,t,n,r){if(!0===t&&!0===r)throw new Bo(jo.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function ma(e){if(!da.isDocumentKey(e))throw new Bo(jo.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function ga(e){if(da.isDocumentKey(e))throw new Bo(jo.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function ya(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}function va(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{const n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}var t;return"function"==typeof e?"a function":Fo(12329,{type:typeof e})}function wa(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new Bo(jo.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=va(e);throw new Bo(jo.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}function Ia(e,t){if(t<=0)throw new Bo(jo.INVALID_ARGUMENT,`Function ${e}() requires a positive number, but it was: ${t}.`)}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _a(e,t){const n={typeString:e};return t&&(n.value=t),n}function ba(e,t){if(!ya(e))throw new Bo(jo.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in t)if(t[r]){const i=t[r].typeString,s="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}const o=e[r];if(i&&typeof o!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(void 0!==s&&o!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new Bo(jo.INVALID_ARGUMENT,n);return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta=-62135596800,Ea=1e6;class Sa{static now(){return Sa.fromMillis(Date.now())}static fromDate(e){return Sa.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Ea);return new Sa(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Bo(jo.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Bo(jo.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Ta)throw new Bo(jo.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Bo(jo.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ea}_compareTo(e){return this.seconds===e.seconds?ea(this.nanoseconds,e.nanoseconds):ea(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Sa._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ba(e,Sa._jsonSchema))return new Sa(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Ta;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Sa._jsonSchemaVersion="firestore/timestamp/1.0",Sa._jsonSchema={type:_a("string",Sa._jsonSchemaVersion),seconds:_a("number"),nanoseconds:_a("number")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Aa{static fromTimestamp(e){return new Aa(e)}static min(){return new Aa(new Sa(0,0))}static max(){return new Aa(new Sa(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ca=-1;class ka{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}function Na(e){return e.fields.find(e=>2===e.kind)}function Da(e){return e.fields.filter(e=>2!==e.kind)}function Ra(e,t){let n=ea(e.collectionGroup,t.collectionGroup);if(0!==n)return n;for(let r=0;r<Math.min(e.fields.length,t.fields.length);++r)if(n=Oa(e.fields[r],t.fields[r]),0!==n)return n;return ea(e.fields.length,t.fields.length)}ka.UNKNOWN_ID=-1;class Pa{constructor(e,t){this.fieldPath=e,this.kind=t}}function Oa(e,t){const n=ha.comparator(e.fieldPath,t.fieldPath);return 0!==n?n:ea(e.kind,t.kind)}class xa{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new xa(0,Fa.min())}}function La(e,t){const n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,i=Aa.fromTimestamp(1e9===r?new Sa(n+1,0):new Sa(n,r));return new Fa(i,da.empty(),t)}function Ma(e){return new Fa(e.readTime,e.key,Ca)}class Fa{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Fa(Aa.min(),da.empty(),Ca)}static max(){return new Fa(Aa.max(),da.empty(),Ca)}}function Va(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:(n=da.comparator(e.documentKey,t.documentKey),0!==n?n:ea(e.largestBatchId,t.largestBatchId)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}const Ua="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class qa{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ja(e){if(e.code!==jo.FAILED_PRECONDITION||e.message!==Ua)throw e;Oo("LocalStore","Unexpectedly lost primary lease")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ba{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Fo(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new Ba((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof Ba?t:Ba.resolve(t)}catch(t){return Ba.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):Ba.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):Ba.reject(t)}static resolve(e){return new Ba((t,n)=>{t(e)})}static reject(e){return new Ba((t,n)=>{n(e)})}static waitFor(e){return new Ba((t,n)=>{let r=0,i=0,s=!1;e.forEach(e=>{++r,e.next(()=>{++i,s&&i===r&&t()},e=>n(e))}),s=!0,i===r&&t()})}static or(e){let t=Ba.resolve(!1);for(const n of e)t=t.next(e=>e?Ba.resolve(e):n());return t}static forEach(e,t){const n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new Ba((n,r)=>{const i=e.length,s=new Array(i);let o=0;for(let a=0;a<i;a++){const c=a;t(e[c]).next(e=>{s[c]=e,++o,o===i&&n(s)},e=>r(e))}})}static doWhile(e,t){return new Ba((n,r)=>{const i=()=>{!0===e()?t().next(()=>{i()},r):n()};i()})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const za="SimpleDb";class $a{static open(e,t,n,r){try{return new $a(t,e.transaction(r,n))}catch(i){throw new Wa(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new zo,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Wa(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{const n=Za(t.target.error);this.S.reject(new Wa(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(Oo(za,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){const t=this.transaction.objectStore(e);return new Ja(t)}}class Ka{static delete(e){return Oo(za,"Removing database:",e),Ya(o().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!b())return!1;if(Ka.F())return!0;const e=v(),t=Ka.M(e),n=0<t&&t<10,r=Ga(e),i=0<r&&r<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){var e;return"undefined"!=typeof process&&"YES"===(null==(e=process.__PRIVATE_env)?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)}static O(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,12.2===Ka.M(v())&&xo("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(Oo(za,"Opening database:",this.name),this.db=await new Promise((t,n)=>{const r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{const n=e.target.result;t(n)},r.onblocked=()=>{n(new Wa(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=t=>{const r=t.target.error;"VersionError"===r.name?n(new Bo(jo.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new Bo(jo.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new Wa(e,r))},r.onupgradeneeded=e=>{Oo(za,'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);const t=e.target.result;this.N.k(t,r.transaction,e.oldVersion,this.version).next(()=>{Oo(za,"Database upgrade to version "+this.version+" complete")})}})),this.K&&(this.db.onversionchange=e=>this.K(e)),this.db}q(e){this.K=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,r){const i="readonly"===t;let s=0;for(;;){++s;try{this.db=await this.L(e);const t=$a.open(this.db,e,i?"readonly":"readwrite",n),s=r(t).next(e=>(t.C(),e)).catch(e=>(t.abort(e),Ba.reject(e))).toPromise();return s.catch(()=>{}),await t.D,s}catch(o){const e=o,t="FirebaseError"!==e.name&&s<3;if(Oo(za,"Transaction failed with error:",e.message,"Retrying:",t),this.close(),!t)return Promise.reject(e)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Ga(e){const t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}class Ha{constructor(e){this.U=e,this.$=!1,this.W=null}get isDone(){return this.$}get G(){return this.W}set cursor(e){this.U=e}done(){this.$=!0}j(e){this.W=e}delete(){return Ya(this.U.delete())}}class Wa extends Bo{constructor(e,t){super(jo.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Qa(e){return"IndexedDbTransactionError"===e.name}class Ja{constructor(e){this.store=e}put(e,t){let n;return void 0!==t?(Oo(za,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(Oo(za,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Ya(n)}add(e){return Oo(za,"ADD",this.store.name,e,e),Ya(this.store.add(e))}get(e){return Ya(this.store.get(e)).next(t=>(void 0===t&&(t=null),Oo(za,"GET",this.store.name,e,t),t))}delete(e){return Oo(za,"DELETE",this.store.name,e),Ya(this.store.delete(e))}count(){return Oo(za,"COUNT",this.store.name),Ya(this.store.count())}H(e,t){const n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){const e=r.getAll(n.range);return new Ba((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}})}{const e=this.cursor(n),t=[];return this.J(e,(e,n)=>{t.push(n)}).next(()=>t)}}Z(e,t){const n=this.store.getAll(e,null===t?void 0:t);return new Ba((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}})}X(e,t){Oo(za,"DELETE ALL",this.store.name);const n=this.options(e,t);n.Y=!1;const r=this.cursor(n);return this.J(r,(e,t,n)=>n.delete())}ee(e,t){let n;t?n=e:(n={},t=e);const r=this.cursor(n);return this.J(r,t)}te(e){const t=this.cursor({});return new Ba((n,r)=>{t.onerror=e=>{const t=Za(e.target.error);r(t)},t.onsuccess=t=>{const r=t.target.result;r?e(r.primaryKey,r.value).next(e=>{e?r.continue():n()}):n()}})}J(e,t){const n=[];return new Ba((r,i)=>{e.onerror=e=>{i(e.target.error)},e.onsuccess=e=>{const i=e.target.result;if(!i)return void r();const s=new Ha(i),o=t(i.primaryKey,i.value,s);if(o instanceof Ba){const e=o.catch(e=>(s.done(),Ba.reject(e)));n.push(e)}s.isDone?r():null===s.G?i.continue():i.continue(s.G)}}).next(()=>Ba.waitFor(n))}options(e,t){let n;return void 0!==e&&("string"==typeof e?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.Y?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Ya(e){return new Ba((t,n)=>{e.onsuccess=e=>{const n=e.target.result;t(n)},e.onerror=e=>{const t=Za(e.target.error);n(t)}})}let Xa=!1;function Za(e){const t=Ka.M(v());if(t>=12.2&&t<13){const t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){const e=new Bo("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Xa||(Xa=!0,setTimeout(()=>{throw e},0)),e}}return e}const ec="IndexBackfiller";class tc{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}re(e){Oo(ec,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{const e=await this.ne.ie();Oo(ec,`Documents written: ${e}`)}catch(e){Qa(e)?Oo(ec,"Ignoring IndexedDB error during index backfill: ",e):await ja(e)}await this.re(6e4)})}}class nc{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.se(t,e))}se(e,t){const n=new Set;let r=t,i=!0;return Ba.doWhile(()=>!0===i&&r>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t=>{if(null!==t&&!n.has(t))return Oo(ec,`Processing collection: ${t}`),this.oe(e,t,r).next(e=>{r-=e,n.add(t)});i=!1})).next(()=>t-r)}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next(n=>{const i=n.changes;return this.localStore.indexManager.updateIndexEntries(e,i).next(()=>this._e(r,n)).next(n=>(Oo(ec,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n))).next(()=>i.size)}))}_e(e,t){let n=e;return t.changes.forEach((e,t)=>{const r=Ma(t);Va(r,n)>0&&(n=r)}),new Fa(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ae(e),this.ue=e=>t.writeSequenceNumber(e))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}rc.ce=-1;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ic=-1;function sc(e){return null==e}function oc(e){return 0===e&&1/e==-1/0}function ac(e){return"number"==typeof e&&Number.isInteger(e)&&!oc(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cc="";function uc(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t=hc(t)),t=lc(e.get(n),t);return hc(t)}function lc(e,t){let n=t;const r=e.length;for(let i=0;i<r;i++){const t=e.charAt(i);switch(t){case"\0":n+="";break;case cc:n+="";break;default:n+=t}}return n}function hc(e){return e+cc+""}function dc(e){const t=e.length;if(Uo(t>=2,64408,{path:e}),2===t)return Uo(e.charAt(0)===cc&&""===e.charAt(1),56145,{path:e}),ua.emptyPath();const n=t-2,r=[];let i="";for(let s=0;s<t;){const t=e.indexOf(cc,s);switch((t<0||t>n)&&Fo(50515,{path:e}),e.charAt(t+1)){case"":const n=e.substring(s,t);let o;0===i.length?o=n:(i+=n,o=i,i=""),r.push(o);break;case"":i+=e.substring(s,t),i+="\0";break;case"":i+=e.substring(s,t+1);break;default:Fo(61167,{path:e})}s=t+2}return new ua(r)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fc="remoteDocuments",pc="owner",mc="owner",gc="mutationQueues",yc="mutations",vc="batchId",wc="userMutationsIndex",Ic=["userId","batchId"];
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _c(e,t){return[e,uc(t)]}function bc(e,t,n){return[e,uc(t),n]}const Tc={},Ec="documentMutations",Sc="remoteDocumentsV14",Ac=["prefixPath","collectionGroup","readTime","documentId"],Cc="documentKeyIndex",kc=["prefixPath","collectionGroup","documentId"],Nc="collectionGroupIndex",Dc=["collectionGroup","readTime","prefixPath","documentId"],Rc="remoteDocumentGlobal",Pc="remoteDocumentGlobalKey",Oc="targets",xc="queryTargetsIndex",Lc=["canonicalId","targetId"],Mc="targetDocuments",Fc=["targetId","path"],Vc="documentTargetsIndex",Uc=["path","targetId"],qc="targetGlobalKey",jc="targetGlobal",Bc="collectionParents",zc=["collectionId","parent"],$c="clientMetadata",Kc="bundles",Gc="namedQueries",Hc="indexConfiguration",Wc="collectionGroupIndex",Qc="indexState",Jc=["indexId","uid"],Yc="sequenceNumberIndex",Xc=["uid","sequenceNumber"],Zc="indexEntries",eu=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],tu="documentKeyIndex",nu=["indexId","uid","orderedDocumentKey"],ru="documentOverlays",iu=["userId","collectionPath","documentId"],su="collectionPathOverlayIndex",ou=["userId","collectionPath","largestBatchId"],au="collectionGroupOverlayIndex",cu=["userId","collectionGroup","largestBatchId"],uu="globals",lu=[gc,yc,Ec,fc,Oc,pc,jc,Mc,$c,Rc,Bc,Kc,Gc],hu=[...lu,ru],du=[gc,yc,Ec,Sc,Oc,pc,jc,Mc,$c,Rc,Bc,Kc,Gc,ru],fu=du,pu=[...fu,Hc,Qc,Zc],mu=pu,gu=[...pu,uu],yu=gu;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vu extends qa{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function wu(e,t){const n=qo(e);return Ka.O(n.le,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iu(e){let t=0;for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function _u(e,t){for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function bu(e,t){const n=[];for(const r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.push(t(e[r],r,e));return n}function Tu(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eu{constructor(e,t){this.comparator=e,this.root=t||Au.EMPTY}insert(e,t){return new Eu(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Au.BLACK,null,null))}remove(e){return new Eu(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Au.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Su(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Su(this.root,e,this.comparator,!1)}getReverseIterator(){return new Su(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Su(this.root,e,this.comparator,!0)}}class Su{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Au{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:Au.RED,this.left=null!=r?r:Au.EMPTY,this.right=null!=i?i:Au.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new Au(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const i=n(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Au.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return Au.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Au.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Au.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Fo(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Fo(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw Fo(27949);return e+(this.isRed()?0:1)}}Au.EMPTY=null,Au.RED=!0,Au.BLACK=!1,Au.EMPTY=new class{constructor(){this.size=0}get key(){throw Fo(57766)}get value(){throw Fo(16141)}get color(){throw Fo(16727)}get left(){throw Fo(29726)}get right(){throw Fo(36894)}copy(e,t,n,r,i){return this}insert(e,t,n){return new Au(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Cu{constructor(e){this.comparator=e,this.data=new Eu(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ku(this.data.getIterator())}getIteratorFrom(e){return new ku(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof Cu))return!1;if(this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Cu(this.comparator);return t.data=e,t}}class ku{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Nu(e){return e.hasNext()?e.getNext():void 0}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Du{constructor(e){this.fields=e,e.sort(ha.comparator)}static empty(){return new Du([])}unionWith(e){let t=new Cu(ha.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Du(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return sa(this.fields,e.fields,(e,t)=>e.isEqual(t))}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ru extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pu{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(e){try{return atob(e)}catch(t){throw"undefined"!=typeof DOMException&&t instanceof DOMException?new Ru("Invalid base64 string: "+t):t}}(e);return new Pu(t)}static fromUint8Array(e){const t=function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e);return new Pu(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ea(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Pu.EMPTY_BYTE_STRING=new Pu("");const Ou=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function xu(e){if(Uo(!!e,39018),"string"==typeof e){let t=0;const n=Ou.exec(e);if(Uo(!!n,46558,{timestamp:e}),n[1]){let e=n[1];e=(e+"000000000").substr(0,9),t=Number(e)}const r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:Lu(e.seconds),nanos:Lu(e.nanos)}}function Lu(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function Mu(e){return"string"==typeof e?Pu.fromBase64String(e):Pu.fromUint8Array(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fu="server_timestamp",Vu="__type__",Uu="__previous_value__",qu="__local_write_time__";function ju(e){var t,n;return(null==(n=((null==(t=null==e?void 0:e.mapValue)?void 0:t.fields)||{})[Vu])?void 0:n.stringValue)===Fu}function Bu(e){const t=e.mapValue.fields[Uu];return ju(t)?Bu(t):t}function zu(e){const t=xu(e.mapValue.fields[qu].timestampValue);return new Sa(t.seconds,t.nanos)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $u{constructor(e,t,n,r,i,s,o,a,c,u,l){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=c,this.isUsingEmulator=u,this.apiKey=l}}const Ku="(default)";class Gu{constructor(e,t){this.projectId=e,this.database=t||Ku}static empty(){return new Gu("","")}get isDefaultDatabase(){return this.database===Ku}isEqual(e){return e instanceof Gu&&e.projectId===this.projectId&&e.database===this.database}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Hu="__type__",Wu="__max__",Qu={mapValue:{fields:{__type__:{stringValue:Wu}}}},Ju="__vector__",Yu="value",Xu={nullValue:"NULL_VALUE"};function Zu(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?ju(e)?4:gl(e)?9007199254740991:pl(e)?10:11:Fo(28295,{value:e})}function el(e,t){if(e===t)return!0;const n=Zu(e);if(n!==Zu(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return zu(e).isEqual(zu(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;const n=xu(e.timestampValue),r=xu(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return r=t,Mu(e.bytesValue).isEqual(Mu(r.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return function(e,t){return Lu(e.geoPointValue.latitude)===Lu(t.geoPointValue.latitude)&&Lu(e.geoPointValue.longitude)===Lu(t.geoPointValue.longitude)}(e,t);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return Lu(e.integerValue)===Lu(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){const n=Lu(e.doubleValue),r=Lu(t.doubleValue);return n===r?oc(n)===oc(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return sa(e.arrayValue.values||[],t.arrayValue.values||[],el);case 10:case 11:return function(e,t){const n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(Iu(n)!==Iu(r))return!1;for(const i in n)if(n.hasOwnProperty(i)&&(void 0===r[i]||!el(n[i],r[i])))return!1;return!0}(e,t);default:return Fo(52216,{left:e})}var r}function tl(e,t){return void 0!==(e.values||[]).find(e=>el(e,t))}function nl(e,t){if(e===t)return 0;const n=Zu(e),r=Zu(t);if(n!==r)return ea(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return ea(e.booleanValue,t.booleanValue);case 2:return function(e,t){const n=Lu(e.integerValue||e.doubleValue),r=Lu(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return rl(e.timestampValue,t.timestampValue);case 4:return rl(zu(e),zu(t));case 5:return ta(e.stringValue,t.stringValue);case 6:return function(e,t){const n=Mu(e),r=Mu(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){const n=e.split("/"),r=t.split("/");for(let i=0;i<n.length&&i<r.length;i++){const e=ea(n[i],r[i]);if(0!==e)return e}return ea(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){const n=ea(Lu(e.latitude),Lu(t.latitude));return 0!==n?n:ea(Lu(e.longitude),Lu(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return il(e.arrayValue,t.arrayValue);case 10:return function(e,t){var n,r,i,s;const o=e.fields||{},a=t.fields||{},c=null==(n=o[Yu])?void 0:n.arrayValue,u=null==(r=a[Yu])?void 0:r.arrayValue,l=ea((null==(i=null==c?void 0:c.values)?void 0:i.length)||0,(null==(s=null==u?void 0:u.values)?void 0:s.length)||0);return 0!==l?l:il(c,u)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===Qu.mapValue&&t===Qu.mapValue)return 0;if(e===Qu.mapValue)return 1;if(t===Qu.mapValue)return-1;const n=e.fields||{},r=Object.keys(n),i=t.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let o=0;o<r.length&&o<s.length;++o){const e=ta(r[o],s[o]);if(0!==e)return e;const t=nl(n[r[o]],i[s[o]]);if(0!==t)return t}return ea(r.length,s.length)}(e.mapValue,t.mapValue);default:throw Fo(23264,{he:n})}}function rl(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return ea(e,t);const n=xu(e),r=xu(t),i=ea(n.seconds,r.seconds);return 0!==i?i:ea(n.nanos,r.nanos)}function il(e,t){const n=e.values||[],r=t.values||[];for(let i=0;i<n.length&&i<r.length;++i){const e=nl(n[i],r[i]);if(e)return e}return ea(n.length,r.length)}function sl(e){return ol(e)}function ol(e){return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){const t=xu(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?Mu(e.bytesValue).toBase64():"referenceValue"in e?function(e){return da.fromName(e).toString()}(e.referenceValue):"geoPointValue"in e?function(e){return`geo(${e.latitude},${e.longitude})`}(e.geoPointValue):"arrayValue"in e?function(e){let t="[",n=!0;for(const r of e.values||[])n?n=!1:t+=",",t+=ol(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){const t=Object.keys(e.fields||{}).sort();let n="{",r=!0;for(const i of t)r?r=!1:n+=",",n+=`${i}:${ol(e.fields[i])}`;return n+"}"}(e.mapValue):Fo(61005,{value:e})}function al(e){switch(Zu(e)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=Bu(e);return t?16+al(t):16;case 5:return 2*e.stringValue.length;case 6:return Mu(e.bytesValue).approximateByteSize();case 7:return e.referenceValue.length;case 9:return(e.arrayValue.values||[]).reduce((e,t)=>e+al(t),0);case 10:case 11:return function(e){let t=0;return _u(e.fields,(e,n)=>{t+=e.length+al(n)}),t}(e.mapValue);default:throw Fo(13486,{value:e})}}function cl(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function ul(e){return!!e&&"integerValue"in e}function ll(e){return!!e&&"arrayValue"in e}function hl(e){return!!e&&"nullValue"in e}function dl(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function fl(e){return!!e&&"mapValue"in e}function pl(e){var t,n;return(null==(n=((null==(t=null==e?void 0:e.mapValue)?void 0:t.fields)||{})[Hu])?void 0:n.stringValue)===Ju}function ml(e){if(e.geoPointValue)return{geoPointValue:{...e.geoPointValue}};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:{...e.timestampValue}};if(e.mapValue){const t={mapValue:{fields:{}}};return _u(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=ml(n)),t}if(e.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=ml(e.arrayValue.values[n]);return t}return{...e}}function gl(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===Wu}const yl={mapValue:{fields:{[Hu]:{stringValue:Ju},[Yu]:{arrayValue:{}}}}};function vl(e){return"nullValue"in e?Xu:"booleanValue"in e?{booleanValue:!1}:"integerValue"in e||"doubleValue"in e?{doubleValue:NaN}:"timestampValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in e?{stringValue:""}:"bytesValue"in e?{bytesValue:""}:"referenceValue"in e?cl(Gu.empty(),da.empty()):"geoPointValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in e?{arrayValue:{}}:"mapValue"in e?pl(e)?yl:{mapValue:{}}:Fo(35942,{value:e})}function wl(e){return"nullValue"in e?{booleanValue:!1}:"booleanValue"in e?{doubleValue:NaN}:"integerValue"in e||"doubleValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in e?{stringValue:""}:"stringValue"in e?{bytesValue:""}:"bytesValue"in e?cl(Gu.empty(),da.empty()):"referenceValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in e?{arrayValue:{}}:"arrayValue"in e?yl:"mapValue"in e?pl(e)?{mapValue:{}}:Qu:Fo(61959,{value:e})}function Il(e,t){const n=nl(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function _l(e,t){const n=nl(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bl{constructor(e){this.value=e}static empty(){return new bl({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!fl(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ml(t)}setAll(e){let t=ha.emptyPath(),n={},r=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){const e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=ml(e):r.push(i.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){const t=this.field(e.popLast());fl(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return el(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];fl(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){_u(t,(t,n)=>e[t]=n);for(const r of n)delete e[r]}clone(){return new bl(ml(this.value))}}function Tl(e){const t=[];return _u(e.fields,(e,n)=>{const r=new ha([e]);if(fl(n)){const e=Tl(n.mapValue).fields;if(0===e.length)t.push(r);else for(const n of e)t.push(r.child(n))}else t.push(r)}),new Du(t)
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class El{constructor(e,t,n,r,i,s,o){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=o}static newInvalidDocument(e){return new El(e,0,Aa.min(),Aa.min(),Aa.min(),bl.empty(),0)}static newFoundDocument(e,t,n,r){return new El(e,1,t,Aa.min(),n,r,0)}static newNoDocument(e,t){return new El(e,2,t,Aa.min(),Aa.min(),bl.empty(),0)}static newUnknownDocument(e,t){return new El(e,3,t,Aa.min(),Aa.min(),bl.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Aa.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=bl.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=bl.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Aa.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof El&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new El(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sl{constructor(e,t){this.position=e,this.inclusive=t}}function Al(e,t,n){let r=0;for(let i=0;i<e.position.length;i++){const s=t[i],o=e.position[i];if(r=s.field.isKeyField()?da.comparator(da.fromName(o.referenceValue),n.key):nl(o,n.data.field(s.field)),"desc"===s.dir&&(r*=-1),0!==r)break}return r}function Cl(e,t){if(null===e)return null===t;if(null===t)return!1;if(e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!el(e.position[n],t.position[n]))return!1;return!0}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kl{constructor(e,t="asc"){this.field=e,this.dir=t}}function Nl(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dl{}class Rl extends Dl{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new jl(e,t,n):"array-contains"===t?new Kl(e,n):"in"===t?new Gl(e,n):"not-in"===t?new Hl(e,n):"array-contains-any"===t?new Wl(e,n):new Rl(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new Bl(e,n):new zl(e,n)}matches(e){const t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(nl(t,this.value)):null!==t&&Zu(this.value)===Zu(t)&&this.matchesComparison(nl(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return Fo(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Pl extends Dl{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new Pl(e,t)}matches(e){return Ol(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.Pe||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Ol(e){return"and"===e.op}function xl(e){return"or"===e.op}function Ll(e){return Ml(e)&&Ol(e)}function Ml(e){for(const t of e.filters)if(t instanceof Pl)return!1;return!0}function Fl(e){if(e instanceof Rl)return e.field.canonicalString()+e.op.toString()+sl(e.value);if(Ll(e))return e.filters.map(e=>Fl(e)).join(",");{const t=e.filters.map(e=>Fl(e)).join(",");return`${e.op}(${t})`}}function Vl(e,t){return e instanceof Rl?(n=e,(r=t)instanceof Rl&&n.op===r.op&&n.field.isEqual(r.field)&&el(n.value,r.value)):e instanceof Pl?function(e,t){return t instanceof Pl&&e.op===t.op&&e.filters.length===t.filters.length&&e.filters.reduce((e,n,r)=>e&&Vl(n,t.filters[r]),!0)}(e,t):void Fo(19439);var n,r}function Ul(e,t){const n=e.filters.concat(t);return Pl.create(n,e.op)}function ql(e){return e instanceof Rl?`${(t=e).field.canonicalString()} ${t.op} ${sl(t.value)}`:e instanceof Pl?function(e){return e.op.toString()+" {"+e.getFilters().map(ql).join(" ,")+"}"}(e):"Filter";var t}class jl extends Rl{constructor(e,t,n){super(e,t,n),this.key=da.fromName(n.referenceValue)}matches(e){const t=da.comparator(e.key,this.key);return this.matchesComparison(t)}}class Bl extends Rl{constructor(e,t){super(e,"in",t),this.keys=$l("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class zl extends Rl{constructor(e,t){super(e,"not-in",t),this.keys=$l("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function $l(e,t){var n;return((null==(n=t.arrayValue)?void 0:n.values)||[]).map(e=>da.fromName(e.referenceValue))}class Kl extends Rl{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ll(t)&&tl(t.arrayValue,this.value)}}class Gl extends Rl{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return null!==t&&tl(this.value.arrayValue,t)}}class Hl extends Rl{constructor(e,t){super(e,"not-in",t)}matches(e){if(tl(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!tl(this.value.arrayValue,t)}}class Wl extends Rl{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ll(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>tl(this.value.arrayValue,e))}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ql{constructor(e,t=null,n=[],r=[],i=null,s=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=o,this.Te=null}}function Jl(e,t=null,n=[],r=[],i=null,s=null,o=null){return new Ql(e,t,n,r,i,s,o)}function Yl(e){const t=qo(e);if(null===t.Te){let e=t.path.canonicalString();null!==t.collectionGroup&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(e=>Fl(e)).join(","),e+="|ob:",e+=t.orderBy.map(e=>{return(t=e).field.canonicalString()+t.dir;var t}).join(","),sc(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(e=>sl(e)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(e=>sl(e)).join(",")),t.Te=e}return t.Te}function Xl(e,t){if(e.limit!==t.limit)return!1;if(e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!Nl(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!Vl(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!Cl(e.startAt,t.startAt)&&Cl(e.endAt,t.endAt)}function Zl(e){return da.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function eh(e,t){return e.filters.filter(e=>e instanceof Rl&&e.field.isEqual(t))}function th(e,t,n){let r=Xu,i=!0;for(const s of eh(e,t)){let e=Xu,t=!0;switch(s.op){case"<":case"<=":e=vl(s.value);break;case"==":case"in":case">=":e=s.value;break;case">":e=s.value,t=!1;break;case"!=":case"not-in":e=Xu}Il({value:r,inclusive:i},{value:e,inclusive:t})<0&&(r=e,i=t)}if(null!==n)for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){const e=n.position[s];Il({value:r,inclusive:i},{value:e,inclusive:n.inclusive})<0&&(r=e,i=n.inclusive);break}return{value:r,inclusive:i}}function nh(e,t,n){let r=Qu,i=!0;for(const s of eh(e,t)){let e=Qu,t=!0;switch(s.op){case">=":case">":e=wl(s.value),t=!1;break;case"==":case"in":case"<=":e=s.value;break;case"<":e=s.value,t=!1;break;case"!=":case"not-in":e=Qu}_l({value:r,inclusive:i},{value:e,inclusive:t})>0&&(r=e,i=t)}if(null!==n)for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){const e=n.position[s];_l({value:r,inclusive:i},{value:e,inclusive:n.inclusive})>0&&(r=e,i=n.inclusive);break}return{value:r,inclusive:i}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(e,t=null,n=[],r=[],i=null,s="F",o=null,a=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=o,this.endAt=a,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function ih(e,t,n,r,i,s,o,a){return new rh(e,t,n,r,i,s,o,a)}function sh(e){return new rh(e)}function oh(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function ah(e){return null!==e.collectionGroup}function ch(e){const t=qo(e);if(null===t.Ie){t.Ie=[];const e=new Set;for(const r of t.explicitOrderBy)t.Ie.push(r),e.add(r.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(e){let t=new Cu(ha.comparator);return e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t})(t).forEach(r=>{e.has(r.canonicalString())||r.isKeyField()||t.Ie.push(new kl(r,n))}),e.has(ha.keyField().canonicalString())||t.Ie.push(new kl(ha.keyField(),n))}return t.Ie}function uh(e){const t=qo(e);return t.Ee||(t.Ee=hh(t,ch(e))),t.Ee}function lh(e){const t=qo(e);return t.Re||(t.Re=hh(t,e.explicitOrderBy)),t.Re}function hh(e,t){if("F"===e.limitType)return Jl(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{const t="desc"===e.dir?"asc":"desc";return new kl(e.field,t)});const n=e.endAt?new Sl(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new Sl(e.startAt.position,e.startAt.inclusive):null;return Jl(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}function dh(e,t){const n=e.filters.concat([t]);return new rh(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function fh(e,t,n){return new rh(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function ph(e,t){return Xl(uh(e),uh(t))&&e.limitType===t.limitType}function mh(e){return`${Yl(uh(e))}|lt:${e.limitType}`}function gh(e){return`Query(target=${function(e){let t=e.path.canonicalString();return null!==e.collectionGroup&&(t+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(t+=`, filters: [${e.filters.map(e=>ql(e)).join(", ")}]`),sc(e.limit)||(t+=", limit: "+e.limit),e.orderBy.length>0&&(t+=`, orderBy: [${e.orderBy.map(e=>{return`${(t=e).field.canonicalString()} (${t.dir})`;var t}).join(", ")}]`),e.startAt&&(t+=", startAt: ",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(e=>sl(e)).join(",")),e.endAt&&(t+=", endAt: ",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(e=>sl(e)).join(",")),`Target(${t})`}(uh(e))}; limitType=${e.limitType})`}function yh(e,t){return t.isFoundDocument()&&function(e,t){const n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):da.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(const n of ch(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(const n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(r=t,!((n=e).startAt&&!function(e,t,n){const r=Al(e,t,n);return e.inclusive?r<=0:r<0}(n.startAt,ch(n),r)||n.endAt&&!function(e,t,n){const r=Al(e,t,n);return e.inclusive?r>=0:r>0}(n.endAt,ch(n),r)));var n,r}function vh(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function wh(e){return(t,n)=>{let r=!1;for(const i of ch(e)){const e=Ih(i,t,n);if(0!==e)return e;r=r||i.field.isKeyField()}return 0}}function Ih(e,t,n){const r=e.field.isKeyField()?da.comparator(t.key,n.key):function(e,t,n){const r=t.data.field(e),i=n.data.field(e);return null!==r&&null!==i?nl(r,i):Fo(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return-1*r;default:return Fo(19790,{direction:e.dir})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _h{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n)for(const[r,i]of n)if(this.equalsFn(r,e))return i}has(e){return void 0!==this.get(e)}set(e,t){const n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){_u(this.inner,(t,n)=>{for(const[r,i]of n)e(r,i)})}isEmpty(){return Tu(this.inner)}size(){return this.innerSize}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bh=new Eu(da.comparator);function Th(){return bh}const Eh=new Eu(da.comparator);function Sh(...e){let t=Eh;for(const n of e)t=t.insert(n.key,n);return t}function Ah(e){let t=Eh;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function Ch(){return Nh()}function kh(){return Nh()}function Nh(){return new _h(e=>e.toString(),(e,t)=>e.isEqual(t))}const Dh=new Eu(da.comparator),Rh=new Cu(da.comparator);function Ph(...e){let t=Rh;for(const n of e)t=t.add(n);return t}const Oh=new Cu(ea);function xh(){return Oh}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lh(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:oc(t)?"-0":t}}function Mh(e){return{integerValue:""+e}}function Fh(e,t){return ac(t)?Mh(t):Lh(e,t)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vh{constructor(){this._=void 0}}function Uh(e,t,n){return e instanceof Bh?function(e,t){const n={fields:{[Vu]:{stringValue:Fu},[qu]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&ju(t)&&(t=Bu(t)),t&&(n.fields[Uu]=t),{mapValue:n}}(n,t):e instanceof zh?$h(e,t):e instanceof Kh?Gh(e,t):function(e,t){const n=jh(e,t),r=Wh(n)+Wh(e.Ae);return ul(n)&&ul(e.Ae)?Mh(r):Lh(e.serializer,r)}(e,t)}function qh(e,t,n){return e instanceof zh?$h(e,t):e instanceof Kh?Gh(e,t):n}function jh(e,t){return e instanceof Hh?ul(n=t)||(r=n)&&"doubleValue"in r?t:{integerValue:0}:null;var n,r}class Bh extends Vh{}class zh extends Vh{constructor(e){super(),this.elements=e}}function $h(e,t){const n=Qh(t);for(const r of e.elements)n.some(e=>el(e,r))||n.push(r);return{arrayValue:{values:n}}}class Kh extends Vh{constructor(e){super(),this.elements=e}}function Gh(e,t){let n=Qh(t);for(const r of e.elements)n=n.filter(e=>!el(e,r));return{arrayValue:{values:n}}}class Hh extends Vh{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function Wh(e){return Lu(e.integerValue||e.doubleValue)}function Qh(e){return ll(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jh{constructor(e,t){this.field=e,this.transform=t}}class Yh{constructor(e,t){this.version=e,this.transformResults=t}}class Xh{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Xh}static exists(e){return new Xh(void 0,e)}static updateTime(e){return new Xh(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Zh(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class ed{}function td(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new hd(e.key,Xh.none()):new od(e.key,e.data,Xh.none());{const n=e.data,r=bl.empty();let i=new Cu(ha.comparator);for(let e of t.fields)if(!i.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),i=i.add(e)}return new ad(e.key,r,new Du(i.toArray()),Xh.none())}}function nd(e,t,n){var r;e instanceof od?function(e,t,n){const r=e.value.clone(),i=ud(e.fieldTransforms,t,n.transformResults);r.setAll(i),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(e,t,n):e instanceof ad?function(e,t,n){if(!Zh(e.precondition,t))return void t.convertToUnknownDocument(n.version);const r=ud(e.fieldTransforms,t,n.transformResults),i=t.data;i.setAll(cd(e)),i.setAll(r),t.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(e,t,n):(r=n,t.convertToNoDocument(r.version).setHasCommittedMutations())}function rd(e,t,n,r){return e instanceof od?function(e,t,n,r){if(!Zh(e.precondition,t))return n;const i=e.value.clone(),s=ld(e.fieldTransforms,r,t);return i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,n,r):e instanceof ad?function(e,t,n,r){if(!Zh(e.precondition,t))return n;const i=ld(e.fieldTransforms,r,t),s=t.data;return s.setAll(cd(e)),s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null===n?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):(i=t,s=n,Zh(e.precondition,i)?(i.convertToNoDocument(i.version).setHasLocalMutations(),null):s);var i,s}function id(e,t){let n=null;for(const r of e.fieldTransforms){const e=t.data.field(r.field),i=jh(r.transform,e||null);null!=i&&(null===n&&(n=bl.empty()),n.set(r.field,i))}return n||null}function sd(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||n&&r&&sa(n,r,(e,t)=>function(e,t){return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof zh&&r instanceof zh||n instanceof Kh&&r instanceof Kh?sa(n.elements,r.elements,el):n instanceof Hh&&r instanceof Hh?el(n.Ae,r.Ae):n instanceof Bh&&r instanceof Bh);var n,r}(e,t)))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask)));var n,r}class od extends ed{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class ad extends ed{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function cd(e){const t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=e.data.field(n);t.set(n,r)}}),t}function ud(e,t,n){const r=new Map;Uo(e.length===n.length,32656,{Ve:n.length,de:e.length});for(let i=0;i<n.length;i++){const s=e[i],o=s.transform,a=t.data.field(s.field);r.set(s.field,qh(o,a,n[i]))}return r}function ld(e,t,n){const r=new Map;for(const i of e){const e=i.transform,s=n.data.field(i.field);r.set(i.field,Uh(e,s,t))}return r}class hd extends ed{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class dd extends ed{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const t=this.mutations[r];t.key.isEqual(e.key)&&nd(t,e,n[r])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=rd(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=rd(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=kh();return this.mutations.forEach(r=>{const i=e.get(r.key),s=i.overlayedDocument;let o=this.applyToLocalView(s,i.mutatedFields);o=t.has(r.key)?null:o;const a=td(s,o);null!==a&&n.set(r.key,a),s.isValidDocument()||s.convertToNoDocument(Aa.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),Ph())}isEqual(e){return this.batchId===e.batchId&&sa(this.mutations,e.mutations,(e,t)=>sd(e,t))&&sa(this.baseMutations,e.baseMutations,(e,t)=>sd(e,t))}}class pd{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){Uo(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let r=function(){return Dh}();const i=e.mutations;for(let s=0;s<i.length;s++)r=r.insert(i[s].key,n[s].version);return new pd(e,t,n,r)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gd{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yd{constructor(e,t){this.count=e,this.unchangedNames=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vd,wd;function Id(e){switch(e){case jo.OK:return Fo(64938);case jo.CANCELLED:case jo.UNKNOWN:case jo.DEADLINE_EXCEEDED:case jo.RESOURCE_EXHAUSTED:case jo.INTERNAL:case jo.UNAVAILABLE:case jo.UNAUTHENTICATED:return!1;case jo.INVALID_ARGUMENT:case jo.NOT_FOUND:case jo.ALREADY_EXISTS:case jo.PERMISSION_DENIED:case jo.FAILED_PRECONDITION:case jo.ABORTED:case jo.OUT_OF_RANGE:case jo.UNIMPLEMENTED:case jo.DATA_LOSS:return!0;default:return Fo(15467,{code:e})}}function _d(e){if(void 0===e)return xo("GRPC error has no .code"),jo.UNKNOWN;switch(e){case vd.OK:return jo.OK;case vd.CANCELLED:return jo.CANCELLED;case vd.UNKNOWN:return jo.UNKNOWN;case vd.DEADLINE_EXCEEDED:return jo.DEADLINE_EXCEEDED;case vd.RESOURCE_EXHAUSTED:return jo.RESOURCE_EXHAUSTED;case vd.INTERNAL:return jo.INTERNAL;case vd.UNAVAILABLE:return jo.UNAVAILABLE;case vd.UNAUTHENTICATED:return jo.UNAUTHENTICATED;case vd.INVALID_ARGUMENT:return jo.INVALID_ARGUMENT;case vd.NOT_FOUND:return jo.NOT_FOUND;case vd.ALREADY_EXISTS:return jo.ALREADY_EXISTS;case vd.PERMISSION_DENIED:return jo.PERMISSION_DENIED;case vd.FAILED_PRECONDITION:return jo.FAILED_PRECONDITION;case vd.ABORTED:return jo.ABORTED;case vd.OUT_OF_RANGE:return jo.OUT_OF_RANGE;case vd.UNIMPLEMENTED:return jo.UNIMPLEMENTED;case vd.DATA_LOSS:return jo.DATA_LOSS;default:return Fo(39323,{code:e})}}(wd=vd||(vd={}))[wd.OK=0]="OK",wd[wd.CANCELLED=1]="CANCELLED",wd[wd.UNKNOWN=2]="UNKNOWN",wd[wd.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",wd[wd.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",wd[wd.NOT_FOUND=5]="NOT_FOUND",wd[wd.ALREADY_EXISTS=6]="ALREADY_EXISTS",wd[wd.PERMISSION_DENIED=7]="PERMISSION_DENIED",wd[wd.UNAUTHENTICATED=16]="UNAUTHENTICATED",wd[wd.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",wd[wd.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",wd[wd.ABORTED=10]="ABORTED",wd[wd.OUT_OF_RANGE=11]="OUT_OF_RANGE",wd[wd.UNIMPLEMENTED=12]="UNIMPLEMENTED",wd[wd.INTERNAL=13]="INTERNAL",wd[wd.UNAVAILABLE=14]="UNAVAILABLE",wd[wd.DATA_LOSS=15]="DATA_LOSS";
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let bd=null;
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Td(){return new TextEncoder}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ed=new yo([4294967295,4294967295],0);function Sd(e){const t=Td().encode(e),n=new vo;return n.update(t),new Uint8Array(n.digest())}function Ad(e){const t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),i=t.getUint32(8,!0),s=t.getUint32(12,!0);return[new yo([n,r],0),new yo([i,s],0)]}class Cd{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new kd(`Invalid padding: ${t}`);if(n<0)throw new kd(`Invalid hash count: ${n}`);if(e.length>0&&0===this.hashCount)throw new kd(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new kd(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=yo.fromNumber(this.ge)}ye(e,t,n){let r=e.add(t.multiply(yo.fromNumber(n)));return 1===r.compare(Ed)&&(r=new yo([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.ge)return!1;const t=Sd(e),[n,r]=Ad(t);for(let i=0;i<this.hashCount;i++){const e=this.ye(n,r,i);if(!this.we(e))return!1}return!0}static create(e,t,n){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),s=new Cd(i,r,t);return n.forEach(e=>s.insert(e)),s}insert(e){if(0===this.ge)return;const t=Sd(e),[n,r]=Ad(t);for(let i=0;i<this.hashCount;i++){const e=this.ye(n,r,i);this.be(e)}}be(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class kd extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const r=new Map;return r.set(e,Dd.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new Nd(Aa.min(),r,new Eu(ea),Th(),Ph())}}class Dd{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Dd(n,t,Ph(),Ph(),Ph())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rd{constructor(e,t,n,r){this.Se=e,this.removedTargetIds=t,this.key=n,this.De=r}}class Pd{constructor(e,t){this.targetId=e,this.Ce=t}}class Od{constructor(e,t,n=Pu.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class xd{constructor(){this.ve=0,this.Fe=Fd(),this.Me=Pu.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return 0!==this.ve}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=Ph(),t=Ph(),n=Ph();return this.Fe.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:Fo(38017,{changeType:i})}}),new Dd(this.Me,this.xe,e,t,n)}Ke(){this.Oe=!1,this.Fe=Fd()}qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,Uo(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class Ld{constructor(e){this.Ge=e,this.ze=new Map,this.je=Th(),this.He=Md(),this.Je=Md(),this.Ze=new Eu(ea)}Xe(e){for(const t of e.Se)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.We(),n.Ne||n.Ke(),n.Le(e.resumeToken);break;case 2:n.We(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.Qe(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:Fo(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((e,n)=>{this.rt(n)&&t(n)})}st(e){const t=e.targetId,n=e.Ce.count,r=this.ot(t);if(r){const i=r.target;if(Zl(i))if(0===n){const e=new da(i.path);this.et(t,e,El.newNoDocument(e,Aa.min()))}else Uo(1===n,20013,{expectedCount:n});else{const r=this._t(t);if(r!==n){const n=this.ut(e),i=n?this.ct(n,e,r):1;if(0!==i){this.it(t);const e=2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,e)}null==bd||bd.lt(function(e,t,n,r,i){var s,o,a;const c={localCacheCount:e,existenceFilterCount:t.count,databaseId:n.database,projectId:n.projectId},u=t.unchangedNames;return u&&(c.bloomFilter={applied:0===i,hashCount:(null==u?void 0:u.hashCount)??0,bitmapLength:(null==(o=null==(s=null==u?void 0:u.bits)?void 0:s.bitmap)?void 0:o.length)??0,padding:(null==(a=null==u?void 0:u.bits)?void 0:a.padding)??0,mightContain:e=>(null==r?void 0:r.mightContain(e))??!1}),c}(r,e.Ce,this.Ge.ht(),n,i))}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:i=0}=t;let s,o;try{s=Mu(n).toUint8Array()}catch(a){if(a instanceof Ru)return Lo("Decoding the base64 bloom filter in existence filter failed ("+a.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw a}try{o=new Cd(s,r,i)}catch(a){return Lo(a instanceof kd?"BloomFilter error: ":"Applying bloom filter failed: ",a),null}return 0===o.ge?null:o}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let r=0;return n.forEach(n=>{const i=this.Ge.ht(),s=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;e.mightContain(s)||(this.et(t,n,null),r++)}),r}Tt(e){const t=new Map;this.ze.forEach((n,r)=>{const i=this.ot(r);if(i){if(n.current&&Zl(i.target)){const t=new da(i.target.path);this.It(t).has(r)||this.Et(r,t)||this.et(r,t,El.newNoDocument(t,e))}n.Be&&(t.set(r,n.ke()),n.Ke())}});let n=Ph();this.Je.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{const t=this.ot(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.je.forEach((t,n)=>n.setReadTime(e));const r=new Nd(e,t,this.Ze,this.je,n);return this.je=Th(),this.He=Md(),this.Je=Md(),this.Ze=new Eu(ea),r}Ye(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).qe(t.key,n),this.je=this.je.insert(t.key,t),this.He=this.He.insert(t.key,this.It(t.key).add(e)),this.Je=this.Je.insert(t.key,this.Rt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const r=this.nt(e);this.Et(e,t)?r.qe(t,1):r.Ue(t),this.Je=this.Je.insert(t,this.Rt(t).delete(e)),this.Je=this.Je.insert(t,this.Rt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new xd,this.ze.set(e,t)),t}Rt(e){let t=this.Je.get(e);return t||(t=new Cu(ea),this.Je=this.Je.insert(e,t)),t}It(e){let t=this.He.get(e);return t||(t=new Cu(ea),this.He=this.He.insert(e,t)),t}rt(e){const t=null!==this.ot(e);return t||Oo("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new xd),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Md(){return new Eu(da.comparator)}function Fd(){return new Eu(da.comparator)}const Vd=(()=>({asc:"ASCENDING",desc:"DESCENDING"}))(),Ud=(()=>({"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"}))(),qd=(()=>({and:"AND",or:"OR"}))();class jd{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Bd(e,t){return e.useProto3Json||sc(t)?t:{value:t}}function zd(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function $d(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function Kd(e,t){return zd(e,t.toTimestamp())}function Gd(e){return Uo(!!e,49232),Aa.fromTimestamp(function(e){const t=xu(e);return new Sa(t.seconds,t.nanos)}(e))}function Hd(e,t){return Wd(e,t).canonicalString()}function Wd(e,t){const n=(r=e,new ua(["projects",r.projectId,"databases",r.database])).child("documents");var r;return void 0===t?n:n.child(t)}function Qd(e){const t=ua.fromString(e);return Uo(wf(t),10190,{key:t.toString()}),t}function Jd(e,t){return Hd(e.databaseId,t.path)}function Yd(e,t){const n=Qd(t);if(n.get(1)!==e.databaseId.projectId)throw new Bo(jo.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new Bo(jo.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new da(tf(n))}function Xd(e,t){return Hd(e.databaseId,t)}function Zd(e){const t=Qd(e);return 4===t.length?ua.emptyPath():tf(t)}function ef(e){return new ua(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function tf(e){return Uo(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function nf(e,t,n){return{name:Jd(e,t),fields:n.value.mapValue.fields}}function rf(e,t,n){const r=Yd(e,t.name),i=Gd(t.updateTime),s=t.createTime?Gd(t.createTime):Aa.min(),o=new bl({mapValue:{fields:t.fields}}),a=El.newFoundDocument(r,i,s,o);return n&&a.setHasCommittedMutations(),n?a.setHasCommittedMutations():a}function sf(e,t){let n;if(t instanceof od)n={update:nf(e,t.key,t.value)};else if(t instanceof hd)n={delete:Jd(e,t.key)};else if(t instanceof ad)n={update:nf(e,t.key,t.data),updateMask:vf(t.fieldMask)};else{if(!(t instanceof dd))return Fo(16599,{dt:t.type});n={verify:Jd(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>function(e,t){const n=t.transform;if(n instanceof Bh)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof zh)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof Kh)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof Hh)return{fieldPath:t.field.canonicalString(),increment:n.Ae};throw Fo(20930,{transform:t.transform})}(0,e))),t.precondition.isNone||(n.currentDocument=(r=e,void 0!==(i=t.precondition).updateTime?{updateTime:Kd(r,i.updateTime)}:void 0!==i.exists?{exists:i.exists}:Fo(27497))),n;var r,i}function of(e,t){const n=t.currentDocument?void 0!==(i=t.currentDocument).updateTime?Xh.updateTime(Gd(i.updateTime)):void 0!==i.exists?Xh.exists(i.exists):Xh.none():Xh.none(),r=t.updateTransforms?t.updateTransforms.map(t=>function(e,t){let n=null;if("setToServerValue"in t)Uo("REQUEST_TIME"===t.setToServerValue,16630,{proto:t}),n=new Bh;else if("appendMissingElements"in t){const e=t.appendMissingElements.values||[];n=new zh(e)}else if("removeAllFromArray"in t){const e=t.removeAllFromArray.values||[];n=new Kh(e)}else"increment"in t?n=new Hh(e,t.increment):Fo(16584,{proto:t});const r=ha.fromServerFormat(t.fieldPath);return new Jh(r,n)}(e,t)):[];var i;if(t.update){t.update.name;const i=Yd(e,t.update.name),s=new bl({mapValue:{fields:t.update.fields}});if(t.updateMask){const e=function(e){const t=e.fieldPaths||[];return new Du(t.map(e=>ha.fromServerFormat(e)))}(t.updateMask);return new ad(i,s,e,n,r)}return new od(i,s,n,r)}if(t.delete){const r=Yd(e,t.delete);return new hd(r,n)}if(t.verify){const r=Yd(e,t.verify);return new dd(r,n)}return Fo(1463,{proto:t})}function af(e,t){return{documents:[Xd(e,t.path)]}}function cf(e,t){const n={structuredQuery:{}},r=t.path;let i;null!==t.collectionGroup?(i=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Xd(e,i);const s=function(e){if(0!==e.length)return yf(Pl.create(e,"and"))}(t.filters);s&&(n.structuredQuery.where=s);const o=function(e){if(0!==e.length)return e.map(e=>{return{field:mf((t=e).field),direction:df(t.dir)};var t})}(t.orderBy);o&&(n.structuredQuery.orderBy=o);const a=Bd(e,t.limit);return null!==a&&(n.structuredQuery.limit=a),t.startAt&&(n.structuredQuery.startAt={before:(c=t.startAt).inclusive,values:c.position}),t.endAt&&(n.structuredQuery.endAt=function(e){return{before:!e.inclusive,values:e.position}}(t.endAt)),{ft:n,parent:i};var c}function uf(e,t,n,r){const{ft:i,parent:s}=cf(e,t),o={},a=[];let c=0;return n.forEach(e=>{const t=r?e.alias:"aggregate_"+c++;o[t]=e.alias,"count"===e.aggregateType?a.push({alias:t,count:{}}):"avg"===e.aggregateType?a.push({alias:t,avg:{field:mf(e.fieldPath)}}):"sum"===e.aggregateType&&a.push({alias:t,sum:{field:mf(e.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:a,structuredQuery:i.structuredQuery},parent:i.parent},gt:o,parent:s}}function lf(e){let t=Zd(e.parent);const n=e.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){Uo(1===r,65062);const e=n.from[0];e.allDescendants?i=e.collectionId:t=t.child(e.collectionId)}let s=[];n.where&&(s=function(e){const t=hf(e);return t instanceof Pl&&Ll(t)?t.getFilters():[t]}(n.where));let o=[];n.orderBy&&(o=n.orderBy.map(e=>{return new kl(gf((t=e).field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(t.direction));var t}));let a=null;n.limit&&(a=function(e){let t;return t="object"==typeof e?e.value:e,sc(t)?null:t}(n.limit));let c=null;n.startAt&&(c=function(e){const t=!!e.before,n=e.values||[];return new Sl(n,t)}(n.startAt));let u=null;return n.endAt&&(u=function(e){const t=!e.before,n=e.values||[];return new Sl(n,t)}(n.endAt)),ih(t,i,o,s,a,"F",c,u)}function hf(e){return void 0!==e.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":const t=gf(e.unaryFilter.field);return Rl.create(t,"==",{doubleValue:NaN});case"IS_NULL":const n=gf(e.unaryFilter.field);return Rl.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=gf(e.unaryFilter.field);return Rl.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const i=gf(e.unaryFilter.field);return Rl.create(i,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Fo(61313);default:return Fo(60726)}}(e):void 0!==e.fieldFilter?(t=e,Rl.create(gf(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Fo(58110);default:return Fo(50506)}}(t.fieldFilter.op),t.fieldFilter.value)):void 0!==e.compositeFilter?function(e){return Pl.create(e.compositeFilter.filters.map(e=>hf(e)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return Fo(1026)}}(e.compositeFilter.op))}(e):Fo(30097,{filter:e});var t}function df(e){return Vd[e]}function ff(e){return Ud[e]}function pf(e){return qd[e]}function mf(e){return{fieldPath:e.canonicalString()}}function gf(e){return ha.fromServerFormat(e.fieldPath)}function yf(e){return e instanceof Rl?function(e){if("=="===e.op){if(dl(e.value))return{unaryFilter:{field:mf(e.field),op:"IS_NAN"}};if(hl(e.value))return{unaryFilter:{field:mf(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(dl(e.value))return{unaryFilter:{field:mf(e.field),op:"IS_NOT_NAN"}};if(hl(e.value))return{unaryFilter:{field:mf(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:mf(e.field),op:ff(e.op),value:e.value}}}(e):e instanceof Pl?function(e){const t=e.getFilters().map(e=>yf(e));return 1===t.length?t[0]:{compositeFilter:{op:pf(e.op),filters:t}}}(e):Fo(54877,{filter:e})}function vf(e){const t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function wf(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}function If(e){return!!e&&"function"==typeof e._toProto&&"ProtoValue"===e._protoValueType}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _f{constructor(e,t,n,r,i=Aa.min(),s=Aa.min(),o=Pu.EMPTY_BYTE_STRING,a=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(e){return new _f(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new _f(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new _f(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new _f(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf{constructor(e){this.yt=e}}function Tf(e,t){const n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:Ef(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())r.document={name:Jd(i=e.yt,(s=t).key),fields:s.data.value.mapValue.fields,updateTime:zd(i,s.version.toTimestamp()),createTime:zd(i,s.createTime.toTimestamp())};else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:Sf(t.version)};else{if(!t.isUnknownDocument())return Fo(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:Sf(t.version)}}var i,s;return r}function Ef(e){const t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function Sf(e){const t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function Af(e){const t=new Sa(e.seconds,e.nanoseconds);return Aa.fromTimestamp(t)}function Cf(e,t){const n=(t.baseMutations||[]).map(t=>of(e.yt,t));for(let s=0;s<t.mutations.length-1;++s){const e=t.mutations[s];if(s+1<t.mutations.length&&void 0!==t.mutations[s+1].transform){const n=t.mutations[s+1];e.updateTransforms=n.transform.fieldTransforms,t.mutations.splice(s+1,1),++s}}const r=t.mutations.map(t=>of(e.yt,t)),i=Sa.fromMillis(t.localWriteTimeMs);return new fd(t.batchId,i,n,r)}function kf(e){const t=Af(e.readTime),n=void 0!==e.lastLimboFreeSnapshotVersion?Af(e.lastLimboFreeSnapshotVersion):Aa.min();let r;return r=void 0!==e.query.documents?function(e){const t=e.documents.length;return Uo(1===t,1966,{count:t}),uh(sh(Zd(e.documents[0])))}(e.query):function(e){return uh(lf(e))}(e.query),new _f(r,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,Pu.fromBase64String(e.resumeToken))}function Nf(e,t){const n=Sf(t.snapshotVersion),r=Sf(t.lastLimboFreeSnapshotVersion);let i;i=Zl(t.target)?af(e.yt,t.target):cf(e.yt,t.target).ft;const s=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:Yl(t.target),readTime:n,resumeToken:s,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function Df(e){const t=lf({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?fh(t,t.limit,"L"):t}function Rf(e,t){return new md(t.largestBatchId,of(e.yt,t.overlayMutation))}function Pf(e,t){const n=t.path.lastSegment();return[e,uc(t.path.popLast()),n]}function Of(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:Sf(r.readTime),documentKey:uc(r.documentKey.path),largestBatchId:r.largestBatchId}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xf{getBundleMetadata(e,t){return Lf(e).get(t).next(e=>{if(e)return{id:(t=e).bundleId,createTime:Af(t.createTime),version:t.version};var t})}saveBundleMetadata(e,t){return Lf(e).put({bundleId:(n=t).id,createTime:Sf(Gd(n.createTime)),version:n.version});var n}getNamedQuery(e,t){return Mf(e).get(t).next(e=>{if(e)return{name:(t=e).name,query:Df(t.bundledQuery),readTime:Af(t.readTime)};var t})}saveNamedQuery(e,t){return Mf(e).put({name:(n=t).name,readTime:Sf(Gd(n.readTime)),bundledQuery:n.bundledQuery});var n}}function Lf(e){return wu(e,Kc)}function Mf(e){return wu(e,Gc)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ff{constructor(e,t){this.serializer=e,this.userId=t}static wt(e,t){const n=t.uid||"";return new Ff(e,n)}getOverlay(e,t){return Vf(e).get(Pf(this.userId,t)).next(e=>e?Rf(this.serializer,e):null)}getOverlays(e,t){const n=Ch();return Ba.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){const r=[];return n.forEach((n,i)=>{const s=new md(t,i);r.push(this.bt(e,s))}),Ba.waitFor(r)}removeOverlaysForBatchId(e,t,n){const r=new Set;t.forEach(e=>r.add(uc(e.getCollectionPath())));const i=[];return r.forEach(t=>{const r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);i.push(Vf(e).X(su,r))}),Ba.waitFor(i)}getOverlaysForCollection(e,t,n){const r=Ch(),i=uc(t),s=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Vf(e).H(su,s).next(e=>{for(const t of e){const e=Rf(this.serializer,t);r.set(e.getKey(),e)}return r})}getOverlaysForCollectionGroup(e,t,n,r){const i=Ch();let s;const o=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Vf(e).ee({index:au,range:o},(e,t,n)=>{const o=Rf(this.serializer,t);i.size()<r||o.largestBatchId===s?(i.set(o.getKey(),o),s=o.largestBatchId):n.done()}).next(()=>i)}bt(e,t){return Vf(e).put(function(e,t,n){const[r,i,s]=Pf(t,n.mutation.key);return{userId:t,collectionPath:i,documentId:s,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:sf(e.yt,n.mutation)}}(this.serializer,this.userId,t))}}function Vf(e){return wu(e,ru)}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{St(e){return wu(e,uu)}getSessionToken(e){return this.St(e).get("sessionToken").next(e=>{const t=null==e?void 0:e.value;return t?Pu.fromUint8Array(t):Pu.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.St(e).put({name:"sessionToken",value:t.toUint8Array()})}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qf{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(Lu(e.integerValue));else if("doubleValue"in e){const n=Lu(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),oc(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),"string"==typeof n&&(n=xu(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(Mu(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?gl(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):pl(e)?this.kt(e.mapValue,t):(this.Kt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Nt(t)):Fo(19022,{Ut:e})}Ot(e,t){this.Ft(t,25),this.$t(e,t)}$t(e,t){t.xt(e)}Kt(e,t){const n=e.fields||{};this.Ft(t,55);for(const r of Object.keys(n))this.Ot(r,t),this.Ct(n[r],t)}kt(e,t){var n,r;const i=e.fields||{};this.Ft(t,53);const s=Yu,o=(null==(r=null==(n=i[s].arrayValue)?void 0:n.values)?void 0:r.length)||0;this.Ft(t,15),t.Mt(Lu(o)),this.Ot(s,t),this.Ct(i[s],t)}qt(e,t){const n=e.values||[];this.Ft(t,50);for(const r of n)this.Ct(r,t)}Lt(e,t){this.Ft(t,37),da.fromName(e).path.forEach(e=>{this.Ft(t,60),this.$t(e,t)})}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}qf.Wt=new qf;
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const jf=255;function Bf(e){if(0===e)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}function zf(e){const t=64-function(e){let t=0;for(let n=0;n<8;++n){const r=Bf(255&e[n]);if(t+=r,8!==r)break}return t}(e);return Math.ceil(t/8)}class $f{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Qt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ht(n.value),n=t.next();this.Jt()}Zt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Gt(e);else if(e<2048)this.Gt(960|e>>>6),this.Gt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Gt(480|e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e);else{const e=t.codePointAt(0);this.Gt(240|e>>>18),this.Gt(128|63&e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e)}}this.zt()}Xt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Ht(e);else if(e<2048)this.Ht(960|e>>>6),this.Ht(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Ht(480|e>>>12),this.Ht(128|63&e>>>6),this.Ht(128|63&e);else{const e=t.codePointAt(0);this.Ht(240|e>>>18),this.Ht(128|63&e>>>12),this.Ht(128|63&e>>>6),this.Ht(128|63&e)}}this.Jt()}Yt(e){const t=this.en(e),n=zf(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=255&t[r]}nn(e){const t=this.en(e),n=zf(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=~(255&t[r])}rn(){this.sn(jf),this.sn(255)}_n(){this.an(jf),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){const t=function(e){const t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let r=1;r<t.length;++r)t[r]^=n?255:0;return t}Gt(e){const t=255&e;0===t?(this.sn(0),this.sn(255)):t===jf?(this.sn(jf),this.sn(0)):this.sn(t)}Ht(e){const t=255&e;0===t?(this.an(0),this.an(255)):t===jf?(this.an(jf),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Jt(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class Kf{constructor(e){this.cn=e}Bt(e){this.cn.Qt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.Yt(e)}vt(){this.cn.rn()}}class Gf{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Xt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}}class Hf{constructor(){this.cn=new $f,this.ascending=new Kf(this.cn),this.descending=new Gf(this.cn)}seed(e){this.cn.seed(e)}ln(e){return 0===e?this.ascending:this.descending}un(){return this.cn.un()}reset(){this.cn.reset()}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wf{constructor(e,t,n,r){this.hn=e,this.Pn=t,this.Tn=n,this.In=r}En(){const e=this.In.length,t=0===e||255===this.In[e-1]?e+1:e,n=new Uint8Array(t);return n.set(this.In,0),t!==e?n.set([0],this.In.length):++n[n.length-1],new Wf(this.hn,this.Pn,this.Tn,n)}Rn(e,t,n){return{indexId:this.hn,uid:e,arrayValue:Yf(this.Tn),directionalValue:Yf(this.In),orderedDocumentKey:Yf(t),documentKey:n.path.toArray()}}An(e,t,n){const r=this.Rn(e,t,n);return[r.indexId,r.uid,r.arrayValue,r.directionalValue,r.orderedDocumentKey,r.documentKey]}}function Qf(e,t){let n=e.hn-t.hn;return 0!==n?n:(n=Jf(e.Tn,t.Tn),0!==n?n:(n=Jf(e.In,t.In),0!==n?n:da.comparator(e.Pn,t.Pn)))}function Jf(e,t){for(let n=0;n<e.length&&n<t.length;++n){const r=e[n]-t[n];if(0!==r)return r}return e.length-t.length}function Yf(e){return _()?function(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t}(e):e}function Xf(e){return"string"!=typeof e?e:function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(e)}class Zf{constructor(e){this.Vn=new Cu((e,t)=>ha.comparator(e.field,t.field)),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.dn=e.orderBy,this.mn=[];for(const t of e.filters){const e=t;e.isInequality()?this.Vn=this.Vn.add(e):this.mn.push(e)}}get fn(){return this.Vn.size>1}gn(e){if(Uo(e.collectionGroup===this.collectionId,49279),this.fn)return!1;const t=Na(e);if(void 0!==t&&!this.pn(t))return!1;const n=Da(e);let r=new Set,i=0,s=0;for(;i<n.length&&this.pn(n[i]);++i)r=r.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Vn.size>0){const e=this.Vn.getIterator().getNext();if(!r.has(e.field.canonicalString())){const t=n[i];if(!this.yn(e,t)||!this.wn(this.dn[s++],t))return!1}++i}for(;i<n.length;++i){const e=n[i];if(s>=this.dn.length||!this.wn(this.dn[s++],e))return!1}return!0}bn(){if(this.fn)return null;let e=new Cu(ha.comparator);const t=[];for(const n of this.mn)if(!n.field.isKeyField())if("array-contains"===n.op||"array-contains-any"===n.op)t.push(new Pa(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Pa(n.field,0))}for(const n of this.dn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Pa(n.field,"asc"===n.dir?0:1)));return new ka(ka.UNKNOWN_ID,this.collectionId,t,xa.empty())}pn(e){for(const t of this.mn)if(this.yn(t,e))return!0;return!1}yn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;const n="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===n}wn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ep(e){var t,n;if(Uo(e instanceof Rl||e instanceof Pl,20012),e instanceof Rl){if(e instanceof Gl){const r=(null==(n=null==(t=e.value.arrayValue)?void 0:t.values)?void 0:n.map(t=>Rl.create(e.field,"==",t)))||[];return Pl.create(r,"or")}return e}const r=e.filters.map(e=>ep(e));return Pl.create(r,e.op)}function tp(e){if(0===e.getFilters().length)return[];const t=sp(ep(e));return Uo(ip(t),7391),np(t)||rp(t)?[t]:t.getFilters()}function np(e){return e instanceof Rl}function rp(e){return e instanceof Pl&&Ll(e)}function ip(e){return np(e)||rp(e)||function(e){if(e instanceof Pl&&xl(e)){for(const t of e.getFilters())if(!np(t)&&!rp(t))return!1;return!0}return!1}(e)}function sp(e){if(Uo(e instanceof Rl||e instanceof Pl,34018),e instanceof Rl)return e;if(1===e.filters.length)return sp(e.filters[0]);const t=e.filters.map(e=>sp(e));let n=Pl.create(t,e.op);return n=cp(n),ip(n)?n:(Uo(n instanceof Pl,64498),Uo(Ol(n),40251),Uo(n.filters.length>1,57927),n.filters.reduce((e,t)=>op(e,t)))}function op(e,t){let n;return Uo(e instanceof Rl||e instanceof Pl,38388),Uo(t instanceof Rl||t instanceof Pl,25473),n=e instanceof Rl?t instanceof Rl?(r=e,i=t,Pl.create([r,i],"and")):ap(e,t):t instanceof Rl?ap(t,e):function(e,t){if(Uo(e.filters.length>0&&t.filters.length>0,48005),Ol(e)&&Ol(t))return Ul(e,t.getFilters());const n=xl(e)?e:t,r=xl(e)?t:e,i=n.filters.map(e=>op(e,r));return Pl.create(i,"or")}(e,t),cp(n);var r,i}function ap(e,t){if(Ol(t))return Ul(t,e.getFilters());{const n=t.filters.map(t=>op(e,t));return Pl.create(n,"or")}}function cp(e){if(Uo(e instanceof Rl||e instanceof Pl,11850),e instanceof Rl)return e;const t=e.getFilters();if(1===t.length)return cp(t[0]);if(Ml(e))return e;const n=t.map(e=>cp(e)),r=[];return n.forEach(t=>{t instanceof Rl?r.push(t):t instanceof Pl&&(t.op===e.op?r.push(...t.filters):r.push(t))}),1===r.length?r[0]:Pl.create(r,e.op)
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class up{constructor(){this.Sn=new lp}addToCollectionParentIndex(e,t){return this.Sn.add(t),Ba.resolve()}getCollectionParents(e,t){return Ba.resolve(this.Sn.getEntries(t))}addFieldIndex(e,t){return Ba.resolve()}deleteFieldIndex(e,t){return Ba.resolve()}deleteAllFieldIndexes(e){return Ba.resolve()}createTargetIndexes(e,t){return Ba.resolve()}getDocumentsMatchingTarget(e,t){return Ba.resolve(null)}getIndexType(e,t){return Ba.resolve(0)}getFieldIndexes(e,t){return Ba.resolve([])}getNextCollectionGroupToUpdate(e){return Ba.resolve(null)}getMinOffset(e,t){return Ba.resolve(Fa.min())}getMinOffsetFromCollectionGroup(e,t){return Ba.resolve(Fa.min())}updateCollectionGroup(e,t,n){return Ba.resolve()}updateIndexEntries(e,t){return Ba.resolve()}}class lp{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new Cu(ua.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new Cu(ua.comparator)).toArray()}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hp="IndexedDbIndexManager",dp=new Uint8Array(0);class fp{constructor(e,t){this.databaseId=t,this.Dn=new lp,this.Cn=new _h(e=>Yl(e),(e,t)=>Xl(e,t)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Dn.has(t)){const n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener(()=>{this.Dn.add(t)});const i={collectionId:n,parent:uc(r)};return pp(e).put(i)}return Ba.resolve()}getCollectionParents(e,t){const n=[],r=IDBKeyRange.bound([t,""],[oa(t),""],!1,!0);return pp(e).H(r).next(e=>{for(const r of e){if(r.collectionId!==t)break;n.push(dc(r.parent))}return n})}addFieldIndex(e,t){const n=gp(e),r={indexId:(i=t).indexId,collectionGroup:i.collectionGroup,fields:i.fields.map(e=>[e.fieldPath.canonicalString(),e.kind])};var i;delete r.indexId;const s=n.add(r);if(t.indexState){const n=yp(e);return s.next(e=>{n.put(Of(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return s.next()}deleteFieldIndex(e,t){const n=gp(e),r=yp(e),i=mp(e);return n.delete(t.indexId).next(()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=gp(e),n=mp(e),r=yp(e);return t.X().next(()=>n.X()).next(()=>r.X())}createTargetIndexes(e,t){return Ba.forEach(this.vn(t),t=>this.getIndexType(e,t).next(n=>{if(0===n||1===n){const n=new Zf(t).bn();if(null!=n)return this.addFieldIndex(e,n)}}))}getDocumentsMatchingTarget(e,t){const n=mp(e);let r=!0;const i=new Map;return Ba.forEach(this.vn(t),t=>this.Fn(e,t).next(e=>{r&&(r=!!e),i.set(t,e)})).next(()=>{if(r){let e=Ph();const r=[];return Ba.forEach(i,(i,s)=>{var o;Oo(hp,`Using index ${o=i,`id=${o.indexId}|cg=${o.collectionGroup}|f=${o.fields.map(e=>`${e.fieldPath}:${e.kind}`).join(",")}`} to execute ${Yl(t)}`);const a=function(e,t){const n=Na(t);if(void 0===n)return null;for(const r of eh(e,n.fieldPath))switch(r.op){case"array-contains-any":return r.value.arrayValue.values||[];case"array-contains":return[r.value]}return null}(s,i),c=function(e,t){const n=new Map;for(const r of Da(t))for(const t of eh(e,r.fieldPath))switch(t.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(s,i),u=function(e,t){const n=[];let r=!0;for(const i of Da(t)){const t=0===i.kind?th(e,i.fieldPath,e.startAt):nh(e,i.fieldPath,e.startAt);n.push(t.value),r&&(r=t.inclusive)}return new Sl(n,r)}(s,i),l=function(e,t){const n=[];let r=!0;for(const i of Da(t)){const t=0===i.kind?nh(e,i.fieldPath,e.endAt):th(e,i.fieldPath,e.endAt);n.push(t.value),r&&(r=t.inclusive)}return new Sl(n,r)}(s,i),h=this.Mn(i,s,u),d=this.Mn(i,s,l),f=this.xn(i,s,c),p=this.On(i.indexId,a,h,u.inclusive,d,l.inclusive,f);return Ba.forEach(p,i=>n.Z(i,t.limit).next(t=>{t.forEach(t=>{const n=da.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))})}))}).next(()=>r)}return Ba.resolve(null)})}vn(e){let t=this.Cn.get(e);return t||(t=0===e.filters.length?[e]:tp(Pl.create(e.filters,"and")).map(t=>Jl(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt)),this.Cn.set(e,t),t)}On(e,t,n,r,i,s,o){const a=(null!=t?t.length:1)*Math.max(n.length,i.length),c=a/(null!=t?t.length:1),u=[];for(let l=0;l<a;++l){const a=t?this.Nn(t[l/c]):dp,h=this.Bn(e,a,n[l%c],r),d=this.Ln(e,a,i[l%c],s),f=o.map(t=>this.Bn(e,a,t,!0));u.push(...this.createRange(h,d,f))}return u}Bn(e,t,n,r){const i=new Wf(e,da.empty(),t,n);return r?i:i.En()}Ln(e,t,n,r){const i=new Wf(e,da.empty(),t,n);return r?i.En():i}Fn(e,t){const n=new Zf(t),r=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next(e=>{let t=null;for(const r of e)n.gn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t})}getIndexType(e,t){let n=2;const r=this.vn(t);return Ba.forEach(r,t=>this.Fn(e,t).next(e=>{e?0!==n&&e.fields.length<function(e){let t=new Cu(ha.comparator),n=!1;for(const r of e.filters)for(const e of r.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?n=!0:t=t.add(e.field));for(const r of e.orderBy)r.field.isKeyField()||(t=t.add(r.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})).next(()=>null!==t.limit&&r.length>1&&2===n?1:n)}kn(e,t){const n=new Hf;for(const r of Da(e)){const e=t.data.field(r.fieldPath);if(null==e)return null;const i=n.ln(r.kind);qf.Wt.Dt(e,i)}return n.un()}Nn(e){const t=new Hf;return qf.Wt.Dt(e,t.ln(0)),t.un()}Kn(e,t){const n=new Hf;return qf.Wt.Dt(cl(this.databaseId,t),n.ln(function(e){const t=Da(e);return 0===t.length?0:t[t.length-1].kind}(e))),n.un()}xn(e,t,n){if(null===n)return[];let r=[];r.push(new Hf);let i=0;for(const s of Da(e)){const e=n[i++];for(const n of r)if(this.qn(t,s.fieldPath)&&ll(e))r=this.Un(r,s,e);else{const t=n.ln(s.kind);qf.Wt.Dt(e,t)}}return this.$n(r)}Mn(e,t,n){return this.xn(e,t,n.position)}$n(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Un(e,t,n){const r=[...e],i=[];for(const s of n.arrayValue.values||[])for(const e of r){const n=new Hf;n.seed(e.un()),qf.Wt.Dt(s,n.ln(t.kind)),i.push(n)}return i}qn(e,t){return!!e.filters.find(e=>e instanceof Rl&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op))}getFieldIndexes(e,t){const n=gp(e),r=yp(e);return(t?n.H(Wc,IDBKeyRange.bound(t,t)):n.H()).next(e=>{const t=[];return Ba.forEach(e,e=>r.get([e.indexId,this.uid]).next(n=>{t.push(function(e,t){const n=t?new xa(t.sequenceNumber,new Fa(Af(t.readTime),new da(dc(t.documentKey)),t.largestBatchId)):xa.empty(),r=e.fields.map(([e,t])=>new Pa(ha.fromServerFormat(e),t));return new ka(e.indexId,e.collectionGroup,r,n)}(e,n))})).next(()=>t)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(e=>0===e.length?null:(e.sort((e,t)=>{const n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==n?n:ea(e.collectionGroup,t.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(e,t,n){const r=gp(e),i=yp(e);return this.Wn(e).next(e=>r.H(Wc,IDBKeyRange.bound(t,t)).next(t=>Ba.forEach(t,t=>i.put(Of(t.indexId,this.uid,e,n)))))}updateIndexEntries(e,t){const n=new Map;return Ba.forEach(t,(t,r)=>{const i=n.get(t.collectionGroup);return(i?Ba.resolve(i):this.getFieldIndexes(e,t.collectionGroup)).next(i=>(n.set(t.collectionGroup,i),Ba.forEach(i,n=>this.Qn(e,t,n).next(t=>{const i=this.Gn(r,n);return t.isEqual(i)?Ba.resolve():this.zn(e,r,n,t,i)}))))})}jn(e,t,n,r){return mp(e).put(r.Rn(this.uid,this.Kn(n,t.key),t.key))}Hn(e,t,n,r){return mp(e).delete(r.An(this.uid,this.Kn(n,t.key),t.key))}Qn(e,t,n){const r=mp(e);let i=new Cu(Qf);return r.ee({index:tu,range:IDBKeyRange.only([n.indexId,this.uid,Yf(this.Kn(n,t))])},(e,r)=>{i=i.add(new Wf(n.indexId,t,Xf(r.arrayValue),Xf(r.directionalValue)))}).next(()=>i)}Gn(e,t){let n=new Cu(Qf);const r=this.kn(t,e);if(null==r)return n;const i=Na(t);if(null!=i){const s=e.data.field(i.fieldPath);if(ll(s))for(const i of s.arrayValue.values||[])n=n.add(new Wf(t.indexId,e.key,this.Nn(i),r))}else n=n.add(new Wf(t.indexId,e.key,dp,r));return n}zn(e,t,n,r,i){Oo(hp,"Updating index entries for document '%s'",t.key);const s=[];return function(e,t,n,r,i){const s=e.getIterator(),o=t.getIterator();let a=Nu(s),c=Nu(o);for(;a||c;){let e=!1,t=!1;if(a&&c){const r=n(a,c);r<0?t=!0:r>0&&(e=!0)}else null!=a?t=!0:e=!0;e?(r(c),c=Nu(o)):t?(i(a),a=Nu(s)):(a=Nu(s),c=Nu(o))}}(r,i,Qf,r=>{s.push(this.jn(e,t,n,r))},r=>{s.push(this.Hn(e,t,n,r))}),Ba.waitFor(s)}Wn(e){let t=1;return yp(e).ee({index:Yc,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(e,n,r)=>{r.done(),t=n.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((e,t)=>Qf(e,t)).filter((e,t,n)=>!t||0!==Qf(e,n[t-1]));const r=[];r.push(e);for(const s of n){const n=Qf(s,e),i=Qf(s,t);if(0===n)r[0]=e.En();else if(n>0&&i<0)r.push(s),r.push(s.En());else if(i>0)break}r.push(t);const i=[];for(let s=0;s<r.length;s+=2){if(this.Jn(r[s],r[s+1]))return[];const e=r[s].An(this.uid,dp,da.empty()),t=r[s+1].An(this.uid,dp,da.empty());i.push(IDBKeyRange.bound(e,t))}return i}Jn(e,t){return Qf(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(vp)}getMinOffset(e,t){return Ba.mapArray(this.vn(t),t=>this.Fn(e,t).next(e=>e||Fo(44426))).next(vp)}}function pp(e){return wu(e,Bc)}function mp(e){return wu(e,Zc)}function gp(e){return wu(e,Hc)}function yp(e){return wu(e,Qc)}function vp(e){Uo(0!==e.length,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){const i=e[r].indexState.offset;Va(i,t)<0&&(t=i),n<i.largestBatchId&&(n=i.largestBatchId)}return new Fa(t.readTime,t.documentKey,n)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wp={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Ip=41943040;class _p{static withCacheSize(e){return new _p(e,_p.DEFAULT_COLLECTION_PERCENTILE,_p.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bp(e,t,n){const r=e.store(yc),i=e.store(Ec),s=[],o=IDBKeyRange.only(n.batchId);let a=0;const c=r.ee({range:o},(e,t,n)=>(a++,n.delete()));s.push(c.next(()=>{Uo(1===a,47070,{batchId:n.batchId})}));const u=[];for(const l of n.mutations){const e=bc(t,l.key.path,n.batchId);s.push(i.delete(e)),u.push(l.key)}return Ba.waitFor(s).next(()=>u)}function Tp(e){if(!e)return 0;let t;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw Fo(14731);t=e.noDocument}return JSON.stringify(t).length}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */_p.DEFAULT_COLLECTION_PERCENTILE=10,_p.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,_p.DEFAULT=new _p(Ip,_p.DEFAULT_COLLECTION_PERCENTILE,_p.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),_p.DISABLED=new _p(-1,0,0);class Ep{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.Zn={}}static wt(e,t,n,r){Uo(""!==e.uid,64387);const i=e.isAuthenticated()?e.uid:"";return new Ep(i,t,n,r)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Ap(e).ee({index:wc,range:n},(e,n,r)=>{t=!1,r.done()}).next(()=>t)}addMutationBatch(e,t,n,r){const i=Cp(e),s=Ap(e);return s.add({}).next(o=>{Uo("number"==typeof o,49019);const a=new fd(o,t,n,r),c=function(e,t,n){const r=n.baseMutations.map(t=>sf(e.yt,t)),i=n.mutations.map(t=>sf(e.yt,t));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:i}}(this.serializer,this.userId,a),u=[];let l=new Cu((e,t)=>ea(e.canonicalString(),t.canonicalString()));for(const e of r){const t=bc(this.userId,e.key.path,o);l=l.add(e.key.path.popLast()),u.push(s.put(c)),u.push(i.put(t,Tc))}return l.forEach(t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))}),e.addOnCommittedListener(()=>{this.Zn[o]=a.keys()}),Ba.waitFor(u).next(()=>a)})}lookupMutationBatch(e,t){return Ap(e).get(t).next(e=>e?(Uo(e.userId===this.userId,48,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),Cf(this.serializer,e)):null)}Xn(e,t){return this.Zn[t]?Ba.resolve(this.Zn[t]):this.lookupMutationBatch(e,t).next(e=>{if(e){const n=e.keys();return this.Zn[t]=n,n}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Ap(e).ee({index:wc,range:r},(e,t,r)=>{t.userId===this.userId&&(Uo(t.batchId>=n,47524,{Yn:n}),i=Cf(this.serializer,t)),r.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=ic;return Ap(e).ee({index:wc,range:t,reverse:!0},(e,t,r)=>{n=t.batchId,r.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,ic],[this.userId,Number.POSITIVE_INFINITY]);return Ap(e).H(wc,t).next(e=>e.map(e=>Cf(this.serializer,e)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=_c(this.userId,t.path),r=IDBKeyRange.lowerBound(n),i=[];return Cp(e).ee({range:r},(n,r,s)=>{const[o,a,c]=n,u=dc(a);if(o===this.userId&&t.path.isEqual(u))return Ap(e).get(c).next(e=>{if(!e)throw Fo(61480,{er:n,batchId:c});Uo(e.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:e.userId,batchId:c}),i.push(Cf(this.serializer,e))});s.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Cu(ea);const r=[];return t.forEach(t=>{const i=_c(this.userId,t.path),s=IDBKeyRange.lowerBound(i),o=Cp(e).ee({range:s},(e,r,i)=>{const[s,o,a]=e,c=dc(o);s===this.userId&&t.path.isEqual(c)?n=n.add(a):i.done()});r.push(o)}),Ba.waitFor(r).next(()=>this.tr(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1,i=_c(this.userId,n),s=IDBKeyRange.lowerBound(i);let o=new Cu(ea);return Cp(e).ee({range:s},(e,t,i)=>{const[s,a,c]=e,u=dc(a);s===this.userId&&n.isPrefixOf(u)?u.length===r&&(o=o.add(c)):i.done()}).next(()=>this.tr(e,o))}tr(e,t){const n=[],r=[];return t.forEach(t=>{r.push(Ap(e).get(t).next(e=>{if(null===e)throw Fo(35274,{batchId:t});Uo(e.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),n.push(Cf(this.serializer,e))}))}),Ba.waitFor(r).next(()=>n)}removeMutationBatch(e,t){return bp(e.le,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.nr(t.batchId)}),Ba.forEach(n,t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))}nr(e){delete this.Zn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return Ba.resolve();const n=IDBKeyRange.lowerBound(function(e){return[e]}(this.userId)),r=[];return Cp(e).ee({range:n},(e,t,n)=>{if(e[0]===this.userId){const t=dc(e[1]);r.push(t)}else n.done()}).next(()=>{Uo(0===r.length,56720,{rr:r.map(e=>e.canonicalString())})})})}containsKey(e,t){return Sp(e,this.userId,t)}ir(e){return kp(e).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:ic,lastStreamToken:""})}}function Sp(e,t,n){const r=_c(t,n.path),i=r[1],s=IDBKeyRange.lowerBound(r);let o=!1;return Cp(e).ee({range:s,Y:!0},(e,n,r)=>{const[s,a,c]=e;s===t&&a===i&&(o=!0),r.done()}).next(()=>o)}function Ap(e){return wu(e,yc)}function Cp(e){return wu(e,Ec)}function kp(e){return wu(e,gc)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Np{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new Np(0)}static ar(){return new Np(-1)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dp{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.ur(e).next(t=>{const n=new Np(t.highestTargetId);return t.highestTargetId=n.next(),this.cr(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.ur(e).next(e=>Aa.fromTimestamp(new Sa(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.ur(e).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.ur(e).next(r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.cr(e,r)))}addTargetData(e,t){return this.lr(e,t).next(()=>this.ur(e).next(n=>(n.targetCount+=1,this.hr(t,n),this.cr(e,n))))}updateTargetData(e,t){return this.lr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>Rp(e).delete(t.targetId)).next(()=>this.ur(e)).next(t=>(Uo(t.targetCount>0,8065),t.targetCount-=1,this.cr(e,t)))}removeTargets(e,t,n){let r=0;const i=[];return Rp(e).ee((s,o)=>{const a=kf(o);a.sequenceNumber<=t&&null===n.get(a.targetId)&&(r++,i.push(this.removeTargetData(e,a)))}).next(()=>Ba.waitFor(i)).next(()=>r)}forEachTarget(e,t){return Rp(e).ee((e,n)=>{const r=kf(n);t(r)})}ur(e){return Pp(e).get(qc).next(e=>(Uo(null!==e,2888),e))}cr(e,t){return Pp(e).put(qc,t)}lr(e,t){return Rp(e).put(Nf(this.serializer,t))}hr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.ur(e).next(e=>e.targetCount)}getTargetData(e,t){const n=Yl(t),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Rp(e).ee({range:r,index:xc},(e,n,r)=>{const s=kf(n);Xl(t,s.target)&&(i=s,r.done())}).next(()=>i)}addMatchingKeys(e,t,n){const r=[],i=Op(e);return t.forEach(t=>{const s=uc(t.path);r.push(i.put({targetId:n,path:s})),r.push(this.referenceDelegate.addReference(e,n,t))}),Ba.waitFor(r)}removeMatchingKeys(e,t,n){const r=Op(e);return Ba.forEach(t,t=>{const i=uc(t.path);return Ba.waitFor([r.delete([n,i]),this.referenceDelegate.removeReference(e,n,t)])})}removeMatchingKeysForTargetId(e,t){const n=Op(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),r=Op(e);let i=Ph();return r.ee({range:n,Y:!0},(e,t,n)=>{const r=dc(e[1]),s=new da(r);i=i.add(s)}).next(()=>i)}containsKey(e,t){const n=uc(t.path),r=IDBKeyRange.bound([n],[oa(n)],!1,!0);let i=0;return Op(e).ee({index:Vc,Y:!0,range:r},([e,t],n,r)=>{0!==e&&(i++,r.done())}).next(()=>i>0)}At(e,t){return Rp(e).get(t).next(e=>e?kf(e):null)}}function Rp(e){return wu(e,Oc)}function Pp(e){return wu(e,jc)}function Op(e){return wu(e,Mc)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xp="LruGarbageCollector",Lp=1048576;function Mp([e,t],[n,r]){const i=ea(e,n);return 0===i?ea(t,r):i}class Fp{constructor(e){this.Pr=e,this.buffer=new Cu(Mp),this.Tr=0}Ir(){return++this.Tr}Er(e){const t=[e,this.Ir()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{const e=this.buffer.last();Mp(t,e)<0&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Vp{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return null!==this.Rr}Ar(e){Oo(xp,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Qa(e)?Oo(xp,"Ignoring IndexedDB error during garbage collection: ",e):await ja(e)}await this.Ar(3e5)})}}class Up{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return Ba.resolve(rc.ce);const n=new Fp(t);return this.Vr.forEachTarget(e,e=>n.Er(e.sequenceNumber)).next(()=>this.Vr.mr(e,e=>n.Er(e))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return-1===this.params.cacheSizeCollectionThreshold?(Oo("LruGarbageCollector","Garbage collection skipped; disabled"),Ba.resolve(wp)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(Oo("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),wp):this.gr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let n,r,i,s,o,a,c;const u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(Oo("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,s=Date.now(),this.nthSequenceNumber(e,r))).next(r=>(n=r,o=Date.now(),this.removeTargets(e,n,t))).next(t=>(i=t,a=Date.now(),this.removeOrphanedDocuments(e,n))).next(e=>(c=Date.now(),Po()<=U.DEBUG&&Oo("LruGarbageCollector",`LRU Garbage Collection\n\tCounted targets in ${s-u}ms\n\tDetermined least recently used ${r} in `+(o-s)+`ms\n\tRemoved ${i} targets in `+(a-o)+`ms\n\tRemoved ${e} documents in `+(c-a)+`ms\nTotal Duration: ${c-u}ms`),Ba.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:e})))}}function qp(e,t){return new Up(e,t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jp{constructor(e,t){this.db=e,this.garbageCollector=qp(this,t)}dr(e){const t=this.pr(e);return this.db.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}pr(e){let t=0;return this.mr(e,e=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}mr(e,t){return this.yr(e,(e,n)=>t(n))}addReference(e,t,n){return Bp(e,n)}removeReference(e,t,n){return Bp(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Bp(e,t)}wr(e,t){return function(e,t){let n=!1;return kp(e).te(r=>Sp(e,r,t).next(e=>(e&&(n=!0),Ba.resolve(!e)))).next(()=>n)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[];let i=0;return this.yr(e,(s,o)=>{if(o<=t){const t=this.wr(e,s).next(t=>{if(!t)return i++,n.getEntry(e,s).next(()=>(n.removeEntry(s,Aa.min()),Op(e).delete([0,uc(s.path)])))});r.push(t)}}).next(()=>Ba.waitFor(r)).next(()=>n.apply(e)).next(()=>i)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Bp(e,t)}yr(e,t){const n=Op(e);let r,i=rc.ce;return n.ee({index:Vc},([e,n],{path:s,sequenceNumber:o})=>{0===e?(i!==rc.ce&&t(new da(dc(r)),i),i=o,r=s):i=rc.ce}).next(()=>{i!==rc.ce&&t(new da(dc(r)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Bp(e,t){return Op(e).put((n=t,r=e.currentSequenceNumber,{targetId:0,path:uc(n.path),sequenceNumber:r}));var n,r}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(){this.changes=new _h(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,El.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return void 0!==n?Ba.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $p{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Wp(e).put(n)}removeEntry(e,t,n){return Wp(e).delete(function(e,t){const n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],Ef(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.br(e,n)))}getEntry(e,t){let n=El.newInvalidDocument(t);return Wp(e).ee({index:Cc,range:IDBKeyRange.only(Qp(t))},(e,r)=>{n=this.Sr(t,r)}).next(()=>n)}Dr(e,t){let n={size:0,document:El.newInvalidDocument(t)};return Wp(e).ee({index:Cc,range:IDBKeyRange.only(Qp(t))},(e,r)=>{n={document:this.Sr(t,r),size:Tp(r)}}).next(()=>n)}getEntries(e,t){let n=Th();return this.Cr(e,t,(e,t)=>{const r=this.Sr(e,t);n=n.insert(e,r)}).next(()=>n)}vr(e,t){let n=Th(),r=new Eu(da.comparator);return this.Cr(e,t,(e,t)=>{const i=this.Sr(e,t);n=n.insert(e,i),r=r.insert(e,Tp(t))}).next(()=>({documents:n,Fr:r}))}Cr(e,t,n){if(t.isEmpty())return Ba.resolve();let r=new Cu(Yp);t.forEach(e=>r=r.add(e));const i=IDBKeyRange.bound(Qp(r.first()),Qp(r.last())),s=r.getIterator();let o=s.getNext();return Wp(e).ee({index:Cc,range:i},(e,t,r)=>{const i=da.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;o&&Yp(o,i)<0;)n(o,null),o=s.getNext();o&&o.isEqual(i)&&(n(o,t),o=s.hasNext()?s.getNext():null),o?r.j(Qp(o)):r.done()}).next(()=>{for(;o;)n(o,null),o=s.hasNext()?s.getNext():null})}getDocumentsMatchingQuery(e,t,n,r,i){const s=t.path,o=[s.popLast().toArray(),s.lastSegment(),Ef(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],a=[s.popLast().toArray(),s.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Wp(e).H(IDBKeyRange.bound(o,a,!0)).next(e=>{null==i||i.incrementDocumentReadCount(e.length);let n=Th();for(const i of e){const e=this.Sr(da.fromSegments(i.prefixPath.concat(i.collectionGroup,i.documentId)),i);e.isFoundDocument()&&(yh(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n})}getAllFromCollectionGroup(e,t,n,r){let i=Th();const s=Jp(t,n),o=Jp(t,Fa.max());return Wp(e).ee({index:Nc,range:IDBKeyRange.bound(s,o,!0)},(e,t,n)=>{const s=this.Sr(da.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);i=i.insert(s.key,s),i.size===r&&n.done()}).next(()=>i)}newChangeBuffer(e){return new Gp(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(e=>e.byteSize)}getMetadata(e){return Hp(e).get(Pc).next(e=>(Uo(!!e,20021),e))}br(e,t){return Hp(e).put(Pc,t)}Sr(e,t){if(t){const e=function(e,t){let n;if(t.document)n=rf(e.yt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const e=da.fromSegments(t.noDocument.path),r=Af(t.noDocument.readTime);n=El.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return Fo(56709);{const e=da.fromSegments(t.unknownDocument.path),r=Af(t.unknownDocument.version);n=El.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){const t=new Sa(e[0],e[1]);return Aa.fromTimestamp(t)}(t.readTime)),n}(this.serializer,t);if(!e.isNoDocument()||!e.version.isEqual(Aa.min()))return e}return El.newInvalidDocument(e)}}function Kp(e){return new $p(e)}class Gp extends zp{constructor(e,t){super(),this.Mr=e,this.trackRemovals=t,this.Or=new _h(e=>e.toString(),(e,t)=>e.isEqual(t))}applyChanges(e){const t=[];let n=0,r=new Cu((e,t)=>ea(e.canonicalString(),t.canonicalString()));return this.changes.forEach((i,s)=>{const o=this.Or.get(i);if(t.push(this.Mr.removeEntry(e,i,o.readTime)),s.isValidDocument()){const a=Tf(this.Mr.serializer,s);r=r.add(i.path.popLast());const c=Tp(a);n+=c-o.size,t.push(this.Mr.addEntry(e,i,a))}else if(n-=o.size,this.trackRemovals){const n=Tf(this.Mr.serializer,s.convertToNoDocument(Aa.min()));t.push(this.Mr.addEntry(e,i,n))}}),r.forEach(n=>{t.push(this.Mr.indexManager.addToCollectionParentIndex(e,n))}),t.push(this.Mr.updateMetadata(e,n)),Ba.waitFor(t)}getFromCache(e,t){return this.Mr.Dr(e,t).next(e=>(this.Or.set(t,{size:e.size,readTime:e.document.readTime}),e.document))}getAllFromCache(e,t){return this.Mr.vr(e,t).next(({documents:e,Fr:t})=>(t.forEach((t,n)=>{this.Or.set(t,{size:n,readTime:e.get(t).readTime})}),e))}}function Hp(e){return wu(e,Rc)}function Wp(e){return wu(e,Sc)}function Qp(e){const t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function Jp(e,t){const n=t.documentKey.path.toArray();return[e,Ef(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function Yp(e,t){const n=e.path.toArray(),r=t.path.toArray();let i=0;for(let s=0;s<n.length-2&&s<r.length-2;++s)if(i=ea(n[s],r[s]),i)return i;return i=ea(n.length,r.length),i||(i=ea(n[n.length-2],r[r.length-2]),i||ea(n[n.length-1],r[r.length-1])
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}class Xp{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zp{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&rd(n.mutation,e,Du.empty(),Sa.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,Ph()).next(()=>t))}getLocalViewOfDocuments(e,t,n=Ph()){const r=Ch();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=Sh();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){const n=Ch();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,Ph()))}populateOverlays(e,t,n){const r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let i=Th();const s=Nh(),o=Nh();return t.forEach((e,t)=>{const o=n.get(t.key);r.has(t.key)&&(void 0===o||o.mutation instanceof ad)?i=i.insert(t.key,t):void 0!==o?(s.set(t.key,o.mutation.getFieldMask()),rd(o.mutation,t,o.mutation.getFieldMask(),Sa.now())):s.set(t.key,Du.empty())}),this.recalculateAndSaveOverlays(e,i).next(e=>(e.forEach((e,t)=>s.set(e,t)),t.forEach((e,t)=>o.set(e,new Xp(t,s.get(e)??null))),o))}recalculateAndSaveOverlays(e,t){const n=Nh();let r=new Eu((e,t)=>e-t),i=Ph();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(const i of e)i.keys().forEach(e=>{const s=t.get(e);if(null===s)return;let o=n.get(e)||Du.empty();o=i.applyToLocalView(s,o),n.set(e,o);const a=(r.get(i.batchId)||Ph()).add(e);r=r.insert(i.batchId,a)})}).next(()=>{const s=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,c=r.value,u=kh();c.forEach(e=>{if(!i.has(e)){const r=td(t.get(e),n.get(e));null!==r&&u.set(e,r),i=i.add(e)}}),s.push(this.documentOverlayCache.saveOverlays(e,a,u))}return Ba.waitFor(s)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return function(e){return da.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):ah(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r)}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(i=>{const s=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):Ba.resolve(Ch());let o=Ca,a=i;return s.next(t=>Ba.forEach(t,(t,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),i.get(t)?Ba.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{a=a.insert(t,e)}))).next(()=>this.populateOverlays(e,t,i)).next(()=>this.computeViews(e,a,t,Ph())).next(e=>({batchId:o,changes:Ah(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new da(t)).next(e=>{let t=Sh();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){const i=t.collectionGroup;let s=Sh();return this.indexManager.getCollectionParents(e,i).next(o=>Ba.forEach(o,o=>{const a=(c=t,u=o.child(i),new rh(u,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt));var c,u;return this.getDocumentsMatchingCollectionQuery(e,a,n,r).next(e=>{e.forEach((e,t)=>{s=s.insert(e,t)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r))).next(e=>{i.forEach((t,n)=>{const r=n.getKey();null===e.get(r)&&(e=e.insert(r,El.newInvalidDocument(r)))});let n=Sh();return e.forEach((e,r)=>{const s=i.get(e);void 0!==s&&rd(s.mutation,r,Du.empty(),Sa.now()),yh(t,r)&&(n=n.insert(e,r))}),n})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class em{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return Ba.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,{id:(n=t).id,version:n.version,createTime:Gd(n.createTime)}),Ba.resolve();var n}getNamedQuery(e,t){return Ba.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,{name:(n=t).name,query:Df(n.bundledQuery),readTime:Gd(n.readTime)}),Ba.resolve();var n}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tm{constructor(){this.overlays=new Eu(da.comparator),this.Lr=new Map}getOverlay(e,t){return Ba.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Ch();return Ba.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.bt(e,t,r)}),Ba.resolve()}removeOverlaysForBatchId(e,t,n){const r=this.Lr.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.Lr.delete(n)),Ba.resolve()}getOverlaysForCollection(e,t,n){const r=Ch(),i=t.length+1,s=new da(t.child("")),o=this.overlays.getIteratorFrom(s);for(;o.hasNext();){const e=o.getNext().value,s=e.getKey();if(!t.isPrefixOf(s.path))break;s.path.length===i&&e.largestBatchId>n&&r.set(e.getKey(),e)}return Ba.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new Eu((e,t)=>e-t);const s=this.overlays.getIterator();for(;s.hasNext();){const e=s.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=i.get(e.largestBatchId);null===t&&(t=Ch(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}const o=Ch(),a=i.getIterator();for(;a.hasNext()&&(a.getNext().value.forEach((e,t)=>o.set(e,t)),!(o.size()>=r)););return Ba.resolve(o)}bt(e,t,n){const r=this.overlays.get(n.key);if(null!==r){const e=this.Lr.get(r.largestBatchId).delete(n.key);this.Lr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new md(t,n));let i=this.Lr.get(t);void 0===i&&(i=Ph(),this.Lr.set(t,i)),this.Lr.set(t,i.add(n.key))}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nm{constructor(){this.sessionToken=Pu.EMPTY_BYTE_STRING}getSessionToken(e){return Ba.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,Ba.resolve()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rm{constructor(){this.kr=new Cu(im.Kr),this.qr=new Cu(im.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){const n=new im(e,t);this.kr=this.kr.add(n),this.qr=this.qr.add(n)}$r(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Wr(new im(e,t))}Qr(e,t){e.forEach(e=>this.removeReference(e,t))}Gr(e){const t=new da(new ua([])),n=new im(t,e),r=new im(t,e+1),i=[];return this.qr.forEachInRange([n,r],e=>{this.Wr(e),i.push(e.key)}),i}zr(){this.kr.forEach(e=>this.Wr(e))}Wr(e){this.kr=this.kr.delete(e),this.qr=this.qr.delete(e)}jr(e){const t=new da(new ua([])),n=new im(t,e),r=new im(t,e+1);let i=Ph();return this.qr.forEachInRange([n,r],e=>{i=i.add(e.key)}),i}containsKey(e){const t=new im(e,0),n=this.kr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class im{constructor(e,t){this.key=e,this.Hr=t}static Kr(e,t){return da.comparator(e.key,t.key)||ea(e.Hr,t.Hr)}static Ur(e,t){return ea(e.Hr,t.Hr)||da.comparator(e.key,t.key)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sm{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Jr=new Cu(im.Kr)}checkEmpty(e){return Ba.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){const i=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const s=new fd(i,t,n,r);this.mutationQueue.push(s);for(const o of r)this.Jr=this.Jr.add(new im(o.key,i)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return Ba.resolve(s)}lookupMutationBatch(e,t){return Ba.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=this.Xr(n),i=r<0?0:r;return Ba.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return Ba.resolve(0===this.mutationQueue.length?ic:this.Yn-1)}getAllMutationBatches(e){return Ba.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new im(t,0),r=new im(t,Number.POSITIVE_INFINITY),i=[];return this.Jr.forEachInRange([n,r],e=>{const t=this.Zr(e.Hr);i.push(t)}),Ba.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Cu(ea);return t.forEach(e=>{const t=new im(e,0),r=new im(e,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([t,r],e=>{n=n.add(e.Hr)})}),Ba.resolve(this.Yr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1;let i=n;da.isDocumentKey(i)||(i=i.child(""));const s=new im(new da(i),0);let o=new Cu(ea);return this.Jr.forEachWhile(e=>{const t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(o=o.add(e.Hr)),!0)},s),Ba.resolve(this.Yr(o))}Yr(e){const t=[];return e.forEach(e=>{const n=this.Zr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){Uo(0===this.ei(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.Jr;return Ba.forEach(t.mutations,r=>{const i=new im(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Jr=n})}nr(e){}containsKey(e,t){const n=new im(t,0),r=this.Jr.firstAfterOrEqual(n);return Ba.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,Ba.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class om{constructor(e){this.ti=e,this.docs=new Eu(da.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,r=this.docs.get(n),i=r?r.size:0,s=this.ti(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return Ba.resolve(n?n.document.mutableCopy():El.newInvalidDocument(t))}getEntries(e,t){let n=Th();return t.forEach(e=>{const t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():El.newInvalidDocument(e))}),Ba.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=Th();const s=t.path,o=new da(s.child("__id-9223372036854775808__")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:e,value:{document:o}}=a.getNext();if(!s.isPrefixOf(e.path))break;e.path.length>s.length+1||Va(Ma(o),n)<=0||(r.has(o.key)||yh(t,o))&&(i=i.insert(o.key,o.mutableCopy()))}return Ba.resolve(i)}getAllFromCollectionGroup(e,t,n,r){Fo(9500)}ni(e,t){return Ba.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new am(this)}getSize(e){return Ba.resolve(this.size)}}class am extends zp{constructor(e){super(),this.Mr=e}applyChanges(e){const t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.Mr.addEntry(e,r)):this.Mr.removeEntry(n)}),Ba.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cm{constructor(e){this.persistence=e,this.ri=new _h(e=>Yl(e),Xl),this.lastRemoteSnapshotVersion=Aa.min(),this.highestTargetId=0,this.ii=0,this.si=new rm,this.targetCount=0,this.oi=Np._r()}forEachTarget(e,t){return this.ri.forEach((e,n)=>t(n)),Ba.resolve()}getLastRemoteSnapshotVersion(e){return Ba.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return Ba.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),Ba.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.ii&&(this.ii=t),Ba.resolve()}lr(e){this.ri.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.oi=new Np(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,Ba.resolve()}updateTargetData(e,t){return this.lr(t),Ba.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,Ba.resolve()}removeTargets(e,t,n){let r=0;const i=[];return this.ri.forEach((s,o)=>{o.sequenceNumber<=t&&null===n.get(o.targetId)&&(this.ri.delete(s),i.push(this.removeMatchingKeysForTargetId(e,o.targetId)),r++)}),Ba.waitFor(i).next(()=>r)}getTargetCount(e){return Ba.resolve(this.targetCount)}getTargetData(e,t){const n=this.ri.get(t)||null;return Ba.resolve(n)}addMatchingKeys(e,t,n){return this.si.$r(t,n),Ba.resolve()}removeMatchingKeys(e,t,n){this.si.Qr(t,n);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(t=>{i.push(r.markPotentiallyOrphaned(e,t))}),Ba.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),Ba.resolve()}getMatchingKeysForTargetId(e,t){const n=this.si.jr(t);return Ba.resolve(n)}containsKey(e,t){return Ba.resolve(this.si.containsKey(t))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class um{constructor(e,t){this._i={},this.overlays={},this.ai=new rc(0),this.ui=!1,this.ui=!0,this.ci=new nm,this.referenceDelegate=e(this),this.li=new cm(this),this.indexManager=new up,this.remoteDocumentCache=new om(e=>this.referenceDelegate.hi(e)),this.serializer=new bf(t),this.Pi=new em(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new tm,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this._i[e.toKey()];return n||(n=new sm(t,this.referenceDelegate),this._i[e.toKey()]=n),n}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,n){Oo("MemoryPersistence","Starting transaction:",e);const r=new lm(this.ai.next());return this.referenceDelegate.Ti(),n(r).next(e=>this.referenceDelegate.Ii(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Ei(e,t){return Ba.or(Object.values(this._i).map(n=>()=>n.containsKey(e,t)))}}class lm extends qa{constructor(e){super(),this.currentSequenceNumber=e}}class hm{constructor(e){this.persistence=e,this.Ri=new rm,this.Ai=null}static Vi(e){return new hm(e)}get di(){if(this.Ai)return this.Ai;throw Fo(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.di.delete(n.toString()),Ba.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.di.add(n.toString()),Ba.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),Ba.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach(e=>this.di.add(e.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.di.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}Ti(){this.Ai=new Set}Ii(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return Ba.forEach(this.di,n=>{const r=da.fromPath(n);return this.mi(e,r).next(e=>{e||t.removeEntry(r,Aa.min())})}).next(()=>(this.Ai=null,t.apply(e)))}updateLimboDocument(e,t){return this.mi(e,t).next(e=>{e?this.di.delete(t.toString()):this.di.add(t.toString())})}hi(e){return 0}mi(e,t){return Ba.or([()=>Ba.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class dm{constructor(e,t){this.persistence=e,this.fi=new _h(e=>uc(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=qp(this,t)}static Vi(e,t){return new dm(e,t)}Ti(){}Ii(e){return Ba.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}pr(e){let t=0;return this.mr(e,e=>{t++}).next(()=>t)}mr(e,t){return Ba.forEach(this.fi,(n,r)=>this.wr(e,n,r).next(e=>e?Ba.resolve():t(r)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.ni(e,r=>this.wr(e,r,t).next(e=>{e||(n++,i.removeEntry(r,Aa.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),Ba.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),Ba.resolve()}removeReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),Ba.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),Ba.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=al(e.data.value)),t}wr(e,t,n){return Ba.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const e=this.fi.get(t);return Ba.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fm{constructor(e){this.serializer=e}k(e,t,n,r){const i=new $a("createOrUpgrade",t);n<1&&r>=1&&(e.createObjectStore(pc),function(e){e.createObjectStore(gc,{keyPath:"userId"});e.createObjectStore(yc,{keyPath:vc,autoIncrement:!0}).createIndex(wc,Ic,{unique:!0}),e.createObjectStore(Ec)}(e),pm(e),function(e){e.createObjectStore(fc)}(e));let s=Ba.resolve();return n<3&&r>=3&&(0!==n&&(function(e){e.deleteObjectStore(Mc),e.deleteObjectStore(Oc),e.deleteObjectStore(jc)}(e),pm(e)),s=s.next(()=>function(e){const t=e.store(jc),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:Aa.min().toTimestamp(),targetCount:0};return t.put(qc,n)}(i))),n<4&&r>=4&&(0!==n&&(s=s.next(()=>function(e,t){return t.store(yc).H().next(n=>{e.deleteObjectStore(yc),e.createObjectStore(yc,{keyPath:vc,autoIncrement:!0}).createIndex(wc,Ic,{unique:!0});const r=t.store(yc),i=n.map(e=>r.put(e));return Ba.waitFor(i)})}(e,i))),s=s.next(()=>{!function(e){e.createObjectStore($c,{keyPath:"clientId"})}(e)})),n<5&&r>=5&&(s=s.next(()=>this.gi(i))),n<6&&r>=6&&(s=s.next(()=>(function(e){e.createObjectStore(Rc)}(e),this.pi(i)))),n<7&&r>=7&&(s=s.next(()=>this.yi(i))),n<8&&r>=8&&(s=s.next(()=>this.wi(e,i))),n<9&&r>=9&&(s=s.next(()=>{!function(e){e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")}(e)})),n<10&&r>=10&&(s=s.next(()=>this.bi(i))),n<11&&r>=11&&(s=s.next(()=>{!function(e){e.createObjectStore(Kc,{keyPath:"bundleId"})}(e),function(e){e.createObjectStore(Gc,{keyPath:"name"})}(e)})),n<12&&r>=12&&(s=s.next(()=>{!function(e){const t=e.createObjectStore(ru,{keyPath:iu});t.createIndex(su,ou,{unique:!1}),t.createIndex(au,cu,{unique:!1})}(e)})),n<13&&r>=13&&(s=s.next(()=>function(e){const t=e.createObjectStore(Sc,{keyPath:Ac});t.createIndex(Cc,kc),t.createIndex(Nc,Dc)}(e)).next(()=>this.Si(e,i)).next(()=>e.deleteObjectStore(fc))),n<14&&r>=14&&(s=s.next(()=>this.Di(e,i))),n<15&&r>=15&&(s=s.next(()=>function(e){e.createObjectStore(Hc,{keyPath:"indexId",autoIncrement:!0}).createIndex(Wc,"collectionGroup",{unique:!1});e.createObjectStore(Qc,{keyPath:Jc}).createIndex(Yc,Xc,{unique:!1});e.createObjectStore(Zc,{keyPath:eu}).createIndex(tu,nu,{unique:!1})}(e))),n<16&&r>=16&&(s=s.next(()=>{t.objectStore(Qc).clear()}).next(()=>{t.objectStore(Zc).clear()})),n<17&&r>=17&&(s=s.next(()=>{!function(e){e.createObjectStore(uu,{keyPath:"name"})}(e)})),n<18&&r>=18&&_()&&(s=s.next(()=>{t.objectStore(Qc).clear()}).next(()=>{t.objectStore(Zc).clear()})),s}pi(e){let t=0;return e.store(fc).ee((e,n)=>{t+=Tp(n)}).next(()=>{const n={byteSize:t};return e.store(Rc).put(Pc,n)})}gi(e){const t=e.store(gc),n=e.store(yc);return t.H().next(t=>Ba.forEach(t,t=>{const r=IDBKeyRange.bound([t.userId,ic],[t.userId,t.lastAcknowledgedBatchId]);return n.H(wc,r).next(n=>Ba.forEach(n,n=>{Uo(n.userId===t.userId,18650,"Cannot process batch from unexpected user",{batchId:n.batchId});const r=Cf(this.serializer,n);return bp(e,t.userId,r).next(()=>{})}))}))}yi(e){const t=e.store(Mc),n=e.store(fc);return e.store(jc).get(qc).next(e=>{const r=[];return n.ee((n,i)=>{const s=new ua(n),o=[0,uc(s)];r.push(t.get(o).next(n=>{return n?Ba.resolve():(r=s,t.put({targetId:0,path:uc(r),sequenceNumber:e.highestListenSequenceNumber}));var r}))}).next(()=>Ba.waitFor(r))})}wi(e,t){e.createObjectStore(Bc,{keyPath:zc});const n=t.store(Bc),r=new lp,i=e=>{if(r.add(e)){const t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:uc(r)})}};return t.store(fc).ee({Y:!0},(e,t)=>{const n=new ua(e);return i(n.popLast())}).next(()=>t.store(Ec).ee({Y:!0},([e,t,n],r)=>{const s=dc(t);return i(s.popLast())}))}bi(e){const t=e.store(Oc);return t.ee((e,n)=>{const r=kf(n),i=Nf(this.serializer,r);return t.put(i)})}Si(e,t){const n=t.store(fc),r=[];return n.ee((e,n)=>{const i=t.store(Sc),s=(a=n,a.document?new da(ua.fromString(a.document.name).popFirst(5)):a.noDocument?da.fromSegments(a.noDocument.path):a.unknownDocument?da.fromSegments(a.unknownDocument.path):Fo(36783)).path.toArray(),o={prefixPath:s.slice(0,s.length-2),collectionGroup:s[s.length-2],documentId:s[s.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};var a;r.push(i.put(o))}).next(()=>Ba.waitFor(r))}Di(e,t){const n=t.store(yc),r=Kp(this.serializer),i=new um(hm.Vi,this.serializer.yt);return n.H().next(e=>{const n=new Map;return e.forEach(e=>{let t=n.get(e.userId)??Ph();Cf(this.serializer,e).keys().forEach(e=>t=t.add(e)),n.set(e.userId,t)}),Ba.forEach(n,(e,n)=>{const s=new No(n),o=Ff.wt(this.serializer,s),a=i.getIndexManager(s),c=Ep.wt(s,this.serializer,a,i.referenceDelegate);return new Zp(r,c,o,a).recalculateAndSaveOverlaysForDocumentKeys(new vu(t,rc.ce),e).next()})})}}function pm(e){e.createObjectStore(Mc,{keyPath:Fc}).createIndex(Vc,Uc,{unique:!0}),e.createObjectStore(Oc,{keyPath:"targetId"}).createIndex(xc,Lc,{unique:!0}),e.createObjectStore(jc)}const mm="IndexedDbPersistence",gm=18e5,ym=5e3,vm="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",wm="main";class Im{constructor(e,t,n,r,i,s,o,a,c,u,l=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Ci=i,this.window=s,this.document=o,this.Fi=c,this.Mi=u,this.xi=l,this.ai=null,this.ui=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Oi=null,this.inForeground=!1,this.Ni=null,this.Bi=null,this.Li=Number.NEGATIVE_INFINITY,this.ki=e=>Promise.resolve(),!Im.v())throw new Bo(jo.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new jp(this,r),this.Ki=t+wm,this.serializer=new bf(a),this.qi=new Ka(this.Ki,this.xi,new fm(this.serializer)),this.ci=new Uf,this.li=new Dp(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Kp(this.serializer),this.Pi=new xf,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,!1===u&&xo(mm,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.$i().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new Bo(jo.FAILED_PRECONDITION,vm);return this.Wi(),this.Qi(),this.Gi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.li.getHighestSequenceNumber(e))}).then(e=>{this.ai=new rc(e,this.Fi)}).then(()=>{this.ui=!0}).catch(e=>(this.qi&&this.qi.close(),Promise.reject(e)))}zi(e){return this.ki=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.qi.q(async t=>{null===t.newVersion&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Ci.enqueueAndForget(async()=>{this.started&&await this.$i()}))}$i(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>bm(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.ji(e).next(e=>{e||(this.isPrimary=!1,this.Ci.enqueueRetryable(()=>this.ki(!1)))})}).next(()=>this.Hi(e)).next(t=>this.isPrimary&&!t?this.Ji(e).next(()=>!1):!!t&&this.Zi(e).next(()=>!0))).catch(e=>{if(Qa(e))return Oo(mm,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return Oo(mm,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Ci.enqueueRetryable(()=>this.ki(e)),this.isPrimary=e})}ji(e){return _m(e).get(mc).next(e=>Ba.resolve(this.Xi(e)))}Yi(e){return bm(e).delete(this.clientId)}async es(){if(this.isPrimary&&!this.ts(this.Li,gm)){this.Li=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{const t=wu(e,$c);return t.H().next(e=>{const n=this.ns(e,gm),r=e.filter(e=>-1===n.indexOf(e));return Ba.forEach(r,e=>t.delete(e.clientId)).next(()=>r)})}).catch(()=>[]);if(this.Ui)for(const t of e)this.Ui.removeItem(this.rs(t.clientId))}}Gi(){this.Bi=this.Ci.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.$i().then(()=>this.es()).then(()=>this.Gi()))}Xi(e){return!!e&&e.ownerId===this.clientId}Hi(e){return this.Mi?Ba.resolve(!0):_m(e).get(mc).next(t=>{if(null!==t&&this.ts(t.leaseTimestampMs,ym)&&!this.ss(t.ownerId)){if(this.Xi(t)&&this.networkEnabled)return!0;if(!this.Xi(t)){if(!t.allowTabSynchronization)throw new Bo(jo.FAILED_PRECONDITION,vm);return!1}}return!(!this.networkEnabled||!this.inForeground)||bm(e).H().next(e=>void 0===this.ns(e,ym).find(e=>{if(this.clientId!==e.clientId){const t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))}).next(e=>(this.isPrimary!==e&&Oo(mm,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.ui=!1,this._s(),this.Bi&&(this.Bi.cancel(),this.Bi=null),this.us(),this.cs(),await this.qi.runTransaction("shutdown","readwrite",[pc,$c],e=>{const t=new vu(e,rc.ce);return this.Ji(t).next(()=>this.Yi(t))}),this.qi.close(),this.ls()}ns(e,t){return e.filter(e=>this.ts(e.updateTimeMs,t)&&!this.ss(e.clientId))}hs(){return this.runTransaction("getActiveClients","readonly",e=>bm(e).H().next(e=>this.ns(e,gm).map(e=>e.clientId)))}get started(){return this.ui}getGlobalsCache(){return this.ci}getMutationQueue(e,t){return Ep.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new fp(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return Ff.wt(this.serializer,e)}getBundleCache(){return this.Pi}runTransaction(e,t,n){Oo(mm,"Starting transaction:",e);const r="readonly"===t?"readonly":"readwrite",i=18===(s=this.xi)?yu:17===s?gu:16===s?mu:15===s?pu:14===s?fu:13===s?du:12===s?hu:11===s?lu:void Fo(60245);var s;let o;return this.qi.runTransaction(e,r,i,r=>(o=new vu(r,this.ai?this.ai.next():rc.ce),"readwrite-primary"===t?this.ji(o).next(e=>!!e||this.Hi(o)).next(t=>{if(!t)throw xo(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Ci.enqueueRetryable(()=>this.ki(!1)),new Bo(jo.FAILED_PRECONDITION,Ua);return n(o)}).next(e=>this.Zi(o).next(()=>e)):this.Ps(o).next(()=>n(o)))).then(e=>(o.raiseOnCommittedEvent(),e))}Ps(e){return _m(e).get(mc).next(e=>{if(null!==e&&this.ts(e.leaseTimestampMs,ym)&&!this.ss(e.ownerId)&&!this.Xi(e)&&!(this.Mi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new Bo(jo.FAILED_PRECONDITION,vm)})}Zi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return _m(e).put(mc,t)}static v(){return Ka.v()}Ji(e){const t=_m(e);return t.get(mc).next(e=>this.Xi(e)?(Oo(mm,"Releasing primary lease."),t.delete(mc)):Ba.resolve())}ts(e,t){const n=Date.now();return!(e<n-t||e>n&&(xo(`Detected an update time that is in the future: ${e} > ${n}`),1))}Wi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Ni=()=>{this.Ci.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.$i()))},this.document.addEventListener("visibilitychange",this.Ni),this.inForeground="visible"===this.document.visibilityState)}us(){this.Ni&&(this.document.removeEventListener("visibilitychange",this.Ni),this.Ni=null)}Qi(){var e;"function"==typeof(null==(e=this.window)?void 0:e.addEventListener)&&(this.Oi=()=>{this._s();const e=/(?:Version|Mobile)\/1[456]/;I()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Ci.enterRestrictedMode(!0),this.Ci.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Oi))}cs(){this.Oi&&(this.window.removeEventListener("pagehide",this.Oi),this.Oi=null)}ss(e){var t;try{const n=null!==(null==(t=this.Ui)?void 0:t.getItem(this.rs(e)));return Oo(mm,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return xo(mm,"Failed to get zombied client id.",n),!1}}_s(){if(this.Ui)try{this.Ui.setItem(this.rs(this.clientId),String(Date.now()))}catch(e){xo("Failed to set zombie client id.",e)}}ls(){if(this.Ui)try{this.Ui.removeItem(this.rs(this.clientId))}catch(e){}}rs(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function _m(e){return wu(e,pc)}function bm(e){return wu(e,$c)}function Tm(e,t){let n=e.projectId;return e.isDefaultDatabase||(n+="."+e.database),"firestore/"+t+"/"+n+"/"
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Em{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Ts=n,this.Is=r}static Es(e,t){let n=Ph(),r=Ph();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new Em(e,t.fromCache,n,r)}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sm{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Am{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=I()?8:Ga(v())>0?6:4}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,r){const i={result:null};return this.gs(e,t).next(e=>{i.result=e}).next(()=>{if(!i.result)return this.ps(e,t,r,n).next(e=>{i.result=e})}).next(()=>{if(i.result)return;const n=new Sm;return this.ys(e,t,n).next(r=>{if(i.result=r,this.As)return this.ws(e,t,n,r.size)})}).next(()=>i.result)}ws(e,t,n,r){return n.documentReadCount<this.Vs?(Po()<=U.DEBUG&&Oo("QueryEngine","SDK will not create cache indexes for query:",gh(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),Ba.resolve()):(Po()<=U.DEBUG&&Oo("QueryEngine","Query:",gh(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.ds*r?(Po()<=U.DEBUG&&Oo("QueryEngine","The SDK decides to create cache indexes for query:",gh(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,uh(t))):Ba.resolve())}gs(e,t){if(oh(t))return Ba.resolve(null);let n=uh(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(t=fh(t,null,"F"),n=uh(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{const i=Ph(...r);return this.fs.getDocuments(e,i).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{const s=this.bs(t,r);return this.Ss(t,s,i,n.readTime)?this.gs(e,fh(t,null,"F")):this.Ds(e,s,t,n)}))})))}ps(e,t,n,r){return oh(t)||r.isEqual(Aa.min())?Ba.resolve(null):this.fs.getDocuments(e,n).next(i=>{const s=this.bs(t,i);return this.Ss(t,s,n,r)?Ba.resolve(null):(Po()<=U.DEBUG&&Oo("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),gh(t)),this.Ds(e,s,t,La(r,Ca)).next(e=>e))})}bs(e,t){let n=new Cu(wh(e));return t.forEach((t,r)=>{yh(e,r)&&(n=n.add(r))}),n}Ss(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;const i="F"===e.limitType?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}ys(e,t,n){return Po()<=U.DEBUG&&Oo("QueryEngine","Using full collection scan to execute query:",gh(t)),this.fs.getDocumentsMatchingQuery(e,t,Fa.min(),n)}Ds(e,t,n,r){return this.fs.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cm="LocalStore";class km{constructor(e,t,n,r){this.persistence=e,this.Cs=t,this.serializer=r,this.vs=new Eu(ea),this.Fs=new _h(e=>Yl(e),Xl),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(n)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Zp(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.vs))}}function Nm(e,t,n,r){return new km(e,t,n,r)}async function Dm(e,t){const n=qo(e);return await n.persistence.runTransaction("Handle user change","readonly",e=>{let r;return n.mutationQueue.getAllMutationBatches(e).next(i=>(r=i,n.Os(t),n.mutationQueue.getAllMutationBatches(e))).next(t=>{const i=[],s=[];let o=Ph();for(const e of r){i.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}for(const e of t){s.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}return n.localDocuments.getDocuments(e,o).next(e=>({Ns:e,removedBatchIds:i,addedBatchIds:s}))})})}function Rm(e){const t=qo(e);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.li.getLastRemoteSnapshotVersion(e))}function Pm(e,t,n){let r=Ph(),i=Ph();return n.forEach(e=>r=r.add(e)),t.getEntries(e,r).next(e=>{let r=Th();return n.forEach((n,s)=>{const o=e.get(n);s.isFoundDocument()!==o.isFoundDocument()&&(i=i.add(n)),s.isNoDocument()&&s.version.isEqual(Aa.min())?(t.removeEntry(n,s.readTime),r=r.insert(n,s)):!o.isValidDocument()||s.version.compareTo(o.version)>0||0===s.version.compareTo(o.version)&&o.hasPendingWrites?(t.addEntry(s),r=r.insert(n,s)):Oo(Cm,"Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",s.version)}),{Bs:r,Ls:i}})}function Om(e,t){const n=qo(e);return n.persistence.runTransaction("Get next mutation batch","readonly",e=>(void 0===t&&(t=ic),n.mutationQueue.getNextMutationBatchAfterBatchId(e,t)))}function xm(e,t){const n=qo(e);return n.persistence.runTransaction("Allocate target","readwrite",e=>{let r;return n.li.getTargetData(e,t).next(i=>i?(r=i,Ba.resolve(r)):n.li.allocateTargetId(e).next(i=>(r=new _f(t,i,"TargetPurposeListen",e.currentSequenceNumber),n.li.addTargetData(e,r).next(()=>r))))}).then(e=>{const r=n.vs.get(e.targetId);return(null===r||e.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.vs=n.vs.insert(e.targetId,e),n.Fs.set(t,e.targetId)),e})}async function Lm(e,t,n){const r=qo(e),i=r.vs.get(t),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,e=>r.persistence.referenceDelegate.removeTarget(e,i))}catch(o){if(!Qa(o))throw o;Oo(Cm,`Failed to update sequence numbers for target ${t}: ${o}`)}r.vs=r.vs.remove(t),r.Fs.delete(i.target)}function Mm(e,t,n){const r=qo(e);let i=Aa.min(),s=Ph();return r.persistence.runTransaction("Execute query","readwrite",e=>function(e,t,n){const r=qo(e),i=r.Fs.get(n);return void 0!==i?Ba.resolve(r.vs.get(i)):r.li.getTargetData(t,n)}(r,e,uh(t)).next(t=>{if(t)return i=t.lastLimboFreeSnapshotVersion,r.li.getMatchingKeysForTargetId(e,t.targetId).next(e=>{s=e})}).next(()=>r.Cs.getDocumentsMatchingQuery(e,t,n?i:Aa.min(),n?s:Ph())).next(e=>(Um(r,vh(t),e),{documents:e,ks:s})))}function Fm(e,t){const n=qo(e),r=qo(n.li),i=n.vs.get(t);return i?Promise.resolve(i.target):n.persistence.runTransaction("Get target data","readonly",e=>r.At(e,t).next(e=>e?e.target:null))}function Vm(e,t){const n=qo(e),r=n.Ms.get(t)||Aa.min();return n.persistence.runTransaction("Get new document changes","readonly",e=>n.xs.getAllFromCollectionGroup(e,t,La(r,Ca),Number.MAX_SAFE_INTEGER)).then(e=>(Um(n,t,e),e))}function Um(e,t,n){let r=e.Ms.get(t)||Aa.min();n.forEach((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)}),e.Ms.set(t,r)}async function qm(e,t,n=Ph()){const r=await xm(e,uh(Df(t.bundledQuery))),i=qo(e);return i.persistence.runTransaction("Save named query","readwrite",e=>{const s=Gd(t.readTime);if(r.snapshotVersion.compareTo(s)>=0)return i.Pi.saveNamedQuery(e,t);const o=r.withResumeToken(Pu.EMPTY_BYTE_STRING,s);return i.vs=i.vs.insert(o.targetId,o),i.li.updateTargetData(e,o).next(()=>i.li.removeMatchingKeysForTargetId(e,r.targetId)).next(()=>i.li.addMatchingKeys(e,n,r.targetId)).next(()=>i.Pi.saveNamedQuery(e,t))})}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jm="firestore_clients";function Bm(e,t){return`${jm}_${e}_${t}`}const zm="firestore_mutations";function $m(e,t,n){let r=`${zm}_${e}_${n}`;return t.isAuthenticated()&&(r+=`_${t.uid}`),r}const Km="firestore_targets";function Gm(e,t){return`${Km}_${e}_${t}`}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hm="SharedClientState";class Wm{constructor(e,t,n,r){this.user=e,this.batchId=t,this.state=n,this.error=r}static $s(e,t,n){const r=JSON.parse(n);let i,s="object"==typeof r&&-1!==["pending","acknowledged","rejected"].indexOf(r.state)&&(void 0===r.error||"object"==typeof r.error);return s&&r.error&&(s="string"==typeof r.error.message&&"string"==typeof r.error.code,s&&(i=new Bo(r.error.code,r.error.message))),s?new Wm(e,t,r.state,i):(xo(Hm,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Qm{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static $s(e,t){const n=JSON.parse(t);let r,i="object"==typeof n&&-1!==["not-current","current","rejected"].indexOf(n.state)&&(void 0===n.error||"object"==typeof n.error);return i&&n.error&&(i="string"==typeof n.error.message&&"string"==typeof n.error.code,i&&(r=new Bo(n.error.code,n.error.message))),i?new Qm(e,n.state,r):(xo(Hm,`Failed to parse target state for ID '${e}': ${t}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Jm{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static $s(e,t){const n=JSON.parse(t);let r="object"==typeof n&&n.activeTargetIds instanceof Array,i=xh();for(let s=0;r&&s<n.activeTargetIds.length;++s)r=ac(n.activeTargetIds[s]),i=i.add(n.activeTargetIds[s]);return r?new Jm(e,i):(xo(Hm,`Failed to parse client data for instance '${e}': ${t}`),null)}}class Ym{constructor(e,t){this.clientId=e,this.onlineState=t}static $s(e){const t=JSON.parse(e);return"object"==typeof t&&-1!==["Unknown","Online","Offline"].indexOf(t.onlineState)&&"string"==typeof t.clientId?new Ym(t.clientId,t.onlineState):(xo(Hm,`Failed to parse online state: ${e}`),null)}}class Xm{constructor(){this.activeTargetIds=xh()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Zm{constructor(e,t,n,r,i){this.window=e,this.Ci=t,this.persistenceKey=n,this.zs=r,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.js=this.Hs.bind(this),this.Js=new Eu(ea),this.started=!1,this.Zs=[];const s=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Xs=Bm(this.persistenceKey,this.zs),this.Ys=`firestore_sequence_number_${this.persistenceKey}`,this.Js=this.Js.insert(this.zs,new Xm),this.eo=new RegExp(`^${jm}_${s}_([^_]*)$`),this.no=new RegExp(`^${zm}_${s}_(\\d+)(?:_(.*))?$`),this.ro=new RegExp(`^${Km}_${s}_(\\d+)$`),this.io=function(e){return`firestore_online_state_${e}`}(this.persistenceKey),this.so=function(e){return`firestore_bundle_loaded_v2_${e}`}(this.persistenceKey),this.window.addEventListener("storage",this.js)}static v(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.hs();for(const n of e){if(n===this.zs)continue;const e=this.getItem(Bm(this.persistenceKey,n));if(e){const t=Jm.$s(n,e);t&&(this.Js=this.Js.insert(t.clientId,t))}}this.oo();const t=this.storage.getItem(this.io);if(t){const e=this._o(t);e&&this.ao(e)}for(const n of this.Zs)this.Hs(n);this.Zs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.Ys,JSON.stringify(e))}getAllActiveQueryTargets(){return this.uo(this.Js)}isActiveQueryTarget(e){let t=!1;return this.Js.forEach((n,r)=>{r.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.co(e,"pending")}updateMutationState(e,t,n){this.co(e,t,n),this.lo(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const t=this.storage.getItem(Gm(this.persistenceKey,e));if(t){const r=Qm.$s(e,t);r&&(n=r.state)}}return t&&this.ho.Qs(e),this.oo(),n}removeLocalQueryTarget(e){this.ho.Gs(e),this.oo()}isLocalQueryTarget(e){return this.ho.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Gm(this.persistenceKey,e))}updateQueryState(e,t,n){this.Po(e,t,n)}handleUserChange(e,t,n){t.forEach(e=>{this.lo(e)}),this.currentUser=e,n.forEach(e=>{this.addPendingMutation(e)})}setOnlineState(e){this.To(e)}notifyBundleLoaded(e){this.Io(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.js),this.removeItem(this.Xs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return Oo(Hm,"READ",e,t),t}setItem(e,t){Oo(Hm,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){Oo(Hm,"REMOVE",e),this.storage.removeItem(e)}Hs(e){const t=e;if(t.storageArea===this.storage){if(Oo(Hm,"EVENT",t.key,t.newValue),t.key===this.Xs)return void xo("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Ci.enqueueRetryable(async()=>{if(this.started){if(null!==t.key)if(this.eo.test(t.key)){if(null==t.newValue){const e=this.Eo(t.key);return this.Ro(e,null)}{const e=this.Ao(t.key,t.newValue);if(e)return this.Ro(e.clientId,e)}}else if(this.no.test(t.key)){if(null!==t.newValue){const e=this.Vo(t.key,t.newValue);if(e)return this.mo(e)}}else if(this.ro.test(t.key)){if(null!==t.newValue){const e=this.fo(t.key,t.newValue);if(e)return this.po(e)}}else if(t.key===this.io){if(null!==t.newValue){const e=this._o(t.newValue);if(e)return this.ao(e)}}else if(t.key===this.Ys){const e=function(e){let t=rc.ce;if(null!=e)try{const n=JSON.parse(e);Uo("number"==typeof n,30636,{yo:e}),t=n}catch(n){xo(Hm,"Failed to read sequence number from WebStorage",n)}return t}(t.newValue);e!==rc.ce&&this.sequenceNumberHandler(e)}else if(t.key===this.so){const e=this.wo(t.newValue);await Promise.all(e.map(e=>this.syncEngine.bo(e)))}}else this.Zs.push(t)})}}get ho(){return this.Js.get(this.zs)}oo(){this.setItem(this.Xs,this.ho.Ws())}co(e,t,n){const r=new Wm(this.currentUser,e,t,n),i=$m(this.persistenceKey,this.currentUser,e);this.setItem(i,r.Ws())}lo(e){const t=$m(this.persistenceKey,this.currentUser,e);this.removeItem(t)}To(e){const t={clientId:this.zs,onlineState:e};this.storage.setItem(this.io,JSON.stringify(t))}Po(e,t,n){const r=Gm(this.persistenceKey,e),i=new Qm(e,t,n);this.setItem(r,i.Ws())}Io(e){const t=JSON.stringify(Array.from(e));this.setItem(this.so,t)}Eo(e){const t=this.eo.exec(e);return t?t[1]:null}Ao(e,t){const n=this.Eo(e);return Jm.$s(n,t)}Vo(e,t){const n=this.no.exec(e),r=Number(n[1]),i=void 0!==n[2]?n[2]:null;return Wm.$s(new No(i),r,t)}fo(e,t){const n=this.ro.exec(e),r=Number(n[1]);return Qm.$s(r,t)}_o(e){return Ym.$s(e)}wo(e){return JSON.parse(e)}async mo(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.So(e.batchId,e.state,e.error);Oo(Hm,`Ignoring mutation for non-active user ${e.user.uid}`)}po(e){return this.syncEngine.Do(e.targetId,e.state,e.error)}Ro(e,t){const n=t?this.Js.insert(e,t):this.Js.remove(e),r=this.uo(this.Js),i=this.uo(n),s=[],o=[];return i.forEach(e=>{r.has(e)||s.push(e)}),r.forEach(e=>{i.has(e)||o.push(e)}),this.syncEngine.Co(s,o).then(()=>{this.Js=n})}ao(e){this.Js.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}uo(e){let t=xh();return e.forEach((e,n)=>{t=t.unionWith(n.activeTargetIds)}),t}}class eg{constructor(){this.vo=new Xm,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,n){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new Xm,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tg{Mo(e){}shutdown(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ng="ConnectivityMonitor";class rg{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){Oo(ng,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){Oo(ng,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ig=null;function sg(){return null===ig?ig=268435456+Math.round(2147483648*Math.random()):ig++,"0x"+ig.toString(16)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const og="RestConnection",ag={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class cg{get Ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Uo=`projects/${n}/databases/${r}`,this.$o=this.databaseId.database===Ku?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Wo(e,t,n,r,i){const s=sg(),o=this.Qo(e,t.toUriEncodedString());Oo(og,`Sending RPC '${e}' ${s}:`,o,n);const a={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(a,r,i);const{host:c}=new URL(o),u=f(c);return this.zo(e,o,a,n,u).then(t=>(Oo(og,`Received RPC '${e}' ${s}: `,t),t),t=>{throw Lo(og,`RPC '${e}' ${s} failed with error: `,t,"url: ",o,"request:",n),t})}jo(e,t,n,r,i,s){return this.Wo(e,t,n,r,i)}Go(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+Do,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}Qo(e,t){const n=ag[e];let r=`${this.qo}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(r=`${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),r}terminate(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ug{constructor(e){this.Ho=e.Ho,this.Jo=e.Jo}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Jo()}send(e){this.Ho(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lg="WebChannelConnection",hg=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(t){setTimeout(()=>{throw t},0)}})};class dg extends cg{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!dg.c_){const e=Ao();hg(e,So.STAT_EVENT,e=>{e.stat===Eo.PROXY?Oo(lg,"STAT_EVENT: detected buffering proxy"):e.stat===Eo.NOPROXY&&Oo(lg,"STAT_EVENT: detected no buffering proxy")}),dg.c_=!0}}zo(e,t,n,r,i){const s=sg();return new Promise((i,o)=>{const a=new Io;a.setWithCredentials(!0),a.listenOnce(bo.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case To.NO_ERROR:const t=a.getResponseJson();Oo(lg,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(t)),i(t);break;case To.TIMEOUT:Oo(lg,`RPC '${e}' ${s} timed out`),o(new Bo(jo.DEADLINE_EXCEEDED,"Request time out"));break;case To.HTTP_ERROR:const n=a.getStatus();if(Oo(lg,`RPC '${e}' ${s} failed with status:`,n,"response text:",a.getResponseText()),n>0){let e=a.getResponseJson();Array.isArray(e)&&(e=e[0]);const t=null==e?void 0:e.error;if(t&&t.status&&t.message){const e=function(e){const t=e.toLowerCase().replace(/_/g,"-");return Object.values(jo).indexOf(t)>=0?t:jo.UNKNOWN}(t.status);o(new Bo(e,t.message))}else o(new Bo(jo.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new Bo(jo.UNAVAILABLE,"Connection failed."));break;default:Fo(9055,{l_:e,streamId:s,h_:a.getLastErrorCode(),P_:a.getLastError()})}}finally{Oo(lg,`RPC '${e}' ${s} completed.`)}});const c=JSON.stringify(r);Oo(lg,`RPC '${e}' ${s} sending request:`,r),a.send(t,"POST",c,n,15)})}T_(e,t,n){const r=sg(),i=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],s=this.createWebChannelTransport(),o={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},a=this.longPollingOptions.timeoutSeconds;void 0!==a&&(o.longPollingTimeout=Math.round(1e3*a)),this.useFetchStreams&&(o.useFetchStreams=!0),this.Go(o.initMessageHeaders,t,n),o.encodeInitMessageHeaders=!0;const c=i.join("");Oo(lg,`Creating RPC '${e}' stream ${r}: ${c}`,o);const u=s.createWebChannel(c,o);this.I_(u);let l=!1,h=!1;const d=new ug({Ho:t=>{h?Oo(lg,`Not sending because RPC '${e}' stream ${r} is closed:`,t):(l||(Oo(lg,`Opening RPC '${e}' stream ${r} transport.`),u.open(),l=!0),Oo(lg,`RPC '${e}' stream ${r} sending:`,t),u.send(t))},Jo:()=>u.close()});return hg(u,_o.EventType.OPEN,()=>{h||(Oo(lg,`RPC '${e}' stream ${r} transport opened.`),d.i_())}),hg(u,_o.EventType.CLOSE,()=>{h||(h=!0,Oo(lg,`RPC '${e}' stream ${r} transport closed`),d.o_(),this.E_(u))}),hg(u,_o.EventType.ERROR,t=>{h||(h=!0,Lo(lg,`RPC '${e}' stream ${r} transport errored. Name:`,t.name,"Message:",t.message),d.o_(new Bo(jo.UNAVAILABLE,"The operation could not be completed")))}),hg(u,_o.EventType.MESSAGE,t=>{var n;if(!h){const i=t.data[0];Uo(!!i,16349);const s=i,o=(null==s?void 0:s.error)||(null==(n=s[0])?void 0:n.error);if(o){Oo(lg,`RPC '${e}' stream ${r} received error:`,o);const t=o.status;let n=function(e){const t=vd[e];if(void 0!==t)return _d(t)}(t),i=o.message;"NOT_FOUND"===t&&i.includes("database")&&i.includes("does not exist")&&i.includes(this.databaseId.database)&&Lo(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),void 0===n&&(n=jo.INTERNAL,i="Unknown error status: "+t+" with message "+o.message),h=!0,d.o_(new Bo(n,i)),u.close()}else Oo(lg,`RPC '${e}' stream ${r} received:`,i),d.__(i)}}),dg.u_(),setTimeout(()=>{d.s_()},0),d}terminate(){this.a_.forEach(e=>e.close()),this.a_=[]}I_(e){this.a_.push(e)}E_(e){this.a_=this.a_.filter(t=>t===e)}Go(e,t,n){super.Go(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Co()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function fg(){return"undefined"!=typeof window?window:null}function pg(){return"undefined"!=typeof document?document:null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mg(e){return new jd(e,!0)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */dg.c_=!1;class gg{constructor(e,t,n=1e3,r=1.5,i=6e4){this.Ci=e,this.timerId=t,this.R_=n,this.A_=r,this.V_=i,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),n=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-n);r>0&&Oo("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,r,()=>(this.f_=Date.now(),e())),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){null!==this.m_&&(this.m_.skipDelay(),this.m_=null)}cancel(){null!==this.m_&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yg="PersistentStream";class vg{constructor(e,t,n,r,i,s,o,a){this.Ci=e,this.b_=n,this.S_=r,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new gg(e,t)}x_(){return 1===this.state||5===this.state||this.O_()}O_(){return 2===this.state||3===this.state}start(){this.F_=0,4!==this.state?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&null===this.C_&&(this.C_=this.Ci.enqueueAfterDelay(this.b_,6e4,()=>this.k_()))}K_(e){this.q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.U_(),this.M_.cancel(),this.D_++,4!==e?this.M_.reset():t&&t.code===jo.RESOURCE_EXHAUSTED?(xo(t.toString()),xo("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===jo.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.D_===t&&this.G_(e,n)},t=>{e(()=>{const e=new Bo(jo.UNKNOWN,"Fetching auth token failed: "+t.message);return this.z_(e)})})}G_(e,t){const n=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo(()=>{n(()=>this.listener.Zo())}),this.stream.Yo(()=>{n(()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.S_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.Yo()))}),this.stream.t_(e=>{n(()=>this.z_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.F_?this.H_(e):this.onNext(e))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return Oo(yg,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget(()=>this.D_===e?t():(Oo(yg,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class wg extends vg{constructor(e,t,n,r,i,s){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}H_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=function(e,t){let n;if("targetChange"in t){t.targetChange;const i="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:Fo(39313,{state:r}),s=t.targetChange.targetIds||[],o=function(e,t){return e.useProto3Json?(Uo(void 0===t||"string"==typeof t,58123),Pu.fromBase64String(t||"")):(Uo(void 0===t||t instanceof Buffer||t instanceof Uint8Array,16193),Pu.fromUint8Array(t||new Uint8Array))}(e,t.targetChange.resumeToken),a=t.targetChange.cause,c=a&&function(e){const t=void 0===e.code?jo.UNKNOWN:_d(e.code);return new Bo(t,e.message||"")}(a);n=new Od(i,s,o,c||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const i=Yd(e,r.document.name),s=Gd(r.document.updateTime),o=r.document.createTime?Gd(r.document.createTime):Aa.min(),a=new bl({mapValue:{fields:r.document.fields}}),c=El.newFoundDocument(i,s,o,a),u=r.targetIds||[],l=r.removedTargetIds||[];n=new Rd(u,l,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const i=Yd(e,r.document),s=r.readTime?Gd(r.readTime):Aa.min(),o=El.newNoDocument(i,s),a=r.removedTargetIds||[];n=new Rd([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const i=Yd(e,r.document),s=r.removedTargetIds||[];n=new Rd([],s,i,null)}else{if(!("filter"in t))return Fo(11601,{Vt:t});{t.filter;const e=t.filter;e.targetId;const{count:r=0,unchangedNames:i}=e,s=new yd(r,i),o=e.targetId;n=new Pd(o,s)}}var r;return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return Aa.min();const t=e.targetChange;return t.targetIds&&t.targetIds.length?Aa.min():t.readTime?Gd(t.readTime):Aa.min()}(e);return this.listener.J_(t,n)}Z_(e){const t={};t.database=ef(this.serializer),t.addTarget=function(e,t){let n;const r=t.target;if(n=Zl(r)?{documents:af(e,r)}:{query:cf(e,r).ft},n.targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=$d(e,t.resumeToken);const r=Bd(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(Aa.min())>0){n.readTime=zd(e,t.snapshotVersion.toTimestamp());const r=Bd(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);const n=function(e,t){const n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Fo(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.K_(t)}X_(e){const t={};t.database=ef(this.serializer),t.removeTarget=e,this.K_(t)}}class Ig extends vg{constructor(e,t,n,r,i,s){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}H_(e){return Uo(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Uo(!e.writeResults||0===e.writeResults.length,55816),this.listener.ta()}onNext(e){Uo(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=function(e,t){return e&&e.length>0?(Uo(void 0!==t,14353),e.map(e=>function(e,t){let n=e.updateTime?Gd(e.updateTime):Gd(t);return n.isEqual(Aa.min())&&(n=Gd(t)),new Yh(n,e.transformResults||[])}(e,t))):[]}(e.writeResults,e.commitTime),n=Gd(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=ef(this.serializer),this.K_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map(e=>sf(this.serializer,e))};this.K_(t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _g{}class bg extends _g{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new Bo(jo.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Wo(e,Wd(t,n),r,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===jo.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Bo(jo.UNKNOWN,e.toString())})}jo(e,t,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.jo(e,Wd(t,n),r,s,o,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===jo.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Bo(jo.UNKNOWN,e.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class Tg{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){0===this.oa&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){"Online"===this.state?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,"Online"===e&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(xo(t),this.aa=!1):Oo("OnlineStateTracker",t)}Pa(){null!==this._a&&(this._a.cancel(),this._a=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eg="RemoteStore";class Sg{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.Ra=[],this.Aa=i,this.Aa.Mo(e=>{n.enqueueAndForget(async()=>{xg(this)&&(Oo(Eg,"Restarting streams for network reachability change."),await async function(e){const t=qo(e);t.Ea.add(4),await Cg(t),t.Va.set("Unknown"),t.Ea.delete(4),await Ag(t)}(this))})}),this.Va=new Tg(n,r)}}async function Ag(e){if(xg(e))for(const t of e.Ra)await t(!0)}async function Cg(e){for(const t of e.Ra)await t(!1)}function kg(e,t){const n=qo(e);n.Ia.has(t.targetId)||(n.Ia.set(t.targetId,t),Og(n)?Pg(n):Zg(n).O_()&&Dg(n,t))}function Ng(e,t){const n=qo(e),r=Zg(n);n.Ia.delete(t),r.O_()&&Rg(n,t),0===n.Ia.size&&(r.O_()?r.L_():xg(n)&&n.Va.set("Unknown"))}function Dg(e,t){if(e.da.$e(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(Aa.min())>0){const n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}Zg(e).Z_(t)}function Rg(e,t){e.da.$e(t),Zg(e).X_(t)}function Pg(e){e.da=new Ld({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),At:t=>e.Ia.get(t)||null,ht:()=>e.datastore.serializer.databaseId}),Zg(e).start(),e.Va.ua()}function Og(e){return xg(e)&&!Zg(e).x_()&&e.Ia.size>0}function xg(e){return 0===qo(e).Ea.size}function Lg(e){e.da=void 0}async function Mg(e){e.Va.set("Online")}async function Fg(e){e.Ia.forEach((t,n)=>{Dg(e,t)})}async function Vg(e,t){Lg(e),Og(e)?(e.Va.ha(t),Pg(e)):e.Va.set("Unknown")}async function Ug(e,t,n){if(e.Va.set("Online"),t instanceof Od&&2===t.state&&t.cause)try{await async function(e,t){const n=t.cause;for(const r of t.targetIds)e.Ia.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e.Ia.delete(r),e.da.removeTarget(r))}(e,t)}catch(r){Oo(Eg,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await qg(e,r)}else if(t instanceof Rd?e.da.Xe(t):t instanceof Pd?e.da.st(t):e.da.tt(t),!n.isEqual(Aa.min()))try{const t=await Rm(e.localStore);n.compareTo(t)>=0&&await function(e,t){const n=e.da.Tt(t);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const i=e.Ia.get(r);i&&e.Ia.set(r,i.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{const r=e.Ia.get(t);if(!r)return;e.Ia.set(t,r.withResumeToken(Pu.EMPTY_BYTE_STRING,r.snapshotVersion)),Rg(e,t);const i=new _f(r.target,t,n,r.sequenceNumber);Dg(e,i)}),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(i){Oo(Eg,"Failed to raise snapshot:",i),await qg(e,i)}}async function qg(e,t,n){if(!Qa(t))throw t;e.Ea.add(1),await Cg(e),e.Va.set("Offline"),n||(n=()=>Rm(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{Oo(Eg,"Retrying IndexedDB access"),await n(),e.Ea.delete(1),await Ag(e)})}function jg(e,t){return t().catch(n=>qg(e,n,t))}async function Bg(e){const t=qo(e),n=ey(t);let r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:ic;for(;zg(t);)try{const e=await Om(t.localStore,r);if(null===e){0===t.Ta.length&&n.L_();break}r=e.batchId,$g(t,e)}catch(i){await qg(t,i)}Kg(t)&&Gg(t)}function zg(e){return xg(e)&&e.Ta.length<10}function $g(e,t){e.Ta.push(t);const n=ey(e);n.O_()&&n.Y_&&n.ea(t.mutations)}function Kg(e){return xg(e)&&!ey(e).x_()&&e.Ta.length>0}function Gg(e){ey(e).start()}async function Hg(e){ey(e).ra()}async function Wg(e){const t=ey(e);for(const n of e.Ta)t.ea(n.mutations)}async function Qg(e,t,n){const r=e.Ta.shift(),i=pd.from(r,t,n);await jg(e,()=>e.remoteSyncer.applySuccessfulWrite(i)),await Bg(e)}async function Jg(e,t){t&&ey(e).Y_&&await async function(e,t){if(Id(n=t.code)&&n!==jo.ABORTED){const n=e.Ta.shift();ey(e).B_(),await jg(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await Bg(e)}var n}(e,t),Kg(e)&&Gg(e)}async function Yg(e,t){const n=qo(e);n.asyncQueue.verifyOperationInProgress(),Oo(Eg,"RemoteStore received new credentials");const r=xg(n);n.Ea.add(3),await Cg(n),r&&n.Va.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.Ea.delete(3),await Ag(n)}async function Xg(e,t){const n=qo(e);t?(n.Ea.delete(2),await Ag(n)):t||(n.Ea.add(2),await Cg(n),n.Va.set("Unknown"))}function Zg(e){return e.ma||(e.ma=function(e,t,n){const r=qo(e);return r.sa(),new wg(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Zo:Mg.bind(null,e),Yo:Fg.bind(null,e),t_:Vg.bind(null,e),J_:Ug.bind(null,e)}),e.Ra.push(async t=>{t?(e.ma.B_(),Og(e)?Pg(e):e.Va.set("Unknown")):(await e.ma.stop(),Lg(e))})),e.ma}function ey(e){return e.fa||(e.fa=function(e,t,n){const r=qo(e);return r.sa(),new Ig(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Zo:()=>Promise.resolve(),Yo:Hg.bind(null,e),t_:Jg.bind(null,e),ta:Wg.bind(null,e),na:Qg.bind(null,e)}),e.Ra.push(async t=>{t?(e.fa.B_(),await Bg(e)):(await e.fa.stop(),e.Ta.length>0&&(Oo(Eg,`Stopping write stream with ${e.Ta.length} pending writes`),e.Ta=[]))})),e.fa
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class ty{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new zo,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,i){const s=Date.now()+n,o=new ty(e,t,s,r,i);return o.start(n),o}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new Bo(jo.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ny(e,t){if(xo("AsyncQueue",`${t}: ${e}`),Qa(e))return new Bo(jo.UNAVAILABLE,`${t}: ${e}`);throw e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ry{static emptySet(e){return new ry(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||da.comparator(t.key,n.key):(e,t)=>da.comparator(e.key,t.key),this.keyedMap=Sh(),this.sortedSet=new Eu(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof ry))return!1;if(this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){const n=new ry;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iy{constructor(){this.ga=new Eu(da.comparator)}track(e){const t=e.doc.key,n=this.ga.get(t);n?0!==e.type&&3===n.type?this.ga=this.ga.insert(t,e):3===e.type&&1!==n.type?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.ga=this.ga.remove(t):1===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):Fo(63341,{Vt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal((t,n)=>{e.push(n)}),e}}class sy{constructor(e,t,n,r,i,s,o,a,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,r,i){const s=[];return t.forEach(e=>{s.push({type:0,doc:e})}),new sy(e,t,ry.emptySet(t),s,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ph(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==n[r].type||!t[r].doc.isEqual(n[r].doc))return!1;return!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oy{constructor(){this.wa=void 0,this.ba=[]}Sa(){return this.ba.some(e=>e.Da())}}class ay{constructor(){this.queries=cy(),this.onlineState="Unknown",this.Ca=new Set}terminate(){!function(e,t){const n=qo(e),r=n.queries;n.queries=cy(),r.forEach((e,n)=>{for(const r of n.ba)r.onError(t)})}(this,new Bo(jo.ABORTED,"Firestore shutting down"))}}function cy(){return new _h(e=>mh(e),ph)}async function uy(e,t){const n=qo(e);let r=3;const i=t.query;let s=n.queries.get(i);s?!s.Sa()&&t.Da()&&(r=2):(s=new oy,r=t.Da()?0:1);try{switch(r){case 0:s.wa=await n.onListen(i,!0);break;case 1:s.wa=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const e=ny(o,`Initialization of query '${gh(t.query)}' failed`);return void t.onError(e)}n.queries.set(i,s),s.ba.push(t),t.va(n.onlineState),s.wa&&t.Fa(s.wa)&&fy(n)}async function ly(e,t){const n=qo(e),r=t.query;let i=3;const s=n.queries.get(r);if(s){const e=s.ba.indexOf(t);e>=0&&(s.ba.splice(e,1),0===s.ba.length?i=t.Da()?0:1:!s.Sa()&&t.Da()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function hy(e,t){const n=qo(e);let r=!1;for(const i of t){const e=i.query,t=n.queries.get(e);if(t){for(const e of t.ba)e.Fa(i)&&(r=!0);t.wa=i}}r&&fy(n)}function dy(e,t,n){const r=qo(e),i=r.queries.get(t);if(i)for(const s of i.ba)s.onError(n);r.queries.delete(t)}function fy(e){e.Ca.forEach(e=>{e.next()})}var py,my;(my=py||(py={})).Ma="default",my.Cache="cache";class gy{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){const t=[];for(const n of e.docChanges)3!==n.type&&t.push(n);e=new sy(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache)return!0;if(!this.Da())return!0;const n="Offline"!==t;return(!this.options.Ka||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}ka(e){e=sy.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==py.Cache}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yy{constructor(e,t){this.qa=e,this.byteLength=t}Ua(){return"metadata"in this.qa}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vy{constructor(e){this.serializer=e}Ks(e){return Yd(this.serializer,e)}qs(e){return e.metadata.exists?rf(this.serializer,e.document,!1):El.newNoDocument(this.Ks(e.metadata.name),this.Us(e.metadata.readTime))}Us(e){return Gd(e)}}class wy{constructor(e,t){this.$a=e,this.serializer=t,this.Wa=[],this.Qa=[],this.collectionGroups=new Set,this.progress=Iy(e)}get queries(){return this.Wa}get documents(){return this.Qa}Ga(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.qa.namedQuery)this.Wa.push(e.qa.namedQuery);else if(e.qa.documentMetadata){this.Qa.push({metadata:e.qa.documentMetadata}),e.qa.documentMetadata.exists||++t;const n=ua.fromString(e.qa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.qa.document&&(this.Qa[this.Qa.length-1].document=e.qa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,{...this.progress}):null}za(e){const t=new Map,n=new vy(this.serializer);for(const r of e)if(r.metadata.queries){const e=n.Ks(r.metadata.name);for(const n of r.metadata.queries){const r=(t.get(n)||Ph()).add(e);t.set(n,r)}}return t}async ja(e){const t=await async function(e,t,n,r){const i=qo(e);let s=Ph(),o=Th();for(const l of n){const e=t.Ks(l.metadata.name);l.document&&(s=s.add(e));const n=t.qs(l);n.setReadTime(t.Us(l.metadata.readTime)),o=o.insert(e,n)}const a=i.xs.newChangeBuffer({trackRemovals:!0}),c=await xm(i,(u=r,uh(sh(ua.fromString(`__bundle__/docs/${u}`)))));var u;return i.persistence.runTransaction("Apply bundle documents","readwrite",e=>Pm(e,a,o).next(t=>(a.apply(e),t)).next(t=>i.li.removeMatchingKeysForTargetId(e,c.targetId).next(()=>i.li.addMatchingKeys(e,s,c.targetId)).next(()=>i.localDocuments.getLocalViewOfDocuments(e,t.Bs,t.Ls)).next(()=>t.Bs)))}(e,new vy(this.serializer),this.Qa,this.$a.id),n=this.za(this.documents);for(const r of this.Wa)await qm(e,r,n.get(r.name));return this.progress.taskState="Success",{progress:this.progress,Ha:this.collectionGroups,Ja:t}}}function Iy(e){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:e.totalDocuments,totalBytes:e.totalBytes}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _y{constructor(e){this.key=e}}class by{constructor(e){this.key=e}}class Ty{constructor(e,t){this.query=e,this.Za=t,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=Ph(),this.mutatedKeys=Ph(),this.eu=wh(e),this.tu=new ry(this.eu)}get nu(){return this.Za}ru(e,t){const n=t?t.iu:new iy,r=t?t.tu:this.tu;let i=t?t.mutatedKeys:this.mutatedKeys,s=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,c="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{const u=r.get(e),l=yh(this.query,t)?t:null,h=!!u&&this.mutatedKeys.has(u.key),d=!!l&&(l.hasLocalMutations||this.mutatedKeys.has(l.key)&&l.hasCommittedMutations);let f=!1;u&&l?u.data.isEqual(l.data)?h!==d&&(n.track({type:3,doc:l}),f=!0):this.su(u,l)||(n.track({type:2,doc:l}),f=!0,(a&&this.eu(l,a)>0||c&&this.eu(l,c)<0)&&(o=!0)):!u&&l?(n.track({type:0,doc:l}),f=!0):u&&!l&&(n.track({type:1,doc:u}),f=!0,(a||c)&&(o=!0)),f&&(l?(s=s.add(l),i=d?i.add(e):i.delete(e)):(s=s.delete(e),i=i.delete(e)))}),null!==this.query.limit)for(;s.size>this.query.limit;){const e="F"===this.query.limitType?s.last():s.first();s=s.delete(e.key),i=i.delete(e.key),n.track({type:1,doc:e})}return{tu:s,iu:n,Ss:o,mutatedKeys:i}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){const i=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const s=e.iu.ya();s.sort((e,t)=>function(e,t){const n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Fo(20277,{Vt:e})}};return n(e)-n(t)}(e.type,t.type)||this.eu(e.doc,t.doc)),this.ou(n),r=r??!1;const o=t&&!r?this._u():[],a=0===this.Ya.size&&this.current&&!r?1:0,c=a!==this.Xa;return this.Xa=a,0!==s.length||c?{snapshot:new sy(this.query,e.tu,i,s,e.mutatedKeys,0===a,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:o}:{au:o}}va(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({tu:this.tu,iu:new iy,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(e=>this.Za=this.Za.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.Za=this.Za.delete(e)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=Ph(),this.tu.forEach(e=>{this.uu(e.key)&&(this.Ya=this.Ya.add(e.key))});const t=[];return e.forEach(e=>{this.Ya.has(e)||t.push(new by(e))}),this.Ya.forEach(n=>{e.has(n)||t.push(new _y(n))}),t}cu(e){this.Za=e.ks,this.Ya=Ph();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return sy.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,0===this.Xa,this.hasCachedResults)}}const Ey="SyncEngine";class Sy{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Ay{constructor(e){this.key=e,this.hu=!1}}class Cy{constructor(e,t,n,r,i,s){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.Pu={},this.Tu=new _h(e=>mh(e),ph),this.Iu=new Map,this.Eu=new Set,this.Ru=new Eu(da.comparator),this.Au=new Map,this.Vu=new rm,this.du={},this.mu=new Map,this.fu=Np.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return!0===this.gu}}async function ky(e,t,n=!0){const r=rv(e);let i;const s=r.Tu.get(t);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.lu()):i=await Dy(r,t,n,!0),i}async function Ny(e,t){const n=rv(e);await Dy(n,t,!0,!1)}async function Dy(e,t,n,r){const i=await xm(e.localStore,uh(t)),s=i.targetId,o=e.sharedClientState.addLocalQueryTarget(s,n);let a;return r&&(a=await Ry(e,t,s,"current"===o,i.resumeToken)),e.isPrimaryClient&&n&&kg(e.remoteStore,i),a}async function Ry(e,t,n,r,i){e.pu=(t,n,r)=>async function(e,t,n,r){let i=t.view.ru(n);i.Ss&&(i=await Mm(e.localStore,t.query,!1).then(({documents:e})=>t.view.ru(e,i)));const s=r&&r.targetChanges.get(t.targetId),o=r&&null!=r.targetMismatches.get(t.targetId),a=t.view.applyChanges(i,e.isPrimaryClient,s,o);return zy(e,t.targetId,a.au),a.snapshot}(e,t,n,r);const s=await Mm(e.localStore,t,!0),o=new Ty(t,s.ks),a=o.ru(s.documents),c=Dd.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,i),u=o.applyChanges(a,e.isPrimaryClient,c);zy(e,n,u.au);const l=new Sy(t,n,o);return e.Tu.set(t,l),e.Iu.has(n)?e.Iu.get(n).push(t):e.Iu.set(n,[t]),u.snapshot}async function Py(e,t,n){const r=qo(e),i=r.Tu.get(t),s=r.Iu.get(i.targetId);if(s.length>1)return r.Iu.set(i.targetId,s.filter(e=>!ph(e,t))),void r.Tu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Lm(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&Ng(r.remoteStore,i.targetId),jy(r,i.targetId)}).catch(ja)):(jy(r,i.targetId),await Lm(r.localStore,i.targetId,!0))}async function Oy(e,t){const n=qo(e),r=n.Tu.get(t),i=n.Iu.get(r.targetId);n.isPrimaryClient&&1===i.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Ng(n.remoteStore,r.targetId))}async function xy(e,t){const n=qo(e);try{const e=await function(e,t){const n=qo(e),r=t.snapshotVersion;let i=n.vs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",e=>{const s=n.xs.newChangeBuffer({trackRemovals:!0});i=n.vs;const o=[];t.targetChanges.forEach((s,a)=>{const c=i.get(a);if(!c)return;o.push(n.li.removeMatchingKeys(e,s.removedDocuments,a).next(()=>n.li.addMatchingKeys(e,s.addedDocuments,a)));let u=c.withSequenceNumber(e.currentSequenceNumber);var l,h,d;null!==t.targetMismatches.get(a)?u=u.withResumeToken(Pu.EMPTY_BYTE_STRING,Aa.min()).withLastLimboFreeSnapshotVersion(Aa.min()):s.resumeToken.approximateByteSize()>0&&(u=u.withResumeToken(s.resumeToken,r)),i=i.insert(a,u),h=u,d=s,(0===(l=c).resumeToken.approximateByteSize()||h.snapshotVersion.toMicroseconds()-l.snapshotVersion.toMicroseconds()>=3e8||d.addedDocuments.size+d.modifiedDocuments.size+d.removedDocuments.size>0)&&o.push(n.li.updateTargetData(e,u))});let a=Th(),c=Ph();if(t.documentUpdates.forEach(r=>{t.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(e,r))}),o.push(Pm(e,s,t.documentUpdates).next(e=>{a=e.Bs,c=e.Ls})),!r.isEqual(Aa.min())){const t=n.li.getLastRemoteSnapshotVersion(e).next(t=>n.li.setTargetsMetadata(e,e.currentSequenceNumber,r));o.push(t)}return Ba.waitFor(o).next(()=>s.apply(e)).next(()=>n.localDocuments.getLocalViewOfDocuments(e,a,c)).next(()=>a)}).then(e=>(n.vs=i,e))}(n.localStore,t);t.targetChanges.forEach((e,t)=>{const r=n.Au.get(t);r&&(Uo(e.addedDocuments.size+e.modifiedDocuments.size+e.removedDocuments.size<=1,22616),e.addedDocuments.size>0?r.hu=!0:e.modifiedDocuments.size>0?Uo(r.hu,14607):e.removedDocuments.size>0&&(Uo(r.hu,42227),r.hu=!1))}),await Gy(n,e,t)}catch(r){await ja(r)}}function Ly(e,t,n){const r=qo(e);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const e=[];r.Tu.forEach((n,r)=>{const i=r.view.va(t);i.snapshot&&e.push(i.snapshot)}),function(e,t){const n=qo(e);n.onlineState=t;let r=!1;n.queries.forEach((e,n)=>{for(const i of n.ba)i.va(t)&&(r=!0)}),r&&fy(n)}(r.eventManager,t),e.length&&r.Pu.J_(e),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function My(e,t,n){const r=qo(e);r.sharedClientState.updateQueryState(t,"rejected",n);const i=r.Au.get(t),s=i&&i.key;if(s){let e=new Eu(da.comparator);e=e.insert(s,El.newNoDocument(s,Aa.min()));const n=Ph().add(s),i=new Nd(Aa.min(),new Map,new Eu(ea),e,n);await xy(r,i),r.Ru=r.Ru.remove(s),r.Au.delete(t),Ky(r)}else await Lm(r.localStore,t,!1).then(()=>jy(r,t,n)).catch(ja)}async function Fy(e,t){const n=qo(e),r=t.batch.batchId;try{const e=await function(e,t){const n=qo(e);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{const r=t.batch.keys(),i=n.xs.newChangeBuffer({trackRemovals:!0});return function(e,t,n,r){const i=n.batch,s=i.keys();let o=Ba.resolve();return s.forEach(e=>{o=o.next(()=>r.getEntry(t,e)).next(t=>{const s=n.docVersions.get(e);Uo(null!==s,48541),t.version.compareTo(s)<0&&(i.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),o.next(()=>e.mutationQueue.removeMutationBatch(t,i))}(n,e,t,i).next(()=>i.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=Ph();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))})}(n.localStore,t);qy(n,r,null),Uy(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Gy(n,e)}catch(i){await ja(i)}}async function Vy(e,t,n){const r=qo(e);try{const e=await function(e,t){const n=qo(e);return n.persistence.runTransaction("Reject batch","readwrite-primary",e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next(t=>(Uo(null!==t,37113),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t))).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r)).next(()=>n.localDocuments.getDocuments(e,r))})}(r.localStore,t);qy(r,t,n),Uy(r,t),r.sharedClientState.updateMutationState(t,"rejected",n),await Gy(r,e)}catch(i){await ja(i)}}function Uy(e,t){(e.mu.get(t)||[]).forEach(e=>{e.resolve()}),e.mu.delete(t)}function qy(e,t,n){const r=qo(e);let i=r.du[r.currentUser.toKey()];if(i){const e=i.get(t);e&&(n?e.reject(n):e.resolve(),i=i.remove(t)),r.du[r.currentUser.toKey()]=i}}function jy(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(const r of e.Iu.get(t))e.Tu.delete(r),n&&e.Pu.yu(r,n);e.Iu.delete(t),e.isPrimaryClient&&e.Vu.Gr(t).forEach(t=>{e.Vu.containsKey(t)||By(e,t)})}function By(e,t){e.Eu.delete(t.path.canonicalString());const n=e.Ru.get(t);null!==n&&(Ng(e.remoteStore,n),e.Ru=e.Ru.remove(t),e.Au.delete(n),Ky(e))}function zy(e,t,n){for(const r of n)r instanceof _y?(e.Vu.addReference(r.key,t),$y(e,r)):r instanceof by?(Oo(Ey,"Document no longer in limbo: "+r.key),e.Vu.removeReference(r.key,t),e.Vu.containsKey(r.key)||By(e,r.key)):Fo(19791,{wu:r})}function $y(e,t){const n=t.key,r=n.path.canonicalString();e.Ru.get(n)||e.Eu.has(r)||(Oo(Ey,"New document in limbo: "+n),e.Eu.add(r),Ky(e))}function Ky(e){for(;e.Eu.size>0&&e.Ru.size<e.maxConcurrentLimboResolutions;){const t=e.Eu.values().next().value;e.Eu.delete(t);const n=new da(ua.fromString(t)),r=e.fu.next();e.Au.set(r,new Ay(n)),e.Ru=e.Ru.insert(n,r),kg(e.remoteStore,new _f(uh(sh(n.path)),r,"TargetPurposeLimboResolution",rc.ce))}}async function Gy(e,t,n){const r=qo(e),i=[],s=[],o=[];r.Tu.isEmpty()||(r.Tu.forEach((e,a)=>{o.push(r.pu(a,t,n).then(e=>{var t;if((e||n)&&r.isPrimaryClient){const i=e?!e.fromCache:null==(t=null==n?void 0:n.targetChanges.get(a.targetId))?void 0:t.current;r.sharedClientState.updateQueryState(a.targetId,i?"current":"not-current")}if(e){i.push(e);const t=Em.Es(a.targetId,e);s.push(t)}}))}),await Promise.all(o),r.Pu.J_(i),await async function(e,t){const n=qo(e);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",e=>Ba.forEach(t,t=>Ba.forEach(t.Ts,r=>n.persistence.referenceDelegate.addReference(e,t.targetId,r)).next(()=>Ba.forEach(t.Is,r=>n.persistence.referenceDelegate.removeReference(e,t.targetId,r)))))}catch(r){if(!Qa(r))throw r;Oo(Cm,"Failed to update sequence numbers: "+r)}for(const i of t){const e=i.targetId;if(!i.fromCache){const t=n.vs.get(e),r=t.snapshotVersion,i=t.withLastLimboFreeSnapshotVersion(r);n.vs=n.vs.insert(e,i)}}}(r.localStore,s))}async function Hy(e,t){const n=qo(e);if(!n.currentUser.isEqual(t)){Oo(Ey,"User change. New user:",t.toKey());const e=await Dm(n.localStore,t);n.currentUser=t,i="'waitForPendingWrites' promise is rejected due to a user change.",(r=n).mu.forEach(e=>{e.forEach(e=>{e.reject(new Bo(jo.CANCELLED,i))})}),r.mu.clear(),n.sharedClientState.handleUserChange(t,e.removedBatchIds,e.addedBatchIds),await Gy(n,e.Ns)}var r,i}function Wy(e,t){const n=qo(e),r=n.Au.get(t);if(r&&r.hu)return Ph().add(r.key);{let e=Ph();const r=n.Iu.get(t);if(!r)return e;for(const t of r){const r=n.Tu.get(t);e=e.unionWith(r.view.nu)}return e}}async function Qy(e,t){const n=qo(e),r=await Mm(n.localStore,t.query,!0),i=t.view.cu(r);return n.isPrimaryClient&&zy(n,t.targetId,i.au),i}async function Jy(e,t){const n=qo(e);return Vm(n.localStore,t).then(e=>Gy(n,e))}async function Yy(e,t,n,r){const i=qo(e),s=await function(e,t){const n=qo(e),r=qo(n.mutationQueue);return n.persistence.runTransaction("Lookup mutation documents","readonly",e=>r.Xn(e,t).next(t=>t?n.localDocuments.getDocuments(e,t):Ba.resolve(null)))}(i.localStore,t);var o,a;null!==s?("pending"===n?await Bg(i.remoteStore):"acknowledged"===n||"rejected"===n?(qy(i,t,r||null),Uy(i,t),o=i.localStore,a=t,qo(qo(o).mutationQueue).nr(a)):Fo(6720,"Unknown batchState",{bu:n}),await Gy(i,s)):Oo(Ey,"Cannot apply mutation batch with id: "+t)}async function Xy(e,t,n){const r=qo(e),i=[],s=[];for(const o of t){let e;const t=r.Iu.get(o);if(t&&0!==t.length){e=await xm(r.localStore,uh(t[0]));for(const e of t){const t=r.Tu.get(e),n=await Qy(r,t);n.snapshot&&s.push(n.snapshot)}}else{const t=await Fm(r.localStore,o);e=await xm(r.localStore,t),await Ry(r,Zy(t),o,!1,e.resumeToken)}i.push(e)}return r.Pu.J_(s),i}function Zy(e){return ih(e.path,e.collectionGroup,e.orderBy,e.filters,e.limit,"F",e.startAt,e.endAt)}function ev(e){return t=qo(e).localStore,qo(qo(t).persistence).hs();var t}async function tv(e,t,n,r){const i=qo(e);if(i.gu)return void Oo(Ey,"Ignoring unexpected query state notification.");const s=i.Iu.get(t);if(s&&s.length>0)switch(n){case"current":case"not-current":{const e=await Vm(i.localStore,vh(s[0])),r=Nd.createSynthesizedRemoteEventForCurrentChange(t,"current"===n,Pu.EMPTY_BYTE_STRING);await Gy(i,e,r);break}case"rejected":await Lm(i.localStore,t,!0),jy(i,t,r);break;default:Fo(64155,n)}}async function nv(e,t,n){const r=rv(e);if(r.gu){for(const e of t){if(r.Iu.has(e)&&r.sharedClientState.isActiveQueryTarget(e)){Oo(Ey,"Adding an already active target "+e);continue}const t=await Fm(r.localStore,e),n=await xm(r.localStore,t);await Ry(r,Zy(t),n.targetId,!1,n.resumeToken),kg(r.remoteStore,n)}for(const e of n)r.Iu.has(e)&&await Lm(r.localStore,e,!1).then(()=>{Ng(r.remoteStore,e),jy(r,e)}).catch(ja)}}function rv(e){const t=qo(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=xy.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=Wy.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=My.bind(null,t),t.Pu.J_=hy.bind(null,t.eventManager),t.Pu.yu=dy.bind(null,t.eventManager),t}function iv(e){const t=qo(e);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Fy.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=Vy.bind(null,t),t}class sv{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=mg(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return Nm(this.persistence,new Am,e.initialUser,this.serializer)}Cu(e){return new um(hm.Vi,this.serializer)}Du(e){return new eg}async terminate(){var e,t;null==(e=this.gcScheduler)||e.stop(),null==(t=this.indexBackfillerScheduler)||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}sv.provider={build:()=>new sv};class ov extends sv{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){Uo(this.persistence.referenceDelegate instanceof dm,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Vp(n,e.asyncQueue,t)}Cu(e){const t=void 0!==this.cacheSizeBytes?_p.withCacheSize(this.cacheSizeBytes):_p.DEFAULT;return new um(e=>dm.Vi(e,t),this.serializer)}}class av extends sv{constructor(e,t,n){super(),this.xu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.xu.initialize(this,e),await iv(this.xu.syncEngine),await Bg(this.xu.remoteStore),await this.persistence.zi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}vu(e){return Nm(this.persistence,new Am,e.initialUser,this.serializer)}Fu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new Vp(n,e.asyncQueue,t)}Mu(e,t){const n=new nc(t,this.persistence);return new tc(e.asyncQueue,n)}Cu(e){const t=Tm(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=void 0!==this.cacheSizeBytes?_p.withCacheSize(this.cacheSizeBytes):_p.DEFAULT;return new Im(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,fg(),pg(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Du(e){return new eg}}class cv extends av{constructor(e,t){super(e,t,!1),this.xu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.xu.syncEngine;this.sharedClientState instanceof Zm&&(this.sharedClientState.syncEngine={So:Yy.bind(null,t),Do:tv.bind(null,t),Co:nv.bind(null,t),hs:ev.bind(null,t),bo:Jy.bind(null,t)},await this.sharedClientState.start()),await this.persistence.zi(async e=>{await async function(e,t){const n=qo(e);if(rv(n),iv(n),!0===t&&!0!==n.gu){const e=n.sharedClientState.getAllActiveQueryTargets(),t=await Xy(n,e.toArray());n.gu=!0,await Xg(n.remoteStore,!0);for(const r of t)kg(n.remoteStore,r)}else if(!1===t&&!1!==n.gu){const e=[];let t=Promise.resolve();n.Iu.forEach((r,i)=>{n.sharedClientState.isLocalQueryTarget(i)?e.push(i):t=t.then(()=>(jy(n,i),Lm(n.localStore,i,!0))),Ng(n.remoteStore,i)}),await t,await Xy(n,e),function(e){const t=qo(e);t.Au.forEach((e,n)=>{Ng(t.remoteStore,n)}),t.Vu.zr(),t.Au=new Map,t.Ru=new Eu(da.comparator)}(n),n.gu=!1,await Xg(n.remoteStore,!1)}}(this.xu.syncEngine,e),this.gcScheduler&&(e&&!this.gcScheduler.started?this.gcScheduler.start():e||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(e&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():e||this.indexBackfillerScheduler.stop())})}Du(e){const t=fg();if(!Zm.v(t))throw new Bo(jo.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=Tm(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Zm(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class uv{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>Ly(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=Hy.bind(null,this.syncEngine),await Xg(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new ay}createDatastore(e){const t=mg(e.databaseInfo.databaseId),n=function(e){return new dg(e)}(e.databaseInfo);return function(e,t,n,r){return new bg(e,t,n,r)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return t=this.localStore,n=this.datastore,r=e.asyncQueue,i=e=>Ly(this.syncEngine,e,0),s=rg.v()?new rg:new tg,new Sg(t,n,r,i,s);var t,n,r,i,s}createSyncEngine(e,t){return function(e,t,n,r,i,s,o){const a=new Cy(e,t,n,r,i,s);return o&&(a.gu=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(e){const t=qo(e);Oo(Eg,"RemoteStore shutting down."),t.Ea.add(5),await Cg(t),t.Aa.shutdown(),t.Va.set("Unknown")}(this.remoteStore),null==(e=this.datastore)||e.terminate(),null==(t=this.eventManager)||t.terminate()}}function lv(e,t=10240){let n=0;return{async read(){if(n<e.byteLength){const r={value:e.slice(n,n+t),done:!1};return n+=t,r}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */uv.provider={build:()=>new uv};class hv{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):xo("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout(()=>{this.muted||e(t)},0)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dv{constructor(e,t){this.Bu=e,this.serializer=t,this.metadata=new zo,this.buffer=new Uint8Array,this.Lu=new TextDecoder("utf-8"),this.ku().then(e=>{e&&e.Ua()?this.metadata.resolve(e.qa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null==e?void 0:e.qa)}`))},e=>this.metadata.reject(e))}close(){return this.Bu.cancel()}async getMetadata(){return this.metadata.promise}async Su(){return await this.getMetadata(),this.ku()}async ku(){const e=await this.Ku();if(null===e)return null;const t=this.Lu.decode(e),n=Number(t);isNaN(n)&&this.qu(`length string (${t}) is not valid number`);const r=await this.Uu(n);return new yy(JSON.parse(r),e.length+n)}$u(){return this.buffer.findIndex(e=>e==="{".charCodeAt(0))}async Ku(){for(;this.$u()<0&&!(await this.Wu()););if(0===this.buffer.length)return null;const e=this.$u();e<0&&this.qu("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Uu(e){for(;this.buffer.length<e;)await this.Wu()&&this.qu("Reached the end of bundle when more is expected.");const t=this.Lu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}qu(e){throw this.Bu.cancel(),new Error(`Invalid bundle format: ${e}`)}async Wu(){const e=await this.Bu.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fv{constructor(e,t){this.bundleData=e,this.serializer=t,this.cursor=0,this.elements=[];let n=this.Su();if(!n||!n.Ua())throw new Error(`The first element of the bundle is not a metadata object, it is\n         ${JSON.stringify(null==n?void 0:n.qa)}`);this.metadata=n;do{n=this.Su(),null!==n&&this.elements.push(n)}while(null!==n)}getMetadata(){return this.metadata}Qu(){return this.elements}Su(){if(this.cursor===this.bundleData.length)return null;const e=this.Ku(),t=this.Uu(e);return new yy(JSON.parse(t),e)}Uu(e){if(this.cursor+e>this.bundleData.length)throw new Bo(jo.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=e)}Ku(){const e=this.cursor;let t=this.cursor;for(;t<this.bundleData.length;){if("{"===this.bundleData[t]){if(t===e)throw new Error("First character is a bracket and not a number");return this.cursor=t,Number(this.bundleData.slice(e,t))}t++}throw new Error("Reached the end of bundle when more is expected.")}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pv=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new Bo(jo.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(e,t){const n=qo(e),r={documents:t.map(e=>Jd(n.serializer,e))},i=await n.jo("BatchGetDocuments",n.serializer.databaseId,ua.emptyPath(),r,t.length),s=new Map;i.forEach(e=>{const t=function(e,t){return"found"in t?function(e,t){Uo(!!t.found,43571),t.found.name,t.found.updateTime;const n=Yd(e,t.found.name),r=Gd(t.found.updateTime),i=t.found.createTime?Gd(t.found.createTime):Aa.min(),s=new bl({mapValue:{fields:t.found.fields}});return El.newFoundDocument(n,r,i,s)}(e,t):"missing"in t?function(e,t){Uo(!!t.missing,3894),Uo(!!t.readTime,22933);const n=Yd(e,t.missing),r=Gd(t.readTime);return El.newNoDocument(n,r)}(e,t):Fo(7234,{result:t})}(n.serializer,e);s.set(t.key.toString(),t)});const o=[];return t.forEach(e=>{const t=s.get(e.toString());Uo(!!t,55234,{key:e}),o.push(t)}),o}(this.datastore,e);return t.forEach(e=>this.recordVersion(e)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new hd(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((e,t)=>{const n=da.fromPath(t);this.mutations.push(new dd(n,this.precondition(n)))}),await async function(e,t){const n=qo(e),r={writes:t.map(e=>sf(n.serializer,e))};await n.Wo("Commit",n.serializer.databaseId,ua.emptyPath(),r)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw Fo(50498,{Gu:e.constructor.name});t=Aa.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new Bo(jo.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(Aa.min())?Xh.exists(!1):Xh.updateTime(t):Xh.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(Aa.min()))throw new Bo(jo.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Xh.updateTime(t)}return Xh.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mv{constructor(e,t,n,r,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=r,this.deferred=i,this.zu=n.maxAttempts,this.M_=new gg(this.asyncQueue,"transaction_retry")}ju(){this.zu-=1,this.Hu()}Hu(){this.M_.p_(async()=>{const e=new pv(this.datastore),t=this.Ju(e);t&&t.then(t=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(t)}).catch(e=>{this.Zu(e)}))}).catch(e=>{this.Zu(e)})})}Ju(e){try{const t=this.updateFunction(e);return!sc(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}Zu(e){this.zu>0&&this.Xu(e)?(this.zu-=1,this.asyncQueue.enqueueAndForget(()=>(this.Hu(),Promise.resolve()))):this.deferred.reject(e)}Xu(e){if("FirebaseError"===(null==e?void 0:e.name)){const t=e.code;return"aborted"===t||"failed-precondition"===t||"already-exists"===t||!Id(t)}return!1}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gv="FirestoreClient";class yv{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=r,this.user=No.UNAUTHENTICATED,this.clientId=Zo.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async e=>{Oo(gv,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(Oo(gv,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new zo;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=ny(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function vv(e,t){e.asyncQueue.verifyOperationInProgress(),Oo(gv,"Initializing OfflineComponentProvider");const n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await Dm(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function wv(e,t){e.asyncQueue.verifyOperationInProgress();const n=await Iv(e);Oo(gv,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>Yg(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>Yg(t.remoteStore,n)),e._onlineComponents=t}async function Iv(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){Oo(gv,"Using user provided OfflineComponentProvider");try{await vv(e,e._uninitializedComponentsProvider._offline)}catch(n){const r=n;if(!("FirebaseError"===(t=r).name?t.code===jo.FAILED_PRECONDITION||t.code===jo.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code))throw r;Lo("Error using user provided cache. Falling back to memory cache: "+r),await vv(e,new sv)}}else Oo(gv,"Using default OfflineComponentProvider"),await vv(e,new ov(void 0));var t;return e._offlineComponents}async function _v(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(Oo(gv,"Using user provided OnlineComponentProvider"),await wv(e,e._uninitializedComponentsProvider._online)):(Oo(gv,"Using default OnlineComponentProvider"),await wv(e,new uv))),e._onlineComponents}function bv(e){return Iv(e).then(e=>e.persistence)}function Tv(e){return Iv(e).then(e=>e.localStore)}function Ev(e){return _v(e).then(e=>e.remoteStore)}function Sv(e){return _v(e).then(e=>e.syncEngine)}function Av(e){return _v(e).then(e=>e.datastore)}async function Cv(e){const t=await _v(e),n=t.eventManager;return n.onListen=ky.bind(null,t.syncEngine),n.onUnlisten=Py.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=Ny.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=Oy.bind(null,t.syncEngine),n}function kv(e,t,n={}){const r=new zo;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new hv({next:a=>{s.Nu(),t.enqueueAndForget(()=>ly(e,o));const c=a.docs.has(n);!c&&a.fromCache?i.reject(new Bo(jo.UNAVAILABLE,"Failed to get document because the client is offline.")):c&&a.fromCache&&r&&"server"===r.source?i.reject(new Bo(jo.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):i.resolve(a)},error:e=>i.reject(e)}),o=new gy(sh(n.path),s,{includeMetadataChanges:!0,Ka:!0});return uy(e,o)}(await Cv(e),e.asyncQueue,t,n,r)),r.promise}function Nv(e,t,n={}){const r=new zo;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new hv({next:n=>{s.Nu(),t.enqueueAndForget(()=>ly(e,o)),n.fromCache&&"server"===r.source?i.reject(new Bo(jo.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(n)},error:e=>i.reject(e)}),o=new gy(n,s,{includeMetadataChanges:!0,Ka:!0});return uy(e,o)}(await Cv(e),e.asyncQueue,t,n,r)),r.promise}function Dv(e,t){const n=new zo;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){const r=iv(e);try{const e=await function(e,t){const n=qo(e),r=Sa.now(),i=t.reduce((e,t)=>e.add(t.key),Ph());let s,o;return n.persistence.runTransaction("Locally write mutations","readwrite",e=>{let a=Th(),c=Ph();return n.xs.getEntries(e,i).next(e=>{a=e,a.forEach((e,t)=>{t.isValidDocument()||(c=c.add(e))})}).next(()=>n.localDocuments.getOverlayedDocuments(e,a)).next(i=>{s=i;const o=[];for(const e of t){const t=id(e,s.get(e.key).overlayedDocument);null!=t&&o.push(new ad(e.key,t,Tl(t.value.mapValue),Xh.exists(!0)))}return n.mutationQueue.addMutationBatch(e,r,o,t)}).next(t=>{o=t;const r=t.applyToLocalDocumentSet(s,c);return n.documentOverlayCache.saveOverlays(e,t.batchId,r)})}).then(()=>({batchId:o.batchId,changes:Ah(s)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(e.batchId),function(e,t,n){let r=e.du[e.currentUser.toKey()];r||(r=new Eu(ea)),r=r.insert(t,n),e.du[e.currentUser.toKey()]=r}(r,e.batchId,n),await Gy(r,e.changes),await Bg(r.remoteStore)}catch(i){const e=ny(i,"Failed to persist write");n.reject(e)}}(await Sv(e),t,n)),n.promise}function Rv(e,t,n,r){const i=function(e,t){let n;return n="string"==typeof e?Td().encode(e):e,r=function(e,t){if(e instanceof Uint8Array)return lv(e,t);if(e instanceof ArrayBuffer)return lv(new Uint8Array(e),t);if(e instanceof ReadableStream)return e.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(n),new dv(r,t);var r}(n,mg(t));e.asyncQueue.enqueueAndForget(async()=>{!function(e,t,n){const r=qo(e);(async function(e,t,n){try{const i=await t.getMetadata();if(await function(e,t){const n=qo(e),r=Gd(t.createTime);return n.persistence.runTransaction("hasNewerBundle","readonly",e=>n.Pi.getBundleMetadata(e,t.id)).then(e=>!!e&&e.createTime.compareTo(r)>=0)}(e.localStore,i))return await t.close(),n._completeWith({taskState:"Success",documentsLoaded:(r=i).totalDocuments,bytesLoaded:r.totalBytes,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}),Promise.resolve(new Set);n._updateProgress(Iy(i));const s=new wy(i,t.serializer);let o=await t.Su();for(;o;){const e=await s.Ga(o);e&&n._updateProgress(e),o=await t.Su()}const a=await s.ja(e.localStore);return await Gy(e,a.Ja,void 0),await function(e,t){const n=qo(e);return n.persistence.runTransaction("Save bundle","readwrite",e=>n.Pi.saveBundleMetadata(e,t))}(e.localStore,i),n._completeWith(a.progress),Promise.resolve(a.Ha)}catch(r){return Lo(Ey,`Loading bundle failed with ${r}`),n._failWith(r),Promise.resolve(new Set)}var r})(r,t,n).then(e=>{r.sharedClientState.notifyBundleLoaded(e)})}(await Sv(e),i,r)})}function Pv(e,t){return new fv(e,t)}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ov(e){const t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const xv=new Map;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Lv="firestore.googleapis.com",Mv=!0;class Fv{constructor(e){if(void 0===e.host){if(void 0!==e.ssl)throw new Bo(jo.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Lv,this.ssl=Mv}else this.host=e.host,this.ssl=e.ssl??Mv;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=Ip;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<Lp)throw new Bo(jo.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}pa("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Ov(e.experimentalLongPollingOptions??{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new Bo(jo.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new Bo(jo.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new Bo(jo.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams;var t,n}}class Vv{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Fv({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Bo(jo.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new Bo(jo.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Fv(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new Ko;switch(e.type){case"firstParty":return new Qo(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new Bo(jo.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const t=xv.get(e);t&&(Oo("ComponentProvider","Removing Datastore"),xv.delete(e),t.terminate())}(this),Promise.resolve()}}function Uv(e,t,n,r={}){var s;e=wa(e,Vv);const o=f(t),a=e._getSettings(),c={...a,emulatorOptions:e._getEmulatorOptions()},u=`${t}:${n}`;o&&(p(`https://${u}`),y("Firestore",!0)),a.host!==Lv&&a.host!==u&&Lo("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const l={...a,host:u,ssl:o,emulatorOptions:r};if(!C(l,c)&&(e._setSettings(l),r.mockUserToken)){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=No.MOCK_USER;else{t=function(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",r=e.iat||0,s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...e};return[i(JSON.stringify({alg:"none",type:"JWT"})),i(JSON.stringify(o)),""].join(".")}(r.mockUserToken,null==(s=e._app)?void 0:s.options.projectId);const o=r.mockUserToken.sub||r.mockUserToken.user_id;if(!o)throw new Bo(jo.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new No(o)}e._authCredentials=new Go(new $o(t,n))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qv{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new qv(this.firestore,e,this._query)}}class jv{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Bv(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new jv(this.firestore,e,this._key)}toJSON(){return{type:jv._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(ba(t,jv._jsonSchema))return new jv(e,n||null,new da(ua.fromString(t.referencePath)))}}jv._jsonSchemaVersion="firestore/documentReference/1.0",jv._jsonSchema={type:_a("string",jv._jsonSchemaVersion),referencePath:_a("string")};class Bv extends qv{constructor(e,t,n){super(e,t,sh(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new jv(this.firestore,null,new da(e))}withConverter(e){return new Bv(this.firestore,e,this._path)}}function zv(e,t,...n){if(e=x(e),fa("collection","path",t),e instanceof Vv){const r=ua.fromString(t,...n);return ga(r),new Bv(e,null,r)}{if(!(e instanceof jv||e instanceof Bv))throw new Bo(jo.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(ua.fromString(t,...n));return ga(r),new Bv(e.firestore,null,r)}}function $v(e,t,...n){if(e=x(e),1===arguments.length&&(t=Zo.newId()),fa("doc","path",t),e instanceof Vv){const r=ua.fromString(t,...n);return ma(r),new jv(e,null,new da(r))}{if(!(e instanceof jv||e instanceof Bv))throw new Bo(jo.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(ua.fromString(t,...n));return ma(r),new jv(e.firestore,e instanceof Bv?e.converter:null,new da(r))}}function Kv(e,t){return e=x(e),t=x(t),e instanceof qv&&t instanceof qv&&e.firestore===t.firestore&&ph(e._query,t._query)&&e.converter===t.converter
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const Gv="AsyncQueue";class Hv{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new gg(this,"async_queue_retry"),this._c=()=>{const e=pg();e&&Oo(Gv,"Visibility state changed to "+e.visibilityState),this.M_.w_()},this.ac=e;const t=pg();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=pg();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new zo;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Yu.push(e),this.lc()))}async lc(){if(0!==this.Yu.length){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!Qa(e))throw e;Oo(Gv,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(e=>{throw this.nc=e,this.rc=!1,xo("INTERNAL UNHANDLED ERROR: ",Wv(e)),e}).then(e=>(this.rc=!1,e))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const r=ty.createAndSchedule(this,e,t,n,e=>this.hc(e));return this.tc.push(r),r}uc(){this.nc&&Fo(47125,{Pc:Wv(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do{e=this.ac,await e}while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((e,t)=>e.targetTimeMs-t.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.Tc()})}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Wv(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Qv{constructor(){this._progressObserver={},this._taskCompletionResolver=new zo,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jv extends Vv{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new Hv,this._persistenceKey=(null==r?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Hv(e),this._firestoreClient=void 0,await e}}}function Yv(e,t){const n="object"==typeof e?e:Ze(),r="string"==typeof e?e:t||Ku,i=He(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const e=u("firestore");e&&Uv(i,...e)}return i}function Xv(e){if(e._terminated)throw new Bo(jo.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||Zv(e),e._firestoreClient}function Zv(e){var t,n,r,i;const s=e._freezeSettings(),o=function(e,t,n,r,i){return new $u(e,t,n,i.host,i.ssl,i.experimentalForceLongPolling,i.experimentalAutoDetectLongPolling,Ov(i.experimentalLongPollingOptions),i.useFetchStreams,i.isUsingEmulator,r)}(e._databaseId,(null==(t=e._app)?void 0:t.options.appId)||"",e._persistenceKey,null==(n=e._app)?void 0:n.options.apiKey,s);e._componentsProvider||(null==(r=s.localCache)?void 0:r._offlineComponentProvider)&&(null==(i=s.localCache)?void 0:i._onlineComponentProvider)&&(e._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),e._firestoreClient=new yv(e._authCredentials,e._appCheckCredentials,e._queue,o,e._componentsProvider&&function(e){const t=null==e?void 0:e._online.build();return{_offline:null==e?void 0:e._offline.build(t),_online:t}}(e._componentsProvider))}function ew(e,t){Lo("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const n=e._freezeSettings();return tw(e,uv.provider,{build:e=>new av(e,n.cacheSizeBytes,null==t?void 0:t.forceOwnership)}),Promise.resolve()}function tw(e,t,n){if((e=wa(e,Jv))._firestoreClient||e._terminated)throw new Bo(jo.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(e._componentsProvider||e._getSettings().localCache)throw new Bo(jo.FAILED_PRECONDITION,"SDK cache is already specified.");e._componentsProvider={_online:t,_offline:n},Zv(e)}function nw(e,t){const n=Xv(e=wa(e,Jv)),r=new Qv;return Rv(n,e._databaseId,t,r),r}function rw(e,t){return function(e,t){return e.asyncQueue.enqueue(async()=>function(e,t){const n=qo(e);return n.persistence.runTransaction("Get named query","readonly",e=>n.Pi.getNamedQuery(e,t))}(await Tv(e),t))}(Xv(e=wa(e,Jv)),t).then(t=>t?new qv(e,null,t.query):null)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iw{constructor(e){this._byteString=e}static fromBase64String(e){try{return new iw(Pu.fromBase64String(e))}catch(t){throw new Bo(jo.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new iw(Pu.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:iw._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ba(e,iw._jsonSchema))return iw.fromBase64String(e.bytes)}}iw._jsonSchemaVersion="firestore/bytes/1.0",iw._jsonSchema={type:_a("string",iw._jsonSchemaVersion),bytes:_a("string")};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class sw{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new Bo(jo.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ha(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ow{constructor(e){this._methodName=e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aw{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Bo(jo.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Bo(jo.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ea(this._lat,e._lat)||ea(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:aw._jsonSchemaVersion}}static fromJSON(e){if(ba(e,aw._jsonSchema))return new aw(e.latitude,e.longitude)}}aw._jsonSchemaVersion="firestore/geoPoint/1.0",aw._jsonSchema={type:_a("string",aw._jsonSchemaVersion),latitude:_a("number"),longitude:_a("number")};
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class cw{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:cw._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ba(e,cw._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(e=>"number"==typeof e))return new cw(e.vectorValues);throw new Bo(jo.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}cw._jsonSchemaVersion="firestore/vectorValue/1.0",cw._jsonSchema={type:_a("string",cw._jsonSchemaVersion),vectorValues:_a("object")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const uw=/^__.*__$/;class lw{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new ad(e,this.data,this.fieldMask,t,this.fieldTransforms):new od(e,this.data,t,this.fieldTransforms)}}class hw{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new ad(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function dw(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Fo(40011,{dataSource:e})}}class fw{constructor(e,t,n,r,i,s){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new fw({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var t;const n=null==(t=this.path)?void 0:t.child(e),r=this.contextWith({path:n,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){var t;const n=null==(t=this.path)?void 0:t.child(e),r=this.contextWith({path:n,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Ow(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(0===e.length)throw this.createError("Document fields must not be empty");if(dw(this.dataSource)&&uw.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class pw{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||mg(e)}createContext(e,t,n,r=!1){return new fw({dataSource:e,methodName:t,targetDoc:n,path:ha.emptyPath(),arrayElement:!1,hasConverter:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function mw(e){const t=e._freezeSettings(),n=mg(e._databaseId);return new pw(e._databaseId,!!t.ignoreUndefinedProperties,n)}function gw(e,t,n,r,i,s={}){const o=e.createContext(s.merge||s.mergeFields?2:0,t,n,i);Nw("Data must be an object, but it was:",o,r);const a=Cw(r,o);let c,u;if(s.merge)c=new Du(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const e=[];for(const r of s.mergeFields){const i=Dw(t,r,n);if(!o.contains(i))throw new Bo(jo.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);xw(e,i)||e.push(i)}c=new Du(e),u=o.fieldTransforms.filter(e=>c.covers(e.field))}else c=null,u=o.fieldTransforms;return new lw(new bl(a),c,u)}class yw extends ow{_toFieldTransform(e){if(2!==e.dataSource)throw 1===e.dataSource?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof yw}}function vw(e,t,n){return new fw({dataSource:3,targetDoc:t.settings.targetDoc,methodName:e._methodName,arrayElement:n},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class ww extends ow{_toFieldTransform(e){return new Jh(e.path,new Bh)}isEqual(e){return e instanceof ww}}class Iw extends ow{constructor(e,t){super(e),this.Ac=t}_toFieldTransform(e){const t=vw(this,e,!0),n=this.Ac.map(e=>Aw(e,t)),r=new zh(n);return new Jh(e.path,r)}isEqual(e){return e instanceof Iw&&C(this.Ac,e.Ac)}}class _w extends ow{constructor(e,t){super(e),this.Ac=t}_toFieldTransform(e){const t=vw(this,e,!0),n=this.Ac.map(e=>Aw(e,t)),r=new Kh(n);return new Jh(e.path,r)}isEqual(e){return e instanceof _w&&C(this.Ac,e.Ac)}}class bw extends ow{constructor(e,t){super(e),this.Vc=t}_toFieldTransform(e){const t=new Hh(e.serializer,Fh(e.serializer,this.Vc));return new Jh(e.path,t)}isEqual(e){return e instanceof bw&&this.Vc===e.Vc}}function Tw(e,t,n,r){const i=e.createContext(1,t,n);Nw("Data must be an object, but it was:",i,r);const s=[],o=bl.empty();_u(r,(e,r)=>{const a=Pw(t,e,n);r=x(r);const c=i.childContextForFieldPath(a);if(r instanceof yw)s.push(a);else{const e=Aw(r,c);null!=e&&(s.push(a),o.set(a,e))}});const a=new Du(s);return new hw(o,a,i.fieldTransforms)}function Ew(e,t,n,r,i,s){const o=e.createContext(1,t,n),a=[Dw(t,r,n)],c=[i];if(s.length%2!=0)throw new Bo(jo.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<s.length;d+=2)a.push(Dw(t,s[d])),c.push(s[d+1]);const u=[],l=bl.empty();for(let d=a.length-1;d>=0;--d)if(!xw(u,a[d])){const e=a[d];let t=c[d];t=x(t);const n=o.childContextForFieldPath(e);if(t instanceof yw)u.push(e);else{const r=Aw(t,n);null!=r&&(u.push(e),l.set(e,r))}}const h=new Du(u);return new hw(l,h,o.fieldTransforms)}function Sw(e,t,n,r=!1){return Aw(n,e.createContext(r?4:3,t))}function Aw(e,t){if(kw(e=x(e)))return Nw("Unsupported field value:",t,e),Cw(e,t);if(e instanceof ow)return function(e,t){if(!dw(t.dataSource))throw t.createError(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.createError(`${e._methodName}() is not currently supported inside arrays`);const n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.arrayElement&&4!==t.dataSource)throw t.createError("Nested arrays are not supported");return function(e,t){const n=[];let r=0;for(const i of e){let e=Aw(i,t.childContextForArray(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if(null===(e=x(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return Fh(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){const n=Sa.fromDate(e);return{timestampValue:zd(t.serializer,n)}}if(e instanceof Sa){const n=new Sa(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:zd(t.serializer,n)}}if(e instanceof aw)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof iw)return{bytesValue:$d(t.serializer,e._byteString)};if(e instanceof jv){const n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.createError(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:Hd(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof cw)return function(e,t){const n=e instanceof cw?e.toArray():e;return{mapValue:{fields:{[Hu]:{stringValue:Ju},[Yu]:{arrayValue:{values:n.map(e=>{if("number"!=typeof e)throw t.createError("VectorValues must only contain numeric values.");return Lh(t.serializer,e)})}}}}}}(e,t);if(If(e))return e._toProto(t.serializer);throw t.createError(`Unsupported field value: ${va(e)}`)}(e,t)}function Cw(e,t){const n={};return Tu(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):_u(e,(e,r)=>{const i=Aw(r,t.childContextForField(e));null!=i&&(n[e]=i)}),{mapValue:{fields:n}}}function kw(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof Sa||e instanceof aw||e instanceof iw||e instanceof jv||e instanceof ow||e instanceof cw||If(e))}function Nw(e,t,n){if(!kw(n)||!ya(n)){const r=va(n);throw"an object"===r?t.createError(e+" a custom object"):t.createError(e+" "+r)}}function Dw(e,t,n){if((t=x(t))instanceof sw)return t._internalPath;if("string"==typeof t)return Pw(e,t);throw Ow("Field path arguments must be of type string or ",e,!1,void 0,n)}const Rw=new RegExp("[~\\*/\\[\\]]");function Pw(e,t,n){if(t.search(Rw)>=0)throw Ow(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new sw(...t.split("."))._internalPath}catch(r){throw Ow(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function Ow(e,t,n,r,i){const s=r&&!r.isEmpty(),o=void 0!==i;let a=`Function ${t}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${r}`),o&&(c+=` in document ${i}`),c+=")"),new Bo(jo.INVALID_ARGUMENT,a+e+c)}function xw(e,t){return e.some(e=>e.isEqual(t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lw{convertValue(e,t="none"){switch(Zu(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Lu(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Mu(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Fo(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return _u(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){var t,n,r;const i=null==(r=null==(n=null==(t=e.fields)?void 0:t[Yu].arrayValue)?void 0:n.values)?void 0:r.map(e=>Lu(e.doubleValue));return new cw(i)}convertGeoPoint(e){return new aw(Lu(e.latitude),Lu(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Bu(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(zu(e));default:return null}}convertTimestamp(e){const t=xu(e);return new Sa(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=ua.fromString(e);Uo(wf(n),9688,{name:e});const r=new Gu(n.get(1),n.get(3)),i=new da(n.popFirst(5));return r.isEqual(t)||xo(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mw extends Lw{constructor(e){super(),this.firestore=e}convertBytes(e){return new iw(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new jv(this.firestore,null,t)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fw(){return new yw("deleteField")}function Vw(){return new ww("serverTimestamp")}function Uw(...e){return new Iw("arrayUnion",e)}const qw="@firebase/firestore",jw="4.11.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bw(e){return function(e,t){if("object"!=typeof e||null===e)return!1;const n=e;for(const r of t)if(r in n&&"function"==typeof n[r])return!0;return!1}(e,["next","error","complete"])}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zw{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class $w{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}_fieldsProto(){return new bl({mapValue:{fields:this._data}}).clone().value.mapValue.fields}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kw{constructor(e,t,n,r,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new jv(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const e=new Gw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return(null==(e=this._document)?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Dw("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class Gw extends Kw{data(){return super.data()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hw(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new Bo(jo.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ww{}class Qw extends Ww{}function Jw(e,t,...n){let r=[];t instanceof Ww&&r.push(t),r=r.concat(n),function(e){const t=e.filter(e=>e instanceof Zw).length,n=e.filter(e=>e instanceof Yw).length;if(t>1||t>0&&n>0)throw new Bo(jo.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)e=i._apply(e);return e}class Yw extends Qw{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new Yw(e,t,n)}_apply(e){const t=this._parse(e);return uI(e._query,t),new qv(e.firestore,e.converter,dh(e._query,t))}_parse(e){const t=mw(e.firestore);return function(e,t,n,r,i,s,o){let a;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new Bo(jo.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){cI(o,s);const t=[];for(const n of o)t.push(aI(r,e,n));a={arrayValue:{values:t}}}else a=aI(r,e,o)}else"in"!==s&&"not-in"!==s&&"array-contains-any"!==s||cI(o,s),a=Sw(n,t,o,"in"===s||"not-in"===s);return Rl.create(i,s,a)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Xw(e,t,n){const r=t,i=Dw("where",e);return Yw._create(i,r,n)}class Zw extends Ww{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Zw(e,t)}_parse(e){const t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:Pl.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;const r=t.getFlattenedFilters();for(const i of r)uI(n,i),n=dh(n,i)}(e._query,t),new qv(e.firestore,e.converter,dh(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class eI extends Qw{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new eI(e,t)}_apply(e){const t=function(e,t,n){if(null!==e.startAt)throw new Bo(jo.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new Bo(jo.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new kl(t,n)}(e._query,this._field,this._direction);return new qv(e.firestore,e.converter,function(e,t){const n=e.explicitOrderBy.concat([t]);return new rh(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function tI(e,t="asc"){const n=t,r=Dw("orderBy",e);return eI._create(r,n)}class nI extends Qw{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new nI(e,t,n)}_apply(e){return new qv(e.firestore,e.converter,fh(e._query,this._limit,this._limitType))}}function rI(e){return Ia("limit",e),nI._create("limit",e,"F")}class iI extends Qw{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new iI(e,t,n)}_apply(e){const t=oI(e,this.type,this._docOrFields,this._inclusive);return new qv(e.firestore,e.converter,function(e,t){return new rh(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),e.limit,e.limitType,t,e.endAt)}(e._query,t))}}class sI extends Qw{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new sI(e,t,n)}_apply(e){const t=oI(e,this.type,this._docOrFields,this._inclusive);return new qv(e.firestore,e.converter,function(e,t){return new rh(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),e.limit,e.limitType,e.startAt,t)}(e._query,t))}}function oI(e,t,n,r){if(n[0]=x(n[0]),n[0]instanceof Kw)return function(e,t,n,r,i){if(!r)throw new Bo(jo.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${n}().`);const s=[];for(const o of ch(e))if(o.field.isKeyField())s.push(cl(t,r.key));else{const e=r.data.field(o.field);if(ju(e))throw new Bo(jo.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+o.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(null===e){const e=o.field.canonicalString();throw new Bo(jo.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`)}s.push(e)}return new Sl(s,i)}(e._query,e.firestore._databaseId,t,n[0]._document,r);{const i=mw(e.firestore);return function(e,t,n,r,i,s){const o=e.explicitOrderBy;if(i.length>o.length)throw new Bo(jo.INVALID_ARGUMENT,`Too many arguments provided to ${r}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const a=[];for(let c=0;c<i.length;c++){const s=i[c];if(o[c].field.isKeyField()){if("string"!=typeof s)throw new Bo(jo.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${r}(), but got a ${typeof s}`);if(!ah(e)&&-1!==s.indexOf("/"))throw new Bo(jo.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${r}() must be a plain document ID, but '${s}' contains a slash.`);const n=e.path.child(ua.fromString(s));if(!da.isDocumentKey(n))throw new Bo(jo.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${r}() must result in a valid document path, but '${n}' is not because it contains an odd number of segments.`);const i=new da(n);a.push(cl(t,i))}else{const e=Sw(n,r,s);a.push(e)}}return new Sl(a,s)}(e._query,e.firestore._databaseId,i,t,n,r)}}function aI(e,t,n){if("string"==typeof(n=x(n))){if(""===n)throw new Bo(jo.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!ah(t)&&-1!==n.indexOf("/"))throw new Bo(jo.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=t.path.child(ua.fromString(n));if(!da.isDocumentKey(r))throw new Bo(jo.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return cl(e,new da(r))}if(n instanceof jv)return cl(e,n._key);throw new Bo(jo.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${va(n)}.`)}function cI(e,t){if(!Array.isArray(e)||0===e.length)throw new Bo(jo.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function uI(e,t){const n=function(e,t){for(const n of e)for(const e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new Bo(jo.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new Bo(jo.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}function lI(e,t){if(!(t instanceof Yw||t instanceof Zw))throw new Bo(jo.INVALID_ARGUMENT,`Function ${e}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}function hI(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}class dI extends Lw{constructor(e){super(),this.firestore=e}convertBytes(e){return new iw(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new jv(this.firestore,null,t)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fI(){return new zw("count")}function pI(e,t){const n=wa(e.firestore,Jv),r=Xv(n),i=bu(t,(e,t)=>new gd(t,e.aggregateType,e._internalFieldPath));return function(e,t,n){const r=new zo;return e.asyncQueue.enqueueAndForget(async()=>{try{const i=await Av(e);r.resolve(async function(e,t,n){var r;const i=qo(e),{request:s,gt:o,parent:a}=uf(i.serializer,lh(t),n);i.connection.Ko||delete s.parent;const c=(await i.jo("RunAggregationQuery",i.serializer.databaseId,a,s,1)).filter(e=>!!e.result);Uo(1===c.length,64727);const u=null==(r=c[0].result)?void 0:r.aggregateFields;return Object.keys(u).reduce((e,t)=>(e[o[t]]=u[t],e),{})}(i,t,n))}catch(i){r.reject(i)}}),r.promise}(r,e._query,i).then(t=>function(e,t,n){const r=new Mw(e);return new $w(t,r,n)}(n,e,t))}class mI{constructor(e){this.kind="memory",this._onlineComponentProvider=uv.provider,this._offlineComponentProvider=(null==e?void 0:e.garbageCollector)?e.garbageCollector._offlineComponentProvider:{build:()=>new ov(void 0)}}toJSON(){return{kind:this.kind}}}class gI{constructor(e){let t;this.kind="persistent",(null==e?void 0:e.tabManager)?(e.tabManager._initialize(e),t=e.tabManager):(t=_I(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class yI{constructor(){this.kind="memoryEager",this._offlineComponentProvider=sv.provider}toJSON(){return{kind:this.kind}}}class vI{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new ov(e)}}toJSON(){return{kind:this.kind}}}class wI{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=uv.provider,this._offlineComponentProvider={build:t=>new av(t,null==e?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class II{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=uv.provider,this._offlineComponentProvider={build:t=>new cv(t,null==e?void 0:e.cacheSizeBytes)}}}function _I(e){return new wI(null==e?void 0:e.forceOwnership)}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const bI="NOT SUPPORTED";class TI{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class EI extends Kw{constructor(e,t,n,r,i,s){super(e,t,n,r,s),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new SI(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Dw("DocumentSnapshot.get",e));if(null!==n)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new Bo(jo.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=EI._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),e&&e.isValidDocument()&&e.isFoundDocument()?(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t):t}}EI._jsonSchemaVersion="firestore/documentSnapshot/1.0",EI._jsonSchema={type:_a("string",EI._jsonSchemaVersion),bundleSource:_a("string","DocumentSnapshot"),bundleName:_a("string"),bundle:_a("string")};class SI extends EI{data(e={}){return super.data(e)}}class AI{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new TI(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new SI(this._firestore,this._userDataWriter,n.key,n,new TI(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new Bo(jo.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(n=>{const r=new SI(e._firestore,e._userDataWriter,n.doc.key,n.doc,new TI(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:t++}})}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{const r=new SI(e._firestore,e._userDataWriter,t.doc.key,t.doc,new TI(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter);let i=-1,s=-1;return 0!==t.type&&(i=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),1!==t.type&&(n=n.add(t.doc),s=n.indexOf(t.doc.key)),{type:CI(t.type),doc:r,oldIndex:i,newIndex:s}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new Bo(jo.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=AI._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Zo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],r=[];return this.docs.forEach(e=>{null!==e._document&&(t.push(e._document),n.push(this._userDataWriter.convertObjectMap(e._document.data.value.mapValue.fields,"previous")),r.push(e.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function CI(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Fo(61501,{type:e})}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
AI._jsonSchemaVersion="firestore/querySnapshot/1.0",AI._jsonSchema={type:_a("string",AI._jsonSchemaVersion),bundleSource:_a("string","QuerySnapshot"),bundleName:_a("string"),bundle:_a("string")};const kI={maxAttempts:5};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NI{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=mw(e)}set(e,t,n){this._verifyNotCommitted();const r=DI(e,this._firestore),i=hI(r.converter,t,n),s=gw(this._dataReader,"WriteBatch.set",r._key,i,null!==r.converter,n);return this._mutations.push(s.toMutation(r._key,Xh.none())),this}update(e,t,n,...r){this._verifyNotCommitted();const i=DI(e,this._firestore);let s;return s="string"==typeof(t=x(t))||t instanceof sw?Ew(this._dataReader,"WriteBatch.update",i._key,t,n,r):Tw(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(s.toMutation(i._key,Xh.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=DI(e,this._firestore);return this._mutations=this._mutations.concat(new hd(t._key,Xh.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new Bo(jo.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function DI(e,t){if((e=x(e)).firestore!==t)throw new Bo(jo.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RI{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=mw(e)}get(e){const t=DI(e,this._firestore),n=new dI(this._firestore);return this._transaction.lookup([t._key]).then(e=>{if(!e||1!==e.length)return Fo(24041);const r=e[0];if(r.isFoundDocument())return new Kw(this._firestore,n,r.key,r,t.converter);if(r.isNoDocument())return new Kw(this._firestore,n,t._key,null,t.converter);throw Fo(18433,{doc:r})})}set(e,t,n){const r=DI(e,this._firestore),i=hI(r.converter,t,n),s=gw(this._dataReader,"Transaction.set",r._key,i,null!==r.converter,n);return this._transaction.set(r._key,s),this}update(e,t,n,...r){const i=DI(e,this._firestore);let s;return s="string"==typeof(t=x(t))||t instanceof sw?Ew(this._dataReader,"Transaction.update",i._key,t,n,r):Tw(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,s),this}delete(e){const t=DI(e,this._firestore);return this._transaction.delete(t._key),this}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PI extends RI{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=DI(e,this._firestore),n=new Mw(this._firestore);return super.get(e).then(e=>new EI(this._firestore,n,t._key,e._document,new TI(!1,!1),t.converter))}}function OI(e,t,n){e=wa(e,Jv);const r={...kI,...n};!function(e){if(e.maxAttempts<1)throw new Bo(jo.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r);return function(e,t,n){const r=new zo;return e.asyncQueue.enqueueAndForget(async()=>{const i=await Av(e);new mv(e.asyncQueue,i,n,t,r).ju()}),r.promise}(Xv(e),n=>t(new PI(e,n)),r)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xI(e){e=wa(e,jv);const t=wa(e.firestore,Jv);return kv(Xv(t),e._key).then(n=>jI(t,e,n))}function LI(e){e=wa(e,qv);const t=wa(e.firestore,Jv),n=Xv(t),r=new Mw(t);return Hw(e._query),Nv(n,e._query).then(n=>new AI(t,r,e,n))}function MI(e,t,n){e=wa(e,jv);const r=wa(e.firestore,Jv),i=hI(e.converter,t,n);return qI(r,[gw(mw(r),"setDoc",e._key,i,null!==e.converter,n).toMutation(e._key,Xh.none())])}function FI(e,t,n,...r){e=wa(e,jv);const i=wa(e.firestore,Jv),s=mw(i);let o;return o="string"==typeof(t=x(t))||t instanceof sw?Ew(s,"updateDoc",e._key,t,n,r):Tw(s,"updateDoc",e._key,t),qI(i,[o.toMutation(e._key,Xh.exists(!0))])}function VI(e){return qI(wa(e.firestore,Jv),[new hd(e._key,Xh.none())])}function UI(e,...t){var n,r,i;e=x(e);let s={includeMetadataChanges:!1,source:"default"},o=0;"object"!=typeof t[o]||Bw(t[o])||(s=t[o++]);const a={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(Bw(t[o])){const e=t[o];t[o]=null==(n=e.next)?void 0:n.bind(e),t[o+1]=null==(r=e.error)?void 0:r.bind(e),t[o+2]=null==(i=e.complete)?void 0:i.bind(e)}let c,u,l;if(e instanceof jv)u=wa(e.firestore,Jv),l=sh(e._key.path),c={next:n=>{t[o]&&t[o](jI(u,e,n))},error:t[o+1],complete:t[o+2]};else{const n=wa(e,qv);u=wa(n.firestore,Jv),l=n._query;const r=new Mw(u);c={next:e=>{t[o]&&t[o](new AI(u,r,n,e))},error:t[o+1],complete:t[o+2]},Hw(e._query)}return function(e,t,n,r){const i=new hv(r),s=new gy(t,i,n);return e.asyncQueue.enqueueAndForget(async()=>uy(await Cv(e),s)),()=>{i.Nu(),e.asyncQueue.enqueueAndForget(async()=>ly(await Cv(e),s))}}(Xv(u),l,a,c)}function qI(e,t){return Dv(Xv(e),t)}function jI(e,t,n){const r=n.docs.get(t._key),i=new Mw(e);return new EI(e,i,t._key,r,new TI(n.hasPendingWrites,n.fromCache),t.converter)}function BI(e){return Xv(e=wa(e,Jv)),new NI(e,t=>qI(e,t))
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}function zI(e,t){if("string"!=typeof e[t])throw new Bo(jo.INVALID_ARGUMENT,"Missing string value for: "+t);return e[t]}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $I{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function KI(e,t){(function(e,t){return e.asyncQueue.enqueue(async()=>{return n=await Tv(e),r=t,void(qo(n).Cs.As=r);var n,r})})(Xv(e._firestore),t).then(e=>Oo(`setting persistent cache index auto creation isEnabled=${t} succeeded`)).catch(e=>Lo(`setting persistent cache index auto creation isEnabled=${t} failed`,e))}const GI=new WeakMap;
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HI{constructor(){this.i=new Map}static get instance(){return WI||(WI=new HI,function(e){if(bd)throw new Error("a TestingHooksSpi instance is already set");bd=e}(WI)),WI}u(e){this.i.forEach(t=>t(e))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.i;return n.set(t,e),()=>n.delete(t)}}let WI=null;!function(e,t=!0){Do=Ye,Ge(new L("firestore",(e,{instanceIdentifier:n,options:r})=>{const i=e.getProvider("app").getImmediate(),s=new Jv(new Ho(e.getProvider("auth-internal")),new Yo(i,e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new Bo(jo.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Gu(e.options.projectId,t)}(i,n),i);return r={useFetchStreams:t,...r},s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),nt(qw,jw,e),nt(qw,jw,"esm2020")}();const QI=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Lw,AggregateField:zw,AggregateQuerySnapshot:$w,Bytes:iw,CACHE_SIZE_UNLIMITED:-1,CollectionReference:Bv,DocumentReference:jv,DocumentSnapshot:EI,FieldPath:sw,FieldValue:ow,Firestore:Jv,FirestoreError:Bo,GeoPoint:aw,LoadBundleTask:Qv,PersistentCacheIndexManager:$I,Query:qv,QueryCompositeFilterConstraint:Zw,QueryConstraint:Qw,QueryDocumentSnapshot:SI,QueryEndAtConstraint:sI,QueryFieldFilterConstraint:Yw,QueryLimitConstraint:nI,QueryOrderByConstraint:eI,QuerySnapshot:AI,QueryStartAtConstraint:iI,SnapshotMetadata:TI,Timestamp:Sa,Transaction:PI,VectorValue:cw,WriteBatch:NI,_AutoId:Zo,_ByteString:Pu,_DatabaseId:Gu,_DocumentKey:da,_EmptyAppCheckTokenProvider:class{getToken(){return Promise.resolve(new Jo(""))}invalidateToken(){}start(e,t){}shutdown(){}},_EmptyAuthCredentialsProvider:Ko,_FieldPath:ha,_TestingHooks:class{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return HI.instance.onExistenceFilterMismatch(e)}},_cast:wa,_debugAssert:function(e,t){e||Fo(57014,t)},_internalAggregationQueryToProtoRunAggregationQueryRequest:function(e,t){var n;const r=bu(t,(e,t)=>new gd(t,e.aggregateType,e._internalFieldPath)),i=null==(n=Xv(wa(e.firestore,Jv))._onlineComponents)?void 0:n.datastore.serializer;return void 0===i?null:uf(i,lh(e._query),r,!0).request},_internalQueryToProtoQueryTarget:
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e){var t;const n=null==(t=Xv(wa(e.firestore,Jv))._onlineComponents)?void 0:t.datastore.serializer;return void 0===n?null:cf(n,uh(e._query)).ft},_isBase64Available:function(){return"undefined"!=typeof atob},_logWarn:Lo,_validateIsNotUsedTogether:pa,addDoc:function(e,t){const n=wa(e.firestore,Jv),r=$v(e),i=hI(e.converter,t);return qI(n,[gw(mw(e.firestore),"addDoc",r._key,i,null!==e.converter,{}).toMutation(r._key,Xh.exists(!1))]).then(()=>r)},aggregateFieldEqual:function(e,t){var n,r;return e instanceof zw&&t instanceof zw&&e.aggregateType===t.aggregateType&&(null==(n=e._internalFieldPath)?void 0:n.canonicalString())===(null==(r=t._internalFieldPath)?void 0:r.canonicalString())},aggregateQuerySnapshotEqual:function(e,t){return Kv(e.query,t.query)&&C(e.data(),t.data())}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,and:function(...e){return e.forEach(e=>lI("and",e)),Zw._create("and",e)},arrayRemove:function(...e){return new _w("arrayRemove",e)},arrayUnion:Uw,average:function(e){return new zw("avg",Dw("average",e))},clearIndexedDbPersistence:function(e){if(e._initialized&&!e._terminated)throw new Bo(jo.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const t=new zo;return e._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(e){if(!Ka.v())return Promise.resolve();const t=e+wm;await Ka.delete(t)}(Tm(e._databaseId,e._persistenceKey)),t.resolve()}catch(n){t.reject(n)}}),t.promise},collection:zv,collectionGroup:function(e,t){if(e=wa(e,Vv),fa("collectionGroup","collection id",t),t.indexOf("/")>=0)throw new Bo(jo.INVALID_ARGUMENT,`Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new qv(e,null,(n=t,new rh(ua.emptyPath(),n)));var n},connectFirestoreEmulator:Uv,count:fI,deleteAllPersistentCacheIndexes:function(e){(function(e){return e.asyncQueue.enqueue(async()=>function(e){const t=qo(e),n=t.indexManager;return t.persistence.runTransaction("Delete All Indexes","readwrite",e=>n.deleteAllFieldIndexes(e))}(await Tv(e)))})(Xv(e._firestore)).then(e=>Oo("deleting all persistent cache indexes succeeded")).catch(e=>Lo("deleting all persistent cache indexes failed",e))},deleteDoc:VI,deleteField:Fw,disableNetwork:function(e){return function(e){return e.asyncQueue.enqueue(async()=>{const t=await bv(e),n=await Ev(e);return t.setNetworkEnabled(!1),async function(e){const t=qo(e);t.Ea.add(0),await Cg(t),t.Va.set("Offline")}(n)})}(Xv(e=wa(e,Jv)))},disablePersistentCacheIndexAutoCreation:function(e){KI(e,!1)},doc:$v,documentId:function(){return new sw(aa)},documentSnapshotFromJSON:function(e,t,n){if(ba(t,EI._jsonSchema)){if(t.bundle===bI)throw new Bo(jo.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=mg(e._databaseId),i=Pv(t.bundle,r),s=i.t(),o=new wy(i.getMetadata(),r);for(const e of s)o.o(e);const a=o.documents;if(1!==a.length)throw new Bo(jo.INVALID_ARGUMENT,`Expected bundle data to contain 1 document, but it contains ${a.length} documents.`);const c=rf(r,a[0].document),u=new da(ua.fromString(t.bundleName));return new EI(e,new dI(e),u,c,new TI(!1,!1),n||null)}},enableIndexedDbPersistence:ew,enableMultiTabIndexedDbPersistence:async function(e){Lo("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=e._freezeSettings();tw(e,uv.provider,{build:e=>new cv(e,t.cacheSizeBytes)})},enableNetwork:function(e){return function(e){return e.asyncQueue.enqueue(async()=>{const t=await bv(e),n=await Ev(e);return t.setNetworkEnabled(!0),function(e){const t=qo(e);return t.Ea.delete(0),Ag(t)}(n)})}(Xv(e=wa(e,Jv)))},enablePersistentCacheIndexAutoCreation:function(e){KI(e,!0)},endAt:function(...e){return sI._create("endAt",e,!0)},endBefore:function(...e){return sI._create("endBefore",e,!1)},ensureFirestoreConfigured:Xv,executeWrite:qI,getAggregateFromServer:pI,getCountFromServer:function(e){return pI(e,{count:fI()})},getDoc:xI,getDocFromCache:function(e){e=wa(e,jv);const t=wa(e.firestore,Jv),n=Xv(t),r=new Mw(t);return function(e,t){const n=new zo;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){try{const r=await function(e,t){const n=qo(e);return n.persistence.runTransaction("read document","readonly",e=>n.localDocuments.getDocument(e,t))}(e,t);r.isFoundDocument()?n.resolve(r):r.isNoDocument()?n.resolve(null):n.reject(new Bo(jo.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(r){const e=ny(r,`Failed to get document '${t} from cache`);n.reject(e)}}(await Tv(e),t,n)),n.promise}(n,e._key).then(n=>new EI(t,r,e._key,n,new TI(null!==n&&n.hasLocalMutations,!0),e.converter))},getDocFromServer:function(e){e=wa(e,jv);const t=wa(e.firestore,Jv);return kv(Xv(t),e._key,{source:"server"}).then(n=>jI(t,e,n))},getDocs:LI,getDocsFromCache:function(e){e=wa(e,qv);const t=wa(e.firestore,Jv),n=Xv(t),r=new Mw(t);return function(e,t){const n=new zo;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){try{const r=await Mm(e,t,!0),i=new Ty(t,r.ks),s=i.ru(r.documents),o=i.applyChanges(s,!1);n.resolve(o.snapshot)}catch(r){const e=ny(r,`Failed to execute query '${t} against cache`);n.reject(e)}}(await Tv(e),t,n)),n.promise}(n,e._query).then(n=>new AI(t,r,e,n))},getDocsFromServer:function(e){e=wa(e,qv);const t=wa(e.firestore,Jv),n=Xv(t),r=new Mw(t);return Nv(n,e._query,{source:"server"}).then(n=>new AI(t,r,e,n))},getFirestore:Yv,getPersistentCacheIndexManager:function(e){var t;e=wa(e,Jv);const n=GI.get(e);if(n)return n;if("persistent"!==(null==(t=Xv(e)._uninitializedComponentsProvider)?void 0:t._offline.kind))return null;const r=new $I(e);return GI.set(e,r),r},increment:function(e){return new bw("increment",e)},initializeFirestore:function(e,t,n){n||(n=Ku);const r=He(e,"firestore");if(r.isInitialized(n)){const e=r.getImmediate({identifier:n});if(C(r.getOptions(n),t))return e;throw new Bo(jo.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(void 0!==t.cacheSizeBytes&&void 0!==t.localCache)throw new Bo(jo.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(void 0!==t.cacheSizeBytes&&-1!==t.cacheSizeBytes&&t.cacheSizeBytes<Lp)throw new Bo(jo.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&f(t.host)&&p(t.host),r.initialize({options:t,instanceIdentifier:n})},limit:rI,limitToLast:function(e){return Ia("limitToLast",e),nI._create("limitToLast",e,"L")},loadBundle:nw,memoryEagerGarbageCollector:function(){return new yI},memoryLocalCache:function(e){return new mI(e)},memoryLruGarbageCollector:function(e){return new vI(null==e?void 0:e.cacheSizeBytes)},namedQuery:rw,onSnapshot:UI,onSnapshotResume:function(e,t,...n){const r=x(e),i=function(e){const t={bundle:"",bundleName:"",bundleSource:""},n=["bundle","bundleName","bundleSource"];for(const r of n){if(!(r in e)){t.error=`snapshotJson missing required field: ${r}`;break}const n=e[r];if("string"!=typeof n){t.error=`snapshotJson field '${r}' must be a string.`;break}if(0===n.length){t.error=`snapshotJson field '${r}' cannot be an empty string.`;break}"bundle"===r?t.bundle=n:"bundleName"===r?t.bundleName=n:"bundleSource"===r&&(t.bundleSource=n)}return t}(t);if(i.error)throw new Bo(jo.INVALID_ARGUMENT,i.error);let s,o=0;if("object"!=typeof n[o]||Bw(n[o])||(s=n[o++]),"QuerySnapshot"===i.bundleSource){let e=null;if("object"==typeof n[o]&&Bw(n[o])){const t=n[o++];e={next:t.next,error:t.error,complete:t.complete}}else e={next:n[o++],error:n[o++],complete:n[o++]};return function(e,t,n,r,i){let s,o=!1;return nw(e,t.bundle).then(()=>rw(e,t.bundleName)).then(e=>{e&&!o&&(i&&e.withConverter(i),s=UI(e,n||{},r))}).catch(e=>(r.error&&r.error(e),()=>{})),()=>{o||(o=!0,s&&s())}}(r,i,s,e,n[o])}if("DocumentSnapshot"===i.bundleSource){let e=null;if("object"==typeof n[o]&&Bw(n[o])){const t=n[o++];e={next:t.next,error:t.error,complete:t.complete}}else e={next:n[o++],error:n[o++],complete:n[o++]};return function(e,t,n,r,i){let s,o=!1;return nw(e,t.bundle).then(()=>{if(!o){const o=new jv(e,i||null,da.fromPath(t.bundleName));s=UI(o,n||{},r)}}).catch(e=>(r.error&&r.error(e),()=>{})),()=>{o||(o=!0,s&&s())}}(r,i,s,e,n[o])}throw new Bo(jo.INVALID_ARGUMENT,`unsupported bundle source: ${i.bundleSource}`)},onSnapshotsInSync:function(e,t){return function(e,t){const n=new hv(t);return e.asyncQueue.enqueueAndForget(async()=>{return t=await Cv(e),r=n,qo(t).Ca.add(r),void r.next();var t,r}),()=>{n.Nu(),e.asyncQueue.enqueueAndForget(async()=>{return t=await Cv(e),r=n,void qo(t).Ca.delete(r);var t,r})}}(Xv(e=wa(e,Jv)),Bw(t)?t:{next:t})},or:function(...e){return e.forEach(e=>lI("or",e)),Zw._create("or",e)},orderBy:tI,persistentLocalCache:function(e){return new gI(e)},persistentMultipleTabManager:function(){return new II},persistentSingleTabManager:_I,query:Jw,queryEqual:Kv,querySnapshotFromJSON:function(e,t,n){if(ba(t,AI._jsonSchema)){if(t.bundle===bI)throw new Bo(jo.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=mg(e._databaseId),i=Pv(t.bundle,r),s=i.t(),o=new wy(i.getMetadata(),r);for(const e of s)o.o(e);if(1!==o.queries.length)throw new Bo(jo.INVALID_ARGUMENT,`Snapshot data expected 1 query but found ${o.queries.length} queries.`);const a=Df(o.queries[0].bundledQuery),c=o.documents;let u=new ry;c.map(e=>{const t=rf(r,e.document);u=u.add(t)});const l=sy.fromInitialDocuments(a,u,Ph(),!1,!1),h=new qv(e,n||null,a);return new AI(e,new dI(e),h,l)}},refEqual:function(e,t){return e=x(e),t=x(t),(e instanceof jv||e instanceof Bv)&&(t instanceof jv||t instanceof Bv)&&e.firestore===t.firestore&&e.path===t.path&&e.converter===t.converter},runTransaction:OI,serverTimestamp:Vw,setDoc:MI,setIndexConfiguration:function(e,t){const n=Xv(e=wa(e,Jv));return n._uninitializedComponentsProvider&&"memory"!==n._uninitializedComponentsProvider._offline.kind?function(e,t){return e.asyncQueue.enqueue(async()=>async function(e,t){const n=qo(e),r=n.indexManager,i=[];return n.persistence.runTransaction("Configure indexes","readwrite",e=>r.getFieldIndexes(e).next(n=>
/**
      * @license
      * Copyright 2017 Google LLC
      *
      * Licensed under the Apache License, Version 2.0 (the "License");
      * you may not use this file except in compliance with the License.
      * You may obtain a copy of the License at
      *
      *   http://www.apache.org/licenses/LICENSE-2.0
      *
      * Unless required by applicable law or agreed to in writing, software
      * distributed under the License is distributed on an "AS IS" BASIS,
      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      * See the License for the specific language governing permissions and
      * limitations under the License.
      */function(e,t,n,r,i){e=[...e],t=[...t],e.sort(n),t.sort(n);const s=e.length,o=t.length;let a=0,c=0;for(;a<o&&c<s;){const s=n(e[c],t[a]);s<0?i(e[c++]):s>0?r(t[a++]):(a++,c++)}for(;a<o;)r(t[a++]);for(;c<s;)i(e[c++])}(n,t,Ra,t=>{i.push(r.addFieldIndex(e,t))},t=>{i.push(r.deleteFieldIndex(e,t))})).next(()=>Ba.waitFor(i)))}(await Tv(e),t))}(n,function(e){const t="string"==typeof e?function(e){try{return JSON.parse(e)}catch(t){throw new Bo(jo.INVALID_ARGUMENT,"Failed to parse JSON: "+(null==t?void 0:t.message))}}(e):e,n=[];if(Array.isArray(t.indexes))for(const r of t.indexes){const e=zI(r,"collectionGroup"),t=[];if(Array.isArray(r.fields))for(const n of r.fields){const e=Pw("setIndexConfiguration",zI(n,"fieldPath"));"CONTAINS"===n.arrayConfig?t.push(new Pa(e,2)):"ASCENDING"===n.order?t.push(new Pa(e,0)):"DESCENDING"===n.order&&t.push(new Pa(e,1))}n.push(new ka(ka.UNKNOWN_ID,e,t,xa.empty()))}return n}(t)):(Lo("Cannot enable indexes when persistence is disabled"),Promise.resolve())},setLogLevel:function(e){Ro.setLogLevel(e)},snapshotEqual:function(e,t){return e instanceof EI&&t instanceof EI?e._firestore===t._firestore&&e._key.isEqual(t._key)&&(null===e._document?null===t._document:e._document.isEqual(t._document))&&e._converter===t._converter:e instanceof AI&&t instanceof AI&&e._firestore===t._firestore&&Kv(e.query,t.query)&&e.metadata.isEqual(t.metadata)&&e._snapshot.isEqual(t._snapshot)},startAfter:function(...e){return iI._create("startAfter",e,!1)},startAt:function(...e){return iI._create("startAt",e,!0)},sum:function(e){return new zw("sum",Dw("sum",e))},terminate:function(e){return function(e,t,n=qe){He(e,t).clearInstance(n)}(e.app,"firestore",e._databaseId.database),e._delete()},updateDoc:FI,vector:function(e){return new cw(e)},waitForPendingWrites:function(e){return function(e){const t=new zo;return e.asyncQueue.enqueueAndForget(async()=>async function(t,n){const r=qo(t);xg(r.remoteStore)||Oo(Ey,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const e=await function(e){const t=qo(e);return t.persistence.runTransaction("Get highest unacknowledged batch id","readonly",e=>t.mutationQueue.getHighestUnacknowledgedBatchId(e))}(r.localStore);if(e===ic)return void n.resolve();const t=r.mu.get(e)||[];t.push(n),r.mu.set(e,t)}catch(e){const r=ny(e,"Initialization of waitForPendingWrites() operation failed");n.reject(r)}}(await Sv(e),t)),t.promise}(Xv(e=wa(e,Jv)))},where:Xw,writeBatch:BI},Symbol.toStringTag,{value:"Module"}));
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JI(e,t){const n={};for(const r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}function YI(e){if(null==e)return null;if(e instanceof Number&&(e=e.valueOf()),"number"==typeof e&&isFinite(e))return e;if(!0===e||!1===e)return e;if("[object String]"===Object.prototype.toString.call(e))return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(e=>YI(e));if("function"==typeof e||"object"==typeof e)return JI(e,e=>YI(e));throw new Error("Data cannot be encoded in JSON: "+e)}function XI(e){if(null==e)return e;if(e["@type"])switch(e["@type"]){case"type.googleapis.com/google.protobuf.Int64Value":case"type.googleapis.com/google.protobuf.UInt64Value":{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(e=>XI(e)):"function"==typeof e||"object"==typeof e?JI(e,e=>XI(e)):e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZI="functions",e_={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t_ extends E{constructor(e,t,n){super(`${ZI}/${e}`,t||""),this.details=n,Object.setPrototypeOf(this,t_.prototype)}}function n_(e,t){let n,r=function(e){if(e>=200&&e<300)return"ok";switch(e){case 0:case 500:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}(e),i=r;try{const e=t&&t.error;if(e){const t=e.status;if("string"==typeof t){if(!e_[t])return new t_("internal","internal");r=e_[t],i=t}const s=e.message;"string"==typeof s&&(i=s),n=e.details,void 0!==n&&(n=XI(n))}}catch(s){}return"ok"===r?null:new t_(r,i,n)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r_{constructor(e,t,n,r){this.app=e,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,We(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.auth=t.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||t.get().then(e=>this.auth=e,()=>{}),this.messaging||n.get().then(e=>this.messaging=e,()=>{}),this.appCheck||null==r||r.get().then(e=>this.appCheck=e,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return null==e?void 0:e.accessToken}catch(e){return}}async getMessagingToken(){if(this.messaging&&"Notification"in self&&"granted"===Notification.permission)try{return await this.messaging.getToken()}catch(e){return}}async getAppCheckToken(e){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){return{authToken:await this.getAuthToken(),messagingToken:await this.getMessagingToken(),appCheckToken:await this.getAppCheckToken(e)}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const i_="us-central1",s_=/^data: (.*?)(?:\n|$)/;class o_{constructor(e,t,n,r,i=i_,s=(...e)=>fetch(...e)){this.app=e,this.fetchImpl=s,this.emulatorOrigin=null,this.contextProvider=new r_(e,t,n,r),this.cancelAllRequests=new Promise(e=>{this.deleteService=()=>Promise.resolve(e())});try{const e=new URL(i);this.customDomain=e.origin+("/"===e.pathname?"":e.pathname),this.region=i_}catch(o){this.customDomain=null,this.region=i}}_delete(){return this.deleteService()}_url(e){const t=this.app.options.projectId;if(null!==this.emulatorOrigin){return`${this.emulatorOrigin}/${t}/${this.region}/${e}`}return null!==this.customDomain?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}}function a_(e,t,n){const r=n=>function(e,t,n,r){const i=e._url(t);return async function(e,t,n,r){n=YI(n);const i={data:n},s=await l_(e,r),o=r.timeout||7e4,a=function(e){let t=null;return{promise:new Promise((n,r)=>{t=setTimeout(()=>{r(new t_("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}(o),c=await Promise.race([u_(t,i,s,e.fetchImpl,e),a.promise,e.cancelAllRequests]);if(a.cancel(),!c)throw new t_("cancelled","Firebase Functions instance was deleted.");const u=n_(c.status,c.json);if(u)throw u;if(!c.json)throw new t_("internal","Response is not valid JSON object.");let l=c.json.data;void 0===l&&(l=c.json.result);if(void 0===l)throw new t_("internal","Response is missing data field.");return{data:XI(l)}}(e,i,n,r)}(e,t,n,{});return r.stream=(n,r)=>function(e,t,n,r){const i=e._url(t);return async function(e,t,n,r){var i;n=YI(n);const s={data:n},o=await l_(e,r);let a,c,u;o["Content-Type"]="application/json",o.Accept="text/event-stream";try{a=await e.fetchImpl(t,{method:"POST",body:JSON.stringify(s),headers:o,signal:null==r?void 0:r.signal,credentials:c_(e)})}catch(d){if(d instanceof Error&&"AbortError"===d.name){const e=new t_("cancelled","Request was cancelled.");return{data:Promise.reject(e),stream:{[Symbol.asyncIterator]:()=>({next:()=>Promise.reject(e)})}}}const e=n_(0,null);return{data:Promise.reject(e),stream:{[Symbol.asyncIterator]:()=>({next:()=>Promise.reject(e)})}}}const l=new Promise((e,t)=>{c=e,u=t});null==(i=null==r?void 0:r.signal)||i.addEventListener("abort",()=>{const e=new t_("cancelled","Request was cancelled.");u(e)});const h=function(e,t,n,r){const i=(e,r)=>{const i=e.match(s_);if(!i)return;const s=i[1];try{const e=JSON.parse(s);if("result"in e)return void t(XI(e.result));if("message"in e)return void r.enqueue(XI(e.message));if("error"in e){const t=n_(0,e);return r.error(t),void n(t)}}catch(o){if(o instanceof t_)return r.error(o),void n(o)}},s=new TextDecoder;return new ReadableStream({start(t){let o="";return a();async function a(){if(null==r?void 0:r.aborted){const e=new t_("cancelled","Request was cancelled");return t.error(e),n(e),Promise.resolve()}try{const{value:c,done:u}=await e.read();if(u)return o.trim()&&i(o.trim(),t),void t.close();if(null==r?void 0:r.aborted){const r=new t_("cancelled","Request was cancelled");return t.error(r),n(r),void(await e.cancel())}o+=s.decode(c,{stream:!0});const l=o.split("\n");o=l.pop()||"";for(const e of l)e.trim()&&i(e.trim(),t);return a()}catch(c){const e=c instanceof t_?c:n_(0,null);t.error(e),n(e)}}},cancel:()=>e.cancel()})}(a.body.getReader(),c,u,null==r?void 0:r.signal);return{stream:{[Symbol.asyncIterator](){const e=h.getReader();return{async next(){const{value:t,done:n}=await e.read();return{value:t,done:n}},return:async()=>(await e.cancel(),{done:!0,value:void 0})}}},data:l}}(e,i,n,r||{})}(e,t,n,r),r}function c_(e){return e.emulatorOrigin&&f(e.emulatorOrigin)?"include":void 0}async function u_(e,t,n,r,i){let s;n["Content-Type"]="application/json";try{s=await r(e,{method:"POST",body:JSON.stringify(t),headers:n,credentials:c_(i)})}catch(a){return{status:0,json:null}}let o=null;try{o=await s.json()}catch(a){}return{status:s.status,json:o}}async function l_(e,t){const n={},r=await e.contextProvider.getContext(t.limitedUseAppCheckTokens);return r.authToken&&(n.Authorization="Bearer "+r.authToken),r.messagingToken&&(n["Firebase-Instance-ID-Token"]=r.messagingToken),null!==r.appCheckToken&&(n["X-Firebase-AppCheck"]=r.appCheckToken),n}const h_="@firebase/functions",d_="0.13.1";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function f_(e=Ze(),t=i_){const n=He(x(e),ZI).getImmediate({identifier:t}),r=u("functions");return r&&function(e,t,n){!function(e,t,n){const r=f(t);e.emulatorOrigin=`http${r?"s":""}://${t}:${n}`,r&&(p(e.emulatorOrigin+"/backends"),y("Functions",!0))}(x(e),t,n)}(n,...r),n}function p_(e,t,n){return a_(x(e),t)}!function(e){Ge(new L(ZI,(e,{instanceIdentifier:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),i=e.getProvider("messaging-internal"),s=e.getProvider("app-check-internal");return new o_(n,r,i,s,t)},"PUBLIC").setMultipleInstances(!0)),nt(h_,d_,e),nt(h_,d_,"esm2020")}();const m_="@firebase/installations",g_="0.6.19",y_=1e4,v_=`w:${g_}`,w_="FIS_v2",I_=36e5,__=new S("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function b_(e){return e instanceof E&&e.code.includes("request-failed")}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T_({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function E_(e){return{token:e.token,requestStatus:2,expiresIn:(t=e.expiresIn,Number(t.replace("s","000"))),creationTime:Date.now()};var t}async function S_(e,t){const n=(await t.json()).error;return __.create("request-failed",{requestName:e,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function A_({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function C_(e,{refreshToken:t}){const n=A_(e);return n.append("Authorization",function(e){return`${w_} ${e}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t)),n}async function k_(e){const t=await e();return t.status>=500&&t.status<600?e():t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function N_(e){return new Promise(t=>{setTimeout(t,e)})}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const D_=/^[cdef][\w-]{21}$/;function R_(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const t=function(e){const t=(n=e,btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_"));var n;return t.substr(0,22)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e);return D_.test(t)?t:""}catch{return""}}function P_(e){return`${e.appName}!${e.appId}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O_=new Map;function x_(e,t){const n=P_(e);L_(n,t),function(e,t){const n=function(){!M_&&"BroadcastChannel"in self&&(M_=new BroadcastChannel("[Firebase] FID Change"),M_.onmessage=e=>{L_(e.data.key,e.data.fid)});return M_}();n&&n.postMessage({key:e,fid:t});0===O_.size&&M_&&(M_.close(),M_=null)}(n,t)}function L_(e,t){const n=O_.get(e);if(n)for(const r of n)r(t)}let M_=null;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const F_="firebase-installations-store";let V_=null;function U_(){return V_||(V_=ie("firebase-installations-database",1,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(F_)}})),V_}async function q_(e,t){const n=P_(e),r=(await U_()).transaction(F_,"readwrite"),i=r.objectStore(F_),s=await i.get(n);return await i.put(t,n),await r.done,s&&s.fid===t.fid||x_(e,t.fid),t}async function j_(e){const t=P_(e),n=(await U_()).transaction(F_,"readwrite");await n.objectStore(F_).delete(t),await n.done}async function B_(e,t){const n=P_(e),r=(await U_()).transaction(F_,"readwrite"),i=r.objectStore(F_),s=await i.get(n),o=t(s);return void 0===o?await i.delete(n):await i.put(o,n),await r.done,!o||s&&s.fid===o.fid||x_(e,o.fid),o}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z_(e){let t;const n=await B_(e.appConfig,n=>{const r=function(e){const t=e||{fid:R_(),registrationStatus:0};return G_(t)}(n),i=function(e,t){if(0===t.registrationStatus){if(!navigator.onLine){return{installationEntry:t,registrationPromise:Promise.reject(__.create("app-offline"))}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=async function(e,t){try{const n=await async function({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const r=T_(e),i=A_(e),s=t.getImmediate({optional:!0});if(s){const e=await s.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}const o={fid:n,authVersion:w_,appId:e.appId,sdkVersion:v_},a={method:"POST",headers:i,body:JSON.stringify(o)},c=await k_(()=>fetch(r,a));if(c.ok){const e=await c.json();return{fid:e.fid||n,registrationStatus:2,refreshToken:e.refreshToken,authToken:E_(e.authToken)}}throw await S_("Create Installation",c)}(e,t);return q_(e.appConfig,n)}catch(n){throw b_(n)&&409===n.customData.serverCode?await j_(e.appConfig):await q_(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}(e,n);return{installationEntry:n,registrationPromise:r}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:$_(e)}:{installationEntry:t}}(e,r);return t=i.registrationPromise,i.installationEntry});return""===n.fid?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}async function $_(e){let t=await K_(e.appConfig);for(;1===t.registrationStatus;)await N_(100),t=await K_(e.appConfig);if(0===t.registrationStatus){const{installationEntry:t,registrationPromise:n}=await z_(e);return n||t}return t}function K_(e){return B_(e,e=>{if(!e)throw __.create("installation-not-found");return G_(e)})}function G_(e){return 1===(t=e).registrationStatus&&t.registrationTime+y_<Date.now()?{fid:e.fid,registrationStatus:0}:e;var t;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}async function H_({appConfig:e,heartbeatServiceProvider:t},n){const r=function(e,{fid:t}){return`${T_(e)}/${t}/authTokens:generate`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,n),i=C_(e,n),s=t.getImmediate({optional:!0});if(s){const e=await s.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}const o={installation:{sdkVersion:v_,appId:e.appId}},a={method:"POST",headers:i,body:JSON.stringify(o)},c=await k_(()=>fetch(r,a));if(c.ok){return E_(await c.json())}throw await S_("Generate Auth Token",c)}async function W_(e,t=!1){let n;const r=await B_(e.appConfig,r=>{if(!J_(r))throw __.create("not-registered");const i=r.authToken;if(!t&&function(e){return 2===e.requestStatus&&!function(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+I_}(e)}(i))return r;if(1===i.requestStatus)return n=async function(e,t){let n=await Q_(e.appConfig);for(;1===n.authToken.requestStatus;)await N_(100),n=await Q_(e.appConfig);const r=n.authToken;return 0===r.requestStatus?W_(e,t):r}(e,t),r;{if(!navigator.onLine)throw __.create("app-offline");const t=function(e){const t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}(r);return n=async function(e,t){try{const n=await H_(e,t),r={...t,authToken:n};return await q_(e.appConfig,r),n}catch(n){if(!b_(n)||401!==n.customData.serverCode&&404!==n.customData.serverCode){const n={...t,authToken:{requestStatus:0}};await q_(e.appConfig,n)}else await j_(e.appConfig);throw n}}(e,t),t}});return n?await n:r.authToken}function Q_(e){return B_(e,e=>{if(!J_(e))throw __.create("not-registered");const t=e.authToken;return 1===(n=t).requestStatus&&n.requestTime+y_<Date.now()?{...e,authToken:{requestStatus:0}}:e;var n;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */})}function J_(e){return void 0!==e&&2===e.registrationStatus}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Y_(e,t=!1){const n=e;await async function(e){const{registrationPromise:t}=await z_(e);t&&await t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n);return(await W_(n,t)).token}function X_(e){return __.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z_="installations",eb=e=>{const t=He(e.getProvider("app").getImmediate(),Z_).getImmediate();return{getId:()=>async function(e){const t=e,{installationEntry:n,registrationPromise:r}=await z_(t);return r?r.catch(console.error):W_(t).catch(console.error),n.fid}(t),getToken:e=>Y_(t,e)}};Ge(new L(Z_,e=>{const t=e.getProvider("app").getImmediate(),n=function(e){if(!e||!e.options)throw X_("App Configuration");if(!e.name)throw X_("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw X_(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t);return{app:t,appConfig:n,heartbeatServiceProvider:He(t,"heartbeat"),_delete:()=>Promise.resolve()}},"PUBLIC")),Ge(new L("installations-internal",eb,"PRIVATE")),nt(m_,g_),nt(m_,g_,"esm2020");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const tb="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",nb="google.c.a.c_id",rb=1e4;var ib,sb,ob;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ab(e){const t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function cb(e){const t=(e+"=".repeat((4-e.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),n=atob(t),r=new Uint8Array(n.length);for(let i=0;i<n.length;++i)r[i]=n.charCodeAt(i);return r}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(sb=ib||(ib={}))[sb.DATA_MESSAGE=1]="DATA_MESSAGE",sb[sb.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION",function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked"}(ob||(ob={}));const ub="fcm_token_details_db",lb="fcm_token_object_Store";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const hb="firebase-messaging-store";let db=null;function fb(){return db||(db=ie("firebase-messaging-database",1,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(hb)}})),db}async function pb(e){const t=gb(e),n=await fb(),r=await n.transaction(hb).objectStore(hb).get(t);if(r)return r;{const t=await async function(e){if("databases"in indexedDB&&!(await indexedDB.databases()).map(e=>e.name).includes(ub))return null;let t=null;return(await ie(ub,5,{upgrade:async(n,r,i,s)=>{if(r<2)return;if(!n.objectStoreNames.contains(lb))return;const o=s.objectStore(lb),a=await o.index("fcmSenderId").get(e);if(await o.clear(),a)if(2===r){const e=a;if(!e.auth||!e.p256dh||!e.endpoint)return;t={token:e.fcmToken,createTime:e.createTime??Date.now(),subscriptionOptions:{auth:e.auth,p256dh:e.p256dh,endpoint:e.endpoint,swScope:e.swScope,vapidKey:"string"==typeof e.vapidKey?e.vapidKey:ab(e.vapidKey)}}}else if(3===r){const e=a;t={token:e.fcmToken,createTime:e.createTime,subscriptionOptions:{auth:ab(e.auth),p256dh:ab(e.p256dh),endpoint:e.endpoint,swScope:e.swScope,vapidKey:ab(e.vapidKey)}}}else if(4===r){const e=a;t={token:e.fcmToken,createTime:e.createTime,subscriptionOptions:{auth:ab(e.auth),p256dh:ab(e.p256dh),endpoint:e.endpoint,swScope:e.swScope,vapidKey:ab(e.vapidKey)}}}}})).close(),await se(ub),await se("fcm_vapid_details_db"),await se("undefined"),function(e){if(!e||!e.subscriptionOptions)return!1;const{subscriptionOptions:t}=e;return"number"==typeof e.createTime&&e.createTime>0&&"string"==typeof e.token&&e.token.length>0&&"string"==typeof t.auth&&t.auth.length>0&&"string"==typeof t.p256dh&&t.p256dh.length>0&&"string"==typeof t.endpoint&&t.endpoint.length>0&&"string"==typeof t.swScope&&t.swScope.length>0&&"string"==typeof t.vapidKey&&t.vapidKey.length>0}(t)?t:null}(e.appConfig.senderId);if(t)return await mb(e,t),t}}async function mb(e,t){const n=gb(e),r=(await fb()).transaction(hb,"readwrite");return await r.objectStore(hb).put(t,n),await r.done,t}function gb({appConfig:e}){return e.appId}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yb=new S("messaging","Messaging",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."});async function vb(e,t){const n={method:"DELETE",headers:await Ib(e)};try{const r=await fetch(`${wb(e.appConfig)}/${t}`,n),i=await r.json();if(i.error){const e=i.error.message;throw yb.create("token-unsubscribe-failed",{errorInfo:e})}}catch(r){throw yb.create("token-unsubscribe-failed",{errorInfo:null==r?void 0:r.toString()})}}function wb({projectId:e}){return`https://fcmregistrations.googleapis.com/v1/projects/${e}/registrations`}async function Ib({appConfig:e,installations:t}){const n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function _b({p256dh:e,auth:t,endpoint:n,vapidKey:r}){const i={web:{endpoint:n,auth:t,p256dh:e}};return r!==tb&&(i.web.applicationPubKey=r),i}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bb(e){const t=await async function(e,t){const n=await e.pushManager.getSubscription();if(n)return n;return e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:cb(t)})}(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:ab(t.getKey("auth")),p256dh:ab(t.getKey("p256dh"))},r=await pb(e.firebaseDependencies);if(r){if(function(e,t){const n=t.vapidKey===e.vapidKey,r=t.endpoint===e.endpoint,i=t.auth===e.auth,s=t.p256dh===e.p256dh;return n&&r&&i&&s}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r.subscriptionOptions,n))return Date.now()>=r.createTime+6048e5?async function(e,t){try{const n=await async function(e,t){const n=await Ib(e),r=_b(t.subscriptionOptions),i={method:"PATCH",headers:n,body:JSON.stringify(r)};let s;try{const n=await fetch(`${wb(e.appConfig)}/${t.token}`,i);s=await n.json()}catch(o){throw yb.create("token-update-failed",{errorInfo:null==o?void 0:o.toString()})}if(s.error){const e=s.error.message;throw yb.create("token-update-failed",{errorInfo:e})}if(!s.token)throw yb.create("token-update-no-token");return s.token}(e.firebaseDependencies,t),r={...t,token:n,createTime:Date.now()};return await mb(e.firebaseDependencies,r),n}catch(n){throw n}}(e,{token:r.token,createTime:Date.now(),subscriptionOptions:n}):r.token;try{await vb(e.firebaseDependencies,r.token)}catch(i){}return Eb(e.firebaseDependencies,n)}return Eb(e.firebaseDependencies,n)}async function Tb(e){const t=await pb(e.firebaseDependencies);t&&(await vb(e.firebaseDependencies,t.token),await async function(e){const t=gb(e),n=(await fb()).transaction(hb,"readwrite");await n.objectStore(hb).delete(t),await n.done}(e.firebaseDependencies));const n=await e.swRegistration.pushManager.getSubscription();return!n||n.unsubscribe()}async function Eb(e,t){const n=
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */await async function(e,t){const n=await Ib(e),r=_b(t),i={method:"POST",headers:n,body:JSON.stringify(r)};let s;try{const t=await fetch(wb(e.appConfig),i);s=await t.json()}catch(o){throw yb.create("token-subscribe-failed",{errorInfo:null==o?void 0:o.toString()})}if(s.error){const e=s.error.message;throw yb.create("token-subscribe-failed",{errorInfo:e})}if(!s.token)throw yb.create("token-subscribe-no-token");return s.token}(e,t),r={token:n,createTime:Date.now(),subscriptionOptions:t};return await mb(e,r),r.token}function Sb(e){const t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return function(e,t){if(!t.notification)return;e.notification={};const n=t.notification.title;n&&(e.notification.title=n);const r=t.notification.body;r&&(e.notification.body=r);const i=t.notification.image;i&&(e.notification.image=i);const s=t.notification.icon;s&&(e.notification.icon=s)}(t,e),function(e,t){if(!t.data)return;e.data=t.data}(t,e),function(e,t){var n,r,i,s;if(!t.fcmOptions&&!(null==(n=t.notification)?void 0:n.click_action))return;e.fcmOptions={};const o=(null==(r=t.fcmOptions)?void 0:r.link)??(null==(i=t.notification)?void 0:i.click_action);o&&(e.fcmOptions.link=o);const a=null==(s=t.fcmOptions)?void 0:s.analytics_label;a&&(e.fcmOptions.analyticsLabel=a)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t,e),t}function Ab(e){return yb.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cb{constructor(e,t,n){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const r=
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e){if(!e||!e.options)throw Ab("App Configuration Object");if(!e.name)throw Ab("App Name");const t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(const r of t)if(!n[r])throw Ab(r);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}(e);this.firebaseDependencies={app:e,appConfig:r,installations:t,analyticsProvider:n}}_delete(){return Promise.resolve()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kb(e){try{e.swRegistration=await navigator.serviceWorker.register("/firebase-messaging-sw.js",{scope:"/firebase-cloud-messaging-push-scope"}),e.swRegistration.update().catch(()=>{}),await async function(e){return new Promise((t,n)=>{const r=setTimeout(()=>n(new Error("Service worker not registered after 10000 ms")),rb),i=e.installing||e.waiting;e.active?(clearTimeout(r),t()):i?i.onstatechange=e=>{var n;"activated"===(null==(n=e.target)?void 0:n.state)&&(i.onstatechange=null,clearTimeout(r),t())}:(clearTimeout(r),n(new Error("No incoming service worker found.")))})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e.swRegistration)}catch(t){throw yb.create("failed-service-worker-registration",{browserErrorMessage:null==t?void 0:t.message})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Nb(e,t){if(!navigator)throw yb.create("only-available-in-window");if("default"===Notification.permission&&await Notification.requestPermission(),"granted"!==Notification.permission)throw yb.create("permission-blocked");
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return await async function(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=tb)}(e,null==t?void 0:t.vapidKey),await async function(e,t){if(t||e.swRegistration||await kb(e),t||!e.swRegistration){if(!(t instanceof ServiceWorkerRegistration))throw yb.create("invalid-sw-registration");e.swRegistration=t}}(e,null==t?void 0:t.serviceWorkerRegistration),bb(e)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Db(e,t,n){const r=function(e){switch(e){case ob.NOTIFICATION_CLICKED:return"notification_open";case ob.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:n[nb],message_name:n["google.c.a.c_l"],message_time:n["google.c.a.ts"],message_device_time:Math.floor(Date.now()/1e3)})}async function Rb(e,t){const n=t.data;if(!n.isFirebaseMessaging)return;e.onMessageHandler&&n.messageType===ob.PUSH_RECEIVED&&("function"==typeof e.onMessageHandler?e.onMessageHandler(Sb(n)):e.onMessageHandler.next(Sb(n)));const r=n.data;var i;"object"==typeof(i=r)&&i&&nb in i&&"1"===r["google.c.a.e"]&&await Db(e,n.messageType,r)}const Pb="@firebase/messaging",Ob="0.12.23",xb=e=>{const t=e.getProvider("messaging").getImmediate();return{getToken:e=>Nb(t,e)}};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Lb(){try{await T()}catch(e){return!1}return"undefined"!=typeof window&&b()&&!("undefined"==typeof navigator||!navigator.cookieEnabled)&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ge(new L("messaging",e=>{const t=new Cb(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",e=>Rb(t,e)),t},"PUBLIC")),Ge(new L("messaging-internal",xb,"PRIVATE")),nt(Pb,Ob),nt(Pb,Ob,"esm2020");const Mb=Object.freeze(Object.defineProperty({__proto__:null,deleteToken:function(e){return async function(e){if(!navigator)throw yb.create("only-available-in-window");return e.swRegistration||await kb(e),Tb(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e=x(e))},getMessaging:
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e=Ze()){return Lb().then(e=>{if(!e)throw yb.create("unsupported-browser")},e=>{throw yb.create("indexed-db-unsupported")}),He(x(e),"messaging").getImmediate()},getToken:async function(e,t){return Nb(e=x(e),t)},isSupported:Lb,onMessage:function(e,t){return function(e,t){if(!navigator)throw yb.create("only-available-in-window");return e.onMessageHandler=t,()=>{e.onMessageHandler=null}}(e=x(e),t)}},Symbol.toStringTag,{value:"Module"}));export{yi as $,Xw as A,rI as B,tI as C,BI as D,Uw as E,Fw as F,OI as G,p_ as H,dr as I,Mr as J,ri as K,vi as L,yr as M,xr as N,Kr as O,$r as P,Xr as Q,Cs as R,mr as S,Sa as T,Jr as U,gr as V,vr as W,ns as X,ss as Y,_r as Z,an as _,Ze as a,Zr as a0,Qr as a1,mn as a2,Wi as a3,Oi as a4,Sr as a5,Fr as a6,Yr as a7,is as a8,Nr as a9,ni as aa,Qn as ab,ei as ac,Ss as ad,gs as ae,As as af,ys as ag,Lr as ah,ar as ai,hi as aj,go as ak,QI as al,Mb as am,po as b,Yv as c,f_ as d,Ci as e,ew as f,et as g,$v as h,Xe as i,MI as j,xI as k,VI as l,zv as m,LI as n,Wr as o,gi as p,mi as q,zr as r,di as s,Hr as t,ti as u,tt as v,Vw as w,FI as x,UI as y,Jw as z};
