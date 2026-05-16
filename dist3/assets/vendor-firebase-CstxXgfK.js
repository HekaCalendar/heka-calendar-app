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
 */const a=()=>{try{return o().__FIREBASE_DEFAULTS__||(()=>{if("undefined"==typeof process)return;const t=e.__FIREBASE_DEFAULTS__;return t?JSON.parse(t):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&s(e[1]);return t&&JSON.parse(t)})()}catch(t){return}},c=e=>{var t,n;return null==(n=null==(t=a())?void 0:t.emulatorHosts)?void 0:n[e]},u=()=>{var e;return null==(e=a())?void 0:e.config},l=e=>{var t;return null==(t=a())?void 0:t[`_${e}`]};
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
class h{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
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
 */function d(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function f(e){return(await fetch(e,{credentials:"include"})).ok}
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
 */const p={};let m=!1;function g(e,t){if("undefined"==typeof window||"undefined"==typeof document||!d(window.location.host)||p[e]===t||p[e]||m)return;function n(e){return`__firebase__banner__${e}`}p[e]=t;const r="__firebase__banner",i=function(){const e={prod:[],emulator:[]};for(const t of Object.keys(p))p[t]?e.emulator.push(t):e.prod.push(t);return e}().prod.length>0;function s(){const e=document.createElement("span");return e.style.cursor="pointer",e.style.marginLeft="16px",e.style.fontSize="24px",e.innerHTML=" &times;",e.onclick=()=>{m=!0,function(){const e=document.getElementById(r);e&&e.remove()}()},e}function o(){const e=function(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}(r),t=n("text"),o=document.getElementById(t)||document.createElement("span"),a=n("learnmore"),c=document.getElementById(a)||document.createElement("a"),u=n("preprendIcon"),l=document.getElementById(u)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(e.created){const t=e.element;!function(e){e.style.display="flex",e.style.background="#7faaf0",e.style.position="fixed",e.style.bottom="5px",e.style.left="5px",e.style.padding=".5em",e.style.borderRadius="5px",e.style.alignItems="center"}(t),function(e,t){e.setAttribute("id",t),e.innerText="Learn more",e.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",e.setAttribute("target","__blank"),e.style.paddingLeft="5px",e.style.textDecoration="underline"}(c,a);const n=s();!function(e,t){e.setAttribute("width","24"),e.setAttribute("id",t),e.setAttribute("height","24"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.style.marginLeft="-6px"}(l,u),t.append(l,o,c,n),document.body.appendChild(t)}i?(o.innerText="Preview backend disconnected.",l.innerHTML='<g clip-path="url(#clip0_6013_33858)">\n<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6013_33858">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>'):(l.innerHTML='<g clip-path="url(#clip0_6083_34804)">\n<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6083_34804">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>',o.innerText="Preview backend running in this workspace."),o.setAttribute("id",t)}"loading"===document.readyState?window.addEventListener("DOMContentLoaded",o):o()}
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
 */function y(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function v(){var e;const t=null==(e=a())?void 0:e.forceEnvironment;if("node"===t)return!0;if("browser"===t)return!1;try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(n){return!1}}function w(){return!v()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function I(){return!v()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function _(){try{return"object"==typeof indexedDB}catch(e){return!1}}class T extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,T.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,b.prototype.create)}}class b{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],s=i?function(e,t){return e.replace(E,(e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`})}(i,n):"Error",o=`${this.serviceName}: ${s} (${r}).`;return new T(r,o,n)}}const E=/\{\$([^}]+)}/g;function S(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const i of n){if(!r.includes(i))return!1;const n=e[i],s=t[i];if(A(n)&&A(s)){if(!S(n,s))return!1}else if(n!==s)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function A(e){return null!==e&&"object"==typeof e}
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
 */function C(e){const t=[];for(const[n,r]of Object.entries(e))Array.isArray(r)?r.forEach(e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function k(e){const t={};return e.replace(/^\?/,"").split("&").forEach(e=>{if(e){const[n,r]=e.split("=");t[decodeURIComponent(n)]=decodeURIComponent(r)}}),t}function N(e){const t=e.indexOf("?");if(!t)return"";const n=e.indexOf("#",t);return e.substring(t,n>0?n:void 0)}class D{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");r=function(e,t){if("object"!=typeof e||null===e)return!1;for(const n of t)if(n in e&&"function"==typeof e[n])return!0;return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===r.next&&(r.next=R),void 0===r.error&&(r.error=R),void 0===r.complete&&(r.complete=R);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch(e){}}),this.observers.push(r),i}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(n){"undefined"!=typeof console&&console.error}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function R(){}
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
 */function P(e){return e&&e._delegate?e._delegate:e}class O{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
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
 */const x="[DEFAULT]";
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
 */class L{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new h;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=(null==e?void 0:e.optional)??!1;if(!this.isInitialized(t)&&!this.shouldAutoInitialize()){if(n)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(n)return null;throw r}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
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
 */(e))try{this.getOrInitializeService({instanceIdentifier:x})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=x){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=x){return this.instances.has(e)}getOptions(e=x){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,s]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(i)&&s.resolve(r)}return r}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(n)??new Set;r.add(e),this.onInitCallbacks.set(n,r);const i=this.instances.get(n);return i&&e(i,n),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const r of n)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===x?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}var r;return n||null}normalizeInstanceIdentifier(e=x){return this.component?this.component.multipleInstances?e:x:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class M{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new L(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
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
 */var F,V;(V=F||(F={}))[V.DEBUG=0]="DEBUG",V[V.VERBOSE=1]="VERBOSE",V[V.INFO=2]="INFO",V[V.WARN=3]="WARN",V[V.ERROR=4]="ERROR",V[V.SILENT=5]="SILENT";const U={debug:F.DEBUG,verbose:F.VERBOSE,info:F.INFO,warn:F.WARN,error:F.ERROR,silent:F.SILENT},q=F.INFO,B={[F.DEBUG]:"log",[F.VERBOSE]:"log",[F.INFO]:"info",[F.WARN]:"warn",[F.ERROR]:"error"},j=(e,t,...n)=>{if(t<e.logLevel)return;(new Date).toISOString();if(!B[t])throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class z{constructor(e){this.name=e,this._logLevel=q,this._logHandler=j,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in F))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?U[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,F.DEBUG,...e),this._logHandler(this,F.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,F.VERBOSE,...e),this._logHandler(this,F.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,F.INFO,...e),this._logHandler(this,F.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,F.WARN,...e),this._logHandler(this,F.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,F.ERROR,...e),this._logHandler(this,F.ERROR,...e)}}let G,$;const K=new WeakMap,H=new WeakMap,W=new WeakMap,Q=new WeakMap,J=new WeakMap;let Y={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return H.get(e);if("objectStoreNames"===t)return e.objectStoreNames||W.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ee(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function X(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?($||($=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(te(this),t),ee(K.get(this))}:function(...t){return ee(e.apply(te(this),t))}:function(t,...n){const r=e.call(te(this),t,...n);return W.set(r,t.sort?t.sort():[t]),ee(r)}}function Z(e){return"function"==typeof e?X(e):(e instanceof IDBTransaction&&function(e){if(H.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});H.set(e,t)}(e),t=e,(G||(G=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(e=>t instanceof e)?new Proxy(e,Y):e);var t}function ee(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{t(ee(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&K.set(t,e)}).catch(()=>{}),J.set(t,e),t}(e);if(Q.has(e))return Q.get(e);const t=Z(e);return t!==e&&(Q.set(e,t),J.set(t,e)),t}const te=e=>J.get(e);const ne=["get","getKey","getAll","getAllKeys","count"],re=["put","add","delete","clear"],ie=new Map;function se(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(ie.get(t))return ie.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=re.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!ne.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,i?"readwrite":"readonly");let o=s.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&s.done]))[0]};return ie.set(t,s),s}Y=(e=>({...e,get:(t,n,r)=>se(t,n)||e.get(t,n,r),has:(t,n)=>!!se(t,n)||e.has(t,n)}))(Y);
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
class oe{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}const ae="@firebase/app",ce="0.14.8",ue=new z("@firebase/app"),le="@firebase/app-compat",he="@firebase/analytics-compat",de="@firebase/analytics",fe="@firebase/app-check-compat",pe="@firebase/app-check",me="@firebase/auth",ge="@firebase/auth-compat",ye="@firebase/database",ve="@firebase/data-connect",we="@firebase/database-compat",Ie="@firebase/functions",_e="@firebase/functions-compat",Te="@firebase/installations",be="@firebase/installations-compat",Ee="@firebase/messaging",Se="@firebase/messaging-compat",Ae="@firebase/performance",Ce="@firebase/performance-compat",ke="@firebase/remote-config",Ne="@firebase/remote-config-compat",De="@firebase/storage",Re="@firebase/storage-compat",Pe="@firebase/firestore",Oe="@firebase/ai",xe="@firebase/firestore-compat",Le="firebase",Me="[DEFAULT]",Fe={[ae]:"fire-core",[le]:"fire-core-compat",[de]:"fire-analytics",[he]:"fire-analytics-compat",[pe]:"fire-app-check",[fe]:"fire-app-check-compat",[me]:"fire-auth",[ge]:"fire-auth-compat",[ye]:"fire-rtdb",[ve]:"fire-data-connect",[we]:"fire-rtdb-compat",[Ie]:"fire-fn",[_e]:"fire-fn-compat",[Te]:"fire-iid",[be]:"fire-iid-compat",[Ee]:"fire-fcm",[Se]:"fire-fcm-compat",[Ae]:"fire-perf",[Ce]:"fire-perf-compat",[ke]:"fire-rc",[Ne]:"fire-rc-compat",[De]:"fire-gcs",[Re]:"fire-gcs-compat",[Pe]:"fire-fst",[xe]:"fire-fst-compat",[Oe]:"fire-vertex","fire-js":"fire-js",[Le]:"fire-js-all"},Ve=new Map,Ue=new Map,qe=new Map;function Be(e,t){try{e.container.addComponent(t)}catch(n){ue.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function je(e){const t=e.name;if(qe.has(t))return ue.debug(`There were multiple attempts to register component ${t}.`),!1;qe.set(t,e);for(const n of Ve.values())Be(n,e);for(const n of Ue.values())Be(n,e);return!0}function ze(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function Ge(e){return null!=e&&void 0!==e.settings}
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
 */const $e=new b("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
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
class Ke{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new O("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw $e.create("app-deleted",{appName:this._name})}}
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
 */const He="12.9.0";function We(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const r={name:Me,automaticDataCollectionEnabled:!0,...t},i=r.name;if("string"!=typeof i||!i)throw $e.create("bad-app-name",{appName:String(i)});if(n||(n=u()),!n)throw $e.create("no-options");const s=Ve.get(i);if(s){if(S(n,s.options)&&S(r,s.config))return s;throw $e.create("duplicate-app",{appName:i})}const o=new M(i);for(const c of qe.values())o.addComponent(c);const a=new Ke(n,r,o);return Ve.set(i,a),a}function Qe(e=Me){const t=Ve.get(e);if(!t&&e===Me&&u())return We();if(!t)throw $e.create("no-app",{appName:e});return t}function Je(){return Array.from(Ve.values())}async function Ye(e){let t=!1;const n=e.name;if(Ve.has(n))t=!0,Ve.delete(n);else if(Ue.has(n)){e.decRefCount()<=0&&(Ue.delete(n),t=!0)}t&&(await Promise.all(e.container.getProviders().map(e=>e.delete())),e.isDeleted=!0)}function Xe(e,t,n){let r=Fe[e]??e;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=t.match(/\s|\//);if(i||s){const e=[`Unable to register library "${r}" with version "${t}":`];return i&&e.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&e.push("and"),s&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void ue.warn(e.join(" "))}je(new O(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}
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
 */const Ze="firebase-heartbeat-store";let et=null;function tt(){return et||(et=function(e,t,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(e,t),a=ee(o);return r&&o.addEventListener("upgradeneeded",e=>{r(ee(o.result),e.oldVersion,e.newVersion,ee(o.transaction),e)}),n&&o.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{s&&e.addEventListener("close",()=>s()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(Ze)}catch(n){}}}).catch(e=>{throw $e.create("idb-open",{originalErrorMessage:e.message})})),et}async function nt(e,t){try{const n=(await tt()).transaction(Ze,"readwrite"),r=n.objectStore(Ze);await r.put(t,rt(e)),await n.done}catch(n){if(n instanceof T)ue.warn(n.message);else{const e=$e.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});ue.warn(e.message)}}}function rt(e){return`${e.name}!${e.options.appId}`}
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
 */class it{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new ot(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=st();if(null==(null==(e=this._heartbeatsCache)?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null==(t=this._heartbeatsCache)?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(e=>e.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
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
 */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){ue.warn(n)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null==(e=this._heartbeatsCache)?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=st(),{heartbeatsToSend:n,unsentEntries:r}=function(e,t=1024){const n=[];let r=e.slice();for(const i of e){const e=n.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),at(n)>t){e.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),at(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),s=i(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return ue.warn(t),""}}}function st(){return(new Date).toISOString().substring(0,10)}class ot{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!_()&&new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var e;t((null==(e=i.error)?void 0:e.message)||"")}}catch(n){t(n)}}).then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await tt()).transaction(Ze),n=await t.objectStore(Ze).get(rt(e));return await t.done,n}catch(t){if(t instanceof T)ue.warn(t.message);else{const e=$e.create("idb-get",{originalErrorMessage:null==t?void 0:t.message});ue.warn(e.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return nt(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return nt(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:[...t.heartbeats,...e.heartbeats]})}}}function at(e){return i(JSON.stringify({version:2,heartbeats:e})).length}var ct;ct="",je(new O("platform-logger",e=>new oe(e),"PRIVATE")),je(new O("heartbeat",e=>new it(e),"PRIVATE")),Xe(ae,ce,ct),Xe(ae,ce,"esm2020"),Xe("fire-js","");
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
Xe("firebase","12.9.0","app");function ut(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const lt=
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
function(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registered for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements.","invalid-hosting-link-domain":"The provided Hosting link domain is not configured in Firebase Hosting or is not owned by the current project. This cannot be a default Hosting domain (`web.app` or `firebaseapp.com`)."}},ht=ut,dt=new b("auth","Firebase",{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}),ft=new z("@firebase/auth");function pt(e,...t){ft.logLevel<=F.ERROR&&ft.error(`Auth (${He}): ${e}`,...t)}
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
 */function mt(e,...t){throw It(e,...t)}function gt(e,...t){return It(e,...t)}function yt(e,t,n){const r={...ht(),[t]:n};return new b("auth","Firebase",r).create(t,{appName:e.name})}function vt(e){return yt(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function wt(e,t,n){if(!(t instanceof n))throw n.name!==t.constructor.name&&mt(e,"argument-error"),yt(e,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function It(e,...t){if("string"!=typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return dt.create(e,...t)}function _t(e,t,...n){if(!e)throw It(t,...n)}function Tt(e){const t="INTERNAL ASSERTION FAILED: "+e;throw pt(t),new Error(t)}function bt(e,t){e||Tt(t)}
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
 */function Et(){var e;return"undefined"!=typeof self&&(null==(e=self.location)?void 0:e.href)||""}function St(){return"http:"===At()||"https:"===At()}function At(){var e;return"undefined"!=typeof self&&(null==(e=self.location)?void 0:e.protocol)||null}
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
 */function Ct(){return!("undefined"!=typeof navigator&&navigator&&"onLine"in navigator&&"boolean"==typeof navigator.onLine&&(St()||function(){const e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}()||"connection"in navigator))||navigator.onLine}
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
class kt{constructor(e,t){this.shortDelay=e,this.longDelay=t,bt(t>e,"Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(y())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return Ct()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}
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
 */function Nt(e,t){bt(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
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
 */class Dt{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void Tt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void Tt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void Tt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
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
 */const Rt={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},Pt=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Ot=new kt(3e4,6e4);
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
 */function xt(e,t){return e.tenantId&&!t.tenantId?{...t,tenantId:e.tenantId}:t}async function Lt(e,t,n,r,i={}){return Mt(e,i,async()=>{let i={},s={};r&&("GET"===t?s=r:i={body:JSON.stringify(r)});const o=C({key:e.config.apiKey,...s}).slice(1),a=await e._getAdditionalHeaders();a["Content-Type"]="application/json",e.languageCode&&(a["X-Firebase-Locale"]=e.languageCode);const c={method:t,headers:a,...i};return"undefined"!=typeof navigator&&"Cloudflare-Workers"===navigator.userAgent||(c.referrerPolicy="no-referrer"),e.emulatorConfig&&d(e.emulatorConfig.host)&&(c.credentials="include"),Dt.fetch()(await Vt(e,e.config.apiHost,n,o),c)})}async function Mt(e,t,n){e._canInitEmulator=!1;const r={...Rt,...t};try{const t=new qt(e),i=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const s=await i.json();if("needConfirmation"in s)throw Bt(e,"account-exists-with-different-credential",s);if(i.ok&&!("errorMessage"in s))return s;{const t=i.ok?s.errorMessage:s.error.message,[n,o]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===n)throw Bt(e,"credential-already-in-use",s);if("EMAIL_EXISTS"===n)throw Bt(e,"email-already-in-use",s);if("USER_DISABLED"===n)throw Bt(e,"user-disabled",s);const a=r[n]||n.toLowerCase().replace(/[_\s]+/g,"-");if(o)throw yt(e,a,o);mt(e,a)}}catch(i){if(i instanceof T)throw i;mt(e,"network-request-failed",{message:String(i)})}}async function Ft(e,t,n,r,i={}){const s=await Lt(e,t,n,r,i);return"mfaPendingCredential"in s&&mt(e,"multi-factor-auth-required",{_serverResponse:s}),s}async function Vt(e,t,n,r){const i=`${t}${n}?${r}`,s=e,o=s.config.emulator?Nt(e.config,i):`${e.config.apiScheme}://${i}`;if(Pt.includes(n)&&(await s._persistenceManagerAvailable,"COOKIE"===s._getPersistenceType())){return s._getPersistence()._getFinalTarget(o).toString()}return o}function Ut(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class qt{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(gt(this.auth,"network-request-failed")),Ot.get())})}}function Bt(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=gt(e,t,r);return i.customData._tokenResponse=n,i}
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
 */function jt(e){return void 0!==e&&void 0!==e.getResponse}function zt(e){return void 0!==e&&void 0!==e.enterprise}class Gt{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Ut(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}
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
 */async function $t(e,t){return Lt(e,"GET","/v2/recaptchaConfig",xt(e,t))}
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
 */async function Kt(e,t){return Lt(e,"POST","/v1/accounts:lookup",t)}
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
 */function Ht(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}
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
 */async function Wt(e,t=!1){const n=P(e),r=await n.getIdToken(t),i=Jt(r);_t(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s="object"==typeof i.firebase?i.firebase:void 0,o=null==s?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Ht(Qt(i.auth_time)),issuedAtTime:Ht(Qt(i.iat)),expirationTime:Ht(Qt(i.exp)),signInProvider:o||null,signInSecondFactor:(null==s?void 0:s.sign_in_second_factor)||null}}function Qt(e){return 1e3*Number(e)}function Jt(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return pt("JWT malformed, contained fewer than 3 sections"),null;try{const e=s(n);return e?JSON.parse(e):(pt("Failed to decode base64 JWT payload"),null)}catch(i){return pt("Caught error parsing JWT payload as JSON",null==i?void 0:i.toString()),null}}function Yt(e){const t=Jt(e);return _t(t,"internal-error"),_t(void 0!==t.exp,"internal-error"),_t(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}
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
 */async function Xt(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof T&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
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
 */(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}class Zt{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===(null==e?void 0:e.code)&&this.schedule(!0))}this.schedule()}}
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
 */class en{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ht(this.lastLoginAt),this.creationTime=Ht(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
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
 */async function tn(e){var t;const n=e.auth,r=await e.getIdToken(),i=await Xt(e,Kt(n,{idToken:r}));_t(null==i?void 0:i.users.length,n,"internal-error");const s=i.users[0];e._notifyReloadListener(s);const o=(null==(t=s.providerUserInfo)?void 0:t.length)?rn(s.providerUserInfo):[],a=(c=e.providerData,u=o,[...c.filter(e=>!u.some(t=>t.providerId===e.providerId)),...u]);var c,u;const l=e.isAnonymous,h=!(e.email&&s.passwordHash||(null==a?void 0:a.length)),d=!!l&&h,f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new en(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(e,f)}async function nn(e){const t=P(e);await tn(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function rn(e){return e.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}
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
class sn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){_t(e.idToken,"internal-error"),_t(void 0!==e.idToken,"internal-error"),_t(void 0!==e.refreshToken,"internal-error");const t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):Yt(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){_t(0!==e.length,"internal-error");const t=Yt(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(_t(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null):this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:i}=await async function(e,t){const n=await Mt(e,{},async()=>{const n=C({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:i}=e.config,s=await Vt(e,r,"/v1/token",`key=${i}`),o=await e._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const a={method:"POST",headers:o,body:n};return e.emulatorConfig&&d(e.emulatorConfig.host)&&(a.credentials="include"),Dt.fetch()(s,a)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}(e,t);this.updateTokensAndExpiration(n,r,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:i}=t,s=new sn;return n&&(_t("string"==typeof n,"internal-error",{appName:e}),s.refreshToken=n),r&&(_t("string"==typeof r,"internal-error",{appName:e}),s.accessToken=r),i&&(_t("number"==typeof i,"internal-error",{appName:e}),s.expirationTime=i),s}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new sn,this.toJSON())}_performRefresh(){return Tt("not implemented")}}
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
 */function on(e,t){_t("string"==typeof e||void 0===e,"internal-error",{appName:t})}class an{constructor({uid:e,auth:t,stsTokenManager:n,...r}){this.providerId="firebase",this.proactiveRefresh=new Zt(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new en(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await Xt(this,this.stsTokenManager.getToken(this.auth,e));return _t(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Wt(this,e)}reload(){return nn(this)}_assign(e){this!==e&&(_t(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>({...e})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new an({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){_t(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await tn(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ge(this.auth.app))return Promise.reject(vt(this.auth));const e=await this.getIdToken();return await Xt(this,async function(e,t){return Lt(e,"POST","/v1/accounts:delete",t)}(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,r=t.email??void 0,i=t.phoneNumber??void 0,s=t.photoURL??void 0,o=t.tenantId??void 0,a=t._redirectEventId??void 0,c=t.createdAt??void 0,u=t.lastLoginAt??void 0,{uid:l,emailVerified:h,isAnonymous:d,providerData:f,stsTokenManager:p}=t;_t(l&&p,e,"internal-error");const m=sn.fromJSON(this.name,p);_t("string"==typeof l,e,"internal-error"),on(n,e.name),on(r,e.name),_t("boolean"==typeof h,e,"internal-error"),_t("boolean"==typeof d,e,"internal-error"),on(i,e.name),on(s,e.name),on(o,e.name),on(a,e.name),on(c,e.name),on(u,e.name);const g=new an({uid:l,auth:e,email:r,emailVerified:h,displayName:n,isAnonymous:d,photoURL:s,phoneNumber:i,tenantId:o,stsTokenManager:m,createdAt:c,lastLoginAt:u});return f&&Array.isArray(f)&&(g.providerData=f.map(e=>({...e}))),a&&(g._redirectEventId=a),g}static async _fromIdTokenResponse(e,t,n=!1){const r=new sn;r.updateFromServerResponse(t);const i=new an({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await tn(i),i}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];_t(void 0!==r.localId,"internal-error");const i=void 0!==r.providerUserInfo?rn(r.providerUserInfo):[],s=!(r.email&&r.passwordHash||(null==i?void 0:i.length)),o=new sn;o.updateFromIdToken(n);const a=new an({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:s}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new en(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash||(null==i?void 0:i.length))};return Object.assign(a,c),a}}
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
 */const cn=new Map;function un(e){bt(e instanceof Function,"Expected a class definition");let t=cn.get(e);return t?(bt(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,cn.set(e,t),t)}
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
 */class ln{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}ln.type="NONE";const hn=ln;
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
 */function dn(e,t,n){return`firebase:${e}:${t}:${n}`}class fn{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:i}=this.auth;this.fullUserKey=dn(this.userKey,r.apiKey,i),this.fullPersistenceKey=dn("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if("string"==typeof e){const t=await Kt(this.auth,{idToken:e}).catch(()=>{});return t?an._fromGetAccountInfoResponse(this.auth,t,e):null}return an._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new fn(un(hn),e,n);const r=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e);let i=r[0]||un(hn);const s=dn(n,e.config.apiKey,e.name);let o=null;for(const c of t)try{const t=await c._get(s);if(t){let n;if("string"==typeof t){const r=await Kt(e,{idToken:t}).catch(()=>{});if(!r)break;n=await an._fromGetAccountInfoResponse(e,r,t)}else n=an._fromJSON(e,t);c!==i&&(o=n),i=c;break}}catch{}const a=r.filter(e=>e._shouldAllowMigration);return i._shouldAllowMigration&&a.length?(i=a[0],o&&await i._set(s,o.toJSON()),await Promise.all(t.map(async e=>{if(e!==i)try{await e._remove(s)}catch{}})),new fn(i,e,n)):new fn(i,e,n)}}
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
 */function pn(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(vn(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(mn(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(In(t))return"Blackberry";if(_n(t))return"Webos";if(gn(t))return"Safari";if((t.includes("chrome/")||yn(t))&&!t.includes("edge/"))return"Chrome";if(wn(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===(null==n?void 0:n.length))return n[1]}return"Other"}function mn(e=y()){return/firefox\//i.test(e)}function gn(e=y()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function yn(e=y()){return/crios\//i.test(e)}function vn(e=y()){return/iemobile/i.test(e)}function wn(e=y()){return/android/i.test(e)}function In(e=y()){return/blackberry/i.test(e)}function _n(e=y()){return/webos/i.test(e)}function Tn(e=y()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function bn(){return function(){const e=y();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}()&&10===document.documentMode}function En(e=y()){return Tn(e)||wn(e)||_n(e)||In(e)||/windows phone/i.test(e)||vn(e)}
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
 */function Sn(e,t=[]){let n;switch(e){case"Browser":n=pn(y());break;case"Worker":n=`${pn(y())}-${e}`;break;default:n=e}const r=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${He}/${r}`}
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
 */class An{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=t=>new Promise((n,r)=>{try{n(e(t))}catch(i){r(i)}});n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const e of t)try{e()}catch(r){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==n?void 0:n.message})}}}
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
 */class Cn{constructor(e){var t;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??6,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),void 0!==n.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),void 0!==n.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),void 0!==n.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),void 0!==n.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(null==(t=e.allowedNonAlphanumericCharacters)?void 0:t.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){let n;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}
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
 */class kn{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Dn(this),this.idTokenSubscription=new Dn(this),this.beforeStateQueue=new An(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=dt,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(e=>this._resolvePersistenceManagerAvailable=e)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=un(t)),this._initializationPromise=this.queue(async()=>{var n,r,i;if(!this._deleted&&(this.persistenceManager=await fn.create(this,e),null==(n=this._resolvePersistenceManagerAvailable)||n.call(this),!this._deleted)){if(null==(r=this._popupRedirectResolver)?void 0:r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(s){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null==(i=this.currentUser)?void 0:i.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void(await this.currentUser.getIdToken())):void(await this._updateCurrentUser(e,!0)):void 0}async initializeCurrentUserFromIdToken(e){try{const t=await Kt(this,{idToken:e}),n=await an._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Ge(this.app)){const e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const n=null==(t=this.redirectUser)?void 0:t._redirectEventId,s=null==r?void 0:r._redirectEventId,o=await this.tryRedirectSignIn(e);n&&n!==s||!(null==o?void 0:o.user)||(r=o.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(s){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(s))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return _t(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await tn(e)}catch(t){if("auth/network-request-failed"!==(null==t?void 0:t.code))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ge(this.app))return Promise.reject(vt(this));const t=e?P(e):null;return t&&_t(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&_t(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ge(this.app)?Promise.reject(vt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ge(this.app)?Promise.reject(vt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(un(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await async function(e,t={}){return Lt(e,"GET","/v2/passwordPolicy",xt(e,t))}
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
 */(this),t=new Cn(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new b("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:await this.currentUser.getIdToken()};null!=this.tenantId&&(t.tenantId=this.tenantId),await async function(e,t){return Lt(e,"POST","/v2/accounts:revokeToken",xt(e,t))}(this,t)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null==(e=this._currentUser)?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&un(e)||this._popupRedirectResolver;_t(t,this,"argument-error"),this.redirectPersistenceManager=await fn.create(this,[un(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),(null==(t=this._currentUser)?void 0:t._redirectEventId)===e?this._currentUser:(null==(n=this.redirectUser)?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const t=(null==(e=this.currentUser)?void 0:e.uid)??null;this.lastNotifiedUid!==t&&(this.lastNotifiedUid=t,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const i="function"==typeof t?t:t.next.bind(t);let s=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(_t(o,this,"internal-error"),o.then(()=>{s||i(this.currentUser)}),"function"==typeof t){const i=e.addObserver(t,n,r);return()=>{s=!0,i()}}{const n=e.addObserver(t);return()=>{s=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return _t(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Sn(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await(null==(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(Ge(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await(null==(e=this.appCheckServiceProvider.getImmediate({optional:!0}))?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){ft.logLevel<=F.WARN&&ft.warn(`Auth (${He}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}}function Nn(e){return P(e)}class Dn{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e,t){const n=new D(e,t);return n.subscribe.bind(n)}(e=>this.observer=e)}get next(){return _t(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
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
 */let Rn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Pn(e){return Rn.loadJS(e)}function On(e){return`__${e}${Math.floor(1e6*Math.random())}`}
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
 */const xn=1e12;class Ln{constructor(e){this.auth=e,this.counter=xn,this._widgets=new Map}render(e,t){const n=this.counter;return this._widgets.set(n,new Vn(e,this.auth.name,t||{})),this.counter++,n}reset(e){var t;const n=e||xn;null==(t=this._widgets.get(n))||t.delete(),this._widgets.delete(n)}getResponse(e){var t;const n=e||xn;return(null==(t=this._widgets.get(n))?void 0:t.getResponse())||""}async execute(e){var t;const n=e||xn;return null==(t=this._widgets.get(n))||t.execute(),""}}class Mn{constructor(){this.enterprise=new Fn}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Fn{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Vn{constructor(e,t,n){this.params=n,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const r="string"==typeof e?document.getElementById(e):e;_t(r,"argument-error",{appName:t}),this.container=r,this.isVisible="invisible"!==this.params.size,this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),this.timerId||(this.timerId=window.setTimeout(()=>{this.responseToken=function(e){const t=[],n="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let r=0;r<e;r++)t.push(n.charAt(Math.floor(Math.random()*n.length)));return t.join("")}(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch(n){}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch(n){}this.isVisible&&this.execute()},6e4)},500))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}const Un="NO_RECAPTCHA";class qn{constructor(e){this.type="recaptcha-enterprise",this.auth=Nn(e)}async verify(e="verify",t=!1){function n(t,n,r){const i=window.grecaptcha;zt(i)?i.enterprise.ready(()=>{i.enterprise.execute(t,{action:e}).then(e=>{n(e)}).catch(()=>{n(Un)})}):r(Error("No reCAPTCHA enterprise script loaded."))}if(this.auth.settings.appVerificationDisabledForTesting){return(new Mn).execute("siteKey",{action:"verify"})}return new Promise((e,r)=>{(async function(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,n)=>{$t(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(r=>{if(void 0!==r.recaptchaKey){const n=new Gt(r);return null==e.tenantId?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,t(n.siteKey)}n(new Error("recaptcha Enterprise site key undefined"))}).catch(e=>{n(e)})})})(this.auth).then(i=>{if(!t&&zt(window.grecaptcha))n(i,e,r);else{if("undefined"==typeof window)return void r(new Error("RecaptchaVerifier is only supported in browser"));let t=Rn.recaptchaEnterpriseScript;0!==t.length&&(t+=i),Pn(t).then(()=>{n(i,e,r)}).catch(e=>{r(e)})}}).catch(e=>{r(e)})})}}async function Bn(e,t,n,r=!1,i=!1){const s=new qn(e);let o;if(i)o=Un;else try{o=await s.verify(n)}catch(c){o=await s.verify(n,!0)}const a={...t};if("mfaSmsEnrollment"===n||"mfaSmsSignIn"===n){if("phoneEnrollmentInfo"in a){const e=a.phoneEnrollmentInfo.phoneNumber,t=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:t,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const e=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:e,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function jn(e,t,n,r,i){var s,o;if("EMAIL_PASSWORD_PROVIDER"===i){if(null==(s=e._getRecaptchaConfig())?void 0:s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Bn(e,t,n,"getOobCode"===n);return r(e,i)}return r(e,t).catch(async i=>{if("auth/missing-recaptcha-token"===i.code){const i=await Bn(e,t,n,"getOobCode"===n);return r(e,i)}return Promise.reject(i)})}if("PHONE_PROVIDER"===i){if(null==(o=e._getRecaptchaConfig())?void 0:o.isProviderEnabled("PHONE_PROVIDER")){const i=await Bn(e,t,n);return r(e,i).catch(async i=>{var s;if("AUDIT"===(null==(s=e._getRecaptchaConfig())?void 0:s.getProviderEnforcementState("PHONE_PROVIDER"))&&("auth/missing-recaptcha-token"===i.code||"auth/invalid-app-credential"===i.code)){const i=await Bn(e,t,n,!1,!0);return r(e,i)}return Promise.reject(i)})}{const i=await Bn(e,t,n,!1,!0);return r(e,i)}}return Promise.reject(i+" provider is not supported.")}async function zn(e){const t=Nn(e),n=await $t(t,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new Gt(n);if(null==t.tenantId?t._agentRecaptchaConfig=r:t._tenantRecaptchaConfigs[t.tenantId]=r,r.isAnyProviderEnabled()){new qn(t).verify()}}
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
 */function Gn(e,t){const n=ze(e,"auth");if(n.isInitialized()){const e=n.getImmediate();if(S(n.getOptions(),t??{}))return e;mt(e,"already-initialized")}return n.initialize({options:t})}function $n(e,t,n){const r=Nn(e);_t(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const i=!!(null==n?void 0:n.disableWarnings),s=Kn(t),{host:o,port:a}=function(e){const t=Kn(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const e=i[1];return{host:e,port:Hn(r.substr(e.length+1))}}{const[e,t]=r.split(":");return{host:e,port:Hn(t)}}}(t),c=null===a?"":`:${a}`,u={url:`${s}//${o}${c}/`},l=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator)return _t(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),void _t(S(u,r.config.emulator)&&S(l,r.emulatorConfig),r,"emulator-config-failed");r.config.emulator=u,r.emulatorConfig=l,r.settings.appVerificationDisabledForTesting=!0,d(o)?(f(`${s}//${o}${c}`),g("Auth",!0)):i||function(){function e(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&console.info;"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}
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
 */()}function Kn(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function Hn(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}class Wn{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Tt("not implemented")}_getIdTokenResponse(e){return Tt("not implemented")}_linkToIdToken(e,t){return Tt("not implemented")}_getReauthenticationResolver(e){return Tt("not implemented")}}
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
 */async function Qn(e,t){return Lt(e,"POST","/v1/accounts:resetPassword",xt(e,t))}async function Jn(e,t){return Lt(e,"POST","/v1/accounts:signUp",t)}
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
async function Yn(e,t){return Ft(e,"POST","/v1/accounts:signInWithPassword",xt(e,t))}async function Xn(e,t){return Lt(e,"POST","/v1/accounts:sendOobCode",xt(e,t))}async function Zn(e,t){return Xn(e,t)}async function er(e,t){return Xn(e,t)}
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
class tr extends Wn{constructor(e,t,n,r=null){super("password",n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new tr(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new tr(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":return jn(e,{returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signInWithPassword",Yn,"EMAIL_PASSWORD_PROVIDER");case"emailLink":
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
return async function(e,t){return Ft(e,"POST","/v1/accounts:signInWithEmailLink",xt(e,t))}(e,{email:this._email,oobCode:this._password});default:mt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return jn(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Jn,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return async function(e,t){return Ft(e,"POST","/v1/accounts:signInWithEmailLink",xt(e,t))}(e,{idToken:t,email:this._email,oobCode:this._password});default:mt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}
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
 */async function nr(e,t){return Ft(e,"POST","/v1/accounts:signInWithIdp",xt(e,t))}
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
 */class rr extends Wn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new rr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):mt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r,...i}=t;if(!n||!r)return null;const s=new rr(n,r);return s.idToken=i.idToken||void 0,s.accessToken=i.accessToken||void 0,s.secret=i.secret,s.nonce=i.nonce,s.pendingToken=i.pendingToken||null,s}_getIdTokenResponse(e){return nr(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,nr(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,nr(e,t)}buildRequest(){const e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=C(t)}return e}}
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
 */async function ir(e,t){return Lt(e,"POST","/v1/accounts:sendVerificationCode",xt(e,t))}const sr={USER_NOT_FOUND:"user-not-found"};
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
class or extends Wn{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new or({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new or({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return async function(e,t){return Ft(e,"POST","/v1/accounts:signInWithPhoneNumber",xt(e,t))}(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return async function(e,t){const n=await Ft(e,"POST","/v1/accounts:signInWithPhoneNumber",xt(e,t));if(n.temporaryProof)throw Bt(e,"account-exists-with-different-credential",n);return n}(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return async function(e,t){return Ft(e,"POST","/v1/accounts:signInWithPhoneNumber",xt(e,{...t,operation:"REAUTH"}),sr)}(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:n,verificationCode:r}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:n,code:r}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){"string"==typeof e&&(e=JSON.parse(e));const{verificationId:t,verificationCode:n,phoneNumber:r,temporaryProof:i}=e;return n||t||r||i?new or({verificationId:t,verificationCode:n,phoneNumber:r,temporaryProof:i}):null}}
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
 */class ar{constructor(e){const t=k(N(e)),n=t.apiKey??null,r=t.oobCode??null,i=function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(t.mode??null);_t(n&&r&&i,"argument-error"),this.apiKey=n,this.operation=i,this.code=r,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=function(e){const t=k(N(e)).link,n=t?k(N(t)).deep_link_id:null,r=k(N(e)).deep_link_id;return(r?k(N(r)).link:null)||r||n||t||e}(e);try{return new ar(t)}catch{return null}}}
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
class cr{constructor(){this.providerId=cr.PROVIDER_ID}static credential(e,t){return tr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=ar.parseLink(t);return _t(n,"argument-error"),tr._fromEmailAndCode(e,n.code,n.tenantId)}}cr.PROVIDER_ID="password",cr.EMAIL_PASSWORD_SIGN_IN_METHOD="password",cr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";
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
class ur{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
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
 */class lr extends ur{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class hr extends lr{static credentialFromJSON(e){const t="string"==typeof e?JSON.parse(e):e;return _t("providerId"in t&&"signInMethod"in t,"argument-error"),rr._fromParams(t)}credential(e){return this._credential({...e,nonce:e.rawNonce})}_credential(e){return _t(e.idToken||e.accessToken,"argument-error"),rr._fromParams({...e,providerId:this.providerId,signInMethod:this.providerId})}static credentialFromResult(e){return hr.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return hr.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n,oauthTokenSecret:r,pendingToken:i,nonce:s,providerId:o}=e;if(!(n||r||t||i))return null;if(!o)return null;try{return new hr(o)._credential({idToken:t,accessToken:n,nonce:s,pendingToken:i})}catch(a){return null}}}
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
 */class dr extends lr{constructor(){super("facebook.com")}static credential(e){return rr._fromParams({providerId:dr.PROVIDER_ID,signInMethod:dr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return dr.credentialFromTaggedObject(e)}static credentialFromError(e){return dr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return dr.credential(e.oauthAccessToken)}catch{return null}}}dr.FACEBOOK_SIGN_IN_METHOD="facebook.com",dr.PROVIDER_ID="facebook.com";
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
class fr extends lr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return rr._fromParams({providerId:fr.PROVIDER_ID,signInMethod:fr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return fr.credentialFromTaggedObject(e)}static credentialFromError(e){return fr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return fr.credential(t,n)}catch{return null}}}fr.GOOGLE_SIGN_IN_METHOD="google.com",fr.PROVIDER_ID="google.com";
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
class pr extends lr{constructor(){super("github.com")}static credential(e){return rr._fromParams({providerId:pr.PROVIDER_ID,signInMethod:pr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return pr.credentialFromTaggedObject(e)}static credentialFromError(e){return pr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return pr.credential(e.oauthAccessToken)}catch{return null}}}pr.GITHUB_SIGN_IN_METHOD="github.com",pr.PROVIDER_ID="github.com";class mr extends Wn{constructor(e,t){super(e,e),this.pendingToken=t}_getIdTokenResponse(e){return nr(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,nr(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,nr(e,t)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r,pendingToken:i}=t;return n&&r&&i&&n===r?new mr(n,i):null}static _create(e,t){return new mr(e,t)}buildRequest(){return{requestUri:"http://localhost",returnSecureToken:!0,pendingToken:this.pendingToken}}}
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
 */class gr extends ur{constructor(e){_t(e.startsWith("saml."),"argument-error"),super(e)}static credentialFromResult(e){return gr.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return gr.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){const t=mr.fromJSON(e);return _t(t,"argument-error"),t}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{pendingToken:t,providerId:n}=e;if(!t||!n)return null;try{return mr._create(n,t)}catch(r){return null}}}
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
 */class yr extends lr{constructor(){super("twitter.com")}static credential(e,t){return rr._fromParams({providerId:yr.PROVIDER_ID,signInMethod:yr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return yr.credentialFromTaggedObject(e)}static credentialFromError(e){return yr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return yr.credential(t,n)}catch{return null}}}
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
async function vr(e,t){return Ft(e,"POST","/v1/accounts:signUp",xt(e,t))}
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
 */yr.TWITTER_SIGN_IN_METHOD="twitter.com",yr.PROVIDER_ID="twitter.com";class wr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const i=await an._fromIdTokenResponse(e,n,r),s=Ir(n);return new wr({user:i,providerId:s,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=Ir(n);return new wr({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function Ir(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
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
 */async function _r(e){var t;if(Ge(e.app))return Promise.reject(vt(e));const n=Nn(e);if(await n._initializationPromise,null==(t=n.currentUser)?void 0:t.isAnonymous)return new wr({user:n.currentUser,providerId:null,operationType:"signIn"});const r=await vr(n,{returnSecureToken:!0}),i=await wr._fromIdTokenResponse(n,"signIn",r,!0);return await n._updateCurrentUser(i.user),i}
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
 */class Tr extends T{constructor(e,t,n,r){super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Tr.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Tr(e,t,n,r)}}function br(e,t,n,r){return("reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(n=>{if("auth/multi-factor-auth-required"===n.code)throw Tr._fromErrorAndOperation(e,n,t,r);throw n})}
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
 */function Er(e){return new Set(e.map(({providerId:e})=>e).filter(e=>!!e))}
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
 */async function Sr(e,t){const n=P(e);await Cr(!0,n,t);const{providerUserInfo:r}=await async function(e,t){return Lt(e,"POST","/v1/accounts:update",t)}(n.auth,{idToken:await n.getIdToken(),deleteProvider:[t]}),i=Er(r||[]);return n.providerData=n.providerData.filter(e=>i.has(e.providerId)),i.has("phone")||(n.phoneNumber=null),await n.auth._persistUserIfCurrent(n),n}async function Ar(e,t,n=!1){const r=await Xt(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return wr._forOperation(e,"link",r)}async function Cr(e,t,n){await tn(t);const r=!1===e?"provider-already-linked":"no-such-provider";_t(Er(t.providerData).has(n)===e,t.auth,r)}
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
 */async function kr(e,t,n=!1){const{auth:r}=e;if(Ge(r.app))return Promise.reject(vt(r));const i="reauthenticate";try{const s=await Xt(e,br(r,i,t,e),n);_t(s.idToken,r,"internal-error");const o=Jt(s.idToken);_t(o,r,"internal-error");const{sub:a}=o;return _t(e.uid===a,r,"user-mismatch"),wr._forOperation(e,i,s)}catch(s){throw"auth/user-not-found"===(null==s?void 0:s.code)&&mt(r,"user-mismatch"),s}}
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
 */async function Nr(e,t,n=!1){if(Ge(e.app))return Promise.reject(vt(e));const r="signIn",i=await br(e,r,t),s=await wr._fromIdTokenResponse(e,r,i);return n||await e._updateCurrentUser(s.user),s}async function Dr(e,t){return Nr(Nn(e),t)}async function Rr(e,t){const n=P(e);return await Cr(!1,n,t.providerId),Ar(n,t)}async function Pr(e,t){return kr(P(e),t)}
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
async function Or(e,t){if(Ge(e.app))return Promise.reject(vt(e));const n=Nn(e),r=await async function(e,t){return Ft(e,"POST","/v1/accounts:signInWithCustomToken",xt(e,t))}(n,{token:t,returnSecureToken:!0}),i=await wr._fromIdTokenResponse(n,"signIn",r);return await n._updateCurrentUser(i.user),i}
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
 */class xr{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?Lr._fromServerResponse(e,t):"totpInfo"in t?Mr._fromServerResponse(e,t):mt(e,"internal-error")}}class Lr extends xr{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new Lr(t)}}class Mr extends xr{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new Mr(t)}}
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
 */function Fr(e,t,n){var r;_t((null==(r=n.url)?void 0:r.length)>0,e,"invalid-continue-uri"),_t(void 0===n.dynamicLinkDomain||n.dynamicLinkDomain.length>0,e,"invalid-dynamic-link-domain"),_t(void 0===n.linkDomain||n.linkDomain.length>0,e,"invalid-hosting-link-domain"),t.continueUrl=n.url,t.dynamicLinkDomain=n.dynamicLinkDomain,t.linkDomain=n.linkDomain,t.canHandleCodeInApp=n.handleCodeInApp,n.iOS&&(_t(n.iOS.bundleId.length>0,e,"missing-ios-bundle-id"),t.iOSBundleId=n.iOS.bundleId),n.android&&(_t(n.android.packageName.length>0,e,"missing-android-pkg-name"),t.androidInstallApp=n.android.installApp,t.androidMinimumVersionCode=n.android.minimumVersion,t.androidPackageName=n.android.packageName)}
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
 */async function Vr(e){const t=Nn(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function Ur(e,t,n){const r=Nn(e),i={requestType:"PASSWORD_RESET",email:t,clientType:"CLIENT_TYPE_WEB"};n&&Fr(r,i,n),await jn(r,i,"getOobCode",Zn,"EMAIL_PASSWORD_PROVIDER")}async function qr(e,t,n){await Qn(P(e),{oobCode:t,newPassword:n}).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Vr(e),t})}async function Br(e,t){await async function(e,t){return Lt(e,"POST","/v1/accounts:update",xt(e,t))}(P(e),{oobCode:t})}async function jr(e,t){const n=P(e),r=await Qn(n,{oobCode:t}),i=r.requestType;switch(_t(i,n,"internal-error"),i){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":_t(r.newEmail,n,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":_t(r.mfaInfo,n,"internal-error");default:_t(r.email,n,"internal-error")}let s=null;return r.mfaInfo&&(s=xr._fromServerResponse(Nn(n),r.mfaInfo)),{data:{email:("VERIFY_AND_CHANGE_EMAIL"===r.requestType?r.newEmail:r.email)||null,previousEmail:("VERIFY_AND_CHANGE_EMAIL"===r.requestType?r.email:r.newEmail)||null,multiFactorInfo:s},operation:i}}async function zr(e,t,n){if(Ge(e.app))return Promise.reject(vt(e));const r=Nn(e),i=jn(r,{returnSecureToken:!0,email:t,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",vr,"EMAIL_PASSWORD_PROVIDER"),s=await i.catch(t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Vr(e),t}),o=await wr._fromIdTokenResponse(r,"signIn",s);return await r._updateCurrentUser(o.user),o}function Gr(e,t,n){return Ge(e.app)?Promise.reject(vt(e)):Dr(P(e),cr.credential(t,n)).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Vr(e),t})}
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
 */async function $r(e,t,n){const r=Nn(e),i={requestType:"EMAIL_SIGNIN",email:t,clientType:"CLIENT_TYPE_WEB"};var s,o;s=i,_t((o=n).handleCodeInApp,r,"argument-error"),o&&Fr(r,s,o),await jn(r,i,"getOobCode",er,"EMAIL_PASSWORD_PROVIDER")}function Kr(e,t){const n=ar.parseLink(t);return"EMAIL_SIGNIN"===(null==n?void 0:n.operation)}async function Hr(e,t,n){if(Ge(e.app))return Promise.reject(vt(e));const r=P(e),i=cr.credentialWithLink(t,n||Et());return _t(i._tenantId===(r.tenantId||null),r,"tenant-id-mismatch"),Dr(r,i)}
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
async function Wr(e,t){const n={identifier:t,continueUri:St()?Et():"http://localhost"},{signinMethods:r}=await async function(e,t){return Lt(e,"POST","/v1/accounts:createAuthUri",xt(e,t))}(P(e),n);return r||[]}async function Qr(e,t){const n=P(e),r={requestType:"VERIFY_EMAIL",idToken:await e.getIdToken()};t&&Fr(n.auth,r,t);const{email:i}=await async function(e,t){return Xn(e,t)}(n.auth,r);i!==e.email&&await e.reload()}async function Jr(e,t,n){const r=P(e),i={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await e.getIdToken(),newEmail:t};n&&Fr(r.auth,i,n);const{email:s}=await async function(e,t){return Xn(e,t)}(r.auth,i);s!==e.email&&await e.reload()}
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
async function Yr(e,{displayName:t,photoURL:n}){if(void 0===t&&void 0===n)return;const r=P(e),i={idToken:await r.getIdToken(),displayName:t,photoUrl:n,returnSecureToken:!0},s=await Xt(r,async function(e,t){return Lt(e,"POST","/v1/accounts:update",t)}(r.auth,i));r.displayName=s.displayName||null,r.photoURL=s.photoUrl||null;const o=r.providerData.find(({providerId:e})=>"password"===e);o&&(o.displayName=r.displayName,o.photoURL=r.photoURL),await r._updateTokensIfNecessary(s)}function Xr(e,t){const n=P(e);return Ge(n.auth.app)?Promise.reject(vt(n.auth)):ei(n,t,null)}function Zr(e,t){return ei(P(e),null,t)}async function ei(e,t,n){const{auth:r}=e,i={idToken:await e.getIdToken(),returnSecureToken:!0};t&&(i.email=t),n&&(i.password=n);const s=await Xt(e,async function(e,t){return Lt(e,"POST","/v1/accounts:update",t)}(r,i));await e._updateTokensIfNecessary(s,!0)}
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
 */class ti{constructor(e,t,n={}){this.isNewUser=e,this.providerId=t,this.profile=n}}class ni extends ti{constructor(e,t,n,r){super(e,t,n),this.username=r}}class ri extends ti{constructor(e,t){super(e,"facebook.com",t)}}class ii extends ni{constructor(e,t){super(e,"github.com",t,"string"==typeof(null==t?void 0:t.login)?null==t?void 0:t.login:null)}}class si extends ti{constructor(e,t){super(e,"google.com",t)}}class oi extends ni{constructor(e,t,n){super(e,"twitter.com",t,n)}}function ai(e){const{user:t,_tokenResponse:n}=e;return t.isAnonymous&&!n?{providerId:null,isNewUser:!1,profile:null}:function(e){var t,n;if(!e)return null;const{providerId:r}=e,i=e.rawUserInfo?JSON.parse(e.rawUserInfo):{},s=e.isNewUser||"identitytoolkit#SignupNewUserResponse"===e.kind;if(!r&&(null==e?void 0:e.idToken)){const r=null==(n=null==(t=Jt(e.idToken))?void 0:t.firebase)?void 0:n.sign_in_provider;if(r)return new ti(s,"anonymous"!==r&&"custom"!==r?r:null)}if(!r)return null;switch(r){case"facebook.com":return new ri(s,i);case"github.com":return new ii(s,i);case"google.com":return new si(s,i);case"twitter.com":return new oi(s,i,e.screenName||null);case"custom":case"anonymous":return new ti(s,null);default:return new ti(s,r,i)}}(n)}
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
 */function ci(e,t){return P(e).setPersistence(t)}function ui(e,t,n,r){return P(e).onIdTokenChanged(t,n,r)}function li(e,t,n){return P(e).beforeAuthStateChanged(t,n)}function hi(e,t,n,r){return P(e).onAuthStateChanged(t,n,r)}function di(e){return P(e).signOut()}function fi(e,t){return Nn(e).revokeAccessToken(t)}async function pi(e){return P(e).delete()}
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
 */class mi{constructor(e,t,n){this.type=e,this.credential=t,this.user=n}static _fromIdtoken(e,t){return new mi("enroll",e,t)}static _fromMfaPendingCredential(e){return new mi("signin",e)}toJSON(){const e="enroll"===this.type?"idToken":"pendingCredential";return{multiFactorSession:{[e]:this.credential}}}static fromJSON(e){var t,n;if(null==e?void 0:e.multiFactorSession){if(null==(t=e.multiFactorSession)?void 0:t.pendingCredential)return mi._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if(null==(n=e.multiFactorSession)?void 0:n.idToken)return mi._fromIdtoken(e.multiFactorSession.idToken)}return null}}
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
 */class gi{constructor(e,t,n){this.session=e,this.hints=t,this.signInResolver=n}static _fromError(e,t){const n=Nn(e),r=t.customData._serverResponse,i=(r.mfaInfo||[]).map(e=>xr._fromServerResponse(n,e));_t(r.mfaPendingCredential,n,"internal-error");const s=mi._fromMfaPendingCredential(r.mfaPendingCredential);return new gi(s,i,async e=>{const i=await e._process(n,s);delete r.mfaInfo,delete r.mfaPendingCredential;const o={...r,idToken:i.idToken,refreshToken:i.refreshToken};switch(t.operationType){case"signIn":const e=await wr._fromIdTokenResponse(n,t.operationType,o);return await n._updateCurrentUser(e.user),e;case"reauthenticate":return _t(t.user,n,"internal-error"),wr._forOperation(t.user,t.operationType,o);default:mt(n,"internal-error")}})}async resolveSignIn(e){const t=e;return this.signInResolver(t)}}
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
function yi(e,t){return Lt(e,"POST","/v2/accounts/mfaEnrollment:start",xt(e,t))}class vi{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(t=>{t.mfaInfo&&(this.enrolledFactors=t.mfaInfo.map(t=>xr._fromServerResponse(e.auth,t)))})}static _fromUser(e){return new vi(e)}async getSession(){return mi._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,t){const n=e,r=await this.getSession(),i=await Xt(this.user,n._process(this.user.auth,r,t));return await this.user._updateTokensIfNecessary(i),this.user.reload()}async unenroll(e){const t="string"==typeof e?e:e.uid,n=await this.user.getIdToken();try{const e=await Xt(this.user,(r=this.user.auth,i={idToken:n,mfaEnrollmentId:t},Lt(r,"POST","/v2/accounts/mfaEnrollment:withdraw",xt(r,i))));this.enrolledFactors=this.enrolledFactors.filter(({uid:e})=>e!==t),await this.user._updateTokensIfNecessary(e),await this.user.reload()}catch(s){throw s}var r,i}}const wi=new WeakMap;const Ii="__sak";
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
 */class _i{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ii,"1"),this.storage.removeItem(Ii),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}
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
 */class Ti extends _i{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=En(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys((e,t,n)=>{this.notifyListeners(e,n)});const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},i=this.storage.getItem(n);bn()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,10):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ti.type="LOCAL";const bi=Ti;
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
 */function Ei(e){var t;const n=e.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),r=RegExp(`${n}=([^;]+)`);return(null==(t=document.cookie.match(r))?void 0:t[1])??null}function Si(e){return`${"http:"===window.location.protocol?"__dev_":"__HOST-"}FIREBASE_${e.split(":")[3]}`}class Ai{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(void 0===typeof window)return e;const t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return!("boolean"==typeof isSecureContext&&!isSecureContext)&&("undefined"!=typeof navigator&&"undefined"!=typeof document&&(navigator.cookieEnabled??!0))}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;const t=Si(e);if(window.cookieStore){const e=await window.cookieStore.get(t);return null==e?void 0:e.value}return Ei(t)}async _remove(e){if(!this._isAvailable())return;if(!(await this._get(e)))return;const t=Si(e);document.cookie=`${t}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;const n=Si(e);if(window.cookieStore){const e=e=>{const r=e.changed.find(e=>e.name===n);r&&t(r.value);e.deleted.find(e=>e.name===n)&&t(null)},r=()=>window.cookieStore.removeEventListener("change",e);return this.listenerUnsubscribes.set(t,r),window.cookieStore.addEventListener("change",e)}let r=Ei(n);const i=setInterval(()=>{const e=Ei(n);e!==r&&(t(e),r=e)},1e3);this.listenerUnsubscribes.set(t,()=>clearInterval(i))}_removeListener(e,t){const n=this.listenerUnsubscribes.get(t);n&&(n(),this.listenerUnsubscribes.delete(t))}}Ai.type="COOKIE";const Ci=Ai;
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
 */class ki extends _i{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}ki.type="SESSION";const Ni=ki;
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
class Di{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;const n=new Di(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:i}=t.data,s=this.handlersMap[r];if(!(null==s?void 0:s.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const o=Array.from(s).map(async e=>e(t.origin,i)),a=await function(e){return Promise.all(e.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}(o);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
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
function Ri(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
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
 */Di.receivers=[];class Pi{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,s;return new Promise((o,a)=>{const c=Ri("",20);r.port1.start();const u=setTimeout(()=>{a(new Error("unsupported_event"))},n);s={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===c)switch(t.data.status){case"ack":clearTimeout(u),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),o(t.data.response);break;default:clearTimeout(u),clearTimeout(i),a(new Error("invalid_response"))}}},this.handlers.add(s),r.port1.addEventListener("message",s.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[r.port2])}).finally(()=>{s&&this.removeMessageHandler(s)})}}
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
 */function Oi(){return window}
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
function xi(){return void 0!==Oi().WorkerGlobalScope&&"function"==typeof Oi().importScripts}
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
const Li="firebaseLocalStorageDb",Mi="firebaseLocalStorage",Fi="fbase_key";class Vi{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ui(e,t){return e.transaction([Mi],t?"readwrite":"readonly").objectStore(Mi)}function qi(){const e=indexedDB.open(Li,1);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const t=e.result;try{t.createObjectStore(Mi,{keyPath:Fi})}catch(r){n(r)}}),e.addEventListener("success",async()=>{const n=e.result;n.objectStoreNames.contains(Mi)?t(n):(n.close(),await function(){const e=indexedDB.deleteDatabase(Li);return new Vi(e).toPromise()}(),t(await qi()))})})}async function Bi(e,t,n){const r=Ui(e,!0).put({[Fi]:t,value:n});return new Vi(r).toPromise()}function ji(e,t){const n=Ui(e,!0).delete(t);return new Vi(n).toPromise()}class zi{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await qi()),this.db}async _withRetries(e){let t=0;for(;;)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>3)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return xi()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Di._getInstance(xi()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await async function(){if(!(null==navigator?void 0:navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}(),!this.activeServiceWorker)return;this.sender=new Pi(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&(null==(e=n[0])?void 0:e.fulfilled)&&(null==(t=n[0])?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null==(t=null==navigator?void 0:navigator.serviceWorker)?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await qi();return await Bi(e,Ii,"1"),await ji(e,Ii),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Bi(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(t=>async function(e,t){const n=Ui(e,!1).get(t),r=await new Vi(n).toPromise();return void 0===r?null:r.value}(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>ji(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(e=>{const t=Ui(e,!1).getAll();return new Vi(t).toPromise()});if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;if(0!==e.length)for(const{fbase_key:r,value:i}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}zi.type="LOCAL";const Gi=zi;
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
 */function $i(e,t){return Lt(e,"POST","/v2/accounts/mfaSignIn:start",xt(e,t))}
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
const Ki=On("rcb"),Hi=new kt(3e4,6e4);class Wi{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!(null==(e=Oi().grecaptcha)?void 0:e.render)}load(e,t=""){return _t(function(e){return e.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(e)}(t),e,"argument-error"),this.shouldResolveImmediately(t)&&jt(Oi().grecaptcha)?Promise.resolve(Oi().grecaptcha):new Promise((n,r)=>{const i=Oi().setTimeout(()=>{r(gt(e,"network-request-failed"))},Hi.get());Oi()[Ki]=()=>{Oi().clearTimeout(i),delete Oi()[Ki];const s=Oi().grecaptcha;if(!s||!jt(s))return void r(gt(e,"internal-error"));const o=s.render;s.render=(e,t)=>{const n=o(e,t);return this.counter++,n},this.hostLanguage=t,n(s)};Pn(`${Rn.recaptchaV2Script}?${C({onload:Ki,render:"explicit",hl:t})}`).catch(()=>{clearTimeout(i),r(gt(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!(null==(t=Oi().grecaptcha)?void 0:t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}class Qi{async load(e){return new Ln(e)}clearedOneInstance(){}}
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
 */const Ji="recaptcha",Yi={theme:"light",type:"image"};class Xi{constructor(e,t,n={...Yi}){this.parameters=n,this.type=Ji,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=Nn(e),this.isInvisible="invisible"===this.parameters.size,_t("undefined"!=typeof document,this.auth,"operation-not-supported-in-this-environment");const r="string"==typeof t?document.getElementById(t):t;_t(r,this.auth,"argument-error"),this.container=r,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new Qi:new Wi,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),n=t.getResponse(e);return n||new Promise(n=>{const r=e=>{e&&(this.tokenChangeListeners.delete(r),n(e))};this.tokenChangeListeners.add(r),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise||(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e})),this.renderPromise}_reset(){this.assertNotDestroyed(),null!==this.widgetId&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){_t(!this.parameters.sitekey,this.auth,"argument-error"),_t(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),_t("undefined"!=typeof document,this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(e=>e(t)),"function"==typeof e)e(t);else if("string"==typeof e){const n=Oi()[e];"function"==typeof n&&n(t)}}}assertNotDestroyed(){_t(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){_t(St()&&!xi(),this.auth,"internal-error"),await function(){let e=null;return new Promise(t=>{"complete"!==document.readyState?(e=()=>t(),window.addEventListener("load",e)):t()}).catch(t=>{throw e&&window.removeEventListener("load",e),t})}
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
 */(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await async function(e){return(await Lt(e,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}(this.auth);_t(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return _t(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}class Zi{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=or._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function es(e,t,n){if(Ge(e.app))return Promise.reject(vt(e));const r=Nn(e),i=await ns(r,t,P(n));return new Zi(i,e=>Dr(r,e))}async function ts(e,t,n){const r=P(e);await Cr(!1,r,"phone");const i=await ns(r.auth,t,P(n));return new Zi(i,e=>Rr(r,e))}async function ns(e,t,n){var r;if(!e._getRecaptchaConfig())try{await zn(e)}catch(i){}try{let i;if(i="string"==typeof t?{phoneNumber:t}:t,"session"in i){const t=i.session;if("phoneNumber"in i){_t("enroll"===t.type,e,"internal-error");const r={idToken:t.credential,phoneEnrollmentInfo:{phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"}},s=jn(e,r,"mfaSmsEnrollment",async(e,t)=>{if(t.phoneEnrollmentInfo.captchaResponse===Un){_t((null==n?void 0:n.type)===Ji,e,"argument-error");return yi(e,await rs(e,t,n))}return yi(e,t)},"PHONE_PROVIDER");return(await s.catch(e=>Promise.reject(e))).phoneSessionInfo.sessionInfo}{_t("signin"===t.type,e,"internal-error");const s=(null==(r=i.multiFactorHint)?void 0:r.uid)||i.multiFactorUid;_t(s,e,"missing-multi-factor-info");const o={mfaPendingCredential:t.credential,mfaEnrollmentId:s,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}},a=jn(e,o,"mfaSmsSignIn",async(e,t)=>{if(t.phoneSignInInfo.captchaResponse===Un){_t((null==n?void 0:n.type)===Ji,e,"argument-error");return $i(e,await rs(e,t,n))}return $i(e,t)},"PHONE_PROVIDER");return(await a.catch(e=>Promise.reject(e))).phoneResponseInfo.sessionInfo}}{const t={phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"},r=jn(e,t,"sendVerificationCode",async(e,t)=>{if(t.captchaResponse===Un){_t((null==n?void 0:n.type)===Ji,e,"argument-error");return ir(e,await rs(e,t,n))}return ir(e,t)},"PHONE_PROVIDER");return(await r.catch(e=>Promise.reject(e))).sessionInfo}}finally{null==n||n._reset()}}async function rs(e,t,n){_t(n.type===Ji,e,"argument-error");const r=await n.verify();_t("string"==typeof r,e,"argument-error");const i={...t};if("phoneEnrollmentInfo"in i){const e=i.phoneEnrollmentInfo.phoneNumber,t=i.phoneEnrollmentInfo.captchaResponse,n=i.phoneEnrollmentInfo.clientType,s=i.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(i,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:r,captchaResponse:t,clientType:n,recaptchaVersion:s}}),i}if("phoneSignInInfo"in i){const e=i.phoneSignInInfo.captchaResponse,t=i.phoneSignInInfo.clientType,n=i.phoneSignInInfo.recaptchaVersion;return Object.assign(i,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:e,clientType:t,recaptchaVersion:n}}),i}return Object.assign(i,{recaptchaToken:r}),i}
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
 */class is{constructor(e){this.providerId=is.PROVIDER_ID,this.auth=Nn(e)}verifyPhoneNumber(e,t){return ns(this.auth,e,P(t))}static credential(e,t){return or._fromVerification(e,t)}static credentialFromResult(e){const t=e;return is.credentialFromTaggedObject(t)}static credentialFromError(e){return is.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:t,temporaryProof:n}=e;return t&&n?or._fromTokenResponse(t,n):null}}
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
function ss(e,t){return t?un(t):(_t(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}
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
 */is.PROVIDER_ID="phone",is.PHONE_SIGN_IN_METHOD="phone";class os extends Wn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return nr(e,this._buildIdpRequest())}_linkToIdToken(e,t){return nr(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return nr(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function as(e){return Nr(e.auth,new os(e),e.bypassAuthState)}function cs(e){const{auth:t,user:n}=e;return _t(n,t,"internal-error"),kr(n,new os(e),e.bypassAuthState)}async function us(e){const{auth:t,user:n}=e;return _t(n,t,"internal-error"),Ar(n,new os(e),e.bypassAuthState)}
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
 */class ls{constructor(e,t,n,r,i=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:i,error:s,type:o}=e;if(s)return void this.reject(s);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return as;case"linkViaPopup":case"linkViaRedirect":return us;case"reauthViaPopup":case"reauthViaRedirect":return cs;default:mt(this.auth,"internal-error")}}resolve(e){bt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){bt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
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
 */const hs=new kt(2e3,1e4);async function ds(e,t,n){if(Ge(e.app))return Promise.reject(gt(e,"operation-not-supported-in-this-environment"));const r=Nn(e);wt(e,t,ur);const i=ss(r,n);return new ps(r,"signInViaPopup",t,i).executeNotNull()}async function fs(e,t,n){const r=P(e);wt(r.auth,t,ur);const i=ss(r.auth,n);return new ps(r.auth,"linkViaPopup",t,i,r).executeNotNull()}class ps extends ls{constructor(e,t,n,r,i){super(e,t,r,i),this.provider=n,this.authWindow=null,this.pollId=null,ps.currentPopupAction&&ps.currentPopupAction.cancel(),ps.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return _t(e,this.auth,"internal-error"),e}async onExecution(){bt(1===this.filter.length,"Popup operations only handle one event");const e=Ri();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(gt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null==(e=this.authWindow)?void 0:e.associatedEvent)||null}cancel(){this.reject(gt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ps.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;(null==(n=null==(t=this.authWindow)?void 0:t.window)?void 0:n.closed)?this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(gt(this.auth,"popup-closed-by-user"))},8e3):this.pollId=window.setTimeout(e,hs.get())};e()}}ps.currentPopupAction=null;
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
const ms=new Map;class gs extends ls{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=ms.get(this.auth._key());if(!e){try{const t=await async function(e,t){const n=Is(t),r=ws(e);if(!(await r._isAvailable()))return!1;const i="true"===await r._get(n);return await r._remove(n),i}(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}ms.set(this.auth._key(),e)}return this.bypassAuthState||ms.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}async function ys(e,t){return ws(e)._set(Is(t),"true")}function vs(e,t){ms.set(e._key(),t)}function ws(e){return un(e._redirectPersistence)}function Is(e){return dn("pendingRedirect",e.config.apiKey,e.name)}
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
 */function _s(e,t,n){return async function(e,t,n){if(Ge(e.app))return Promise.reject(vt(e));const r=Nn(e);wt(e,t,ur),await r._initializationPromise;const i=ss(r,n);return await ys(i,r),i._openRedirect(r,t,"signInViaRedirect")}(e,t,n)}function Ts(e,t,n){return async function(e,t,n){const r=P(e);wt(r.auth,t,ur),await r.auth._initializationPromise;const i=ss(r.auth,n);await Cr(!1,r,t.providerId),await ys(i,r.auth);const s=await Ss(r);return i._openRedirect(r.auth,t,"linkViaRedirect",s)}(e,t,n)}async function bs(e,t){return await Nn(e)._initializationPromise,Es(e,t,!1)}async function Es(e,t,n=!1){if(Ge(e.app))return Promise.reject(vt(e));const r=Nn(e),i=ss(r,t),s=new gs(r,i,n),o=await s.execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,t)),o}async function Ss(e){const t=Ri(`${e.uid}:::`);return e._redirectEventId=t,await e.auth._setRedirectUser(e),await e.auth._persistUserIfCurrent(e),t}
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
 */class As{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ks(e);default:return!1}}
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
 */(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!ks(e)){const r=(null==(n=e.error.code)?void 0:n.split("auth/")[1])||"internal-error";t.onError(gt(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(Cs(e))}saveEventToCache(e){this.cachedEventUids.add(Cs(e)),this.lastProcessedEventTime=Date.now()}}function Cs(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function ks({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===(null==t?void 0:t.code)}
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
const Ns=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Ds=/^https?/;async function Rs(e){if(e.config.emulator)return;const{authorizedDomains:t}=await async function(e,t={}){return Lt(e,"GET","/v1/projects",t)}(e);for(const n of t)try{if(Ps(n))return}catch{}mt(e,"unauthorized-domain")}function Ps(e){const t=Et(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const i=new URL(e);return""===i.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&i.hostname===r}if(!Ds.test(n))return!1;if(Ns.test(e))return r===e;const i=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}
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
 */const Os=new kt(3e4,6e4);function xs(){const e=Oi().___jsl;if(null==e?void 0:e.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}function Ls(e){return new Promise((t,n)=>{var r,i,s;function o(){xs(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{xs(),n(gt(e,"network-request-failed"))},timeout:Os.get()})}if(null==(i=null==(r=Oi().gapi)?void 0:r.iframes)?void 0:i.Iframe)t(gapi.iframes.getContext());else{if(!(null==(s=Oi().gapi)?void 0:s.load)){const t=On("iframefcb");return Oi()[t]=()=>{gapi.load?o():n(gt(e,"network-request-failed"))},Pn(`${Rn.gapiScript}?onload=${t}`).catch(e=>n(e))}o()}}).catch(e=>{throw Ms=null,e})}let Ms=null;
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
const Fs=new kt(5e3,15e3),Vs={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Us=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function qs(e){const t=e.config;_t(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?Nt(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,r={apiKey:t.apiKey,appName:e.name,v:He},i=Us.get(e.config.apiHost);i&&(r.eid=i);const s=e._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${C(r).slice(1)}`}async function Bs(e){const t=await function(e){return Ms=Ms||Ls(e),Ms}(e),n=Oi().gapi;return _t(n,e,"internal-error"),t.open({where:document.body,url:qs(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Vs,dontclear:!0},t=>new Promise(async(n,r)=>{await t.restyle({setHideOnLeave:!1});const i=gt(e,"network-request-failed"),s=Oi().setTimeout(()=>{r(i)},Fs.get());function o(){Oi().clearTimeout(s),n(t)}t.ping(o).then(o,()=>{r(i)})}))}
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
 */const js={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};class zs{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function Gs(e,t,n,r=500,i=600){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c={...js,width:r.toString(),height:i.toString(),top:s,left:o},u=y().toLowerCase();n&&(a=yn(u)?"_blank":n),mn(u)&&(t=t||"http://localhost",c.scrollbars="yes");const l=Object.entries(c).reduce((e,[t,n])=>`${e}${t}=${n},`,"");if(function(e=y()){var t;return Tn(e)&&!!(null==(t=window.navigator)?void 0:t.standalone)}(u)&&"_self"!==a)return function(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
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
 */(t||"",a),new zs(null);const h=window.open(t||"",a,l);_t(h,e,"popup-blocked");try{h.focus()}catch(d){}return new zs(h)}const $s="__/auth/handler",Ks="emulator/auth/handler",Hs=encodeURIComponent("fac");async function Ws(e,t,n,r,i,s){_t(e.config.authDomain,e,"auth-domain-config-required"),_t(e.config.apiKey,e,"invalid-api-key");const o={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:He,eventId:i};if(t instanceof ur){t.setDefaultLanguage(e.languageCode),o.providerId=t.providerId||"",function(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries({}))o[e]=t}if(t instanceof lr){const e=t.getScopes().filter(e=>""!==e);e.length>0&&(o.scopes=e.join(","))}e.tenantId&&(o.tid=e.tenantId);const a=o;for(const l of Object.keys(a))void 0===a[l]&&delete a[l];const c=await e._getAppCheckToken(),u=c?`#${Hs}=${encodeURIComponent(c)}`:"";return`${function({config:e}){if(!e.emulator)return`https://${e.authDomain}/${$s}`;return Nt(e,Ks)}
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
 */(e)}?${C(a).slice(1)}${u}`}const Qs="webStorageSupport";const Js=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ni,this._completeRedirectFn=Es,this._overrideRedirectResult=vs}async _openPopup(e,t,n,r){var i;bt(null==(i=this.eventManagers[e._key()])?void 0:i.manager,"_initialize() not called before _openPopup()");return Gs(e,await Ws(e,t,n,Et(),r),Ri())}async _openRedirect(e,t,n,r){await this._originValidation(e);return function(e){Oi().location.href=e}(await Ws(e,t,n,Et(),r)),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(bt(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await Bs(e),n=new As(e);return t.register("authEvent",t=>{_t(null==t?void 0:t.authEvent,e,"invalid-auth-event");return{status:n.onEvent(t.authEvent)?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Qs,{type:Qs},n=>{var r;const i=null==(r=null==n?void 0:n[0])?void 0:r[Qs];void 0!==i&&t(!!i),mt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Rs(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return En()||gn()||Tn()}};class Ys{constructor(e){this.factorId=e}_process(e,t,n){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,n);case"signin":return this._finalizeSignIn(e,t.credential);default:return Tt("unexpected MultiFactorSessionType")}}}class Xs extends Ys{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new Xs(e)}_finalizeEnroll(e,t,n){return function(e,t){return Lt(e,"POST","/v2/accounts/mfaEnrollment:finalize",xt(e,t))}(e,{idToken:t,displayName:n,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return function(e,t){return Lt(e,"POST","/v2/accounts/mfaSignIn:finalize",xt(e,t))}(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class Zs{constructor(){}static assertion(e){return Xs._fromCredential(e)}}Zs.FACTOR_ID="phone";class eo{static assertionForEnrollment(e,t){return to._fromSecret(e,t)}static assertionForSignIn(e,t){return to._fromEnrollmentId(e,t)}static async generateSecret(e){var t;const n=e;_t(void 0!==(null==(t=n.user)?void 0:t.auth),"internal-error");const r=await(i=n.user.auth,s={idToken:n.credential,totpEnrollmentInfo:{}},Lt(i,"POST","/v2/accounts/mfaEnrollment:start",xt(i,s)));var i,s;return no._fromStartTotpMfaEnrollmentResponse(r,n.user.auth)}}eo.FACTOR_ID="totp";class to extends Ys{constructor(e,t,n){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=n}static _fromSecret(e,t){return new to(t,void 0,e)}static _fromEnrollmentId(e,t){return new to(t,e)}async _finalizeEnroll(e,t,n){return _t(void 0!==this.secret,e,"argument-error"),function(e,t){return Lt(e,"POST","/v2/accounts/mfaEnrollment:finalize",xt(e,t))}(e,{idToken:t,displayName:n,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){_t(void 0!==this.enrollmentId&&void 0!==this.otp,e,"argument-error");const n={verificationCode:this.otp};return function(e,t){return Lt(e,"POST","/v2/accounts/mfaSignIn:finalize",xt(e,t))}(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:n})}}class no{constructor(e,t,n,r,i,s,o){this.sessionInfo=s,this.auth=o,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=n,this.codeIntervalSeconds=r,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(e,t){return new no(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var n;let r=!1;return(ro(e)||ro(t))&&(r=!0),r&&(ro(e)&&(e=(null==(n=this.auth.currentUser)?void 0:n.email)||"unknownuser"),ro(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function ro(e){return void 0===e||0===(null==e?void 0:e.length)}var io="@firebase/auth",so="1.12.0";
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
class oo{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null==(e=this.auth.currentUser)?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;return{accessToken:await this.auth.currentUser.getIdToken(e)}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){_t(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
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
const ao=l("authIdTokenMaxAge")||300;let co=null;function uo(e=Qe()){const t=ze(e,"auth");if(t.isInitialized())return t.getImmediate();const n=Gn(e,{popupRedirectResolver:Js,persistence:[Gi,bi,Ni]}),r=l("authTokenSyncURL");if(r&&"boolean"==typeof isSecureContext&&isSecureContext){const e=new URL(r,location.origin);if(location.origin===e.origin){const t=(i=e.toString(),async e=>{const t=e&&await e.getIdTokenResult(),n=t&&((new Date).getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>ao)return;const r=null==t?void 0:t.token;co!==r&&(co=r,await fetch(i,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))});li(n,t,()=>t(n.currentUser)),ui(n,e=>t(e))}}var i;const s=c("auth");return s&&$n(n,`http://${s}`),n}var lo;Rn={loadJS:e=>new Promise((t,n)=>{const r=document.createElement("script");var i;r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=gt("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",((null==(i=document.getElementsByTagName("head"))?void 0:i[0])??document).appendChild(r)}),gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="},lo="Browser",je(new O("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:s,authDomain:o}=n.options;_t(s&&!s.includes(":"),"invalid-api-key",{appName:n.name});const a={apiKey:s,authDomain:o,clientPlatform:lo,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Sn(lo)},c=new kn(n,r,i,a);return function(e,t){const n=(null==t?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(un);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,null==t?void 0:t.popupRedirectResolver)}(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),je(new O("auth-internal",e=>{const t=Nn(e.getProvider("auth").getImmediate());return new oo(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Xe(io,so,function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(lo)),Xe(io,so,"esm2020");const ho=Object.freeze(Object.defineProperty({__proto__:null,ActionCodeOperation:{EMAIL_SIGNIN:"EMAIL_SIGNIN",PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:"REVERT_SECOND_FACTOR_ADDITION",VERIFY_AND_CHANGE_EMAIL:"VERIFY_AND_CHANGE_EMAIL",VERIFY_EMAIL:"VERIFY_EMAIL"},ActionCodeURL:ar,AuthCredential:Wn,AuthErrorCodes:{ADMIN_ONLY_OPERATION:"auth/admin-restricted-operation",ARGUMENT_ERROR:"auth/argument-error",APP_NOT_AUTHORIZED:"auth/app-not-authorized",APP_NOT_INSTALLED:"auth/app-not-installed",CAPTCHA_CHECK_FAILED:"auth/captcha-check-failed",CODE_EXPIRED:"auth/code-expired",CORDOVA_NOT_READY:"auth/cordova-not-ready",CORS_UNSUPPORTED:"auth/cors-unsupported",CREDENTIAL_ALREADY_IN_USE:"auth/credential-already-in-use",CREDENTIAL_MISMATCH:"auth/custom-token-mismatch",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"auth/requires-recent-login",DEPENDENT_SDK_INIT_BEFORE_AUTH:"auth/dependent-sdk-initialized-before-auth",DYNAMIC_LINK_NOT_ACTIVATED:"auth/dynamic-link-not-activated",EMAIL_CHANGE_NEEDS_VERIFICATION:"auth/email-change-needs-verification",EMAIL_EXISTS:"auth/email-already-in-use",EMULATOR_CONFIG_FAILED:"auth/emulator-config-failed",EXPIRED_OOB_CODE:"auth/expired-action-code",EXPIRED_POPUP_REQUEST:"auth/cancelled-popup-request",INTERNAL_ERROR:"auth/internal-error",INVALID_API_KEY:"auth/invalid-api-key",INVALID_APP_CREDENTIAL:"auth/invalid-app-credential",INVALID_APP_ID:"auth/invalid-app-id",INVALID_AUTH:"auth/invalid-user-token",INVALID_AUTH_EVENT:"auth/invalid-auth-event",INVALID_CERT_HASH:"auth/invalid-cert-hash",INVALID_CODE:"auth/invalid-verification-code",INVALID_CONTINUE_URI:"auth/invalid-continue-uri",INVALID_CORDOVA_CONFIGURATION:"auth/invalid-cordova-configuration",INVALID_CUSTOM_TOKEN:"auth/invalid-custom-token",INVALID_DYNAMIC_LINK_DOMAIN:"auth/invalid-dynamic-link-domain",INVALID_EMAIL:"auth/invalid-email",INVALID_EMULATOR_SCHEME:"auth/invalid-emulator-scheme",INVALID_IDP_RESPONSE:"auth/invalid-credential",INVALID_LOGIN_CREDENTIALS:"auth/invalid-credential",INVALID_MESSAGE_PAYLOAD:"auth/invalid-message-payload",INVALID_MFA_SESSION:"auth/invalid-multi-factor-session",INVALID_OAUTH_CLIENT_ID:"auth/invalid-oauth-client-id",INVALID_OAUTH_PROVIDER:"auth/invalid-oauth-provider",INVALID_OOB_CODE:"auth/invalid-action-code",INVALID_ORIGIN:"auth/unauthorized-domain",INVALID_PASSWORD:"auth/wrong-password",INVALID_PERSISTENCE:"auth/invalid-persistence-type",INVALID_PHONE_NUMBER:"auth/invalid-phone-number",INVALID_PROVIDER_ID:"auth/invalid-provider-id",INVALID_RECIPIENT_EMAIL:"auth/invalid-recipient-email",INVALID_SENDER:"auth/invalid-sender",INVALID_SESSION_INFO:"auth/invalid-verification-id",INVALID_TENANT_ID:"auth/invalid-tenant-id",MFA_INFO_NOT_FOUND:"auth/multi-factor-info-not-found",MFA_REQUIRED:"auth/multi-factor-auth-required",MISSING_ANDROID_PACKAGE_NAME:"auth/missing-android-pkg-name",MISSING_APP_CREDENTIAL:"auth/missing-app-credential",MISSING_AUTH_DOMAIN:"auth/auth-domain-config-required",MISSING_CODE:"auth/missing-verification-code",MISSING_CONTINUE_URI:"auth/missing-continue-uri",MISSING_IFRAME_START:"auth/missing-iframe-start",MISSING_IOS_BUNDLE_ID:"auth/missing-ios-bundle-id",MISSING_OR_INVALID_NONCE:"auth/missing-or-invalid-nonce",MISSING_MFA_INFO:"auth/missing-multi-factor-info",MISSING_MFA_SESSION:"auth/missing-multi-factor-session",MISSING_PHONE_NUMBER:"auth/missing-phone-number",MISSING_PASSWORD:"auth/missing-password",MISSING_SESSION_INFO:"auth/missing-verification-id",MODULE_DESTROYED:"auth/app-deleted",NEED_CONFIRMATION:"auth/account-exists-with-different-credential",NETWORK_REQUEST_FAILED:"auth/network-request-failed",NULL_USER:"auth/null-user",NO_AUTH_EVENT:"auth/no-auth-event",NO_SUCH_PROVIDER:"auth/no-such-provider",OPERATION_NOT_ALLOWED:"auth/operation-not-allowed",OPERATION_NOT_SUPPORTED:"auth/operation-not-supported-in-this-environment",POPUP_BLOCKED:"auth/popup-blocked",POPUP_CLOSED_BY_USER:"auth/popup-closed-by-user",PROVIDER_ALREADY_LINKED:"auth/provider-already-linked",QUOTA_EXCEEDED:"auth/quota-exceeded",REDIRECT_CANCELLED_BY_USER:"auth/redirect-cancelled-by-user",REDIRECT_OPERATION_PENDING:"auth/redirect-operation-pending",REJECTED_CREDENTIAL:"auth/rejected-credential",SECOND_FACTOR_ALREADY_ENROLLED:"auth/second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"auth/maximum-second-factor-count-exceeded",TENANT_ID_MISMATCH:"auth/tenant-id-mismatch",TIMEOUT:"auth/timeout",TOKEN_EXPIRED:"auth/user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"auth/too-many-requests",UNAUTHORIZED_DOMAIN:"auth/unauthorized-continue-uri",UNSUPPORTED_FIRST_FACTOR:"auth/unsupported-first-factor",UNSUPPORTED_PERSISTENCE:"auth/unsupported-persistence-type",UNSUPPORTED_TENANT_OPERATION:"auth/unsupported-tenant-operation",UNVERIFIED_EMAIL:"auth/unverified-email",USER_CANCELLED:"auth/user-cancelled",USER_DELETED:"auth/user-not-found",USER_DISABLED:"auth/user-disabled",USER_MISMATCH:"auth/user-mismatch",USER_SIGNED_OUT:"auth/user-signed-out",WEAK_PASSWORD:"auth/weak-password",WEB_STORAGE_UNSUPPORTED:"auth/web-storage-unsupported",ALREADY_INITIALIZED:"auth/already-initialized",RECAPTCHA_NOT_ENABLED:"auth/recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"auth/missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"auth/invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"auth/invalid-recaptcha-action",MISSING_CLIENT_TYPE:"auth/missing-client-type",MISSING_RECAPTCHA_VERSION:"auth/missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"auth/invalid-recaptcha-version",INVALID_REQ_TYPE:"auth/invalid-req-type",INVALID_HOSTING_LINK_DOMAIN:"auth/invalid-hosting-link-domain"},EmailAuthCredential:tr,EmailAuthProvider:cr,FacebookAuthProvider:dr,FactorId:{PHONE:"phone",TOTP:"totp"},GithubAuthProvider:pr,GoogleAuthProvider:fr,OAuthCredential:rr,OAuthProvider:hr,OperationType:{LINK:"link",REAUTHENTICATE:"reauthenticate",SIGN_IN:"signIn"},PhoneAuthCredential:or,PhoneAuthProvider:is,PhoneMultiFactorGenerator:Zs,ProviderId:{FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PASSWORD:"password",PHONE:"phone",TWITTER:"twitter.com"},RecaptchaVerifier:Xi,SAMLAuthProvider:gr,SignInMethod:{EMAIL_LINK:"emailLink",EMAIL_PASSWORD:"password",FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PHONE:"phone",TWITTER:"twitter.com"},TotpMultiFactorGenerator:eo,TotpSecret:no,TwitterAuthProvider:yr,applyActionCode:Br,beforeAuthStateChanged:li,browserCookiePersistence:Ci,browserLocalPersistence:bi,browserPopupRedirectResolver:Js,browserSessionPersistence:Ni,checkActionCode:jr,confirmPasswordReset:qr,connectAuthEmulator:$n,createUserWithEmailAndPassword:zr,debugErrorMap:lt,deleteUser:pi,fetchSignInMethodsForEmail:Wr,getAdditionalUserInfo:ai,getAuth:uo,getIdToken:function(e,t=!1){return P(e).getIdToken(t)},getIdTokenResult:Wt,getMultiFactorResolver:function(e,t){var n;const r=P(e),i=t;return _t(t.customData.operationType,r,"argument-error"),_t(null==(n=i.customData._serverResponse)?void 0:n.mfaPendingCredential,r,"argument-error"),gi._fromError(r,i)},getRedirectResult:bs,inMemoryPersistence:hn,indexedDBLocalPersistence:Gi,initializeAuth:Gn,initializeRecaptchaConfig:function(e){return zn(e)},isSignInWithEmailLink:Kr,linkWithCredential:Rr,linkWithPhoneNumber:ts,linkWithPopup:fs,linkWithRedirect:Ts,multiFactor:function(e){const t=P(e);return wi.has(t)||wi.set(t,vi._fromUser(t)),wi.get(t)},onAuthStateChanged:hi,onIdTokenChanged:ui,parseActionCodeURL:function(e){return ar.parseLink(e)},prodErrorMap:ht,reauthenticateWithCredential:Pr,reauthenticateWithPhoneNumber:async function(e,t,n){const r=P(e);if(Ge(r.auth.app))return Promise.reject(vt(r.auth));const i=await ns(r.auth,t,P(n));return new Zi(i,e=>Pr(r,e))},reauthenticateWithPopup:async function(e,t,n){const r=P(e);if(Ge(r.auth.app))return Promise.reject(gt(r.auth,"operation-not-supported-in-this-environment"));wt(r.auth,t,ur);const i=ss(r.auth,n);return new ps(r.auth,"reauthViaPopup",t,i,r).executeNotNull()},reauthenticateWithRedirect:function(e,t,n){return async function(e,t,n){const r=P(e);if(wt(r.auth,t,ur),Ge(r.auth.app))return Promise.reject(vt(r.auth));await r.auth._initializationPromise;const i=ss(r.auth,n);await ys(i,r.auth);const s=await Ss(r);return i._openRedirect(r.auth,t,"reauthViaRedirect",s)}(e,t,n)},reload:nn,revokeAccessToken:fi,sendEmailVerification:Qr,sendPasswordResetEmail:Ur,sendSignInLinkToEmail:$r,setPersistence:ci,signInAnonymously:_r,signInWithCredential:Dr,signInWithCustomToken:Or,signInWithEmailAndPassword:Gr,signInWithEmailLink:Hr,signInWithPhoneNumber:es,signInWithPopup:ds,signInWithRedirect:_s,signOut:di,unlink:Sr,updateCurrentUser:function(e,t){return P(e).updateCurrentUser(t)},updateEmail:Xr,updatePassword:Zr,updatePhoneNumber:async function(e,t){const n=P(e);if(Ge(n.auth.app))return Promise.reject(vt(n.auth));await Ar(n,t)},updateProfile:Yr,useDeviceLanguage:function(e){P(e).useDeviceLanguage()},validatePassword:async function(e,t){return Nn(e).validatePassword(t)},verifyBeforeUpdateEmail:Jr,verifyPasswordResetCode:async function(e,t){const{data:n}=await jr(P(e),t);return n.email}},Symbol.toStringTag,{value:"Module"}));var fo,po,mo="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e;
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function t(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}function n(e,t,n){n||(n=0);const r=Array(16);if("string"==typeof t)for(var i=0;i<16;++i)r[i]=t.charCodeAt(n++)|t.charCodeAt(n++)<<8|t.charCodeAt(n++)<<16|t.charCodeAt(n++)<<24;else for(i=0;i<16;++i)r[i]=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24;t=e.g[0],n=e.g[1],i=e.g[2];let s,o=e.g[3];s=t+(o^n&(i^o))+r[0]+3614090360&4294967295,s=o+(i^(t=n+(s<<7&4294967295|s>>>25))&(n^i))+r[1]+3905402710&4294967295,o=t+(s<<12&4294967295|s>>>20),s=i+(n^o&(t^n))+r[2]+606105819&4294967295,s=n+(t^(i=o+(s<<17&4294967295|s>>>15))&(o^t))+r[3]+3250441966&4294967295,s=t+(o^(n=i+(s<<22&4294967295|s>>>10))&(i^o))+r[4]+4118548399&4294967295,s=o+(i^(t=n+(s<<7&4294967295|s>>>25))&(n^i))+r[5]+1200080426&4294967295,o=t+(s<<12&4294967295|s>>>20),s=i+(n^o&(t^n))+r[6]+2821735955&4294967295,s=n+(t^(i=o+(s<<17&4294967295|s>>>15))&(o^t))+r[7]+4249261313&4294967295,s=t+(o^(n=i+(s<<22&4294967295|s>>>10))&(i^o))+r[8]+1770035416&4294967295,s=o+(i^(t=n+(s<<7&4294967295|s>>>25))&(n^i))+r[9]+2336552879&4294967295,o=t+(s<<12&4294967295|s>>>20),s=i+(n^o&(t^n))+r[10]+4294925233&4294967295,s=n+(t^(i=o+(s<<17&4294967295|s>>>15))&(o^t))+r[11]+2304563134&4294967295,s=t+(o^(n=i+(s<<22&4294967295|s>>>10))&(i^o))+r[12]+1804603682&4294967295,s=o+(i^(t=n+(s<<7&4294967295|s>>>25))&(n^i))+r[13]+4254626195&4294967295,o=t+(s<<12&4294967295|s>>>20),s=i+(n^o&(t^n))+r[14]+2792965006&4294967295,s=n+(t^(i=o+(s<<17&4294967295|s>>>15))&(o^t))+r[15]+1236535329&4294967295,s=t+(i^o&((n=i+(s<<22&4294967295|s>>>10))^i))+r[1]+4129170786&4294967295,s=o+(n^i&((t=n+(s<<5&4294967295|s>>>27))^n))+r[6]+3225465664&4294967295,o=t+(s<<9&4294967295|s>>>23),s=i+(t^n&(o^t))+r[11]+643717713&4294967295,s=n+(o^t&((i=o+(s<<14&4294967295|s>>>18))^o))+r[0]+3921069994&4294967295,s=t+(i^o&((n=i+(s<<20&4294967295|s>>>12))^i))+r[5]+3593408605&4294967295,s=o+(n^i&((t=n+(s<<5&4294967295|s>>>27))^n))+r[10]+38016083&4294967295,o=t+(s<<9&4294967295|s>>>23),s=i+(t^n&(o^t))+r[15]+3634488961&4294967295,s=n+(o^t&((i=o+(s<<14&4294967295|s>>>18))^o))+r[4]+3889429448&4294967295,s=t+(i^o&((n=i+(s<<20&4294967295|s>>>12))^i))+r[9]+568446438&4294967295,s=o+(n^i&((t=n+(s<<5&4294967295|s>>>27))^n))+r[14]+3275163606&4294967295,o=t+(s<<9&4294967295|s>>>23),s=i+(t^n&(o^t))+r[3]+4107603335&4294967295,s=n+(o^t&((i=o+(s<<14&4294967295|s>>>18))^o))+r[8]+1163531501&4294967295,s=t+(i^o&((n=i+(s<<20&4294967295|s>>>12))^i))+r[13]+2850285829&4294967295,s=o+(n^i&((t=n+(s<<5&4294967295|s>>>27))^n))+r[2]+4243563512&4294967295,o=t+(s<<9&4294967295|s>>>23),s=i+(t^n&(o^t))+r[7]+1735328473&4294967295,s=n+(o^t&((i=o+(s<<14&4294967295|s>>>18))^o))+r[12]+2368359562&4294967295,s=t+((n=i+(s<<20&4294967295|s>>>12))^i^o)+r[5]+4294588738&4294967295,s=o+((t=n+(s<<4&4294967295|s>>>28))^n^i)+r[8]+2272392833&4294967295,o=t+(s<<11&4294967295|s>>>21),s=i+(o^t^n)+r[11]+1839030562&4294967295,s=n+((i=o+(s<<16&4294967295|s>>>16))^o^t)+r[14]+4259657740&4294967295,s=t+((n=i+(s<<23&4294967295|s>>>9))^i^o)+r[1]+2763975236&4294967295,s=o+((t=n+(s<<4&4294967295|s>>>28))^n^i)+r[4]+1272893353&4294967295,o=t+(s<<11&4294967295|s>>>21),s=i+(o^t^n)+r[7]+4139469664&4294967295,s=n+((i=o+(s<<16&4294967295|s>>>16))^o^t)+r[10]+3200236656&4294967295,s=t+((n=i+(s<<23&4294967295|s>>>9))^i^o)+r[13]+681279174&4294967295,s=o+((t=n+(s<<4&4294967295|s>>>28))^n^i)+r[0]+3936430074&4294967295,o=t+(s<<11&4294967295|s>>>21),s=i+(o^t^n)+r[3]+3572445317&4294967295,s=n+((i=o+(s<<16&4294967295|s>>>16))^o^t)+r[6]+76029189&4294967295,s=t+((n=i+(s<<23&4294967295|s>>>9))^i^o)+r[9]+3654602809&4294967295,s=o+((t=n+(s<<4&4294967295|s>>>28))^n^i)+r[12]+3873151461&4294967295,o=t+(s<<11&4294967295|s>>>21),s=i+(o^t^n)+r[15]+530742520&4294967295,s=n+((i=o+(s<<16&4294967295|s>>>16))^o^t)+r[2]+3299628645&4294967295,s=t+(i^((n=i+(s<<23&4294967295|s>>>9))|~o))+r[0]+4096336452&4294967295,s=o+(n^((t=n+(s<<6&4294967295|s>>>26))|~i))+r[7]+1126891415&4294967295,o=t+(s<<10&4294967295|s>>>22),s=i+(t^(o|~n))+r[14]+2878612391&4294967295,s=n+(o^((i=o+(s<<15&4294967295|s>>>17))|~t))+r[5]+4237533241&4294967295,s=t+(i^((n=i+(s<<21&4294967295|s>>>11))|~o))+r[12]+1700485571&4294967295,s=o+(n^((t=n+(s<<6&4294967295|s>>>26))|~i))+r[3]+2399980690&4294967295,o=t+(s<<10&4294967295|s>>>22),s=i+(t^(o|~n))+r[10]+4293915773&4294967295,s=n+(o^((i=o+(s<<15&4294967295|s>>>17))|~t))+r[1]+2240044497&4294967295,s=t+(i^((n=i+(s<<21&4294967295|s>>>11))|~o))+r[8]+1873313359&4294967295,s=o+(n^((t=n+(s<<6&4294967295|s>>>26))|~i))+r[15]+4264355552&4294967295,o=t+(s<<10&4294967295|s>>>22),s=i+(t^(o|~n))+r[6]+2734768916&4294967295,s=n+(o^((i=o+(s<<15&4294967295|s>>>17))|~t))+r[13]+1309151649&4294967295,s=t+(i^((n=i+(s<<21&4294967295|s>>>11))|~o))+r[4]+4149444226&4294967295,s=o+(n^((t=n+(s<<6&4294967295|s>>>26))|~i))+r[11]+3174756917&4294967295,o=t+(s<<10&4294967295|s>>>22),s=i+(t^(o|~n))+r[2]+718787259&4294967295,s=n+(o^((i=o+(s<<15&4294967295|s>>>17))|~t))+r[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(i+(s<<21&4294967295|s>>>11))&4294967295,e.g[2]=e.g[2]+i&4294967295,e.g[3]=e.g[3]+o&4294967295}function r(e,t){this.h=t;const n=[];let r=!0;for(let i=e.length-1;i>=0;i--){const s=0|e[i];r&&s==t||(n[i]=s,r=!1)}this.g=n}!function(e,t){function n(){}n.prototype=t.prototype,e.F=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.D=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}(t,function(){this.blockSize=-1}),t.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},t.prototype.v=function(e,t){void 0===t&&(t=e.length);const r=t-this.blockSize,i=this.C;let s=this.h,o=0;for(;o<t;){if(0==s)for(;o<=r;)n(this,e,o),o+=this.blockSize;if("string"==typeof e){for(;o<t;)if(i[s++]=e.charCodeAt(o++),s==this.blockSize){n(this,i),s=0;break}}else for(;o<t;)if(i[s++]=e[o++],s==this.blockSize){n(this,i),s=0;break}}this.h=s,this.o+=t},t.prototype.A=function(){var e=Array((this.h<56?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;t=8*this.o;for(var n=e.length-8;n<e.length;++n)e[n]=255&t,t/=256;for(this.v(e),e=Array(16),t=0,n=0;n<4;++n)for(let r=0;r<32;r+=8)e[t++]=this.g[n]>>>r&255;return e};var i={};function s(e){return-128<=e&&e<128?function(e,t){var n=i;return Object.prototype.hasOwnProperty.call(n,e)?n[e]:n[e]=t(e)}(e,function(e){return new r([0|e],e<0?-1:0)}):new r([0|e],e<0?-1:0)}function o(e){if(isNaN(e)||!isFinite(e))return a;if(e<0)return d(o(-e));const t=[];let n=1;for(let r=0;e>=n;r++)t[r]=e/n|0,n*=4294967296;return new r(t,0)}var a=s(0),c=s(1),u=s(16777216);function l(e){if(0!=e.h)return!1;for(let t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function h(e){return-1==e.h}function d(e){const t=e.g.length,n=[];for(let r=0;r<t;r++)n[r]=~e.g[r];return new r(n,~e.h).add(c)}function f(e,t){return e.add(d(t))}function p(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function m(e,t){this.g=e,this.h=t}function g(e,t){if(l(t))throw Error("division by zero");if(l(e))return new m(a,a);if(h(e))return t=g(d(e),t),new m(d(t.g),d(t.h));if(h(t))return t=g(e,d(t)),new m(d(t.g),t.h);if(e.g.length>30){if(h(e)||h(t))throw Error("slowDivide_ only works with positive integers.");for(var n=c,r=t;r.l(e)<=0;)n=y(n),r=y(r);var i=v(n,1),s=v(r,1);for(r=v(r,2),n=v(n,2);!l(r);){var u=s.add(r);u.l(e)<=0&&(i=i.add(n),s=u),r=v(r,1),n=v(n,1)}return t=f(e,i.j(t)),new m(i,t)}for(i=a;e.l(t)>=0;){for(n=Math.max(1,Math.floor(e.m()/t.m())),r=(r=Math.ceil(Math.log(n)/Math.LN2))<=48?1:Math.pow(2,r-48),u=(s=o(n)).j(t);h(u)||u.l(e)>0;)u=(s=o(n-=r)).j(t);l(s)&&(s=c),i=i.add(s),e=f(e,u)}return new m(i,e)}function y(e){const t=e.g.length+1,n=[];for(let r=0;r<t;r++)n[r]=e.i(r)<<1|e.i(r-1)>>>31;return new r(n,e.h)}function v(e,t){const n=t>>5;t%=32;const i=e.g.length-n,s=[];for(let r=0;r<i;r++)s[r]=t>0?e.i(r+n)>>>t|e.i(r+n+1)<<32-t:e.i(r+n);return new r(s,e.h)}(e=r.prototype).m=function(){if(h(this))return-d(this).m();let e=0,t=1;for(let n=0;n<this.g.length;n++){const r=this.i(n);e+=(r>=0?r:4294967296+r)*t,t*=4294967296}return e},e.toString=function(e){if((e=e||10)<2||36<e)throw Error("radix out of range: "+e);if(l(this))return"0";if(h(this))return"-"+d(this).toString(e);const t=o(Math.pow(e,6));var n=this;let r="";for(;;){const i=g(n,t).g;let s=(((n=f(n,i.j(t))).g.length>0?n.g[0]:n.h)>>>0).toString(e);if(l(n=i))return s+r;for(;s.length<6;)s="0"+s;r=s+r}},e.i=function(e){return e<0?0:e<this.g.length?this.g[e]:this.h},e.l=function(e){return h(e=f(this,e))?-1:l(e)?0:1},e.abs=function(){return h(this)?d(this):this},e.add=function(e){const t=Math.max(this.g.length,e.g.length),n=[];let i=0;for(let r=0;r<=t;r++){let t=i+(65535&this.i(r))+(65535&e.i(r)),s=(t>>>16)+(this.i(r)>>>16)+(e.i(r)>>>16);i=s>>>16,t&=65535,s&=65535,n[r]=s<<16|t}return new r(n,-2147483648&n[n.length-1]?-1:0)},e.j=function(e){if(l(this)||l(e))return a;if(h(this))return h(e)?d(this).j(d(e)):d(d(this).j(e));if(h(e))return d(this.j(d(e)));if(this.l(u)<0&&e.l(u)<0)return o(this.m()*e.m());const t=this.g.length+e.g.length,n=[];for(var i=0;i<2*t;i++)n[i]=0;for(i=0;i<this.g.length;i++)for(let t=0;t<e.g.length;t++){const r=this.i(i)>>>16,s=65535&this.i(i),o=e.i(t)>>>16,a=65535&e.i(t);n[2*i+2*t]+=s*a,p(n,2*i+2*t),n[2*i+2*t+1]+=r*a,p(n,2*i+2*t+1),n[2*i+2*t+1]+=s*o,p(n,2*i+2*t+1),n[2*i+2*t+2]+=r*o,p(n,2*i+2*t+2)}for(e=0;e<t;e++)n[e]=n[2*e+1]<<16|n[2*e];for(e=t;e<2*t;e++)n[e]=0;return new r(n,0)},e.B=function(e){return g(this,e).h},e.and=function(e){const t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)&e.i(r);return new r(n,this.h&e.h)},e.or=function(e){const t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)|e.i(r);return new r(n,this.h|e.h)},e.xor=function(e){const t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)^e.i(r);return new r(n,this.h^e.h)},t.prototype.digest=t.prototype.A,t.prototype.reset=t.prototype.u,t.prototype.update=t.prototype.v,po=t,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.B,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=o,r.fromString=function e(t,n){if(0==t.length)throw Error("number format error: empty string");if((n=n||10)<2||36<n)throw Error("radix out of range: "+n);if("-"==t.charAt(0))return d(e(t.substring(1),n));if(t.indexOf("-")>=0)throw Error('number format error: interior "-" character');const r=o(Math.pow(n,8));let i=a;for(let a=0;a<t.length;a+=8){var s=Math.min(8,t.length-a);const e=parseInt(t.substring(a,a+s),n);s<8?(s=o(Math.pow(n,s)),i=i.j(s).add(o(e))):(i=i.j(r),i=i.add(o(e)))}return i},fo=r}).apply(void 0!==mo?mo:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var go,yo,vo,wo,Io,_o,To,bo,Eo="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e,t=Object.defineProperty;var n=function(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof Eo&&Eo];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);function r(e,r){if(r)e:{var i=n;e=e.split(".");for(var s=0;s<e.length-1;s++){var o=e[s];if(!(o in i))break e;i=i[o]}(r=r(s=i[e=e[e.length-1]]))!=s&&null!=r&&t(i,e,{configurable:!0,writable:!0,value:r})}}r("Symbol.dispose",function(e){return e||Symbol("Symbol.dispose")}),r("Array.prototype.values",function(e){return e||function(){return this[Symbol.iterator]()}}),r("Object.entries",function(e){return e||function(e){var t,n=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&n.push([t,e[t]]);return n}});
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
var i=i||{},s=this||self;function o(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function a(e,t,n){return e.call.apply(e.bind,arguments)}function c(e,t,n){return(c=a).apply(null,arguments)}function u(e,t){var n=Array.prototype.slice.call(arguments,1);return function(){var t=n.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function l(e,t){function n(){}n.prototype=t.prototype,e.Z=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.Ob=function(e,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[n].apply(e,i)}}var h="undefined"!=typeof AsyncContext&&"function"==typeof AsyncContext.Snapshot?e=>e&&AsyncContext.Snapshot.wrap(e):e=>e;function d(e){const t=e.length;if(t>0){const n=Array(t);for(let r=0;r<t;r++)n[r]=e[r];return n}return[]}function f(e,t){for(let r=1;r<arguments.length;r++){const t=arguments[r];var n=typeof t;if("array"==(n="object"!=n?n:t?Array.isArray(t)?"array":n:"null")||"object"==n&&"number"==typeof t.length){n=e.length||0;const r=t.length||0;e.length=n+r;for(let i=0;i<r;i++)e[n+i]=t[i]}else e.push(t)}}function p(e){s.setTimeout(()=>{throw e},0)}function m(){var e=I;let t=null;return e.g&&(t=e.g,e.g=e.g.next,e.g||(e.h=null),t.next=null),t}var g=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return this.h>0?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}(()=>new y,e=>e.reset());class y{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let v,w=!1,I=new class{constructor(){this.h=this.g=null}add(e,t){const n=g.get();n.set(e,t),this.h?this.h.next=n:this.g=n,this.h=n}},_=()=>{const e=Promise.resolve(void 0);v=()=>{e.then(T)}};function T(){for(var e;e=m();){try{e.h.call(e.g)}catch(n){p(n)}var t=g;t.j(e),t.h<100&&(t.h++,e.next=t.g,t.g=e)}w=!1}function b(){this.u=this.u,this.C=this.C}function E(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}b.prototype.u=!1,b.prototype.dispose=function(){this.u||(this.u=!0,this.N())},b.prototype[Symbol.dispose]=function(){this.dispose()},b.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},E.prototype.h=function(){this.defaultPrevented=!0};var S=function(){if(!s.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{const e=()=>{};s.addEventListener("test",e,t),s.removeEventListener("test",e,t)}catch(n){}return e}();function A(e){return/^[\s\xa0]*$/.test(e)}function C(e,t){E.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e&&this.init(e,t)}l(C,E),C.prototype.init=function(e,t){const n=this.type=e.type,r=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;this.target=e.target||e.srcElement,this.g=t,(t=e.relatedTarget)||("mouseover"==n?t=e.fromElement:"mouseout"==n&&(t=e.toElement)),this.relatedTarget=t,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType=e.pointerType,this.state=e.state,this.i=e,e.defaultPrevented&&C.Z.h.call(this)},C.prototype.h=function(){C.Z.h.call(this);const e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var k="closure_listenable_"+(1e6*Math.random()|0),N=0;function D(e,t,n,r,i){this.listener=e,this.proxy=null,this.src=t,this.type=n,this.capture=!!r,this.ha=i,this.key=++N,this.da=this.fa=!1}function R(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function P(e,t,n){for(const r in e)t.call(n,e[r],r,e)}function O(e){const t={};for(const n in e)t[n]=e[n];return t}const x="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function L(e,t){let n,r;for(let i=1;i<arguments.length;i++){for(n in r=arguments[i],r)e[n]=r[n];for(let t=0;t<x.length;t++)n=x[t],Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}}function M(e){this.src=e,this.g={},this.h=0}function F(e,t){const n=t.type;if(n in e.g){var r,i=e.g[n],s=Array.prototype.indexOf.call(i,t,void 0);(r=s>=0)&&Array.prototype.splice.call(i,s,1),r&&(R(t),0==e.g[n].length&&(delete e.g[n],e.h--))}}function V(e,t,n,r){for(let i=0;i<e.length;++i){const s=e[i];if(!s.da&&s.listener==t&&s.capture==!!n&&s.ha==r)return i}return-1}M.prototype.add=function(e,t,n,r,i){const s=e.toString();(e=this.g[s])||(e=this.g[s]=[],this.h++);const o=V(e,t,r,i);return o>-1?(t=e[o],n||(t.fa=!1)):((t=new D(t,this.src,s,!!r,i)).fa=n,e.push(t)),t};var U="closure_lm_"+(1e6*Math.random()|0),q={};function B(e,t,n,r,i){if(Array.isArray(t)){for(let s=0;s<t.length;s++)B(e,t[s],n,r,i);return null}return n=W(n),e&&e[k]?e.J(t,n,!!o(r)&&!!r.capture,i):function(e,t,n,r,i,s){if(!t)throw Error("Invalid event type");const a=o(i)?!!i.capture:!!i;let c=K(e);if(c||(e[U]=c=new M(e)),n=c.add(t,n,r,a,s),n.proxy)return n;if(r=function(){function e(n){return t.call(e.src,e.listener,n)}const t=$;return e}(),n.proxy=r,r.src=e,r.listener=n,e.addEventListener)S||(i=a),void 0===i&&(i=!1),e.addEventListener(t.toString(),r,i);else if(e.attachEvent)e.attachEvent(G(t.toString()),r);else{if(!e.addListener||!e.removeListener)throw Error("addEventListener and attachEvent are unavailable.");e.addListener(r)}return n}(e,t,n,!1,r,i)}function j(e,t,n,r,i){if(Array.isArray(t))for(var s=0;s<t.length;s++)j(e,t[s],n,r,i);else r=o(r)?!!r.capture:!!r,n=W(n),e&&e[k]?(e=e.i,(s=String(t).toString())in e.g&&((n=V(t=e.g[s],n,r,i))>-1&&(R(t[n]),Array.prototype.splice.call(t,n,1),0==t.length&&(delete e.g[s],e.h--)))):e&&(e=K(e))&&(t=e.g[t.toString()],e=-1,t&&(e=V(t,n,r,i)),(n=e>-1?t[e]:null)&&z(n))}function z(e){if("number"!=typeof e&&e&&!e.da){var t=e.src;if(t&&t[k])F(t.i,e);else{var n=e.type,r=e.proxy;t.removeEventListener?t.removeEventListener(n,r,e.capture):t.detachEvent?t.detachEvent(G(n),r):t.addListener&&t.removeListener&&t.removeListener(r),(n=K(t))?(F(n,e),0==n.h&&(n.src=null,t[U]=null)):R(e)}}}function G(e){return e in q?q[e]:q[e]="on"+e}function $(e,t){if(e.da)e=!0;else{t=new C(t,this);const n=e.listener,r=e.ha||e.src;e.fa&&z(e),e=n.call(r,t)}return e}function K(e){return(e=e[U])instanceof M?e:null}var H="__closure_events_fn_"+(1e9*Math.random()>>>0);function W(e){return"function"==typeof e?e:(e[H]||(e[H]=function(t){return e.handleEvent(t)}),e[H])}function Q(){b.call(this),this.i=new M(this),this.M=this,this.G=null}function J(e,t){var n,r=e.G;if(r)for(n=[];r;r=r.G)n.push(r);if(e=e.M,r=t.type||t,"string"==typeof t)t=new E(t,e);else if(t instanceof E)t.target=t.target||e;else{var i=t;L(t=new E(r,e),i)}let s,o;if(i=!0,n)for(o=n.length-1;o>=0;o--)s=t.g=n[o],i=Y(s,r,!0,t)&&i;if(s=t.g=e,i=Y(s,r,!0,t)&&i,i=Y(s,r,!1,t)&&i,n)for(o=0;o<n.length;o++)s=t.g=n[o],i=Y(s,r,!1,t)&&i}function Y(e,t,n,r){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();let i=!0;for(let s=0;s<t.length;++s){const o=t[s];if(o&&!o.da&&o.capture==n){const t=o.listener,n=o.ha||o.src;o.fa&&F(e.i,o),i=!1!==t.call(n,r)&&i}}return i&&!r.defaultPrevented}function X(e){e.g=function(e,t){if("function"!=typeof e){if(!e||"function"!=typeof e.handleEvent)throw Error("Invalid listener argument");e=c(e.handleEvent,e)}return Number(t)>2147483647?-1:s.setTimeout(e,t||0)}(()=>{e.g=null,e.i&&(e.i=!1,X(e))},e.l);const t=e.h;e.h=null,e.m.apply(null,t)}l(Q,b),Q.prototype[k]=!0,Q.prototype.removeEventListener=function(e,t,n,r){j(this,e,t,n,r)},Q.prototype.N=function(){if(Q.Z.N.call(this),this.i){var e=this.i;for(const t in e.g){const n=e.g[t];for(let e=0;e<n.length;e++)R(n[e]);delete e.g[t],e.h--}}this.G=null},Q.prototype.J=function(e,t,n,r){return this.i.add(String(e),t,!1,n,r)},Q.prototype.K=function(e,t,n,r){return this.i.add(String(e),t,!0,n,r)};class Z extends b{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:X(this)}N(){super.N(),this.g&&(s.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ee(e){b.call(this),this.h=e,this.g={}}l(ee,b);var te=[];function ne(e){P(e.g,function(e,t){this.g.hasOwnProperty(t)&&z(e)},e),e.g={}}ee.prototype.N=function(){ee.Z.N.call(this),ne(this)},ee.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var re=s.JSON.stringify,ie=s.JSON.parse,se=class{stringify(e){return s.JSON.stringify(e,void 0)}parse(e){return s.JSON.parse(e,void 0)}};function oe(){}function ae(){}var ce={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function ue(){E.call(this,"d")}function le(){E.call(this,"c")}l(ue,E),l(le,E);var he={},de=null;function fe(){return de=de||new Q}function pe(e){E.call(this,he.Ia,e)}function me(e){const t=fe();J(t,new pe(t))}function ge(e,t){E.call(this,he.STAT_EVENT,e),this.stat=t}function ye(e){const t=fe();J(t,new ge(t,e))}function ve(e,t){E.call(this,he.Ja,e),this.size=t}function we(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return s.setTimeout(function(){e()},t)}function Ie(){this.g=!0}function _e(e,t,n,r){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{const s=JSON.parse(t);if(s)for(e=0;e<s.length;e++)if(Array.isArray(s[e])){var n=s[e];if(!(n.length<2)){var r=n[1];if(Array.isArray(r)&&!(r.length<1)){var i=r[0];if("noop"!=i&&"stop"!=i&&"close"!=i)for(let e=1;e<r.length;e++)r[e]=""}}}return re(s)}catch(s){return t}}(e,n)+(r?" "+r:"")})}he.Ia="serverreachability",l(pe,E),he.STAT_EVENT="statevent",l(ge,E),he.Ja="timingevent",l(ve,E),Ie.prototype.ua=function(){this.g=!1},Ie.prototype.info=function(){};var Te,be={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Ee={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"};function Se(){}function Ae(e){return encodeURIComponent(String(e))}function Ce(e){var t=1;e=e.split(":");const n=[];for(;t>0&&e.length;)n.push(e.shift()),t--;return e.length&&n.push(e.join(":")),n}function ke(e,t,n,r){this.j=e,this.i=t,this.l=n,this.S=r||1,this.V=new ee(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Ne}function Ne(){this.i=null,this.g="",this.h=!1}l(Se,oe),Se.prototype.g=function(){return new XMLHttpRequest},Te=new Se;var De={},Re={};function Pe(e,t,n){e.M=1,e.A=rt(Xe(t)),e.u=n,e.R=!0,Oe(e,null)}function Oe(e,t){e.F=Date.now(),Me(e),e.B=Xe(e.A);var n=e.B,r=e.S;Array.isArray(r)||(r=[String(r)]),yt(n.i,"t",r),e.C=0,n=e.j.L,e.h=new Ne,e.g=rn(e.j,n?t:null,!e.u),e.P>0&&(e.O=new Z(c(e.Y,e,e.g),e.P)),t=e.V,n=e.g,r=e.ba;var i="readystatechange";Array.isArray(i)||(i&&(te[0]=i.toString()),i=te);for(let s=0;s<i.length;s++){const e=B(n,i[s],r||t.handleEvent,!1,t.h||t);if(!e)break;t.g[e.key]=e}t=e.J?O(e.J):{},e.u?(e.v||(e.v="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.B,e.v,e.u,t)):(e.v="GET",e.g.ea(e.B,e.v,null,t)),me(),function(e,t,n,r,i,s){e.info(function(){if(e.g)if(s){var o="",a=s.split("&");for(let e=0;e<a.length;e++){var c=a[e].split("=");if(c.length>1){const e=c[0];c=c[1];const t=e.split("_");o=t.length>=2&&"type"==t[1]?o+(e+"=")+c+"&":o+(e+"=redacted&")}}}else o=null;else o=s;return"XMLHTTP REQ ("+r+") [attempt "+i+"]: "+t+"\n"+n+"\n"+o})}(e.i,e.v,e.B,e.l,e.S,e.u)}function xe(e){return!!e.g&&("GET"==e.v&&2!=e.M&&e.j.Aa)}function Le(e,t){var n=e.C,r=t.indexOf("\n",n);return-1==r?Re:(n=Number(t.substring(n,r)),isNaN(n)?De:(r+=1)+n>t.length?Re:(t=t.slice(r,r+n),e.C=r+n,t))}function Me(e){e.T=Date.now()+e.H,Fe(e,e.H)}function Fe(e,t){if(null!=e.D)throw Error("WatchDog timer not null");e.D=we(c(e.aa,e),t)}function Ve(e){e.D&&(s.clearTimeout(e.D),e.D=null)}function Ue(e){0==e.j.I||e.K||Xt(e.j,e)}function qe(e){Ve(e);var t=e.O;t&&"function"==typeof t.dispose&&t.dispose(),e.O=null,ne(e.V),e.g&&(t=e.g,e.g=null,t.abort(),t.dispose())}function Be(e,t){try{var n=e.j;if(0!=n.I&&(n.g==e||Ke(n.h,e)))if(!e.L&&Ke(n.h,e)&&3==n.I){try{var r=n.Ba.g.parse(t)}catch(l){r=null}if(Array.isArray(r)&&3==r.length){var i=r;if(0==i[0]){e:if(!n.v){if(n.g){if(!(n.g.F+3e3<e.F))break e;Yt(n),Bt(n)}Wt(n),ye(18)}}else n.xa=i[1],0<n.xa-n.K&&i[2]<37500&&n.F&&0==n.A&&!n.C&&(n.C=we(c(n.Va,n),6e3));$e(n.h)<=1&&n.ta&&(n.ta=void 0)}else en(n,11)}else if((e.L||n.g==e)&&Yt(n),!A(t))for(i=n.Ba.g.parse(t),t=0;t<i.length;t++){let c=i[t];const l=c[0];if(!(l<=n.K))if(n.K=l,c=c[1],2==n.I)if("c"==c[0]){n.M=c[1],n.ba=c[2];const t=c[3];null!=t&&(n.ka=t,n.j.info("VER="+n.ka));const i=c[4];null!=i&&(n.za=i,n.j.info("SVER="+n.za));const l=c[5];null!=l&&"number"==typeof l&&l>0&&(r=1.5*l,n.O=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const h=e.g;if(h){const e=h.g?h.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var s=r.h;s.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(s.j=s.l,s.g=new Set,s.h&&(He(s,s.h),s.h=null))}if(r.G){const e=h.g?h.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(r.wa=e,nt(r.J,r.G,e))}}n.I=3,n.l&&n.l.ra(),n.aa&&(n.T=Date.now()-e.F,n.j.info("Handshake RTT: "+n.T+"ms"));var o=e;if((r=n).na=nn(r,r.L?r.ba:null,r.W),o.L){We(r.h,o);var a=o,u=r.O;u&&(a.H=u),a.D&&(Ve(a),Me(a)),r.g=o}else Ht(r);n.i.length>0&&zt(n)}else"stop"!=c[0]&&"close"!=c[0]||en(n,7);else 3==n.I&&("stop"==c[0]||"close"==c[0]?"stop"==c[0]?en(n,7):qt(n):"noop"!=c[0]&&n.l&&n.l.qa(c),n.A=0)}me()}catch(l){}}ke.prototype.ba=function(e){e=e.target;const t=this.O;t&&3==Mt(e)?t.j():this.Y(e)},ke.prototype.Y=function(e){try{if(e==this.g)e:{const c=Mt(this.g),u=this.g.ya();this.g.ca();if(!(c<3)&&(3!=c||this.g&&(this.h.h||this.g.la()||Ft(this.g)))){this.K||4!=c||7==u||me(),Ve(this);var t=this.g.ca();this.X=t;var n=function(e){if(!xe(e))return e.g.la();const t=Ft(e.g);if(""===t)return"";let n="";const r=t.length,i=4==Mt(e.g);if(!e.h.i){if("undefined"==typeof TextDecoder)return qe(e),Ue(e),"";e.h.i=new s.TextDecoder}for(let s=0;s<r;s++)e.h.h=!0,n+=e.h.i.decode(t[s],{stream:!(i&&s==r-1)});return t.length=0,e.h.g+=n,e.C=0,e.h.g}(this);if(this.o=200==t,function(e,t,n,r,i,s,o){e.info(function(){return"XMLHTTP RESP ("+r+") [ attempt "+i+"]: "+t+"\n"+n+"\n"+s+" "+o})}(this.i,this.v,this.B,this.l,this.S,c,t),this.o){if(this.U&&!this.L){t:{if(this.g){var r,i=this.g;if((r=i.g?i.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!A(r)){var o=r;break t}}o=null}if(!(e=o)){this.o=!1,this.m=3,ye(12),qe(this),Ue(this);break e}_e(this.i,this.l,e,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Be(this,e)}if(this.R){let t;for(e=!0;!this.K&&this.C<n.length;){if(t=Le(this,n),t==Re){4==c&&(this.m=4,ye(14),e=!1),_e(this.i,this.l,null,"[Incomplete Response]");break}if(t==De){this.m=4,ye(15),_e(this.i,this.l,n,"[Invalid Chunk]"),e=!1;break}_e(this.i,this.l,t,null),Be(this,t)}if(xe(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=c||0!=n.length||this.h.h||(this.m=1,ye(16),e=!1),this.o=this.o&&e,e){if(n.length>0&&!this.W){this.W=!0;var a=this.j;a.g==this&&a.aa&&!a.P&&(a.j.info("Great, no buffering proxy detected. Bytes received: "+n.length),Qt(a),a.P=!0,ye(11))}}else _e(this.i,this.l,n,"[Invalid Chunked Response]"),qe(this),Ue(this)}else _e(this.i,this.l,n,null),Be(this,n);4==c&&qe(this),this.o&&!this.K&&(4==c?Xt(this.j,this):(this.o=!1,Me(this)))}else(function(e){const t={};e=(e.g&&Mt(e)>=2&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<e.length;r++){if(A(e[r]))continue;var n=Ce(e[r]);const i=n[0];if("string"!=typeof(n=n[1]))continue;n=n.trim();const s=t[i]||[];t[i]=s,s.push(n)}!function(e,t){for(const n in e)t.call(void 0,e[n],n,e)}(t,function(e){return e.join(", ")})})(this.g),400==t&&n.indexOf("Unknown SID")>0?(this.m=3,ye(12)):(this.m=0,ye(13)),qe(this),Ue(this)}}}catch(c){}},ke.prototype.cancel=function(){this.K=!0,qe(this)},ke.prototype.aa=function(){this.D=null;const e=Date.now();e-this.T>=0?(function(e,t){e.info(function(){return"TIMEOUT: "+t})}(this.i,this.B),2!=this.M&&(me(),ye(17)),qe(this),this.m=2,Ue(this)):Fe(this,this.T-e)};var je=class{constructor(e,t){this.g=e,this.map=t}};function ze(e){this.l=e||10,s.PerformanceNavigationTiming?e=(e=s.performance.getEntriesByType("navigation")).length>0&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):e=!!(s.chrome&&s.chrome.loadTimes&&s.chrome.loadTimes()&&s.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Ge(e){return!!e.h||!!e.g&&e.g.size>=e.j}function $e(e){return e.h?1:e.g?e.g.size:0}function Ke(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function He(e,t){e.g?e.g.add(t):e.h=t}function We(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function Qe(e){if(null!=e.h)return e.i.concat(e.h.G);if(null!=e.g&&0!==e.g.size){let t=e.i;for(const n of e.g.values())t=t.concat(n.G);return t}return d(e.i)}ze.prototype.cancel=function(){if(this.i=Qe(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const e of this.g.values())e.cancel();this.g.clear()}};var Je=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ye(e){let t;this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1,e instanceof Ye?(this.l=e.l,Ze(this,e.j),this.o=e.o,this.g=e.g,et(this,e.u),this.h=e.h,tt(this,vt(e.i)),this.m=e.m):e&&(t=String(e).match(Je))?(this.l=!1,Ze(this,t[1]||"",!0),this.o=it(t[2]||""),this.g=it(t[3]||"",!0),et(this,t[4]),this.h=it(t[5]||"",!0),tt(this,t[6]||"",!0),this.m=it(t[7]||"")):(this.l=!1,this.i=new dt(null,this.l))}function Xe(e){return new Ye(e)}function Ze(e,t,n){e.j=n?it(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function et(e,t){if(t){if(t=Number(t),isNaN(t)||t<0)throw Error("Bad port number "+t);e.u=t}else e.u=null}function tt(e,t,n){t instanceof dt?(e.i=t,function(e,t){t&&!e.j&&(ft(e),e.i=null,e.g.forEach(function(e,t){const n=t.toLowerCase();t!=n&&(pt(this,t),yt(this,n,e))},e)),e.j=t}(e.i,e.l)):(n||(t=st(t,lt)),e.i=new dt(t,e.l))}function nt(e,t,n){e.i.set(t,n)}function rt(e){return nt(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function it(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function st(e,t,n){return"string"==typeof e?(e=encodeURI(e).replace(t,ot),n&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function ot(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}Ye.prototype.toString=function(){const e=[];var t=this.j;t&&e.push(st(t,at,!0),":");var n=this.g;return(n||"file"==t)&&(e.push("//"),(t=this.o)&&e.push(st(t,at,!0),"@"),e.push(Ae(n).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.u)&&e.push(":",String(n))),(n=this.h)&&(this.g&&"/"!=n.charAt(0)&&e.push("/"),e.push(st(n,"/"==n.charAt(0)?ut:ct,!0))),(n=this.i.toString())&&e.push("?",n),(n=this.m)&&e.push("#",st(n,ht)),e.join("")},Ye.prototype.resolve=function(e){const t=Xe(this);let n=!!e.j;n?Ze(t,e.j):n=!!e.o,n?t.o=e.o:n=!!e.g,n?t.g=e.g:n=null!=e.u;var r=e.h;if(n)et(t,e.u);else if(n=!!e.h){if("/"!=r.charAt(0))if(this.g&&!this.h)r="/"+r;else{var i=t.h.lastIndexOf("/");-1!=i&&(r=t.h.slice(0,i+1)+r)}if(".."==(i=r)||"."==i)r="";else if(-1!=i.indexOf("./")||-1!=i.indexOf("/.")){r=0==i.lastIndexOf("/",0),i=i.split("/");const e=[];for(let t=0;t<i.length;){const n=i[t++];"."==n?r&&t==i.length&&e.push(""):".."==n?((e.length>1||1==e.length&&""!=e[0])&&e.pop(),r&&t==i.length&&e.push("")):(e.push(n),r=!0)}r=e.join("/")}else r=i}return n?t.h=r:n=""!==e.i.toString(),n?tt(t,vt(e.i)):n=!!e.m,n&&(t.m=e.m),t};var at=/[#\/\?@]/g,ct=/[#\?:]/g,ut=/[#\?]/g,lt=/[#\?@]/g,ht=/#/g;function dt(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function ft(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(let n=0;n<e.length;n++){const r=e[n].indexOf("=");let i,s=null;r>=0?(i=e[n].substring(0,r),s=e[n].substring(r+1)):i=e[n],t(i,s?decodeURIComponent(s.replace(/\+/g," ")):"")}}}(e.i,function(t,n){e.add(decodeURIComponent(t.replace(/\+/g," ")),n)}))}function pt(e,t){ft(e),t=wt(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function mt(e,t){return ft(e),t=wt(e,t),e.g.has(t)}function gt(e,t){ft(e);let n=[];if("string"==typeof t)mt(e,t)&&(n=n.concat(e.g.get(wt(e,t))));else for(e=Array.from(e.g.values()),t=0;t<e.length;t++)n=n.concat(e[t]);return n}function yt(e,t,n){pt(e,t),n.length>0&&(e.i=null,e.g.set(wt(e,t),d(n)),e.h+=n.length)}function vt(e){const t=new dt;return t.i=e.i,e.g&&(t.g=new Map(e.g),t.h=e.h),t}function wt(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function It(e,t,n,r,i){try{i&&(i.onload=null,i.onerror=null,i.onabort=null,i.ontimeout=null),r(n)}catch(s){}}function _t(){this.g=new se}function Tt(e){this.i=e.Sb||null,this.h=e.ab||!1}function bt(e,t){Q.call(this),this.H=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}function Et(e){e.j.read().then(e.Ma.bind(e)).catch(e.ga.bind(e))}function St(e){e.readyState=4,e.l=null,e.j=null,e.B=null,At(e)}function At(e){e.onreadystatechange&&e.onreadystatechange.call(e)}function Ct(e){let t="";return P(e,function(e,n){t+=n,t+=":",t+=e,t+="\r\n"}),t}function kt(e,t,n){e:{for(r in n){var r=!1;break e}r=!0}r||(n=Ct(n),"string"==typeof e?null!=n&&Ae(n):nt(e,t,n))}function Nt(e){Q.call(this),this.headers=new Map,this.L=e||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}(e=dt.prototype).add=function(e,t){ft(this),this.i=null,e=wt(this,e);let n=this.g.get(e);return n||this.g.set(e,n=[]),n.push(t),this.h+=1,this},e.forEach=function(e,t){ft(this),this.g.forEach(function(n,r){n.forEach(function(n){e.call(t,n,r,this)},this)},this)},e.set=function(e,t){return ft(this),this.i=null,mt(this,e=wt(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e.get=function(e,t){return e&&(e=gt(this,e)).length>0?String(e[0]):t},e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const e=[],t=Array.from(this.g.keys());for(let r=0;r<t.length;r++){var n=t[r];const i=Ae(n);n=gt(this,n);for(let t=0;t<n.length;t++){let r=i;""!==n[t]&&(r+="="+Ae(n[t])),e.push(r)}}return this.i=e.join("&")},l(Tt,oe),Tt.prototype.g=function(){return new bt(this.i,this.h)},l(bt,Q),(e=bt.prototype).open=function(e,t){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.F=e,this.D=t,this.readyState=1,At(this)},e.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const t={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};e&&(t.body=e),(this.H||s).fetch(new Request(this.D,t)).then(this.Pa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&4!=this.readyState&&(this.g=!1,St(this)),this.readyState=0},e.Pa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,At(this)),this.g&&(this.readyState=3,At(this),this.g)))if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(void 0!==s.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Et(this)}else e.text().then(this.Oa.bind(this),this.ga.bind(this))},e.Ma=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array(0);(t=this.B.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?St(this):At(this),3==this.readyState&&Et(this)}},e.Oa=function(e){this.g&&(this.response=this.responseText=e,St(this))},e.Na=function(e){this.g&&(this.response=e,St(this))},e.ga=function(){this.g&&St(this)},e.setRequestHeader=function(e,t){this.A.append(e,t)},e.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const e=[],t=this.h.entries();for(var n=t.next();!n.done;)n=n.value,e.push(n[0]+": "+n[1]),n=t.next();return e.join("\r\n")},Object.defineProperty(bt.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}}),l(Nt,Q);var Dt=/^https?$/i,Rt=["POST","PUT"];function Pt(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.o=5,Ot(e),Lt(e)}function Ot(e){e.A||(e.A=!0,J(e,"complete"),J(e,"error"))}function xt(e){if(e.h&&void 0!==i)if(e.v&&4==Mt(e))setTimeout(e.Ca.bind(e),0);else if(J(e,"readystatechange"),4==Mt(e)){e.h=!1;try{const i=e.ca();e:switch(i){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t=!0;break e;default:t=!1}var n;if(!(n=t)){var r;if(r=0===i){let t=String(e.D).match(Je)[1]||null;!t&&s.self&&s.self.location&&(t=s.self.location.protocol.slice(0,-1)),r=!Dt.test(t?t.toLowerCase():"")}n=r}if(n)J(e,"complete"),J(e,"success");else{e.o=6;try{var o=Mt(e)>2?e.g.statusText:""}catch(a){o=""}e.l=o+" ["+e.ca()+"]",Ot(e)}}finally{Lt(e)}}}function Lt(e,t){if(e.g){e.m&&(clearTimeout(e.m),e.m=null);const r=e.g;e.g=null,t||J(e,"ready");try{r.onreadystatechange=null}catch(n){}}}function Mt(e){return e.g?e.g.readyState:0}function Ft(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.F){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(t){return null}}function Vt(e,t,n){return n&&n.internalChannelParams&&n.internalChannelParams[e]||t}function Ut(e){this.za=0,this.i=[],this.j=new Ie,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Vt("failFast",!1,e),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Vt("baseRetryDelayMs",5e3,e),this.Za=Vt("retryDelaySeedMs",1e4,e),this.Ta=Vt("forwardChannelMaxRetries",2,e),this.va=Vt("forwardChannelRequestTimeoutMs",2e4,e),this.ma=e&&e.xmlHttpFactory||void 0,this.Ua=e&&e.Rb||void 0,this.Aa=e&&e.useFetchStreams||!1,this.O=void 0,this.L=e&&e.supportsCrossDomainXhr||!1,this.M="",this.h=new ze(e&&e.concurrentRequestLimit),this.Ba=new _t,this.S=e&&e.fastHandshake||!1,this.R=e&&e.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=e&&e.Pb||!1,e&&e.ua&&this.j.ua(),e&&e.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&e&&e.detectBufferingProxy||!1,this.ia=void 0,e&&e.longPollingTimeout&&e.longPollingTimeout>0&&(this.ia=e.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}function qt(e){if(jt(e),3==e.I){var t=e.V++,n=Xe(e.J);if(nt(n,"SID",e.M),nt(n,"RID",t),nt(n,"TYPE","terminate"),$t(e,n),(t=new ke(e,e.j,t)).M=2,t.A=rt(Xe(n)),n=!1,s.navigator&&s.navigator.sendBeacon)try{n=s.navigator.sendBeacon(t.A.toString(),"")}catch(r){}!n&&s.Image&&((new Image).src=t.A,n=!0),n||(t.g=rn(t.j,null),t.g.ea(t.A)),t.F=Date.now(),Me(t)}tn(e)}function Bt(e){e.g&&(Qt(e),e.g.cancel(),e.g=null)}function jt(e){Bt(e),e.v&&(s.clearTimeout(e.v),e.v=null),Yt(e),e.h.cancel(),e.m&&("number"==typeof e.m&&s.clearTimeout(e.m),e.m=null)}function zt(e){if(!Ge(e.h)&&!e.m){e.m=!0;var t=e.Ea;v||_(),w||(v(),w=!0),I.add(t,e),e.D=0}}function Gt(e,t){var n;n=t?t.l:e.V++;const r=Xe(e.J);nt(r,"SID",e.M),nt(r,"RID",n),nt(r,"AID",e.K),$t(e,r),e.u&&e.o&&kt(r,e.u,e.o),n=new ke(e,e.j,n,e.D+1),null===e.u&&(n.J=e.o),t&&(e.i=t.G.concat(e.i)),t=Kt(e,n,1e3),n.H=Math.round(.5*e.va)+Math.round(.5*e.va*Math.random()),He(e.h,n),Pe(n,r,t)}function $t(e,t){e.H&&P(e.H,function(e,n){nt(t,n,e)}),e.l&&P({},function(e,n){nt(t,n,e)})}function Kt(e,t,n){n=Math.min(e.i.length,n);const r=e.l?c(e.l.Ka,e.l,e):null;e:{var i=e.i;let t=-1;for(;;){const e=["count="+n];-1==t?n>0?(t=i[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let c=!0;for(let l=0;l<n;l++){var s=i[l].g;const n=i[l].map;if((s-=t)<0)t=Math.max(0,i[l].g-100),c=!1;else try{s="req"+s+"_"||"";try{var a=n instanceof Map?n:Object.entries(n);for(const[t,n]of a){let r=n;o(n)&&(r=re(n)),e.push(s+t+"="+encodeURIComponent(r))}}catch(u){throw e.push(s+"type="+encodeURIComponent("_badmap")),u}}catch(u){r&&r(n)}}if(c){a=e.join("&");break e}}a=void 0}return e=e.i.splice(0,n),t.G=e,a}function Ht(e){if(!e.g&&!e.v){e.Y=1;var t=e.Da;v||_(),w||(v(),w=!0),I.add(t,e),e.A=0}}function Wt(e){return!(e.g||e.v||e.A>=3)&&(e.Y++,e.v=we(c(e.Da,e),Zt(e,e.A)),e.A++,!0)}function Qt(e){null!=e.B&&(s.clearTimeout(e.B),e.B=null)}function Jt(e){e.g=new ke(e,e.j,"rpc",e.Y),null===e.u&&(e.g.J=e.o),e.g.P=0;var t=Xe(e.na);nt(t,"RID","rpc"),nt(t,"SID",e.M),nt(t,"AID",e.K),nt(t,"CI",e.F?"0":"1"),!e.F&&e.ia&&nt(t,"TO",e.ia),nt(t,"TYPE","xmlhttp"),$t(e,t),e.u&&e.o&&kt(t,e.u,e.o),e.O&&(e.g.H=e.O);var n=e.g;e=e.ba,n.M=1,n.A=rt(Xe(t)),n.u=null,n.R=!0,Oe(n,e)}function Yt(e){null!=e.C&&(s.clearTimeout(e.C),e.C=null)}function Xt(e,t){var n=null;if(e.g==t){Yt(e),Qt(e),e.g=null;var r=2}else{if(!Ke(e.h,t))return;n=t.G,We(e.h,t),r=1}if(0!=e.I)if(t.o)if(1==r){n=t.u?t.u.length:0,t=Date.now()-t.F;var i=e.D;J(r=fe(),new ve(r,n)),zt(e)}else Ht(e);else if(3==(i=t.m)||0==i&&t.X>0||!(1==r&&function(e,t){return!($e(e.h)>=e.h.j-(e.m?1:0)||(e.m?(e.i=t.G.concat(e.i),0):1==e.I||2==e.I||e.D>=(e.Sa?0:e.Ta)||(e.m=we(c(e.Ea,e,t),Zt(e,e.D)),e.D++,0)))}(e,t)||2==r&&Wt(e)))switch(n&&n.length>0&&(t=e.h,t.i=t.i.concat(n)),i){case 1:en(e,5);break;case 4:en(e,10);break;case 3:en(e,6);break;default:en(e,2)}}function Zt(e,t){let n=e.Qa+Math.floor(Math.random()*e.Za);return e.isActive()||(n*=2),n*t}function en(e,t){if(e.j.info("Error code "+t),2==t){var n=c(e.bb,e),r=e.Ua;const t=!r;r=new Ye(r||"//www.google.com/images/cleardot.gif"),s.location&&"http"==s.location.protocol||Ze(r,"https"),rt(r),t?function(e,t){const n=new Ie;if(s.Image){const r=new Image;r.onload=u(It,n,"TestLoadImage: loaded",!0,t,r),r.onerror=u(It,n,"TestLoadImage: error",!1,t,r),r.onabort=u(It,n,"TestLoadImage: abort",!1,t,r),r.ontimeout=u(It,n,"TestLoadImage: timeout",!1,t,r),s.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=e}else t(!1)}(r.toString(),n):function(e,t){new Ie;const n=new AbortController,r=setTimeout(()=>{n.abort(),It(0,0,!1,t)},1e4);fetch(e,{signal:n.signal}).then(e=>{clearTimeout(r),e.ok?It(0,0,!0,t):It(0,0,!1,t)}).catch(()=>{clearTimeout(r),It(0,0,!1,t)})}(r.toString(),n)}else ye(2);e.I=0,e.l&&e.l.pa(t),tn(e),jt(e)}function tn(e){if(e.I=0,e.ja=[],e.l){const t=Qe(e.h);0==t.length&&0==e.i.length||(f(e.ja,t),f(e.ja,e.i),e.h.i.length=0,d(e.i),e.i.length=0),e.l.oa()}}function nn(e,t,n){var r=n instanceof Ye?Xe(n):new Ye(n);if(""!=r.g)t&&(r.g=t+"."+r.g),et(r,r.u);else{var i=s.location;r=i.protocol,t=t?t+"."+i.hostname:i.hostname,i=+i.port;const e=new Ye(null);r&&Ze(e,r),t&&(e.g=t),i&&et(e,i),n&&(e.h=n),r=e}return n=e.G,t=e.wa,n&&t&&nt(r,n,t),nt(r,"VER",e.ka),$t(e,r),r}function rn(e,t,n){if(t&&!e.L)throw Error("Can't create secondary domain capable XhrIo object.");return(t=e.Aa&&!e.ma?new Nt(new Tt({ab:n})):new Nt(e.ma)).Fa(e.L),t}function sn(){}function on(){}function an(e,t){Q.call(this),this.g=new Ut(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.sa&&(e?e["X-WebChannel-Client-Profile"]=t.sa:e={"X-WebChannel-Client-Profile":t.sa}),this.g.U=e,(e=t&&t.Qb)&&!A(e)&&(this.g.u=e),this.A=t&&t.supportsCrossDomainXhr||!1,this.v=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!A(t)&&(this.g.G=t,null!==(e=this.h)&&t in e&&(t in(e=this.h)&&delete e[t])),this.j=new ln(this)}function cn(e){ue.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(const n in t){e=n;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function un(){le.call(this),this.status=1}function ln(e){this.g=e}(e=Nt.prototype).Fa=function(e){this.H=e},e.ea=function(e,t,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);t=t?t.toUpperCase():"GET",this.D=e,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Te.g(),this.g.onreadystatechange=h(c(this.Ca,this));try{this.B=!0,this.g.open(t,String(e),!0),this.B=!1}catch(o){return void Pt(this,o)}if(e=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var i in r)n.set(i,r[i]);else{if("function"!=typeof r.keys||"function"!=typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const e of r.keys())n.set(e,r.get(e))}r=Array.from(n.keys()).find(e=>"content-type"==e.toLowerCase()),i=s.FormData&&e instanceof s.FormData,!(Array.prototype.indexOf.call(Rt,t,void 0)>=0)||r||i||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[s,a]of n)this.g.setRequestHeader(s,a);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(e),this.v=!1}catch(o){Pt(this,o)}},e.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=e||7,J(this,"complete"),J(this,"abort"),Lt(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Lt(this,!0)),Nt.Z.N.call(this)},e.Ca=function(){this.u||(this.B||this.v||this.j?xt(this):this.Xa())},e.Xa=function(){xt(this)},e.isActive=function(){return!!this.g},e.ca=function(){try{return Mt(this)>2?this.g.status:-1}catch(e){return-1}},e.la=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},e.La=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),ie(t)}},e.ya=function(){return this.o},e.Ha=function(){return"string"==typeof this.l?this.l:String(this.l)},(e=Ut.prototype).ka=8,e.I=1,e.connect=function(e,t,n,r){ye(0),this.W=e,this.H=t||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.J=nn(this,null,this.W),zt(this)},e.Ea=function(e){if(this.m)if(this.m=null,1==this.I){if(!e){this.V=Math.floor(1e5*Math.random()),e=this.V++;const i=new ke(this,this.j,e);let s=this.o;if(this.U&&(s?(s=O(s),L(s,this.U)):s=this.U),null!==this.u||this.R||(i.J=s,s=null),this.S)e:{for(var t=0,n=0;n<this.i.length;n++){var r=this.i[n];if(void 0===(r="__data__"in r.map&&"string"==typeof(r=r.map.__data__)?r.length:void 0))break;if((t+=r)>4096){t=n;break e}if(4096===t||n===this.i.length-1){t=n+1;break e}}t=1e3}else t=1e3;t=Kt(this,i,t),nt(n=Xe(this.J),"RID",e),nt(n,"CVER",22),this.G&&nt(n,"X-HTTP-Session-Id",this.G),$t(this,n),s&&(this.R?t="headers="+Ae(Ct(s))+"&"+t:this.u&&kt(n,this.u,s)),He(this.h,i),this.Ra&&nt(n,"TYPE","init"),this.S?(nt(n,"$req",t),nt(n,"SID","null"),i.U=!0,Pe(i,n,null)):Pe(i,n,t),this.I=2}}else 3==this.I&&(e?Gt(this,e):0==this.i.length||Ge(this.h)||Gt(this))},e.Da=function(){if(this.v=null,Jt(this),this.aa&&!(this.P||null==this.g||this.T<=0)){var e=4*this.T;this.j.info("BP detection timer enabled: "+e),this.B=we(c(this.Wa,this),e)}},e.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,ye(10),Bt(this),Jt(this))},e.Va=function(){null!=this.C&&(this.C=null,Bt(this),Wt(this),ye(19))},e.bb=function(e){e?(this.j.info("Successfully pinged google.com"),ye(2)):(this.j.info("Failed to ping google.com"),ye(1))},e.isActive=function(){return!!this.l&&this.l.isActive(this)},(e=sn.prototype).ra=function(){},e.qa=function(){},e.pa=function(){},e.oa=function(){},e.isActive=function(){return!0},e.Ka=function(){},on.prototype.g=function(e,t){return new an(e,t)},l(an,Q),an.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},an.prototype.close=function(){qt(this.g)},an.prototype.o=function(e){var t=this.g;if("string"==typeof e){var n={};n.__data__=e,e=n}else this.v&&((n={}).__data__=re(e),e=n);t.i.push(new je(t.Ya++,e)),3==t.I&&zt(t)},an.prototype.N=function(){this.g.l=null,delete this.j,qt(this.g),delete this.g,an.Z.N.call(this)},l(cn,ue),l(un,le),l(ln,sn),ln.prototype.ra=function(){J(this.g,"a")},ln.prototype.qa=function(e){J(this.g,new cn(e))},ln.prototype.pa=function(e){J(this.g,new un)},ln.prototype.oa=function(){J(this.g,"b")},on.prototype.createWebChannel=on.prototype.g,an.prototype.send=an.prototype.o,an.prototype.open=an.prototype.m,an.prototype.close=an.prototype.close,bo=function(){return new on},To=function(){return fe()},_o=he,Io={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},be.NO_ERROR=0,be.TIMEOUT=8,be.HTTP_ERROR=6,wo=be,Ee.COMPLETE="complete",vo=Ee,ae.EventType=ce,ce.OPEN="a",ce.CLOSE="b",ce.ERROR="c",ce.MESSAGE="d",Q.prototype.listen=Q.prototype.J,yo=ae,Nt.prototype.listenOnce=Nt.prototype.K,Nt.prototype.getLastError=Nt.prototype.Ha,Nt.prototype.getLastErrorCode=Nt.prototype.ya,Nt.prototype.getStatus=Nt.prototype.ca,Nt.prototype.getResponseJson=Nt.prototype.La,Nt.prototype.getResponseText=Nt.prototype.la,Nt.prototype.send=Nt.prototype.ea,Nt.prototype.setWithCredentials=Nt.prototype.Fa,go=Nt}).apply(void 0!==Eo?Eo:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});
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
class So{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}So.UNAUTHENTICATED=new So(null),So.GOOGLE_CREDENTIALS=new So("google-credentials-uid"),So.FIRST_PARTY=new So("first-party-uid"),So.MOCK_USER=new So("mock-user");
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
let Ao="12.9.0";
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
const Co=new z("@firebase/firestore");function ko(){return Co.logLevel}function No(e,...t){if(Co.logLevel<=F.DEBUG){const n=t.map(Po);Co.debug(`Firestore (${Ao}): ${e}`,...n)}}function Do(e,...t){if(Co.logLevel<=F.ERROR){const n=t.map(Po);Co.error(`Firestore (${Ao}): ${e}`,...n)}}function Ro(e,...t){if(Co.logLevel<=F.WARN){const n=t.map(Po);Co.warn(`Firestore (${Ao}): ${e}`,...n)}}function Po(e){if("string"==typeof e)return e;try{return t=e,JSON.stringify(t)}catch(n){return e}var t}
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
 */function Oo(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,xo(e,r,n)}function xo(e,t,n){let r=`FIRESTORE (${Ao}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(i){r+=" CONTEXT: "+n}throw Do(r),new Error(r)}function Lo(e,t,n,r){let i="Unexpected state";"string"==typeof n?i=n:r=n,e||xo(t,i,r)}function Mo(e,t){return e}
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
 */const Fo={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Vo extends T{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
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
 */class Uo{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}
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
 */class qo{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Bo{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(So.UNAUTHENTICATED))}shutdown(){}}class jo{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class zo{constructor(e){this.t=e,this.currentUser=So.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Lo(void 0===this.o,42304);let n=this.i;const r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve();let i=new Uo;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Uo,e.enqueueRetryable(()=>r(this.currentUser))};const s=()=>{const t=i;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},o=e=>{No("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),s())};this.t.onInit(e=>o(e)),setTimeout(()=>{if(!this.auth){const e=this.t.getImmediate({optional:!0});e?o(e):(No("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Uo)}},0),s()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(No("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(Lo("string"==typeof t.accessToken,31837,{l:t}),new qo(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Lo(null===e||"string"==typeof e,2055,{h:e}),new So(e)}}class Go{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=So.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class $o{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Go(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(So.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Ko{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Ho{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ge(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Lo(void 0===this.o,3512);const n=e=>{null!=e.error&&No("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);const n=e.token!==this.m;return this.m=e.token,No("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};const r=e=>{No("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){const e=this.V.getImmediate({optional:!0});e?r(e):No("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new Ko(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?(Lo("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new Ko(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}
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
function Wo(e){const t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}
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
 */class Qo{static newId(){const e=62*Math.floor(256/62);let t="";for(;t.length<20;){const n=Wo(40);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function Jo(e,t){return e<t?-1:e>t?1:0}function Yo(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=e.charAt(r),i=t.charAt(r);if(n!==i)return ea(n)===ea(i)?Jo(n,i):ea(n)?1:-1}return Jo(e.length,t.length)}const Xo=55296,Zo=57343;function ea(e){const t=e.charCodeAt(0);return t>=Xo&&t<=Zo}function ta(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}function na(e){return e+"\0"}
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
 */const ra="__name__";class ia{constructor(e,t,n){void 0===t?t=0:t>e.length&&Oo(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&Oo(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===ia.comparator(this,e)}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ia?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=ia.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return Jo(e.length,t.length)}static compareSegments(e,t){const n=ia.isNumericId(e),r=ia.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?ia.extractNumericId(e).compare(ia.extractNumericId(t)):Yo(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return fo.fromString(e.substring(4,e.length-2))}}class sa extends ia{construct(e,t,n){return new sa(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new Vo(Fo.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new sa(t)}static emptyPath(){return new sa([])}}const oa=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class aa extends ia{construct(e,t,n){return new aa(e,t,n)}static isValidIdentifier(e){return oa.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),aa.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===ra}static keyField(){return new aa([ra])}static fromServerFormat(e){const t=[];let n="",r=0;const i=()=>{if(0===n.length)throw new Vo(Fo.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let s=!1;for(;r<e.length;){const t=e[r];if("\\"===t){if(r+1===e.length)throw new Vo(Fo.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new Vo(Fo.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?(s=!s,r++):"."!==t||s?(n+=t,r++):(i(),r++)}if(i(),s)throw new Vo(Fo.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new aa(t)}static emptyPath(){return new aa([])}}
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
 */class ca{constructor(e){this.path=e}static fromPath(e){return new ca(sa.fromString(e))}static fromName(e){return new ca(sa.fromString(e).popFirst(5))}static empty(){return new ca(sa.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===sa.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return sa.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ca(new sa(e.slice()))}}
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
 */function ua(e,t,n){if(!n)throw new Vo(Fo.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function la(e,t,n,r){if(!0===t&&!0===r)throw new Vo(Fo.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function ha(e){if(!ca.isDocumentKey(e))throw new Vo(Fo.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function da(e){if(ca.isDocumentKey(e))throw new Vo(Fo.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function fa(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}function pa(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{const n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}var t;return"function"==typeof e?"a function":Oo(12329,{type:typeof e})}function ma(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new Vo(Fo.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=pa(e);throw new Vo(Fo.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}function ga(e,t){if(t<=0)throw new Vo(Fo.INVALID_ARGUMENT,`Function ${e}() requires a positive number, but it was: ${t}.`)}
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
 */function ya(e,t){const n={typeString:e};return t&&(n.value=t),n}function va(e,t){if(!fa(e))throw new Vo(Fo.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in t)if(t[r]){const i=t[r].typeString,s="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}const o=e[r];if(i&&typeof o!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(void 0!==s&&o!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new Vo(Fo.INVALID_ARGUMENT,n);return!0}
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
 */const wa=-62135596800,Ia=1e6;class _a{static now(){return _a.fromMillis(Date.now())}static fromDate(e){return _a.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Ia);return new _a(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Vo(Fo.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Vo(Fo.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<wa)throw new Vo(Fo.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Vo(Fo.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ia}_compareTo(e){return this.seconds===e.seconds?Jo(this.nanoseconds,e.nanoseconds):Jo(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:_a._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(va(e,_a._jsonSchema))return new _a(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-wa;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}_a._jsonSchemaVersion="firestore/timestamp/1.0",_a._jsonSchema={type:ya("string",_a._jsonSchemaVersion),seconds:ya("number"),nanoseconds:ya("number")};
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
class Ta{static fromTimestamp(e){return new Ta(e)}static min(){return new Ta(new _a(0,0))}static max(){return new Ta(new _a(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
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
 */const ba=-1;class Ea{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}function Sa(e){return e.fields.find(e=>2===e.kind)}function Aa(e){return e.fields.filter(e=>2!==e.kind)}function Ca(e,t){let n=Jo(e.collectionGroup,t.collectionGroup);if(0!==n)return n;for(let r=0;r<Math.min(e.fields.length,t.fields.length);++r)if(n=Na(e.fields[r],t.fields[r]),0!==n)return n;return Jo(e.fields.length,t.fields.length)}Ea.UNKNOWN_ID=-1;class ka{constructor(e,t){this.fieldPath=e,this.kind=t}}function Na(e,t){const n=aa.comparator(e.fieldPath,t.fieldPath);return 0!==n?n:Jo(e.kind,t.kind)}class Da{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Da(0,Oa.min())}}function Ra(e,t){const n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,i=Ta.fromTimestamp(1e9===r?new _a(n+1,0):new _a(n,r));return new Oa(i,ca.empty(),t)}function Pa(e){return new Oa(e.readTime,e.key,ba)}class Oa{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Oa(Ta.min(),ca.empty(),ba)}static max(){return new Oa(Ta.max(),ca.empty(),ba)}}function xa(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:(n=ca.comparator(e.documentKey,t.documentKey),0!==n?n:Jo(e.largestBatchId,t.largestBatchId)
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
 */)}const La="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Ma{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}
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
 */async function Fa(e){if(e.code!==Fo.FAILED_PRECONDITION||e.message!==La)throw e;No("LocalStore","Unexpectedly lost primary lease")}
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
 */class Va{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Oo(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new Va((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof Va?t:Va.resolve(t)}catch(t){return Va.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):Va.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):Va.reject(t)}static resolve(e){return new Va((t,n)=>{t(e)})}static reject(e){return new Va((t,n)=>{n(e)})}static waitFor(e){return new Va((t,n)=>{let r=0,i=0,s=!1;e.forEach(e=>{++r,e.next(()=>{++i,s&&i===r&&t()},e=>n(e))}),s=!0,i===r&&t()})}static or(e){let t=Va.resolve(!1);for(const n of e)t=t.next(e=>e?Va.resolve(e):n());return t}static forEach(e,t){const n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new Va((n,r)=>{const i=e.length,s=new Array(i);let o=0;for(let a=0;a<i;a++){const c=a;t(e[c]).next(e=>{s[c]=e,++o,o===i&&n(s)},e=>r(e))}})}static doWhile(e,t){return new Va((n,r)=>{const i=()=>{!0===e()?t().next(()=>{i()},r):n()};i()})}}
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
 */const Ua="SimpleDb";class qa{static open(e,t,n,r){try{return new qa(t,e.transaction(r,n))}catch(i){throw new Ga(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new Uo,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Ga(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{const n=Qa(t.target.error);this.S.reject(new Ga(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(No(Ua,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){const t=this.transaction.objectStore(e);return new Ka(t)}}class Ba{static delete(e){return No(Ua,"Removing database:",e),Ha(o().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!_())return!1;if(Ba.F())return!0;const e=y(),t=Ba.M(e),n=0<t&&t<10,r=ja(e),i=0<r&&r<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){var e;return"undefined"!=typeof process&&"YES"===(null==(e=process.__PRIVATE_env)?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)}static O(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,12.2===Ba.M(y())&&Do("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(No(Ua,"Opening database:",this.name),this.db=await new Promise((t,n)=>{const r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{const n=e.target.result;t(n)},r.onblocked=()=>{n(new Ga(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=t=>{const r=t.target.error;"VersionError"===r.name?n(new Vo(Fo.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new Vo(Fo.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new Ga(e,r))},r.onupgradeneeded=e=>{No(Ua,'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);const t=e.target.result;this.N.k(t,r.transaction,e.oldVersion,this.version).next(()=>{No(Ua,"Database upgrade to version "+this.version+" complete")})}})),this.K&&(this.db.onversionchange=e=>this.K(e)),this.db}q(e){this.K=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,r){const i="readonly"===t;let s=0;for(;;){++s;try{this.db=await this.L(e);const t=qa.open(this.db,e,i?"readonly":"readwrite",n),s=r(t).next(e=>(t.C(),e)).catch(e=>(t.abort(e),Va.reject(e))).toPromise();return s.catch(()=>{}),await t.D,s}catch(o){const e=o,t="FirebaseError"!==e.name&&s<3;if(No(Ua,"Transaction failed with error:",e.message,"Retrying:",t),this.close(),!t)return Promise.reject(e)}}}close(){this.db&&this.db.close(),this.db=void 0}}function ja(e){const t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}class za{constructor(e){this.U=e,this.$=!1,this.W=null}get isDone(){return this.$}get G(){return this.W}set cursor(e){this.U=e}done(){this.$=!0}j(e){this.W=e}delete(){return Ha(this.U.delete())}}class Ga extends Vo{constructor(e,t){super(Fo.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function $a(e){return"IndexedDbTransactionError"===e.name}class Ka{constructor(e){this.store=e}put(e,t){let n;return void 0!==t?(No(Ua,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(No(Ua,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Ha(n)}add(e){return No(Ua,"ADD",this.store.name,e,e),Ha(this.store.add(e))}get(e){return Ha(this.store.get(e)).next(t=>(void 0===t&&(t=null),No(Ua,"GET",this.store.name,e,t),t))}delete(e){return No(Ua,"DELETE",this.store.name,e),Ha(this.store.delete(e))}count(){return No(Ua,"COUNT",this.store.name),Ha(this.store.count())}H(e,t){const n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){const e=r.getAll(n.range);return new Va((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}})}{const e=this.cursor(n),t=[];return this.J(e,(e,n)=>{t.push(n)}).next(()=>t)}}Z(e,t){const n=this.store.getAll(e,null===t?void 0:t);return new Va((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}})}X(e,t){No(Ua,"DELETE ALL",this.store.name);const n=this.options(e,t);n.Y=!1;const r=this.cursor(n);return this.J(r,(e,t,n)=>n.delete())}ee(e,t){let n;t?n=e:(n={},t=e);const r=this.cursor(n);return this.J(r,t)}te(e){const t=this.cursor({});return new Va((n,r)=>{t.onerror=e=>{const t=Qa(e.target.error);r(t)},t.onsuccess=t=>{const r=t.target.result;r?e(r.primaryKey,r.value).next(e=>{e?r.continue():n()}):n()}})}J(e,t){const n=[];return new Va((r,i)=>{e.onerror=e=>{i(e.target.error)},e.onsuccess=e=>{const i=e.target.result;if(!i)return void r();const s=new za(i),o=t(i.primaryKey,i.value,s);if(o instanceof Va){const e=o.catch(e=>(s.done(),Va.reject(e)));n.push(e)}s.isDone?r():null===s.G?i.continue():i.continue(s.G)}}).next(()=>Va.waitFor(n))}options(e,t){let n;return void 0!==e&&("string"==typeof e?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.Y?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Ha(e){return new Va((t,n)=>{e.onsuccess=e=>{const n=e.target.result;t(n)},e.onerror=e=>{const t=Qa(e.target.error);n(t)}})}let Wa=!1;function Qa(e){const t=Ba.M(y());if(t>=12.2&&t<13){const t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){const e=new Vo("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Wa||(Wa=!0,setTimeout(()=>{throw e},0)),e}}return e}const Ja="IndexBackfiller";class Ya{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}re(e){No(Ja,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{const e=await this.ne.ie();No(Ja,`Documents written: ${e}`)}catch(e){$a(e)?No(Ja,"Ignoring IndexedDB error during index backfill: ",e):await Fa(e)}await this.re(6e4)})}}class Xa{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.se(t,e))}se(e,t){const n=new Set;let r=t,i=!0;return Va.doWhile(()=>!0===i&&r>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t=>{if(null!==t&&!n.has(t))return No(Ja,`Processing collection: ${t}`),this.oe(e,t,r).next(e=>{r-=e,n.add(t)});i=!1})).next(()=>t-r)}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next(n=>{const i=n.changes;return this.localStore.indexManager.updateIndexEntries(e,i).next(()=>this._e(r,n)).next(n=>(No(Ja,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n))).next(()=>i.size)}))}_e(e,t){let n=e;return t.changes.forEach((e,t)=>{const r=Pa(t);xa(r,n)>0&&(n=r)}),new Oa(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}
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
 */class Za{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ae(e),this.ue=e=>t.writeSequenceNumber(e))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Za.ce=-1;
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
const ec=-1;function tc(e){return null==e}function nc(e){return 0===e&&1/e==-1/0}function rc(e){return"number"==typeof e&&Number.isInteger(e)&&!nc(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}
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
 */const ic="";function sc(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t=ac(t)),t=oc(e.get(n),t);return ac(t)}function oc(e,t){let n=t;const r=e.length;for(let i=0;i<r;i++){const t=e.charAt(i);switch(t){case"\0":n+="";break;case ic:n+="";break;default:n+=t}}return n}function ac(e){return e+ic+""}function cc(e){const t=e.length;if(Lo(t>=2,64408,{path:e}),2===t)return Lo(e.charAt(0)===ic&&""===e.charAt(1),56145,{path:e}),sa.emptyPath();const n=t-2,r=[];let i="";for(let s=0;s<t;){const t=e.indexOf(ic,s);switch((t<0||t>n)&&Oo(50515,{path:e}),e.charAt(t+1)){case"":const n=e.substring(s,t);let o;0===i.length?o=n:(i+=n,o=i,i=""),r.push(o);break;case"":i+=e.substring(s,t),i+="\0";break;case"":i+=e.substring(s,t+1);break;default:Oo(61167,{path:e})}s=t+2}return new sa(r)}
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
 */const uc="remoteDocuments",lc="owner",hc="owner",dc="mutationQueues",fc="mutations",pc="batchId",mc="userMutationsIndex",gc=["userId","batchId"];
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
 */function yc(e,t){return[e,sc(t)]}function vc(e,t,n){return[e,sc(t),n]}const wc={},Ic="documentMutations",_c="remoteDocumentsV14",Tc=["prefixPath","collectionGroup","readTime","documentId"],bc="documentKeyIndex",Ec=["prefixPath","collectionGroup","documentId"],Sc="collectionGroupIndex",Ac=["collectionGroup","readTime","prefixPath","documentId"],Cc="remoteDocumentGlobal",kc="remoteDocumentGlobalKey",Nc="targets",Dc="queryTargetsIndex",Rc=["canonicalId","targetId"],Pc="targetDocuments",Oc=["targetId","path"],xc="documentTargetsIndex",Lc=["path","targetId"],Mc="targetGlobalKey",Fc="targetGlobal",Vc="collectionParents",Uc=["collectionId","parent"],qc="clientMetadata",Bc="bundles",jc="namedQueries",zc="indexConfiguration",Gc="collectionGroupIndex",$c="indexState",Kc=["indexId","uid"],Hc="sequenceNumberIndex",Wc=["uid","sequenceNumber"],Qc="indexEntries",Jc=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Yc="documentKeyIndex",Xc=["indexId","uid","orderedDocumentKey"],Zc="documentOverlays",eu=["userId","collectionPath","documentId"],tu="collectionPathOverlayIndex",nu=["userId","collectionPath","largestBatchId"],ru="collectionGroupOverlayIndex",iu=["userId","collectionGroup","largestBatchId"],su="globals",ou=[dc,fc,Ic,uc,Nc,lc,Fc,Pc,qc,Cc,Vc,Bc,jc],au=[...ou,Zc],cu=[dc,fc,Ic,_c,Nc,lc,Fc,Pc,qc,Cc,Vc,Bc,jc,Zc],uu=cu,lu=[...uu,zc,$c,Qc],hu=lu,du=[...lu,su],fu=du;
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
 */class pu extends Ma{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function mu(e,t){const n=Mo(e);return Ba.O(n.le,t)}
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
 */function gu(e){let t=0;for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function yu(e,t){for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function vu(e,t){const n=[];for(const r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.push(t(e[r],r,e));return n}function wu(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}
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
 */class Iu{constructor(e,t){this.comparator=e,this.root=t||Tu.EMPTY}insert(e,t){return new Iu(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Tu.BLACK,null,null))}remove(e){return new Iu(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Tu.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new _u(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new _u(this.root,e,this.comparator,!1)}getReverseIterator(){return new _u(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new _u(this.root,e,this.comparator,!0)}}class _u{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Tu{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:Tu.RED,this.left=null!=r?r:Tu.EMPTY,this.right=null!=i?i:Tu.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new Tu(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const i=n(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Tu.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return Tu.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Tu.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Tu.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Oo(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Oo(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw Oo(27949);return e+(this.isRed()?0:1)}}Tu.EMPTY=null,Tu.RED=!0,Tu.BLACK=!1,Tu.EMPTY=new class{constructor(){this.size=0}get key(){throw Oo(57766)}get value(){throw Oo(16141)}get color(){throw Oo(16727)}get left(){throw Oo(29726)}get right(){throw Oo(36894)}copy(e,t,n,r,i){return this}insert(e,t,n){return new Tu(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
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
class bu{constructor(e){this.comparator=e,this.data=new Iu(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Eu(this.data.getIterator())}getIteratorFrom(e){return new Eu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof bu))return!1;if(this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new bu(this.comparator);return t.data=e,t}}class Eu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Su(e){return e.hasNext()?e.getNext():void 0}
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
 */class Au{constructor(e){this.fields=e,e.sort(aa.comparator)}static empty(){return new Au([])}unionWith(e){let t=new bu(aa.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Au(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return ta(this.fields,e.fields,(e,t)=>e.isEqual(t))}}
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
 */class Cu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
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
class ku{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(e){try{return atob(e)}catch(t){throw"undefined"!=typeof DOMException&&t instanceof DOMException?new Cu("Invalid base64 string: "+t):t}}(e);return new ku(t)}static fromUint8Array(e){const t=function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e);return new ku(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Jo(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ku.EMPTY_BYTE_STRING=new ku("");const Nu=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Du(e){if(Lo(!!e,39018),"string"==typeof e){let t=0;const n=Nu.exec(e);if(Lo(!!n,46558,{timestamp:e}),n[1]){let e=n[1];e=(e+"000000000").substr(0,9),t=Number(e)}const r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:Ru(e.seconds),nanos:Ru(e.nanos)}}function Ru(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function Pu(e){return"string"==typeof e?ku.fromBase64String(e):ku.fromUint8Array(e)}
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
 */const Ou="server_timestamp",xu="__type__",Lu="__previous_value__",Mu="__local_write_time__";function Fu(e){var t,n;return(null==(n=((null==(t=null==e?void 0:e.mapValue)?void 0:t.fields)||{})[xu])?void 0:n.stringValue)===Ou}function Vu(e){const t=e.mapValue.fields[Lu];return Fu(t)?Vu(t):t}function Uu(e){const t=Du(e.mapValue.fields[Mu].timestampValue);return new _a(t.seconds,t.nanos)}
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
 */class qu{constructor(e,t,n,r,i,s,o,a,c,u,l){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=c,this.isUsingEmulator=u,this.apiKey=l}}const Bu="(default)";class ju{constructor(e,t){this.projectId=e,this.database=t||Bu}static empty(){return new ju("","")}get isDefaultDatabase(){return this.database===Bu}isEqual(e){return e instanceof ju&&e.projectId===this.projectId&&e.database===this.database}}
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
const zu="__type__",Gu="__max__",$u={mapValue:{fields:{__type__:{stringValue:Gu}}}},Ku="__vector__",Hu="value",Wu={nullValue:"NULL_VALUE"};function Qu(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?Fu(e)?4:dl(e)?9007199254740991:ll(e)?10:11:Oo(28295,{value:e})}function Ju(e,t){if(e===t)return!0;const n=Qu(e);if(n!==Qu(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return Uu(e).isEqual(Uu(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;const n=Du(e.timestampValue),r=Du(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return r=t,Pu(e.bytesValue).isEqual(Pu(r.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return function(e,t){return Ru(e.geoPointValue.latitude)===Ru(t.geoPointValue.latitude)&&Ru(e.geoPointValue.longitude)===Ru(t.geoPointValue.longitude)}(e,t);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return Ru(e.integerValue)===Ru(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){const n=Ru(e.doubleValue),r=Ru(t.doubleValue);return n===r?nc(n)===nc(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return ta(e.arrayValue.values||[],t.arrayValue.values||[],Ju);case 10:case 11:return function(e,t){const n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(gu(n)!==gu(r))return!1;for(const i in n)if(n.hasOwnProperty(i)&&(void 0===r[i]||!Ju(n[i],r[i])))return!1;return!0}(e,t);default:return Oo(52216,{left:e})}var r}function Yu(e,t){return void 0!==(e.values||[]).find(e=>Ju(e,t))}function Xu(e,t){if(e===t)return 0;const n=Qu(e),r=Qu(t);if(n!==r)return Jo(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return Jo(e.booleanValue,t.booleanValue);case 2:return function(e,t){const n=Ru(e.integerValue||e.doubleValue),r=Ru(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return Zu(e.timestampValue,t.timestampValue);case 4:return Zu(Uu(e),Uu(t));case 5:return Yo(e.stringValue,t.stringValue);case 6:return function(e,t){const n=Pu(e),r=Pu(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){const n=e.split("/"),r=t.split("/");for(let i=0;i<n.length&&i<r.length;i++){const e=Jo(n[i],r[i]);if(0!==e)return e}return Jo(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){const n=Jo(Ru(e.latitude),Ru(t.latitude));return 0!==n?n:Jo(Ru(e.longitude),Ru(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return el(e.arrayValue,t.arrayValue);case 10:return function(e,t){var n,r,i,s;const o=e.fields||{},a=t.fields||{},c=null==(n=o[Hu])?void 0:n.arrayValue,u=null==(r=a[Hu])?void 0:r.arrayValue,l=Jo((null==(i=null==c?void 0:c.values)?void 0:i.length)||0,(null==(s=null==u?void 0:u.values)?void 0:s.length)||0);return 0!==l?l:el(c,u)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===$u.mapValue&&t===$u.mapValue)return 0;if(e===$u.mapValue)return 1;if(t===$u.mapValue)return-1;const n=e.fields||{},r=Object.keys(n),i=t.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let o=0;o<r.length&&o<s.length;++o){const e=Yo(r[o],s[o]);if(0!==e)return e;const t=Xu(n[r[o]],i[s[o]]);if(0!==t)return t}return Jo(r.length,s.length)}(e.mapValue,t.mapValue);default:throw Oo(23264,{he:n})}}function Zu(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return Jo(e,t);const n=Du(e),r=Du(t),i=Jo(n.seconds,r.seconds);return 0!==i?i:Jo(n.nanos,r.nanos)}function el(e,t){const n=e.values||[],r=t.values||[];for(let i=0;i<n.length&&i<r.length;++i){const e=Xu(n[i],r[i]);if(e)return e}return Jo(n.length,r.length)}function tl(e){return nl(e)}function nl(e){return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){const t=Du(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?Pu(e.bytesValue).toBase64():"referenceValue"in e?function(e){return ca.fromName(e).toString()}(e.referenceValue):"geoPointValue"in e?function(e){return`geo(${e.latitude},${e.longitude})`}(e.geoPointValue):"arrayValue"in e?function(e){let t="[",n=!0;for(const r of e.values||[])n?n=!1:t+=",",t+=nl(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){const t=Object.keys(e.fields||{}).sort();let n="{",r=!0;for(const i of t)r?r=!1:n+=",",n+=`${i}:${nl(e.fields[i])}`;return n+"}"}(e.mapValue):Oo(61005,{value:e})}function rl(e){switch(Qu(e)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=Vu(e);return t?16+rl(t):16;case 5:return 2*e.stringValue.length;case 6:return Pu(e.bytesValue).approximateByteSize();case 7:return e.referenceValue.length;case 9:return(e.arrayValue.values||[]).reduce((e,t)=>e+rl(t),0);case 10:case 11:return function(e){let t=0;return yu(e.fields,(e,n)=>{t+=e.length+rl(n)}),t}(e.mapValue);default:throw Oo(13486,{value:e})}}function il(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function sl(e){return!!e&&"integerValue"in e}function ol(e){return!!e&&"arrayValue"in e}function al(e){return!!e&&"nullValue"in e}function cl(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function ul(e){return!!e&&"mapValue"in e}function ll(e){var t,n;return(null==(n=((null==(t=null==e?void 0:e.mapValue)?void 0:t.fields)||{})[zu])?void 0:n.stringValue)===Ku}function hl(e){if(e.geoPointValue)return{geoPointValue:{...e.geoPointValue}};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:{...e.timestampValue}};if(e.mapValue){const t={mapValue:{fields:{}}};return yu(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=hl(n)),t}if(e.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=hl(e.arrayValue.values[n]);return t}return{...e}}function dl(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===Gu}const fl={mapValue:{fields:{[zu]:{stringValue:Ku},[Hu]:{arrayValue:{}}}}};function pl(e){return"nullValue"in e?Wu:"booleanValue"in e?{booleanValue:!1}:"integerValue"in e||"doubleValue"in e?{doubleValue:NaN}:"timestampValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in e?{stringValue:""}:"bytesValue"in e?{bytesValue:""}:"referenceValue"in e?il(ju.empty(),ca.empty()):"geoPointValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in e?{arrayValue:{}}:"mapValue"in e?ll(e)?fl:{mapValue:{}}:Oo(35942,{value:e})}function ml(e){return"nullValue"in e?{booleanValue:!1}:"booleanValue"in e?{doubleValue:NaN}:"integerValue"in e||"doubleValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in e?{stringValue:""}:"stringValue"in e?{bytesValue:""}:"bytesValue"in e?il(ju.empty(),ca.empty()):"referenceValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in e?{arrayValue:{}}:"arrayValue"in e?fl:"mapValue"in e?ll(e)?{mapValue:{}}:$u:Oo(61959,{value:e})}function gl(e,t){const n=Xu(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function yl(e,t){const n=Xu(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}
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
 */class vl{constructor(e){this.value=e}static empty(){return new vl({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!ul(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=hl(t)}setAll(e){let t=aa.emptyPath(),n={},r=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){const e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=hl(e):r.push(i.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){const t=this.field(e.popLast());ul(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ju(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];ul(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){yu(t,(t,n)=>e[t]=n);for(const r of n)delete e[r]}clone(){return new vl(hl(this.value))}}function wl(e){const t=[];return yu(e.fields,(e,n)=>{const r=new aa([e]);if(ul(n)){const e=wl(n.mapValue).fields;if(0===e.length)t.push(r);else for(const n of e)t.push(r.child(n))}else t.push(r)}),new Au(t)
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
 */}class Il{constructor(e,t,n,r,i,s,o){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=o}static newInvalidDocument(e){return new Il(e,0,Ta.min(),Ta.min(),Ta.min(),vl.empty(),0)}static newFoundDocument(e,t,n,r){return new Il(e,1,t,Ta.min(),n,r,0)}static newNoDocument(e,t){return new Il(e,2,t,Ta.min(),Ta.min(),vl.empty(),0)}static newUnknownDocument(e,t){return new Il(e,3,t,Ta.min(),Ta.min(),vl.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Ta.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=vl.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=vl.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Ta.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof Il&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Il(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
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
 */class _l{constructor(e,t){this.position=e,this.inclusive=t}}function Tl(e,t,n){let r=0;for(let i=0;i<e.position.length;i++){const s=t[i],o=e.position[i];if(r=s.field.isKeyField()?ca.comparator(ca.fromName(o.referenceValue),n.key):Xu(o,n.data.field(s.field)),"desc"===s.dir&&(r*=-1),0!==r)break}return r}function bl(e,t){if(null===e)return null===t;if(null===t)return!1;if(e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!Ju(e.position[n],t.position[n]))return!1;return!0}
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
 */class El{constructor(e,t="asc"){this.field=e,this.dir=t}}function Sl(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}
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
 */class Al{}class Cl extends Al{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new Fl(e,t,n):"array-contains"===t?new Bl(e,n):"in"===t?new jl(e,n):"not-in"===t?new zl(e,n):"array-contains-any"===t?new Gl(e,n):new Cl(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new Vl(e,n):new Ul(e,n)}matches(e){const t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(Xu(t,this.value)):null!==t&&Qu(this.value)===Qu(t)&&this.matchesComparison(Xu(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return Oo(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class kl extends Al{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new kl(e,t)}matches(e){return Nl(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.Pe||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Nl(e){return"and"===e.op}function Dl(e){return"or"===e.op}function Rl(e){return Pl(e)&&Nl(e)}function Pl(e){for(const t of e.filters)if(t instanceof kl)return!1;return!0}function Ol(e){if(e instanceof Cl)return e.field.canonicalString()+e.op.toString()+tl(e.value);if(Rl(e))return e.filters.map(e=>Ol(e)).join(",");{const t=e.filters.map(e=>Ol(e)).join(",");return`${e.op}(${t})`}}function xl(e,t){return e instanceof Cl?(n=e,(r=t)instanceof Cl&&n.op===r.op&&n.field.isEqual(r.field)&&Ju(n.value,r.value)):e instanceof kl?function(e,t){return t instanceof kl&&e.op===t.op&&e.filters.length===t.filters.length&&e.filters.reduce((e,n,r)=>e&&xl(n,t.filters[r]),!0)}(e,t):void Oo(19439);var n,r}function Ll(e,t){const n=e.filters.concat(t);return kl.create(n,e.op)}function Ml(e){return e instanceof Cl?`${(t=e).field.canonicalString()} ${t.op} ${tl(t.value)}`:e instanceof kl?function(e){return e.op.toString()+" {"+e.getFilters().map(Ml).join(" ,")+"}"}(e):"Filter";var t}class Fl extends Cl{constructor(e,t,n){super(e,t,n),this.key=ca.fromName(n.referenceValue)}matches(e){const t=ca.comparator(e.key,this.key);return this.matchesComparison(t)}}class Vl extends Cl{constructor(e,t){super(e,"in",t),this.keys=ql("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Ul extends Cl{constructor(e,t){super(e,"not-in",t),this.keys=ql("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function ql(e,t){var n;return((null==(n=t.arrayValue)?void 0:n.values)||[]).map(e=>ca.fromName(e.referenceValue))}class Bl extends Cl{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ol(t)&&Yu(t.arrayValue,this.value)}}class jl extends Cl{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return null!==t&&Yu(this.value.arrayValue,t)}}class zl extends Cl{constructor(e,t){super(e,"not-in",t)}matches(e){if(Yu(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!Yu(this.value.arrayValue,t)}}class Gl extends Cl{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ol(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>Yu(this.value.arrayValue,e))}}
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
 */class $l{constructor(e,t=null,n=[],r=[],i=null,s=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=o,this.Te=null}}function Kl(e,t=null,n=[],r=[],i=null,s=null,o=null){return new $l(e,t,n,r,i,s,o)}function Hl(e){const t=Mo(e);if(null===t.Te){let e=t.path.canonicalString();null!==t.collectionGroup&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(e=>Ol(e)).join(","),e+="|ob:",e+=t.orderBy.map(e=>{return(t=e).field.canonicalString()+t.dir;var t}).join(","),tc(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(e=>tl(e)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(e=>tl(e)).join(",")),t.Te=e}return t.Te}function Wl(e,t){if(e.limit!==t.limit)return!1;if(e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!Sl(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!xl(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!bl(e.startAt,t.startAt)&&bl(e.endAt,t.endAt)}function Ql(e){return ca.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function Jl(e,t){return e.filters.filter(e=>e instanceof Cl&&e.field.isEqual(t))}function Yl(e,t,n){let r=Wu,i=!0;for(const s of Jl(e,t)){let e=Wu,t=!0;switch(s.op){case"<":case"<=":e=pl(s.value);break;case"==":case"in":case">=":e=s.value;break;case">":e=s.value,t=!1;break;case"!=":case"not-in":e=Wu}gl({value:r,inclusive:i},{value:e,inclusive:t})<0&&(r=e,i=t)}if(null!==n)for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){const e=n.position[s];gl({value:r,inclusive:i},{value:e,inclusive:n.inclusive})<0&&(r=e,i=n.inclusive);break}return{value:r,inclusive:i}}function Xl(e,t,n){let r=$u,i=!0;for(const s of Jl(e,t)){let e=$u,t=!0;switch(s.op){case">=":case">":e=ml(s.value),t=!1;break;case"==":case"in":case"<=":e=s.value;break;case"<":e=s.value,t=!1;break;case"!=":case"not-in":e=$u}yl({value:r,inclusive:i},{value:e,inclusive:t})>0&&(r=e,i=t)}if(null!==n)for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){const e=n.position[s];yl({value:r,inclusive:i},{value:e,inclusive:n.inclusive})>0&&(r=e,i=n.inclusive);break}return{value:r,inclusive:i}}
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
 */class Zl{constructor(e,t=null,n=[],r=[],i=null,s="F",o=null,a=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=o,this.endAt=a,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function eh(e,t,n,r,i,s,o,a){return new Zl(e,t,n,r,i,s,o,a)}function th(e){return new Zl(e)}function nh(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function rh(e){return null!==e.collectionGroup}function ih(e){const t=Mo(e);if(null===t.Ie){t.Ie=[];const e=new Set;for(const r of t.explicitOrderBy)t.Ie.push(r),e.add(r.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(e){let t=new bu(aa.comparator);return e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t})(t).forEach(r=>{e.has(r.canonicalString())||r.isKeyField()||t.Ie.push(new El(r,n))}),e.has(aa.keyField().canonicalString())||t.Ie.push(new El(aa.keyField(),n))}return t.Ie}function sh(e){const t=Mo(e);return t.Ee||(t.Ee=ah(t,ih(e))),t.Ee}function oh(e){const t=Mo(e);return t.Re||(t.Re=ah(t,e.explicitOrderBy)),t.Re}function ah(e,t){if("F"===e.limitType)return Kl(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{const t="desc"===e.dir?"asc":"desc";return new El(e.field,t)});const n=e.endAt?new _l(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new _l(e.startAt.position,e.startAt.inclusive):null;return Kl(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}function ch(e,t){const n=e.filters.concat([t]);return new Zl(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function uh(e,t,n){return new Zl(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function lh(e,t){return Wl(sh(e),sh(t))&&e.limitType===t.limitType}function hh(e){return`${Hl(sh(e))}|lt:${e.limitType}`}function dh(e){return`Query(target=${function(e){let t=e.path.canonicalString();return null!==e.collectionGroup&&(t+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(t+=`, filters: [${e.filters.map(e=>Ml(e)).join(", ")}]`),tc(e.limit)||(t+=", limit: "+e.limit),e.orderBy.length>0&&(t+=`, orderBy: [${e.orderBy.map(e=>{return`${(t=e).field.canonicalString()} (${t.dir})`;var t}).join(", ")}]`),e.startAt&&(t+=", startAt: ",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(e=>tl(e)).join(",")),e.endAt&&(t+=", endAt: ",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(e=>tl(e)).join(",")),`Target(${t})`}(sh(e))}; limitType=${e.limitType})`}function fh(e,t){return t.isFoundDocument()&&function(e,t){const n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):ca.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(const n of ih(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(const n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(r=t,!((n=e).startAt&&!function(e,t,n){const r=Tl(e,t,n);return e.inclusive?r<=0:r<0}(n.startAt,ih(n),r)||n.endAt&&!function(e,t,n){const r=Tl(e,t,n);return e.inclusive?r>=0:r>0}(n.endAt,ih(n),r)));var n,r}function ph(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function mh(e){return(t,n)=>{let r=!1;for(const i of ih(e)){const e=gh(i,t,n);if(0!==e)return e;r=r||i.field.isKeyField()}return 0}}function gh(e,t,n){const r=e.field.isKeyField()?ca.comparator(t.key,n.key):function(e,t,n){const r=t.data.field(e),i=n.data.field(e);return null!==r&&null!==i?Xu(r,i):Oo(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return-1*r;default:return Oo(19790,{direction:e.dir})}}
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
 */class yh{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n)for(const[r,i]of n)if(this.equalsFn(r,e))return i}has(e){return void 0!==this.get(e)}set(e,t){const n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){yu(this.inner,(t,n)=>{for(const[r,i]of n)e(r,i)})}isEmpty(){return wu(this.inner)}size(){return this.innerSize}}
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
 */const vh=new Iu(ca.comparator);function wh(){return vh}const Ih=new Iu(ca.comparator);function _h(...e){let t=Ih;for(const n of e)t=t.insert(n.key,n);return t}function Th(e){let t=Ih;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function bh(){return Sh()}function Eh(){return Sh()}function Sh(){return new yh(e=>e.toString(),(e,t)=>e.isEqual(t))}const Ah=new Iu(ca.comparator),Ch=new bu(ca.comparator);function kh(...e){let t=Ch;for(const n of e)t=t.add(n);return t}const Nh=new bu(Jo);function Dh(){return Nh}
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
 */function Rh(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:nc(t)?"-0":t}}function Ph(e){return{integerValue:""+e}}function Oh(e,t){return rc(t)?Ph(t):Rh(e,t)}
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
 */class xh{constructor(){this._=void 0}}function Lh(e,t,n){return e instanceof Vh?function(e,t){const n={fields:{[xu]:{stringValue:Ou},[Mu]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&Fu(t)&&(t=Vu(t)),t&&(n.fields[Lu]=t),{mapValue:n}}(n,t):e instanceof Uh?qh(e,t):e instanceof Bh?jh(e,t):function(e,t){const n=Fh(e,t),r=Gh(n)+Gh(e.Ae);return sl(n)&&sl(e.Ae)?Ph(r):Rh(e.serializer,r)}(e,t)}function Mh(e,t,n){return e instanceof Uh?qh(e,t):e instanceof Bh?jh(e,t):n}function Fh(e,t){return e instanceof zh?sl(n=t)||(r=n)&&"doubleValue"in r?t:{integerValue:0}:null;var n,r}class Vh extends xh{}class Uh extends xh{constructor(e){super(),this.elements=e}}function qh(e,t){const n=$h(t);for(const r of e.elements)n.some(e=>Ju(e,r))||n.push(r);return{arrayValue:{values:n}}}class Bh extends xh{constructor(e){super(),this.elements=e}}function jh(e,t){let n=$h(t);for(const r of e.elements)n=n.filter(e=>!Ju(e,r));return{arrayValue:{values:n}}}class zh extends xh{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function Gh(e){return Ru(e.integerValue||e.doubleValue)}function $h(e){return ol(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}
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
 */class Kh{constructor(e,t){this.field=e,this.transform=t}}class Hh{constructor(e,t){this.version=e,this.transformResults=t}}class Wh{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Wh}static exists(e){return new Wh(void 0,e)}static updateTime(e){return new Wh(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Qh(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class Jh{}function Yh(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new ad(e.key,Wh.none()):new nd(e.key,e.data,Wh.none());{const n=e.data,r=vl.empty();let i=new bu(aa.comparator);for(let e of t.fields)if(!i.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),i=i.add(e)}return new rd(e.key,r,new Au(i.toArray()),Wh.none())}}function Xh(e,t,n){var r;e instanceof nd?function(e,t,n){const r=e.value.clone(),i=sd(e.fieldTransforms,t,n.transformResults);r.setAll(i),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(e,t,n):e instanceof rd?function(e,t,n){if(!Qh(e.precondition,t))return void t.convertToUnknownDocument(n.version);const r=sd(e.fieldTransforms,t,n.transformResults),i=t.data;i.setAll(id(e)),i.setAll(r),t.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(e,t,n):(r=n,t.convertToNoDocument(r.version).setHasCommittedMutations())}function Zh(e,t,n,r){return e instanceof nd?function(e,t,n,r){if(!Qh(e.precondition,t))return n;const i=e.value.clone(),s=od(e.fieldTransforms,r,t);return i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,n,r):e instanceof rd?function(e,t,n,r){if(!Qh(e.precondition,t))return n;const i=od(e.fieldTransforms,r,t),s=t.data;return s.setAll(id(e)),s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null===n?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):(i=t,s=n,Qh(e.precondition,i)?(i.convertToNoDocument(i.version).setHasLocalMutations(),null):s);var i,s}function ed(e,t){let n=null;for(const r of e.fieldTransforms){const e=t.data.field(r.field),i=Fh(r.transform,e||null);null!=i&&(null===n&&(n=vl.empty()),n.set(r.field,i))}return n||null}function td(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||n&&r&&ta(n,r,(e,t)=>function(e,t){return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof Uh&&r instanceof Uh||n instanceof Bh&&r instanceof Bh?ta(n.elements,r.elements,Ju):n instanceof zh&&r instanceof zh?Ju(n.Ae,r.Ae):n instanceof Vh&&r instanceof Vh);var n,r}(e,t)))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask)));var n,r}class nd extends Jh{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class rd extends Jh{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function id(e){const t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=e.data.field(n);t.set(n,r)}}),t}function sd(e,t,n){const r=new Map;Lo(e.length===n.length,32656,{Ve:n.length,de:e.length});for(let i=0;i<n.length;i++){const s=e[i],o=s.transform,a=t.data.field(s.field);r.set(s.field,Mh(o,a,n[i]))}return r}function od(e,t,n){const r=new Map;for(const i of e){const e=i.transform,s=n.data.field(i.field);r.set(i.field,Lh(e,s,t))}return r}class ad extends Jh{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class cd extends Jh{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
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
 */class ud{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const t=this.mutations[r];t.key.isEqual(e.key)&&Xh(t,e,n[r])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Zh(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Zh(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Eh();return this.mutations.forEach(r=>{const i=e.get(r.key),s=i.overlayedDocument;let o=this.applyToLocalView(s,i.mutatedFields);o=t.has(r.key)?null:o;const a=Yh(s,o);null!==a&&n.set(r.key,a),s.isValidDocument()||s.convertToNoDocument(Ta.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),kh())}isEqual(e){return this.batchId===e.batchId&&ta(this.mutations,e.mutations,(e,t)=>td(e,t))&&ta(this.baseMutations,e.baseMutations,(e,t)=>td(e,t))}}class ld{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){Lo(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let r=function(){return Ah}();const i=e.mutations;for(let s=0;s<i.length;s++)r=r.insert(i[s].key,n[s].version);return new ld(e,t,n,r)}}
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
 */class hd{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
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
 */class dd{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}
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
 */class fd{constructor(e,t){this.count=e,this.unchangedNames=t}}
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
 */var pd,md;function gd(e){switch(e){case Fo.OK:return Oo(64938);case Fo.CANCELLED:case Fo.UNKNOWN:case Fo.DEADLINE_EXCEEDED:case Fo.RESOURCE_EXHAUSTED:case Fo.INTERNAL:case Fo.UNAVAILABLE:case Fo.UNAUTHENTICATED:return!1;case Fo.INVALID_ARGUMENT:case Fo.NOT_FOUND:case Fo.ALREADY_EXISTS:case Fo.PERMISSION_DENIED:case Fo.FAILED_PRECONDITION:case Fo.ABORTED:case Fo.OUT_OF_RANGE:case Fo.UNIMPLEMENTED:case Fo.DATA_LOSS:return!0;default:return Oo(15467,{code:e})}}function yd(e){if(void 0===e)return Do("GRPC error has no .code"),Fo.UNKNOWN;switch(e){case pd.OK:return Fo.OK;case pd.CANCELLED:return Fo.CANCELLED;case pd.UNKNOWN:return Fo.UNKNOWN;case pd.DEADLINE_EXCEEDED:return Fo.DEADLINE_EXCEEDED;case pd.RESOURCE_EXHAUSTED:return Fo.RESOURCE_EXHAUSTED;case pd.INTERNAL:return Fo.INTERNAL;case pd.UNAVAILABLE:return Fo.UNAVAILABLE;case pd.UNAUTHENTICATED:return Fo.UNAUTHENTICATED;case pd.INVALID_ARGUMENT:return Fo.INVALID_ARGUMENT;case pd.NOT_FOUND:return Fo.NOT_FOUND;case pd.ALREADY_EXISTS:return Fo.ALREADY_EXISTS;case pd.PERMISSION_DENIED:return Fo.PERMISSION_DENIED;case pd.FAILED_PRECONDITION:return Fo.FAILED_PRECONDITION;case pd.ABORTED:return Fo.ABORTED;case pd.OUT_OF_RANGE:return Fo.OUT_OF_RANGE;case pd.UNIMPLEMENTED:return Fo.UNIMPLEMENTED;case pd.DATA_LOSS:return Fo.DATA_LOSS;default:return Oo(39323,{code:e})}}(md=pd||(pd={}))[md.OK=0]="OK",md[md.CANCELLED=1]="CANCELLED",md[md.UNKNOWN=2]="UNKNOWN",md[md.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",md[md.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",md[md.NOT_FOUND=5]="NOT_FOUND",md[md.ALREADY_EXISTS=6]="ALREADY_EXISTS",md[md.PERMISSION_DENIED=7]="PERMISSION_DENIED",md[md.UNAUTHENTICATED=16]="UNAUTHENTICATED",md[md.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",md[md.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",md[md.ABORTED=10]="ABORTED",md[md.OUT_OF_RANGE=11]="OUT_OF_RANGE",md[md.UNIMPLEMENTED=12]="UNIMPLEMENTED",md[md.INTERNAL=13]="INTERNAL",md[md.UNAVAILABLE=14]="UNAVAILABLE",md[md.DATA_LOSS=15]="DATA_LOSS";
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
let vd=null;
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
function wd(){return new TextEncoder}
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
 */const Id=new fo([4294967295,4294967295],0);function _d(e){const t=wd().encode(e),n=new po;return n.update(t),new Uint8Array(n.digest())}function Td(e){const t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),i=t.getUint32(8,!0),s=t.getUint32(12,!0);return[new fo([n,r],0),new fo([i,s],0)]}class bd{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Ed(`Invalid padding: ${t}`);if(n<0)throw new Ed(`Invalid hash count: ${n}`);if(e.length>0&&0===this.hashCount)throw new Ed(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new Ed(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=fo.fromNumber(this.ge)}ye(e,t,n){let r=e.add(t.multiply(fo.fromNumber(n)));return 1===r.compare(Id)&&(r=new fo([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.ge)return!1;const t=_d(e),[n,r]=Td(t);for(let i=0;i<this.hashCount;i++){const e=this.ye(n,r,i);if(!this.we(e))return!1}return!0}static create(e,t,n){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),s=new bd(i,r,t);return n.forEach(e=>s.insert(e)),s}insert(e){if(0===this.ge)return;const t=_d(e),[n,r]=Td(t);for(let i=0;i<this.hashCount;i++){const e=this.ye(n,r,i);this.be(e)}}be(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Ed extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
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
 */class Sd{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const r=new Map;return r.set(e,Ad.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new Sd(Ta.min(),r,new Iu(Jo),wh(),kh())}}class Ad{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Ad(n,t,kh(),kh(),kh())}}
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
 */class Cd{constructor(e,t,n,r){this.Se=e,this.removedTargetIds=t,this.key=n,this.De=r}}class kd{constructor(e,t){this.targetId=e,this.Ce=t}}class Nd{constructor(e,t,n=ku.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class Dd{constructor(){this.ve=0,this.Fe=Od(),this.Me=ku.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return 0!==this.ve}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=kh(),t=kh(),n=kh();return this.Fe.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:Oo(38017,{changeType:i})}}),new Ad(this.Me,this.xe,e,t,n)}Ke(){this.Oe=!1,this.Fe=Od()}qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,Lo(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class Rd{constructor(e){this.Ge=e,this.ze=new Map,this.je=wh(),this.He=Pd(),this.Je=Pd(),this.Ze=new Iu(Jo)}Xe(e){for(const t of e.Se)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.We(),n.Ne||n.Ke(),n.Le(e.resumeToken);break;case 2:n.We(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.Qe(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:Oo(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((e,n)=>{this.rt(n)&&t(n)})}st(e){const t=e.targetId,n=e.Ce.count,r=this.ot(t);if(r){const i=r.target;if(Ql(i))if(0===n){const e=new ca(i.path);this.et(t,e,Il.newNoDocument(e,Ta.min()))}else Lo(1===n,20013,{expectedCount:n});else{const r=this._t(t);if(r!==n){const n=this.ut(e),i=n?this.ct(n,e,r):1;if(0!==i){this.it(t);const e=2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,e)}null==vd||vd.lt(function(e,t,n,r,i){var s,o,a;const c={localCacheCount:e,existenceFilterCount:t.count,databaseId:n.database,projectId:n.projectId},u=t.unchangedNames;return u&&(c.bloomFilter={applied:0===i,hashCount:(null==u?void 0:u.hashCount)??0,bitmapLength:(null==(o=null==(s=null==u?void 0:u.bits)?void 0:s.bitmap)?void 0:o.length)??0,padding:(null==(a=null==u?void 0:u.bits)?void 0:a.padding)??0,mightContain:e=>(null==r?void 0:r.mightContain(e))??!1}),c}(r,e.Ce,this.Ge.ht(),n,i))}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:i=0}=t;let s,o;try{s=Pu(n).toUint8Array()}catch(a){if(a instanceof Cu)return Ro("Decoding the base64 bloom filter in existence filter failed ("+a.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw a}try{o=new bd(s,r,i)}catch(a){return Ro(a instanceof Ed?"BloomFilter error: ":"Applying bloom filter failed: ",a),null}return 0===o.ge?null:o}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let r=0;return n.forEach(n=>{const i=this.Ge.ht(),s=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;e.mightContain(s)||(this.et(t,n,null),r++)}),r}Tt(e){const t=new Map;this.ze.forEach((n,r)=>{const i=this.ot(r);if(i){if(n.current&&Ql(i.target)){const t=new ca(i.target.path);this.It(t).has(r)||this.Et(r,t)||this.et(r,t,Il.newNoDocument(t,e))}n.Be&&(t.set(r,n.ke()),n.Ke())}});let n=kh();this.Je.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{const t=this.ot(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.je.forEach((t,n)=>n.setReadTime(e));const r=new Sd(e,t,this.Ze,this.je,n);return this.je=wh(),this.He=Pd(),this.Je=Pd(),this.Ze=new Iu(Jo),r}Ye(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).qe(t.key,n),this.je=this.je.insert(t.key,t),this.He=this.He.insert(t.key,this.It(t.key).add(e)),this.Je=this.Je.insert(t.key,this.Rt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const r=this.nt(e);this.Et(e,t)?r.qe(t,1):r.Ue(t),this.Je=this.Je.insert(t,this.Rt(t).delete(e)),this.Je=this.Je.insert(t,this.Rt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new Dd,this.ze.set(e,t)),t}Rt(e){let t=this.Je.get(e);return t||(t=new bu(Jo),this.Je=this.Je.insert(e,t)),t}It(e){let t=this.He.get(e);return t||(t=new bu(Jo),this.He=this.He.insert(e,t)),t}rt(e){const t=null!==this.ot(e);return t||No("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new Dd),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Pd(){return new Iu(ca.comparator)}function Od(){return new Iu(ca.comparator)}const xd=(()=>({asc:"ASCENDING",desc:"DESCENDING"}))(),Ld=(()=>({"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"}))(),Md=(()=>({and:"AND",or:"OR"}))();class Fd{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Vd(e,t){return e.useProto3Json||tc(t)?t:{value:t}}function Ud(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function qd(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function Bd(e,t){return Ud(e,t.toTimestamp())}function jd(e){return Lo(!!e,49232),Ta.fromTimestamp(function(e){const t=Du(e);return new _a(t.seconds,t.nanos)}(e))}function zd(e,t){return Gd(e,t).canonicalString()}function Gd(e,t){const n=(r=e,new sa(["projects",r.projectId,"databases",r.database])).child("documents");var r;return void 0===t?n:n.child(t)}function $d(e){const t=sa.fromString(e);return Lo(mf(t),10190,{key:t.toString()}),t}function Kd(e,t){return zd(e.databaseId,t.path)}function Hd(e,t){const n=$d(t);if(n.get(1)!==e.databaseId.projectId)throw new Vo(Fo.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new Vo(Fo.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new ca(Yd(n))}function Wd(e,t){return zd(e.databaseId,t)}function Qd(e){const t=$d(e);return 4===t.length?sa.emptyPath():Yd(t)}function Jd(e){return new sa(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function Yd(e){return Lo(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function Xd(e,t,n){return{name:Kd(e,t),fields:n.value.mapValue.fields}}function Zd(e,t,n){const r=Hd(e,t.name),i=jd(t.updateTime),s=t.createTime?jd(t.createTime):Ta.min(),o=new vl({mapValue:{fields:t.fields}}),a=Il.newFoundDocument(r,i,s,o);return n&&a.setHasCommittedMutations(),n?a.setHasCommittedMutations():a}function ef(e,t){let n;if(t instanceof nd)n={update:Xd(e,t.key,t.value)};else if(t instanceof ad)n={delete:Kd(e,t.key)};else if(t instanceof rd)n={update:Xd(e,t.key,t.data),updateMask:pf(t.fieldMask)};else{if(!(t instanceof cd))return Oo(16599,{dt:t.type});n={verify:Kd(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>function(e,t){const n=t.transform;if(n instanceof Vh)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof Uh)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof Bh)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof zh)return{fieldPath:t.field.canonicalString(),increment:n.Ae};throw Oo(20930,{transform:t.transform})}(0,e))),t.precondition.isNone||(n.currentDocument=(r=e,void 0!==(i=t.precondition).updateTime?{updateTime:Bd(r,i.updateTime)}:void 0!==i.exists?{exists:i.exists}:Oo(27497))),n;var r,i}function tf(e,t){const n=t.currentDocument?void 0!==(i=t.currentDocument).updateTime?Wh.updateTime(jd(i.updateTime)):void 0!==i.exists?Wh.exists(i.exists):Wh.none():Wh.none(),r=t.updateTransforms?t.updateTransforms.map(t=>function(e,t){let n=null;if("setToServerValue"in t)Lo("REQUEST_TIME"===t.setToServerValue,16630,{proto:t}),n=new Vh;else if("appendMissingElements"in t){const e=t.appendMissingElements.values||[];n=new Uh(e)}else if("removeAllFromArray"in t){const e=t.removeAllFromArray.values||[];n=new Bh(e)}else"increment"in t?n=new zh(e,t.increment):Oo(16584,{proto:t});const r=aa.fromServerFormat(t.fieldPath);return new Kh(r,n)}(e,t)):[];var i;if(t.update){t.update.name;const i=Hd(e,t.update.name),s=new vl({mapValue:{fields:t.update.fields}});if(t.updateMask){const e=function(e){const t=e.fieldPaths||[];return new Au(t.map(e=>aa.fromServerFormat(e)))}(t.updateMask);return new rd(i,s,e,n,r)}return new nd(i,s,n,r)}if(t.delete){const r=Hd(e,t.delete);return new ad(r,n)}if(t.verify){const r=Hd(e,t.verify);return new cd(r,n)}return Oo(1463,{proto:t})}function nf(e,t){return{documents:[Wd(e,t.path)]}}function rf(e,t){const n={structuredQuery:{}},r=t.path;let i;null!==t.collectionGroup?(i=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Wd(e,i);const s=function(e){if(0!==e.length)return ff(kl.create(e,"and"))}(t.filters);s&&(n.structuredQuery.where=s);const o=function(e){if(0!==e.length)return e.map(e=>{return{field:hf((t=e).field),direction:cf(t.dir)};var t})}(t.orderBy);o&&(n.structuredQuery.orderBy=o);const a=Vd(e,t.limit);return null!==a&&(n.structuredQuery.limit=a),t.startAt&&(n.structuredQuery.startAt={before:(c=t.startAt).inclusive,values:c.position}),t.endAt&&(n.structuredQuery.endAt=function(e){return{before:!e.inclusive,values:e.position}}(t.endAt)),{ft:n,parent:i};var c}function sf(e,t,n,r){const{ft:i,parent:s}=rf(e,t),o={},a=[];let c=0;return n.forEach(e=>{const t=r?e.alias:"aggregate_"+c++;o[t]=e.alias,"count"===e.aggregateType?a.push({alias:t,count:{}}):"avg"===e.aggregateType?a.push({alias:t,avg:{field:hf(e.fieldPath)}}):"sum"===e.aggregateType&&a.push({alias:t,sum:{field:hf(e.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:a,structuredQuery:i.structuredQuery},parent:i.parent},gt:o,parent:s}}function of(e){let t=Qd(e.parent);const n=e.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){Lo(1===r,65062);const e=n.from[0];e.allDescendants?i=e.collectionId:t=t.child(e.collectionId)}let s=[];n.where&&(s=function(e){const t=af(e);return t instanceof kl&&Rl(t)?t.getFilters():[t]}(n.where));let o=[];n.orderBy&&(o=n.orderBy.map(e=>{return new El(df((t=e).field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(t.direction));var t}));let a=null;n.limit&&(a=function(e){let t;return t="object"==typeof e?e.value:e,tc(t)?null:t}(n.limit));let c=null;n.startAt&&(c=function(e){const t=!!e.before,n=e.values||[];return new _l(n,t)}(n.startAt));let u=null;return n.endAt&&(u=function(e){const t=!e.before,n=e.values||[];return new _l(n,t)}(n.endAt)),eh(t,i,o,s,a,"F",c,u)}function af(e){return void 0!==e.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":const t=df(e.unaryFilter.field);return Cl.create(t,"==",{doubleValue:NaN});case"IS_NULL":const n=df(e.unaryFilter.field);return Cl.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=df(e.unaryFilter.field);return Cl.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const i=df(e.unaryFilter.field);return Cl.create(i,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Oo(61313);default:return Oo(60726)}}(e):void 0!==e.fieldFilter?(t=e,Cl.create(df(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Oo(58110);default:return Oo(50506)}}(t.fieldFilter.op),t.fieldFilter.value)):void 0!==e.compositeFilter?function(e){return kl.create(e.compositeFilter.filters.map(e=>af(e)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return Oo(1026)}}(e.compositeFilter.op))}(e):Oo(30097,{filter:e});var t}function cf(e){return xd[e]}function uf(e){return Ld[e]}function lf(e){return Md[e]}function hf(e){return{fieldPath:e.canonicalString()}}function df(e){return aa.fromServerFormat(e.fieldPath)}function ff(e){return e instanceof Cl?function(e){if("=="===e.op){if(cl(e.value))return{unaryFilter:{field:hf(e.field),op:"IS_NAN"}};if(al(e.value))return{unaryFilter:{field:hf(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(cl(e.value))return{unaryFilter:{field:hf(e.field),op:"IS_NOT_NAN"}};if(al(e.value))return{unaryFilter:{field:hf(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:hf(e.field),op:uf(e.op),value:e.value}}}(e):e instanceof kl?function(e){const t=e.getFilters().map(e=>ff(e));return 1===t.length?t[0]:{compositeFilter:{op:lf(e.op),filters:t}}}(e):Oo(54877,{filter:e})}function pf(e){const t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function mf(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}function gf(e){return!!e&&"function"==typeof e._toProto&&"ProtoValue"===e._protoValueType}
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
 */class yf{constructor(e,t,n,r,i=Ta.min(),s=Ta.min(),o=ku.EMPTY_BYTE_STRING,a=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(e){return new yf(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new yf(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new yf(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new yf(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}
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
 */class vf{constructor(e){this.yt=e}}function wf(e,t){const n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:If(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())r.document={name:Kd(i=e.yt,(s=t).key),fields:s.data.value.mapValue.fields,updateTime:Ud(i,s.version.toTimestamp()),createTime:Ud(i,s.createTime.toTimestamp())};else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:_f(t.version)};else{if(!t.isUnknownDocument())return Oo(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:_f(t.version)}}var i,s;return r}function If(e){const t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function _f(e){const t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function Tf(e){const t=new _a(e.seconds,e.nanoseconds);return Ta.fromTimestamp(t)}function bf(e,t){const n=(t.baseMutations||[]).map(t=>tf(e.yt,t));for(let s=0;s<t.mutations.length-1;++s){const e=t.mutations[s];if(s+1<t.mutations.length&&void 0!==t.mutations[s+1].transform){const n=t.mutations[s+1];e.updateTransforms=n.transform.fieldTransforms,t.mutations.splice(s+1,1),++s}}const r=t.mutations.map(t=>tf(e.yt,t)),i=_a.fromMillis(t.localWriteTimeMs);return new ud(t.batchId,i,n,r)}function Ef(e){const t=Tf(e.readTime),n=void 0!==e.lastLimboFreeSnapshotVersion?Tf(e.lastLimboFreeSnapshotVersion):Ta.min();let r;return r=void 0!==e.query.documents?function(e){const t=e.documents.length;return Lo(1===t,1966,{count:t}),sh(th(Qd(e.documents[0])))}(e.query):function(e){return sh(of(e))}(e.query),new yf(r,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,ku.fromBase64String(e.resumeToken))}function Sf(e,t){const n=_f(t.snapshotVersion),r=_f(t.lastLimboFreeSnapshotVersion);let i;i=Ql(t.target)?nf(e.yt,t.target):rf(e.yt,t.target).ft;const s=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:Hl(t.target),readTime:n,resumeToken:s,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function Af(e){const t=of({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?uh(t,t.limit,"L"):t}function Cf(e,t){return new hd(t.largestBatchId,tf(e.yt,t.overlayMutation))}function kf(e,t){const n=t.path.lastSegment();return[e,sc(t.path.popLast()),n]}function Nf(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:_f(r.readTime),documentKey:sc(r.documentKey.path),largestBatchId:r.largestBatchId}}
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
 */class Df{getBundleMetadata(e,t){return Rf(e).get(t).next(e=>{if(e)return{id:(t=e).bundleId,createTime:Tf(t.createTime),version:t.version};var t})}saveBundleMetadata(e,t){return Rf(e).put({bundleId:(n=t).id,createTime:_f(jd(n.createTime)),version:n.version});var n}getNamedQuery(e,t){return Pf(e).get(t).next(e=>{if(e)return{name:(t=e).name,query:Af(t.bundledQuery),readTime:Tf(t.readTime)};var t})}saveNamedQuery(e,t){return Pf(e).put({name:(n=t).name,readTime:_f(jd(n.readTime)),bundledQuery:n.bundledQuery});var n}}function Rf(e){return mu(e,Bc)}function Pf(e){return mu(e,jc)}
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
 */class Of{constructor(e,t){this.serializer=e,this.userId=t}static wt(e,t){const n=t.uid||"";return new Of(e,n)}getOverlay(e,t){return xf(e).get(kf(this.userId,t)).next(e=>e?Cf(this.serializer,e):null)}getOverlays(e,t){const n=bh();return Va.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){const r=[];return n.forEach((n,i)=>{const s=new hd(t,i);r.push(this.bt(e,s))}),Va.waitFor(r)}removeOverlaysForBatchId(e,t,n){const r=new Set;t.forEach(e=>r.add(sc(e.getCollectionPath())));const i=[];return r.forEach(t=>{const r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);i.push(xf(e).X(tu,r))}),Va.waitFor(i)}getOverlaysForCollection(e,t,n){const r=bh(),i=sc(t),s=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return xf(e).H(tu,s).next(e=>{for(const t of e){const e=Cf(this.serializer,t);r.set(e.getKey(),e)}return r})}getOverlaysForCollectionGroup(e,t,n,r){const i=bh();let s;const o=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return xf(e).ee({index:ru,range:o},(e,t,n)=>{const o=Cf(this.serializer,t);i.size()<r||o.largestBatchId===s?(i.set(o.getKey(),o),s=o.largestBatchId):n.done()}).next(()=>i)}bt(e,t){return xf(e).put(function(e,t,n){const[r,i,s]=kf(t,n.mutation.key);return{userId:t,collectionPath:i,documentId:s,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:ef(e.yt,n.mutation)}}(this.serializer,this.userId,t))}}function xf(e){return mu(e,Zc)}
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
 */class Lf{St(e){return mu(e,su)}getSessionToken(e){return this.St(e).get("sessionToken").next(e=>{const t=null==e?void 0:e.value;return t?ku.fromUint8Array(t):ku.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.St(e).put({name:"sessionToken",value:t.toUint8Array()})}}
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
 */class Mf{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(Ru(e.integerValue));else if("doubleValue"in e){const n=Ru(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),nc(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),"string"==typeof n&&(n=Du(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(Pu(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?dl(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):ll(e)?this.kt(e.mapValue,t):(this.Kt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Nt(t)):Oo(19022,{Ut:e})}Ot(e,t){this.Ft(t,25),this.$t(e,t)}$t(e,t){t.xt(e)}Kt(e,t){const n=e.fields||{};this.Ft(t,55);for(const r of Object.keys(n))this.Ot(r,t),this.Ct(n[r],t)}kt(e,t){var n,r;const i=e.fields||{};this.Ft(t,53);const s=Hu,o=(null==(r=null==(n=i[s].arrayValue)?void 0:n.values)?void 0:r.length)||0;this.Ft(t,15),t.Mt(Ru(o)),this.Ot(s,t),this.Ct(i[s],t)}qt(e,t){const n=e.values||[];this.Ft(t,50);for(const r of n)this.Ct(r,t)}Lt(e,t){this.Ft(t,37),ca.fromName(e).path.forEach(e=>{this.Ft(t,60),this.$t(e,t)})}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}Mf.Wt=new Mf;
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
const Ff=255;function Vf(e){if(0===e)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}function Uf(e){const t=64-function(e){let t=0;for(let n=0;n<8;++n){const r=Vf(255&e[n]);if(t+=r,8!==r)break}return t}(e);return Math.ceil(t/8)}class qf{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Qt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ht(n.value),n=t.next();this.Jt()}Zt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Gt(e);else if(e<2048)this.Gt(960|e>>>6),this.Gt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Gt(480|e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e);else{const e=t.codePointAt(0);this.Gt(240|e>>>18),this.Gt(128|63&e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e)}}this.zt()}Xt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Ht(e);else if(e<2048)this.Ht(960|e>>>6),this.Ht(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Ht(480|e>>>12),this.Ht(128|63&e>>>6),this.Ht(128|63&e);else{const e=t.codePointAt(0);this.Ht(240|e>>>18),this.Ht(128|63&e>>>12),this.Ht(128|63&e>>>6),this.Ht(128|63&e)}}this.Jt()}Yt(e){const t=this.en(e),n=Uf(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=255&t[r]}nn(e){const t=this.en(e),n=Uf(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=~(255&t[r])}rn(){this.sn(Ff),this.sn(255)}_n(){this.an(Ff),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){const t=function(e){const t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let r=1;r<t.length;++r)t[r]^=n?255:0;return t}Gt(e){const t=255&e;0===t?(this.sn(0),this.sn(255)):t===Ff?(this.sn(Ff),this.sn(0)):this.sn(t)}Ht(e){const t=255&e;0===t?(this.an(0),this.an(255)):t===Ff?(this.an(Ff),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Jt(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class Bf{constructor(e){this.cn=e}Bt(e){this.cn.Qt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.Yt(e)}vt(){this.cn.rn()}}class jf{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Xt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}}class zf{constructor(){this.cn=new qf,this.ascending=new Bf(this.cn),this.descending=new jf(this.cn)}seed(e){this.cn.seed(e)}ln(e){return 0===e?this.ascending:this.descending}un(){return this.cn.un()}reset(){this.cn.reset()}}
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
 */class Gf{constructor(e,t,n,r){this.hn=e,this.Pn=t,this.Tn=n,this.In=r}En(){const e=this.In.length,t=0===e||255===this.In[e-1]?e+1:e,n=new Uint8Array(t);return n.set(this.In,0),t!==e?n.set([0],this.In.length):++n[n.length-1],new Gf(this.hn,this.Pn,this.Tn,n)}Rn(e,t,n){return{indexId:this.hn,uid:e,arrayValue:Hf(this.Tn),directionalValue:Hf(this.In),orderedDocumentKey:Hf(t),documentKey:n.path.toArray()}}An(e,t,n){const r=this.Rn(e,t,n);return[r.indexId,r.uid,r.arrayValue,r.directionalValue,r.orderedDocumentKey,r.documentKey]}}function $f(e,t){let n=e.hn-t.hn;return 0!==n?n:(n=Kf(e.Tn,t.Tn),0!==n?n:(n=Kf(e.In,t.In),0!==n?n:ca.comparator(e.Pn,t.Pn)))}function Kf(e,t){for(let n=0;n<e.length&&n<t.length;++n){const r=e[n]-t[n];if(0!==r)return r}return e.length-t.length}function Hf(e){return I()?function(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t}(e):e}function Wf(e){return"string"!=typeof e?e:function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(e)}class Qf{constructor(e){this.Vn=new bu((e,t)=>aa.comparator(e.field,t.field)),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.dn=e.orderBy,this.mn=[];for(const t of e.filters){const e=t;e.isInequality()?this.Vn=this.Vn.add(e):this.mn.push(e)}}get fn(){return this.Vn.size>1}gn(e){if(Lo(e.collectionGroup===this.collectionId,49279),this.fn)return!1;const t=Sa(e);if(void 0!==t&&!this.pn(t))return!1;const n=Aa(e);let r=new Set,i=0,s=0;for(;i<n.length&&this.pn(n[i]);++i)r=r.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Vn.size>0){const e=this.Vn.getIterator().getNext();if(!r.has(e.field.canonicalString())){const t=n[i];if(!this.yn(e,t)||!this.wn(this.dn[s++],t))return!1}++i}for(;i<n.length;++i){const e=n[i];if(s>=this.dn.length||!this.wn(this.dn[s++],e))return!1}return!0}bn(){if(this.fn)return null;let e=new bu(aa.comparator);const t=[];for(const n of this.mn)if(!n.field.isKeyField())if("array-contains"===n.op||"array-contains-any"===n.op)t.push(new ka(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new ka(n.field,0))}for(const n of this.dn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new ka(n.field,"asc"===n.dir?0:1)));return new Ea(Ea.UNKNOWN_ID,this.collectionId,t,Da.empty())}pn(e){for(const t of this.mn)if(this.yn(t,e))return!0;return!1}yn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;const n="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===n}wn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}
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
 */function Jf(e){var t,n;if(Lo(e instanceof Cl||e instanceof kl,20012),e instanceof Cl){if(e instanceof jl){const r=(null==(n=null==(t=e.value.arrayValue)?void 0:t.values)?void 0:n.map(t=>Cl.create(e.field,"==",t)))||[];return kl.create(r,"or")}return e}const r=e.filters.map(e=>Jf(e));return kl.create(r,e.op)}function Yf(e){if(0===e.getFilters().length)return[];const t=tp(Jf(e));return Lo(ep(t),7391),Xf(t)||Zf(t)?[t]:t.getFilters()}function Xf(e){return e instanceof Cl}function Zf(e){return e instanceof kl&&Rl(e)}function ep(e){return Xf(e)||Zf(e)||function(e){if(e instanceof kl&&Dl(e)){for(const t of e.getFilters())if(!Xf(t)&&!Zf(t))return!1;return!0}return!1}(e)}function tp(e){if(Lo(e instanceof Cl||e instanceof kl,34018),e instanceof Cl)return e;if(1===e.filters.length)return tp(e.filters[0]);const t=e.filters.map(e=>tp(e));let n=kl.create(t,e.op);return n=ip(n),ep(n)?n:(Lo(n instanceof kl,64498),Lo(Nl(n),40251),Lo(n.filters.length>1,57927),n.filters.reduce((e,t)=>np(e,t)))}function np(e,t){let n;return Lo(e instanceof Cl||e instanceof kl,38388),Lo(t instanceof Cl||t instanceof kl,25473),n=e instanceof Cl?t instanceof Cl?(r=e,i=t,kl.create([r,i],"and")):rp(e,t):t instanceof Cl?rp(t,e):function(e,t){if(Lo(e.filters.length>0&&t.filters.length>0,48005),Nl(e)&&Nl(t))return Ll(e,t.getFilters());const n=Dl(e)?e:t,r=Dl(e)?t:e,i=n.filters.map(e=>np(e,r));return kl.create(i,"or")}(e,t),ip(n);var r,i}function rp(e,t){if(Nl(t))return Ll(t,e.getFilters());{const n=t.filters.map(t=>np(e,t));return kl.create(n,"or")}}function ip(e){if(Lo(e instanceof Cl||e instanceof kl,11850),e instanceof Cl)return e;const t=e.getFilters();if(1===t.length)return ip(t[0]);if(Pl(e))return e;const n=t.map(e=>ip(e)),r=[];return n.forEach(t=>{t instanceof Cl?r.push(t):t instanceof kl&&(t.op===e.op?r.push(...t.filters):r.push(t))}),1===r.length?r[0]:kl.create(r,e.op)
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
 */}class sp{constructor(){this.Sn=new op}addToCollectionParentIndex(e,t){return this.Sn.add(t),Va.resolve()}getCollectionParents(e,t){return Va.resolve(this.Sn.getEntries(t))}addFieldIndex(e,t){return Va.resolve()}deleteFieldIndex(e,t){return Va.resolve()}deleteAllFieldIndexes(e){return Va.resolve()}createTargetIndexes(e,t){return Va.resolve()}getDocumentsMatchingTarget(e,t){return Va.resolve(null)}getIndexType(e,t){return Va.resolve(0)}getFieldIndexes(e,t){return Va.resolve([])}getNextCollectionGroupToUpdate(e){return Va.resolve(null)}getMinOffset(e,t){return Va.resolve(Oa.min())}getMinOffsetFromCollectionGroup(e,t){return Va.resolve(Oa.min())}updateCollectionGroup(e,t,n){return Va.resolve()}updateIndexEntries(e,t){return Va.resolve()}}class op{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new bu(sa.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new bu(sa.comparator)).toArray()}}
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
 */const ap="IndexedDbIndexManager",cp=new Uint8Array(0);class up{constructor(e,t){this.databaseId=t,this.Dn=new op,this.Cn=new yh(e=>Hl(e),(e,t)=>Wl(e,t)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Dn.has(t)){const n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener(()=>{this.Dn.add(t)});const i={collectionId:n,parent:sc(r)};return lp(e).put(i)}return Va.resolve()}getCollectionParents(e,t){const n=[],r=IDBKeyRange.bound([t,""],[na(t),""],!1,!0);return lp(e).H(r).next(e=>{for(const r of e){if(r.collectionId!==t)break;n.push(cc(r.parent))}return n})}addFieldIndex(e,t){const n=dp(e),r={indexId:(i=t).indexId,collectionGroup:i.collectionGroup,fields:i.fields.map(e=>[e.fieldPath.canonicalString(),e.kind])};var i;delete r.indexId;const s=n.add(r);if(t.indexState){const n=fp(e);return s.next(e=>{n.put(Nf(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return s.next()}deleteFieldIndex(e,t){const n=dp(e),r=fp(e),i=hp(e);return n.delete(t.indexId).next(()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=dp(e),n=hp(e),r=fp(e);return t.X().next(()=>n.X()).next(()=>r.X())}createTargetIndexes(e,t){return Va.forEach(this.vn(t),t=>this.getIndexType(e,t).next(n=>{if(0===n||1===n){const n=new Qf(t).bn();if(null!=n)return this.addFieldIndex(e,n)}}))}getDocumentsMatchingTarget(e,t){const n=hp(e);let r=!0;const i=new Map;return Va.forEach(this.vn(t),t=>this.Fn(e,t).next(e=>{r&&(r=!!e),i.set(t,e)})).next(()=>{if(r){let e=kh();const r=[];return Va.forEach(i,(i,s)=>{var o;No(ap,`Using index ${o=i,`id=${o.indexId}|cg=${o.collectionGroup}|f=${o.fields.map(e=>`${e.fieldPath}:${e.kind}`).join(",")}`} to execute ${Hl(t)}`);const a=function(e,t){const n=Sa(t);if(void 0===n)return null;for(const r of Jl(e,n.fieldPath))switch(r.op){case"array-contains-any":return r.value.arrayValue.values||[];case"array-contains":return[r.value]}return null}(s,i),c=function(e,t){const n=new Map;for(const r of Aa(t))for(const t of Jl(e,r.fieldPath))switch(t.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(s,i),u=function(e,t){const n=[];let r=!0;for(const i of Aa(t)){const t=0===i.kind?Yl(e,i.fieldPath,e.startAt):Xl(e,i.fieldPath,e.startAt);n.push(t.value),r&&(r=t.inclusive)}return new _l(n,r)}(s,i),l=function(e,t){const n=[];let r=!0;for(const i of Aa(t)){const t=0===i.kind?Xl(e,i.fieldPath,e.endAt):Yl(e,i.fieldPath,e.endAt);n.push(t.value),r&&(r=t.inclusive)}return new _l(n,r)}(s,i),h=this.Mn(i,s,u),d=this.Mn(i,s,l),f=this.xn(i,s,c),p=this.On(i.indexId,a,h,u.inclusive,d,l.inclusive,f);return Va.forEach(p,i=>n.Z(i,t.limit).next(t=>{t.forEach(t=>{const n=ca.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))})}))}).next(()=>r)}return Va.resolve(null)})}vn(e){let t=this.Cn.get(e);return t||(t=0===e.filters.length?[e]:Yf(kl.create(e.filters,"and")).map(t=>Kl(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt)),this.Cn.set(e,t),t)}On(e,t,n,r,i,s,o){const a=(null!=t?t.length:1)*Math.max(n.length,i.length),c=a/(null!=t?t.length:1),u=[];for(let l=0;l<a;++l){const a=t?this.Nn(t[l/c]):cp,h=this.Bn(e,a,n[l%c],r),d=this.Ln(e,a,i[l%c],s),f=o.map(t=>this.Bn(e,a,t,!0));u.push(...this.createRange(h,d,f))}return u}Bn(e,t,n,r){const i=new Gf(e,ca.empty(),t,n);return r?i:i.En()}Ln(e,t,n,r){const i=new Gf(e,ca.empty(),t,n);return r?i.En():i}Fn(e,t){const n=new Qf(t),r=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next(e=>{let t=null;for(const r of e)n.gn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t})}getIndexType(e,t){let n=2;const r=this.vn(t);return Va.forEach(r,t=>this.Fn(e,t).next(e=>{e?0!==n&&e.fields.length<function(e){let t=new bu(aa.comparator),n=!1;for(const r of e.filters)for(const e of r.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?n=!0:t=t.add(e.field));for(const r of e.orderBy)r.field.isKeyField()||(t=t.add(r.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})).next(()=>null!==t.limit&&r.length>1&&2===n?1:n)}kn(e,t){const n=new zf;for(const r of Aa(e)){const e=t.data.field(r.fieldPath);if(null==e)return null;const i=n.ln(r.kind);Mf.Wt.Dt(e,i)}return n.un()}Nn(e){const t=new zf;return Mf.Wt.Dt(e,t.ln(0)),t.un()}Kn(e,t){const n=new zf;return Mf.Wt.Dt(il(this.databaseId,t),n.ln(function(e){const t=Aa(e);return 0===t.length?0:t[t.length-1].kind}(e))),n.un()}xn(e,t,n){if(null===n)return[];let r=[];r.push(new zf);let i=0;for(const s of Aa(e)){const e=n[i++];for(const n of r)if(this.qn(t,s.fieldPath)&&ol(e))r=this.Un(r,s,e);else{const t=n.ln(s.kind);Mf.Wt.Dt(e,t)}}return this.$n(r)}Mn(e,t,n){return this.xn(e,t,n.position)}$n(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Un(e,t,n){const r=[...e],i=[];for(const s of n.arrayValue.values||[])for(const e of r){const n=new zf;n.seed(e.un()),Mf.Wt.Dt(s,n.ln(t.kind)),i.push(n)}return i}qn(e,t){return!!e.filters.find(e=>e instanceof Cl&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op))}getFieldIndexes(e,t){const n=dp(e),r=fp(e);return(t?n.H(Gc,IDBKeyRange.bound(t,t)):n.H()).next(e=>{const t=[];return Va.forEach(e,e=>r.get([e.indexId,this.uid]).next(n=>{t.push(function(e,t){const n=t?new Da(t.sequenceNumber,new Oa(Tf(t.readTime),new ca(cc(t.documentKey)),t.largestBatchId)):Da.empty(),r=e.fields.map(([e,t])=>new ka(aa.fromServerFormat(e),t));return new Ea(e.indexId,e.collectionGroup,r,n)}(e,n))})).next(()=>t)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(e=>0===e.length?null:(e.sort((e,t)=>{const n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==n?n:Jo(e.collectionGroup,t.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(e,t,n){const r=dp(e),i=fp(e);return this.Wn(e).next(e=>r.H(Gc,IDBKeyRange.bound(t,t)).next(t=>Va.forEach(t,t=>i.put(Nf(t.indexId,this.uid,e,n)))))}updateIndexEntries(e,t){const n=new Map;return Va.forEach(t,(t,r)=>{const i=n.get(t.collectionGroup);return(i?Va.resolve(i):this.getFieldIndexes(e,t.collectionGroup)).next(i=>(n.set(t.collectionGroup,i),Va.forEach(i,n=>this.Qn(e,t,n).next(t=>{const i=this.Gn(r,n);return t.isEqual(i)?Va.resolve():this.zn(e,r,n,t,i)}))))})}jn(e,t,n,r){return hp(e).put(r.Rn(this.uid,this.Kn(n,t.key),t.key))}Hn(e,t,n,r){return hp(e).delete(r.An(this.uid,this.Kn(n,t.key),t.key))}Qn(e,t,n){const r=hp(e);let i=new bu($f);return r.ee({index:Yc,range:IDBKeyRange.only([n.indexId,this.uid,Hf(this.Kn(n,t))])},(e,r)=>{i=i.add(new Gf(n.indexId,t,Wf(r.arrayValue),Wf(r.directionalValue)))}).next(()=>i)}Gn(e,t){let n=new bu($f);const r=this.kn(t,e);if(null==r)return n;const i=Sa(t);if(null!=i){const s=e.data.field(i.fieldPath);if(ol(s))for(const i of s.arrayValue.values||[])n=n.add(new Gf(t.indexId,e.key,this.Nn(i),r))}else n=n.add(new Gf(t.indexId,e.key,cp,r));return n}zn(e,t,n,r,i){No(ap,"Updating index entries for document '%s'",t.key);const s=[];return function(e,t,n,r,i){const s=e.getIterator(),o=t.getIterator();let a=Su(s),c=Su(o);for(;a||c;){let e=!1,t=!1;if(a&&c){const r=n(a,c);r<0?t=!0:r>0&&(e=!0)}else null!=a?t=!0:e=!0;e?(r(c),c=Su(o)):t?(i(a),a=Su(s)):(a=Su(s),c=Su(o))}}(r,i,$f,r=>{s.push(this.jn(e,t,n,r))},r=>{s.push(this.Hn(e,t,n,r))}),Va.waitFor(s)}Wn(e){let t=1;return fp(e).ee({index:Hc,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(e,n,r)=>{r.done(),t=n.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((e,t)=>$f(e,t)).filter((e,t,n)=>!t||0!==$f(e,n[t-1]));const r=[];r.push(e);for(const s of n){const n=$f(s,e),i=$f(s,t);if(0===n)r[0]=e.En();else if(n>0&&i<0)r.push(s),r.push(s.En());else if(i>0)break}r.push(t);const i=[];for(let s=0;s<r.length;s+=2){if(this.Jn(r[s],r[s+1]))return[];const e=r[s].An(this.uid,cp,ca.empty()),t=r[s+1].An(this.uid,cp,ca.empty());i.push(IDBKeyRange.bound(e,t))}return i}Jn(e,t){return $f(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(pp)}getMinOffset(e,t){return Va.mapArray(this.vn(t),t=>this.Fn(e,t).next(e=>e||Oo(44426))).next(pp)}}function lp(e){return mu(e,Vc)}function hp(e){return mu(e,Qc)}function dp(e){return mu(e,zc)}function fp(e){return mu(e,$c)}function pp(e){Lo(0!==e.length,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){const i=e[r].indexState.offset;xa(i,t)<0&&(t=i),n<i.largestBatchId&&(n=i.largestBatchId)}return new Oa(t.readTime,t.documentKey,n)}
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
 */const mp={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},gp=41943040;class yp{static withCacheSize(e){return new yp(e,yp.DEFAULT_COLLECTION_PERCENTILE,yp.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}
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
 */function vp(e,t,n){const r=e.store(fc),i=e.store(Ic),s=[],o=IDBKeyRange.only(n.batchId);let a=0;const c=r.ee({range:o},(e,t,n)=>(a++,n.delete()));s.push(c.next(()=>{Lo(1===a,47070,{batchId:n.batchId})}));const u=[];for(const l of n.mutations){const e=vc(t,l.key.path,n.batchId);s.push(i.delete(e)),u.push(l.key)}return Va.waitFor(s).next(()=>u)}function wp(e){if(!e)return 0;let t;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw Oo(14731);t=e.noDocument}return JSON.stringify(t).length}
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
 */yp.DEFAULT_COLLECTION_PERCENTILE=10,yp.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,yp.DEFAULT=new yp(gp,yp.DEFAULT_COLLECTION_PERCENTILE,yp.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),yp.DISABLED=new yp(-1,0,0);class Ip{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.Zn={}}static wt(e,t,n,r){Lo(""!==e.uid,64387);const i=e.isAuthenticated()?e.uid:"";return new Ip(i,t,n,r)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Tp(e).ee({index:mc,range:n},(e,n,r)=>{t=!1,r.done()}).next(()=>t)}addMutationBatch(e,t,n,r){const i=bp(e),s=Tp(e);return s.add({}).next(o=>{Lo("number"==typeof o,49019);const a=new ud(o,t,n,r),c=function(e,t,n){const r=n.baseMutations.map(t=>ef(e.yt,t)),i=n.mutations.map(t=>ef(e.yt,t));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:i}}(this.serializer,this.userId,a),u=[];let l=new bu((e,t)=>Jo(e.canonicalString(),t.canonicalString()));for(const e of r){const t=vc(this.userId,e.key.path,o);l=l.add(e.key.path.popLast()),u.push(s.put(c)),u.push(i.put(t,wc))}return l.forEach(t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))}),e.addOnCommittedListener(()=>{this.Zn[o]=a.keys()}),Va.waitFor(u).next(()=>a)})}lookupMutationBatch(e,t){return Tp(e).get(t).next(e=>e?(Lo(e.userId===this.userId,48,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),bf(this.serializer,e)):null)}Xn(e,t){return this.Zn[t]?Va.resolve(this.Zn[t]):this.lookupMutationBatch(e,t).next(e=>{if(e){const n=e.keys();return this.Zn[t]=n,n}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Tp(e).ee({index:mc,range:r},(e,t,r)=>{t.userId===this.userId&&(Lo(t.batchId>=n,47524,{Yn:n}),i=bf(this.serializer,t)),r.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=ec;return Tp(e).ee({index:mc,range:t,reverse:!0},(e,t,r)=>{n=t.batchId,r.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,ec],[this.userId,Number.POSITIVE_INFINITY]);return Tp(e).H(mc,t).next(e=>e.map(e=>bf(this.serializer,e)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=yc(this.userId,t.path),r=IDBKeyRange.lowerBound(n),i=[];return bp(e).ee({range:r},(n,r,s)=>{const[o,a,c]=n,u=cc(a);if(o===this.userId&&t.path.isEqual(u))return Tp(e).get(c).next(e=>{if(!e)throw Oo(61480,{er:n,batchId:c});Lo(e.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:e.userId,batchId:c}),i.push(bf(this.serializer,e))});s.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new bu(Jo);const r=[];return t.forEach(t=>{const i=yc(this.userId,t.path),s=IDBKeyRange.lowerBound(i),o=bp(e).ee({range:s},(e,r,i)=>{const[s,o,a]=e,c=cc(o);s===this.userId&&t.path.isEqual(c)?n=n.add(a):i.done()});r.push(o)}),Va.waitFor(r).next(()=>this.tr(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1,i=yc(this.userId,n),s=IDBKeyRange.lowerBound(i);let o=new bu(Jo);return bp(e).ee({range:s},(e,t,i)=>{const[s,a,c]=e,u=cc(a);s===this.userId&&n.isPrefixOf(u)?u.length===r&&(o=o.add(c)):i.done()}).next(()=>this.tr(e,o))}tr(e,t){const n=[],r=[];return t.forEach(t=>{r.push(Tp(e).get(t).next(e=>{if(null===e)throw Oo(35274,{batchId:t});Lo(e.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),n.push(bf(this.serializer,e))}))}),Va.waitFor(r).next(()=>n)}removeMutationBatch(e,t){return vp(e.le,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.nr(t.batchId)}),Va.forEach(n,t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))}nr(e){delete this.Zn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return Va.resolve();const n=IDBKeyRange.lowerBound(function(e){return[e]}(this.userId)),r=[];return bp(e).ee({range:n},(e,t,n)=>{if(e[0]===this.userId){const t=cc(e[1]);r.push(t)}else n.done()}).next(()=>{Lo(0===r.length,56720,{rr:r.map(e=>e.canonicalString())})})})}containsKey(e,t){return _p(e,this.userId,t)}ir(e){return Ep(e).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:ec,lastStreamToken:""})}}function _p(e,t,n){const r=yc(t,n.path),i=r[1],s=IDBKeyRange.lowerBound(r);let o=!1;return bp(e).ee({range:s,Y:!0},(e,n,r)=>{const[s,a,c]=e;s===t&&a===i&&(o=!0),r.done()}).next(()=>o)}function Tp(e){return mu(e,fc)}function bp(e){return mu(e,Ic)}function Ep(e){return mu(e,dc)}
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
 */class Sp{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new Sp(0)}static ar(){return new Sp(-1)}}
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
 */class Ap{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.ur(e).next(t=>{const n=new Sp(t.highestTargetId);return t.highestTargetId=n.next(),this.cr(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.ur(e).next(e=>Ta.fromTimestamp(new _a(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.ur(e).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.ur(e).next(r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.cr(e,r)))}addTargetData(e,t){return this.lr(e,t).next(()=>this.ur(e).next(n=>(n.targetCount+=1,this.hr(t,n),this.cr(e,n))))}updateTargetData(e,t){return this.lr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>Cp(e).delete(t.targetId)).next(()=>this.ur(e)).next(t=>(Lo(t.targetCount>0,8065),t.targetCount-=1,this.cr(e,t)))}removeTargets(e,t,n){let r=0;const i=[];return Cp(e).ee((s,o)=>{const a=Ef(o);a.sequenceNumber<=t&&null===n.get(a.targetId)&&(r++,i.push(this.removeTargetData(e,a)))}).next(()=>Va.waitFor(i)).next(()=>r)}forEachTarget(e,t){return Cp(e).ee((e,n)=>{const r=Ef(n);t(r)})}ur(e){return kp(e).get(Mc).next(e=>(Lo(null!==e,2888),e))}cr(e,t){return kp(e).put(Mc,t)}lr(e,t){return Cp(e).put(Sf(this.serializer,t))}hr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.ur(e).next(e=>e.targetCount)}getTargetData(e,t){const n=Hl(t),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Cp(e).ee({range:r,index:Dc},(e,n,r)=>{const s=Ef(n);Wl(t,s.target)&&(i=s,r.done())}).next(()=>i)}addMatchingKeys(e,t,n){const r=[],i=Np(e);return t.forEach(t=>{const s=sc(t.path);r.push(i.put({targetId:n,path:s})),r.push(this.referenceDelegate.addReference(e,n,t))}),Va.waitFor(r)}removeMatchingKeys(e,t,n){const r=Np(e);return Va.forEach(t,t=>{const i=sc(t.path);return Va.waitFor([r.delete([n,i]),this.referenceDelegate.removeReference(e,n,t)])})}removeMatchingKeysForTargetId(e,t){const n=Np(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),r=Np(e);let i=kh();return r.ee({range:n,Y:!0},(e,t,n)=>{const r=cc(e[1]),s=new ca(r);i=i.add(s)}).next(()=>i)}containsKey(e,t){const n=sc(t.path),r=IDBKeyRange.bound([n],[na(n)],!1,!0);let i=0;return Np(e).ee({index:xc,Y:!0,range:r},([e,t],n,r)=>{0!==e&&(i++,r.done())}).next(()=>i>0)}At(e,t){return Cp(e).get(t).next(e=>e?Ef(e):null)}}function Cp(e){return mu(e,Nc)}function kp(e){return mu(e,Fc)}function Np(e){return mu(e,Pc)}
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
 */const Dp="LruGarbageCollector",Rp=1048576;function Pp([e,t],[n,r]){const i=Jo(e,n);return 0===i?Jo(t,r):i}class Op{constructor(e){this.Pr=e,this.buffer=new bu(Pp),this.Tr=0}Ir(){return++this.Tr}Er(e){const t=[e,this.Ir()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{const e=this.buffer.last();Pp(t,e)<0&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class xp{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return null!==this.Rr}Ar(e){No(Dp,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){$a(e)?No(Dp,"Ignoring IndexedDB error during garbage collection: ",e):await Fa(e)}await this.Ar(3e5)})}}class Lp{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return Va.resolve(Za.ce);const n=new Op(t);return this.Vr.forEachTarget(e,e=>n.Er(e.sequenceNumber)).next(()=>this.Vr.mr(e,e=>n.Er(e))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return-1===this.params.cacheSizeCollectionThreshold?(No("LruGarbageCollector","Garbage collection skipped; disabled"),Va.resolve(mp)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(No("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),mp):this.gr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let n,r,i,s,o,a,c;const u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(No("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,s=Date.now(),this.nthSequenceNumber(e,r))).next(r=>(n=r,o=Date.now(),this.removeTargets(e,n,t))).next(t=>(i=t,a=Date.now(),this.removeOrphanedDocuments(e,n))).next(e=>(c=Date.now(),ko()<=F.DEBUG&&No("LruGarbageCollector",`LRU Garbage Collection\n\tCounted targets in ${s-u}ms\n\tDetermined least recently used ${r} in `+(o-s)+`ms\n\tRemoved ${i} targets in `+(a-o)+`ms\n\tRemoved ${e} documents in `+(c-a)+`ms\nTotal Duration: ${c-u}ms`),Va.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:e})))}}function Mp(e,t){return new Lp(e,t)}
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
 */class Fp{constructor(e,t){this.db=e,this.garbageCollector=Mp(this,t)}dr(e){const t=this.pr(e);return this.db.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}pr(e){let t=0;return this.mr(e,e=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}mr(e,t){return this.yr(e,(e,n)=>t(n))}addReference(e,t,n){return Vp(e,n)}removeReference(e,t,n){return Vp(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Vp(e,t)}wr(e,t){return function(e,t){let n=!1;return Ep(e).te(r=>_p(e,r,t).next(e=>(e&&(n=!0),Va.resolve(!e)))).next(()=>n)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[];let i=0;return this.yr(e,(s,o)=>{if(o<=t){const t=this.wr(e,s).next(t=>{if(!t)return i++,n.getEntry(e,s).next(()=>(n.removeEntry(s,Ta.min()),Np(e).delete([0,sc(s.path)])))});r.push(t)}}).next(()=>Va.waitFor(r)).next(()=>n.apply(e)).next(()=>i)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Vp(e,t)}yr(e,t){const n=Np(e);let r,i=Za.ce;return n.ee({index:xc},([e,n],{path:s,sequenceNumber:o})=>{0===e?(i!==Za.ce&&t(new ca(cc(r)),i),i=o,r=s):i=Za.ce}).next(()=>{i!==Za.ce&&t(new ca(cc(r)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Vp(e,t){return Np(e).put((n=t,r=e.currentSequenceNumber,{targetId:0,path:sc(n.path),sequenceNumber:r}));var n,r}
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
 */class Up{constructor(){this.changes=new yh(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Il.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return void 0!==n?Va.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}
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
 */class qp{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Gp(e).put(n)}removeEntry(e,t,n){return Gp(e).delete(function(e,t){const n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],If(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.br(e,n)))}getEntry(e,t){let n=Il.newInvalidDocument(t);return Gp(e).ee({index:bc,range:IDBKeyRange.only($p(t))},(e,r)=>{n=this.Sr(t,r)}).next(()=>n)}Dr(e,t){let n={size:0,document:Il.newInvalidDocument(t)};return Gp(e).ee({index:bc,range:IDBKeyRange.only($p(t))},(e,r)=>{n={document:this.Sr(t,r),size:wp(r)}}).next(()=>n)}getEntries(e,t){let n=wh();return this.Cr(e,t,(e,t)=>{const r=this.Sr(e,t);n=n.insert(e,r)}).next(()=>n)}vr(e,t){let n=wh(),r=new Iu(ca.comparator);return this.Cr(e,t,(e,t)=>{const i=this.Sr(e,t);n=n.insert(e,i),r=r.insert(e,wp(t))}).next(()=>({documents:n,Fr:r}))}Cr(e,t,n){if(t.isEmpty())return Va.resolve();let r=new bu(Hp);t.forEach(e=>r=r.add(e));const i=IDBKeyRange.bound($p(r.first()),$p(r.last())),s=r.getIterator();let o=s.getNext();return Gp(e).ee({index:bc,range:i},(e,t,r)=>{const i=ca.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;o&&Hp(o,i)<0;)n(o,null),o=s.getNext();o&&o.isEqual(i)&&(n(o,t),o=s.hasNext()?s.getNext():null),o?r.j($p(o)):r.done()}).next(()=>{for(;o;)n(o,null),o=s.hasNext()?s.getNext():null})}getDocumentsMatchingQuery(e,t,n,r,i){const s=t.path,o=[s.popLast().toArray(),s.lastSegment(),If(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],a=[s.popLast().toArray(),s.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Gp(e).H(IDBKeyRange.bound(o,a,!0)).next(e=>{null==i||i.incrementDocumentReadCount(e.length);let n=wh();for(const i of e){const e=this.Sr(ca.fromSegments(i.prefixPath.concat(i.collectionGroup,i.documentId)),i);e.isFoundDocument()&&(fh(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n})}getAllFromCollectionGroup(e,t,n,r){let i=wh();const s=Kp(t,n),o=Kp(t,Oa.max());return Gp(e).ee({index:Sc,range:IDBKeyRange.bound(s,o,!0)},(e,t,n)=>{const s=this.Sr(ca.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);i=i.insert(s.key,s),i.size===r&&n.done()}).next(()=>i)}newChangeBuffer(e){return new jp(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(e=>e.byteSize)}getMetadata(e){return zp(e).get(kc).next(e=>(Lo(!!e,20021),e))}br(e,t){return zp(e).put(kc,t)}Sr(e,t){if(t){const e=function(e,t){let n;if(t.document)n=Zd(e.yt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const e=ca.fromSegments(t.noDocument.path),r=Tf(t.noDocument.readTime);n=Il.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return Oo(56709);{const e=ca.fromSegments(t.unknownDocument.path),r=Tf(t.unknownDocument.version);n=Il.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){const t=new _a(e[0],e[1]);return Ta.fromTimestamp(t)}(t.readTime)),n}(this.serializer,t);if(!e.isNoDocument()||!e.version.isEqual(Ta.min()))return e}return Il.newInvalidDocument(e)}}function Bp(e){return new qp(e)}class jp extends Up{constructor(e,t){super(),this.Mr=e,this.trackRemovals=t,this.Or=new yh(e=>e.toString(),(e,t)=>e.isEqual(t))}applyChanges(e){const t=[];let n=0,r=new bu((e,t)=>Jo(e.canonicalString(),t.canonicalString()));return this.changes.forEach((i,s)=>{const o=this.Or.get(i);if(t.push(this.Mr.removeEntry(e,i,o.readTime)),s.isValidDocument()){const a=wf(this.Mr.serializer,s);r=r.add(i.path.popLast());const c=wp(a);n+=c-o.size,t.push(this.Mr.addEntry(e,i,a))}else if(n-=o.size,this.trackRemovals){const n=wf(this.Mr.serializer,s.convertToNoDocument(Ta.min()));t.push(this.Mr.addEntry(e,i,n))}}),r.forEach(n=>{t.push(this.Mr.indexManager.addToCollectionParentIndex(e,n))}),t.push(this.Mr.updateMetadata(e,n)),Va.waitFor(t)}getFromCache(e,t){return this.Mr.Dr(e,t).next(e=>(this.Or.set(t,{size:e.size,readTime:e.document.readTime}),e.document))}getAllFromCache(e,t){return this.Mr.vr(e,t).next(({documents:e,Fr:t})=>(t.forEach((t,n)=>{this.Or.set(t,{size:n,readTime:e.get(t).readTime})}),e))}}function zp(e){return mu(e,Cc)}function Gp(e){return mu(e,_c)}function $p(e){const t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function Kp(e,t){const n=t.documentKey.path.toArray();return[e,If(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function Hp(e,t){const n=e.path.toArray(),r=t.path.toArray();let i=0;for(let s=0;s<n.length-2&&s<r.length-2;++s)if(i=Jo(n[s],r[s]),i)return i;return i=Jo(n.length,r.length),i||(i=Jo(n[n.length-2],r[r.length-2]),i||Jo(n[n.length-1],r[r.length-1])
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
 */)}class Wp{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}
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
 */class Qp{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&Zh(n.mutation,e,Au.empty(),_a.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,kh()).next(()=>t))}getLocalViewOfDocuments(e,t,n=kh()){const r=bh();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=_h();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){const n=bh();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,kh()))}populateOverlays(e,t,n){const r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let i=wh();const s=Sh(),o=Sh();return t.forEach((e,t)=>{const o=n.get(t.key);r.has(t.key)&&(void 0===o||o.mutation instanceof rd)?i=i.insert(t.key,t):void 0!==o?(s.set(t.key,o.mutation.getFieldMask()),Zh(o.mutation,t,o.mutation.getFieldMask(),_a.now())):s.set(t.key,Au.empty())}),this.recalculateAndSaveOverlays(e,i).next(e=>(e.forEach((e,t)=>s.set(e,t)),t.forEach((e,t)=>o.set(e,new Wp(t,s.get(e)??null))),o))}recalculateAndSaveOverlays(e,t){const n=Sh();let r=new Iu((e,t)=>e-t),i=kh();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(const i of e)i.keys().forEach(e=>{const s=t.get(e);if(null===s)return;let o=n.get(e)||Au.empty();o=i.applyToLocalView(s,o),n.set(e,o);const a=(r.get(i.batchId)||kh()).add(e);r=r.insert(i.batchId,a)})}).next(()=>{const s=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,c=r.value,u=Eh();c.forEach(e=>{if(!i.has(e)){const r=Yh(t.get(e),n.get(e));null!==r&&u.set(e,r),i=i.add(e)}}),s.push(this.documentOverlayCache.saveOverlays(e,a,u))}return Va.waitFor(s)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return function(e){return ca.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):rh(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r)}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(i=>{const s=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):Va.resolve(bh());let o=ba,a=i;return s.next(t=>Va.forEach(t,(t,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),i.get(t)?Va.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{a=a.insert(t,e)}))).next(()=>this.populateOverlays(e,t,i)).next(()=>this.computeViews(e,a,t,kh())).next(e=>({batchId:o,changes:Th(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ca(t)).next(e=>{let t=_h();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){const i=t.collectionGroup;let s=_h();return this.indexManager.getCollectionParents(e,i).next(o=>Va.forEach(o,o=>{const a=(c=t,u=o.child(i),new Zl(u,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt));var c,u;return this.getDocumentsMatchingCollectionQuery(e,a,n,r).next(e=>{e.forEach((e,t)=>{s=s.insert(e,t)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r))).next(e=>{i.forEach((t,n)=>{const r=n.getKey();null===e.get(r)&&(e=e.insert(r,Il.newInvalidDocument(r)))});let n=_h();return e.forEach((e,r)=>{const s=i.get(e);void 0!==s&&Zh(s.mutation,r,Au.empty(),_a.now()),fh(t,r)&&(n=n.insert(e,r))}),n})}}
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
 */class Jp{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return Va.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,{id:(n=t).id,version:n.version,createTime:jd(n.createTime)}),Va.resolve();var n}getNamedQuery(e,t){return Va.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,{name:(n=t).name,query:Af(n.bundledQuery),readTime:jd(n.readTime)}),Va.resolve();var n}}
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
 */class Yp{constructor(){this.overlays=new Iu(ca.comparator),this.Lr=new Map}getOverlay(e,t){return Va.resolve(this.overlays.get(t))}getOverlays(e,t){const n=bh();return Va.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.bt(e,t,r)}),Va.resolve()}removeOverlaysForBatchId(e,t,n){const r=this.Lr.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.Lr.delete(n)),Va.resolve()}getOverlaysForCollection(e,t,n){const r=bh(),i=t.length+1,s=new ca(t.child("")),o=this.overlays.getIteratorFrom(s);for(;o.hasNext();){const e=o.getNext().value,s=e.getKey();if(!t.isPrefixOf(s.path))break;s.path.length===i&&e.largestBatchId>n&&r.set(e.getKey(),e)}return Va.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new Iu((e,t)=>e-t);const s=this.overlays.getIterator();for(;s.hasNext();){const e=s.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=i.get(e.largestBatchId);null===t&&(t=bh(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}const o=bh(),a=i.getIterator();for(;a.hasNext()&&(a.getNext().value.forEach((e,t)=>o.set(e,t)),!(o.size()>=r)););return Va.resolve(o)}bt(e,t,n){const r=this.overlays.get(n.key);if(null!==r){const e=this.Lr.get(r.largestBatchId).delete(n.key);this.Lr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new hd(t,n));let i=this.Lr.get(t);void 0===i&&(i=kh(),this.Lr.set(t,i)),this.Lr.set(t,i.add(n.key))}}
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
 */class Xp{constructor(){this.sessionToken=ku.EMPTY_BYTE_STRING}getSessionToken(e){return Va.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,Va.resolve()}}
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
 */class Zp{constructor(){this.kr=new bu(em.Kr),this.qr=new bu(em.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){const n=new em(e,t);this.kr=this.kr.add(n),this.qr=this.qr.add(n)}$r(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Wr(new em(e,t))}Qr(e,t){e.forEach(e=>this.removeReference(e,t))}Gr(e){const t=new ca(new sa([])),n=new em(t,e),r=new em(t,e+1),i=[];return this.qr.forEachInRange([n,r],e=>{this.Wr(e),i.push(e.key)}),i}zr(){this.kr.forEach(e=>this.Wr(e))}Wr(e){this.kr=this.kr.delete(e),this.qr=this.qr.delete(e)}jr(e){const t=new ca(new sa([])),n=new em(t,e),r=new em(t,e+1);let i=kh();return this.qr.forEachInRange([n,r],e=>{i=i.add(e.key)}),i}containsKey(e){const t=new em(e,0),n=this.kr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class em{constructor(e,t){this.key=e,this.Hr=t}static Kr(e,t){return ca.comparator(e.key,t.key)||Jo(e.Hr,t.Hr)}static Ur(e,t){return Jo(e.Hr,t.Hr)||ca.comparator(e.key,t.key)}}
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
 */class tm{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Jr=new bu(em.Kr)}checkEmpty(e){return Va.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){const i=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const s=new ud(i,t,n,r);this.mutationQueue.push(s);for(const o of r)this.Jr=this.Jr.add(new em(o.key,i)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return Va.resolve(s)}lookupMutationBatch(e,t){return Va.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=this.Xr(n),i=r<0?0:r;return Va.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return Va.resolve(0===this.mutationQueue.length?ec:this.Yn-1)}getAllMutationBatches(e){return Va.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new em(t,0),r=new em(t,Number.POSITIVE_INFINITY),i=[];return this.Jr.forEachInRange([n,r],e=>{const t=this.Zr(e.Hr);i.push(t)}),Va.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new bu(Jo);return t.forEach(e=>{const t=new em(e,0),r=new em(e,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([t,r],e=>{n=n.add(e.Hr)})}),Va.resolve(this.Yr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1;let i=n;ca.isDocumentKey(i)||(i=i.child(""));const s=new em(new ca(i),0);let o=new bu(Jo);return this.Jr.forEachWhile(e=>{const t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(o=o.add(e.Hr)),!0)},s),Va.resolve(this.Yr(o))}Yr(e){const t=[];return e.forEach(e=>{const n=this.Zr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){Lo(0===this.ei(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.Jr;return Va.forEach(t.mutations,r=>{const i=new em(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Jr=n})}nr(e){}containsKey(e,t){const n=new em(t,0),r=this.Jr.firstAfterOrEqual(n);return Va.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,Va.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}
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
 */class nm{constructor(e){this.ti=e,this.docs=new Iu(ca.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,r=this.docs.get(n),i=r?r.size:0,s=this.ti(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return Va.resolve(n?n.document.mutableCopy():Il.newInvalidDocument(t))}getEntries(e,t){let n=wh();return t.forEach(e=>{const t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():Il.newInvalidDocument(e))}),Va.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=wh();const s=t.path,o=new ca(s.child("__id-9223372036854775808__")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:e,value:{document:o}}=a.getNext();if(!s.isPrefixOf(e.path))break;e.path.length>s.length+1||xa(Pa(o),n)<=0||(r.has(o.key)||fh(t,o))&&(i=i.insert(o.key,o.mutableCopy()))}return Va.resolve(i)}getAllFromCollectionGroup(e,t,n,r){Oo(9500)}ni(e,t){return Va.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new rm(this)}getSize(e){return Va.resolve(this.size)}}class rm extends Up{constructor(e){super(),this.Mr=e}applyChanges(e){const t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.Mr.addEntry(e,r)):this.Mr.removeEntry(n)}),Va.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}
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
 */class im{constructor(e){this.persistence=e,this.ri=new yh(e=>Hl(e),Wl),this.lastRemoteSnapshotVersion=Ta.min(),this.highestTargetId=0,this.ii=0,this.si=new Zp,this.targetCount=0,this.oi=Sp._r()}forEachTarget(e,t){return this.ri.forEach((e,n)=>t(n)),Va.resolve()}getLastRemoteSnapshotVersion(e){return Va.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return Va.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),Va.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.ii&&(this.ii=t),Va.resolve()}lr(e){this.ri.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.oi=new Sp(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,Va.resolve()}updateTargetData(e,t){return this.lr(t),Va.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,Va.resolve()}removeTargets(e,t,n){let r=0;const i=[];return this.ri.forEach((s,o)=>{o.sequenceNumber<=t&&null===n.get(o.targetId)&&(this.ri.delete(s),i.push(this.removeMatchingKeysForTargetId(e,o.targetId)),r++)}),Va.waitFor(i).next(()=>r)}getTargetCount(e){return Va.resolve(this.targetCount)}getTargetData(e,t){const n=this.ri.get(t)||null;return Va.resolve(n)}addMatchingKeys(e,t,n){return this.si.$r(t,n),Va.resolve()}removeMatchingKeys(e,t,n){this.si.Qr(t,n);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(t=>{i.push(r.markPotentiallyOrphaned(e,t))}),Va.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),Va.resolve()}getMatchingKeysForTargetId(e,t){const n=this.si.jr(t);return Va.resolve(n)}containsKey(e,t){return Va.resolve(this.si.containsKey(t))}}
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
 */class sm{constructor(e,t){this._i={},this.overlays={},this.ai=new Za(0),this.ui=!1,this.ui=!0,this.ci=new Xp,this.referenceDelegate=e(this),this.li=new im(this),this.indexManager=new sp,this.remoteDocumentCache=new nm(e=>this.referenceDelegate.hi(e)),this.serializer=new vf(t),this.Pi=new Jp(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Yp,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this._i[e.toKey()];return n||(n=new tm(t,this.referenceDelegate),this._i[e.toKey()]=n),n}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,n){No("MemoryPersistence","Starting transaction:",e);const r=new om(this.ai.next());return this.referenceDelegate.Ti(),n(r).next(e=>this.referenceDelegate.Ii(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Ei(e,t){return Va.or(Object.values(this._i).map(n=>()=>n.containsKey(e,t)))}}class om extends Ma{constructor(e){super(),this.currentSequenceNumber=e}}class am{constructor(e){this.persistence=e,this.Ri=new Zp,this.Ai=null}static Vi(e){return new am(e)}get di(){if(this.Ai)return this.Ai;throw Oo(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.di.delete(n.toString()),Va.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.di.add(n.toString()),Va.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),Va.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach(e=>this.di.add(e.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.di.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}Ti(){this.Ai=new Set}Ii(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return Va.forEach(this.di,n=>{const r=ca.fromPath(n);return this.mi(e,r).next(e=>{e||t.removeEntry(r,Ta.min())})}).next(()=>(this.Ai=null,t.apply(e)))}updateLimboDocument(e,t){return this.mi(e,t).next(e=>{e?this.di.delete(t.toString()):this.di.add(t.toString())})}hi(e){return 0}mi(e,t){return Va.or([()=>Va.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class cm{constructor(e,t){this.persistence=e,this.fi=new yh(e=>sc(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=Mp(this,t)}static Vi(e,t){return new cm(e,t)}Ti(){}Ii(e){return Va.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}pr(e){let t=0;return this.mr(e,e=>{t++}).next(()=>t)}mr(e,t){return Va.forEach(this.fi,(n,r)=>this.wr(e,n,r).next(e=>e?Va.resolve():t(r)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.ni(e,r=>this.wr(e,r,t).next(e=>{e||(n++,i.removeEntry(r,Ta.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),Va.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),Va.resolve()}removeReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),Va.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),Va.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=rl(e.data.value)),t}wr(e,t,n){return Va.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const e=this.fi.get(t);return Va.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}
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
 */class um{constructor(e){this.serializer=e}k(e,t,n,r){const i=new qa("createOrUpgrade",t);n<1&&r>=1&&(e.createObjectStore(lc),function(e){e.createObjectStore(dc,{keyPath:"userId"});e.createObjectStore(fc,{keyPath:pc,autoIncrement:!0}).createIndex(mc,gc,{unique:!0}),e.createObjectStore(Ic)}(e),lm(e),function(e){e.createObjectStore(uc)}(e));let s=Va.resolve();return n<3&&r>=3&&(0!==n&&(function(e){e.deleteObjectStore(Pc),e.deleteObjectStore(Nc),e.deleteObjectStore(Fc)}(e),lm(e)),s=s.next(()=>function(e){const t=e.store(Fc),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:Ta.min().toTimestamp(),targetCount:0};return t.put(Mc,n)}(i))),n<4&&r>=4&&(0!==n&&(s=s.next(()=>function(e,t){return t.store(fc).H().next(n=>{e.deleteObjectStore(fc),e.createObjectStore(fc,{keyPath:pc,autoIncrement:!0}).createIndex(mc,gc,{unique:!0});const r=t.store(fc),i=n.map(e=>r.put(e));return Va.waitFor(i)})}(e,i))),s=s.next(()=>{!function(e){e.createObjectStore(qc,{keyPath:"clientId"})}(e)})),n<5&&r>=5&&(s=s.next(()=>this.gi(i))),n<6&&r>=6&&(s=s.next(()=>(function(e){e.createObjectStore(Cc)}(e),this.pi(i)))),n<7&&r>=7&&(s=s.next(()=>this.yi(i))),n<8&&r>=8&&(s=s.next(()=>this.wi(e,i))),n<9&&r>=9&&(s=s.next(()=>{!function(e){e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")}(e)})),n<10&&r>=10&&(s=s.next(()=>this.bi(i))),n<11&&r>=11&&(s=s.next(()=>{!function(e){e.createObjectStore(Bc,{keyPath:"bundleId"})}(e),function(e){e.createObjectStore(jc,{keyPath:"name"})}(e)})),n<12&&r>=12&&(s=s.next(()=>{!function(e){const t=e.createObjectStore(Zc,{keyPath:eu});t.createIndex(tu,nu,{unique:!1}),t.createIndex(ru,iu,{unique:!1})}(e)})),n<13&&r>=13&&(s=s.next(()=>function(e){const t=e.createObjectStore(_c,{keyPath:Tc});t.createIndex(bc,Ec),t.createIndex(Sc,Ac)}(e)).next(()=>this.Si(e,i)).next(()=>e.deleteObjectStore(uc))),n<14&&r>=14&&(s=s.next(()=>this.Di(e,i))),n<15&&r>=15&&(s=s.next(()=>function(e){e.createObjectStore(zc,{keyPath:"indexId",autoIncrement:!0}).createIndex(Gc,"collectionGroup",{unique:!1});e.createObjectStore($c,{keyPath:Kc}).createIndex(Hc,Wc,{unique:!1});e.createObjectStore(Qc,{keyPath:Jc}).createIndex(Yc,Xc,{unique:!1})}(e))),n<16&&r>=16&&(s=s.next(()=>{t.objectStore($c).clear()}).next(()=>{t.objectStore(Qc).clear()})),n<17&&r>=17&&(s=s.next(()=>{!function(e){e.createObjectStore(su,{keyPath:"name"})}(e)})),n<18&&r>=18&&I()&&(s=s.next(()=>{t.objectStore($c).clear()}).next(()=>{t.objectStore(Qc).clear()})),s}pi(e){let t=0;return e.store(uc).ee((e,n)=>{t+=wp(n)}).next(()=>{const n={byteSize:t};return e.store(Cc).put(kc,n)})}gi(e){const t=e.store(dc),n=e.store(fc);return t.H().next(t=>Va.forEach(t,t=>{const r=IDBKeyRange.bound([t.userId,ec],[t.userId,t.lastAcknowledgedBatchId]);return n.H(mc,r).next(n=>Va.forEach(n,n=>{Lo(n.userId===t.userId,18650,"Cannot process batch from unexpected user",{batchId:n.batchId});const r=bf(this.serializer,n);return vp(e,t.userId,r).next(()=>{})}))}))}yi(e){const t=e.store(Pc),n=e.store(uc);return e.store(Fc).get(Mc).next(e=>{const r=[];return n.ee((n,i)=>{const s=new sa(n),o=[0,sc(s)];r.push(t.get(o).next(n=>{return n?Va.resolve():(r=s,t.put({targetId:0,path:sc(r),sequenceNumber:e.highestListenSequenceNumber}));var r}))}).next(()=>Va.waitFor(r))})}wi(e,t){e.createObjectStore(Vc,{keyPath:Uc});const n=t.store(Vc),r=new op,i=e=>{if(r.add(e)){const t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:sc(r)})}};return t.store(uc).ee({Y:!0},(e,t)=>{const n=new sa(e);return i(n.popLast())}).next(()=>t.store(Ic).ee({Y:!0},([e,t,n],r)=>{const s=cc(t);return i(s.popLast())}))}bi(e){const t=e.store(Nc);return t.ee((e,n)=>{const r=Ef(n),i=Sf(this.serializer,r);return t.put(i)})}Si(e,t){const n=t.store(uc),r=[];return n.ee((e,n)=>{const i=t.store(_c),s=(a=n,a.document?new ca(sa.fromString(a.document.name).popFirst(5)):a.noDocument?ca.fromSegments(a.noDocument.path):a.unknownDocument?ca.fromSegments(a.unknownDocument.path):Oo(36783)).path.toArray(),o={prefixPath:s.slice(0,s.length-2),collectionGroup:s[s.length-2],documentId:s[s.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};var a;r.push(i.put(o))}).next(()=>Va.waitFor(r))}Di(e,t){const n=t.store(fc),r=Bp(this.serializer),i=new sm(am.Vi,this.serializer.yt);return n.H().next(e=>{const n=new Map;return e.forEach(e=>{let t=n.get(e.userId)??kh();bf(this.serializer,e).keys().forEach(e=>t=t.add(e)),n.set(e.userId,t)}),Va.forEach(n,(e,n)=>{const s=new So(n),o=Of.wt(this.serializer,s),a=i.getIndexManager(s),c=Ip.wt(s,this.serializer,a,i.referenceDelegate);return new Qp(r,c,o,a).recalculateAndSaveOverlaysForDocumentKeys(new pu(t,Za.ce),e).next()})})}}function lm(e){e.createObjectStore(Pc,{keyPath:Oc}).createIndex(xc,Lc,{unique:!0}),e.createObjectStore(Nc,{keyPath:"targetId"}).createIndex(Dc,Rc,{unique:!0}),e.createObjectStore(Fc)}const hm="IndexedDbPersistence",dm=18e5,fm=5e3,pm="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",mm="main";class gm{constructor(e,t,n,r,i,s,o,a,c,u,l=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Ci=i,this.window=s,this.document=o,this.Fi=c,this.Mi=u,this.xi=l,this.ai=null,this.ui=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Oi=null,this.inForeground=!1,this.Ni=null,this.Bi=null,this.Li=Number.NEGATIVE_INFINITY,this.ki=e=>Promise.resolve(),!gm.v())throw new Vo(Fo.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Fp(this,r),this.Ki=t+mm,this.serializer=new vf(a),this.qi=new Ba(this.Ki,this.xi,new um(this.serializer)),this.ci=new Lf,this.li=new Ap(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Bp(this.serializer),this.Pi=new Df,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,!1===u&&Do(hm,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.$i().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new Vo(Fo.FAILED_PRECONDITION,pm);return this.Wi(),this.Qi(),this.Gi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.li.getHighestSequenceNumber(e))}).then(e=>{this.ai=new Za(e,this.Fi)}).then(()=>{this.ui=!0}).catch(e=>(this.qi&&this.qi.close(),Promise.reject(e)))}zi(e){return this.ki=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.qi.q(async t=>{null===t.newVersion&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Ci.enqueueAndForget(async()=>{this.started&&await this.$i()}))}$i(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>vm(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.ji(e).next(e=>{e||(this.isPrimary=!1,this.Ci.enqueueRetryable(()=>this.ki(!1)))})}).next(()=>this.Hi(e)).next(t=>this.isPrimary&&!t?this.Ji(e).next(()=>!1):!!t&&this.Zi(e).next(()=>!0))).catch(e=>{if($a(e))return No(hm,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return No(hm,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Ci.enqueueRetryable(()=>this.ki(e)),this.isPrimary=e})}ji(e){return ym(e).get(hc).next(e=>Va.resolve(this.Xi(e)))}Yi(e){return vm(e).delete(this.clientId)}async es(){if(this.isPrimary&&!this.ts(this.Li,dm)){this.Li=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{const t=mu(e,qc);return t.H().next(e=>{const n=this.ns(e,dm),r=e.filter(e=>-1===n.indexOf(e));return Va.forEach(r,e=>t.delete(e.clientId)).next(()=>r)})}).catch(()=>[]);if(this.Ui)for(const t of e)this.Ui.removeItem(this.rs(t.clientId))}}Gi(){this.Bi=this.Ci.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.$i().then(()=>this.es()).then(()=>this.Gi()))}Xi(e){return!!e&&e.ownerId===this.clientId}Hi(e){return this.Mi?Va.resolve(!0):ym(e).get(hc).next(t=>{if(null!==t&&this.ts(t.leaseTimestampMs,fm)&&!this.ss(t.ownerId)){if(this.Xi(t)&&this.networkEnabled)return!0;if(!this.Xi(t)){if(!t.allowTabSynchronization)throw new Vo(Fo.FAILED_PRECONDITION,pm);return!1}}return!(!this.networkEnabled||!this.inForeground)||vm(e).H().next(e=>void 0===this.ns(e,fm).find(e=>{if(this.clientId!==e.clientId){const t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))}).next(e=>(this.isPrimary!==e&&No(hm,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.ui=!1,this._s(),this.Bi&&(this.Bi.cancel(),this.Bi=null),this.us(),this.cs(),await this.qi.runTransaction("shutdown","readwrite",[lc,qc],e=>{const t=new pu(e,Za.ce);return this.Ji(t).next(()=>this.Yi(t))}),this.qi.close(),this.ls()}ns(e,t){return e.filter(e=>this.ts(e.updateTimeMs,t)&&!this.ss(e.clientId))}hs(){return this.runTransaction("getActiveClients","readonly",e=>vm(e).H().next(e=>this.ns(e,dm).map(e=>e.clientId)))}get started(){return this.ui}getGlobalsCache(){return this.ci}getMutationQueue(e,t){return Ip.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new up(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return Of.wt(this.serializer,e)}getBundleCache(){return this.Pi}runTransaction(e,t,n){No(hm,"Starting transaction:",e);const r="readonly"===t?"readonly":"readwrite",i=18===(s=this.xi)?fu:17===s?du:16===s?hu:15===s?lu:14===s?uu:13===s?cu:12===s?au:11===s?ou:void Oo(60245);var s;let o;return this.qi.runTransaction(e,r,i,r=>(o=new pu(r,this.ai?this.ai.next():Za.ce),"readwrite-primary"===t?this.ji(o).next(e=>!!e||this.Hi(o)).next(t=>{if(!t)throw Do(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Ci.enqueueRetryable(()=>this.ki(!1)),new Vo(Fo.FAILED_PRECONDITION,La);return n(o)}).next(e=>this.Zi(o).next(()=>e)):this.Ps(o).next(()=>n(o)))).then(e=>(o.raiseOnCommittedEvent(),e))}Ps(e){return ym(e).get(hc).next(e=>{if(null!==e&&this.ts(e.leaseTimestampMs,fm)&&!this.ss(e.ownerId)&&!this.Xi(e)&&!(this.Mi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new Vo(Fo.FAILED_PRECONDITION,pm)})}Zi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return ym(e).put(hc,t)}static v(){return Ba.v()}Ji(e){const t=ym(e);return t.get(hc).next(e=>this.Xi(e)?(No(hm,"Releasing primary lease."),t.delete(hc)):Va.resolve())}ts(e,t){const n=Date.now();return!(e<n-t||e>n&&(Do(`Detected an update time that is in the future: ${e} > ${n}`),1))}Wi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Ni=()=>{this.Ci.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.$i()))},this.document.addEventListener("visibilitychange",this.Ni),this.inForeground="visible"===this.document.visibilityState)}us(){this.Ni&&(this.document.removeEventListener("visibilitychange",this.Ni),this.Ni=null)}Qi(){var e;"function"==typeof(null==(e=this.window)?void 0:e.addEventListener)&&(this.Oi=()=>{this._s();const e=/(?:Version|Mobile)\/1[456]/;w()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Ci.enterRestrictedMode(!0),this.Ci.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Oi))}cs(){this.Oi&&(this.window.removeEventListener("pagehide",this.Oi),this.Oi=null)}ss(e){var t;try{const n=null!==(null==(t=this.Ui)?void 0:t.getItem(this.rs(e)));return No(hm,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return Do(hm,"Failed to get zombied client id.",n),!1}}_s(){if(this.Ui)try{this.Ui.setItem(this.rs(this.clientId),String(Date.now()))}catch(e){Do("Failed to set zombie client id.",e)}}ls(){if(this.Ui)try{this.Ui.removeItem(this.rs(this.clientId))}catch(e){}}rs(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function ym(e){return mu(e,lc)}function vm(e){return mu(e,qc)}function wm(e,t){let n=e.projectId;return e.isDefaultDatabase||(n+="."+e.database),"firestore/"+t+"/"+n+"/"
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
 */}class Im{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Ts=n,this.Is=r}static Es(e,t){let n=kh(),r=kh();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new Im(e,t.fromCache,n,r)}}
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
 */class _m{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}
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
 */class Tm{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=w()?8:ja(y())>0?6:4}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,r){const i={result:null};return this.gs(e,t).next(e=>{i.result=e}).next(()=>{if(!i.result)return this.ps(e,t,r,n).next(e=>{i.result=e})}).next(()=>{if(i.result)return;const n=new _m;return this.ys(e,t,n).next(r=>{if(i.result=r,this.As)return this.ws(e,t,n,r.size)})}).next(()=>i.result)}ws(e,t,n,r){return n.documentReadCount<this.Vs?(ko()<=F.DEBUG&&No("QueryEngine","SDK will not create cache indexes for query:",dh(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),Va.resolve()):(ko()<=F.DEBUG&&No("QueryEngine","Query:",dh(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.ds*r?(ko()<=F.DEBUG&&No("QueryEngine","The SDK decides to create cache indexes for query:",dh(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,sh(t))):Va.resolve())}gs(e,t){if(nh(t))return Va.resolve(null);let n=sh(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(t=uh(t,null,"F"),n=sh(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{const i=kh(...r);return this.fs.getDocuments(e,i).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{const s=this.bs(t,r);return this.Ss(t,s,i,n.readTime)?this.gs(e,uh(t,null,"F")):this.Ds(e,s,t,n)}))})))}ps(e,t,n,r){return nh(t)||r.isEqual(Ta.min())?Va.resolve(null):this.fs.getDocuments(e,n).next(i=>{const s=this.bs(t,i);return this.Ss(t,s,n,r)?Va.resolve(null):(ko()<=F.DEBUG&&No("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),dh(t)),this.Ds(e,s,t,Ra(r,ba)).next(e=>e))})}bs(e,t){let n=new bu(mh(e));return t.forEach((t,r)=>{fh(e,r)&&(n=n.add(r))}),n}Ss(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;const i="F"===e.limitType?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}ys(e,t,n){return ko()<=F.DEBUG&&No("QueryEngine","Using full collection scan to execute query:",dh(t)),this.fs.getDocumentsMatchingQuery(e,t,Oa.min(),n)}Ds(e,t,n,r){return this.fs.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}
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
 */const bm="LocalStore";class Em{constructor(e,t,n,r){this.persistence=e,this.Cs=t,this.serializer=r,this.vs=new Iu(Jo),this.Fs=new yh(e=>Hl(e),Wl),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(n)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Qp(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.vs))}}function Sm(e,t,n,r){return new Em(e,t,n,r)}async function Am(e,t){const n=Mo(e);return await n.persistence.runTransaction("Handle user change","readonly",e=>{let r;return n.mutationQueue.getAllMutationBatches(e).next(i=>(r=i,n.Os(t),n.mutationQueue.getAllMutationBatches(e))).next(t=>{const i=[],s=[];let o=kh();for(const e of r){i.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}for(const e of t){s.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}return n.localDocuments.getDocuments(e,o).next(e=>({Ns:e,removedBatchIds:i,addedBatchIds:s}))})})}function Cm(e){const t=Mo(e);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.li.getLastRemoteSnapshotVersion(e))}function km(e,t,n){let r=kh(),i=kh();return n.forEach(e=>r=r.add(e)),t.getEntries(e,r).next(e=>{let r=wh();return n.forEach((n,s)=>{const o=e.get(n);s.isFoundDocument()!==o.isFoundDocument()&&(i=i.add(n)),s.isNoDocument()&&s.version.isEqual(Ta.min())?(t.removeEntry(n,s.readTime),r=r.insert(n,s)):!o.isValidDocument()||s.version.compareTo(o.version)>0||0===s.version.compareTo(o.version)&&o.hasPendingWrites?(t.addEntry(s),r=r.insert(n,s)):No(bm,"Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",s.version)}),{Bs:r,Ls:i}})}function Nm(e,t){const n=Mo(e);return n.persistence.runTransaction("Get next mutation batch","readonly",e=>(void 0===t&&(t=ec),n.mutationQueue.getNextMutationBatchAfterBatchId(e,t)))}function Dm(e,t){const n=Mo(e);return n.persistence.runTransaction("Allocate target","readwrite",e=>{let r;return n.li.getTargetData(e,t).next(i=>i?(r=i,Va.resolve(r)):n.li.allocateTargetId(e).next(i=>(r=new yf(t,i,"TargetPurposeListen",e.currentSequenceNumber),n.li.addTargetData(e,r).next(()=>r))))}).then(e=>{const r=n.vs.get(e.targetId);return(null===r||e.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.vs=n.vs.insert(e.targetId,e),n.Fs.set(t,e.targetId)),e})}async function Rm(e,t,n){const r=Mo(e),i=r.vs.get(t),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,e=>r.persistence.referenceDelegate.removeTarget(e,i))}catch(o){if(!$a(o))throw o;No(bm,`Failed to update sequence numbers for target ${t}: ${o}`)}r.vs=r.vs.remove(t),r.Fs.delete(i.target)}function Pm(e,t,n){const r=Mo(e);let i=Ta.min(),s=kh();return r.persistence.runTransaction("Execute query","readwrite",e=>function(e,t,n){const r=Mo(e),i=r.Fs.get(n);return void 0!==i?Va.resolve(r.vs.get(i)):r.li.getTargetData(t,n)}(r,e,sh(t)).next(t=>{if(t)return i=t.lastLimboFreeSnapshotVersion,r.li.getMatchingKeysForTargetId(e,t.targetId).next(e=>{s=e})}).next(()=>r.Cs.getDocumentsMatchingQuery(e,t,n?i:Ta.min(),n?s:kh())).next(e=>(Lm(r,ph(t),e),{documents:e,ks:s})))}function Om(e,t){const n=Mo(e),r=Mo(n.li),i=n.vs.get(t);return i?Promise.resolve(i.target):n.persistence.runTransaction("Get target data","readonly",e=>r.At(e,t).next(e=>e?e.target:null))}function xm(e,t){const n=Mo(e),r=n.Ms.get(t)||Ta.min();return n.persistence.runTransaction("Get new document changes","readonly",e=>n.xs.getAllFromCollectionGroup(e,t,Ra(r,ba),Number.MAX_SAFE_INTEGER)).then(e=>(Lm(n,t,e),e))}function Lm(e,t,n){let r=e.Ms.get(t)||Ta.min();n.forEach((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)}),e.Ms.set(t,r)}async function Mm(e,t,n=kh()){const r=await Dm(e,sh(Af(t.bundledQuery))),i=Mo(e);return i.persistence.runTransaction("Save named query","readwrite",e=>{const s=jd(t.readTime);if(r.snapshotVersion.compareTo(s)>=0)return i.Pi.saveNamedQuery(e,t);const o=r.withResumeToken(ku.EMPTY_BYTE_STRING,s);return i.vs=i.vs.insert(o.targetId,o),i.li.updateTargetData(e,o).next(()=>i.li.removeMatchingKeysForTargetId(e,r.targetId)).next(()=>i.li.addMatchingKeys(e,n,r.targetId)).next(()=>i.Pi.saveNamedQuery(e,t))})}
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
 */const Fm="firestore_clients";function Vm(e,t){return`${Fm}_${e}_${t}`}const Um="firestore_mutations";function qm(e,t,n){let r=`${Um}_${e}_${n}`;return t.isAuthenticated()&&(r+=`_${t.uid}`),r}const Bm="firestore_targets";function jm(e,t){return`${Bm}_${e}_${t}`}
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
 */const zm="SharedClientState";class Gm{constructor(e,t,n,r){this.user=e,this.batchId=t,this.state=n,this.error=r}static $s(e,t,n){const r=JSON.parse(n);let i,s="object"==typeof r&&-1!==["pending","acknowledged","rejected"].indexOf(r.state)&&(void 0===r.error||"object"==typeof r.error);return s&&r.error&&(s="string"==typeof r.error.message&&"string"==typeof r.error.code,s&&(i=new Vo(r.error.code,r.error.message))),s?new Gm(e,t,r.state,i):(Do(zm,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class $m{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static $s(e,t){const n=JSON.parse(t);let r,i="object"==typeof n&&-1!==["not-current","current","rejected"].indexOf(n.state)&&(void 0===n.error||"object"==typeof n.error);return i&&n.error&&(i="string"==typeof n.error.message&&"string"==typeof n.error.code,i&&(r=new Vo(n.error.code,n.error.message))),i?new $m(e,n.state,r):(Do(zm,`Failed to parse target state for ID '${e}': ${t}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Km{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static $s(e,t){const n=JSON.parse(t);let r="object"==typeof n&&n.activeTargetIds instanceof Array,i=Dh();for(let s=0;r&&s<n.activeTargetIds.length;++s)r=rc(n.activeTargetIds[s]),i=i.add(n.activeTargetIds[s]);return r?new Km(e,i):(Do(zm,`Failed to parse client data for instance '${e}': ${t}`),null)}}class Hm{constructor(e,t){this.clientId=e,this.onlineState=t}static $s(e){const t=JSON.parse(e);return"object"==typeof t&&-1!==["Unknown","Online","Offline"].indexOf(t.onlineState)&&"string"==typeof t.clientId?new Hm(t.clientId,t.onlineState):(Do(zm,`Failed to parse online state: ${e}`),null)}}class Wm{constructor(){this.activeTargetIds=Dh()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Qm{constructor(e,t,n,r,i){this.window=e,this.Ci=t,this.persistenceKey=n,this.zs=r,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.js=this.Hs.bind(this),this.Js=new Iu(Jo),this.started=!1,this.Zs=[];const s=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Xs=Vm(this.persistenceKey,this.zs),this.Ys=`firestore_sequence_number_${this.persistenceKey}`,this.Js=this.Js.insert(this.zs,new Wm),this.eo=new RegExp(`^${Fm}_${s}_([^_]*)$`),this.no=new RegExp(`^${Um}_${s}_(\\d+)(?:_(.*))?$`),this.ro=new RegExp(`^${Bm}_${s}_(\\d+)$`),this.io=function(e){return`firestore_online_state_${e}`}(this.persistenceKey),this.so=function(e){return`firestore_bundle_loaded_v2_${e}`}(this.persistenceKey),this.window.addEventListener("storage",this.js)}static v(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.hs();for(const n of e){if(n===this.zs)continue;const e=this.getItem(Vm(this.persistenceKey,n));if(e){const t=Km.$s(n,e);t&&(this.Js=this.Js.insert(t.clientId,t))}}this.oo();const t=this.storage.getItem(this.io);if(t){const e=this._o(t);e&&this.ao(e)}for(const n of this.Zs)this.Hs(n);this.Zs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.Ys,JSON.stringify(e))}getAllActiveQueryTargets(){return this.uo(this.Js)}isActiveQueryTarget(e){let t=!1;return this.Js.forEach((n,r)=>{r.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.co(e,"pending")}updateMutationState(e,t,n){this.co(e,t,n),this.lo(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const t=this.storage.getItem(jm(this.persistenceKey,e));if(t){const r=$m.$s(e,t);r&&(n=r.state)}}return t&&this.ho.Qs(e),this.oo(),n}removeLocalQueryTarget(e){this.ho.Gs(e),this.oo()}isLocalQueryTarget(e){return this.ho.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(jm(this.persistenceKey,e))}updateQueryState(e,t,n){this.Po(e,t,n)}handleUserChange(e,t,n){t.forEach(e=>{this.lo(e)}),this.currentUser=e,n.forEach(e=>{this.addPendingMutation(e)})}setOnlineState(e){this.To(e)}notifyBundleLoaded(e){this.Io(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.js),this.removeItem(this.Xs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return No(zm,"READ",e,t),t}setItem(e,t){No(zm,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){No(zm,"REMOVE",e),this.storage.removeItem(e)}Hs(e){const t=e;if(t.storageArea===this.storage){if(No(zm,"EVENT",t.key,t.newValue),t.key===this.Xs)return void Do("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Ci.enqueueRetryable(async()=>{if(this.started){if(null!==t.key)if(this.eo.test(t.key)){if(null==t.newValue){const e=this.Eo(t.key);return this.Ro(e,null)}{const e=this.Ao(t.key,t.newValue);if(e)return this.Ro(e.clientId,e)}}else if(this.no.test(t.key)){if(null!==t.newValue){const e=this.Vo(t.key,t.newValue);if(e)return this.mo(e)}}else if(this.ro.test(t.key)){if(null!==t.newValue){const e=this.fo(t.key,t.newValue);if(e)return this.po(e)}}else if(t.key===this.io){if(null!==t.newValue){const e=this._o(t.newValue);if(e)return this.ao(e)}}else if(t.key===this.Ys){const e=function(e){let t=Za.ce;if(null!=e)try{const n=JSON.parse(e);Lo("number"==typeof n,30636,{yo:e}),t=n}catch(n){Do(zm,"Failed to read sequence number from WebStorage",n)}return t}(t.newValue);e!==Za.ce&&this.sequenceNumberHandler(e)}else if(t.key===this.so){const e=this.wo(t.newValue);await Promise.all(e.map(e=>this.syncEngine.bo(e)))}}else this.Zs.push(t)})}}get ho(){return this.Js.get(this.zs)}oo(){this.setItem(this.Xs,this.ho.Ws())}co(e,t,n){const r=new Gm(this.currentUser,e,t,n),i=qm(this.persistenceKey,this.currentUser,e);this.setItem(i,r.Ws())}lo(e){const t=qm(this.persistenceKey,this.currentUser,e);this.removeItem(t)}To(e){const t={clientId:this.zs,onlineState:e};this.storage.setItem(this.io,JSON.stringify(t))}Po(e,t,n){const r=jm(this.persistenceKey,e),i=new $m(e,t,n);this.setItem(r,i.Ws())}Io(e){const t=JSON.stringify(Array.from(e));this.setItem(this.so,t)}Eo(e){const t=this.eo.exec(e);return t?t[1]:null}Ao(e,t){const n=this.Eo(e);return Km.$s(n,t)}Vo(e,t){const n=this.no.exec(e),r=Number(n[1]),i=void 0!==n[2]?n[2]:null;return Gm.$s(new So(i),r,t)}fo(e,t){const n=this.ro.exec(e),r=Number(n[1]);return $m.$s(r,t)}_o(e){return Hm.$s(e)}wo(e){return JSON.parse(e)}async mo(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.So(e.batchId,e.state,e.error);No(zm,`Ignoring mutation for non-active user ${e.user.uid}`)}po(e){return this.syncEngine.Do(e.targetId,e.state,e.error)}Ro(e,t){const n=t?this.Js.insert(e,t):this.Js.remove(e),r=this.uo(this.Js),i=this.uo(n),s=[],o=[];return i.forEach(e=>{r.has(e)||s.push(e)}),r.forEach(e=>{i.has(e)||o.push(e)}),this.syncEngine.Co(s,o).then(()=>{this.Js=n})}ao(e){this.Js.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}uo(e){let t=Dh();return e.forEach((e,n)=>{t=t.unionWith(n.activeTargetIds)}),t}}class Jm{constructor(){this.vo=new Wm,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,n){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new Wm,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}
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
 */class Ym{Mo(e){}shutdown(){}}
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
 */const Xm="ConnectivityMonitor";class Zm{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){No(Xm,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){No(Xm,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
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
 */let eg=null;function tg(){return null===eg?eg=268435456+Math.round(2147483648*Math.random()):eg++,"0x"+eg.toString(16)
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
 */}const ng="RestConnection",rg={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class ig{get Ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Uo=`projects/${n}/databases/${r}`,this.$o=this.databaseId.database===Bu?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Wo(e,t,n,r,i){const s=tg(),o=this.Qo(e,t.toUriEncodedString());No(ng,`Sending RPC '${e}' ${s}:`,o,n);const a={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(a,r,i);const{host:c}=new URL(o),u=d(c);return this.zo(e,o,a,n,u).then(t=>(No(ng,`Received RPC '${e}' ${s}: `,t),t),t=>{throw Ro(ng,`RPC '${e}' ${s} failed with error: `,t,"url: ",o,"request:",n),t})}jo(e,t,n,r,i,s){return this.Wo(e,t,n,r,i)}Go(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+Ao,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}Qo(e,t){const n=rg[e];let r=`${this.qo}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(r=`${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),r}terminate(){}}
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
 */class sg{constructor(e){this.Ho=e.Ho,this.Jo=e.Jo}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Jo()}send(e){this.Ho(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}
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
 */const og="WebChannelConnection",ag=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(t){setTimeout(()=>{throw t},0)}})};class cg extends ig{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!cg.c_){const e=To();ag(e,_o.STAT_EVENT,e=>{e.stat===Io.PROXY?No(og,"STAT_EVENT: detected buffering proxy"):e.stat===Io.NOPROXY&&No(og,"STAT_EVENT: detected no buffering proxy")}),cg.c_=!0}}zo(e,t,n,r,i){const s=tg();return new Promise((i,o)=>{const a=new go;a.setWithCredentials(!0),a.listenOnce(vo.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case wo.NO_ERROR:const t=a.getResponseJson();No(og,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(t)),i(t);break;case wo.TIMEOUT:No(og,`RPC '${e}' ${s} timed out`),o(new Vo(Fo.DEADLINE_EXCEEDED,"Request time out"));break;case wo.HTTP_ERROR:const n=a.getStatus();if(No(og,`RPC '${e}' ${s} failed with status:`,n,"response text:",a.getResponseText()),n>0){let e=a.getResponseJson();Array.isArray(e)&&(e=e[0]);const t=null==e?void 0:e.error;if(t&&t.status&&t.message){const e=function(e){const t=e.toLowerCase().replace(/_/g,"-");return Object.values(Fo).indexOf(t)>=0?t:Fo.UNKNOWN}(t.status);o(new Vo(e,t.message))}else o(new Vo(Fo.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new Vo(Fo.UNAVAILABLE,"Connection failed."));break;default:Oo(9055,{l_:e,streamId:s,h_:a.getLastErrorCode(),P_:a.getLastError()})}}finally{No(og,`RPC '${e}' ${s} completed.`)}});const c=JSON.stringify(r);No(og,`RPC '${e}' ${s} sending request:`,r),a.send(t,"POST",c,n,15)})}T_(e,t,n){const r=tg(),i=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],s=this.createWebChannelTransport(),o={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},a=this.longPollingOptions.timeoutSeconds;void 0!==a&&(o.longPollingTimeout=Math.round(1e3*a)),this.useFetchStreams&&(o.useFetchStreams=!0),this.Go(o.initMessageHeaders,t,n),o.encodeInitMessageHeaders=!0;const c=i.join("");No(og,`Creating RPC '${e}' stream ${r}: ${c}`,o);const u=s.createWebChannel(c,o);this.I_(u);let l=!1,h=!1;const d=new sg({Ho:t=>{h?No(og,`Not sending because RPC '${e}' stream ${r} is closed:`,t):(l||(No(og,`Opening RPC '${e}' stream ${r} transport.`),u.open(),l=!0),No(og,`RPC '${e}' stream ${r} sending:`,t),u.send(t))},Jo:()=>u.close()});return ag(u,yo.EventType.OPEN,()=>{h||(No(og,`RPC '${e}' stream ${r} transport opened.`),d.i_())}),ag(u,yo.EventType.CLOSE,()=>{h||(h=!0,No(og,`RPC '${e}' stream ${r} transport closed`),d.o_(),this.E_(u))}),ag(u,yo.EventType.ERROR,t=>{h||(h=!0,Ro(og,`RPC '${e}' stream ${r} transport errored. Name:`,t.name,"Message:",t.message),d.o_(new Vo(Fo.UNAVAILABLE,"The operation could not be completed")))}),ag(u,yo.EventType.MESSAGE,t=>{var n;if(!h){const i=t.data[0];Lo(!!i,16349);const s=i,o=(null==s?void 0:s.error)||(null==(n=s[0])?void 0:n.error);if(o){No(og,`RPC '${e}' stream ${r} received error:`,o);const t=o.status;let n=function(e){const t=pd[e];if(void 0!==t)return yd(t)}(t),i=o.message;"NOT_FOUND"===t&&i.includes("database")&&i.includes("does not exist")&&i.includes(this.databaseId.database)&&Ro(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),void 0===n&&(n=Fo.INTERNAL,i="Unknown error status: "+t+" with message "+o.message),h=!0,d.o_(new Vo(n,i)),u.close()}else No(og,`RPC '${e}' stream ${r} received:`,i),d.__(i)}}),cg.u_(),setTimeout(()=>{d.s_()},0),d}terminate(){this.a_.forEach(e=>e.close()),this.a_=[]}I_(e){this.a_.push(e)}E_(e){this.a_=this.a_.filter(t=>t===e)}Go(e,t,n){super.Go(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return bo()}}
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
function ug(){return"undefined"!=typeof window?window:null}function lg(){return"undefined"!=typeof document?document:null}
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
 */function hg(e){return new Fd(e,!0)}
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
 */cg.c_=!1;class dg{constructor(e,t,n=1e3,r=1.5,i=6e4){this.Ci=e,this.timerId=t,this.R_=n,this.A_=r,this.V_=i,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),n=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-n);r>0&&No("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,r,()=>(this.f_=Date.now(),e())),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){null!==this.m_&&(this.m_.skipDelay(),this.m_=null)}cancel(){null!==this.m_&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}
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
 */const fg="PersistentStream";class pg{constructor(e,t,n,r,i,s,o,a){this.Ci=e,this.b_=n,this.S_=r,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new dg(e,t)}x_(){return 1===this.state||5===this.state||this.O_()}O_(){return 2===this.state||3===this.state}start(){this.F_=0,4!==this.state?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&null===this.C_&&(this.C_=this.Ci.enqueueAfterDelay(this.b_,6e4,()=>this.k_()))}K_(e){this.q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.U_(),this.M_.cancel(),this.D_++,4!==e?this.M_.reset():t&&t.code===Fo.RESOURCE_EXHAUSTED?(Do(t.toString()),Do("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===Fo.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.D_===t&&this.G_(e,n)},t=>{e(()=>{const e=new Vo(Fo.UNKNOWN,"Fetching auth token failed: "+t.message);return this.z_(e)})})}G_(e,t){const n=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo(()=>{n(()=>this.listener.Zo())}),this.stream.Yo(()=>{n(()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.S_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.Yo()))}),this.stream.t_(e=>{n(()=>this.z_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.F_?this.H_(e):this.onNext(e))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return No(fg,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget(()=>this.D_===e?t():(No(fg,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class mg extends pg{constructor(e,t,n,r,i,s){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}H_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=function(e,t){let n;if("targetChange"in t){t.targetChange;const i="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:Oo(39313,{state:r}),s=t.targetChange.targetIds||[],o=function(e,t){return e.useProto3Json?(Lo(void 0===t||"string"==typeof t,58123),ku.fromBase64String(t||"")):(Lo(void 0===t||t instanceof Buffer||t instanceof Uint8Array,16193),ku.fromUint8Array(t||new Uint8Array))}(e,t.targetChange.resumeToken),a=t.targetChange.cause,c=a&&function(e){const t=void 0===e.code?Fo.UNKNOWN:yd(e.code);return new Vo(t,e.message||"")}(a);n=new Nd(i,s,o,c||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const i=Hd(e,r.document.name),s=jd(r.document.updateTime),o=r.document.createTime?jd(r.document.createTime):Ta.min(),a=new vl({mapValue:{fields:r.document.fields}}),c=Il.newFoundDocument(i,s,o,a),u=r.targetIds||[],l=r.removedTargetIds||[];n=new Cd(u,l,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const i=Hd(e,r.document),s=r.readTime?jd(r.readTime):Ta.min(),o=Il.newNoDocument(i,s),a=r.removedTargetIds||[];n=new Cd([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const i=Hd(e,r.document),s=r.removedTargetIds||[];n=new Cd([],s,i,null)}else{if(!("filter"in t))return Oo(11601,{Vt:t});{t.filter;const e=t.filter;e.targetId;const{count:r=0,unchangedNames:i}=e,s=new fd(r,i),o=e.targetId;n=new kd(o,s)}}var r;return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return Ta.min();const t=e.targetChange;return t.targetIds&&t.targetIds.length?Ta.min():t.readTime?jd(t.readTime):Ta.min()}(e);return this.listener.J_(t,n)}Z_(e){const t={};t.database=Jd(this.serializer),t.addTarget=function(e,t){let n;const r=t.target;if(n=Ql(r)?{documents:nf(e,r)}:{query:rf(e,r).ft},n.targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=qd(e,t.resumeToken);const r=Vd(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(Ta.min())>0){n.readTime=Ud(e,t.snapshotVersion.toTimestamp());const r=Vd(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);const n=function(e,t){const n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Oo(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.K_(t)}X_(e){const t={};t.database=Jd(this.serializer),t.removeTarget=e,this.K_(t)}}class gg extends pg{constructor(e,t,n,r,i,s){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}H_(e){return Lo(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Lo(!e.writeResults||0===e.writeResults.length,55816),this.listener.ta()}onNext(e){Lo(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=function(e,t){return e&&e.length>0?(Lo(void 0!==t,14353),e.map(e=>function(e,t){let n=e.updateTime?jd(e.updateTime):jd(t);return n.isEqual(Ta.min())&&(n=jd(t)),new Hh(n,e.transformResults||[])}(e,t))):[]}(e.writeResults,e.commitTime),n=jd(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=Jd(this.serializer),this.K_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map(e=>ef(this.serializer,e))};this.K_(t)}}
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
 */class yg{}class vg extends yg{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new Vo(Fo.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Wo(e,Gd(t,n),r,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===Fo.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Vo(Fo.UNKNOWN,e.toString())})}jo(e,t,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.jo(e,Gd(t,n),r,s,o,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===Fo.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Vo(Fo.UNKNOWN,e.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class wg{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){0===this.oa&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){"Online"===this.state?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,"Online"===e&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Do(t),this.aa=!1):No("OnlineStateTracker",t)}Pa(){null!==this._a&&(this._a.cancel(),this._a=null)}}
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
 */const Ig="RemoteStore";class _g{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.Ra=[],this.Aa=i,this.Aa.Mo(e=>{n.enqueueAndForget(async()=>{Dg(this)&&(No(Ig,"Restarting streams for network reachability change."),await async function(e){const t=Mo(e);t.Ea.add(4),await bg(t),t.Va.set("Unknown"),t.Ea.delete(4),await Tg(t)}(this))})}),this.Va=new wg(n,r)}}async function Tg(e){if(Dg(e))for(const t of e.Ra)await t(!0)}async function bg(e){for(const t of e.Ra)await t(!1)}function Eg(e,t){const n=Mo(e);n.Ia.has(t.targetId)||(n.Ia.set(t.targetId,t),Ng(n)?kg(n):Qg(n).O_()&&Ag(n,t))}function Sg(e,t){const n=Mo(e),r=Qg(n);n.Ia.delete(t),r.O_()&&Cg(n,t),0===n.Ia.size&&(r.O_()?r.L_():Dg(n)&&n.Va.set("Unknown"))}function Ag(e,t){if(e.da.$e(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(Ta.min())>0){const n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}Qg(e).Z_(t)}function Cg(e,t){e.da.$e(t),Qg(e).X_(t)}function kg(e){e.da=new Rd({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),At:t=>e.Ia.get(t)||null,ht:()=>e.datastore.serializer.databaseId}),Qg(e).start(),e.Va.ua()}function Ng(e){return Dg(e)&&!Qg(e).x_()&&e.Ia.size>0}function Dg(e){return 0===Mo(e).Ea.size}function Rg(e){e.da=void 0}async function Pg(e){e.Va.set("Online")}async function Og(e){e.Ia.forEach((t,n)=>{Ag(e,t)})}async function xg(e,t){Rg(e),Ng(e)?(e.Va.ha(t),kg(e)):e.Va.set("Unknown")}async function Lg(e,t,n){if(e.Va.set("Online"),t instanceof Nd&&2===t.state&&t.cause)try{await async function(e,t){const n=t.cause;for(const r of t.targetIds)e.Ia.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e.Ia.delete(r),e.da.removeTarget(r))}(e,t)}catch(r){No(Ig,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await Mg(e,r)}else if(t instanceof Cd?e.da.Xe(t):t instanceof kd?e.da.st(t):e.da.tt(t),!n.isEqual(Ta.min()))try{const t=await Cm(e.localStore);n.compareTo(t)>=0&&await function(e,t){const n=e.da.Tt(t);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const i=e.Ia.get(r);i&&e.Ia.set(r,i.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{const r=e.Ia.get(t);if(!r)return;e.Ia.set(t,r.withResumeToken(ku.EMPTY_BYTE_STRING,r.snapshotVersion)),Cg(e,t);const i=new yf(r.target,t,n,r.sequenceNumber);Ag(e,i)}),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(i){No(Ig,"Failed to raise snapshot:",i),await Mg(e,i)}}async function Mg(e,t,n){if(!$a(t))throw t;e.Ea.add(1),await bg(e),e.Va.set("Offline"),n||(n=()=>Cm(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{No(Ig,"Retrying IndexedDB access"),await n(),e.Ea.delete(1),await Tg(e)})}function Fg(e,t){return t().catch(n=>Mg(e,n,t))}async function Vg(e){const t=Mo(e),n=Jg(t);let r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:ec;for(;Ug(t);)try{const e=await Nm(t.localStore,r);if(null===e){0===t.Ta.length&&n.L_();break}r=e.batchId,qg(t,e)}catch(i){await Mg(t,i)}Bg(t)&&jg(t)}function Ug(e){return Dg(e)&&e.Ta.length<10}function qg(e,t){e.Ta.push(t);const n=Jg(e);n.O_()&&n.Y_&&n.ea(t.mutations)}function Bg(e){return Dg(e)&&!Jg(e).x_()&&e.Ta.length>0}function jg(e){Jg(e).start()}async function zg(e){Jg(e).ra()}async function Gg(e){const t=Jg(e);for(const n of e.Ta)t.ea(n.mutations)}async function $g(e,t,n){const r=e.Ta.shift(),i=ld.from(r,t,n);await Fg(e,()=>e.remoteSyncer.applySuccessfulWrite(i)),await Vg(e)}async function Kg(e,t){t&&Jg(e).Y_&&await async function(e,t){if(gd(n=t.code)&&n!==Fo.ABORTED){const n=e.Ta.shift();Jg(e).B_(),await Fg(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await Vg(e)}var n}(e,t),Bg(e)&&jg(e)}async function Hg(e,t){const n=Mo(e);n.asyncQueue.verifyOperationInProgress(),No(Ig,"RemoteStore received new credentials");const r=Dg(n);n.Ea.add(3),await bg(n),r&&n.Va.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.Ea.delete(3),await Tg(n)}async function Wg(e,t){const n=Mo(e);t?(n.Ea.delete(2),await Tg(n)):t||(n.Ea.add(2),await bg(n),n.Va.set("Unknown"))}function Qg(e){return e.ma||(e.ma=function(e,t,n){const r=Mo(e);return r.sa(),new mg(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Zo:Pg.bind(null,e),Yo:Og.bind(null,e),t_:xg.bind(null,e),J_:Lg.bind(null,e)}),e.Ra.push(async t=>{t?(e.ma.B_(),Ng(e)?kg(e):e.Va.set("Unknown")):(await e.ma.stop(),Rg(e))})),e.ma}function Jg(e){return e.fa||(e.fa=function(e,t,n){const r=Mo(e);return r.sa(),new gg(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Zo:()=>Promise.resolve(),Yo:zg.bind(null,e),t_:Kg.bind(null,e),ta:Gg.bind(null,e),na:$g.bind(null,e)}),e.Ra.push(async t=>{t?(e.fa.B_(),await Vg(e)):(await e.fa.stop(),e.Ta.length>0&&(No(Ig,`Stopping write stream with ${e.Ta.length} pending writes`),e.Ta=[]))})),e.fa
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
 */}class Yg{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new Uo,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,i){const s=Date.now()+n,o=new Yg(e,t,s,r,i);return o.start(n),o}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new Vo(Fo.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Xg(e,t){if(Do("AsyncQueue",`${t}: ${e}`),$a(e))return new Vo(Fo.UNAVAILABLE,`${t}: ${e}`);throw e}
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
 */class Zg{static emptySet(e){return new Zg(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||ca.comparator(t.key,n.key):(e,t)=>ca.comparator(e.key,t.key),this.keyedMap=_h(),this.sortedSet=new Iu(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Zg))return!1;if(this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){const n=new Zg;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}
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
 */class ey{constructor(){this.ga=new Iu(ca.comparator)}track(e){const t=e.doc.key,n=this.ga.get(t);n?0!==e.type&&3===n.type?this.ga=this.ga.insert(t,e):3===e.type&&1!==n.type?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.ga=this.ga.remove(t):1===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):Oo(63341,{Vt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal((t,n)=>{e.push(n)}),e}}class ty{constructor(e,t,n,r,i,s,o,a,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,r,i){const s=[];return t.forEach(e=>{s.push({type:0,doc:e})}),new ty(e,t,Zg.emptySet(t),s,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&lh(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==n[r].type||!t[r].doc.isEqual(n[r].doc))return!1;return!0}}
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
 */class ny{constructor(){this.wa=void 0,this.ba=[]}Sa(){return this.ba.some(e=>e.Da())}}class ry{constructor(){this.queries=iy(),this.onlineState="Unknown",this.Ca=new Set}terminate(){!function(e,t){const n=Mo(e),r=n.queries;n.queries=iy(),r.forEach((e,n)=>{for(const r of n.ba)r.onError(t)})}(this,new Vo(Fo.ABORTED,"Firestore shutting down"))}}function iy(){return new yh(e=>hh(e),lh)}async function sy(e,t){const n=Mo(e);let r=3;const i=t.query;let s=n.queries.get(i);s?!s.Sa()&&t.Da()&&(r=2):(s=new ny,r=t.Da()?0:1);try{switch(r){case 0:s.wa=await n.onListen(i,!0);break;case 1:s.wa=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const e=Xg(o,`Initialization of query '${dh(t.query)}' failed`);return void t.onError(e)}n.queries.set(i,s),s.ba.push(t),t.va(n.onlineState),s.wa&&t.Fa(s.wa)&&uy(n)}async function oy(e,t){const n=Mo(e),r=t.query;let i=3;const s=n.queries.get(r);if(s){const e=s.ba.indexOf(t);e>=0&&(s.ba.splice(e,1),0===s.ba.length?i=t.Da()?0:1:!s.Sa()&&t.Da()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function ay(e,t){const n=Mo(e);let r=!1;for(const i of t){const e=i.query,t=n.queries.get(e);if(t){for(const e of t.ba)e.Fa(i)&&(r=!0);t.wa=i}}r&&uy(n)}function cy(e,t,n){const r=Mo(e),i=r.queries.get(t);if(i)for(const s of i.ba)s.onError(n);r.queries.delete(t)}function uy(e){e.Ca.forEach(e=>{e.next()})}var ly,hy;(hy=ly||(ly={})).Ma="default",hy.Cache="cache";class dy{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){const t=[];for(const n of e.docChanges)3!==n.type&&t.push(n);e=new ty(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache)return!0;if(!this.Da())return!0;const n="Offline"!==t;return(!this.options.Ka||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}ka(e){e=ty.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==ly.Cache}}
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
 */class fy{constructor(e,t){this.qa=e,this.byteLength=t}Ua(){return"metadata"in this.qa}}
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
 */class py{constructor(e){this.serializer=e}Ks(e){return Hd(this.serializer,e)}qs(e){return e.metadata.exists?Zd(this.serializer,e.document,!1):Il.newNoDocument(this.Ks(e.metadata.name),this.Us(e.metadata.readTime))}Us(e){return jd(e)}}class my{constructor(e,t){this.$a=e,this.serializer=t,this.Wa=[],this.Qa=[],this.collectionGroups=new Set,this.progress=gy(e)}get queries(){return this.Wa}get documents(){return this.Qa}Ga(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.qa.namedQuery)this.Wa.push(e.qa.namedQuery);else if(e.qa.documentMetadata){this.Qa.push({metadata:e.qa.documentMetadata}),e.qa.documentMetadata.exists||++t;const n=sa.fromString(e.qa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.qa.document&&(this.Qa[this.Qa.length-1].document=e.qa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,{...this.progress}):null}za(e){const t=new Map,n=new py(this.serializer);for(const r of e)if(r.metadata.queries){const e=n.Ks(r.metadata.name);for(const n of r.metadata.queries){const r=(t.get(n)||kh()).add(e);t.set(n,r)}}return t}async ja(e){const t=await async function(e,t,n,r){const i=Mo(e);let s=kh(),o=wh();for(const l of n){const e=t.Ks(l.metadata.name);l.document&&(s=s.add(e));const n=t.qs(l);n.setReadTime(t.Us(l.metadata.readTime)),o=o.insert(e,n)}const a=i.xs.newChangeBuffer({trackRemovals:!0}),c=await Dm(i,(u=r,sh(th(sa.fromString(`__bundle__/docs/${u}`)))));var u;return i.persistence.runTransaction("Apply bundle documents","readwrite",e=>km(e,a,o).next(t=>(a.apply(e),t)).next(t=>i.li.removeMatchingKeysForTargetId(e,c.targetId).next(()=>i.li.addMatchingKeys(e,s,c.targetId)).next(()=>i.localDocuments.getLocalViewOfDocuments(e,t.Bs,t.Ls)).next(()=>t.Bs)))}(e,new py(this.serializer),this.Qa,this.$a.id),n=this.za(this.documents);for(const r of this.Wa)await Mm(e,r,n.get(r.name));return this.progress.taskState="Success",{progress:this.progress,Ha:this.collectionGroups,Ja:t}}}function gy(e){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:e.totalDocuments,totalBytes:e.totalBytes}}
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
 */class yy{constructor(e){this.key=e}}class vy{constructor(e){this.key=e}}class wy{constructor(e,t){this.query=e,this.Za=t,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=kh(),this.mutatedKeys=kh(),this.eu=mh(e),this.tu=new Zg(this.eu)}get nu(){return this.Za}ru(e,t){const n=t?t.iu:new ey,r=t?t.tu:this.tu;let i=t?t.mutatedKeys:this.mutatedKeys,s=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,c="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{const u=r.get(e),l=fh(this.query,t)?t:null,h=!!u&&this.mutatedKeys.has(u.key),d=!!l&&(l.hasLocalMutations||this.mutatedKeys.has(l.key)&&l.hasCommittedMutations);let f=!1;u&&l?u.data.isEqual(l.data)?h!==d&&(n.track({type:3,doc:l}),f=!0):this.su(u,l)||(n.track({type:2,doc:l}),f=!0,(a&&this.eu(l,a)>0||c&&this.eu(l,c)<0)&&(o=!0)):!u&&l?(n.track({type:0,doc:l}),f=!0):u&&!l&&(n.track({type:1,doc:u}),f=!0,(a||c)&&(o=!0)),f&&(l?(s=s.add(l),i=d?i.add(e):i.delete(e)):(s=s.delete(e),i=i.delete(e)))}),null!==this.query.limit)for(;s.size>this.query.limit;){const e="F"===this.query.limitType?s.last():s.first();s=s.delete(e.key),i=i.delete(e.key),n.track({type:1,doc:e})}return{tu:s,iu:n,Ss:o,mutatedKeys:i}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){const i=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const s=e.iu.ya();s.sort((e,t)=>function(e,t){const n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Oo(20277,{Vt:e})}};return n(e)-n(t)}(e.type,t.type)||this.eu(e.doc,t.doc)),this.ou(n),r=r??!1;const o=t&&!r?this._u():[],a=0===this.Ya.size&&this.current&&!r?1:0,c=a!==this.Xa;return this.Xa=a,0!==s.length||c?{snapshot:new ty(this.query,e.tu,i,s,e.mutatedKeys,0===a,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:o}:{au:o}}va(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({tu:this.tu,iu:new ey,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(e=>this.Za=this.Za.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.Za=this.Za.delete(e)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=kh(),this.tu.forEach(e=>{this.uu(e.key)&&(this.Ya=this.Ya.add(e.key))});const t=[];return e.forEach(e=>{this.Ya.has(e)||t.push(new vy(e))}),this.Ya.forEach(n=>{e.has(n)||t.push(new yy(n))}),t}cu(e){this.Za=e.ks,this.Ya=kh();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return ty.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,0===this.Xa,this.hasCachedResults)}}const Iy="SyncEngine";class _y{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Ty{constructor(e){this.key=e,this.hu=!1}}class by{constructor(e,t,n,r,i,s){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.Pu={},this.Tu=new yh(e=>hh(e),lh),this.Iu=new Map,this.Eu=new Set,this.Ru=new Iu(ca.comparator),this.Au=new Map,this.Vu=new Zp,this.du={},this.mu=new Map,this.fu=Sp.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return!0===this.gu}}async function Ey(e,t,n=!0){const r=Zy(e);let i;const s=r.Tu.get(t);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.lu()):i=await Ay(r,t,n,!0),i}async function Sy(e,t){const n=Zy(e);await Ay(n,t,!0,!1)}async function Ay(e,t,n,r){const i=await Dm(e.localStore,sh(t)),s=i.targetId,o=e.sharedClientState.addLocalQueryTarget(s,n);let a;return r&&(a=await Cy(e,t,s,"current"===o,i.resumeToken)),e.isPrimaryClient&&n&&Eg(e.remoteStore,i),a}async function Cy(e,t,n,r,i){e.pu=(t,n,r)=>async function(e,t,n,r){let i=t.view.ru(n);i.Ss&&(i=await Pm(e.localStore,t.query,!1).then(({documents:e})=>t.view.ru(e,i)));const s=r&&r.targetChanges.get(t.targetId),o=r&&null!=r.targetMismatches.get(t.targetId),a=t.view.applyChanges(i,e.isPrimaryClient,s,o);return Uy(e,t.targetId,a.au),a.snapshot}(e,t,n,r);const s=await Pm(e.localStore,t,!0),o=new wy(t,s.ks),a=o.ru(s.documents),c=Ad.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,i),u=o.applyChanges(a,e.isPrimaryClient,c);Uy(e,n,u.au);const l=new _y(t,n,o);return e.Tu.set(t,l),e.Iu.has(n)?e.Iu.get(n).push(t):e.Iu.set(n,[t]),u.snapshot}async function ky(e,t,n){const r=Mo(e),i=r.Tu.get(t),s=r.Iu.get(i.targetId);if(s.length>1)return r.Iu.set(i.targetId,s.filter(e=>!lh(e,t))),void r.Tu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Rm(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&Sg(r.remoteStore,i.targetId),Fy(r,i.targetId)}).catch(Fa)):(Fy(r,i.targetId),await Rm(r.localStore,i.targetId,!0))}async function Ny(e,t){const n=Mo(e),r=n.Tu.get(t),i=n.Iu.get(r.targetId);n.isPrimaryClient&&1===i.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Sg(n.remoteStore,r.targetId))}async function Dy(e,t){const n=Mo(e);try{const e=await function(e,t){const n=Mo(e),r=t.snapshotVersion;let i=n.vs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",e=>{const s=n.xs.newChangeBuffer({trackRemovals:!0});i=n.vs;const o=[];t.targetChanges.forEach((s,a)=>{const c=i.get(a);if(!c)return;o.push(n.li.removeMatchingKeys(e,s.removedDocuments,a).next(()=>n.li.addMatchingKeys(e,s.addedDocuments,a)));let u=c.withSequenceNumber(e.currentSequenceNumber);var l,h,d;null!==t.targetMismatches.get(a)?u=u.withResumeToken(ku.EMPTY_BYTE_STRING,Ta.min()).withLastLimboFreeSnapshotVersion(Ta.min()):s.resumeToken.approximateByteSize()>0&&(u=u.withResumeToken(s.resumeToken,r)),i=i.insert(a,u),h=u,d=s,(0===(l=c).resumeToken.approximateByteSize()||h.snapshotVersion.toMicroseconds()-l.snapshotVersion.toMicroseconds()>=3e8||d.addedDocuments.size+d.modifiedDocuments.size+d.removedDocuments.size>0)&&o.push(n.li.updateTargetData(e,u))});let a=wh(),c=kh();if(t.documentUpdates.forEach(r=>{t.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(e,r))}),o.push(km(e,s,t.documentUpdates).next(e=>{a=e.Bs,c=e.Ls})),!r.isEqual(Ta.min())){const t=n.li.getLastRemoteSnapshotVersion(e).next(t=>n.li.setTargetsMetadata(e,e.currentSequenceNumber,r));o.push(t)}return Va.waitFor(o).next(()=>s.apply(e)).next(()=>n.localDocuments.getLocalViewOfDocuments(e,a,c)).next(()=>a)}).then(e=>(n.vs=i,e))}(n.localStore,t);t.targetChanges.forEach((e,t)=>{const r=n.Au.get(t);r&&(Lo(e.addedDocuments.size+e.modifiedDocuments.size+e.removedDocuments.size<=1,22616),e.addedDocuments.size>0?r.hu=!0:e.modifiedDocuments.size>0?Lo(r.hu,14607):e.removedDocuments.size>0&&(Lo(r.hu,42227),r.hu=!1))}),await jy(n,e,t)}catch(r){await Fa(r)}}function Ry(e,t,n){const r=Mo(e);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const e=[];r.Tu.forEach((n,r)=>{const i=r.view.va(t);i.snapshot&&e.push(i.snapshot)}),function(e,t){const n=Mo(e);n.onlineState=t;let r=!1;n.queries.forEach((e,n)=>{for(const i of n.ba)i.va(t)&&(r=!0)}),r&&uy(n)}(r.eventManager,t),e.length&&r.Pu.J_(e),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function Py(e,t,n){const r=Mo(e);r.sharedClientState.updateQueryState(t,"rejected",n);const i=r.Au.get(t),s=i&&i.key;if(s){let e=new Iu(ca.comparator);e=e.insert(s,Il.newNoDocument(s,Ta.min()));const n=kh().add(s),i=new Sd(Ta.min(),new Map,new Iu(Jo),e,n);await Dy(r,i),r.Ru=r.Ru.remove(s),r.Au.delete(t),By(r)}else await Rm(r.localStore,t,!1).then(()=>Fy(r,t,n)).catch(Fa)}async function Oy(e,t){const n=Mo(e),r=t.batch.batchId;try{const e=await function(e,t){const n=Mo(e);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{const r=t.batch.keys(),i=n.xs.newChangeBuffer({trackRemovals:!0});return function(e,t,n,r){const i=n.batch,s=i.keys();let o=Va.resolve();return s.forEach(e=>{o=o.next(()=>r.getEntry(t,e)).next(t=>{const s=n.docVersions.get(e);Lo(null!==s,48541),t.version.compareTo(s)<0&&(i.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),o.next(()=>e.mutationQueue.removeMutationBatch(t,i))}(n,e,t,i).next(()=>i.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=kh();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))})}(n.localStore,t);My(n,r,null),Ly(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await jy(n,e)}catch(i){await Fa(i)}}async function xy(e,t,n){const r=Mo(e);try{const e=await function(e,t){const n=Mo(e);return n.persistence.runTransaction("Reject batch","readwrite-primary",e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next(t=>(Lo(null!==t,37113),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t))).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r)).next(()=>n.localDocuments.getDocuments(e,r))})}(r.localStore,t);My(r,t,n),Ly(r,t),r.sharedClientState.updateMutationState(t,"rejected",n),await jy(r,e)}catch(i){await Fa(i)}}function Ly(e,t){(e.mu.get(t)||[]).forEach(e=>{e.resolve()}),e.mu.delete(t)}function My(e,t,n){const r=Mo(e);let i=r.du[r.currentUser.toKey()];if(i){const e=i.get(t);e&&(n?e.reject(n):e.resolve(),i=i.remove(t)),r.du[r.currentUser.toKey()]=i}}function Fy(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(const r of e.Iu.get(t))e.Tu.delete(r),n&&e.Pu.yu(r,n);e.Iu.delete(t),e.isPrimaryClient&&e.Vu.Gr(t).forEach(t=>{e.Vu.containsKey(t)||Vy(e,t)})}function Vy(e,t){e.Eu.delete(t.path.canonicalString());const n=e.Ru.get(t);null!==n&&(Sg(e.remoteStore,n),e.Ru=e.Ru.remove(t),e.Au.delete(n),By(e))}function Uy(e,t,n){for(const r of n)r instanceof yy?(e.Vu.addReference(r.key,t),qy(e,r)):r instanceof vy?(No(Iy,"Document no longer in limbo: "+r.key),e.Vu.removeReference(r.key,t),e.Vu.containsKey(r.key)||Vy(e,r.key)):Oo(19791,{wu:r})}function qy(e,t){const n=t.key,r=n.path.canonicalString();e.Ru.get(n)||e.Eu.has(r)||(No(Iy,"New document in limbo: "+n),e.Eu.add(r),By(e))}function By(e){for(;e.Eu.size>0&&e.Ru.size<e.maxConcurrentLimboResolutions;){const t=e.Eu.values().next().value;e.Eu.delete(t);const n=new ca(sa.fromString(t)),r=e.fu.next();e.Au.set(r,new Ty(n)),e.Ru=e.Ru.insert(n,r),Eg(e.remoteStore,new yf(sh(th(n.path)),r,"TargetPurposeLimboResolution",Za.ce))}}async function jy(e,t,n){const r=Mo(e),i=[],s=[],o=[];r.Tu.isEmpty()||(r.Tu.forEach((e,a)=>{o.push(r.pu(a,t,n).then(e=>{var t;if((e||n)&&r.isPrimaryClient){const i=e?!e.fromCache:null==(t=null==n?void 0:n.targetChanges.get(a.targetId))?void 0:t.current;r.sharedClientState.updateQueryState(a.targetId,i?"current":"not-current")}if(e){i.push(e);const t=Im.Es(a.targetId,e);s.push(t)}}))}),await Promise.all(o),r.Pu.J_(i),await async function(e,t){const n=Mo(e);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",e=>Va.forEach(t,t=>Va.forEach(t.Ts,r=>n.persistence.referenceDelegate.addReference(e,t.targetId,r)).next(()=>Va.forEach(t.Is,r=>n.persistence.referenceDelegate.removeReference(e,t.targetId,r)))))}catch(r){if(!$a(r))throw r;No(bm,"Failed to update sequence numbers: "+r)}for(const i of t){const e=i.targetId;if(!i.fromCache){const t=n.vs.get(e),r=t.snapshotVersion,i=t.withLastLimboFreeSnapshotVersion(r);n.vs=n.vs.insert(e,i)}}}(r.localStore,s))}async function zy(e,t){const n=Mo(e);if(!n.currentUser.isEqual(t)){No(Iy,"User change. New user:",t.toKey());const e=await Am(n.localStore,t);n.currentUser=t,i="'waitForPendingWrites' promise is rejected due to a user change.",(r=n).mu.forEach(e=>{e.forEach(e=>{e.reject(new Vo(Fo.CANCELLED,i))})}),r.mu.clear(),n.sharedClientState.handleUserChange(t,e.removedBatchIds,e.addedBatchIds),await jy(n,e.Ns)}var r,i}function Gy(e,t){const n=Mo(e),r=n.Au.get(t);if(r&&r.hu)return kh().add(r.key);{let e=kh();const r=n.Iu.get(t);if(!r)return e;for(const t of r){const r=n.Tu.get(t);e=e.unionWith(r.view.nu)}return e}}async function $y(e,t){const n=Mo(e),r=await Pm(n.localStore,t.query,!0),i=t.view.cu(r);return n.isPrimaryClient&&Uy(n,t.targetId,i.au),i}async function Ky(e,t){const n=Mo(e);return xm(n.localStore,t).then(e=>jy(n,e))}async function Hy(e,t,n,r){const i=Mo(e),s=await function(e,t){const n=Mo(e),r=Mo(n.mutationQueue);return n.persistence.runTransaction("Lookup mutation documents","readonly",e=>r.Xn(e,t).next(t=>t?n.localDocuments.getDocuments(e,t):Va.resolve(null)))}(i.localStore,t);var o,a;null!==s?("pending"===n?await Vg(i.remoteStore):"acknowledged"===n||"rejected"===n?(My(i,t,r||null),Ly(i,t),o=i.localStore,a=t,Mo(Mo(o).mutationQueue).nr(a)):Oo(6720,"Unknown batchState",{bu:n}),await jy(i,s)):No(Iy,"Cannot apply mutation batch with id: "+t)}async function Wy(e,t,n){const r=Mo(e),i=[],s=[];for(const o of t){let e;const t=r.Iu.get(o);if(t&&0!==t.length){e=await Dm(r.localStore,sh(t[0]));for(const e of t){const t=r.Tu.get(e),n=await $y(r,t);n.snapshot&&s.push(n.snapshot)}}else{const t=await Om(r.localStore,o);e=await Dm(r.localStore,t),await Cy(r,Qy(t),o,!1,e.resumeToken)}i.push(e)}return r.Pu.J_(s),i}function Qy(e){return eh(e.path,e.collectionGroup,e.orderBy,e.filters,e.limit,"F",e.startAt,e.endAt)}function Jy(e){return t=Mo(e).localStore,Mo(Mo(t).persistence).hs();var t}async function Yy(e,t,n,r){const i=Mo(e);if(i.gu)return void No(Iy,"Ignoring unexpected query state notification.");const s=i.Iu.get(t);if(s&&s.length>0)switch(n){case"current":case"not-current":{const e=await xm(i.localStore,ph(s[0])),r=Sd.createSynthesizedRemoteEventForCurrentChange(t,"current"===n,ku.EMPTY_BYTE_STRING);await jy(i,e,r);break}case"rejected":await Rm(i.localStore,t,!0),Fy(i,t,r);break;default:Oo(64155,n)}}async function Xy(e,t,n){const r=Zy(e);if(r.gu){for(const e of t){if(r.Iu.has(e)&&r.sharedClientState.isActiveQueryTarget(e)){No(Iy,"Adding an already active target "+e);continue}const t=await Om(r.localStore,e),n=await Dm(r.localStore,t);await Cy(r,Qy(t),n.targetId,!1,n.resumeToken),Eg(r.remoteStore,n)}for(const e of n)r.Iu.has(e)&&await Rm(r.localStore,e,!1).then(()=>{Sg(r.remoteStore,e),Fy(r,e)}).catch(Fa)}}function Zy(e){const t=Mo(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=Dy.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=Gy.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=Py.bind(null,t),t.Pu.J_=ay.bind(null,t.eventManager),t.Pu.yu=cy.bind(null,t.eventManager),t}function ev(e){const t=Mo(e);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Oy.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=xy.bind(null,t),t}class tv{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=hg(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return Sm(this.persistence,new Tm,e.initialUser,this.serializer)}Cu(e){return new sm(am.Vi,this.serializer)}Du(e){return new Jm}async terminate(){var e,t;null==(e=this.gcScheduler)||e.stop(),null==(t=this.indexBackfillerScheduler)||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}tv.provider={build:()=>new tv};class nv extends tv{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){Lo(this.persistence.referenceDelegate instanceof cm,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new xp(n,e.asyncQueue,t)}Cu(e){const t=void 0!==this.cacheSizeBytes?yp.withCacheSize(this.cacheSizeBytes):yp.DEFAULT;return new sm(e=>cm.Vi(e,t),this.serializer)}}class rv extends tv{constructor(e,t,n){super(),this.xu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.xu.initialize(this,e),await ev(this.xu.syncEngine),await Vg(this.xu.remoteStore),await this.persistence.zi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}vu(e){return Sm(this.persistence,new Tm,e.initialUser,this.serializer)}Fu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new xp(n,e.asyncQueue,t)}Mu(e,t){const n=new Xa(t,this.persistence);return new Ya(e.asyncQueue,n)}Cu(e){const t=wm(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=void 0!==this.cacheSizeBytes?yp.withCacheSize(this.cacheSizeBytes):yp.DEFAULT;return new gm(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,ug(),lg(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Du(e){return new Jm}}class iv extends rv{constructor(e,t){super(e,t,!1),this.xu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.xu.syncEngine;this.sharedClientState instanceof Qm&&(this.sharedClientState.syncEngine={So:Hy.bind(null,t),Do:Yy.bind(null,t),Co:Xy.bind(null,t),hs:Jy.bind(null,t),bo:Ky.bind(null,t)},await this.sharedClientState.start()),await this.persistence.zi(async e=>{await async function(e,t){const n=Mo(e);if(Zy(n),ev(n),!0===t&&!0!==n.gu){const e=n.sharedClientState.getAllActiveQueryTargets(),t=await Wy(n,e.toArray());n.gu=!0,await Wg(n.remoteStore,!0);for(const r of t)Eg(n.remoteStore,r)}else if(!1===t&&!1!==n.gu){const e=[];let t=Promise.resolve();n.Iu.forEach((r,i)=>{n.sharedClientState.isLocalQueryTarget(i)?e.push(i):t=t.then(()=>(Fy(n,i),Rm(n.localStore,i,!0))),Sg(n.remoteStore,i)}),await t,await Wy(n,e),function(e){const t=Mo(e);t.Au.forEach((e,n)=>{Sg(t.remoteStore,n)}),t.Vu.zr(),t.Au=new Map,t.Ru=new Iu(ca.comparator)}(n),n.gu=!1,await Wg(n.remoteStore,!1)}}(this.xu.syncEngine,e),this.gcScheduler&&(e&&!this.gcScheduler.started?this.gcScheduler.start():e||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(e&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():e||this.indexBackfillerScheduler.stop())})}Du(e){const t=ug();if(!Qm.v(t))throw new Vo(Fo.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=wm(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Qm(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class sv{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>Ry(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=zy.bind(null,this.syncEngine),await Wg(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new ry}createDatastore(e){const t=hg(e.databaseInfo.databaseId),n=function(e){return new cg(e)}(e.databaseInfo);return function(e,t,n,r){return new vg(e,t,n,r)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return t=this.localStore,n=this.datastore,r=e.asyncQueue,i=e=>Ry(this.syncEngine,e,0),s=Zm.v()?new Zm:new Ym,new _g(t,n,r,i,s);var t,n,r,i,s}createSyncEngine(e,t){return function(e,t,n,r,i,s,o){const a=new by(e,t,n,r,i,s);return o&&(a.gu=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(e){const t=Mo(e);No(Ig,"RemoteStore shutting down."),t.Ea.add(5),await bg(t),t.Aa.shutdown(),t.Va.set("Unknown")}(this.remoteStore),null==(e=this.datastore)||e.terminate(),null==(t=this.eventManager)||t.terminate()}}function ov(e,t=10240){let n=0;return{async read(){if(n<e.byteLength){const r={value:e.slice(n,n+t),done:!1};return n+=t,r}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}
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
 */sv.provider={build:()=>new sv};class av{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):Do("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout(()=>{this.muted||e(t)},0)}}
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
 */class cv{constructor(e,t){this.Bu=e,this.serializer=t,this.metadata=new Uo,this.buffer=new Uint8Array,this.Lu=new TextDecoder("utf-8"),this.ku().then(e=>{e&&e.Ua()?this.metadata.resolve(e.qa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null==e?void 0:e.qa)}`))},e=>this.metadata.reject(e))}close(){return this.Bu.cancel()}async getMetadata(){return this.metadata.promise}async Su(){return await this.getMetadata(),this.ku()}async ku(){const e=await this.Ku();if(null===e)return null;const t=this.Lu.decode(e),n=Number(t);isNaN(n)&&this.qu(`length string (${t}) is not valid number`);const r=await this.Uu(n);return new fy(JSON.parse(r),e.length+n)}$u(){return this.buffer.findIndex(e=>e==="{".charCodeAt(0))}async Ku(){for(;this.$u()<0&&!(await this.Wu()););if(0===this.buffer.length)return null;const e=this.$u();e<0&&this.qu("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Uu(e){for(;this.buffer.length<e;)await this.Wu()&&this.qu("Reached the end of bundle when more is expected.");const t=this.Lu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}qu(e){throw this.Bu.cancel(),new Error(`Invalid bundle format: ${e}`)}async Wu(){const e=await this.Bu.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}
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
 */class uv{constructor(e,t){this.bundleData=e,this.serializer=t,this.cursor=0,this.elements=[];let n=this.Su();if(!n||!n.Ua())throw new Error(`The first element of the bundle is not a metadata object, it is\n         ${JSON.stringify(null==n?void 0:n.qa)}`);this.metadata=n;do{n=this.Su(),null!==n&&this.elements.push(n)}while(null!==n)}getMetadata(){return this.metadata}Qu(){return this.elements}Su(){if(this.cursor===this.bundleData.length)return null;const e=this.Ku(),t=this.Uu(e);return new fy(JSON.parse(t),e)}Uu(e){if(this.cursor+e>this.bundleData.length)throw new Vo(Fo.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=e)}Ku(){const e=this.cursor;let t=this.cursor;for(;t<this.bundleData.length;){if("{"===this.bundleData[t]){if(t===e)throw new Error("First character is a bracket and not a number");return this.cursor=t,Number(this.bundleData.slice(e,t))}t++}throw new Error("Reached the end of bundle when more is expected.")}}
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
 */let lv=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new Vo(Fo.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(e,t){const n=Mo(e),r={documents:t.map(e=>Kd(n.serializer,e))},i=await n.jo("BatchGetDocuments",n.serializer.databaseId,sa.emptyPath(),r,t.length),s=new Map;i.forEach(e=>{const t=function(e,t){return"found"in t?function(e,t){Lo(!!t.found,43571),t.found.name,t.found.updateTime;const n=Hd(e,t.found.name),r=jd(t.found.updateTime),i=t.found.createTime?jd(t.found.createTime):Ta.min(),s=new vl({mapValue:{fields:t.found.fields}});return Il.newFoundDocument(n,r,i,s)}(e,t):"missing"in t?function(e,t){Lo(!!t.missing,3894),Lo(!!t.readTime,22933);const n=Hd(e,t.missing),r=jd(t.readTime);return Il.newNoDocument(n,r)}(e,t):Oo(7234,{result:t})}(n.serializer,e);s.set(t.key.toString(),t)});const o=[];return t.forEach(e=>{const t=s.get(e.toString());Lo(!!t,55234,{key:e}),o.push(t)}),o}(this.datastore,e);return t.forEach(e=>this.recordVersion(e)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new ad(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((e,t)=>{const n=ca.fromPath(t);this.mutations.push(new cd(n,this.precondition(n)))}),await async function(e,t){const n=Mo(e),r={writes:t.map(e=>ef(n.serializer,e))};await n.Wo("Commit",n.serializer.databaseId,sa.emptyPath(),r)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw Oo(50498,{Gu:e.constructor.name});t=Ta.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new Vo(Fo.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(Ta.min())?Wh.exists(!1):Wh.updateTime(t):Wh.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(Ta.min()))throw new Vo(Fo.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Wh.updateTime(t)}return Wh.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};
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
 */class hv{constructor(e,t,n,r,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=r,this.deferred=i,this.zu=n.maxAttempts,this.M_=new dg(this.asyncQueue,"transaction_retry")}ju(){this.zu-=1,this.Hu()}Hu(){this.M_.p_(async()=>{const e=new lv(this.datastore),t=this.Ju(e);t&&t.then(t=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(t)}).catch(e=>{this.Zu(e)}))}).catch(e=>{this.Zu(e)})})}Ju(e){try{const t=this.updateFunction(e);return!tc(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}Zu(e){this.zu>0&&this.Xu(e)?(this.zu-=1,this.asyncQueue.enqueueAndForget(()=>(this.Hu(),Promise.resolve()))):this.deferred.reject(e)}Xu(e){if("FirebaseError"===(null==e?void 0:e.name)){const t=e.code;return"aborted"===t||"failed-precondition"===t||"already-exists"===t||!gd(t)}return!1}}
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
 */const dv="FirestoreClient";class fv{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=r,this.user=So.UNAUTHENTICATED,this.clientId=Qo.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async e=>{No(dv,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(No(dv,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Uo;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Xg(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function pv(e,t){e.asyncQueue.verifyOperationInProgress(),No(dv,"Initializing OfflineComponentProvider");const n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await Am(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function mv(e,t){e.asyncQueue.verifyOperationInProgress();const n=await gv(e);No(dv,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>Hg(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>Hg(t.remoteStore,n)),e._onlineComponents=t}async function gv(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){No(dv,"Using user provided OfflineComponentProvider");try{await pv(e,e._uninitializedComponentsProvider._offline)}catch(n){const r=n;if(!("FirebaseError"===(t=r).name?t.code===Fo.FAILED_PRECONDITION||t.code===Fo.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code))throw r;Ro("Error using user provided cache. Falling back to memory cache: "+r),await pv(e,new tv)}}else No(dv,"Using default OfflineComponentProvider"),await pv(e,new nv(void 0));var t;return e._offlineComponents}async function yv(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(No(dv,"Using user provided OnlineComponentProvider"),await mv(e,e._uninitializedComponentsProvider._online)):(No(dv,"Using default OnlineComponentProvider"),await mv(e,new sv))),e._onlineComponents}function vv(e){return gv(e).then(e=>e.persistence)}function wv(e){return gv(e).then(e=>e.localStore)}function Iv(e){return yv(e).then(e=>e.remoteStore)}function _v(e){return yv(e).then(e=>e.syncEngine)}function Tv(e){return yv(e).then(e=>e.datastore)}async function bv(e){const t=await yv(e),n=t.eventManager;return n.onListen=Ey.bind(null,t.syncEngine),n.onUnlisten=ky.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=Sy.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=Ny.bind(null,t.syncEngine),n}function Ev(e,t,n={}){const r=new Uo;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new av({next:a=>{s.Nu(),t.enqueueAndForget(()=>oy(e,o));const c=a.docs.has(n);!c&&a.fromCache?i.reject(new Vo(Fo.UNAVAILABLE,"Failed to get document because the client is offline.")):c&&a.fromCache&&r&&"server"===r.source?i.reject(new Vo(Fo.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):i.resolve(a)},error:e=>i.reject(e)}),o=new dy(th(n.path),s,{includeMetadataChanges:!0,Ka:!0});return sy(e,o)}(await bv(e),e.asyncQueue,t,n,r)),r.promise}function Sv(e,t,n={}){const r=new Uo;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,i){const s=new av({next:n=>{s.Nu(),t.enqueueAndForget(()=>oy(e,o)),n.fromCache&&"server"===r.source?i.reject(new Vo(Fo.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(n)},error:e=>i.reject(e)}),o=new dy(n,s,{includeMetadataChanges:!0,Ka:!0});return sy(e,o)}(await bv(e),e.asyncQueue,t,n,r)),r.promise}function Av(e,t){const n=new Uo;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){const r=ev(e);try{const e=await function(e,t){const n=Mo(e),r=_a.now(),i=t.reduce((e,t)=>e.add(t.key),kh());let s,o;return n.persistence.runTransaction("Locally write mutations","readwrite",e=>{let a=wh(),c=kh();return n.xs.getEntries(e,i).next(e=>{a=e,a.forEach((e,t)=>{t.isValidDocument()||(c=c.add(e))})}).next(()=>n.localDocuments.getOverlayedDocuments(e,a)).next(i=>{s=i;const o=[];for(const e of t){const t=ed(e,s.get(e.key).overlayedDocument);null!=t&&o.push(new rd(e.key,t,wl(t.value.mapValue),Wh.exists(!0)))}return n.mutationQueue.addMutationBatch(e,r,o,t)}).next(t=>{o=t;const r=t.applyToLocalDocumentSet(s,c);return n.documentOverlayCache.saveOverlays(e,t.batchId,r)})}).then(()=>({batchId:o.batchId,changes:Th(s)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(e.batchId),function(e,t,n){let r=e.du[e.currentUser.toKey()];r||(r=new Iu(Jo)),r=r.insert(t,n),e.du[e.currentUser.toKey()]=r}(r,e.batchId,n),await jy(r,e.changes),await Vg(r.remoteStore)}catch(i){const e=Xg(i,"Failed to persist write");n.reject(e)}}(await _v(e),t,n)),n.promise}function Cv(e,t,n,r){const i=function(e,t){let n;return n="string"==typeof e?wd().encode(e):e,r=function(e,t){if(e instanceof Uint8Array)return ov(e,t);if(e instanceof ArrayBuffer)return ov(new Uint8Array(e),t);if(e instanceof ReadableStream)return e.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(n),new cv(r,t);var r}(n,hg(t));e.asyncQueue.enqueueAndForget(async()=>{!function(e,t,n){const r=Mo(e);(async function(e,t,n){try{const i=await t.getMetadata();if(await function(e,t){const n=Mo(e),r=jd(t.createTime);return n.persistence.runTransaction("hasNewerBundle","readonly",e=>n.Pi.getBundleMetadata(e,t.id)).then(e=>!!e&&e.createTime.compareTo(r)>=0)}(e.localStore,i))return await t.close(),n._completeWith({taskState:"Success",documentsLoaded:(r=i).totalDocuments,bytesLoaded:r.totalBytes,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}),Promise.resolve(new Set);n._updateProgress(gy(i));const s=new my(i,t.serializer);let o=await t.Su();for(;o;){const e=await s.Ga(o);e&&n._updateProgress(e),o=await t.Su()}const a=await s.ja(e.localStore);return await jy(e,a.Ja,void 0),await function(e,t){const n=Mo(e);return n.persistence.runTransaction("Save bundle","readwrite",e=>n.Pi.saveBundleMetadata(e,t))}(e.localStore,i),n._completeWith(a.progress),Promise.resolve(a.Ha)}catch(r){return Ro(Iy,`Loading bundle failed with ${r}`),n._failWith(r),Promise.resolve(new Set)}var r})(r,t,n).then(e=>{r.sharedClientState.notifyBundleLoaded(e)})}(await _v(e),i,r)})}function kv(e,t){return new uv(e,t)}
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
function Nv(e){const t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t
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
 */}const Dv=new Map;
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
const Rv="firestore.googleapis.com",Pv=!0;class Ov{constructor(e){if(void 0===e.host){if(void 0!==e.ssl)throw new Vo(Fo.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Rv,this.ssl=Pv}else this.host=e.host,this.ssl=e.ssl??Pv;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=gp;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<Rp)throw new Vo(Fo.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}la("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Nv(e.experimentalLongPollingOptions??{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new Vo(Fo.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new Vo(Fo.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new Vo(Fo.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams;var t,n}}class xv{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ov({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Vo(Fo.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new Vo(Fo.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ov(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new Bo;switch(e.type){case"firstParty":return new $o(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new Vo(Fo.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const t=Dv.get(e);t&&(No("ComponentProvider","Removing Datastore"),Dv.delete(e),t.terminate())}(this),Promise.resolve()}}function Lv(e,t,n,r={}){var s;e=ma(e,xv);const o=d(t),a=e._getSettings(),c={...a,emulatorOptions:e._getEmulatorOptions()},u=`${t}:${n}`;o&&(f(`https://${u}`),g("Firestore",!0)),a.host!==Rv&&a.host!==u&&Ro("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const l={...a,host:u,ssl:o,emulatorOptions:r};if(!S(l,c)&&(e._setSettings(l),r.mockUserToken)){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=So.MOCK_USER;else{t=function(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",r=e.iat||0,s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...e};return[i(JSON.stringify({alg:"none",type:"JWT"})),i(JSON.stringify(o)),""].join(".")}(r.mockUserToken,null==(s=e._app)?void 0:s.options.projectId);const o=r.mockUserToken.sub||r.mockUserToken.user_id;if(!o)throw new Vo(Fo.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new So(o)}e._authCredentials=new jo(new qo(t,n))}}
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
 */class Mv{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Mv(this.firestore,e,this._query)}}class Fv{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Vv(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Fv(this.firestore,e,this._key)}toJSON(){return{type:Fv._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(va(t,Fv._jsonSchema))return new Fv(e,n||null,new ca(sa.fromString(t.referencePath)))}}Fv._jsonSchemaVersion="firestore/documentReference/1.0",Fv._jsonSchema={type:ya("string",Fv._jsonSchemaVersion),referencePath:ya("string")};class Vv extends Mv{constructor(e,t,n){super(e,t,th(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Fv(this.firestore,null,new ca(e))}withConverter(e){return new Vv(this.firestore,e,this._path)}}function Uv(e,t,...n){if(e=P(e),ua("collection","path",t),e instanceof xv){const r=sa.fromString(t,...n);return da(r),new Vv(e,null,r)}{if(!(e instanceof Fv||e instanceof Vv))throw new Vo(Fo.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(sa.fromString(t,...n));return da(r),new Vv(e.firestore,null,r)}}function qv(e,t,...n){if(e=P(e),1===arguments.length&&(t=Qo.newId()),ua("doc","path",t),e instanceof xv){const r=sa.fromString(t,...n);return ha(r),new Fv(e,null,new ca(r))}{if(!(e instanceof Fv||e instanceof Vv))throw new Vo(Fo.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(sa.fromString(t,...n));return ha(r),new Fv(e.firestore,e instanceof Vv?e.converter:null,new ca(r))}}function Bv(e,t){return e=P(e),t=P(t),e instanceof Mv&&t instanceof Mv&&e.firestore===t.firestore&&lh(e._query,t._query)&&e.converter===t.converter
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
 */}const jv="AsyncQueue";class zv{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new dg(this,"async_queue_retry"),this._c=()=>{const e=lg();e&&No(jv,"Visibility state changed to "+e.visibilityState),this.M_.w_()},this.ac=e;const t=lg();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=lg();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new Uo;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Yu.push(e),this.lc()))}async lc(){if(0!==this.Yu.length){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!$a(e))throw e;No(jv,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(e=>{throw this.nc=e,this.rc=!1,Do("INTERNAL UNHANDLED ERROR: ",Gv(e)),e}).then(e=>(this.rc=!1,e))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const r=Yg.createAndSchedule(this,e,t,n,e=>this.hc(e));return this.tc.push(r),r}uc(){this.nc&&Oo(47125,{Pc:Gv(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do{e=this.ac,await e}while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((e,t)=>e.targetTimeMs-t.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.Tc()})}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Gv(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t
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
 */}class $v{constructor(){this._progressObserver={},this._taskCompletionResolver=new Uo,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}
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
 */class Kv extends xv{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new zv,this._persistenceKey=(null==r?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new zv(e),this._firestoreClient=void 0,await e}}}function Hv(e,t){const n="object"==typeof e?e:Qe(),r="string"==typeof e?e:t||Bu,i=ze(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const e=(e=>{const t=c(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),r]:[t.substring(0,n),r]})("firestore");e&&Lv(i,...e)}return i}function Wv(e){if(e._terminated)throw new Vo(Fo.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||Qv(e),e._firestoreClient}function Qv(e){var t,n,r,i;const s=e._freezeSettings(),o=function(e,t,n,r,i){return new qu(e,t,n,i.host,i.ssl,i.experimentalForceLongPolling,i.experimentalAutoDetectLongPolling,Nv(i.experimentalLongPollingOptions),i.useFetchStreams,i.isUsingEmulator,r)}(e._databaseId,(null==(t=e._app)?void 0:t.options.appId)||"",e._persistenceKey,null==(n=e._app)?void 0:n.options.apiKey,s);e._componentsProvider||(null==(r=s.localCache)?void 0:r._offlineComponentProvider)&&(null==(i=s.localCache)?void 0:i._onlineComponentProvider)&&(e._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),e._firestoreClient=new fv(e._authCredentials,e._appCheckCredentials,e._queue,o,e._componentsProvider&&function(e){const t=null==e?void 0:e._online.build();return{_offline:null==e?void 0:e._offline.build(t),_online:t}}(e._componentsProvider))}function Jv(e,t){Ro("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const n=e._freezeSettings();return Yv(e,sv.provider,{build:e=>new rv(e,n.cacheSizeBytes,null==t?void 0:t.forceOwnership)}),Promise.resolve()}function Yv(e,t,n){if((e=ma(e,Kv))._firestoreClient||e._terminated)throw new Vo(Fo.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(e._componentsProvider||e._getSettings().localCache)throw new Vo(Fo.FAILED_PRECONDITION,"SDK cache is already specified.");e._componentsProvider={_online:t,_offline:n},Qv(e)}function Xv(e,t){const n=Wv(e=ma(e,Kv)),r=new $v;return Cv(n,e._databaseId,t,r),r}function Zv(e,t){return function(e,t){return e.asyncQueue.enqueue(async()=>function(e,t){const n=Mo(e);return n.persistence.runTransaction("Get named query","readonly",e=>n.Pi.getNamedQuery(e,t))}(await wv(e),t))}(Wv(e=ma(e,Kv)),t).then(t=>t?new Mv(e,null,t.query):null)}
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
 */class ew{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ew(ku.fromBase64String(e))}catch(t){throw new Vo(Fo.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ew(ku.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:ew._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(va(e,ew._jsonSchema))return ew.fromBase64String(e.bytes)}}ew._jsonSchemaVersion="firestore/bytes/1.0",ew._jsonSchema={type:ya("string",ew._jsonSchemaVersion),bytes:ya("string")};
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
class tw{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new Vo(Fo.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new aa(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}
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
class nw{constructor(e){this._methodName=e}}
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
 */class rw{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Vo(Fo.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Vo(Fo.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Jo(this._lat,e._lat)||Jo(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:rw._jsonSchemaVersion}}static fromJSON(e){if(va(e,rw._jsonSchema))return new rw(e.latitude,e.longitude)}}rw._jsonSchemaVersion="firestore/geoPoint/1.0",rw._jsonSchema={type:ya("string",rw._jsonSchemaVersion),latitude:ya("number"),longitude:ya("number")};
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
class iw{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:iw._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(va(e,iw._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(e=>"number"==typeof e))return new iw(e.vectorValues);throw new Vo(Fo.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}iw._jsonSchemaVersion="firestore/vectorValue/1.0",iw._jsonSchema={type:ya("string",iw._jsonSchemaVersion),vectorValues:ya("object")};
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
const sw=/^__.*__$/;class ow{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new rd(e,this.data,this.fieldMask,t,this.fieldTransforms):new nd(e,this.data,t,this.fieldTransforms)}}class aw{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new rd(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function cw(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Oo(40011,{dataSource:e})}}class uw{constructor(e,t,n,r,i,s){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new uw({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var t;const n=null==(t=this.path)?void 0:t.child(e),r=this.contextWith({path:n,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){var t;const n=null==(t=this.path)?void 0:t.child(e),r=this.contextWith({path:n,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Nw(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(0===e.length)throw this.createError("Document fields must not be empty");if(cw(this.dataSource)&&sw.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class lw{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||hg(e)}createContext(e,t,n,r=!1){return new uw({dataSource:e,methodName:t,targetDoc:n,path:aa.emptyPath(),arrayElement:!1,hasConverter:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function hw(e){const t=e._freezeSettings(),n=hg(e._databaseId);return new lw(e._databaseId,!!t.ignoreUndefinedProperties,n)}function dw(e,t,n,r,i,s={}){const o=e.createContext(s.merge||s.mergeFields?2:0,t,n,i);Sw("Data must be an object, but it was:",o,r);const a=bw(r,o);let c,u;if(s.merge)c=new Au(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const e=[];for(const r of s.mergeFields){const i=Aw(t,r,n);if(!o.contains(i))throw new Vo(Fo.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);Dw(e,i)||e.push(i)}c=new Au(e),u=o.fieldTransforms.filter(e=>c.covers(e.field))}else c=null,u=o.fieldTransforms;return new ow(new vl(a),c,u)}class fw extends nw{_toFieldTransform(e){if(2!==e.dataSource)throw 1===e.dataSource?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof fw}}function pw(e,t,n){return new uw({dataSource:3,targetDoc:t.settings.targetDoc,methodName:e._methodName,arrayElement:n},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class mw extends nw{_toFieldTransform(e){return new Kh(e.path,new Vh)}isEqual(e){return e instanceof mw}}class gw extends nw{constructor(e,t){super(e),this.Ac=t}_toFieldTransform(e){const t=pw(this,e,!0),n=this.Ac.map(e=>Tw(e,t)),r=new Uh(n);return new Kh(e.path,r)}isEqual(e){return e instanceof gw&&S(this.Ac,e.Ac)}}class yw extends nw{constructor(e,t){super(e),this.Ac=t}_toFieldTransform(e){const t=pw(this,e,!0),n=this.Ac.map(e=>Tw(e,t)),r=new Bh(n);return new Kh(e.path,r)}isEqual(e){return e instanceof yw&&S(this.Ac,e.Ac)}}class vw extends nw{constructor(e,t){super(e),this.Vc=t}_toFieldTransform(e){const t=new zh(e.serializer,Oh(e.serializer,this.Vc));return new Kh(e.path,t)}isEqual(e){return e instanceof vw&&this.Vc===e.Vc}}function ww(e,t,n,r){const i=e.createContext(1,t,n);Sw("Data must be an object, but it was:",i,r);const s=[],o=vl.empty();yu(r,(e,r)=>{const a=kw(t,e,n);r=P(r);const c=i.childContextForFieldPath(a);if(r instanceof fw)s.push(a);else{const e=Tw(r,c);null!=e&&(s.push(a),o.set(a,e))}});const a=new Au(s);return new aw(o,a,i.fieldTransforms)}function Iw(e,t,n,r,i,s){const o=e.createContext(1,t,n),a=[Aw(t,r,n)],c=[i];if(s.length%2!=0)throw new Vo(Fo.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<s.length;d+=2)a.push(Aw(t,s[d])),c.push(s[d+1]);const u=[],l=vl.empty();for(let d=a.length-1;d>=0;--d)if(!Dw(u,a[d])){const e=a[d];let t=c[d];t=P(t);const n=o.childContextForFieldPath(e);if(t instanceof fw)u.push(e);else{const r=Tw(t,n);null!=r&&(u.push(e),l.set(e,r))}}const h=new Au(u);return new aw(l,h,o.fieldTransforms)}function _w(e,t,n,r=!1){return Tw(n,e.createContext(r?4:3,t))}function Tw(e,t){if(Ew(e=P(e)))return Sw("Unsupported field value:",t,e),bw(e,t);if(e instanceof nw)return function(e,t){if(!cw(t.dataSource))throw t.createError(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.createError(`${e._methodName}() is not currently supported inside arrays`);const n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.arrayElement&&4!==t.dataSource)throw t.createError("Nested arrays are not supported");return function(e,t){const n=[];let r=0;for(const i of e){let e=Tw(i,t.childContextForArray(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if(null===(e=P(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return Oh(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){const n=_a.fromDate(e);return{timestampValue:Ud(t.serializer,n)}}if(e instanceof _a){const n=new _a(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:Ud(t.serializer,n)}}if(e instanceof rw)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof ew)return{bytesValue:qd(t.serializer,e._byteString)};if(e instanceof Fv){const n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.createError(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:zd(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof iw)return function(e,t){const n=e instanceof iw?e.toArray():e;return{mapValue:{fields:{[zu]:{stringValue:Ku},[Hu]:{arrayValue:{values:n.map(e=>{if("number"!=typeof e)throw t.createError("VectorValues must only contain numeric values.");return Rh(t.serializer,e)})}}}}}}(e,t);if(gf(e))return e._toProto(t.serializer);throw t.createError(`Unsupported field value: ${pa(e)}`)}(e,t)}function bw(e,t){const n={};return wu(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):yu(e,(e,r)=>{const i=Tw(r,t.childContextForField(e));null!=i&&(n[e]=i)}),{mapValue:{fields:n}}}function Ew(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof _a||e instanceof rw||e instanceof ew||e instanceof Fv||e instanceof nw||e instanceof iw||gf(e))}function Sw(e,t,n){if(!Ew(n)||!fa(n)){const r=pa(n);throw"an object"===r?t.createError(e+" a custom object"):t.createError(e+" "+r)}}function Aw(e,t,n){if((t=P(t))instanceof tw)return t._internalPath;if("string"==typeof t)return kw(e,t);throw Nw("Field path arguments must be of type string or ",e,!1,void 0,n)}const Cw=new RegExp("[~\\*/\\[\\]]");function kw(e,t,n){if(t.search(Cw)>=0)throw Nw(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new tw(...t.split("."))._internalPath}catch(r){throw Nw(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function Nw(e,t,n,r,i){const s=r&&!r.isEmpty(),o=void 0!==i;let a=`Function ${t}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${r}`),o&&(c+=` in document ${i}`),c+=")"),new Vo(Fo.INVALID_ARGUMENT,a+e+c)}function Dw(e,t){return e.some(e=>e.isEqual(t))}
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
 */class Rw{convertValue(e,t="none"){switch(Qu(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ru(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Pu(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Oo(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return yu(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){var t,n,r;const i=null==(r=null==(n=null==(t=e.fields)?void 0:t[Hu].arrayValue)?void 0:n.values)?void 0:r.map(e=>Ru(e.doubleValue));return new iw(i)}convertGeoPoint(e){return new rw(Ru(e.latitude),Ru(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Vu(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Uu(e));default:return null}}convertTimestamp(e){const t=Du(e);return new _a(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=sa.fromString(e);Lo(mf(n),9688,{name:e});const r=new ju(n.get(1),n.get(3)),i=new ca(n.popFirst(5));return r.isEqual(t)||Do(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}
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
 */class Pw extends Rw{constructor(e){super(),this.firestore=e}convertBytes(e){return new ew(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Fv(this.firestore,null,t)}}
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
 */function Ow(){return new fw("deleteField")}function xw(){return new mw("serverTimestamp")}function Lw(...e){return new gw("arrayUnion",e)}const Mw="@firebase/firestore",Fw="4.11.0";
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
 */function Vw(e){return function(e,t){if("object"!=typeof e||null===e)return!1;const n=e;for(const r of t)if(r in n&&"function"==typeof n[r])return!0;return!1}(e,["next","error","complete"])}
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
 */class Uw{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class qw{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}_fieldsProto(){return new vl({mapValue:{fields:this._data}}).clone().value.mapValue.fields}}
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
 */class Bw{constructor(e,t,n,r,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Fv(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const e=new jw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return(null==(e=this._document)?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Aw("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class jw extends Bw{data(){return super.data()}}
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
 */function zw(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new Vo(Fo.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Gw{}class $w extends Gw{}function Kw(e,t,...n){let r=[];t instanceof Gw&&r.push(t),r=r.concat(n),function(e){const t=e.filter(e=>e instanceof Qw).length,n=e.filter(e=>e instanceof Hw).length;if(t>1||t>0&&n>0)throw new Vo(Fo.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)e=i._apply(e);return e}class Hw extends $w{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new Hw(e,t,n)}_apply(e){const t=this._parse(e);return sI(e._query,t),new Mv(e.firestore,e.converter,ch(e._query,t))}_parse(e){const t=hw(e.firestore);return function(e,t,n,r,i,s,o){let a;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new Vo(Fo.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){iI(o,s);const t=[];for(const n of o)t.push(rI(r,e,n));a={arrayValue:{values:t}}}else a=rI(r,e,o)}else"in"!==s&&"not-in"!==s&&"array-contains-any"!==s||iI(o,s),a=_w(n,t,o,"in"===s||"not-in"===s);return Cl.create(i,s,a)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Ww(e,t,n){const r=t,i=Aw("where",e);return Hw._create(i,r,n)}class Qw extends Gw{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Qw(e,t)}_parse(e){const t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:kl.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;const r=t.getFlattenedFilters();for(const i of r)sI(n,i),n=ch(n,i)}(e._query,t),new Mv(e.firestore,e.converter,ch(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class Jw extends $w{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Jw(e,t)}_apply(e){const t=function(e,t,n){if(null!==e.startAt)throw new Vo(Fo.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new Vo(Fo.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new El(t,n)}(e._query,this._field,this._direction);return new Mv(e.firestore,e.converter,function(e,t){const n=e.explicitOrderBy.concat([t]);return new Zl(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function Yw(e,t="asc"){const n=t,r=Aw("orderBy",e);return Jw._create(r,n)}class Xw extends $w{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Xw(e,t,n)}_apply(e){return new Mv(e.firestore,e.converter,uh(e._query,this._limit,this._limitType))}}function Zw(e){return ga("limit",e),Xw._create("limit",e,"F")}class eI extends $w{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new eI(e,t,n)}_apply(e){const t=nI(e,this.type,this._docOrFields,this._inclusive);return new Mv(e.firestore,e.converter,function(e,t){return new Zl(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),e.limit,e.limitType,t,e.endAt)}(e._query,t))}}class tI extends $w{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new tI(e,t,n)}_apply(e){const t=nI(e,this.type,this._docOrFields,this._inclusive);return new Mv(e.firestore,e.converter,function(e,t){return new Zl(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),e.limit,e.limitType,e.startAt,t)}(e._query,t))}}function nI(e,t,n,r){if(n[0]=P(n[0]),n[0]instanceof Bw)return function(e,t,n,r,i){if(!r)throw new Vo(Fo.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${n}().`);const s=[];for(const o of ih(e))if(o.field.isKeyField())s.push(il(t,r.key));else{const e=r.data.field(o.field);if(Fu(e))throw new Vo(Fo.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+o.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(null===e){const e=o.field.canonicalString();throw new Vo(Fo.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`)}s.push(e)}return new _l(s,i)}(e._query,e.firestore._databaseId,t,n[0]._document,r);{const i=hw(e.firestore);return function(e,t,n,r,i,s){const o=e.explicitOrderBy;if(i.length>o.length)throw new Vo(Fo.INVALID_ARGUMENT,`Too many arguments provided to ${r}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const a=[];for(let c=0;c<i.length;c++){const s=i[c];if(o[c].field.isKeyField()){if("string"!=typeof s)throw new Vo(Fo.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${r}(), but got a ${typeof s}`);if(!rh(e)&&-1!==s.indexOf("/"))throw new Vo(Fo.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${r}() must be a plain document ID, but '${s}' contains a slash.`);const n=e.path.child(sa.fromString(s));if(!ca.isDocumentKey(n))throw new Vo(Fo.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${r}() must result in a valid document path, but '${n}' is not because it contains an odd number of segments.`);const i=new ca(n);a.push(il(t,i))}else{const e=_w(n,r,s);a.push(e)}}return new _l(a,s)}(e._query,e.firestore._databaseId,i,t,n,r)}}function rI(e,t,n){if("string"==typeof(n=P(n))){if(""===n)throw new Vo(Fo.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!rh(t)&&-1!==n.indexOf("/"))throw new Vo(Fo.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=t.path.child(sa.fromString(n));if(!ca.isDocumentKey(r))throw new Vo(Fo.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return il(e,new ca(r))}if(n instanceof Fv)return il(e,n._key);throw new Vo(Fo.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${pa(n)}.`)}function iI(e,t){if(!Array.isArray(e)||0===e.length)throw new Vo(Fo.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function sI(e,t){const n=function(e,t){for(const n of e)for(const e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new Vo(Fo.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new Vo(Fo.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}function oI(e,t){if(!(t instanceof Hw||t instanceof Qw))throw new Vo(Fo.INVALID_ARGUMENT,`Function ${e}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}function aI(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}class cI extends Rw{constructor(e){super(),this.firestore=e}convertBytes(e){return new ew(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Fv(this.firestore,null,t)}}
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
 */function uI(){return new Uw("count")}function lI(e,t){const n=ma(e.firestore,Kv),r=Wv(n),i=vu(t,(e,t)=>new dd(t,e.aggregateType,e._internalFieldPath));return function(e,t,n){const r=new Uo;return e.asyncQueue.enqueueAndForget(async()=>{try{const i=await Tv(e);r.resolve(async function(e,t,n){var r;const i=Mo(e),{request:s,gt:o,parent:a}=sf(i.serializer,oh(t),n);i.connection.Ko||delete s.parent;const c=(await i.jo("RunAggregationQuery",i.serializer.databaseId,a,s,1)).filter(e=>!!e.result);Lo(1===c.length,64727);const u=null==(r=c[0].result)?void 0:r.aggregateFields;return Object.keys(u).reduce((e,t)=>(e[o[t]]=u[t],e),{})}(i,t,n))}catch(i){r.reject(i)}}),r.promise}(r,e._query,i).then(t=>function(e,t,n){const r=new Pw(e);return new qw(t,r,n)}(n,e,t))}class hI{constructor(e){this.kind="memory",this._onlineComponentProvider=sv.provider,this._offlineComponentProvider=(null==e?void 0:e.garbageCollector)?e.garbageCollector._offlineComponentProvider:{build:()=>new nv(void 0)}}toJSON(){return{kind:this.kind}}}class dI{constructor(e){let t;this.kind="persistent",(null==e?void 0:e.tabManager)?(e.tabManager._initialize(e),t=e.tabManager):(t=yI(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class fI{constructor(){this.kind="memoryEager",this._offlineComponentProvider=tv.provider}toJSON(){return{kind:this.kind}}}class pI{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new nv(e)}}toJSON(){return{kind:this.kind}}}class mI{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=sv.provider,this._offlineComponentProvider={build:t=>new rv(t,null==e?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class gI{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=sv.provider,this._offlineComponentProvider={build:t=>new iv(t,null==e?void 0:e.cacheSizeBytes)}}}function yI(e){return new mI(null==e?void 0:e.forceOwnership)}
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
const vI="NOT SUPPORTED";class wI{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class II extends Bw{constructor(e,t,n,r,i,s){super(e,t,n,r,s),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new _I(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Aw("DocumentSnapshot.get",e));if(null!==n)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new Vo(Fo.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=II._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),e&&e.isValidDocument()&&e.isFoundDocument()?(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t):t}}II._jsonSchemaVersion="firestore/documentSnapshot/1.0",II._jsonSchema={type:ya("string",II._jsonSchemaVersion),bundleSource:ya("string","DocumentSnapshot"),bundleName:ya("string"),bundle:ya("string")};class _I extends II{data(e={}){return super.data(e)}}class TI{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new wI(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new _I(this._firestore,this._userDataWriter,n.key,n,new wI(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new Vo(Fo.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(n=>{const r=new _I(e._firestore,e._userDataWriter,n.doc.key,n.doc,new wI(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:t++}})}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{const r=new _I(e._firestore,e._userDataWriter,t.doc.key,t.doc,new wI(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter);let i=-1,s=-1;return 0!==t.type&&(i=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),1!==t.type&&(n=n.add(t.doc),s=n.indexOf(t.doc.key)),{type:bI(t.type),doc:r,oldIndex:i,newIndex:s}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new Vo(Fo.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=TI._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Qo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],r=[];return this.docs.forEach(e=>{null!==e._document&&(t.push(e._document),n.push(this._userDataWriter.convertObjectMap(e._document.data.value.mapValue.fields,"previous")),r.push(e.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function bI(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Oo(61501,{type:e})}}
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
TI._jsonSchemaVersion="firestore/querySnapshot/1.0",TI._jsonSchema={type:ya("string",TI._jsonSchemaVersion),bundleSource:ya("string","QuerySnapshot"),bundleName:ya("string"),bundle:ya("string")};const EI={maxAttempts:5};
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
 */class SI{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=hw(e)}set(e,t,n){this._verifyNotCommitted();const r=AI(e,this._firestore),i=aI(r.converter,t,n),s=dw(this._dataReader,"WriteBatch.set",r._key,i,null!==r.converter,n);return this._mutations.push(s.toMutation(r._key,Wh.none())),this}update(e,t,n,...r){this._verifyNotCommitted();const i=AI(e,this._firestore);let s;return s="string"==typeof(t=P(t))||t instanceof tw?Iw(this._dataReader,"WriteBatch.update",i._key,t,n,r):ww(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(s.toMutation(i._key,Wh.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=AI(e,this._firestore);return this._mutations=this._mutations.concat(new ad(t._key,Wh.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new Vo(Fo.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function AI(e,t){if((e=P(e)).firestore!==t)throw new Vo(Fo.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}
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
 */class CI{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=hw(e)}get(e){const t=AI(e,this._firestore),n=new cI(this._firestore);return this._transaction.lookup([t._key]).then(e=>{if(!e||1!==e.length)return Oo(24041);const r=e[0];if(r.isFoundDocument())return new Bw(this._firestore,n,r.key,r,t.converter);if(r.isNoDocument())return new Bw(this._firestore,n,t._key,null,t.converter);throw Oo(18433,{doc:r})})}set(e,t,n){const r=AI(e,this._firestore),i=aI(r.converter,t,n),s=dw(this._dataReader,"Transaction.set",r._key,i,null!==r.converter,n);return this._transaction.set(r._key,s),this}update(e,t,n,...r){const i=AI(e,this._firestore);let s;return s="string"==typeof(t=P(t))||t instanceof tw?Iw(this._dataReader,"Transaction.update",i._key,t,n,r):ww(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,s),this}delete(e){const t=AI(e,this._firestore);return this._transaction.delete(t._key),this}}
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
 */class kI extends CI{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=AI(e,this._firestore),n=new Pw(this._firestore);return super.get(e).then(e=>new II(this._firestore,n,t._key,e._document,new wI(!1,!1),t.converter))}}function NI(e,t,n){e=ma(e,Kv);const r={...EI,...n};!function(e){if(e.maxAttempts<1)throw new Vo(Fo.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r);return function(e,t,n){const r=new Uo;return e.asyncQueue.enqueueAndForget(async()=>{const i=await Tv(e);new hv(e.asyncQueue,i,n,t,r).ju()}),r.promise}(Wv(e),n=>t(new kI(e,n)),r)}
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
 */function DI(e){e=ma(e,Fv);const t=ma(e.firestore,Kv);return Ev(Wv(t),e._key).then(n=>FI(t,e,n))}function RI(e){e=ma(e,Mv);const t=ma(e.firestore,Kv),n=Wv(t),r=new Pw(t);return zw(e._query),Sv(n,e._query).then(n=>new TI(t,r,e,n))}function PI(e,t,n){e=ma(e,Fv);const r=ma(e.firestore,Kv),i=aI(e.converter,t,n);return MI(r,[dw(hw(r),"setDoc",e._key,i,null!==e.converter,n).toMutation(e._key,Wh.none())])}function OI(e,t,n,...r){e=ma(e,Fv);const i=ma(e.firestore,Kv),s=hw(i);let o;return o="string"==typeof(t=P(t))||t instanceof tw?Iw(s,"updateDoc",e._key,t,n,r):ww(s,"updateDoc",e._key,t),MI(i,[o.toMutation(e._key,Wh.exists(!0))])}function xI(e){return MI(ma(e.firestore,Kv),[new ad(e._key,Wh.none())])}function LI(e,...t){var n,r,i;e=P(e);let s={includeMetadataChanges:!1,source:"default"},o=0;"object"!=typeof t[o]||Vw(t[o])||(s=t[o++]);const a={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(Vw(t[o])){const e=t[o];t[o]=null==(n=e.next)?void 0:n.bind(e),t[o+1]=null==(r=e.error)?void 0:r.bind(e),t[o+2]=null==(i=e.complete)?void 0:i.bind(e)}let c,u,l;if(e instanceof Fv)u=ma(e.firestore,Kv),l=th(e._key.path),c={next:n=>{t[o]&&t[o](FI(u,e,n))},error:t[o+1],complete:t[o+2]};else{const n=ma(e,Mv);u=ma(n.firestore,Kv),l=n._query;const r=new Pw(u);c={next:e=>{t[o]&&t[o](new TI(u,r,n,e))},error:t[o+1],complete:t[o+2]},zw(e._query)}return function(e,t,n,r){const i=new av(r),s=new dy(t,i,n);return e.asyncQueue.enqueueAndForget(async()=>sy(await bv(e),s)),()=>{i.Nu(),e.asyncQueue.enqueueAndForget(async()=>oy(await bv(e),s))}}(Wv(u),l,a,c)}function MI(e,t){return Av(Wv(e),t)}function FI(e,t,n){const r=n.docs.get(t._key),i=new Pw(e);return new II(e,i,t._key,r,new wI(n.hasPendingWrites,n.fromCache),t.converter)}function VI(e){return Wv(e=ma(e,Kv)),new SI(e,t=>MI(e,t))
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
 */}function UI(e,t){if("string"!=typeof e[t])throw new Vo(Fo.INVALID_ARGUMENT,"Missing string value for: "+t);return e[t]}
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
 */class qI{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function BI(e,t){(function(e,t){return e.asyncQueue.enqueue(async()=>{return n=await wv(e),r=t,void(Mo(n).Cs.As=r);var n,r})})(Wv(e._firestore),t).then(e=>No(`setting persistent cache index auto creation isEnabled=${t} succeeded`)).catch(e=>Ro(`setting persistent cache index auto creation isEnabled=${t} failed`,e))}const jI=new WeakMap;
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
 */class zI{constructor(){this.i=new Map}static get instance(){return GI||(GI=new zI,function(e){if(vd)throw new Error("a TestingHooksSpi instance is already set");vd=e}(GI)),GI}u(e){this.i.forEach(t=>t(e))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.i;return n.set(t,e),()=>n.delete(t)}}let GI=null;!function(e,t=!0){Ao=He,je(new O("firestore",(e,{instanceIdentifier:n,options:r})=>{const i=e.getProvider("app").getImmediate(),s=new Kv(new zo(e.getProvider("auth-internal")),new Ho(i,e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new Vo(Fo.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ju(e.options.projectId,t)}(i,n),i);return r={useFetchStreams:t,...r},s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),Xe(Mw,Fw,e),Xe(Mw,Fw,"esm2020")}();const $I=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Rw,AggregateField:Uw,AggregateQuerySnapshot:qw,Bytes:ew,CACHE_SIZE_UNLIMITED:-1,CollectionReference:Vv,DocumentReference:Fv,DocumentSnapshot:II,FieldPath:tw,FieldValue:nw,Firestore:Kv,FirestoreError:Vo,GeoPoint:rw,LoadBundleTask:$v,PersistentCacheIndexManager:qI,Query:Mv,QueryCompositeFilterConstraint:Qw,QueryConstraint:$w,QueryDocumentSnapshot:_I,QueryEndAtConstraint:tI,QueryFieldFilterConstraint:Hw,QueryLimitConstraint:Xw,QueryOrderByConstraint:Jw,QuerySnapshot:TI,QueryStartAtConstraint:eI,SnapshotMetadata:wI,Timestamp:_a,Transaction:kI,VectorValue:iw,WriteBatch:SI,_AutoId:Qo,_ByteString:ku,_DatabaseId:ju,_DocumentKey:ca,_EmptyAppCheckTokenProvider:class{getToken(){return Promise.resolve(new Ko(""))}invalidateToken(){}start(e,t){}shutdown(){}},_EmptyAuthCredentialsProvider:Bo,_FieldPath:aa,_TestingHooks:class{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return zI.instance.onExistenceFilterMismatch(e)}},_cast:ma,_debugAssert:function(e,t){e||Oo(57014,t)},_internalAggregationQueryToProtoRunAggregationQueryRequest:function(e,t){var n;const r=vu(t,(e,t)=>new dd(t,e.aggregateType,e._internalFieldPath)),i=null==(n=Wv(ma(e.firestore,Kv))._onlineComponents)?void 0:n.datastore.serializer;return void 0===i?null:sf(i,oh(e._query),r,!0).request},_internalQueryToProtoQueryTarget:
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
function(e){var t;const n=null==(t=Wv(ma(e.firestore,Kv))._onlineComponents)?void 0:t.datastore.serializer;return void 0===n?null:rf(n,sh(e._query)).ft},_isBase64Available:function(){return"undefined"!=typeof atob},_logWarn:Ro,_validateIsNotUsedTogether:la,addDoc:function(e,t){const n=ma(e.firestore,Kv),r=qv(e),i=aI(e.converter,t);return MI(n,[dw(hw(e.firestore),"addDoc",r._key,i,null!==e.converter,{}).toMutation(r._key,Wh.exists(!1))]).then(()=>r)},aggregateFieldEqual:function(e,t){var n,r;return e instanceof Uw&&t instanceof Uw&&e.aggregateType===t.aggregateType&&(null==(n=e._internalFieldPath)?void 0:n.canonicalString())===(null==(r=t._internalFieldPath)?void 0:r.canonicalString())},aggregateQuerySnapshotEqual:function(e,t){return Bv(e.query,t.query)&&S(e.data(),t.data())}
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
 */,and:function(...e){return e.forEach(e=>oI("and",e)),Qw._create("and",e)},arrayRemove:function(...e){return new yw("arrayRemove",e)},arrayUnion:Lw,average:function(e){return new Uw("avg",Aw("average",e))},clearIndexedDbPersistence:function(e){if(e._initialized&&!e._terminated)throw new Vo(Fo.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const t=new Uo;return e._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(e){if(!Ba.v())return Promise.resolve();const t=e+mm;await Ba.delete(t)}(wm(e._databaseId,e._persistenceKey)),t.resolve()}catch(n){t.reject(n)}}),t.promise},collection:Uv,collectionGroup:function(e,t){if(e=ma(e,xv),ua("collectionGroup","collection id",t),t.indexOf("/")>=0)throw new Vo(Fo.INVALID_ARGUMENT,`Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new Mv(e,null,(n=t,new Zl(sa.emptyPath(),n)));var n},connectFirestoreEmulator:Lv,count:uI,deleteAllPersistentCacheIndexes:function(e){(function(e){return e.asyncQueue.enqueue(async()=>function(e){const t=Mo(e),n=t.indexManager;return t.persistence.runTransaction("Delete All Indexes","readwrite",e=>n.deleteAllFieldIndexes(e))}(await wv(e)))})(Wv(e._firestore)).then(e=>No("deleting all persistent cache indexes succeeded")).catch(e=>Ro("deleting all persistent cache indexes failed",e))},deleteDoc:xI,deleteField:Ow,disableNetwork:function(e){return function(e){return e.asyncQueue.enqueue(async()=>{const t=await vv(e),n=await Iv(e);return t.setNetworkEnabled(!1),async function(e){const t=Mo(e);t.Ea.add(0),await bg(t),t.Va.set("Offline")}(n)})}(Wv(e=ma(e,Kv)))},disablePersistentCacheIndexAutoCreation:function(e){BI(e,!1)},doc:qv,documentId:function(){return new tw(ra)},documentSnapshotFromJSON:function(e,t,n){if(va(t,II._jsonSchema)){if(t.bundle===vI)throw new Vo(Fo.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=hg(e._databaseId),i=kv(t.bundle,r),s=i.t(),o=new my(i.getMetadata(),r);for(const e of s)o.o(e);const a=o.documents;if(1!==a.length)throw new Vo(Fo.INVALID_ARGUMENT,`Expected bundle data to contain 1 document, but it contains ${a.length} documents.`);const c=Zd(r,a[0].document),u=new ca(sa.fromString(t.bundleName));return new II(e,new cI(e),u,c,new wI(!1,!1),n||null)}},enableIndexedDbPersistence:Jv,enableMultiTabIndexedDbPersistence:async function(e){Ro("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=e._freezeSettings();Yv(e,sv.provider,{build:e=>new iv(e,t.cacheSizeBytes)})},enableNetwork:function(e){return function(e){return e.asyncQueue.enqueue(async()=>{const t=await vv(e),n=await Iv(e);return t.setNetworkEnabled(!0),function(e){const t=Mo(e);return t.Ea.delete(0),Tg(t)}(n)})}(Wv(e=ma(e,Kv)))},enablePersistentCacheIndexAutoCreation:function(e){BI(e,!0)},endAt:function(...e){return tI._create("endAt",e,!0)},endBefore:function(...e){return tI._create("endBefore",e,!1)},ensureFirestoreConfigured:Wv,executeWrite:MI,getAggregateFromServer:lI,getCountFromServer:function(e){return lI(e,{count:uI()})},getDoc:DI,getDocFromCache:function(e){e=ma(e,Fv);const t=ma(e.firestore,Kv),n=Wv(t),r=new Pw(t);return function(e,t){const n=new Uo;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){try{const r=await function(e,t){const n=Mo(e);return n.persistence.runTransaction("read document","readonly",e=>n.localDocuments.getDocument(e,t))}(e,t);r.isFoundDocument()?n.resolve(r):r.isNoDocument()?n.resolve(null):n.reject(new Vo(Fo.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(r){const e=Xg(r,`Failed to get document '${t} from cache`);n.reject(e)}}(await wv(e),t,n)),n.promise}(n,e._key).then(n=>new II(t,r,e._key,n,new wI(null!==n&&n.hasLocalMutations,!0),e.converter))},getDocFromServer:function(e){e=ma(e,Fv);const t=ma(e.firestore,Kv);return Ev(Wv(t),e._key,{source:"server"}).then(n=>FI(t,e,n))},getDocs:RI,getDocsFromCache:function(e){e=ma(e,Mv);const t=ma(e.firestore,Kv),n=Wv(t),r=new Pw(t);return function(e,t){const n=new Uo;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){try{const r=await Pm(e,t,!0),i=new wy(t,r.ks),s=i.ru(r.documents),o=i.applyChanges(s,!1);n.resolve(o.snapshot)}catch(r){const e=Xg(r,`Failed to execute query '${t} against cache`);n.reject(e)}}(await wv(e),t,n)),n.promise}(n,e._query).then(n=>new TI(t,r,e,n))},getDocsFromServer:function(e){e=ma(e,Mv);const t=ma(e.firestore,Kv),n=Wv(t),r=new Pw(t);return Sv(n,e._query,{source:"server"}).then(n=>new TI(t,r,e,n))},getFirestore:Hv,getPersistentCacheIndexManager:function(e){var t;e=ma(e,Kv);const n=jI.get(e);if(n)return n;if("persistent"!==(null==(t=Wv(e)._uninitializedComponentsProvider)?void 0:t._offline.kind))return null;const r=new qI(e);return jI.set(e,r),r},increment:function(e){return new vw("increment",e)},initializeFirestore:function(e,t,n){n||(n=Bu);const r=ze(e,"firestore");if(r.isInitialized(n)){const e=r.getImmediate({identifier:n});if(S(r.getOptions(n),t))return e;throw new Vo(Fo.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(void 0!==t.cacheSizeBytes&&void 0!==t.localCache)throw new Vo(Fo.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(void 0!==t.cacheSizeBytes&&-1!==t.cacheSizeBytes&&t.cacheSizeBytes<Rp)throw new Vo(Fo.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&d(t.host)&&f(t.host),r.initialize({options:t,instanceIdentifier:n})},limit:Zw,limitToLast:function(e){return ga("limitToLast",e),Xw._create("limitToLast",e,"L")},loadBundle:Xv,memoryEagerGarbageCollector:function(){return new fI},memoryLocalCache:function(e){return new hI(e)},memoryLruGarbageCollector:function(e){return new pI(null==e?void 0:e.cacheSizeBytes)},namedQuery:Zv,onSnapshot:LI,onSnapshotResume:function(e,t,...n){const r=P(e),i=function(e){const t={bundle:"",bundleName:"",bundleSource:""},n=["bundle","bundleName","bundleSource"];for(const r of n){if(!(r in e)){t.error=`snapshotJson missing required field: ${r}`;break}const n=e[r];if("string"!=typeof n){t.error=`snapshotJson field '${r}' must be a string.`;break}if(0===n.length){t.error=`snapshotJson field '${r}' cannot be an empty string.`;break}"bundle"===r?t.bundle=n:"bundleName"===r?t.bundleName=n:"bundleSource"===r&&(t.bundleSource=n)}return t}(t);if(i.error)throw new Vo(Fo.INVALID_ARGUMENT,i.error);let s,o=0;if("object"!=typeof n[o]||Vw(n[o])||(s=n[o++]),"QuerySnapshot"===i.bundleSource){let e=null;if("object"==typeof n[o]&&Vw(n[o])){const t=n[o++];e={next:t.next,error:t.error,complete:t.complete}}else e={next:n[o++],error:n[o++],complete:n[o++]};return function(e,t,n,r,i){let s,o=!1;return Xv(e,t.bundle).then(()=>Zv(e,t.bundleName)).then(e=>{e&&!o&&(i&&e.withConverter(i),s=LI(e,n||{},r))}).catch(e=>(r.error&&r.error(e),()=>{})),()=>{o||(o=!0,s&&s())}}(r,i,s,e,n[o])}if("DocumentSnapshot"===i.bundleSource){let e=null;if("object"==typeof n[o]&&Vw(n[o])){const t=n[o++];e={next:t.next,error:t.error,complete:t.complete}}else e={next:n[o++],error:n[o++],complete:n[o++]};return function(e,t,n,r,i){let s,o=!1;return Xv(e,t.bundle).then(()=>{if(!o){const o=new Fv(e,i||null,ca.fromPath(t.bundleName));s=LI(o,n||{},r)}}).catch(e=>(r.error&&r.error(e),()=>{})),()=>{o||(o=!0,s&&s())}}(r,i,s,e,n[o])}throw new Vo(Fo.INVALID_ARGUMENT,`unsupported bundle source: ${i.bundleSource}`)},onSnapshotsInSync:function(e,t){return function(e,t){const n=new av(t);return e.asyncQueue.enqueueAndForget(async()=>{return t=await bv(e),r=n,Mo(t).Ca.add(r),void r.next();var t,r}),()=>{n.Nu(),e.asyncQueue.enqueueAndForget(async()=>{return t=await bv(e),r=n,void Mo(t).Ca.delete(r);var t,r})}}(Wv(e=ma(e,Kv)),Vw(t)?t:{next:t})},or:function(...e){return e.forEach(e=>oI("or",e)),Qw._create("or",e)},orderBy:Yw,persistentLocalCache:function(e){return new dI(e)},persistentMultipleTabManager:function(){return new gI},persistentSingleTabManager:yI,query:Kw,queryEqual:Bv,querySnapshotFromJSON:function(e,t,n){if(va(t,TI._jsonSchema)){if(t.bundle===vI)throw new Vo(Fo.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=hg(e._databaseId),i=kv(t.bundle,r),s=i.t(),o=new my(i.getMetadata(),r);for(const e of s)o.o(e);if(1!==o.queries.length)throw new Vo(Fo.INVALID_ARGUMENT,`Snapshot data expected 1 query but found ${o.queries.length} queries.`);const a=Af(o.queries[0].bundledQuery),c=o.documents;let u=new Zg;c.map(e=>{const t=Zd(r,e.document);u=u.add(t)});const l=ty.fromInitialDocuments(a,u,kh(),!1,!1),h=new Mv(e,n||null,a);return new TI(e,new cI(e),h,l)}},refEqual:function(e,t){return e=P(e),t=P(t),(e instanceof Fv||e instanceof Vv)&&(t instanceof Fv||t instanceof Vv)&&e.firestore===t.firestore&&e.path===t.path&&e.converter===t.converter},runTransaction:NI,serverTimestamp:xw,setDoc:PI,setIndexConfiguration:function(e,t){const n=Wv(e=ma(e,Kv));return n._uninitializedComponentsProvider&&"memory"!==n._uninitializedComponentsProvider._offline.kind?function(e,t){return e.asyncQueue.enqueue(async()=>async function(e,t){const n=Mo(e),r=n.indexManager,i=[];return n.persistence.runTransaction("Configure indexes","readwrite",e=>r.getFieldIndexes(e).next(n=>
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
      */function(e,t,n,r,i){e=[...e],t=[...t],e.sort(n),t.sort(n);const s=e.length,o=t.length;let a=0,c=0;for(;a<o&&c<s;){const s=n(e[c],t[a]);s<0?i(e[c++]):s>0?r(t[a++]):(a++,c++)}for(;a<o;)r(t[a++]);for(;c<s;)i(e[c++])}(n,t,Ca,t=>{i.push(r.addFieldIndex(e,t))},t=>{i.push(r.deleteFieldIndex(e,t))})).next(()=>Va.waitFor(i)))}(await wv(e),t))}(n,function(e){const t="string"==typeof e?function(e){try{return JSON.parse(e)}catch(t){throw new Vo(Fo.INVALID_ARGUMENT,"Failed to parse JSON: "+(null==t?void 0:t.message))}}(e):e,n=[];if(Array.isArray(t.indexes))for(const r of t.indexes){const e=UI(r,"collectionGroup"),t=[];if(Array.isArray(r.fields))for(const n of r.fields){const e=kw("setIndexConfiguration",UI(n,"fieldPath"));"CONTAINS"===n.arrayConfig?t.push(new ka(e,2)):"ASCENDING"===n.order?t.push(new ka(e,0)):"DESCENDING"===n.order&&t.push(new ka(e,1))}n.push(new Ea(Ea.UNKNOWN_ID,e,t,Da.empty()))}return n}(t)):(Ro("Cannot enable indexes when persistence is disabled"),Promise.resolve())},setLogLevel:function(e){Co.setLogLevel(e)},snapshotEqual:function(e,t){return e instanceof II&&t instanceof II?e._firestore===t._firestore&&e._key.isEqual(t._key)&&(null===e._document?null===t._document:e._document.isEqual(t._document))&&e._converter===t._converter:e instanceof TI&&t instanceof TI&&e._firestore===t._firestore&&Bv(e.query,t.query)&&e.metadata.isEqual(t.metadata)&&e._snapshot.isEqual(t._snapshot)},startAfter:function(...e){return eI._create("startAfter",e,!1)},startAt:function(...e){return eI._create("startAt",e,!0)},sum:function(e){return new Uw("sum",Aw("sum",e))},terminate:function(e){return function(e,t,n=Me){ze(e,t).clearInstance(n)}(e.app,"firestore",e._databaseId.database),e._delete()},updateDoc:OI,vector:function(e){return new iw(e)},waitForPendingWrites:function(e){return function(e){const t=new Uo;return e.asyncQueue.enqueueAndForget(async()=>async function(t,n){const r=Mo(t);Dg(r.remoteStore)||No(Iy,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const e=await function(e){const t=Mo(e);return t.persistence.runTransaction("Get highest unacknowledged batch id","readonly",e=>t.mutationQueue.getHighestUnacknowledgedBatchId(e))}(r.localStore);if(e===ec)return void n.resolve();const t=r.mu.get(e)||[];t.push(n),r.mu.set(e,t)}catch(e){const r=Xg(e,"Initialization of waitForPendingWrites() operation failed");n.reject(r)}}(await _v(e),t)),t.promise}(Wv(e=ma(e,Kv)))},where:Ww,writeBatch:VI},Symbol.toStringTag,{value:"Module"}));export{$r as $,Zw as A,Yw as B,VI as C,Lw as D,Ow as E,NI as F,cr as G,Pr as H,Zr as I,pi as J,fr as K,Dr as L,Br as M,qr as N,Wr as O,bs as P,hr as Q,Kr as R,dr as S,_a as T,pr as U,Xi as V,ts as W,yr as X,nn as Y,fi as Z,Qr as _,Qe as a,hn as a0,Gi as a1,Ni as a2,_r as a3,Or as a4,Hr as a5,es as a6,Sr as a7,Xr as a8,$n as a9,Jr as aa,_s as ab,ds as ac,Ts as ad,fs as ae,Rr as af,rr as ag,ai as ah,ho as ai,$I as aj,uo as b,Hv as c,bi as d,Jv as e,qv as f,Je as g,PI as h,We as i,DI as j,xI as k,Uv as l,RI as m,Gr as n,di as o,hi as p,Ur as q,zr as r,ci as s,Ye as t,Yr as u,xw as v,OI as w,LI as x,Kw as y,Ww as z};
