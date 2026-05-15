"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[886],{9174:function(e,t,n){var r,i,s,a,o=n(357),l=n(951).lW,u=n(3053),c=n(1626),h=n(2348),d=n(3825),f=n(6048);/**
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
 */class m{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}m.UNAUTHENTICATED=new m(null),m.GOOGLE_CREDENTIALS=new m("google-credentials-uid"),m.FIRST_PARTY=new m("first-party-uid"),m.MOCK_USER=new m("mock-user");/**
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
 */let g="12.13.0",p=new d.Logger("@firebase/firestore");function y(){return p.logLevel}function w(e,...t){if(p.logLevel<=d.LogLevel.DEBUG){let n=t.map(T);p.debug(`Firestore (${g}): ${e}`,...n)}}function v(e,...t){if(p.logLevel<=d.LogLevel.ERROR){let n=t.map(T);p.error(`Firestore (${g}): ${e}`,...n)}}function I(e,...t){if(p.logLevel<=d.LogLevel.WARN){let n=t.map(T);p.warn(`Firestore (${g}): ${e}`,...n)}}function T(e){if("string"==typeof e)return e;try{return JSON.stringify(e)}catch(t){return e}}/**
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
 */function E(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,_(e,r,n)}function _(e,t,n){let r=`FIRESTORE (${g}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(e){r+=" CONTEXT: "+n}throw v(r),Error(r)}function b(e,t,n,r){let i="Unexpected state";"string"==typeof n?i=n:r=n,e||_(t,i,r)}/**
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
 */let S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class x extends c.FirebaseError{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class A{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class C{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class D{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(m.UNAUTHENTICATED))}shutdown(){}}class N{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class k{constructor(e){this.t=e,this.currentUser=m.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){b(void 0===this.o,42304);let n=this.i,r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve(),i=new A;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new A,e.enqueueRetryable(()=>r(this.currentUser))};let s=()=>{let t=i;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},a=e=>{w("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),s())};this.t.onInit(e=>a(e)),setTimeout(()=>{if(!this.auth){let e=this.t.getImmediate({optional:!0});e?a(e):(w("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new A)}},0),s()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(w("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(b("string"==typeof t.accessToken,31837,{l:t}),new C(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){let e=this.auth&&this.auth.getUid();return b(null===e||"string"==typeof e,2055,{h:e}),new m(e)}}class V{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=m.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);let e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class R{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new V(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(m.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class P{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class F{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,u._isFirebaseServerApp(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){b(void 0===this.o,3512);let n=e=>{null!=e.error&&w("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);let n=e.token!==this.m;return this.m=e.token,w("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};let r=e=>{w("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){let e=this.V.getImmediate({optional:!0});e?r(e):w("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new P(this.p));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?(b("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new P(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}class O{getToken(){return Promise.resolve(new P(""))}invalidateToken(){}start(e,t){}shutdown(){}}/**
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
 */class M{static newId(){let e=62*Math.floor(256/62),t="";for(;t.length<20;){let n=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){let t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(40);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let e=0;e<40;e++)n[e]=Math.floor(256*Math.random());return n}(0);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function L(e,t){return e<t?-1:e>t?1:0}function U(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let n=e.charAt(r),i=t.charAt(r);if(n!==i)return q(n)===q(i)?L(n,i):q(n)?1:-1}return L(e.length,t.length)}function q(e){let t=e.charCodeAt(0);return t>=55296&&t<=57343}function B(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}/**
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
 */let z="__name__";class K{constructor(e,t,n){void 0===t?t=0:t>e.length&&E(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&E(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===K.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof K?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let n=K.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return L(e.length,t.length)}static compareSegments(e,t){let n=K.isNumericId(e),r=K.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?K.extractNumericId(e).compare(K.extractNumericId(t)):U(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return h.Integer.fromString(e.substring(4,e.length-2))}}class $ extends K{construct(e,t,n){return new $(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let n of e){if(n.indexOf("//")>=0)throw new x(S.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new $(t)}static emptyPath(){return new $([])}}let G=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class j extends K{construct(e,t,n){return new j(e,t,n)}static isValidIdentifier(e){return G.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),j.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===z}static keyField(){return new j([z])}static fromServerFormat(e){let t=[],n="",r=0,i=()=>{if(0===n.length)throw new x(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""},s=!1;for(;r<e.length;){let t=e[r];if("\\"===t){if(r+1===e.length)throw new x(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new x(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?s=!s:"."!==t||s?n+=t:i(),r++}if(i(),s)throw new x(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new j(t)}static emptyPath(){return new j([])}}/**
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
 */class Q{constructor(e){this.path=e}static fromPath(e){return new Q($.fromString(e))}static fromName(e){return new Q($.fromString(e).popFirst(5))}static empty(){return new Q($.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===$.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return $.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Q(new $(e.slice()))}}/**
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
 */function H(e,t,n){if(!n)throw new x(S.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function W(e,t,n,r){if(!0===t&&!0===r)throw new x(S.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function J(e){if(!Q.isDocumentKey(e))throw new x(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function Y(e){if(Q.isDocumentKey(e))throw new x(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function X(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}function Z(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}return"function"==typeof e?"a function":E(12329,{type:typeof e})}function ee(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new x(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let n=Z(e);throw new x(S.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}/**
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
 */function et(e,t){let n={typeString:e};return t&&(n.value=t),n}function en(e,t){let n;if(!X(e))throw new x(S.INVALID_ARGUMENT,"JSON must be an object");for(let r in t)if(t[r]){let i=t[r].typeString,s="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}let a=e[r];if(i&&typeof a!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(void 0!==s&&a!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new x(S.INVALID_ARGUMENT,n);return!0}class er{static now(){return er.fromMillis(Date.now())}static fromDate(e){return er.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3);return new er(t,Math.floor((e-1e3*t)*1e6))}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0||t>=1e9)throw new x(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800||e>=253402300800)throw new x(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?L(this.nanoseconds,e.nanoseconds):L(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:er._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(en(e,er._jsonSchema))return new er(e.seconds,e.nanoseconds)}valueOf(){return String(this.seconds- -62135596800).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}er._jsonSchemaVersion="firestore/timestamp/1.0",er._jsonSchema={type:et("string",er._jsonSchemaVersion),seconds:et("number"),nanoseconds:et("number")};/**
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
 */class ei{static fromTimestamp(e){return new ei(e)}static min(){return new ei(new er(0,0))}static max(){return new ei(new er(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}class es{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}function ea(e){return e.fields.find(e=>2===e.kind)}function eo(e){return e.fields.filter(e=>2!==e.kind)}function el(e,t){let n=L(e.collectionGroup,t.collectionGroup);if(0!==n)return n;for(let r=0;r<Math.min(e.fields.length,t.fields.length);++r)if(0!==(n=function(e,t){let n=j.comparator(e.fieldPath,t.fieldPath);return 0!==n?n:L(e.kind,t.kind)}(e.fields[r],t.fields[r])))return n;return L(e.fields.length,t.fields.length)}es.UNKNOWN_ID=-1;class eu{constructor(e,t){this.fieldPath=e,this.kind=t}}class ec{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new ec(0,ef.min())}}function eh(e,t){let n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1;return new ef(ei.fromTimestamp(1e9===r?new er(n+1,0):new er(n,r)),Q.empty(),t)}function ed(e){return new ef(e.readTime,e.key,-1)}class ef{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new ef(ei.min(),Q.empty(),-1)}static max(){return new ef(ei.max(),Q.empty(),-1)}}function em(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:0!==(n=Q.comparator(e.documentKey,t.documentKey))?n:L(e.largestBatchId,t.largestBatchId)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eg="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class ep{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function ey(e){if(e.code!==S.FAILED_PRECONDITION||e.message!==eg)throw e;w("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class ew{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&E(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new ew((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{let t=e();return t instanceof ew?t:ew.resolve(t)}catch(e){return ew.reject(e)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):ew.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):ew.reject(t)}static resolve(e){return new ew((t,n)=>{t(e)})}static reject(e){return new ew((t,n)=>{n(e)})}static waitFor(e){return new ew((t,n)=>{let r=0,i=0,s=!1;e.forEach(e=>{++r,e.next(()=>{++i,s&&i===r&&t()},e=>n(e))}),s=!0,i===r&&t()})}static or(e){let t=ew.resolve(!1);for(let n of e)t=t.next(e=>e?ew.resolve(e):n());return t}static forEach(e,t){let n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new ew((n,r)=>{let i=e.length,s=Array(i),a=0;for(let o=0;o<i;o++){let l=o;t(e[l]).next(e=>{s[l]=e,++a===i&&n(s)},e=>r(e))}})}static doWhile(e,t){return new ew((n,r)=>{let i=()=>{!0===e()?t().next(()=>{i()},r):n()};i()})}}/**
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
 */let ev="SimpleDb";class eI{static open(e,t,n,r){try{return new eI(t,e.transaction(r,n))}catch(e){throw new eb(t,e)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new A,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new eb(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{let n=eD(t.target.error);this.S.reject(new eb(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(w(ev,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){let e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){return new ex(this.transaction.objectStore(e))}}class eT{static delete(e){return w(ev,"Removing database:",e),eA(c.getGlobal().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!c.isIndexedDBAvailable())return!1;if(eT.F())return!0;let e=c.getUA(),t=eT.M(e),n=eE(e);return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||0<t&&t<10||0<n&&n<4.5)}static F(){return void 0!==o&&"YES"===o.__PRIVATE_env?.__PRIVATE_USE_MOCK_PERSISTENCE}static O(e,t){return e.store(t)}static M(e){let t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i);return Number(t?t[1].split("_").slice(0,2).join("."):"-1")}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,12.2===eT.M(c.getUA())&&v("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(w(ev,"Opening database:",this.name),this.db=await new Promise((t,n)=>{let r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{t(e.target.result)},r.onblocked=()=>{n(new eb(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=t=>{let r=t.target.error;"VersionError"===r.name?n(new x(S.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new x(S.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new eb(e,r))},r.onupgradeneeded=e=>{w(ev,'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);let t=e.target.result;this.N.k(t,r.transaction,e.oldVersion,this.version).next(()=>{w(ev,"Database upgrade to version "+this.version+" complete")})}})),this.K&&(this.db.onversionchange=e=>this.K(e)),this.db}q(e){this.K=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,r){let i="readonly"===t,s=0;for(;;){++s;try{this.db=await this.L(e);let t=eI.open(this.db,e,i?"readonly":"readwrite",n),s=r(t).next(e=>(t.C(),e)).catch(e=>(t.abort(e),ew.reject(e))).toPromise();return s.catch(()=>{}),await t.D,s}catch(t){let e="FirebaseError"!==t.name&&s<3;if(w(ev,"Transaction failed with error:",t.message,"Retrying:",e),this.close(),!e)return Promise.reject(t)}}}close(){this.db&&this.db.close(),this.db=void 0}}function eE(e){let t=e.match(/Android ([\d.]+)/i);return Number(t?t[1].split(".").slice(0,2).join("."):"-1")}class e_{constructor(e){this.U=e,this.$=!1,this.W=null}get isDone(){return this.$}get G(){return this.W}set cursor(e){this.U=e}done(){this.$=!0}j(e){this.W=e}delete(){return eA(this.U.delete())}}class eb extends x{constructor(e,t){super(S.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function eS(e){return"IndexedDbTransactionError"===e.name}class ex{constructor(e){this.store=e}put(e,t){let n;return void 0!==t?(w(ev,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(w(ev,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),eA(n)}add(e){return w(ev,"ADD",this.store.name,e,e),eA(this.store.add(e))}get(e){return eA(this.store.get(e)).next(t=>(void 0===t&&(t=null),w(ev,"GET",this.store.name,e,t),t))}delete(e){return w(ev,"DELETE",this.store.name,e),eA(this.store.delete(e))}count(){return w(ev,"COUNT",this.store.name),eA(this.store.count())}J(e,t){let n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){let e=r.getAll(n.range);return new ew((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}})}{let e=this.cursor(n),t=[];return this.H(e,(e,n)=>{t.push(n)}).next(()=>t)}}Z(e,t){let n=this.store.getAll(e,null===t?void 0:t);return new ew((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}})}X(e,t){w(ev,"DELETE ALL",this.store.name);let n=this.options(e,t);n.Y=!1;let r=this.cursor(n);return this.H(r,(e,t,n)=>n.delete())}ee(e,t){let n;t?n=e:(n={},t=e);let r=this.cursor(n);return this.H(r,t)}te(e){let t=this.cursor({});return new ew((n,r)=>{t.onerror=e=>{r(eD(e.target.error))},t.onsuccess=t=>{let r=t.target.result;r?e(r.primaryKey,r.value).next(e=>{e?r.continue():n()}):n()}})}H(e,t){let n=[];return new ew((r,i)=>{e.onerror=e=>{i(e.target.error)},e.onsuccess=e=>{let i=e.target.result;if(!i)return void r();let s=new e_(i),a=t(i.primaryKey,i.value,s);if(a instanceof ew){let e=a.catch(e=>(s.done(),ew.reject(e)));n.push(e)}s.isDone?r():null===s.G?i.continue():i.continue(s.G)}}).next(()=>ew.waitFor(n))}options(e,t){let n;return void 0!==e&&("string"==typeof e?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){let n=this.store.index(e.index);return e.Y?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function eA(e){return new ew((t,n)=>{e.onsuccess=e=>{t(e.target.result)},e.onerror=e=>{n(eD(e.target.error))}})}let eC=!1;function eD(e){let t=eT.M(c.getUA());if(t>=12.2&&t<13){let t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){let e=new x("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return eC||(eC=!0,setTimeout(()=>{throw e},0)),e}}return e}let eN="IndexBackfiller";class ek{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}re(e){w(eN,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{let e=await this.ne.ie();w(eN,`Documents written: ${e}`)}catch(e){eS(e)?w(eN,"Ignoring IndexedDB error during index backfill: ",e):await ey(e)}await this.re(6e4)})}}class eV{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.se(t,e))}se(e,t){let n=new Set,r=t,i=!0;return ew.doWhile(()=>!0===i&&r>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t=>{if(null!==t&&!n.has(t))return w(eN,`Processing collection: ${t}`),this.oe(e,t,r).next(e=>{r-=e,n.add(t)});i=!1})).next(()=>t-r)}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next(n=>{let i=n.changes;return this.localStore.indexManager.updateIndexEntries(e,i).next(()=>this._e(r,n)).next(n=>(w(eN,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n))).next(()=>i.size)}))}_e(e,t){let n=e;return t.changes.forEach((e,t)=>{let r=ed(t);em(r,n)>0&&(n=r)}),new ef(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
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
 */class eR{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ae(e),this.ue=e=>t.writeSequenceNumber(e))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.ue&&this.ue(e),e}}function eP(e){return null==e}function eF(e){return 0===e&&1/e==-1/0}function eO(e){return"number"==typeof e&&Number.isInteger(e)&&!eF(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}function eM(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t+="\x01\x01"),t=function(e,t){let n=t,r=e.length;for(let t=0;t<r;t++){let r=e.charAt(t);switch(r){case"\0":n+="\x01\x10";break;case"\x01":n+="\x01\x11";break;default:n+=r}}return n}(e.get(n),t);return t+"\x01\x01"}function eL(e){let t=e.length;if(b(t>=2,64408,{path:e}),2===t)return b("\x01"===e.charAt(0)&&"\x01"===e.charAt(1),56145,{path:e}),$.emptyPath();let n=t-2,r=[],i="";for(let s=0;s<t;){let t=e.indexOf("\x01",s);switch((t<0||t>n)&&E(50515,{path:e}),e.charAt(t+1)){case"\x01":let a;let o=e.substring(s,t);0===i.length?a=o:(i+=o,a=i,i=""),r.push(a);break;case"\x10":i+=e.substring(s,t)+"\0";break;case"\x11":i+=e.substring(s,t+1);break;default:E(61167,{path:e})}s=t+2}return new $(r)}eR.ce=-1;/**
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
 */let eU="remoteDocuments",eq="owner",eB="owner",ez="mutationQueues",eK="mutations",e$="batchId",eG="userMutationsIndex",ej=["userId","batchId"],eQ={},eH="documentMutations",eW="remoteDocumentsV14",eJ=["prefixPath","collectionGroup","readTime","documentId"],eY="documentKeyIndex",eX=["prefixPath","collectionGroup","documentId"],eZ="collectionGroupIndex",e0=["collectionGroup","readTime","prefixPath","documentId"],e1="remoteDocumentGlobal",e2="remoteDocumentGlobalKey",e4="targets",e5="queryTargetsIndex",e3=["canonicalId","targetId"],e6="targetDocuments",e8=["targetId","path"],e9="documentTargetsIndex",e7=["path","targetId"],te="targetGlobalKey",tt="targetGlobal",tn="collectionParents",tr=["collectionId","parent"],ti="clientMetadata",ts="bundles",ta="namedQueries",to="indexConfiguration",tl="collectionGroupIndex",tu="indexState",tc=["indexId","uid"],th="sequenceNumberIndex",td=["uid","sequenceNumber"],tf="indexEntries",tm=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],tg="documentKeyIndex",tp=["indexId","uid","orderedDocumentKey"],ty="documentOverlays",tw=["userId","collectionPath","documentId"],tv="collectionPathOverlayIndex",tI=["userId","collectionPath","largestBatchId"],tT="collectionGroupOverlayIndex",tE=["userId","collectionGroup","largestBatchId"],t_="globals",tb=[ez,eK,eH,eU,e4,eq,tt,e6,ti,e1,tn,ts,ta],tS=[...tb,ty],tx=[ez,eK,eH,eW,e4,eq,tt,e6,ti,e1,tn,ts,ta,ty],tA=[...tx,to,tu,tf],tC=[...tA,t_];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tD extends ep{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function tN(e,t){return eT.O(e.le,t)}/**
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
 */function tk(e){let t=0;for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function tV(e,t){for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function tR(e,t){let n=[];for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.push(t(e[r],r,e));return n}function tP(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}/**
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
 */class tF{constructor(e,t){this.comparator=e,this.root=t||tM.EMPTY}insert(e,t){return new tF(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,tM.BLACK,null,null))}remove(e){return new tF(this.comparator,this.root.remove(e,this.comparator).copy(null,null,tM.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){let r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){let e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new tO(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new tO(this.root,e,this.comparator,!1)}getReverseIterator(){return new tO(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new tO(this.root,e,this.comparator,!0)}}class tO{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class tM{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:tM.RED,this.left=null!=r?r:tM.EMPTY,this.right=null!=i?i:tM.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new tM(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this,i=n(e,r.key);return(r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n))).fixUp()}removeMin(){if(this.left.isEmpty())return tM.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let n,r=this;if(0>t(e,r.key))r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return tM.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,tM.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,tM.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){return Math.pow(2,this.check())<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw E(43730,{key:this.key,value:this.value});if(this.right.isRed())throw E(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw E(27949);return e+(this.isRed()?0:1)}}tM.EMPTY=null,tM.RED=!0,tM.BLACK=!1,tM.EMPTY=new class{constructor(){this.size=0}get key(){throw E(57766)}get value(){throw E(16141)}get color(){throw E(16727)}get left(){throw E(29726)}get right(){throw E(36894)}copy(e,t,n,r,i){return this}insert(e,t,n){return new tM(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class tL{constructor(e){this.comparator=e,this.data=new tF(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){let n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){let r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new tU(this.data.getIterator())}getIteratorFrom(e){return new tU(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof tL)||this.size!==e.size)return!1;let t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new tL(this.comparator);return t.data=e,t}}class tU{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function tq(e){return e.hasNext()?e.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tB{constructor(e){this.fields=e,e.sort(j.comparator)}static empty(){return new tB([])}unionWith(e){let t=new tL(j.comparator);for(let e of this.fields)t=t.add(e);for(let n of e)t=t.add(n);return new tB(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return B(this.fields,e.fields,(e,t)=>e.isEqual(t))}}/**
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
 */class tz extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tK{constructor(e){this.binaryString=e}static fromBase64String(e){return new tK(function(e){try{return atob(e)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new tz("Invalid base64 string: "+e):e}}(e))}static fromUint8Array(e){return new tK(function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e))}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return btoa(this.binaryString)}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return L(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}tK.EMPTY_BYTE_STRING=new tK("");let t$=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function tG(e){if(b(!!e,39018),"string"==typeof e){let t=0,n=t$.exec(e);if(b(!!n,46558,{timestamp:e}),n[1]){let e=n[1];t=Number(e=(e+"000000000").substr(0,9))}return{seconds:Math.floor(new Date(e).getTime()/1e3),nanos:t}}return{seconds:tj(e.seconds),nanos:tj(e.nanos)}}function tj(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function tQ(e){return"string"==typeof e?tK.fromBase64String(e):tK.fromUint8Array(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tH="server_timestamp",tW="__type__",tJ="__previous_value__",tY="__local_write_time__";function tX(e){return(e?.mapValue?.fields||{})[tW]?.stringValue===tH}function tZ(e){let t=e.mapValue.fields[tJ];return tX(t)?tZ(t):t}function t0(e){let t=tG(e.mapValue.fields[tY].timestampValue);return new er(t.seconds,t.nanos)}/**
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
 */class t1{constructor(e,t,n,r,i,s,a,o,l,u,c){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=a,this.longPollingOptions=o,this.useFetchStreams=l,this.isUsingEmulator=u,this.apiKey=c}}let t2="(default)";class t4{constructor(e,t){this.projectId=e,this.database=t||t2}static empty(){return new t4("","")}get isDefaultDatabase(){return this.database===t2}isEqual(e){return e instanceof t4&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let t5="__type__",t3="__max__",t6={mapValue:{fields:{__type__:{stringValue:t3}}}},t8="__vector__",t9="value",t7={nullValue:"NULL_VALUE"};function ne(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?tX(e)?4:ng(e)?9007199254740991:nf(e)?10:11:E(28295,{value:e})}function nt(e,t){if(e===t)return!0;let n=ne(e);if(n!==ne(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return t0(e).isEqual(t0(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;let n=tG(e.timestampValue),r=tG(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return tQ(e.bytesValue).isEqual(tQ(t.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return tj(e.geoPointValue.latitude)===tj(t.geoPointValue.latitude)&&tj(e.geoPointValue.longitude)===tj(t.geoPointValue.longitude);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return tj(e.integerValue)===tj(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){let n=tj(e.doubleValue),r=tj(t.doubleValue);return n===r?eF(n)===eF(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return B(e.arrayValue.values||[],t.arrayValue.values||[],nt);case 10:case 11:return function(e,t){let n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(tk(n)!==tk(r))return!1;for(let e in n)if(n.hasOwnProperty(e)&&(void 0===r[e]||!nt(n[e],r[e])))return!1;return!0}(e,t);default:return E(52216,{left:e})}}function nn(e,t){return void 0!==(e.values||[]).find(e=>nt(e,t))}function nr(e,t){if(e===t)return 0;let n=ne(e),r=ne(t);if(n!==r)return L(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return L(e.booleanValue,t.booleanValue);case 2:return function(e,t){let n=tj(e.integerValue||e.doubleValue),r=tj(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return ni(e.timestampValue,t.timestampValue);case 4:return ni(t0(e),t0(t));case 5:return U(e.stringValue,t.stringValue);case 6:return function(e,t){let n=tQ(e),r=tQ(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){let n=e.split("/"),r=t.split("/");for(let e=0;e<n.length&&e<r.length;e++){let t=L(n[e],r[e]);if(0!==t)return t}return L(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){let n=L(tj(e.latitude),tj(t.latitude));return 0!==n?n:L(tj(e.longitude),tj(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return ns(e.arrayValue,t.arrayValue);case 10:return function(e,t){let n=e.fields||{},r=t.fields||{},i=n[t9]?.arrayValue,s=r[t9]?.arrayValue,a=L(i?.values?.length||0,s?.values?.length||0);return 0!==a?a:ns(i,s)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===t6.mapValue&&t===t6.mapValue)return 0;if(e===t6.mapValue)return 1;if(t===t6.mapValue)return -1;let n=e.fields||{},r=Object.keys(n),i=t.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let e=0;e<r.length&&e<s.length;++e){let t=U(r[e],s[e]);if(0!==t)return t;let a=nr(n[r[e]],i[s[e]]);if(0!==a)return a}return L(r.length,s.length)}(e.mapValue,t.mapValue);default:throw E(23264,{he:n})}}function ni(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return L(e,t);let n=tG(e),r=tG(t),i=L(n.seconds,r.seconds);return 0!==i?i:L(n.nanos,r.nanos)}function ns(e,t){let n=e.values||[],r=t.values||[];for(let e=0;e<n.length&&e<r.length;++e){let t=nr(n[e],r[e]);if(t)return t}return L(n.length,r.length)}function na(e){var t,n;return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){let t=tG(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?tQ(e.bytesValue).toBase64():"referenceValue"in e?(t=e.referenceValue,Q.fromName(t).toString()):"geoPointValue"in e?(n=e.geoPointValue,`geo(${n.latitude},${n.longitude})`):"arrayValue"in e?function(e){let t="[",n=!0;for(let r of e.values||[])n?n=!1:t+=",",t+=na(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){let t=Object.keys(e.fields||{}).sort(),n="{",r=!0;for(let i of t)r?r=!1:n+=",",n+=`${i}:${na(e.fields[i])}`;return n+"}"}(e.mapValue):E(61005,{value:e})}function no(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function nl(e){return!!e&&"integerValue"in e}function nu(e){return!!e&&"arrayValue"in e}function nc(e){return!!e&&"nullValue"in e}function nh(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function nd(e){return!!e&&"mapValue"in e}function nf(e){return(e?.mapValue?.fields||{})[t5]?.stringValue===t8}function nm(e){if(e.geoPointValue)return{geoPointValue:{...e.geoPointValue}};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:{...e.timestampValue}};if(e.mapValue){let t={mapValue:{fields:{}}};return tV(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=nm(n)),t}if(e.arrayValue){let t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=nm(e.arrayValue.values[n]);return t}return{...e}}function ng(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===t3}let np={mapValue:{fields:{[t5]:{stringValue:t8},[t9]:{arrayValue:{}}}}};function ny(e,t){let n=nr(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function nw(e,t){let n=nr(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}/**
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
 */class nv{constructor(e){this.value=e}static empty(){return new nv({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(!nd(t=(t.mapValue.fields||{})[e.get(n)]))return null;return(t=(t.mapValue.fields||{})[e.lastSegment()])||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=nm(t)}setAll(e){let t=j.emptyPath(),n={},r=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){let e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=nm(e):r.push(i.lastSegment())});let i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){let t=this.field(e.popLast());nd(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return nt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];nd(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){for(let r of(tV(t,(t,n)=>e[t]=n),n))delete e[r]}clone(){return new nv(nm(this.value))}}/**
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
 */class nI{constructor(e,t,n,r,i,s,a){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=a}static newInvalidDocument(e){return new nI(e,0,ei.min(),ei.min(),ei.min(),nv.empty(),0)}static newFoundDocument(e,t,n,r){return new nI(e,1,t,ei.min(),n,r,0)}static newNoDocument(e,t){return new nI(e,2,t,ei.min(),ei.min(),nv.empty(),0)}static newUnknownDocument(e,t){return new nI(e,3,t,ei.min(),ei.min(),nv.empty(),2)}convertToFoundDocument(e,t){return this.createTime.isEqual(ei.min())&&(2===this.documentType||0===this.documentType)&&(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=nv.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=nv.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ei.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof nI&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new nI(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class nT{constructor(e,t){this.position=e,this.inclusive=t}}function nE(e,t,n){let r=0;for(let i=0;i<e.position.length;i++){let s=t[i],a=e.position[i];if(r=s.field.isKeyField()?Q.comparator(Q.fromName(a.referenceValue),n.key):nr(a,n.data.field(s.field)),"desc"===s.dir&&(r*=-1),0!==r)break}return r}function n_(e,t){if(null===e)return null===t;if(null===t||e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!nt(e.position[n],t.position[n]))return!1;return!0}/**
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
 */class nb{constructor(e,t="asc"){this.field=e,this.dir=t}}/**
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
 */class nS{}class nx extends nS{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new nR(e,t,n):"array-contains"===t?new nM(e,n):"in"===t?new nL(e,n):"not-in"===t?new nU(e,n):"array-contains-any"===t?new nq(e,n):new nx(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new nP(e,n):new nF(e,n)}matches(e){let t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(nr(t,this.value)):null!==t&&ne(this.value)===ne(t)&&this.matchesComparison(nr(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return E(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class nA extends nS{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new nA(e,t)}matches(e){return nC(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.Pe||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function nC(e){return"and"===e.op}function nD(e){return"or"===e.op}function nN(e){return nk(e)&&nC(e)}function nk(e){for(let t of e.filters)if(t instanceof nA)return!1;return!0}function nV(e,t){let n=e.filters.concat(t);return nA.create(n,e.op)}class nR extends nx{constructor(e,t,n){super(e,t,n),this.key=Q.fromName(n.referenceValue)}matches(e){let t=Q.comparator(e.key,this.key);return this.matchesComparison(t)}}class nP extends nx{constructor(e,t){super(e,"in",t),this.keys=nO("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class nF extends nx{constructor(e,t){super(e,"not-in",t),this.keys=nO("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function nO(e,t){return(t.arrayValue?.values||[]).map(e=>Q.fromName(e.referenceValue))}class nM extends nx{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return nu(t)&&nn(t.arrayValue,this.value)}}class nL extends nx{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return null!==t&&nn(this.value.arrayValue,t)}}class nU extends nx{constructor(e,t){super(e,"not-in",t)}matches(e){if(nn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!nn(this.value.arrayValue,t)}}class nq extends nx{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!nu(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>nn(this.value.arrayValue,e))}}/**
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
 */class nB{constructor(e,t=null,n=[],r=[],i=null,s=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=a,this.Te=null}}function nz(e,t=null,n=[],r=[],i=null,s=null,a=null){return new nB(e,t,n,r,i,s,a)}function nK(e){if(null===e.Te){let t=e.path.canonicalString();null!==e.collectionGroup&&(t+="|cg:"+e.collectionGroup),t+="|f:"+e.filters.map(e=>(function e(t){if(t instanceof nx)return t.field.canonicalString()+t.op.toString()+na(t.value);if(nN(t))return t.filters.map(t=>e(t)).join(",");{let n=t.filters.map(t=>e(t)).join(",");return`${t.op}(${n})`}})(e)).join(",")+"|ob:"+e.orderBy.map(e=>e.field.canonicalString()+e.dir).join(","),eP(e.limit)||(t+="|l:"+e.limit),e.startAt&&(t+="|lb:"+(e.startAt.inclusive?"b:":"a:")+e.startAt.position.map(e=>na(e)).join(",")),e.endAt&&(t+="|ub:"+(e.endAt.inclusive?"a:":"b:")+e.endAt.position.map(e=>na(e)).join(",")),e.Te=t}return e.Te}function n$(e,t){if(e.limit!==t.limit||e.orderBy.length!==t.orderBy.length)return!1;for(let i=0;i<e.orderBy.length;i++){var n,r;if(n=e.orderBy[i],r=t.orderBy[i],!(n.dir===r.dir&&n.field.isEqual(r.field)))return!1}if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!function e(t,n){return t instanceof nx?n instanceof nx&&t.op===n.op&&t.field.isEqual(n.field)&&nt(t.value,n.value):t instanceof nA?n instanceof nA&&t.op===n.op&&t.filters.length===n.filters.length&&t.filters.reduce((t,r,i)=>t&&e(r,n.filters[i]),!0):void E(19439)}(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!n_(e.startAt,t.startAt)&&n_(e.endAt,t.endAt)}function nG(e){return Q.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function nj(e,t){return e.filters.filter(e=>e instanceof nx&&e.field.isEqual(t))}function nQ(e,t,n){let r=t7,i=!0;for(let n of nj(e,t)){let e=t7,t=!0;switch(n.op){case"<":case"<=":var s;e="nullValue"in(s=n.value)?t7:"booleanValue"in s?{booleanValue:!1}:"integerValue"in s||"doubleValue"in s?{doubleValue:NaN}:"timestampValue"in s?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in s?{stringValue:""}:"bytesValue"in s?{bytesValue:""}:"referenceValue"in s?no(t4.empty(),Q.empty()):"geoPointValue"in s?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in s?{arrayValue:{}}:"mapValue"in s?nf(s)?np:{mapValue:{}}:E(35942,{value:s});break;case"==":case"in":case">=":e=n.value;break;case">":e=n.value,t=!1;break;case"!=":case"not-in":e=t7}0>ny({value:r,inclusive:i},{value:e,inclusive:t})&&(r=e,i=t)}if(null!==n){for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){let e=n.position[s];0>ny({value:r,inclusive:i},{value:e,inclusive:n.inclusive})&&(r=e,i=n.inclusive);break}}return{value:r,inclusive:i}}function nH(e,t,n){let r=t6,i=!0;for(let n of nj(e,t)){let e=t6,t=!0;switch(n.op){case">=":case">":var s;e="nullValue"in(s=n.value)?{booleanValue:!1}:"booleanValue"in s?{doubleValue:NaN}:"integerValue"in s||"doubleValue"in s?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in s?{stringValue:""}:"stringValue"in s?{bytesValue:""}:"bytesValue"in s?no(t4.empty(),Q.empty()):"referenceValue"in s?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in s?{arrayValue:{}}:"arrayValue"in s?np:"mapValue"in s?nf(s)?{mapValue:{}}:t6:E(61959,{value:s}),t=!1;break;case"==":case"in":case"<=":e=n.value;break;case"<":e=n.value,t=!1;break;case"!=":case"not-in":e=t6}nw({value:r,inclusive:i},{value:e,inclusive:t})>0&&(r=e,i=t)}if(null!==n){for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){let e=n.position[s];nw({value:r,inclusive:i},{value:e,inclusive:n.inclusive})>0&&(r=e,i=n.inclusive);break}}return{value:r,inclusive:i}}/**
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
 */class nW{constructor(e,t=null,n=[],r=[],i=null,s="F",a=null,o=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=a,this.endAt=o,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function nJ(e){return new nW(e)}function nY(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function nX(e){return Q.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function nZ(e){return null!==e.collectionGroup}function n0(e){if(null===e.Ie){let t;e.Ie=[];let n=new Set;for(let t of e.explicitOrderBy)e.Ie.push(t),n.add(t.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(t=new tL(j.comparator),e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t).forEach(t=>{n.has(t.canonicalString())||t.isKeyField()||e.Ie.push(new nb(t,r))}),n.has(j.keyField().canonicalString())||e.Ie.push(new nb(j.keyField(),r))}return e.Ie}function n1(e){return e.Ee||(e.Ee=n4(e,n0(e))),e.Ee}function n2(e){return e.Re||(e.Re=n4(e,e.explicitOrderBy)),e.Re}function n4(e,t){if("F"===e.limitType)return nz(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{let t="desc"===e.dir?"asc":"desc";return new nb(e.field,t)});let n=e.endAt?new nT(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new nT(e.startAt.position,e.startAt.inclusive):null;return nz(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}function n5(e,t,n){return new nW(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function n3(e,t){return n$(n1(e),n1(t))&&e.limitType===t.limitType}function n6(e){return`${nK(n1(e))}|lt:${e.limitType}`}function n8(e){var t;let n;return`Query(target=${n=(t=n1(e)).path.canonicalString(),null!==t.collectionGroup&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(e=>(function e(t){return t instanceof nx?`${t.field.canonicalString()} ${t.op} ${na(t.value)}`:t instanceof nA?t.op.toString()+" {"+t.getFilters().map(e).join(" ,")+"}":"Filter"})(e)).join(", ")}]`),eP(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(e=>`${e.field.canonicalString()} (${e.dir})`).join(", ")}]`),t.startAt&&(n+=", startAt: "+(t.startAt.inclusive?"b:":"a:")+t.startAt.position.map(e=>na(e)).join(",")),t.endAt&&(n+=", endAt: "+(t.endAt.inclusive?"a:":"b:")+t.endAt.position.map(e=>na(e)).join(",")),`Target(${n})`}; limitType=${e.limitType})`}function n9(e,t){return t.isFoundDocument()&&function(e,t){let n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):Q.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(let n of n0(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(let n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(!e.startAt||!!function(e,t,n){let r=nE(e,t,n);return e.inclusive?r<=0:r<0}(e.startAt,n0(e),t))&&(!e.endAt||!!function(e,t,n){let r=nE(e,t,n);return e.inclusive?r>=0:r>0}(e.endAt,n0(e),t))}function n7(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function re(e){return(t,n)=>{let r=!1;for(let i of n0(e)){let e=function(e,t,n){let r=e.field.isKeyField()?Q.comparator(t.key,n.key):function(e,t,n){let r=t.data.field(e),i=n.data.field(e);return null!==r&&null!==i?nr(r,i):E(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return -1*r;default:return E(19790,{direction:e.dir})}}(i,t,n);if(0!==e)return e;r=r||i.field.isKeyField()}return 0}}/**
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
 */class rt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n){for(let[t,r]of n)if(this.equalsFn(t,e))return r}}has(e){return void 0!==this.get(e)}set(e,t){let n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let n=0;n<r.length;n++)if(this.equalsFn(r[n][0],e))return void(r[n]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){tV(this.inner,(t,n)=>{for(let[t,r]of n)e(t,r)})}isEmpty(){return tP(this.inner)}size(){return this.innerSize}}/**
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
 */let rn=new tF(Q.comparator),rr=new tF(Q.comparator);function ri(...e){let t=rr;for(let n of e)t=t.insert(n.key,n);return t}function rs(e){let t=rr;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function ra(){return new rt(e=>e.toString(),(e,t)=>e.isEqual(t))}let ro=new tF(Q.comparator),rl=new tL(Q.comparator);function ru(...e){let t=rl;for(let n of e)t=t.add(n);return t}let rc=new tL(L);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rh(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:eF(t)?"-0":t}}function rd(e){return{integerValue:""+e}}function rf(e,t){return eO(t)?rd(t):rh(e,t)}/**
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
 */class rm{constructor(){this._=void 0}}function rg(e,t){return e instanceof rT?nl(t)||t&&"doubleValue"in t?t:{integerValue:0}:null}class rp extends rm{}class ry extends rm{constructor(e){super(),this.elements=e}}function rw(e,t){let n=r_(t);for(let t of e.elements)n.some(e=>nt(e,t))||n.push(t);return{arrayValue:{values:n}}}class rv extends rm{constructor(e){super(),this.elements=e}}function rI(e,t){let n=r_(t);for(let t of e.elements)n=n.filter(e=>!nt(e,t));return{arrayValue:{values:n}}}class rT extends rm{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function rE(e){return tj(e.integerValue||e.doubleValue)}function r_(e){return nu(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}/**
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
 */class rb{constructor(e,t){this.field=e,this.transform=t}}class rS{constructor(e,t){this.version=e,this.transformResults=t}}class rx{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new rx}static exists(e){return new rx(void 0,e)}static updateTime(e){return new rx(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function rA(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class rC{}function rD(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new rM(e.key,rx.none()):new rV(e.key,e.data,rx.none());{let n=e.data,r=nv.empty(),i=new tL(j.comparator);for(let e of t.fields)if(!i.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),i=i.add(e)}return new rR(e.key,r,new tB(i.toArray()),rx.none())}}function rN(e,t,n,r){return e instanceof rV?function(e,t,n,r){if(!rA(e.precondition,t))return n;let i=e.value.clone(),s=rO(e.fieldTransforms,r,t);return i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,n,r):e instanceof rR?function(e,t,n,r){if(!rA(e.precondition,t))return n;let i=rO(e.fieldTransforms,r,t),s=t.data;return(s.setAll(rP(e)),s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null===n)?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):rA(e.precondition,t)?(t.convertToNoDocument(t.version).setHasLocalMutations(),null):n}function rk(e,t){var n,r;return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||!(!n||!r)&&B(n,r,(e,t)=>{var n,r;return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof ry&&r instanceof ry||n instanceof rv&&r instanceof rv?B(n.elements,r.elements,nt):n instanceof rT&&r instanceof rT?nt(n.Ae,r.Ae):n instanceof rp&&r instanceof rp)})))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask))}class rV extends rC{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class rR extends rC{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function rP(e){let t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){let r=e.data.field(n);t.set(n,r)}}),t}function rF(e,t,n){let r=new Map;b(e.length===n.length,32656,{Ve:n.length,de:e.length});for(let s=0;s<n.length;s++){var i;let a=e[s],o=a.transform,l=t.data.field(a.field);r.set(a.field,(i=n[s],o instanceof ry?rw(o,l):o instanceof rv?rI(o,l):i))}return r}function rO(e,t,n){let r=new Map;for(let i of e){let e=i.transform,s=n.data.field(i.field);r.set(i.field,e instanceof rp?function(e,t){let n={fields:{[tW]:{stringValue:tH},[tY]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&tX(t)&&(t=tZ(t)),t&&(n.fields[tJ]=t),{mapValue:n}}(t,s):e instanceof ry?rw(e,s):e instanceof rv?rI(e,s):function(e,t){let n=rg(e,t),r=rE(n)+rE(e.Ae);return nl(n)&&nl(e.Ae)?rd(r):rh(e.serializer,r)}(e,s))}return r}class rM extends rC{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class rL extends rC{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class rU{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){let n=t.mutationResults;for(let t=0;t<this.mutations.length;t++){let i=this.mutations[t];if(i.key.isEqual(e.key)){var r;r=n[t],i instanceof rV?function(e,t,n){let r=e.value.clone(),i=rF(e.fieldTransforms,t,n.transformResults);r.setAll(i),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(i,e,r):i instanceof rR?function(e,t,n){if(!rA(e.precondition,t))return void t.convertToUnknownDocument(n.version);let r=rF(e.fieldTransforms,t,n.transformResults),i=t.data;i.setAll(rP(e)),i.setAll(r),t.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(i,e,r):function(e,t,n){t.convertToNoDocument(n.version).setHasCommittedMutations()}(0,e,r)}}}applyToLocalView(e,t){for(let n of this.baseMutations)n.key.isEqual(e.key)&&(t=rN(n,e,t,this.localWriteTime));for(let n of this.mutations)n.key.isEqual(e.key)&&(t=rN(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let n=ra();return this.mutations.forEach(r=>{let i=e.get(r.key),s=i.overlayedDocument,a=this.applyToLocalView(s,i.mutatedFields),o=rD(s,a=t.has(r.key)?null:a);null!==o&&n.set(r.key,o),s.isValidDocument()||s.convertToNoDocument(ei.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ru())}isEqual(e){return this.batchId===e.batchId&&B(this.mutations,e.mutations,(e,t)=>rk(e,t))&&B(this.baseMutations,e.baseMutations,(e,t)=>rk(e,t))}}class rq{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){b(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let r=ro,i=e.mutations;for(let e=0;e<i.length;e++)r=r.insert(i[e].key,n[e].version);return new rq(e,t,n,r)}}/**
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
 */class rB{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
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
 */class rz{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}/**
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
 */class rK{constructor(e,t){this.count=e,this.unchangedNames=t}}function r$(e){switch(e){case S.OK:return E(64938);case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0;default:return E(15467,{code:e})}}function rG(e){if(void 0===e)return v("GRPC error has no .code"),S.UNKNOWN;switch(e){case r.OK:return S.OK;case r.CANCELLED:return S.CANCELLED;case r.UNKNOWN:return S.UNKNOWN;case r.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case r.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case r.INTERNAL:return S.INTERNAL;case r.UNAVAILABLE:return S.UNAVAILABLE;case r.UNAUTHENTICATED:return S.UNAUTHENTICATED;case r.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case r.NOT_FOUND:return S.NOT_FOUND;case r.ALREADY_EXISTS:return S.ALREADY_EXISTS;case r.PERMISSION_DENIED:return S.PERMISSION_DENIED;case r.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case r.ABORTED:return S.ABORTED;case r.OUT_OF_RANGE:return S.OUT_OF_RANGE;case r.UNIMPLEMENTED:return S.UNIMPLEMENTED;case r.DATA_LOSS:return S.DATA_LOSS;default:return E(39323,{code:e})}}(i=r||(r={}))[i.OK=0]="OK",i[i.CANCELLED=1]="CANCELLED",i[i.UNKNOWN=2]="UNKNOWN",i[i.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",i[i.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",i[i.NOT_FOUND=5]="NOT_FOUND",i[i.ALREADY_EXISTS=6]="ALREADY_EXISTS",i[i.PERMISSION_DENIED=7]="PERMISSION_DENIED",i[i.UNAUTHENTICATED=16]="UNAUTHENTICATED",i[i.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",i[i.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",i[i.ABORTED=10]="ABORTED",i[i.OUT_OF_RANGE=11]="OUT_OF_RANGE",i[i.UNIMPLEMENTED=12]="UNIMPLEMENTED",i[i.INTERNAL=13]="INTERNAL",i[i.UNAVAILABLE=14]="UNAVAILABLE",i[i.DATA_LOSS=15]="DATA_LOSS";/**
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
 */let rj=null;/**
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
 */function rQ(){return new TextEncoder}/**
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
 */let rH=new h.Integer([4294967295,4294967295],0);function rW(e){let t=rQ().encode(e),n=new h.Md5;return n.update(t),new Uint8Array(n.digest())}function rJ(e){let t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),i=t.getUint32(8,!0),s=t.getUint32(12,!0);return[new h.Integer([n,r],0),new h.Integer([i,s],0)]}class rY{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new rX(`Invalid padding: ${t}`);if(n<0||e.length>0&&0===this.hashCount)throw new rX(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new rX(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=h.Integer.fromNumber(this.ge)}ye(e,t,n){let r=e.add(t.multiply(h.Integer.fromNumber(n)));return 1===r.compare(rH)&&(r=new h.Integer([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.ge)return!1;let[t,n]=rJ(rW(e));for(let e=0;e<this.hashCount;e++){let r=this.ye(t,n,e);if(!this.we(r))return!1}return!0}static create(e,t,n){let r=new rY(new Uint8Array(Math.ceil(e/8)),e%8==0?0:8-e%8,t);return n.forEach(e=>r.insert(e)),r}insert(e){if(0===this.ge)return;let[t,n]=rJ(rW(e));for(let e=0;e<this.hashCount;e++){let r=this.ye(t,n,e);this.Se(r)}}Se(e){this.bitmap[Math.floor(e/8)]|=1<<e%8}}class rX extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class rZ{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){let r=new Map;return r.set(e,r0.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new rZ(ei.min(),r,new tF(L),rn,ru())}}class r0{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new r0(n,t,ru(),ru(),ru())}}/**
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
 */class r1{constructor(e,t,n,r){this.be=e,this.removedTargetIds=t,this.key=n,this.De=r}}class r2{constructor(e,t){this.targetId=e,this.Ce=t}}class r4{constructor(e,t,n=tK.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class r5{constructor(){this.ve=0,this.Fe=r8(),this.Me=tK.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return 0!==this.ve}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=ru(),t=ru(),n=ru();return this.Fe.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:E(38017,{changeType:i})}}),new r0(this.Me,this.xe,e,t,n)}Ke(){this.Oe=!1,this.Fe=r8()}qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,b(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class r3{constructor(e){this.Ge=e,this.ze=new Map,this.je=rn,this.Je=r6(),this.He=r6(),this.Ze=new tF(L)}Xe(e){for(let t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(let t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{let n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.We(),n.Ne||n.Ke(),n.Le(e.resumeToken);break;case 2:n.We(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.Qe(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:E(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((e,n)=>{this.rt(n)&&t(n)})}st(e){let t=e.targetId,n=e.Ce.count,r=this.ot(t);if(r){let i=r.target;if(nG(i)){if(0===n){let e=new Q(i.path);this.et(t,e,nI.newNoDocument(e,ei.min()))}else b(1===n,20013,{expectedCount:n})}else{let r=this._t(t);if(r!==n){let n=this.ut(e),i=n?this.ct(n,e,r):1;0!==i&&(this.it(t),this.Ze=this.Ze.insert(t,2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch")),rj?.o(function(e,t,n,r,i){let s={localCacheCount:e,existenceFilterCount:t.count,databaseId:n.database,projectId:n.projectId},a=t.unchangedNames;return a&&(s.bloomFilter={applied:0===i,hashCount:a?.hashCount??0,bitmapLength:a?.bits?.bitmap?.length??0,padding:a?.bits?.padding??0,mightContain:e=>r?.mightContain(e)??!1}),s}(r,e.Ce,this.Ge.ht(),n,i))}}}}ut(e){let t,n;let r=e.Ce.unchangedNames;if(!r||!r.bits)return null;let{bits:{bitmap:i="",padding:s=0},hashCount:a=0}=r;try{t=tQ(i).toUint8Array()}catch(e){if(e instanceof tz)return I("Decoding the base64 bloom filter in existence filter failed ("+e.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw e}try{n=new rY(t,s,a)}catch(e){return I(e instanceof rX?"BloomFilter error: ":"Applying bloom filter failed: ",e),null}return 0===n.ge?null:n}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){let n=this.Ge.getRemoteKeysForTarget(t),r=0;return n.forEach(n=>{let i=this.Ge.ht(),s=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;e.mightContain(s)||(this.et(t,n,null),r++)}),r}Tt(e){let t=new Map;this.ze.forEach((n,r)=>{let i=this.ot(r);if(i){if(n.current&&nG(i.target)){let t=new Q(i.target.path);this.It(t).has(r)||this.Et(r,t)||this.et(r,t,nI.newNoDocument(t,e))}n.Be&&(t.set(r,n.ke()),n.Ke())}});let n=ru();this.He.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{let t=this.ot(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.je.forEach((t,n)=>n.setReadTime(e));let r=new rZ(e,t,this.Ze,this.je,n);return this.je=rn,this.Je=r6(),this.He=r6(),this.Ze=new tF(L),r}Ye(e,t){if(!this.rt(e))return;let n=this.Et(e,t.key)?2:0;this.nt(e).qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.Rt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;let r=this.nt(e);this.Et(e,t)?r.qe(t,1):r.Ue(t),this.He=this.He.insert(t,this.Rt(t).delete(e)),this.He=this.He.insert(t,this.Rt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){let t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new r5,this.ze.set(e,t)),t}Rt(e){let t=this.He.get(e);return t||(t=new tL(L),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new tL(L),this.Je=this.Je.insert(e,t)),t}rt(e){let t=null!==this.ot(e);return t||w("WatchChangeAggregator","Detected inactive target",e),t}ot(e){let t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new r5),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function r6(){return new tF(Q.comparator)}function r8(){return new tF(Q.comparator)}let r9={asc:"ASCENDING",desc:"DESCENDING"},r7={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},ie={and:"AND",or:"OR"};class it{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ir(e,t){return e.useProto3Json||eP(t)?t:{value:t}}function ii(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function is(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function ia(e){return b(!!e,49232),ei.fromTimestamp(function(e){let t=tG(e);return new er(t.seconds,t.nanos)}(e))}function io(e,t){return il(e,t).canonicalString()}function il(e,t){let n=new $(["projects",e.projectId,"databases",e.database]).child("documents");return void 0===t?n:n.child(t)}function iu(e){let t=$.fromString(e);return b(iC(t),10190,{key:t.toString()}),t}function ic(e,t){return io(e.databaseId,t.path)}function ih(e,t){let n=iu(t);if(n.get(1)!==e.databaseId.projectId)throw new x(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new x(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new Q(ip(n))}function id(e,t){return io(e.databaseId,t)}function im(e){let t=iu(e);return 4===t.length?$.emptyPath():ip(t)}function ig(e){return new $(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function ip(e){return b(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function iy(e,t,n){return{name:ic(e,t),fields:n.value.mapValue.fields}}function iw(e,t,n){let r={};t.transaction?.length&&(r.transaction=t.transaction);let i=t.executionTime?ia(t.executionTime):void 0;return r.executionTime=i,n&&(r.key=n.name?ih(e,n.name):void 0,r.fields=new nv({mapValue:{fields:n.fields}}),r.createTime=n.createTime?ia(n.createTime):void 0,r.updateTime=n.updateTime?ia(n.updateTime):void 0),r}function iv(e,t,n){let r=ih(e,t.name),i=ia(t.updateTime),s=t.createTime?ia(t.createTime):ei.min(),a=new nv({mapValue:{fields:t.fields}}),o=nI.newFoundDocument(r,i,s,a);return n&&o.setHasCommittedMutations(),n?o.setHasCommittedMutations():o}function iI(e,t){var n;let r;if(t instanceof rV)r={update:iy(e,t.key,t.value)};else if(t instanceof rM)r={delete:ic(e,t.key)};else if(t instanceof rR)r={update:iy(e,t.key,t.data),updateMask:function(e){let t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}(t.fieldMask)};else{if(!(t instanceof rL))return E(16599,{dt:t.type});r={verify:ic(e,t.key)}}return t.fieldTransforms.length>0&&(r.updateTransforms=t.fieldTransforms.map(e=>(function(e,t){let n=t.transform;if(n instanceof rp)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof ry)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof rv)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof rT)return{fieldPath:t.field.canonicalString(),increment:n.Ae};throw E(20930,{transform:t.transform})})(0,e))),t.precondition.isNone||(r.currentDocument=void 0!==(n=t.precondition).updateTime?{updateTime:ii(e,n.updateTime.toTimestamp())}:void 0!==n.exists?{exists:n.exists}:E(27497)),r}function iT(e,t){var n;let r=t.currentDocument?void 0!==(n=t.currentDocument).updateTime?rx.updateTime(ia(n.updateTime)):void 0!==n.exists?rx.exists(n.exists):rx.none():rx.none(),i=t.updateTransforms?t.updateTransforms.map(t=>{let n;return n=null,"setToServerValue"in t?(b("REQUEST_TIME"===t.setToServerValue,16630,{proto:t}),n=new rp):"appendMissingElements"in t?n=new ry(t.appendMissingElements.values||[]):"removeAllFromArray"in t?n=new rv(t.removeAllFromArray.values||[]):"increment"in t?n=new rT(e,t.increment):E(16584,{proto:t}),new rb(j.fromServerFormat(t.fieldPath),n)}):[];if(t.update){t.update.name;let n=ih(e,t.update.name),s=new nv({mapValue:{fields:t.update.fields}});return t.updateMask?new rR(n,s,new tB((t.updateMask.fieldPaths||[]).map(e=>j.fromServerFormat(e))),r,i):new rV(n,s,r,i)}return t.delete?new rM(ih(e,t.delete),r):t.verify?new rL(ih(e,t.verify),r):E(1463,{proto:t})}function iE(e,t){return{documents:[id(e,t.path)]}}function i_(e,t){var n,r;let i;let s={structuredQuery:{}},a=t.path;null!==t.collectionGroup?(i=a,s.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=a.popLast(),s.structuredQuery.from=[{collectionId:a.lastSegment()}]),s.parent=id(e,i);let o=function(e){if(0!==e.length)return function e(t){return t instanceof nx?function(e){if("=="===e.op){if(nh(e.value))return{unaryFilter:{field:ix(e.field),op:"IS_NAN"}};if(nc(e.value))return{unaryFilter:{field:ix(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(nh(e.value))return{unaryFilter:{field:ix(e.field),op:"IS_NOT_NAN"}};if(nc(e.value))return{unaryFilter:{field:ix(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ix(e.field),op:r7[e.op],value:e.value}}}(t):t instanceof nA?function(t){let n=t.getFilters().map(t=>e(t));return 1===n.length?n[0]:{compositeFilter:{op:ie[t.op],filters:n}}}(t):E(54877,{filter:t})}(nA.create(e,"and"))}(t.filters);o&&(s.structuredQuery.where=o);let l=function(e){if(0!==e.length)return e.map(e=>({field:ix(e.field),direction:r9[e.dir]}))}(t.orderBy);l&&(s.structuredQuery.orderBy=l);let u=ir(e,t.limit);return null!==u&&(s.structuredQuery.limit=u),t.startAt&&(s.structuredQuery.startAt={before:(n=t.startAt).inclusive,values:n.position}),t.endAt&&(s.structuredQuery.endAt={before:!(r=t.endAt).inclusive,values:r.position}),{ft:s,parent:i}}function ib(e,t,n,r){let{ft:i,parent:s}=i_(e,t),a={},o=[],l=0;return n.forEach(e=>{let t=r?e.alias:"aggregate_"+l++;a[t]=e.alias,"count"===e.aggregateType?o.push({alias:t,count:{}}):"avg"===e.aggregateType?o.push({alias:t,avg:{field:ix(e.fieldPath)}}):"sum"===e.aggregateType&&o.push({alias:t,sum:{field:ix(e.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:o,structuredQuery:i.structuredQuery},parent:i.parent},gt:a,parent:s}}function iS(e){var t;let n,r=im(e.parent),i=e.structuredQuery,s=i.from?i.from.length:0,a=null;if(s>0){b(1===s,65062);let e=i.from[0];e.allDescendants?a=e.collectionId:r=r.child(e.collectionId)}let o=[];i.where&&(o=function(e){let t=function e(t){return void 0!==t.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":let t=iA(e.unaryFilter.field);return nx.create(t,"==",{doubleValue:NaN});case"IS_NULL":let n=iA(e.unaryFilter.field);return nx.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let r=iA(e.unaryFilter.field);return nx.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let i=iA(e.unaryFilter.field);return nx.create(i,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return E(61313);default:return E(60726)}}(t):void 0!==t.fieldFilter?nx.create(iA(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return E(58110);default:return E(50506)}}(t.fieldFilter.op),t.fieldFilter.value):void 0!==t.compositeFilter?nA.create(t.compositeFilter.filters.map(t=>e(t)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return E(1026)}}(t.compositeFilter.op)):E(30097,{filter:t})}(e);return t instanceof nA&&nN(t)?t.getFilters():[t]}(i.where));let l=[];i.orderBy&&(l=i.orderBy.map(e=>new nb(iA(e.field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(e.direction))));let u=null;i.limit&&(u=eP(n="object"==typeof(t=i.limit)?t.value:t)?null:n);let c=null;i.startAt&&(c=function(e){let t=!!e.before;return new nT(e.values||[],t)}(i.startAt));let h=null;return i.endAt&&(h=function(e){let t=!e.before;return new nT(e.values||[],t)}(i.endAt)),new nW(r,a,l,o,u,"F",c,h)}function ix(e){return{fieldPath:e.canonicalString()}}function iA(e){return j.fromServerFormat(e.fieldPath)}function iC(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}function iD(e){return!!e&&"function"==typeof e._toProto&&"ProtoValue"===e._protoValueType}/**
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
 */class iN{constructor(e,t,n,r,i=ei.min(),s=ei.min(),a=tK.EMPTY_BYTE_STRING,o=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=a,this.expectedCount=o}withSequenceNumber(e){return new iN(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new iN(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new iN(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new iN(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class ik{constructor(e){this.yt=e}}function iV(e,t){let n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:iR(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument()){var i;r.document={name:ic(i=e.yt,t.key),fields:t.data.value.mapValue.fields,updateTime:ii(i,t.version.toTimestamp()),createTime:ii(i,t.createTime.toTimestamp())}}else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:iP(t.version)};else{if(!t.isUnknownDocument())return E(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:iP(t.version)}}return r}function iR(e){let t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function iP(e){let t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function iF(e){let t=new er(e.seconds,e.nanoseconds);return ei.fromTimestamp(t)}function iO(e,t){let n=(t.baseMutations||[]).map(t=>iT(e.yt,t));for(let e=0;e<t.mutations.length-1;++e){let n=t.mutations[e];if(e+1<t.mutations.length&&void 0!==t.mutations[e+1].transform){let r=t.mutations[e+1];n.updateTransforms=r.transform.fieldTransforms,t.mutations.splice(e+1,1),++e}}let r=t.mutations.map(t=>iT(e.yt,t)),i=er.fromMillis(t.localWriteTimeMs);return new rU(t.batchId,i,n,r)}function iM(e){let t=iF(e.readTime),n=void 0!==e.lastLimboFreeSnapshotVersion?iF(e.lastLimboFreeSnapshotVersion):ei.min();return new iN(void 0!==e.query.documents?function(e){let t=e.documents.length;return b(1===t,1966,{count:t}),n1(nJ(im(e.documents[0])))}(e.query):n1(iS(e.query)),e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,tK.fromBase64String(e.resumeToken))}function iL(e,t){let n;let r=iP(t.snapshotVersion),i=iP(t.lastLimboFreeSnapshotVersion);n=nG(t.target)?iE(e.yt,t.target):i_(e.yt,t.target).ft;let s=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:nK(t.target),readTime:r,resumeToken:s,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:i,query:n}}function iU(e){let t=iS({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?n5(t,t.limit,"L"):t}function iq(e,t){return new rB(t.largestBatchId,iT(e.yt,t.overlayMutation))}function iB(e,t){let n=t.path.lastSegment();return[e,eM(t.path.popLast()),n]}function iz(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:iP(r.readTime),documentKey:eM(r.documentKey.path),largestBatchId:r.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iK{getBundleMetadata(e,t){return tN(e,ts).get(t).next(e=>{if(e)return{id:e.bundleId,createTime:iF(e.createTime),version:e.version}})}saveBundleMetadata(e,t){return tN(e,ts).put({bundleId:t.id,createTime:iP(ia(t.createTime)),version:t.version})}getNamedQuery(e,t){return tN(e,ta).get(t).next(e=>{if(e)return{name:e.name,query:iU(e.bundledQuery),readTime:iF(e.readTime)}})}saveNamedQuery(e,t){return tN(e,ta).put({name:t.name,readTime:iP(ia(t.readTime)),bundledQuery:t.bundledQuery})}}/**
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
 */class i${constructor(e,t){this.serializer=e,this.userId=t}static wt(e,t){return new i$(e,t.uid||"")}getOverlay(e,t){return tN(e,ty).get(iB(this.userId,t)).next(e=>e?iq(this.serializer,e):null)}getOverlays(e,t){let n=ra();return ew.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){let r=[];return n.forEach((n,i)=>{let s=new rB(t,i);r.push(this.St(e,s))}),ew.waitFor(r)}removeOverlaysForBatchId(e,t,n){let r=new Set;t.forEach(e=>r.add(eM(e.getCollectionPath())));let i=[];return r.forEach(t=>{let r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);i.push(tN(e,ty).X(tv,r))}),ew.waitFor(i)}getOverlaysForCollection(e,t,n){let r=ra(),i=eM(t),s=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return tN(e,ty).J(tv,s).next(e=>{for(let t of e){let e=iq(this.serializer,t);r.set(e.getKey(),e)}return r})}getOverlaysForCollectionGroup(e,t,n,r){let i;let s=ra(),a=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return tN(e,ty).ee({index:tT,range:a},(e,t,n)=>{let a=iq(this.serializer,t);s.size()<r||a.largestBatchId===i?(s.set(a.getKey(),a),i=a.largestBatchId):n.done()}).next(()=>s)}St(e,t){return tN(e,ty).put(function(e,t,n){let[r,i,s]=iB(t,n.mutation.key);return{userId:t,collectionPath:i,documentId:s,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:iI(e.yt,n.mutation)}}(this.serializer,this.userId,t))}}/**
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
 */class iG{bt(e){return tN(e,t_)}getSessionToken(e){return this.bt(e).get("sessionToken").next(e=>{let t=e?.value;return t?tK.fromUint8Array(t):tK.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.bt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
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
 */class ij{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(tj(e.integerValue));else if("doubleValue"in e){let n=tj(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),eF(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),"string"==typeof n&&(n=tG(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(tQ(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){let n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?ng(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):nf(e)?this.kt(e.mapValue,t):(this.Kt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Nt(t)):E(19022,{Ut:e})}Ot(e,t){this.Ft(t,25),this.$t(e,t)}$t(e,t){t.xt(e)}Kt(e,t){let n=e.fields||{};for(let e of(this.Ft(t,55),Object.keys(n)))this.Ot(e,t),this.Ct(n[e],t)}kt(e,t){let n=e.fields||{};this.Ft(t,53);let r=n[t9].arrayValue?.values?.length||0;this.Ft(t,15),t.Mt(tj(r)),this.Ot(t9,t),this.Ct(n[t9],t)}qt(e,t){let n=e.values||[];for(let e of(this.Ft(t,50),n))this.Ct(e,t)}Lt(e,t){this.Ft(t,37),Q.fromName(e).path.forEach(e=>{this.Ft(t,60),this.$t(e,t)})}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}function iQ(e){return Math.ceil((64-function(e){let t=0;for(let n=0;n<8;++n){let r=function(e){if(0===e)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}(255&e[n]);if(t+=r,8!==r)break}return t}(e))/8)}ij.Wt=new ij;class iH{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Qt(e){let t=e[Symbol.iterator](),n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){let t=e[Symbol.iterator](),n=t.next();for(;!n.done;)this.Jt(n.value),n=t.next();this.Ht()}Zt(e){for(let t of e){let e=t.charCodeAt(0);if(e<128)this.Gt(e);else if(e<2048)this.Gt(960|e>>>6),this.Gt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Gt(480|e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e);else{let e=t.codePointAt(0);this.Gt(240|e>>>18),this.Gt(128|63&e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e)}}this.zt()}Xt(e){for(let t of e){let e=t.charCodeAt(0);if(e<128)this.Jt(e);else if(e<2048)this.Jt(960|e>>>6),this.Jt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Jt(480|e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e);else{let e=t.codePointAt(0);this.Jt(240|e>>>18),this.Jt(128|63&e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e)}}this.Ht()}Yt(e){let t=this.en(e),n=iQ(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let e=t.length-n;e<t.length;++e)this.buffer[this.position++]=255&t[e]}nn(e){let t=this.en(e),n=iQ(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let e=t.length-n;e<t.length;++e)this.buffer[this.position++]=~(255&t[e])}rn(){this.sn(255),this.sn(255)}_n(){this.an(255),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){let t=function(e){let t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let e=1;e<t.length;++e)t[e]^=n?255:0;return t}Gt(e){let t=255&e;0===t?(this.sn(0),this.sn(255)):255===t?(this.sn(255),this.sn(0)):this.sn(t)}Jt(e){let t=255&e;0===t?(this.an(0),this.an(255)):255===t?(this.an(255),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Ht(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){let t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);let r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class iW{constructor(e){this.cn=e}Bt(e){this.cn.Qt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.Yt(e)}vt(){this.cn.rn()}}class iJ{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Xt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}}class iY{constructor(){this.cn=new iH,this.ascending=new iW(this.cn),this.descending=new iJ(this.cn)}seed(e){this.cn.seed(e)}ln(e){return 0===e?this.ascending:this.descending}un(){return this.cn.un()}reset(){this.cn.reset()}}/**
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
 */class iX{constructor(e,t,n,r){this.hn=e,this.Pn=t,this.Tn=n,this.In=r}En(){let e=this.In.length,t=0===e||255===this.In[e-1]?e+1:e,n=new Uint8Array(t);return n.set(this.In,0),t!==e?n.set([0],this.In.length):++n[n.length-1],new iX(this.hn,this.Pn,this.Tn,n)}Rn(e,t,n){return{indexId:this.hn,uid:e,arrayValue:i1(this.Tn),directionalValue:i1(this.In),orderedDocumentKey:i1(t),documentKey:n.path.toArray()}}An(e,t,n){let r=this.Rn(e,t,n);return[r.indexId,r.uid,r.arrayValue,r.directionalValue,r.orderedDocumentKey,r.documentKey]}}function iZ(e,t){let n=e.hn-t.hn;return 0!==n?n:0!==(n=i0(e.Tn,t.Tn))?n:0!==(n=i0(e.In,t.In))?n:Q.comparator(e.Pn,t.Pn)}function i0(e,t){for(let n=0;n<e.length&&n<t.length;++n){let r=e[n]-t[n];if(0!==r)return r}return e.length-t.length}function i1(e){return c.isSafariOrWebkit()?function(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t}(e):e}function i2(e){return"string"!=typeof e?e:function(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(e)}class i4{constructor(e){for(let t of(this.Vn=new tL((e,t)=>j.comparator(e.field,t.field)),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.dn=e.orderBy,this.mn=[],e.filters))t.isInequality()?this.Vn=this.Vn.add(t):this.mn.push(t)}get fn(){return this.Vn.size>1}gn(e){if(b(e.collectionGroup===this.collectionId,49279),this.fn)return!1;let t=ea(e);if(void 0!==t&&!this.pn(t))return!1;let n=eo(e),r=new Set,i=0,s=0;for(;i<n.length&&this.pn(n[i]);++i)r=r.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Vn.size>0){let e=this.Vn.getIterator().getNext();if(!r.has(e.field.canonicalString())){let t=n[i];if(!this.yn(e,t)||!this.wn(this.dn[s++],t))return!1}++i}for(;i<n.length;++i){let e=n[i];if(s>=this.dn.length||!this.wn(this.dn[s++],e))return!1}return!0}Sn(){if(this.fn)return null;let e=new tL(j.comparator),t=[];for(let n of this.mn)if(!n.field.isKeyField()){if("array-contains"===n.op||"array-contains-any"===n.op)t.push(new eu(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new eu(n.field,0))}}for(let n of this.dn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new eu(n.field,"asc"===n.dir?0:1)));return new es(es.UNKNOWN_ID,this.collectionId,t,ec.empty())}pn(e){for(let t of this.mn)if(this.yn(t,e))return!0;return!1}yn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;let n="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===n}wn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}function i5(e){return e instanceof nx}function i3(e){return e instanceof nA&&nN(e)}function i6(e){return i5(e)||i3(e)||function(e){if(e instanceof nA&&nD(e)){for(let t of e.getFilters())if(!i5(t)&&!i3(t))return!1;return!0}return!1}(e)}function i8(e,t){return b(e instanceof nx||e instanceof nA,38388),b(t instanceof nx||t instanceof nA,25473),i7(e instanceof nx?t instanceof nx?nA.create([e,t],"and"):i9(e,t):t instanceof nx?i9(t,e):function(e,t){if(b(e.filters.length>0&&t.filters.length>0,48005),nC(e)&&nC(t))return nV(e,t.getFilters());let n=nD(e)?e:t,r=nD(e)?t:e,i=n.filters.map(e=>i8(e,r));return nA.create(i,"or")}(e,t))}function i9(e,t){if(nC(t))return nV(t,e.getFilters());{let n=t.filters.map(t=>i8(e,t));return nA.create(n,"or")}}function i7(e){if(b(e instanceof nx||e instanceof nA,11850),e instanceof nx)return e;let t=e.getFilters();if(1===t.length)return i7(t[0]);if(nk(e))return e;let n=t.map(e=>i7(e)),r=[];return n.forEach(t=>{t instanceof nx?r.push(t):t instanceof nA&&(t.op===e.op?r.push(...t.filters):r.push(t))}),1===r.length?r[0]:nA.create(r,e.op)}/**
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
 */class se{constructor(){this.bn=new st}addToCollectionParentIndex(e,t){return this.bn.add(t),ew.resolve()}getCollectionParents(e,t){return ew.resolve(this.bn.getEntries(t))}addFieldIndex(e,t){return ew.resolve()}deleteFieldIndex(e,t){return ew.resolve()}deleteAllFieldIndexes(e){return ew.resolve()}createTargetIndexes(e,t){return ew.resolve()}getDocumentsMatchingTarget(e,t){return ew.resolve(null)}getIndexType(e,t){return ew.resolve(0)}getFieldIndexes(e,t){return ew.resolve([])}getNextCollectionGroupToUpdate(e){return ew.resolve(null)}getMinOffset(e,t){return ew.resolve(ef.min())}getMinOffsetFromCollectionGroup(e,t){return ew.resolve(ef.min())}updateCollectionGroup(e,t,n){return ew.resolve()}updateIndexEntries(e,t){return ew.resolve()}}class st{constructor(){this.index={}}add(e){let t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new tL($.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){let t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new tL($.comparator)).toArray()}}/**
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
 */let sn="IndexedDbIndexManager",sr=new Uint8Array(0);class si{constructor(e,t){this.databaseId=t,this.Dn=new st,this.Cn=new rt(e=>nK(e),(e,t)=>n$(e,t)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Dn.has(t)){let n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener(()=>{this.Dn.add(t)});let i={collectionId:n,parent:eM(r)};return tN(e,tn).put(i)}return ew.resolve()}getCollectionParents(e,t){let n=[],r=IDBKeyRange.bound([t,""],[t+"\0",""],!1,!0);return tN(e,tn).J(r).next(e=>{for(let r of e){if(r.collectionId!==t)break;n.push(eL(r.parent))}return n})}addFieldIndex(e,t){let n=tN(e,to),r={indexId:t.indexId,collectionGroup:t.collectionGroup,fields:t.fields.map(e=>[e.fieldPath.canonicalString(),e.kind])};delete r.indexId;let i=n.add(r);if(t.indexState){let n=tN(e,tu);return i.next(e=>{n.put(iz(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return i.next()}deleteFieldIndex(e,t){let n=tN(e,to),r=tN(e,tu),i=tN(e,tf);return n.delete(t.indexId).next(()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){let t=tN(e,to),n=tN(e,tf),r=tN(e,tu);return t.X().next(()=>n.X()).next(()=>r.X())}createTargetIndexes(e,t){return ew.forEach(this.vn(t),t=>this.getIndexType(e,t).next(n=>{if(0===n||1===n){let n=new i4(t).Sn();if(null!=n)return this.addFieldIndex(e,n)}}))}getDocumentsMatchingTarget(e,t){let n=tN(e,tf),r=!0,i=new Map;return ew.forEach(this.vn(t),t=>this.Fn(e,t).next(e=>{r&&(r=!!e),i.set(t,e)})).next(()=>{if(r){let e=ru(),r=[];return ew.forEach(i,(i,s)=>{w(sn,`Using index id=${i.indexId}|cg=${i.collectionGroup}|f=${i.fields.map(e=>`${e.fieldPath}:${e.kind}`).join(",")} to execute ${nK(t)}`);let a=function(e,t){let n=ea(t);if(void 0===n)return null;for(let t of nj(e,n.fieldPath))switch(t.op){case"array-contains-any":return t.value.arrayValue.values||[];case"array-contains":return[t.value]}return null}(s,i),o=function(e,t){let n=new Map;for(let r of eo(t))for(let t of nj(e,r.fieldPath))switch(t.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(s,i),l=function(e,t){let n=[],r=!0;for(let i of eo(t)){let t=0===i.kind?nQ(e,i.fieldPath,e.startAt):nH(e,i.fieldPath,e.startAt);n.push(t.value),r&&(r=t.inclusive)}return new nT(n,r)}(s,i),u=function(e,t){let n=[],r=!0;for(let i of eo(t)){let t=0===i.kind?nH(e,i.fieldPath,e.endAt):nQ(e,i.fieldPath,e.endAt);n.push(t.value),r&&(r=t.inclusive)}return new nT(n,r)}(s,i),c=this.Mn(i,s,l),h=this.Mn(i,s,u),d=this.xn(i,s,o),f=this.On(i.indexId,a,c,l.inclusive,h,u.inclusive,d);return ew.forEach(f,i=>n.Z(i,t.limit).next(t=>{t.forEach(t=>{let n=Q.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))})}))}).next(()=>r)}return ew.resolve(null)})}vn(e){let t=this.Cn.get(e);return t||(t=0===e.filters.length?[e]:(function(e){if(0===e.getFilters().length)return[];let t=function e(t){if(b(t instanceof nx||t instanceof nA,34018),t instanceof nx)return t;if(1===t.filters.length)return e(t.filters[0]);let n=t.filters.map(t=>e(t)),r=nA.create(n,t.op);return i6(r=i7(r))?r:(b(r instanceof nA,64498),b(nC(r),40251),b(r.filters.length>1,57927),r.filters.reduce((e,t)=>i8(e,t)))}(/**
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
 */function e(t){if(b(t instanceof nx||t instanceof nA,20012),t instanceof nx){if(t instanceof nL){let e=t.value.arrayValue?.values?.map(e=>nx.create(t.field,"==",e))||[];return nA.create(e,"or")}return t}let n=t.filters.map(t=>e(t));return nA.create(n,t.op)}(e));return b(i6(t),7391),i5(t)||i3(t)?[t]:t.getFilters()})(nA.create(e.filters,"and")).map(t=>nz(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt)),this.Cn.set(e,t)),t}On(e,t,n,r,i,s,a){let o=(null!=t?t.length:1)*Math.max(n.length,i.length),l=o/(null!=t?t.length:1),u=[];for(let c=0;c<o;++c){let o=t?this.Nn(t[c/l]):sr,h=this.Bn(e,o,n[c%l],r),d=this.Ln(e,o,i[c%l],s),f=a.map(t=>this.Bn(e,o,t,!0));u.push(...this.createRange(h,d,f))}return u}Bn(e,t,n,r){let i=new iX(e,Q.empty(),t,n);return r?i:i.En()}Ln(e,t,n,r){let i=new iX(e,Q.empty(),t,n);return r?i.En():i}Fn(e,t){let n=new i4(t),r=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next(e=>{let t=null;for(let r of e)n.gn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t})}getIndexType(e,t){let n=2,r=this.vn(t);return ew.forEach(r,t=>this.Fn(e,t).next(e=>{e?0!==n&&e.fields.length<function(e){let t=new tL(j.comparator),n=!1;for(let r of e.filters)for(let e of r.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?n=!0:t=t.add(e.field));for(let n of e.orderBy)n.field.isKeyField()||(t=t.add(n.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})).next(()=>null!==t.limit&&r.length>1&&2===n?1:n)}kn(e,t){let n=new iY;for(let r of eo(e)){let e=t.data.field(r.fieldPath);if(null==e)return null;let i=n.ln(r.kind);ij.Wt.Dt(e,i)}return n.un()}Nn(e){let t=new iY;return ij.Wt.Dt(e,t.ln(0)),t.un()}Kn(e,t){let n=new iY;return ij.Wt.Dt(no(this.databaseId,t),n.ln(function(e){let t=eo(e);return 0===t.length?0:t[t.length-1].kind}(e))),n.un()}xn(e,t,n){if(null===n)return[];let r=[];r.push(new iY);let i=0;for(let s of eo(e)){let e=n[i++];for(let n of r)if(this.qn(t,s.fieldPath)&&nu(e))r=this.Un(r,s,e);else{let t=n.ln(s.kind);ij.Wt.Dt(e,t)}}return this.$n(r)}Mn(e,t,n){return this.xn(e,t,n.position)}$n(e){let t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Un(e,t,n){let r=[...e],i=[];for(let e of n.arrayValue.values||[])for(let n of r){let r=new iY;r.seed(n.un()),ij.Wt.Dt(e,r.ln(t.kind)),i.push(r)}return i}qn(e,t){return!!e.filters.find(e=>e instanceof nx&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op))}getFieldIndexes(e,t){let n=tN(e,to),r=tN(e,tu);return(t?n.J(tl,IDBKeyRange.bound(t,t)):n.J()).next(e=>{let t=[];return ew.forEach(e,e=>r.get([e.indexId,this.uid]).next(n=>{t.push(function(e,t){let n=t?new ec(t.sequenceNumber,new ef(iF(t.readTime),new Q(eL(t.documentKey)),t.largestBatchId)):ec.empty(),r=e.fields.map(([e,t])=>new eu(j.fromServerFormat(e),t));return new es(e.indexId,e.collectionGroup,r,n)}(e,n))})).next(()=>t)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(e=>0===e.length?null:(e.sort((e,t)=>{let n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==n?n:L(e.collectionGroup,t.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(e,t,n){let r=tN(e,to),i=tN(e,tu);return this.Wn(e).next(e=>r.J(tl,IDBKeyRange.bound(t,t)).next(t=>ew.forEach(t,t=>i.put(iz(t.indexId,this.uid,e,n)))))}updateIndexEntries(e,t){let n=new Map;return ew.forEach(t,(t,r)=>{let i=n.get(t.collectionGroup);return(i?ew.resolve(i):this.getFieldIndexes(e,t.collectionGroup)).next(i=>(n.set(t.collectionGroup,i),ew.forEach(i,n=>this.Qn(e,t,n).next(t=>{let i=this.Gn(r,n);return t.isEqual(i)?ew.resolve():this.zn(e,r,n,t,i)}))))})}jn(e,t,n,r){return tN(e,tf).put(r.Rn(this.uid,this.Kn(n,t.key),t.key))}Jn(e,t,n,r){return tN(e,tf).delete(r.An(this.uid,this.Kn(n,t.key),t.key))}Qn(e,t,n){let r=tN(e,tf),i=new tL(iZ);return r.ee({index:tg,range:IDBKeyRange.only([n.indexId,this.uid,i1(this.Kn(n,t))])},(e,r)=>{i=i.add(new iX(n.indexId,t,i2(r.arrayValue),i2(r.directionalValue)))}).next(()=>i)}Gn(e,t){let n=new tL(iZ),r=this.kn(t,e);if(null==r)return n;let i=ea(t);if(null!=i){let s=e.data.field(i.fieldPath);if(nu(s))for(let i of s.arrayValue.values||[])n=n.add(new iX(t.indexId,e.key,this.Nn(i),r))}else n=n.add(new iX(t.indexId,e.key,sr,r));return n}zn(e,t,n,r,i){w(sn,"Updating index entries for document '%s'",t.key);let s=[];return function(e,t,n,r,i){let s=e.getIterator(),a=t.getIterator(),o=tq(s),l=tq(a);for(;o||l;){let e=!1,t=!1;if(o&&l){let r=n(o,l);r<0?t=!0:r>0&&(e=!0)}else null!=o?t=!0:e=!0;e?(r(l),l=tq(a)):t?(i(o),o=tq(s)):(o=tq(s),l=tq(a))}}(r,i,iZ,r=>{s.push(this.jn(e,t,n,r))},r=>{s.push(this.Jn(e,t,n,r))}),ew.waitFor(s)}Wn(e){let t=1;return tN(e,tu).ee({index:th,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(e,n,r)=>{r.done(),t=n.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((e,t)=>iZ(e,t)).filter((e,t,n)=>!t||0!==iZ(e,n[t-1]));let r=[];for(let i of(r.push(e),n)){let n=iZ(i,e),s=iZ(i,t);if(0===n)r[0]=e.En();else if(n>0&&s<0)r.push(i),r.push(i.En());else if(s>0)break}r.push(t);let i=[];for(let e=0;e<r.length;e+=2){if(this.Hn(r[e],r[e+1]))return[];let t=r[e].An(this.uid,sr,Q.empty()),n=r[e+1].An(this.uid,sr,Q.empty());i.push(IDBKeyRange.bound(t,n))}return i}Hn(e,t){return iZ(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(ss)}getMinOffset(e,t){return ew.mapArray(this.vn(t),t=>this.Fn(e,t).next(e=>e||E(44426))).next(ss)}}function ss(e){b(0!==e.length,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){let i=e[r].indexState.offset;0>em(i,t)&&(t=i),n<i.largestBatchId&&(n=i.largestBatchId)}return new ef(t.readTime,t.documentKey,n)}/**
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
 */let sa={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class so{static withCacheSize(e){return new so(e,so.DEFAULT_COLLECTION_PERCENTILE,so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sl(e,t,n){let r=e.store(eK),i=e.store(eH),s=[],a=IDBKeyRange.only(n.batchId),o=0,l=r.ee({range:a},(e,t,n)=>(o++,n.delete()));s.push(l.next(()=>{b(1===o,47070,{batchId:n.batchId})}));let u=[];for(let e of n.mutations){var c,h;let r=(c=e.key.path,h=n.batchId,[t,eM(c),h]);s.push(i.delete(r)),u.push(e.key)}return ew.waitFor(s).next(()=>u)}function su(e){let t;if(!e)return 0;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw E(14731);t=e.noDocument}return JSON.stringify(t).length}/**
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
 */so.DEFAULT_COLLECTION_PERCENTILE=10,so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,so.DEFAULT=new so(41943040,so.DEFAULT_COLLECTION_PERCENTILE,so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),so.DISABLED=new so(-1,0,0);class sc{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.Zn={}}static wt(e,t,n,r){return b(""!==e.uid,64387),new sc(e.isAuthenticated()?e.uid:"",t,n,r)}checkEmpty(e){let t=!0,n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return sd(e).ee({index:eG,range:n},(e,n,r)=>{t=!1,r.done()}).next(()=>t)}addMutationBatch(e,t,n,r){let i=tN(e,eH),s=sd(e);return s.add({}).next(a=>{b("number"==typeof a,49019);let o=new rU(a,t,n,r),l=function(e,t,n){let r=n.baseMutations.map(t=>iI(e.yt,t)),i=n.mutations.map(t=>iI(e.yt,t));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:i}}(this.serializer,this.userId,o),u=[],c=new tL((e,t)=>L(e.canonicalString(),t.canonicalString()));for(let e of r){let t=[this.userId,eM(e.key.path),a];c=c.add(e.key.path.popLast()),u.push(s.put(l)),u.push(i.put(t,eQ))}return c.forEach(t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))}),e.addOnCommittedListener(()=>{this.Zn[a]=o.keys()}),ew.waitFor(u).next(()=>o)})}lookupMutationBatch(e,t){return sd(e).get(t).next(e=>e?(b(e.userId===this.userId,48,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),iO(this.serializer,e)):null)}Xn(e,t){return this.Zn[t]?ew.resolve(this.Zn[t]):this.lookupMutationBatch(e,t).next(e=>{if(e){let n=e.keys();return this.Zn[t]=n,n}return null})}getNextMutationBatchAfterBatchId(e,t){let n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]),i=null;return sd(e).ee({index:eG,range:r},(e,t,r)=>{t.userId===this.userId&&(b(t.batchId>=n,47524,{Yn:n}),i=iO(this.serializer,t)),r.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){let t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]),n=-1;return sd(e).ee({index:eG,range:t,reverse:!0},(e,t,r)=>{n=t.batchId,r.done()}).next(()=>n)}getAllMutationBatches(e){let t=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return sd(e).J(eG,t).next(e=>e.map(e=>iO(this.serializer,e)))}getAllMutationBatchesAffectingDocumentKey(e,t){let n=[this.userId,eM(t.path)],r=IDBKeyRange.lowerBound(n),i=[];return tN(e,eH).ee({range:r},(n,r,s)=>{let[a,o,l]=n,u=eL(o);if(a===this.userId&&t.path.isEqual(u))return sd(e).get(l).next(e=>{if(!e)throw E(61480,{er:n,batchId:l});b(e.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:e.userId,batchId:l}),i.push(iO(this.serializer,e))});s.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new tL(L),r=[];return t.forEach(t=>{let i=[this.userId,eM(t.path)],s=IDBKeyRange.lowerBound(i),a=tN(e,eH).ee({range:s},(e,r,i)=>{let[s,a,o]=e,l=eL(a);s===this.userId&&t.path.isEqual(l)?n=n.add(o):i.done()});r.push(a)}),ew.waitFor(r).next(()=>this.tr(e,n))}getAllMutationBatchesAffectingQuery(e,t){let n=t.path,r=n.length+1,i=[this.userId,eM(n)],s=IDBKeyRange.lowerBound(i),a=new tL(L);return tN(e,eH).ee({range:s},(e,t,i)=>{let[s,o,l]=e,u=eL(o);s===this.userId&&n.isPrefixOf(u)?u.length===r&&(a=a.add(l)):i.done()}).next(()=>this.tr(e,a))}tr(e,t){let n=[],r=[];return t.forEach(t=>{r.push(sd(e).get(t).next(e=>{if(null===e)throw E(35274,{batchId:t});b(e.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),n.push(iO(this.serializer,e))}))}),ew.waitFor(r).next(()=>n)}removeMutationBatch(e,t){return sl(e.le,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.nr(t.batchId)}),ew.forEach(n,t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))}nr(e){delete this.Zn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return ew.resolve();let n=IDBKeyRange.lowerBound([this.userId]),r=[];return tN(e,eH).ee({range:n},(e,t,n)=>{if(e[0]===this.userId){let t=eL(e[1]);r.push(t)}else n.done()}).next(()=>{b(0===r.length,56720,{rr:r.map(e=>e.canonicalString())})})})}containsKey(e,t){return sh(e,this.userId,t)}ir(e){return tN(e,ez).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function sh(e,t,n){let r=[t,eM(n.path)],i=r[1],s=IDBKeyRange.lowerBound(r),a=!1;return tN(e,eH).ee({range:s,Y:!0},(e,n,r)=>{let[s,o,l]=e;s===t&&o===i&&(a=!0),r.done()}).next(()=>a)}function sd(e){return tN(e,eK)}/**
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
 */class sf{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new sf(0)}static ar(){return new sf(-1)}}/**
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
 */class sm{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.ur(e).next(t=>{let n=new sf(t.highestTargetId);return t.highestTargetId=n.next(),this.cr(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.ur(e).next(e=>ei.fromTimestamp(new er(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.ur(e).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.ur(e).next(r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.cr(e,r)))}addTargetData(e,t){return this.lr(e,t).next(()=>this.ur(e).next(n=>(n.targetCount+=1,this.hr(t,n),this.cr(e,n))))}updateTargetData(e,t){return this.lr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>tN(e,e4).delete(t.targetId)).next(()=>this.ur(e)).next(t=>(b(t.targetCount>0,8065),t.targetCount-=1,this.cr(e,t)))}removeTargets(e,t,n){let r=0,i=[];return tN(e,e4).ee((s,a)=>{let o=iM(a);o.sequenceNumber<=t&&null===n.get(o.targetId)&&(r++,i.push(this.removeTargetData(e,o)))}).next(()=>ew.waitFor(i)).next(()=>r)}forEachTarget(e,t){return tN(e,e4).ee((e,n)=>{t(iM(n))})}ur(e){return tN(e,tt).get(te).next(e=>(b(null!==e,2888),e))}cr(e,t){return tN(e,tt).put(te,t)}lr(e,t){return tN(e,e4).put(iL(this.serializer,t))}hr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.ur(e).next(e=>e.targetCount)}getTargetData(e,t){let n=nK(t),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]),i=null;return tN(e,e4).ee({range:r,index:e5},(e,n,r)=>{let s=iM(n);n$(t,s.target)&&(i=s,r.done())}).next(()=>i)}addMatchingKeys(e,t,n){let r=[],i=sg(e);return t.forEach(t=>{let s=eM(t.path);r.push(i.put({targetId:n,path:s})),r.push(this.referenceDelegate.addReference(e,n,t))}),ew.waitFor(r)}removeMatchingKeys(e,t,n){let r=sg(e);return ew.forEach(t,t=>{let i=eM(t.path);return ew.waitFor([r.delete([n,i]),this.referenceDelegate.removeReference(e,n,t)])})}removeMatchingKeysForTargetId(e,t){let n=sg(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){let n=IDBKeyRange.bound([t],[t+1],!1,!0),r=sg(e),i=ru();return r.ee({range:n,Y:!0},(e,t,n)=>{let r=new Q(eL(e[1]));i=i.add(r)}).next(()=>i)}containsKey(e,t){let n=eM(t.path),r=IDBKeyRange.bound([n],[n+"\0"],!1,!0),i=0;return sg(e).ee({index:e9,Y:!0,range:r},([e,t],n,r)=>{0!==e&&(i++,r.done())}).next(()=>i>0)}At(e,t){return tN(e,e4).get(t).next(e=>e?iM(e):null)}}function sg(e){return tN(e,e6)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sp="LruGarbageCollector";function sy([e,t],[n,r]){let i=L(e,n);return 0===i?L(t,r):i}class sw{constructor(e){this.Pr=e,this.buffer=new tL(sy),this.Tr=0}Ir(){return++this.Tr}Er(e){let t=[e,this.Ir()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{let e=this.buffer.last();0>sy(t,e)&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class sv{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return null!==this.Rr}Ar(e){w(sp,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){eS(e)?w(sp,"Ignoring IndexedDB error during garbage collection: ",e):await ey(e)}await this.Ar(3e5)})}}class sI{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return ew.resolve(eR.ce);let n=new sw(t);return this.Vr.forEachTarget(e,e=>n.Er(e.sequenceNumber)).next(()=>this.Vr.mr(e,e=>n.Er(e))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return -1===this.params.cacheSizeCollectionThreshold?(w("LruGarbageCollector","Garbage collection skipped; disabled"),ew.resolve(sa)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(w("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),sa):this.gr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let n,r,i,s,a,o,l;let u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(w("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,s=Date.now(),this.nthSequenceNumber(e,r))).next(r=>(n=r,a=Date.now(),this.removeTargets(e,n,t))).next(t=>(i=t,o=Date.now(),this.removeOrphanedDocuments(e,n))).next(e=>(l=Date.now(),y()<=d.LogLevel.DEBUG&&w("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${s-u}ms
	Determined least recently used ${r} in `+(a-s)+"ms\n"+`	Removed ${i} targets in `+(o-a)+"ms\n"+`	Removed ${e} documents in `+(l-o)+"ms\n"+`Total Duration: ${l-u}ms`),ew.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:e})))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sT{constructor(e,t){this.db=e,this.garbageCollector=new sI(this,t)}dr(e){let t=this.pr(e);return this.db.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}pr(e){let t=0;return this.mr(e,e=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}mr(e,t){return this.yr(e,(e,n)=>t(n))}addReference(e,t,n){return sE(e,n)}removeReference(e,t,n){return sE(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return sE(e,t)}wr(e,t){let n;return n=!1,tN(e,ez).te(r=>sh(e,r,t).next(e=>(e&&(n=!0),ew.resolve(!e)))).next(()=>n)}removeOrphanedDocuments(e,t){let n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[],i=0;return this.yr(e,(s,a)=>{if(a<=t){let t=this.wr(e,s).next(t=>{if(!t)return i++,n.getEntry(e,s).next(()=>(n.removeEntry(s,ei.min()),sg(e).delete([0,eM(s.path)])))});r.push(t)}}).next(()=>ew.waitFor(r)).next(()=>n.apply(e)).next(()=>i)}removeTarget(e,t){let n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return sE(e,t)}yr(e,t){let n=sg(e),r,i=eR.ce;return n.ee({index:e9},([e,n],{path:s,sequenceNumber:a})=>{0===e?(i!==eR.ce&&t(new Q(eL(r)),i),i=a,r=s):i=eR.ce}).next(()=>{i!==eR.ce&&t(new Q(eL(r)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function sE(e,t){var n;return sg(e).put((n=e.currentSequenceNumber,{targetId:0,path:eM(t.path),sequenceNumber:n}))}/**
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
 */class s_{constructor(){this.changes=new rt(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,nI.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let n=this.changes.get(t);return void 0!==n?ew.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class sb{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return tN(e,eW).put(n)}removeEntry(e,t,n){return tN(e,eW).delete(function(e,t){let n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],iR(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.Sr(e,n)))}getEntry(e,t){let n=nI.newInvalidDocument(t);return tN(e,eW).ee({index:eY,range:IDBKeyRange.only(sx(t))},(e,r)=>{n=this.br(t,r)}).next(()=>n)}Dr(e,t){let n={size:0,document:nI.newInvalidDocument(t)};return tN(e,eW).ee({index:eY,range:IDBKeyRange.only(sx(t))},(e,r)=>{n={document:this.br(t,r),size:su(r)}}).next(()=>n)}getEntries(e,t){let n=rn;return this.Cr(e,t,(e,t)=>{let r=this.br(e,t);n=n.insert(e,r)}).next(()=>n)}vr(e,t){let n=rn,r=new tF(Q.comparator);return this.Cr(e,t,(e,t)=>{let i=this.br(e,t);n=n.insert(e,i),r=r.insert(e,su(t))}).next(()=>({documents:n,Fr:r}))}Cr(e,t,n){if(t.isEmpty())return ew.resolve();let r=new tL(sC);t.forEach(e=>r=r.add(e));let i=IDBKeyRange.bound(sx(r.first()),sx(r.last())),s=r.getIterator(),a=s.getNext();return tN(e,eW).ee({index:eY,range:i},(e,t,r)=>{let i=Q.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;a&&0>sC(a,i);)n(a,null),a=s.getNext();a&&a.isEqual(i)&&(n(a,t),a=s.hasNext()?s.getNext():null),a?r.j(sx(a)):r.done()}).next(()=>{for(;a;)n(a,null),a=s.hasNext()?s.getNext():null})}getDocumentsMatchingQuery(e,t,n,r,i){let s=t.path,a=[s.popLast().toArray(),s.lastSegment(),iR(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],o=[s.popLast().toArray(),s.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return tN(e,eW).J(IDBKeyRange.bound(a,o,!0)).next(e=>{i?.incrementDocumentReadCount(e.length);let n=rn;for(let i of e){let e=this.br(Q.fromSegments(i.prefixPath.concat(i.collectionGroup,i.documentId)),i);e.isFoundDocument()&&(n9(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n})}getAllFromCollectionGroup(e,t,n,r){let i=rn,s=sA(t,n),a=sA(t,ef.max());return tN(e,eW).ee({index:eZ,range:IDBKeyRange.bound(s,a,!0)},(e,t,n)=>{let s=this.br(Q.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);(i=i.insert(s.key,s)).size===r&&n.done()}).next(()=>i)}newChangeBuffer(e){return new sS(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(e=>e.byteSize)}getMetadata(e){return tN(e,e1).get(e2).next(e=>(b(!!e,20021),e))}Sr(e,t){return tN(e,e1).put(e2,t)}br(e,t){if(t){let e=function(e,t){let n;if(t.document)n=iv(e.yt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){let e=Q.fromSegments(t.noDocument.path),r=iF(t.noDocument.readTime);n=nI.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return E(56709);{let e=Q.fromSegments(t.unknownDocument.path),r=iF(t.unknownDocument.version);n=nI.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){let t=new er(e[0],e[1]);return ei.fromTimestamp(t)}(t.readTime)),n}(this.serializer,t);if(!(e.isNoDocument()&&e.version.isEqual(ei.min())))return e}return nI.newInvalidDocument(e)}}class sS extends s_{constructor(e,t){super(),this.Mr=e,this.trackRemovals=t,this.Or=new rt(e=>e.toString(),(e,t)=>e.isEqual(t))}applyChanges(e){let t=[],n=0,r=new tL((e,t)=>L(e.canonicalString(),t.canonicalString()));return this.changes.forEach((i,s)=>{let a=this.Or.get(i);if(t.push(this.Mr.removeEntry(e,i,a.readTime)),s.isValidDocument()){let o=iV(this.Mr.serializer,s);r=r.add(i.path.popLast());let l=su(o);n+=l-a.size,t.push(this.Mr.addEntry(e,i,o))}else if(n-=a.size,this.trackRemovals){let n=iV(this.Mr.serializer,s.convertToNoDocument(ei.min()));t.push(this.Mr.addEntry(e,i,n))}}),r.forEach(n=>{t.push(this.Mr.indexManager.addToCollectionParentIndex(e,n))}),t.push(this.Mr.updateMetadata(e,n)),ew.waitFor(t)}getFromCache(e,t){return this.Mr.Dr(e,t).next(e=>(this.Or.set(t,{size:e.size,readTime:e.document.readTime}),e.document))}getAllFromCache(e,t){return this.Mr.vr(e,t).next(({documents:e,Fr:t})=>(t.forEach((t,n)=>{this.Or.set(t,{size:n,readTime:e.get(t).readTime})}),e))}}function sx(e){let t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function sA(e,t){let n=t.documentKey.path.toArray();return[e,iR(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function sC(e,t){let n=e.path.toArray(),r=t.path.toArray(),i=0;for(let e=0;e<n.length-2&&e<r.length-2;++e)if(i=L(n[e],r[e]))return i;return(i=L(n.length,r.length))||(i=L(n[n.length-2],r[r.length-2]))||L(n[n.length-1],r[r.length-1])}/**
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
 *//**
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
 */class sD{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class sN{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&rN(n.mutation,e,tB.empty(),er.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,ru()).next(()=>t))}getLocalViewOfDocuments(e,t,n=ru()){let r=ra();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=ri();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){let n=ra();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,ru()))}populateOverlays(e,t,n){let r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let i=rn,s=ra(),a=ra();return t.forEach((e,t)=>{let a=n.get(t.key);r.has(t.key)&&(void 0===a||a.mutation instanceof rR)?i=i.insert(t.key,t):void 0!==a?(s.set(t.key,a.mutation.getFieldMask()),rN(a.mutation,t,a.mutation.getFieldMask(),er.now())):s.set(t.key,tB.empty())}),this.recalculateAndSaveOverlays(e,i).next(e=>(e.forEach((e,t)=>s.set(e,t)),t.forEach((e,t)=>a.set(e,new sD(t,s.get(e)??null))),a))}recalculateAndSaveOverlays(e,t){let n=ra(),r=new tF((e,t)=>e-t),i=ru();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(let i of e)i.keys().forEach(e=>{let s=t.get(e);if(null===s)return;let a=n.get(e)||tB.empty();a=i.applyToLocalView(s,a),n.set(e,a);let o=(r.get(i.batchId)||ru()).add(e);r=r.insert(i.batchId,o)})}).next(()=>{let s=[],a=r.getReverseIterator();for(;a.hasNext();){let r=a.getNext(),o=r.key,l=r.value,u=ra();l.forEach(e=>{if(!i.has(e)){let r=rD(t.get(e),n.get(e));null!==r&&u.set(e,r),i=i.add(e)}}),s.push(this.documentOverlayCache.saveOverlays(e,o,u))}return ew.waitFor(s)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return nX(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):nZ(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r)}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(i=>{let s=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):ew.resolve(ra()),a=-1,o=i;return s.next(t=>ew.forEach(t,(t,n)=>(a<n.largestBatchId&&(a=n.largestBatchId),i.get(t)?ew.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{o=o.insert(t,e)}))).next(()=>this.populateOverlays(e,t,i)).next(()=>this.computeViews(e,o,t,ru())).next(e=>({batchId:a,changes:rs(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new Q(t)).next(e=>{let t=ri();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){let i=t.collectionGroup,s=ri();return this.indexManager.getCollectionParents(e,i).next(a=>ew.forEach(a,a=>{let o=new nW(a.child(i),null,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,t.startAt,t.endAt);return this.getDocumentsMatchingCollectionQuery(e,o,n,r).next(e=>{e.forEach((e,t)=>{s=s.insert(e,t)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r))).next(e=>{i.forEach((t,n)=>{let r=n.getKey();null===e.get(r)&&(e=e.insert(r,nI.newInvalidDocument(r)))});let n=ri();return e.forEach((e,r)=>{let s=i.get(e);void 0!==s&&rN(s.mutation,r,tB.empty(),er.now()),n9(t,r)&&(n=n.insert(e,r))}),n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sk{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return ew.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,{id:t.id,version:t.version,createTime:ia(t.createTime)}),ew.resolve()}getNamedQuery(e,t){return ew.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,{name:t.name,query:iU(t.bundledQuery),readTime:ia(t.readTime)}),ew.resolve()}}/**
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
 */class sV{constructor(){this.overlays=new tF(Q.comparator),this.Lr=new Map}getOverlay(e,t){return ew.resolve(this.overlays.get(t))}getOverlays(e,t){let n=ra();return ew.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.St(e,t,r)}),ew.resolve()}removeOverlaysForBatchId(e,t,n){let r=this.Lr.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.Lr.delete(n)),ew.resolve()}getOverlaysForCollection(e,t,n){let r=ra(),i=t.length+1,s=new Q(t.child("")),a=this.overlays.getIteratorFrom(s);for(;a.hasNext();){let e=a.getNext().value,s=e.getKey();if(!t.isPrefixOf(s.path))break;s.path.length===i&&e.largestBatchId>n&&r.set(e.getKey(),e)}return ew.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new tF((e,t)=>e-t),s=this.overlays.getIterator();for(;s.hasNext();){let e=s.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=i.get(e.largestBatchId);null===t&&(t=ra(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}let a=ra(),o=i.getIterator();for(;o.hasNext()&&(o.getNext().value.forEach((e,t)=>a.set(e,t)),!(a.size()>=r)););return ew.resolve(a)}St(e,t,n){let r=this.overlays.get(n.key);if(null!==r){let e=this.Lr.get(r.largestBatchId).delete(n.key);this.Lr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new rB(t,n));let i=this.Lr.get(t);void 0===i&&(i=ru(),this.Lr.set(t,i)),this.Lr.set(t,i.add(n.key))}}/**
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
 */class sR{constructor(){this.sessionToken=tK.EMPTY_BYTE_STRING}getSessionToken(e){return ew.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,ew.resolve()}}/**
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
 */class sP{constructor(){this.kr=new tL(sF.Kr),this.qr=new tL(sF.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){let n=new sF(e,t);this.kr=this.kr.add(n),this.qr=this.qr.add(n)}$r(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Wr(new sF(e,t))}Qr(e,t){e.forEach(e=>this.removeReference(e,t))}Gr(e){let t=new Q(new $([])),n=new sF(t,e),r=new sF(t,e+1),i=[];return this.qr.forEachInRange([n,r],e=>{this.Wr(e),i.push(e.key)}),i}zr(){this.kr.forEach(e=>this.Wr(e))}Wr(e){this.kr=this.kr.delete(e),this.qr=this.qr.delete(e)}jr(e){let t=new Q(new $([])),n=new sF(t,e),r=new sF(t,e+1),i=ru();return this.qr.forEachInRange([n,r],e=>{i=i.add(e.key)}),i}containsKey(e){let t=new sF(e,0),n=this.kr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class sF{constructor(e,t){this.key=e,this.Jr=t}static Kr(e,t){return Q.comparator(e.key,t.key)||L(e.Jr,t.Jr)}static Ur(e,t){return L(e.Jr,t.Jr)||Q.comparator(e.key,t.key)}}/**
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
 */class sO{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Hr=new tL(sF.Kr)}checkEmpty(e){return ew.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){let i=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let s=new rU(i,t,n,r);for(let t of(this.mutationQueue.push(s),r))this.Hr=this.Hr.add(new sF(t.key,i)),this.indexManager.addToCollectionParentIndex(e,t.key.path.popLast());return ew.resolve(s)}lookupMutationBatch(e,t){return ew.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){let n=this.Xr(t+1),r=n<0?0:n;return ew.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return ew.resolve(0===this.mutationQueue.length?-1:this.Yn-1)}getAllMutationBatches(e){return ew.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let n=new sF(t,0),r=new sF(t,Number.POSITIVE_INFINITY),i=[];return this.Hr.forEachInRange([n,r],e=>{let t=this.Zr(e.Jr);i.push(t)}),ew.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new tL(L);return t.forEach(e=>{let t=new sF(e,0),r=new sF(e,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([t,r],e=>{n=n.add(e.Jr)})}),ew.resolve(this.Yr(n))}getAllMutationBatchesAffectingQuery(e,t){let n=t.path,r=n.length+1,i=n;Q.isDocumentKey(i)||(i=i.child(""));let s=new sF(new Q(i),0),a=new tL(L);return this.Hr.forEachWhile(e=>{let t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(a=a.add(e.Jr)),!0)},s),ew.resolve(this.Yr(a))}Yr(e){let t=[];return e.forEach(e=>{let n=this.Zr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){b(0===this.ei(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.Hr;return ew.forEach(t.mutations,r=>{let i=new sF(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Hr=n})}nr(e){}containsKey(e,t){let n=new sF(t,0),r=this.Hr.firstAfterOrEqual(n);return ew.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,ew.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Zr(e){let t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class sM{constructor(e){this.ti=e,this.docs=new tF(Q.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let n=t.key,r=this.docs.get(n),i=r?r.size:0,s=this.ti(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let n=this.docs.get(t);return ew.resolve(n?n.document.mutableCopy():nI.newInvalidDocument(t))}getEntries(e,t){let n=rn;return t.forEach(e=>{let t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():nI.newInvalidDocument(e))}),ew.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=rn,s=t.path,a=new Q(s.child("__id-9223372036854775808__")),o=this.docs.getIteratorFrom(a);for(;o.hasNext();){let{key:e,value:{document:a}}=o.getNext();if(!s.isPrefixOf(e.path))break;e.path.length>s.length+1||0>=em(ed(a),n)||(r.has(a.key)||n9(t,a))&&(i=i.insert(a.key,a.mutableCopy()))}return ew.resolve(i)}getAllFromCollectionGroup(e,t,n,r){E(9500)}ni(e,t){return ew.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new sL(this)}getSize(e){return ew.resolve(this.size)}}class sL extends s_{constructor(e){super(),this.Mr=e}applyChanges(e){let t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.Mr.addEntry(e,r)):this.Mr.removeEntry(n)}),ew.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}/**
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
 */class sU{constructor(e){this.persistence=e,this.ri=new rt(e=>nK(e),n$),this.lastRemoteSnapshotVersion=ei.min(),this.highestTargetId=0,this.ii=0,this.si=new sP,this.targetCount=0,this.oi=sf._r()}forEachTarget(e,t){return this.ri.forEach((e,n)=>t(n)),ew.resolve()}getLastRemoteSnapshotVersion(e){return ew.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return ew.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),ew.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.ii&&(this.ii=t),ew.resolve()}lr(e){this.ri.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.oi=new sf(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,ew.resolve()}updateTargetData(e,t){return this.lr(t),ew.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,ew.resolve()}removeTargets(e,t,n){let r=0,i=[];return this.ri.forEach((s,a)=>{a.sequenceNumber<=t&&null===n.get(a.targetId)&&(this.ri.delete(s),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),r++)}),ew.waitFor(i).next(()=>r)}getTargetCount(e){return ew.resolve(this.targetCount)}getTargetData(e,t){let n=this.ri.get(t)||null;return ew.resolve(n)}addMatchingKeys(e,t,n){return this.si.$r(t,n),ew.resolve()}removeMatchingKeys(e,t,n){this.si.Qr(t,n);let r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(t=>{i.push(r.markPotentiallyOrphaned(e,t))}),ew.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),ew.resolve()}getMatchingKeysForTargetId(e,t){let n=this.si.jr(t);return ew.resolve(n)}containsKey(e,t){return ew.resolve(this.si.containsKey(t))}}/**
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
 */class sq{constructor(e,t){this._i={},this.overlays={},this.ai=new eR(0),this.ui=!1,this.ui=!0,this.ci=new sR,this.referenceDelegate=e(this),this.li=new sU(this),this.indexManager=new se,this.remoteDocumentCache=new sM(e=>this.referenceDelegate.hi(e)),this.serializer=new ik(t),this.Pi=new sk(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new sV,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this._i[e.toKey()];return n||(n=new sO(t,this.referenceDelegate),this._i[e.toKey()]=n),n}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,n){w("MemoryPersistence","Starting transaction:",e);let r=new sB(this.ai.next());return this.referenceDelegate.Ti(),n(r).next(e=>this.referenceDelegate.Ii(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Ei(e,t){return ew.or(Object.values(this._i).map(n=>()=>n.containsKey(e,t)))}}class sB extends ep{constructor(e){super(),this.currentSequenceNumber=e}}class sz{constructor(e){this.persistence=e,this.Ri=new sP,this.Ai=null}static Vi(e){return new sz(e)}get di(){if(this.Ai)return this.Ai;throw E(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.di.delete(n.toString()),ew.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.di.add(n.toString()),ew.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),ew.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach(e=>this.di.add(e.toString()));let n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.di.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}Ti(){this.Ai=new Set}Ii(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return ew.forEach(this.di,n=>{let r=Q.fromPath(n);return this.mi(e,r).next(e=>{e||t.removeEntry(r,ei.min())})}).next(()=>(this.Ai=null,t.apply(e)))}updateLimboDocument(e,t){return this.mi(e,t).next(e=>{e?this.di.delete(t.toString()):this.di.add(t.toString())})}hi(e){return 0}mi(e,t){return ew.or([()=>ew.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class sK{constructor(e,t){this.persistence=e,this.fi=new rt(e=>eM(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=new sI(this,t)}static Vi(e,t){return new sK(e,t)}Ti(){}Ii(e){return ew.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){let t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}pr(e){let t=0;return this.mr(e,e=>{t++}).next(()=>t)}mr(e,t){return ew.forEach(this.fi,(n,r)=>this.wr(e,n,r).next(e=>e?ew.resolve():t(r)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0,r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.ni(e,r=>this.wr(e,r,t).next(e=>{e||(n++,i.removeEntry(r,ei.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),ew.resolve()}removeTarget(e,t){let n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),ew.resolve()}removeReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),ew.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),ew.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=function e(t){switch(ne(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:let n=tZ(t);return n?16+e(n):16;case 5:return 2*t.stringValue.length;case 6:return tQ(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return(t.arrayValue.values||[]).reduce((t,n)=>t+e(n),0);case 10:case 11:var r;let i;return r=t.mapValue,i=0,tV(r.fields,(t,n)=>{i+=t.length+e(n)}),i;default:throw E(13486,{value:t})}}(e.data.value)),t}wr(e,t,n){return ew.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{let e=this.fi.get(t);return ew.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s${constructor(e){this.serializer=e}k(e,t,n,r){let i=new eI("createOrUpgrade",t);n<1&&r>=1&&(!function(e){e.createObjectStore(eq)}(e),e.createObjectStore(ez,{keyPath:"userId"}),e.createObjectStore(eK,{keyPath:e$,autoIncrement:!0}).createIndex(eG,ej,{unique:!0}),e.createObjectStore(eH),sG(e),function(e){e.createObjectStore(eU)}(e));let s=ew.resolve();return n<3&&r>=3&&(0!==n&&(e.deleteObjectStore(e6),e.deleteObjectStore(e4),e.deleteObjectStore(tt),sG(e)),s=s.next(()=>(function(e){let t=e.store(tt),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:ei.min().toTimestamp(),targetCount:0};return t.put(te,n)})(i))),n<4&&r>=4&&(0!==n&&(s=s.next(()=>i.store(eK).J().next(t=>{e.deleteObjectStore(eK),e.createObjectStore(eK,{keyPath:e$,autoIncrement:!0}).createIndex(eG,ej,{unique:!0});let n=i.store(eK),r=t.map(e=>n.put(e));return ew.waitFor(r)}))),s=s.next(()=>{!function(e){e.createObjectStore(ti,{keyPath:"clientId"})}(e)})),n<5&&r>=5&&(s=s.next(()=>this.gi(i))),n<6&&r>=6&&(s=s.next(()=>((function(e){e.createObjectStore(e1)})(e),this.pi(i)))),n<7&&r>=7&&(s=s.next(()=>this.yi(i))),n<8&&r>=8&&(s=s.next(()=>this.wi(e,i))),n<9&&r>=9&&(s=s.next(()=>{e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")})),n<10&&r>=10&&(s=s.next(()=>this.Si(i))),n<11&&r>=11&&(s=s.next(()=>{(function(e){e.createObjectStore(ts,{keyPath:"bundleId"})})(e),function(e){e.createObjectStore(ta,{keyPath:"name"})}(e)})),n<12&&r>=12&&(s=s.next(()=>{!function(e){let t=e.createObjectStore(ty,{keyPath:tw});t.createIndex(tv,tI,{unique:!1}),t.createIndex(tT,tE,{unique:!1})}(e)})),n<13&&r>=13&&(s=s.next(()=>(function(e){let t=e.createObjectStore(eW,{keyPath:eJ});t.createIndex(eY,eX),t.createIndex(eZ,e0)})(e)).next(()=>this.bi(e,i)).next(()=>e.deleteObjectStore(eU))),n<14&&r>=14&&(s=s.next(()=>this.Di(e,i))),n<15&&r>=15&&(s=s.next(()=>{e.createObjectStore(to,{keyPath:"indexId",autoIncrement:!0}).createIndex(tl,"collectionGroup",{unique:!1}),e.createObjectStore(tu,{keyPath:tc}).createIndex(th,td,{unique:!1}),e.createObjectStore(tf,{keyPath:tm}).createIndex(tg,tp,{unique:!1})})),n<16&&r>=16&&(s=s.next(()=>{t.objectStore(tu).clear()}).next(()=>{t.objectStore(tf).clear()})),n<17&&r>=17&&(s=s.next(()=>{!function(e){e.createObjectStore(t_,{keyPath:"name"})}(e)})),n<18&&r>=18&&c.isSafariOrWebkit()&&(s=s.next(()=>{t.objectStore(tu).clear()}).next(()=>{t.objectStore(tf).clear()})),s}pi(e){let t=0;return e.store(eU).ee((e,n)=>{t+=su(n)}).next(()=>{let n={byteSize:t};return e.store(e1).put(e2,n)})}gi(e){let t=e.store(ez),n=e.store(eK);return t.J().next(t=>ew.forEach(t,t=>{let r=IDBKeyRange.bound([t.userId,-1],[t.userId,t.lastAcknowledgedBatchId]);return n.J(eG,r).next(n=>ew.forEach(n,n=>{b(n.userId===t.userId,18650,"Cannot process batch from unexpected user",{batchId:n.batchId});let r=iO(this.serializer,n);return sl(e,t.userId,r).next(()=>{})}))}))}yi(e){let t=e.store(e6),n=e.store(eU);return e.store(tt).get(te).next(e=>{let r=[];return n.ee((n,i)=>{let s=new $(n),a=[0,eM(s)];r.push(t.get(a).next(n=>n?ew.resolve():t.put({targetId:0,path:eM(s),sequenceNumber:e.highestListenSequenceNumber})))}).next(()=>ew.waitFor(r))})}wi(e,t){e.createObjectStore(tn,{keyPath:tr});let n=t.store(tn),r=new st,i=e=>{if(r.add(e)){let t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:eM(r)})}};return t.store(eU).ee({Y:!0},(e,t)=>i(new $(e).popLast())).next(()=>t.store(eH).ee({Y:!0},([e,t,n],r)=>i(eL(t).popLast())))}Si(e){let t=e.store(e4);return t.ee((e,n)=>{let r=iM(n),i=iL(this.serializer,r);return t.put(i)})}bi(e,t){let n=t.store(eU),r=[];return n.ee((e,n)=>{let i=t.store(eW),s=(n.document?new Q($.fromString(n.document.name).popFirst(5)):n.noDocument?Q.fromSegments(n.noDocument.path):n.unknownDocument?Q.fromSegments(n.unknownDocument.path):E(36783)).path.toArray(),a={prefixPath:s.slice(0,s.length-2),collectionGroup:s[s.length-2],documentId:s[s.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};r.push(i.put(a))}).next(()=>ew.waitFor(r))}Di(e,t){let n=t.store(eK),r=new sb(this.serializer),i=new sq(sz.Vi,this.serializer.yt);return n.J().next(e=>{let n=new Map;return e.forEach(e=>{let t=n.get(e.userId)??ru();iO(this.serializer,e).keys().forEach(e=>t=t.add(e)),n.set(e.userId,t)}),ew.forEach(n,(e,n)=>{let s=new m(n),a=i$.wt(this.serializer,s),o=i.getIndexManager(s);return new sN(r,sc.wt(s,this.serializer,o,i.referenceDelegate),a,o).recalculateAndSaveOverlaysForDocumentKeys(new tD(t,eR.ce),e).next()})})}}function sG(e){e.createObjectStore(e6,{keyPath:e8}).createIndex(e9,e7,{unique:!0}),e.createObjectStore(e4,{keyPath:"targetId"}).createIndex(e5,e3,{unique:!0}),e.createObjectStore(tt)}let sj="IndexedDbPersistence",sQ="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",sH="main";class sW{constructor(e,t,n,r,i,s,a,o,l,u,c=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Ci=i,this.window=s,this.document=a,this.Fi=l,this.Mi=u,this.xi=c,this.ai=null,this.ui=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Oi=null,this.inForeground=!1,this.Ni=null,this.Bi=null,this.Li=Number.NEGATIVE_INFINITY,this.ki=e=>Promise.resolve(),!sW.v())throw new x(S.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new sT(this,r),this.Ki=t+sH,this.serializer=new ik(o),this.qi=new eT(this.Ki,this.xi,new s$(this.serializer)),this.ci=new iG,this.li=new sm(this.referenceDelegate,this.serializer),this.remoteDocumentCache=new sb(this.serializer),this.Pi=new iK,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,!1===u&&v(sj,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.$i().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new x(S.FAILED_PRECONDITION,sQ);return this.Wi(),this.Qi(),this.Gi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.li.getHighestSequenceNumber(e))}).then(e=>{this.ai=new eR(e,this.Fi)}).then(()=>{this.ui=!0}).catch(e=>(this.qi&&this.qi.close(),Promise.reject(e)))}zi(e){return this.ki=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.qi.q(async t=>{null===t.newVersion&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Ci.enqueueAndForget(async()=>{this.started&&await this.$i()}))}$i(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>tN(e,ti).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.ji(e).next(e=>{e||(this.isPrimary=!1,this.Ci.enqueueRetryable(()=>this.ki(!1)))})}).next(()=>this.Ji(e)).next(t=>this.isPrimary&&!t?this.Hi(e).next(()=>!1):!!t&&this.Zi(e).next(()=>!0))).catch(e=>{if(eS(e))return w(sj,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return w(sj,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Ci.enqueueRetryable(()=>this.ki(e)),this.isPrimary=e})}ji(e){return tN(e,eq).get(eB).next(e=>ew.resolve(this.Xi(e)))}Yi(e){return tN(e,ti).delete(this.clientId)}async es(){if(this.isPrimary&&!this.ts(this.Li,18e5)){this.Li=Date.now();let e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{let t=tN(e,ti);return t.J().next(e=>{let n=this.ns(e,18e5),r=e.filter(e=>-1===n.indexOf(e));return ew.forEach(r,e=>t.delete(e.clientId)).next(()=>r)})}).catch(()=>[]);if(this.Ui)for(let t of e)this.Ui.removeItem(this.rs(t.clientId))}}Gi(){this.Bi=this.Ci.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.$i().then(()=>this.es()).then(()=>this.Gi()))}Xi(e){return!!e&&e.ownerId===this.clientId}Ji(e){return this.Mi?ew.resolve(!0):tN(e,eq).get(eB).next(t=>{if(null!==t&&this.ts(t.leaseTimestampMs,5e3)&&!this.ss(t.ownerId)){if(this.Xi(t)&&this.networkEnabled)return!0;if(!this.Xi(t)){if(!t.allowTabSynchronization)throw new x(S.FAILED_PRECONDITION,sQ);return!1}}return!(!this.networkEnabled||!this.inForeground)||tN(e,ti).J().next(e=>void 0===this.ns(e,5e3).find(e=>{if(this.clientId!==e.clientId){let t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))}).next(e=>(this.isPrimary!==e&&w(sj,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.ui=!1,this._s(),this.Bi&&(this.Bi.cancel(),this.Bi=null),this.us(),this.cs(),await this.qi.runTransaction("shutdown","readwrite",[eq,ti],e=>{let t=new tD(e,eR.ce);return this.Hi(t).next(()=>this.Yi(t))}),this.qi.close(),this.ls()}ns(e,t){return e.filter(e=>this.ts(e.updateTimeMs,t)&&!this.ss(e.clientId))}hs(){return this.runTransaction("getActiveClients","readonly",e=>tN(e,ti).J().next(e=>this.ns(e,18e5).map(e=>e.clientId)))}get started(){return this.ui}getGlobalsCache(){return this.ci}getMutationQueue(e,t){return sc.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new si(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return i$.wt(this.serializer,e)}getBundleCache(){return this.Pi}runTransaction(e,t,n){var r;let i;w(sj,"Starting transaction:",e);let s=18===(r=this.xi)?tC:17===r?tC:16===r?tA:15===r?tA:14===r?tx:13===r?tx:12===r?tS:11===r?tb:void E(60245);return this.qi.runTransaction(e,"readonly"===t?"readonly":"readwrite",s,r=>(i=new tD(r,this.ai?this.ai.next():eR.ce),"readwrite-primary"===t?this.ji(i).next(e=>!!e||this.Ji(i)).next(t=>{if(!t)throw v(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Ci.enqueueRetryable(()=>this.ki(!1)),new x(S.FAILED_PRECONDITION,eg);return n(i)}).next(e=>this.Zi(i).next(()=>e)):this.Ps(i).next(()=>n(i)))).then(e=>(i.raiseOnCommittedEvent(),e))}Ps(e){return tN(e,eq).get(eB).next(e=>{if(null!==e&&this.ts(e.leaseTimestampMs,5e3)&&!this.ss(e.ownerId)&&!this.Xi(e)&&!(this.Mi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new x(S.FAILED_PRECONDITION,sQ)})}Zi(e){let t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return tN(e,eq).put(eB,t)}static v(){return eT.v()}Hi(e){let t=tN(e,eq);return t.get(eB).next(e=>this.Xi(e)?(w(sj,"Releasing primary lease."),t.delete(eB)):ew.resolve())}ts(e,t){let n=Date.now();return!(e<n-t)&&(!(e>n)||(v(`Detected an update time that is in the future: ${e} > ${n}`),!1))}Wi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Ni=()=>{this.Ci.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.$i()))},this.document.addEventListener("visibilitychange",this.Ni),this.inForeground="visible"===this.document.visibilityState)}us(){this.Ni&&(this.document.removeEventListener("visibilitychange",this.Ni),this.Ni=null)}Qi(){"function"==typeof this.window?.addEventListener&&(this.Oi=()=>{this._s();let e=/(?:Version|Mobile)\/1[456]/;c.isSafari()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Ci.enterRestrictedMode(!0),this.Ci.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Oi))}cs(){this.Oi&&(this.window.removeEventListener("pagehide",this.Oi),this.Oi=null)}ss(e){try{let t=null!==this.Ui?.getItem(this.rs(e));return w(sj,`Client '${e}' ${t?"is":"is not"} zombied in LocalStorage`),t}catch(e){return v(sj,"Failed to get zombied client id.",e),!1}}_s(){if(this.Ui)try{this.Ui.setItem(this.rs(this.clientId),String(Date.now()))}catch(e){v("Failed to set zombie client id.",e)}}ls(){if(this.Ui)try{this.Ui.removeItem(this.rs(this.clientId))}catch(e){}}rs(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function sJ(e,t){let n=e.projectId;return e.isDefaultDatabase||(n+="."+e.database),"firestore/"+t+"/"+n+"/"}/**
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
 */class sY{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Ts=n,this.Is=r}static Es(e,t){let n=ru(),r=ru();for(let e of t.docChanges)switch(e.type){case 0:n=n.add(e.doc.key);break;case 1:r=r.add(e.doc.key)}return new sY(e,t.fromCache,n,r)}}/**
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
 */class sX{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class sZ{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=c.isSafari()?8:eE(c.getUA())>0?6:4}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,r){let i={result:null};return this.gs(e,t).next(e=>{i.result=e}).next(()=>{if(!i.result)return this.ps(e,t,r,n).next(e=>{i.result=e})}).next(()=>{if(i.result)return;let n=new sX;return this.ys(e,t,n).next(r=>{if(i.result=r,this.As)return this.ws(e,t,n,r.size)})}).next(()=>i.result)}ws(e,t,n,r){return n.documentReadCount<this.Vs?(y()<=d.LogLevel.DEBUG&&w("QueryEngine","SDK will not create cache indexes for query:",n8(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),ew.resolve()):(y()<=d.LogLevel.DEBUG&&w("QueryEngine","Query:",n8(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.ds*r?(y()<=d.LogLevel.DEBUG&&w("QueryEngine","The SDK decides to create cache indexes for query:",n8(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,n1(t))):ew.resolve())}gs(e,t){if(nY(t))return ew.resolve(null);let n=n1(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(n=n1(t=n5(t,null,"F"))),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{let i=ru(...r);return this.fs.getDocuments(e,i).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{let s=this.Ss(t,r);return this.bs(t,s,i,n.readTime)?this.gs(e,n5(t,null,"F")):this.Ds(e,s,t,n)}))})))}ps(e,t,n,r){return nY(t)||r.isEqual(ei.min())?ew.resolve(null):this.fs.getDocuments(e,n).next(i=>{let s=this.Ss(t,i);return this.bs(t,s,n,r)?ew.resolve(null):(y()<=d.LogLevel.DEBUG&&w("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),n8(t)),this.Ds(e,s,t,eh(r,-1)).next(e=>e))})}Ss(e,t){let n=new tL(re(e));return t.forEach((t,r)=>{n9(e,r)&&(n=n.add(r))}),n}bs(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;let i="F"===e.limitType?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}ys(e,t,n){return y()<=d.LogLevel.DEBUG&&w("QueryEngine","Using full collection scan to execute query:",n8(t)),this.fs.getDocumentsMatchingQuery(e,t,ef.min(),n)}Ds(e,t,n,r){return this.fs.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let s0="LocalStore";class s1{constructor(e,t,n,r){this.persistence=e,this.Cs=t,this.serializer=r,this.vs=new tF(L),this.Fs=new rt(e=>nK(e),n$),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(n)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new sN(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.vs))}}async function s2(e,t){return await e.persistence.runTransaction("Handle user change","readonly",n=>{let r;return e.mutationQueue.getAllMutationBatches(n).next(i=>(r=i,e.Os(t),e.mutationQueue.getAllMutationBatches(n))).next(t=>{let i=[],s=[],a=ru();for(let e of r)for(let t of(i.push(e.batchId),e.mutations))a=a.add(t.key);for(let e of t)for(let t of(s.push(e.batchId),e.mutations))a=a.add(t.key);return e.localDocuments.getDocuments(n,a).next(e=>({Ns:e,removedBatchIds:i,addedBatchIds:s}))})})}function s4(e){return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.li.getLastRemoteSnapshotVersion(t))}function s5(e,t,n){let r=ru(),i=ru();return n.forEach(e=>r=r.add(e)),t.getEntries(e,r).next(e=>{let r=rn;return n.forEach((n,s)=>{let a=e.get(n);s.isFoundDocument()!==a.isFoundDocument()&&(i=i.add(n)),s.isNoDocument()&&s.version.isEqual(ei.min())?(t.removeEntry(n,s.readTime),r=r.insert(n,s)):!a.isValidDocument()||s.version.compareTo(a.version)>0||0===s.version.compareTo(a.version)&&a.hasPendingWrites?(t.addEntry(s),r=r.insert(n,s)):w(s0,"Ignoring outdated watch update for ",n,". Current version:",a.version," Watch version:",s.version)}),{Bs:r,Ls:i}})}function s3(e,t){return e.persistence.runTransaction("Allocate target","readwrite",n=>{let r;return e.li.getTargetData(n,t).next(i=>i?(r=i,ew.resolve(r)):e.li.allocateTargetId(n).next(i=>(r=new iN(t,i,"TargetPurposeListen",n.currentSequenceNumber),e.li.addTargetData(n,r).next(()=>r))))}).then(n=>{let r=e.vs.get(n.targetId);return(null===r||n.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(e.vs=e.vs.insert(n.targetId,n),e.Fs.set(t,n.targetId)),n})}async function s6(e,t,n){let r=e.vs.get(t);try{n||await e.persistence.runTransaction("Release target",n?"readwrite":"readwrite-primary",t=>e.persistence.referenceDelegate.removeTarget(t,r))}catch(e){if(!eS(e))throw e;w(s0,`Failed to update sequence numbers for target ${t}: ${e}`)}e.vs=e.vs.remove(t),e.Fs.delete(r.target)}function s8(e,t,n){let r=ei.min(),i=ru();return e.persistence.runTransaction("Execute query","readwrite",s=>(function(e,t,n){let r=e.Fs.get(n);return void 0!==r?ew.resolve(e.vs.get(r)):e.li.getTargetData(t,n)})(e,s,n1(t)).next(t=>{if(t)return r=t.lastLimboFreeSnapshotVersion,e.li.getMatchingKeysForTargetId(s,t.targetId).next(e=>{i=e})}).next(()=>e.Cs.getDocumentsMatchingQuery(s,t,n?r:ei.min(),n?i:ru())).next(n=>(ae(e,n7(t),n),{documents:n,ks:i})))}function s9(e,t){let n=e.li,r=e.vs.get(t);return r?Promise.resolve(r.target):e.persistence.runTransaction("Get target data","readonly",e=>n.At(e,t).next(e=>e?e.target:null))}function s7(e,t){let n=e.Ms.get(t)||ei.min();return e.persistence.runTransaction("Get new document changes","readonly",r=>e.xs.getAllFromCollectionGroup(r,t,eh(n,-1),Number.MAX_SAFE_INTEGER)).then(n=>(ae(e,t,n),n))}function ae(e,t,n){let r=e.Ms.get(t)||ei.min();n.forEach((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)}),e.Ms.set(t,r)}async function at(e,t,n,r){let i=ru(),s=rn;for(let e of n){let n=t.Ks(e.metadata.name);e.document&&(i=i.add(n));let r=t.qs(e);r.setReadTime(t.Us(e.metadata.readTime)),s=s.insert(n,r)}let a=e.xs.newChangeBuffer({trackRemovals:!0}),o=await s3(e,n1(nJ($.fromString(`__bundle__/docs/${r}`))));return e.persistence.runTransaction("Apply bundle documents","readwrite",t=>s5(t,a,s).next(e=>(a.apply(t),e)).next(n=>e.li.removeMatchingKeysForTargetId(t,o.targetId).next(()=>e.li.addMatchingKeys(t,i,o.targetId)).next(()=>e.localDocuments.getLocalViewOfDocuments(t,n.Bs,n.Ls)).next(()=>n.Bs)))}async function an(e,t,n=ru()){let r=await s3(e,n1(iU(t.bundledQuery)));return e.persistence.runTransaction("Save named query","readwrite",i=>{let s=ia(t.readTime);if(r.snapshotVersion.compareTo(s)>=0)return e.Pi.saveNamedQuery(i,t);let a=r.withResumeToken(tK.EMPTY_BYTE_STRING,s);return e.vs=e.vs.insert(a.targetId,a),e.li.updateTargetData(i,a).next(()=>e.li.removeMatchingKeysForTargetId(i,r.targetId)).next(()=>e.li.addMatchingKeys(i,n,r.targetId)).next(()=>e.Pi.saveNamedQuery(i,t))})}/**
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
 */let ar="firestore_clients";function ai(e,t){return`${ar}_${e}_${t}`}let as="firestore_mutations";function aa(e,t,n){let r=`${as}_${e}_${n}`;return t.isAuthenticated()&&(r+=`_${t.uid}`),r}let ao="firestore_targets";function al(e,t){return`${ao}_${e}_${t}`}/**
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
 */let au="SharedClientState";class ac{constructor(e,t,n,r){this.user=e,this.batchId=t,this.state=n,this.error=r}static $s(e,t,n){let r=JSON.parse(n),i,s="object"==typeof r&&-1!==["pending","acknowledged","rejected"].indexOf(r.state)&&(void 0===r.error||"object"==typeof r.error);return s&&r.error&&(s="string"==typeof r.error.message&&"string"==typeof r.error.code)&&(i=new x(r.error.code,r.error.message)),s?new ac(e,t,r.state,i):(v(au,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Ws(){let e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class ah{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static $s(e,t){let n=JSON.parse(t),r,i="object"==typeof n&&-1!==["not-current","current","rejected"].indexOf(n.state)&&(void 0===n.error||"object"==typeof n.error);return i&&n.error&&(i="string"==typeof n.error.message&&"string"==typeof n.error.code)&&(r=new x(n.error.code,n.error.message)),i?new ah(e,n.state,r):(v(au,`Failed to parse target state for ID '${e}': ${t}`),null)}Ws(){let e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class ad{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static $s(e,t){let n=JSON.parse(t),r="object"==typeof n&&n.activeTargetIds instanceof Array,i=rc;for(let e=0;r&&e<n.activeTargetIds.length;++e)r=eO(n.activeTargetIds[e]),i=i.add(n.activeTargetIds[e]);return r?new ad(e,i):(v(au,`Failed to parse client data for instance '${e}': ${t}`),null)}}class af{constructor(e,t){this.clientId=e,this.onlineState=t}static $s(e){let t=JSON.parse(e);return"object"==typeof t&&-1!==["Unknown","Online","Offline"].indexOf(t.onlineState)&&"string"==typeof t.clientId?new af(t.clientId,t.onlineState):(v(au,`Failed to parse online state: ${e}`),null)}}class am{constructor(){this.activeTargetIds=rc}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){return JSON.stringify({activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()})}}class ag{constructor(e,t,n,r,i){var s,a,o;this.window=e,this.Ci=t,this.persistenceKey=n,this.zs=r,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.js=this.Js.bind(this),this.Hs=new tF(L),this.started=!1,this.Zs=[];let l=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Xs=ai(this.persistenceKey,this.zs),this.Ys=(s=this.persistenceKey,`firestore_sequence_number_${s}`),this.Hs=this.Hs.insert(this.zs,new am),this.eo=RegExp(`^${ar}_${l}_([^_]*)$`),this.no=RegExp(`^${as}_${l}_(\\d+)(?:_(.*))?$`),this.ro=RegExp(`^${ao}_${l}_(\\d+)$`),this.io=(a=this.persistenceKey,`firestore_online_state_${a}`),this.so=(o=this.persistenceKey,`firestore_bundle_loaded_v2_${o}`),this.window.addEventListener("storage",this.js)}static v(e){return!(!e||!e.localStorage)}async start(){for(let e of(await this.syncEngine.hs())){if(e===this.zs)continue;let t=this.getItem(ai(this.persistenceKey,e));if(t){let n=ad.$s(e,t);n&&(this.Hs=this.Hs.insert(n.clientId,n))}}this.oo();let e=this.storage.getItem(this.io);if(e){let t=this._o(e);t&&this.ao(t)}for(let e of this.Zs)this.Js(e);this.Zs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.Ys,JSON.stringify(e))}getAllActiveQueryTargets(){return this.uo(this.Hs)}isActiveQueryTarget(e){let t=!1;return this.Hs.forEach((n,r)=>{r.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.co(e,"pending")}updateMutationState(e,t,n){this.co(e,t,n),this.lo(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){let t=this.storage.getItem(al(this.persistenceKey,e));if(t){let r=ah.$s(e,t);r&&(n=r.state)}}return t&&this.ho.Qs(e),this.oo(),n}removeLocalQueryTarget(e){this.ho.Gs(e),this.oo()}isLocalQueryTarget(e){return this.ho.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(al(this.persistenceKey,e))}updateQueryState(e,t,n){this.Po(e,t,n)}handleUserChange(e,t,n){t.forEach(e=>{this.lo(e)}),this.currentUser=e,n.forEach(e=>{this.addPendingMutation(e)})}setOnlineState(e){this.To(e)}notifyBundleLoaded(e){this.Io(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.js),this.removeItem(this.Xs),this.started=!1)}getItem(e){let t=this.storage.getItem(e);return w(au,"READ",e,t),t}setItem(e,t){w(au,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){w(au,"REMOVE",e),this.storage.removeItem(e)}Js(e){if(e.storageArea===this.storage){if(w(au,"EVENT",e.key,e.newValue),e.key===this.Xs)return void v("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Ci.enqueueRetryable(async()=>{if(this.started){if(null!==e.key){if(this.eo.test(e.key)){if(null==e.newValue){let t=this.Eo(e.key);return this.Ro(t,null)}{let t=this.Ao(e.key,e.newValue);if(t)return this.Ro(t.clientId,t)}}else if(this.no.test(e.key)){if(null!==e.newValue){let t=this.Vo(e.key,e.newValue);if(t)return this.mo(t)}}else if(this.ro.test(e.key)){if(null!==e.newValue){let t=this.fo(e.key,e.newValue);if(t)return this.po(t)}}else if(e.key===this.io){if(null!==e.newValue){let t=this._o(e.newValue);if(t)return this.ao(t)}}else if(e.key===this.Ys){let t=function(e){let t=eR.ce;if(null!=e)try{let n=JSON.parse(e);b("number"==typeof n,30636,{yo:e}),t=n}catch(e){v(au,"Failed to read sequence number from WebStorage",e)}return t}(e.newValue);t!==eR.ce&&this.sequenceNumberHandler(t)}else if(e.key===this.so){let t=this.wo(e.newValue);await Promise.all(t.map(e=>this.syncEngine.So(e)))}}}else this.Zs.push(e)})}}get ho(){return this.Hs.get(this.zs)}oo(){this.setItem(this.Xs,this.ho.Ws())}co(e,t,n){let r=new ac(this.currentUser,e,t,n),i=aa(this.persistenceKey,this.currentUser,e);this.setItem(i,r.Ws())}lo(e){let t=aa(this.persistenceKey,this.currentUser,e);this.removeItem(t)}To(e){let t={clientId:this.zs,onlineState:e};this.storage.setItem(this.io,JSON.stringify(t))}Po(e,t,n){let r=al(this.persistenceKey,e),i=new ah(e,t,n);this.setItem(r,i.Ws())}Io(e){let t=JSON.stringify(Array.from(e));this.setItem(this.so,t)}Eo(e){let t=this.eo.exec(e);return t?t[1]:null}Ao(e,t){let n=this.Eo(e);return ad.$s(n,t)}Vo(e,t){let n=this.no.exec(e),r=Number(n[1]),i=void 0!==n[2]?n[2]:null;return ac.$s(new m(i),r,t)}fo(e,t){let n=Number(this.ro.exec(e)[1]);return ah.$s(n,t)}_o(e){return af.$s(e)}wo(e){return JSON.parse(e)}async mo(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.bo(e.batchId,e.state,e.error);w(au,`Ignoring mutation for non-active user ${e.user.uid}`)}po(e){return this.syncEngine.Do(e.targetId,e.state,e.error)}Ro(e,t){let n=t?this.Hs.insert(e,t):this.Hs.remove(e),r=this.uo(this.Hs),i=this.uo(n),s=[],a=[];return i.forEach(e=>{r.has(e)||s.push(e)}),r.forEach(e=>{i.has(e)||a.push(e)}),this.syncEngine.Co(s,a).then(()=>{this.Hs=n})}ao(e){this.Hs.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}uo(e){let t=rc;return e.forEach((e,n)=>{t=t.unionWith(n.activeTargetIds)}),t}}class ap{constructor(){this.vo=new am,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,n){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new am,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class ay{Mo(e){}shutdown(){}}/**
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
 */let aw="ConnectivityMonitor";class av{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){for(let e of(w(aw,"Network connectivity changed: AVAILABLE"),this.Lo))e(0)}Bo(){for(let e of(w(aw,"Network connectivity changed: UNAVAILABLE"),this.Lo))e(1)}static v(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}/**
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
 */let aI=null;function aT(){return null===aI?aI=268435456+Math.round(2147483648*Math.random()):aI++,"0x"+aI.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let aE="RestConnection",a_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class ab{get Ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Uo=`projects/${n}/databases/${r}`,this.$o=this.databaseId.database===t2?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Wo(e,t,n,r,i){let s=aT(),a=this.Qo(e,t.toUriEncodedString());w(aE,`Sending RPC '${e}' ${s}:`,a,n);let o={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(o,r,i);let{host:l}=new URL(a),u=c.isCloudWorkstation(l);return this.zo(e,a,o,n,u).then(t=>(w(aE,`Received RPC '${e}' ${s}: `,t),t),t=>{throw I(aE,`RPC '${e}' ${s} failed with error: `,t,"url: ",a,"request:",n),t})}jo(e,t,n,r,i,s){return this.Wo(e,t,n,r,i)}Go(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+g,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}Qo(e,t){let n=a_[e],r=`${this.qo}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(r=`${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),r}terminate(){}}/**
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
 */class aS{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
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
 */let ax="WebChannelConnection",aA=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(e){setTimeout(()=>{throw e},0)}})};class aC extends ab{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){aC.c_||(aA(f.getStatEventTarget(),f.Event.STAT_EVENT,e=>{e.stat===f.Stat.PROXY?w(ax,"STAT_EVENT: detected buffering proxy"):e.stat===f.Stat.NOPROXY&&w(ax,"STAT_EVENT: detected no buffering proxy")}),aC.c_=!0)}zo(e,t,n,r,i){let s=aT();return new Promise((i,a)=>{let o=new f.XhrIo;o.setWithCredentials(!0),o.listenOnce(f.EventType.COMPLETE,()=>{try{switch(o.getLastErrorCode()){case f.ErrorCode.NO_ERROR:let t=o.getResponseJson();w(ax,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(t)),i(t);break;case f.ErrorCode.TIMEOUT:w(ax,`RPC '${e}' ${s} timed out`),a(new x(S.DEADLINE_EXCEEDED,"Request time out"));break;case f.ErrorCode.HTTP_ERROR:let n=o.getStatus();if(w(ax,`RPC '${e}' ${s} failed with status:`,n,"response text:",o.getResponseText()),n>0){let e=o.getResponseJson();Array.isArray(e)&&(e=e[0]);let t=e?.error;if(t&&t.status&&t.message){let e=function(e){let t=e.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(t)>=0?t:S.UNKNOWN}(t.status);a(new x(e,t.message))}else a(new x(S.UNKNOWN,"Server responded with status "+o.getStatus()))}else a(new x(S.UNAVAILABLE,"Connection failed."));break;default:E(9055,{l_:e,streamId:s,h_:o.getLastErrorCode(),P_:o.getLastError()})}}finally{w(ax,`RPC '${e}' ${s} completed.`)}});let l=JSON.stringify(r);w(ax,`RPC '${e}' ${s} sending request:`,r),o.send(t,"POST",l,n,15)})}T_(e,t,n){let i=aT(),s=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),o={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},l=this.longPollingOptions.timeoutSeconds;void 0!==l&&(o.longPollingTimeout=Math.round(1e3*l)),this.useFetchStreams&&(o.useFetchStreams=!0),this.Go(o.initMessageHeaders,t,n),o.encodeInitMessageHeaders=!0;let u=s.join("");w(ax,`Creating RPC '${e}' stream ${i}: ${u}`,o);let c=a.createWebChannel(u,o);this.I_(c);let h=!1,d=!1,m=new aS({Jo:t=>{d?w(ax,`Not sending because RPC '${e}' stream ${i} is closed:`,t):(h||(w(ax,`Opening RPC '${e}' stream ${i} transport.`),c.open(),h=!0),w(ax,`RPC '${e}' stream ${i} sending:`,t),c.send(t))},Ho:()=>c.close()});return aA(c,f.WebChannel.EventType.OPEN,()=>{d||(w(ax,`RPC '${e}' stream ${i} transport opened.`),m.i_())}),aA(c,f.WebChannel.EventType.CLOSE,()=>{d||(d=!0,w(ax,`RPC '${e}' stream ${i} transport closed`),m.o_(),this.E_(c))}),aA(c,f.WebChannel.EventType.ERROR,t=>{d||(d=!0,I(ax,`RPC '${e}' stream ${i} transport errored. Name:`,t.name,"Message:",t.message),m.o_(new x(S.UNAVAILABLE,"The operation could not be completed")))}),aA(c,f.WebChannel.EventType.MESSAGE,t=>{if(!d){let n=t.data[0];b(!!n,16349);let s=n?.error||n[0]?.error;if(s){w(ax,`RPC '${e}' stream ${i} received error:`,s);let t=s.status,n=function(e){let t=r[e];if(void 0!==t)return rG(t)}(t),a=s.message;"NOT_FOUND"===t&&a.includes("database")&&a.includes("does not exist")&&a.includes(this.databaseId.database)&&I(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),void 0===n&&(n=S.INTERNAL,a="Unknown error status: "+t+" with message "+s.message),d=!0,m.o_(new x(n,a)),c.close()}else w(ax,`RPC '${e}' stream ${i} received:`,n),m.__(n)}}),aC.u_(),setTimeout(()=>{m.s_()},0),m}terminate(){this.a_.forEach(e=>e.close()),this.a_=[]}I_(e){this.a_.push(e)}E_(e){this.a_=this.a_.filter(t=>t===e)}Go(e,t,n){super.Go(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return f.createWebChannelTransport()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aD(){return"undefined"!=typeof window?window:null}function aN(){return"undefined"!=typeof document?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ak(e){return new it(e,!0)}/**
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
 */aC.c_=!1;class aV{constructor(e,t,n=1e3,r=1.5,i=6e4){this.Ci=e,this.timerId=t,this.R_=n,this.A_=r,this.V_=i,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();let t=Math.floor(this.d_+this.y_()),n=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-n);r>0&&w("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,r,()=>(this.f_=Date.now(),e())),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){null!==this.m_&&(this.m_.skipDelay(),this.m_=null)}cancel(){null!==this.m_&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
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
 */let aR="PersistentStream";class aP{constructor(e,t,n,r,i,s,a,o){this.Ci=e,this.S_=n,this.b_=r,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=a,this.listener=o,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new aV(e,t)}x_(){return 1===this.state||5===this.state||this.O_()}O_(){return 2===this.state||3===this.state}start(){this.F_=0,4!==this.state?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&null===this.C_&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}K_(e){this.q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.U_(),this.M_.cancel(),this.D_++,4!==e?this.M_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(v(t.toString()),v("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===S.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;let e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.D_===t&&this.G_(e,n)},t=>{e(()=>{let e=new x(S.UNKNOWN,"Fetching auth token failed: "+t.message);return this.z_(e)})})}G_(e,t){let n=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo(()=>{n(()=>this.listener.Zo())}),this.stream.Yo(()=>{n(()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.Yo()))}),this.stream.t_(e=>{n(()=>this.z_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.F_?this.J_(e):this.onNext(e))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return w(aR,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget(()=>this.D_===e?t():(w(aR,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class aF extends aP{constructor(e,t,n,r,i,s){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();let t=function(e,t){let n;if("targetChange"in t){var r,i;t.targetChange;let s="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:E(39313,{state:r}),a=t.targetChange.targetIds||[],o=(i=t.targetChange.resumeToken,e.useProto3Json?(b(void 0===i||"string"==typeof i,58123),tK.fromBase64String(i||"")):(b(void 0===i||i instanceof l||i instanceof Uint8Array,16193),tK.fromUint8Array(i||new Uint8Array))),u=t.targetChange.cause;n=new r4(s,a,o,u&&new x(void 0===u.code?S.UNKNOWN:rG(u.code),u.message||"")||null)}else if("documentChange"in t){t.documentChange;let r=t.documentChange;r.document,r.document.name,r.document.updateTime;let i=ih(e,r.document.name),s=ia(r.document.updateTime),a=r.document.createTime?ia(r.document.createTime):ei.min(),o=new nv({mapValue:{fields:r.document.fields}}),l=nI.newFoundDocument(i,s,a,o);n=new r1(r.targetIds||[],r.removedTargetIds||[],l.key,l)}else if("documentDelete"in t){t.documentDelete;let r=t.documentDelete;r.document;let i=ih(e,r.document),s=r.readTime?ia(r.readTime):ei.min(),a=nI.newNoDocument(i,s);n=new r1([],r.removedTargetIds||[],a.key,a)}else if("documentRemove"in t){t.documentRemove;let r=t.documentRemove;r.document;let i=ih(e,r.document);n=new r1([],r.removedTargetIds||[],i,null)}else{if(!("filter"in t))return E(11601,{Vt:t});{t.filter;let e=t.filter;e.targetId;let{count:r=0,unchangedNames:i}=e,s=new rK(r,i);n=new r2(e.targetId,s)}}return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return ei.min();let t=e.targetChange;return t.targetIds&&t.targetIds.length?ei.min():t.readTime?ia(t.readTime):ei.min()}(e);return this.listener.H_(t,n)}Z_(e){let t={};t.database=ig(this.serializer),t.addTarget=function(e,t){let n;let r=t.target;if((n=nG(r)?{documents:iE(e,r)}:{query:i_(e,r).ft}).targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=is(e,t.resumeToken);let r=ir(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(ei.min())>0){n.readTime=ii(e,t.snapshotVersion.toTimestamp());let r=ir(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);let n=function(e,t){let n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return E(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.K_(t)}X_(e){let t={};t.database=ig(this.serializer),t.removeTarget=e,this.K_(t)}}class aO extends aP{constructor(e,t,n,r,i,s){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return b(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,b(!e.writeResults||0===e.writeResults.length,55816),this.listener.ta()}onNext(e){var t,n;b(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();let r=(t=e.writeResults,n=e.commitTime,t&&t.length>0?(b(void 0!==n,14353),t.map(e=>{let t;return(t=e.updateTime?ia(e.updateTime):ia(n)).isEqual(ei.min())&&(t=ia(n)),new rS(t,e.transformResults||[])})):[]),i=ia(e.commitTime);return this.listener.na(i,r)}ra(){let e={};e.database=ig(this.serializer),this.K_(e)}ea(e){let t={streamToken:this.lastStreamToken,writes:e.map(e=>iI(this.serializer,e))};this.K_(t)}}/**
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
 */class aM{}class aL extends aM{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new x(S.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Wo(e,il(t,n),r,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new x(S.UNKNOWN,e.toString())})}jo(e,t,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.jo(e,il(t,n),r,s,a,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new x(S.UNKNOWN,e.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class aU{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){0===this.oa&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){"Online"===this.state?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,"Online"===e&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(v(t),this.aa=!1):w("OnlineStateTracker",t)}Pa(){null!==this._a&&(this._a.cancel(),this._a=null)}}/**
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
 */let aq="RemoteStore";class aB{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Map,this.Ra=new Map,this.Aa=new sf(1e3),this.Va=new sf(1001),this.da=new Set,this.ma=[],this.fa=i,this.fa.Mo(e=>{n.enqueueAndForget(async()=>{aY(this)&&(w(aq,"Restarting streams for network reachability change."),await async function(e){e.da.add(4),await aK(e),e.ga.set("Unknown"),e.da.delete(4),await az(e)}(this))})}),this.ga=new aU(n,r)}}async function az(e){if(aY(e))for(let t of e.ma)await t(!0)}async function aK(e){for(let t of e.ma)await t(!1)}function a$(e,t){return e.Ea.get(t)||void 0}function aG(e,t){let n=a$(e,t.targetId);if(void 0!==n&&e.Ia.has(n))return;let r=function(e,t){let n=a$(e,t);void 0!==n&&e.Ra.delete(n);let r=t%2!=0?e.Va.next():e.Aa.next();return e.Ea.set(t,r),e.Ra.set(r,t),r}(e,t.targetId);w(aq,"remoteStoreListen mapping SDK target ID to remote",t.targetId,r);let i=new iN(t.target,r,t.purpose,t.sequenceNumber,t.snapshotVersion,t.lastLimboFreeSnapshotVersion,t.resumeToken);e.Ia.set(r,i),aJ(e)?aW(e):or(e).O_()&&aQ(e,i)}function aj(e,t){let n=or(e),r=a$(e,t);w(aq,"remoteStoreUnlisten removing mapping of SDK target ID to remote",t,r),e.Ia.delete(r),e.Ea.delete(t),e.Ra.delete(r),n.O_()&&aH(e,r),0===e.Ia.size&&(n.O_()?n.L_():aY(e)&&e.ga.set("Unknown"))}function aQ(e,t){if(e.pa.$e(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(ei.min())>0){let n=e.Ra.get(t.targetId);if(void 0===n)return void w(aq,"SDK target ID not found for remote ID: "+t.targetId);let r=e.remoteSyncer.getRemoteKeysForTarget(n).size;t=t.withExpectedCount(r)}or(e).Z_(t)}function aH(e,t){e.pa.$e(t),or(e).X_(t)}function aW(e){e.pa=new r3({getRemoteKeysForTarget:t=>{let n=e.Ra.get(t);return void 0!==n?e.remoteSyncer.getRemoteKeysForTarget(n):ru()},At:t=>e.Ia.get(t)||null,ht:()=>e.datastore.serializer.databaseId}),or(e).start(),e.ga.ua()}function aJ(e){return aY(e)&&!or(e).x_()&&e.Ia.size>0}function aY(e){return 0===e.da.size}async function aX(e){e.ga.set("Online")}async function aZ(e){e.Ia.forEach((t,n)=>{aQ(e,t)})}async function a0(e,t){e.pa=void 0,aJ(e)?(e.ga.ha(t),aW(e)):e.ga.set("Unknown")}async function a1(e,t,n){if(e.ga.set("Online"),t instanceof r4&&2===t.state&&t.cause)try{await async function(e,t){let n=t.cause;for(let r of t.targetIds){if(e.Ia.has(r)){let t=e.Ra.get(r);void 0!==t&&(await e.remoteSyncer.rejectListen(t,n),e.Ea.delete(t),e.Ra.delete(r)),e.Ia.delete(r)}e.pa.removeTarget(r)}}(e,t)}catch(n){w(aq,"Failed to remove targets %s: %s ",t.targetIds.join(","),n),await a2(e,n)}else if(t instanceof r1?e.pa.Xe(t):t instanceof r2?e.pa.st(t):e.pa.tt(t),!n.isEqual(ei.min()))try{let t=await s4(e.localStore);n.compareTo(t)>=0&&await function(e,t){let n=e.pa.Tt(t);n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){let i=e.Ia.get(r);i&&e.Ia.set(r,i.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{let r=e.Ia.get(t);if(!r)return;e.Ia.set(t,r.withResumeToken(tK.EMPTY_BYTE_STRING,r.snapshotVersion)),aH(e,t);let i=new iN(r.target,t,n,r.sequenceNumber);aQ(e,i)});let r=function(e,t){let n=new Map;t.targetChanges.forEach((t,r)=>{let i=e.Ra.get(r);void 0!==i&&n.set(i,t)});let r=new tF(L);return t.targetMismatches.forEach((t,n)=>{let i=e.Ra.get(t);void 0!==i&&(r=r.insert(i,n))}),new rZ(t.snapshotVersion,n,r,t.documentUpdates,t.resolvedLimboDocuments)}(e,n);return e.remoteSyncer.applyRemoteEvent(r)}(e,n)}catch(t){w(aq,"Failed to raise snapshot:",t),await a2(e,t)}}async function a2(e,t,n){if(!eS(t))throw t;e.da.add(1),await aK(e),e.ga.set("Offline"),n||(n=()=>s4(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{w(aq,"Retrying IndexedDB access"),await n(),e.da.delete(1),await az(e)})}function a4(e,t){return t().catch(n=>a2(e,n,t))}async function a5(e){let t=oi(e),n=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:-1;for(;aY(e)&&e.Ta.length<10;)try{let r=await function(e,t){return e.persistence.runTransaction("Get next mutation batch","readonly",n=>(void 0===t&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(n,t)))}(e.localStore,n);if(null===r){0===e.Ta.length&&t.L_();break}n=r.batchId,function(e,t){e.Ta.push(t);let n=oi(e);n.O_()&&n.Y_&&n.ea(t.mutations)}(e,r)}catch(t){await a2(e,t)}a3(e)&&a6(e)}function a3(e){return aY(e)&&!oi(e).x_()&&e.Ta.length>0}function a6(e){oi(e).start()}async function a8(e){oi(e).ra()}async function a9(e){let t=oi(e);for(let n of e.Ta)t.ea(n.mutations)}async function a7(e,t,n){let r=e.Ta.shift(),i=rq.from(r,t,n);await a4(e,()=>e.remoteSyncer.applySuccessfulWrite(i)),await a5(e)}async function oe(e,t){t&&oi(e).Y_&&await async function(e,t){var n;if(r$(n=t.code)&&n!==S.ABORTED){let n=e.Ta.shift();oi(e).B_(),await a4(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await a5(e)}}(e,t),a3(e)&&a6(e)}async function ot(e,t){e.asyncQueue.verifyOperationInProgress(),w(aq,"RemoteStore received new credentials");let n=aY(e);e.da.add(3),await aK(e),n&&e.ga.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.da.delete(3),await az(e)}async function on(e,t){t?(e.da.delete(2),await az(e)):t||(e.da.add(2),await aK(e),e.ga.set("Unknown"))}function or(e){var t,n,r;return e.ya||(e.ya=(t=e.datastore,n=e.asyncQueue,r={Zo:aX.bind(null,e),Yo:aZ.bind(null,e),t_:a0.bind(null,e),H_:a1.bind(null,e)},t.sa(),new aF(n,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,r)),e.ma.push(async t=>{t?(e.ya.B_(),aJ(e)?aW(e):e.ga.set("Unknown")):(await e.ya.stop(),e.pa=void 0)})),e.ya}function oi(e){var t,n,r;return e.wa||(e.wa=(t=e.datastore,n=e.asyncQueue,r={Zo:()=>Promise.resolve(),Yo:a8.bind(null,e),t_:oe.bind(null,e),ta:a9.bind(null,e),na:a7.bind(null,e)},t.sa(),new aO(n,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,r)),e.ma.push(async t=>{t?(e.wa.B_(),await a5(e)):(await e.wa.stop(),e.Ta.length>0&&(w(aq,`Stopping write stream with ${e.Ta.length} pending writes`),e.Ta=[]))})),e.wa}/**
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
 */class os{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new A,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,i){let s=new os(e,t,Date.now()+n,r,i);return s.start(n),s}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new x(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function oa(e,t){if(v("AsyncQueue",`${t}: ${e}`),eS(e))return new x(S.UNAVAILABLE,`${t}: ${e}`);throw e}/**
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
 */class oo{static emptySet(e){return new oo(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||Q.comparator(t.key,n.key):(e,t)=>Q.comparator(e.key,t.key),this.keyedMap=ri(),this.sortedSet=new tF(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof oo)||this.size!==e.size)return!1;let t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){let e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){let e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){let n=new oo;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
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
 */class ol{constructor(){this.Sa=new tF(Q.comparator)}track(e){let t=e.doc.key,n=this.Sa.get(t);n?0!==e.type&&3===n.type?this.Sa=this.Sa.insert(t,e):3===e.type&&1!==n.type?this.Sa=this.Sa.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.Sa=this.Sa.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.Sa=this.Sa.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.Sa=this.Sa.remove(t):1===e.type&&2===n.type?this.Sa=this.Sa.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.Sa=this.Sa.insert(t,{type:2,doc:e.doc}):E(63341,{Vt:e,ba:n}):this.Sa=this.Sa.insert(t,e)}Da(){let e=[];return this.Sa.inorderTraversal((t,n)=>{e.push(n)}),e}}class ou{constructor(e,t,n,r,i,s,a,o,l){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=a,this.excludesMetadataChanges=o,this.hasCachedResults=l}static fromInitialDocuments(e,t,n,r,i){let s=[];return t.forEach(e=>{s.push({type:0,doc:e})}),new ou(e,t,oo.emptySet(t),s,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&n3(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let e=0;e<t.length;e++)if(t[e].type!==n[e].type||!t[e].doc.isEqual(n[e].doc))return!1;return!0}}/**
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
 */class oc{constructor(){this.Ca=void 0,this.va=[]}Fa(){return this.va.some(e=>e.Ma())}}class oh{constructor(){this.queries=od(),this.onlineState="Unknown",this.xa=new Set}terminate(){!function(e,t){let n=e.queries;e.queries=od(),n.forEach((e,n)=>{for(let e of n.va)e.onError(t)})}(this,new x(S.ABORTED,"Firestore shutting down"))}}function od(){return new rt(e=>n6(e),n3)}async function of(e,t){let n=3,r=t.query,i=e.queries.get(r);i?!i.Fa()&&t.Ma()&&(n=2):(i=new oc,n=t.Ma()?0:1);try{switch(n){case 0:i.Ca=await e.onListen(r,!0);break;case 1:i.Ca=await e.onListen(r,!1);break;case 2:await e.onFirstRemoteStoreListen(r)}}catch(n){let e=oa(n,`Initialization of query '${n8(t.query)}' failed`);return void t.onError(e)}e.queries.set(r,i),i.va.push(t),t.Oa(e.onlineState),i.Ca&&t.Na(i.Ca)&&oy(e)}async function om(e,t){let n=t.query,r=3,i=e.queries.get(n);if(i){let e=i.va.indexOf(t);e>=0&&(i.va.splice(e,1),0===i.va.length?r=t.Ma()?0:1:!i.Fa()&&t.Ma()&&(r=2))}switch(r){case 0:return e.queries.delete(n),e.onUnlisten(n,!0);case 1:return e.queries.delete(n),e.onUnlisten(n,!1);case 2:return e.onLastRemoteStoreUnlisten(n);default:return}}function og(e,t){let n=!1;for(let r of t){let t=r.query,i=e.queries.get(t);if(i){for(let e of i.va)e.Na(r)&&(n=!0);i.Ca=r}}n&&oy(e)}function op(e,t,n){let r=e.queries.get(t);if(r)for(let e of r.va)e.onError(n);e.queries.delete(t)}function oy(e){e.xa.forEach(e=>{e.next()})}(a=s||(s={})).Ba="default",a.Cache="cache";class ow{constructor(e,t,n){this.query=e,this.La=t,this.ka=!1,this.Ka=null,this.onlineState="Unknown",this.options=n||{}}Na(e){if(!this.options.includeMetadataChanges){let t=[];for(let n of e.docChanges)3!==n.type&&t.push(n);e=new ou(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.ka?this.qa(e)&&(this.La.next(e),t=!0):this.Ua(e,this.onlineState)&&(this.$a(e),t=!0),this.Ka=e,t}onError(e){this.La.error(e)}Oa(e){this.onlineState=e;let t=!1;return this.Ka&&!this.ka&&this.Ua(this.Ka,e)&&(this.$a(this.Ka),t=!0),t}Ua(e,t){return!(e.fromCache&&this.Ma())||(!this.options.Wa||!("Offline"!==t))&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}qa(e){if(e.docChanges.length>0)return!0;let t=this.Ka&&this.Ka.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}$a(e){e=ou.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.ka=!0,this.La.next(e)}Ma(){return this.options.source!==s.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ov{constructor(e,t){this.Qa=e,this.byteLength=t}Ga(){return"metadata"in this.Qa}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oI{constructor(e){this.serializer=e}Ks(e){return ih(this.serializer,e)}qs(e){return e.metadata.exists?iv(this.serializer,e.document,!1):nI.newNoDocument(this.Ks(e.metadata.name),this.Us(e.metadata.readTime))}Us(e){return ia(e)}}class oT{constructor(e,t){this.za=e,this.serializer=t,this.ja=[],this.Ja=[],this.collectionGroups=new Set,this.progress=oE(e)}get queries(){return this.ja}get documents(){return this.Ja}Ha(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.Qa.namedQuery)this.ja.push(e.Qa.namedQuery);else if(e.Qa.documentMetadata){this.Ja.push({metadata:e.Qa.documentMetadata}),e.Qa.documentMetadata.exists||++t;let n=$.fromString(e.Qa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.Qa.document&&(this.Ja[this.Ja.length-1].document=e.Qa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,{...this.progress}):null}Za(e){let t=new Map,n=new oI(this.serializer);for(let r of e)if(r.metadata.queries){let e=n.Ks(r.metadata.name);for(let n of r.metadata.queries){let r=(t.get(n)||ru()).add(e);t.set(n,r)}}return t}async Xa(e){let t=await at(e,new oI(this.serializer),this.Ja,this.za.id),n=this.Za(this.documents);for(let t of this.ja)await an(e,t,n.get(t.name));return this.progress.taskState="Success",{progress:this.progress,Ya:this.collectionGroups,eu:t}}}function oE(e){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:e.totalDocuments,totalBytes:e.totalBytes}}/**
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
 */class o_{constructor(e){this.key=e}}class ob{constructor(e){this.key=e}}class oS{constructor(e,t){this.query=e,this.tu=t,this.nu=null,this.hasCachedResults=!1,this.current=!1,this.ru=ru(),this.mutatedKeys=ru(),this.iu=re(e),this.su=new oo(this.iu)}get ou(){return this.tu}_u(e,t){let n=t?t.au:new ol,r=t?t.su:this.su,i=t?t.mutatedKeys:this.mutatedKeys,s=r,a=!1,o="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,l="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{let u=r.get(e),c=n9(this.query,t)?t:null,h=!!u&&this.mutatedKeys.has(u.key),d=!!c&&(c.hasLocalMutations||this.mutatedKeys.has(c.key)&&c.hasCommittedMutations),f=!1;u&&c?u.data.isEqual(c.data)?h!==d&&(n.track({type:3,doc:c}),f=!0):this.uu(u,c)||(n.track({type:2,doc:c}),f=!0,(o&&this.iu(c,o)>0||l&&0>this.iu(c,l))&&(a=!0)):!u&&c?(n.track({type:0,doc:c}),f=!0):u&&!c&&(n.track({type:1,doc:u}),f=!0,(o||l)&&(a=!0)),f&&(c?(s=s.add(c),i=d?i.add(e):i.delete(e)):(s=s.delete(e),i=i.delete(e)))}),null!==this.query.limit)for(;s.size>this.query.limit;){let e="F"===this.query.limitType?s.last():s.first();s=s.delete(e.key),i=i.delete(e.key),n.track({type:1,doc:e})}return{su:s,au:n,bs:a,mutatedKeys:i}}uu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){let i=this.su;this.su=e.su,this.mutatedKeys=e.mutatedKeys;let s=e.au.Da();s.sort((e,t)=>(function(e,t){let n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return E(20277,{Vt:e})}};return n(e)-n(t)})(e.type,t.type)||this.iu(e.doc,t.doc)),this.cu(n),r=r??!1;let a=t&&!r?this.lu():[],o=0===this.ru.size&&this.current&&!r?1:0,l=o!==this.nu;return(this.nu=o,0!==s.length||l)?{snapshot:new ou(this.query,e.su,i,s,e.mutatedKeys,0===o,l,!1,!!n&&n.resumeToken.approximateByteSize()>0),hu:a}:{hu:a}}Oa(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({su:this.su,au:new ol,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{hu:[]}}Pu(e){return!this.tu.has(e)&&!!this.su.has(e)&&!this.su.get(e).hasLocalMutations}cu(e){e&&(e.addedDocuments.forEach(e=>this.tu=this.tu.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.tu=this.tu.delete(e)),this.current=e.current)}lu(){if(!this.current)return[];let e=this.ru;this.ru=ru(),this.su.forEach(e=>{this.Pu(e.key)&&(this.ru=this.ru.add(e.key))});let t=[];return e.forEach(e=>{this.ru.has(e)||t.push(new ob(e))}),this.ru.forEach(n=>{e.has(n)||t.push(new o_(n))}),t}Tu(e){this.tu=e.ks,this.ru=ru();let t=this._u(e.documents);return this.applyChanges(t,!0)}Iu(){return ou.fromInitialDocuments(this.query,this.su,this.mutatedKeys,0===this.nu,this.hasCachedResults)}}let ox="SyncEngine";class oA{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class oC{constructor(e){this.key=e,this.Eu=!1}}class oD{constructor(e,t,n,r,i,s){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.Ru={},this.Au=new rt(e=>n6(e),n3),this.Vu=new Map,this.du=new Set,this.mu=new tF(Q.comparator),this.fu=new Map,this.gu=new sP,this.pu={},this.yu=new Map,this.wu=sf.ar(),this.onlineState="Unknown",this.Su=void 0}get isPrimaryClient(){return!0===this.Su}}async function oN(e,t,n=!0){let r;let i=o8(e),s=i.Au.get(t);return s?(i.sharedClientState.addLocalQueryTarget(s.targetId),r=s.view.Iu()):r=await oV(i,t,n,!0),r}async function ok(e,t){let n=o8(e);await oV(n,t,!0,!1)}async function oV(e,t,n,r){let i;let s=await s3(e.localStore,n1(t)),a=s.targetId,o=e.sharedClientState.addLocalQueryTarget(a,n);return r&&(i=await oR(e,t,a,"current"===o,s.resumeToken)),e.isPrimaryClient&&n&&aG(e.remoteStore,s),i}async function oR(e,t,n,r,i){e.bu=(t,n,r)=>(async function(e,t,n,r){let i=t.view._u(n);i.bs&&(i=await s8(e.localStore,t.query,!1).then(({documents:e})=>t.view._u(e,i)));let s=r&&r.targetChanges.get(t.targetId),a=r&&null!=r.targetMismatches.get(t.targetId),o=t.view.applyChanges(i,e.isPrimaryClient,s,a);return oQ(e,t.targetId,o.hu),o.snapshot})(e,t,n,r);let s=await s8(e.localStore,t,!0),a=new oS(t,s.ks),o=a._u(s.documents),l=r0.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,i),u=a.applyChanges(o,e.isPrimaryClient,l);oQ(e,n,u.hu);let c=new oA(t,n,a);return e.Au.set(t,c),e.Vu.has(n)?e.Vu.get(n).push(t):e.Vu.set(n,[t]),u.snapshot}async function oP(e,t,n){let r=e.Au.get(t),i=e.Vu.get(r.targetId);if(i.length>1)return e.Vu.set(r.targetId,i.filter(e=>!n3(e,t))),void e.Au.delete(t);e.isPrimaryClient?(e.sharedClientState.removeLocalQueryTarget(r.targetId),e.sharedClientState.isActiveQueryTarget(r.targetId)||await s6(e.localStore,r.targetId,!1).then(()=>{e.sharedClientState.clearQueryState(r.targetId),n&&aj(e.remoteStore,r.targetId),oG(e,r.targetId)}).catch(ey)):(oG(e,r.targetId),await s6(e.localStore,r.targetId,!0))}async function oF(e,t){let n=e.Au.get(t),r=e.Vu.get(n.targetId);e.isPrimaryClient&&1===r.length&&(e.sharedClientState.removeLocalQueryTarget(n.targetId),aj(e.remoteStore,n.targetId))}async function oO(e,t,n){let r=o9(e);try{var i;let e;let s=await function(e,t){let n,r;let i=er.now(),s=t.reduce((e,t)=>e.add(t.key),ru());return e.persistence.runTransaction("Locally write mutations","readwrite",a=>{let o=rn,l=ru();return e.xs.getEntries(a,s).next(e=>{(o=e).forEach((e,t)=>{t.isValidDocument()||(l=l.add(e))})}).next(()=>e.localDocuments.getOverlayedDocuments(a,o)).next(r=>{n=r;let s=[];for(let e of t){let t=function(e,t){let n=null;for(let r of e.fieldTransforms){let e=t.data.field(r.field),i=rg(r.transform,e||null);null!=i&&(null===n&&(n=nv.empty()),n.set(r.field,i))}return n||null}(e,n.get(e.key).overlayedDocument);null!=t&&s.push(new rR(e.key,t,function e(t){let n=[];return tV(t.fields,(t,r)=>{let i=new j([t]);if(nd(r)){let t=e(r.mapValue).fields;if(0===t.length)n.push(i);else for(let e of t)n.push(i.child(e))}else n.push(i)}),new tB(n)}(t.value.mapValue),rx.exists(!0)))}return e.mutationQueue.addMutationBatch(a,i,s,t)}).next(t=>{r=t;let i=t.applyToLocalDocumentSet(n,l);return e.documentOverlayCache.saveOverlays(a,t.batchId,i)})}).then(()=>({batchId:r.batchId,changes:rs(n)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),i=s.batchId,(e=r.pu[r.currentUser.toKey()])||(e=new tF(L)),e=e.insert(i,n),r.pu[r.currentUser.toKey()]=e,await oW(r,s.changes),await a5(r.remoteStore)}catch(t){let e=oa(t,"Failed to persist write");n.reject(e)}}async function oM(e,t){try{let n=await function(e,t){let n=t.snapshotVersion,r=e.vs;return e.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{let s=e.xs.newChangeBuffer({trackRemovals:!0});r=e.vs;let a=[];t.targetChanges.forEach((s,o)=>{var l;let u=r.get(o);if(!u)return;a.push(e.li.removeMatchingKeys(i,s.removedDocuments,o).next(()=>e.li.addMatchingKeys(i,s.addedDocuments,o)));let c=u.withSequenceNumber(i.currentSequenceNumber);null!==t.targetMismatches.get(o)?c=c.withResumeToken(tK.EMPTY_BYTE_STRING,ei.min()).withLastLimboFreeSnapshotVersion(ei.min()):s.resumeToken.approximateByteSize()>0&&(c=c.withResumeToken(s.resumeToken,n)),r=r.insert(o,c),l=c,(0===u.resumeToken.approximateByteSize()||l.snapshotVersion.toMicroseconds()-u.snapshotVersion.toMicroseconds()>=3e8||s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size>0)&&a.push(e.li.updateTargetData(i,c))});let o=rn,l=ru();if(t.documentUpdates.forEach(n=>{t.resolvedLimboDocuments.has(n)&&a.push(e.persistence.referenceDelegate.updateLimboDocument(i,n))}),a.push(s5(i,s,t.documentUpdates).next(e=>{o=e.Bs,l=e.Ls})),!n.isEqual(ei.min())){let t=e.li.getLastRemoteSnapshotVersion(i).next(t=>e.li.setTargetsMetadata(i,i.currentSequenceNumber,n));a.push(t)}return ew.waitFor(a).next(()=>s.apply(i)).next(()=>e.localDocuments.getLocalViewOfDocuments(i,o,l)).next(()=>o)}).then(t=>(e.vs=r,t))}(e.localStore,t);t.targetChanges.forEach((t,n)=>{let r=e.fu.get(n);r&&(b(t.addedDocuments.size+t.modifiedDocuments.size+t.removedDocuments.size<=1,22616),t.addedDocuments.size>0?r.Eu=!0:t.modifiedDocuments.size>0?b(r.Eu,14607):t.removedDocuments.size>0&&(b(r.Eu,42227),r.Eu=!1))}),await oW(e,n,t)}catch(e){await ey(e)}}function oL(e,t,n){var r;if(e.isPrimaryClient&&0===n||!e.isPrimaryClient&&1===n){let n;let i=[];e.Au.forEach((e,n)=>{let r=n.view.Oa(t);r.snapshot&&i.push(r.snapshot)}),(r=e.eventManager).onlineState=t,n=!1,r.queries.forEach((e,r)=>{for(let e of r.va)e.Oa(t)&&(n=!0)}),n&&oy(r),i.length&&e.Ru.H_(i),e.onlineState=t,e.isPrimaryClient&&e.sharedClientState.setOnlineState(t)}}async function oU(e,t,n){e.sharedClientState.updateQueryState(t,"rejected",n);let r=e.fu.get(t),i=r&&r.key;if(i){let n=new tF(Q.comparator);n=n.insert(i,nI.newNoDocument(i,ei.min()));let r=ru().add(i),s=new rZ(ei.min(),new Map,new tF(L),n,r);await oM(e,s),e.mu=e.mu.remove(i),e.fu.delete(t),oH(e)}else await s6(e.localStore,t,!1).then(()=>oG(e,t,n)).catch(ey)}async function oq(e,t){var n;let r=t.batch.batchId;try{let i=await (n=e.localStore).persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{let r=t.batch.keys(),i=n.xs.newChangeBuffer({trackRemovals:!0});return(function(e,t,n,r){let i=n.batch,s=i.keys(),a=ew.resolve();return s.forEach(e=>{a=a.next(()=>r.getEntry(t,e)).next(t=>{let s=n.docVersions.get(e);b(null!==s,48541),0>t.version.compareTo(s)&&(i.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),a.next(()=>e.mutationQueue.removeMutationBatch(t,i))})(n,e,t,i).next(()=>i.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=ru();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))});o$(e,r,null),oK(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await oW(e,i)}catch(e){await ey(e)}}async function oB(e,t,n){var r;try{let i=await (r=e.localStore).persistence.runTransaction("Reject batch","readwrite-primary",e=>{let n;return r.mutationQueue.lookupMutationBatch(e,t).next(t=>(b(null!==t,37113),n=t.keys(),r.mutationQueue.removeMutationBatch(e,t))).next(()=>r.mutationQueue.performConsistencyCheck(e)).next(()=>r.documentOverlayCache.removeOverlaysForBatchId(e,n,t)).next(()=>r.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,n)).next(()=>r.localDocuments.getDocuments(e,n))});o$(e,t,n),oK(e,t),e.sharedClientState.updateMutationState(t,"rejected",n),await oW(e,i)}catch(e){await ey(e)}}async function oz(e,t){var n;aY(e.remoteStore)||w(ox,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{let r=await (n=e.localStore).persistence.runTransaction("Get highest unacknowledged batch id","readonly",e=>n.mutationQueue.getHighestUnacknowledgedBatchId(e));if(-1===r)return void t.resolve();let i=e.yu.get(r)||[];i.push(t),e.yu.set(r,i)}catch(n){let e=oa(n,"Initialization of waitForPendingWrites() operation failed");t.reject(e)}}function oK(e,t){(e.yu.get(t)||[]).forEach(e=>{e.resolve()}),e.yu.delete(t)}function o$(e,t,n){let r=e.pu[e.currentUser.toKey()];if(r){let i=r.get(t);i&&(n?i.reject(n):i.resolve(),r=r.remove(t)),e.pu[e.currentUser.toKey()]=r}}function oG(e,t,n=null){for(let r of(e.sharedClientState.removeLocalQueryTarget(t),e.Vu.get(t)))e.Au.delete(r),n&&e.Ru.Du(r,n);e.Vu.delete(t),e.isPrimaryClient&&e.gu.Gr(t).forEach(t=>{e.gu.containsKey(t)||oj(e,t)})}function oj(e,t){e.du.delete(t.path.canonicalString());let n=e.mu.get(t);null!==n&&(aj(e.remoteStore,n),e.mu=e.mu.remove(t),e.fu.delete(n),oH(e))}function oQ(e,t,n){for(let r of n)r instanceof o_?(e.gu.addReference(r.key,t),function(e,t){let n=t.key,r=n.path.canonicalString();e.mu.get(n)||e.du.has(r)||(w(ox,"New document in limbo: "+n),e.du.add(r),oH(e))}(e,r)):r instanceof ob?(w(ox,"Document no longer in limbo: "+r.key),e.gu.removeReference(r.key,t),e.gu.containsKey(r.key)||oj(e,r.key)):E(19791,{Cu:r})}function oH(e){for(;e.du.size>0&&e.mu.size<e.maxConcurrentLimboResolutions;){let t=e.du.values().next().value;e.du.delete(t);let n=new Q($.fromString(t)),r=e.wu.next();e.fu.set(r,new oC(n)),e.mu=e.mu.insert(n,r),aG(e.remoteStore,new iN(n1(nJ(n.path)),r,"TargetPurposeLimboResolution",eR.ce))}}async function oW(e,t,n){let r=[],i=[],s=[];e.Au.isEmpty()||(e.Au.forEach((a,o)=>{s.push(e.bu(o,t,n).then(t=>{if((t||n)&&e.isPrimaryClient){let r=t?!t.fromCache:n?.targetChanges.get(o.targetId)?.current;e.sharedClientState.updateQueryState(o.targetId,r?"current":"not-current")}if(t){r.push(t);let e=sY.Es(o.targetId,t);i.push(e)}}))}),await Promise.all(s),e.Ru.H_(r),await async function(e,t){try{await e.persistence.runTransaction("notifyLocalViewChanges","readwrite",n=>ew.forEach(t,t=>ew.forEach(t.Ts,r=>e.persistence.referenceDelegate.addReference(n,t.targetId,r)).next(()=>ew.forEach(t.Is,r=>e.persistence.referenceDelegate.removeReference(n,t.targetId,r)))))}catch(e){if(!eS(e))throw e;w(s0,"Failed to update sequence numbers: "+e)}for(let n of t){let t=n.targetId;if(!n.fromCache){let n=e.vs.get(t),r=n.snapshotVersion,i=n.withLastLimboFreeSnapshotVersion(r);e.vs=e.vs.insert(t,i)}}}(e.localStore,i))}async function oJ(e,t){var n;if(!e.currentUser.isEqual(t)){w(ox,"User change. New user:",t.toKey());let r=await s2(e.localStore,t);e.currentUser=t,n="'waitForPendingWrites' promise is rejected due to a user change.",e.yu.forEach(e=>{e.forEach(e=>{e.reject(new x(S.CANCELLED,n))})}),e.yu.clear(),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await oW(e,r.Ns)}}function oY(e,t){let n=e.fu.get(t);if(n&&n.Eu)return ru().add(n.key);{let n=ru(),r=e.Vu.get(t);if(!r)return n;for(let t of r){let r=e.Au.get(t);n=n.unionWith(r.view.ou)}return n}}async function oX(e,t){let n=await s8(e.localStore,t.query,!0),r=t.view.Tu(n);return e.isPrimaryClient&&oQ(e,t.targetId,r.hu),r}async function oZ(e,t){return s7(e.localStore,t).then(t=>oW(e,t))}async function o0(e,t,n,r){let i=await function(e,t){let n=e.mutationQueue;return e.persistence.runTransaction("Lookup mutation documents","readonly",r=>n.Xn(r,t).next(t=>t?e.localDocuments.getDocuments(r,t):ew.resolve(null)))}(e.localStore,t);null!==i?("pending"===n?await a5(e.remoteStore):"acknowledged"===n||"rejected"===n?(o$(e,t,r||null),oK(e,t),function(e,t){e.mutationQueue.nr(t)}(e.localStore,t)):E(6720,"Unknown batchState",{vu:n}),await oW(e,i)):w(ox,"Cannot apply mutation batch with id: "+t)}async function o1(e,t){if(o8(e),o9(e),!0===t&&!0!==e.Su){let t=e.sharedClientState.getAllActiveQueryTargets(),n=await o2(e,t.toArray());for(let t of(e.Su=!0,await on(e.remoteStore,!0),n))aG(e.remoteStore,t)}else if(!1===t&&!1!==e.Su){let t=[],n=Promise.resolve();e.Vu.forEach((r,i)=>{e.sharedClientState.isLocalQueryTarget(i)?t.push(i):n=n.then(()=>(oG(e,i),s6(e.localStore,i,!0))),aj(e.remoteStore,i)}),await n,await o2(e,t),e.fu.forEach((t,n)=>{aj(e.remoteStore,n)}),e.gu.zr(),e.fu=new Map,e.mu=new tF(Q.comparator),e.Su=!1,await on(e.remoteStore,!1)}}async function o2(e,t,n){let r=[],i=[];for(let n of t){let t;let s=e.Vu.get(n);if(s&&0!==s.length)for(let n of(t=await s3(e.localStore,n1(s[0])),s)){let t=e.Au.get(n),r=await oX(e,t);r.snapshot&&i.push(r.snapshot)}else{let r=await s9(e.localStore,n);t=await s3(e.localStore,r),await oR(e,o4(r),n,!1,t.resumeToken)}r.push(t)}return e.Ru.H_(i),r}function o4(e){var t,n,r,i;return t=e.path,n=e.collectionGroup,r=e.orderBy,i=e.filters,new nW(t,n,r,i,e.limit,"F",e.startAt,e.endAt)}function o5(e){return e.localStore.persistence.hs()}async function o3(e,t,n,r){if(e.Su)return void w(ox,"Ignoring unexpected query state notification.");let i=e.Vu.get(t);if(i&&i.length>0)switch(n){case"current":case"not-current":{let r=await s7(e.localStore,n7(i[0])),s=rZ.createSynthesizedRemoteEventForCurrentChange(t,"current"===n,tK.EMPTY_BYTE_STRING);await oW(e,r,s);break}case"rejected":await s6(e.localStore,t,!0),oG(e,t,r);break;default:E(64155,n)}}async function o6(e,t,n){let r=o8(e);if(r.Su){for(let e of t){if(r.Vu.has(e)&&r.sharedClientState.isActiveQueryTarget(e)){w(ox,"Adding an already active target "+e);continue}let t=await s9(r.localStore,e),n=await s3(r.localStore,t);await oR(r,o4(t),n.targetId,!1,n.resumeToken),aG(r.remoteStore,n)}for(let e of n)r.Vu.has(e)&&await s6(r.localStore,e,!1).then(()=>{aj(r.remoteStore,e),oG(r,e)}).catch(ey)}}function o8(e){return e.remoteStore.remoteSyncer.applyRemoteEvent=oM.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=oY.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=oU.bind(null,e),e.Ru.H_=og.bind(null,e.eventManager),e.Ru.Du=op.bind(null,e.eventManager),e}function o9(e){return e.remoteStore.remoteSyncer.applySuccessfulWrite=oq.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=oB.bind(null,e),e}class o7{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ak(e.databaseInfo.databaseId),this.sharedClientState=this.Mu(e),this.persistence=this.xu(e),await this.persistence.start(),this.localStore=this.Ou(e),this.gcScheduler=this.Nu(e,this.localStore),this.indexBackfillerScheduler=this.Bu(e,this.localStore)}Nu(e,t){return null}Bu(e,t){return null}Ou(e){var t;return t=this.persistence,new s1(t,new sZ,e.initialUser,this.serializer)}xu(e){return new sq(sz.Vi,this.serializer)}Mu(e){return new ap}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}o7.provider={build:()=>new o7};class le extends o7{constructor(e){super(),this.cacheSizeBytes=e}Nu(e,t){return b(this.persistence.referenceDelegate instanceof sK,46915),new sv(this.persistence.referenceDelegate.garbageCollector,e.asyncQueue,t)}xu(e){let t=void 0!==this.cacheSizeBytes?so.withCacheSize(this.cacheSizeBytes):so.DEFAULT;return new sq(e=>sK.Vi(e,t),this.serializer)}}class lt extends o7{constructor(e,t,n){super(),this.Lu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Lu.initialize(this,e),await o9(this.Lu.syncEngine),await a5(this.Lu.remoteStore),await this.persistence.zi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}Ou(e){var t;return t=this.persistence,new s1(t,new sZ,e.initialUser,this.serializer)}Nu(e,t){return new sv(this.persistence.referenceDelegate.garbageCollector,e.asyncQueue,t)}Bu(e,t){let n=new eV(t,this.persistence);return new ek(e.asyncQueue,n)}xu(e){let t=sJ(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=void 0!==this.cacheSizeBytes?so.withCacheSize(this.cacheSizeBytes):so.DEFAULT;return new sW(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,aD(),aN(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Mu(e){return new ap}}class ln extends lt{constructor(e,t){super(e,t,!1),this.Lu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);let t=this.Lu.syncEngine;this.sharedClientState instanceof ag&&(this.sharedClientState.syncEngine={bo:o0.bind(null,t),Do:o3.bind(null,t),Co:o6.bind(null,t),hs:o5.bind(null,t),So:oZ.bind(null,t)},await this.sharedClientState.start()),await this.persistence.zi(async e=>{await o1(this.Lu.syncEngine,e),this.gcScheduler&&(e&&!this.gcScheduler.started?this.gcScheduler.start():e||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(e&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():e||this.indexBackfillerScheduler.stop())})}Mu(e){let t=aD();if(!ag.v(t))throw new x(S.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");let n=sJ(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new ag(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class lr{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>oL(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=oJ.bind(null,this.syncEngine),await on(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new oh}createDatastore(e){let t=ak(e.databaseInfo.databaseId),n=new aC(e.databaseInfo);return new aL(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){var t;return t=this.localStore,new aB(t,this.datastore,e.asyncQueue,e=>oL(this.syncEngine,e,0),av.v()?new av:new ay)}createSyncEngine(e,t){return function(e,t,n,r,i,s,a){let o=new oD(e,t,n,r,i,s);return a&&(o.Su=!0),o}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await async function(e){w(aq,"RemoteStore shutting down."),e.da.add(5),await aK(e),e.fa.shutdown(),e.ga.set("Unknown")}(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}function li(e,t=10240){let n=0;return{async read(){if(n<e.byteLength){let r={value:e.slice(n,n+t),done:!1};return n+=t,r}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}lr.provider={build:()=>new lr};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
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
 */class ls{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.ku(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.ku(this.observer.error,e):v("Uncaught Error in snapshot listener:",e.toString()))}Ku(){this.muted=!0}ku(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class la{constructor(e,t){this.qu=e,this.serializer=t,this.metadata=new A,this.buffer=new Uint8Array,this.Uu=new TextDecoder("utf-8"),this.$u().then(e=>{e&&e.Ga()?this.metadata.resolve(e.Qa.metadata):this.metadata.reject(Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(e?.Qa)}`))},e=>this.metadata.reject(e))}close(){return this.qu.cancel()}async getMetadata(){return this.metadata.promise}async Fu(){return await this.getMetadata(),this.$u()}async $u(){let e=await this.Wu();if(null===e)return null;let t=this.Uu.decode(e),n=Number(t);return isNaN(n)&&this.Qu(`length string (${t}) is not valid number`),new ov(JSON.parse(await this.Gu(n)),e.length+n)}zu(){return this.buffer.findIndex(e=>123===e)}async Wu(){for(;0>this.zu()&&!await this.ju(););if(0===this.buffer.length)return null;let e=this.zu();e<0&&this.Qu("Reached the end of bundle when a length string is expected.");let t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Gu(e){for(;this.buffer.length<e;)await this.ju()&&this.Qu("Reached the end of bundle when more is expected.");let t=this.Uu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}Qu(e){throw this.qu.cancel(),Error(`Invalid bundle format: ${e}`)}async ju(){let e=await this.qu.read();if(!e.done){let t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
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
 */class lo{constructor(e,t){this.bundleData=e,this.serializer=t,this.cursor=0,this.elements=[];let n=this.Fu();if(!n||!n.Ga())throw Error(`The first element of the bundle is not a metadata object, it is
         ${JSON.stringify(n?.Qa)}`);this.metadata=n;do null!==(n=this.Fu())&&this.elements.push(n);while(null!==n)}getMetadata(){return this.metadata}Ju(){return this.elements}Fu(){if(this.cursor===this.bundleData.length)return null;let e=this.Wu();return new ov(JSON.parse(this.Gu(e)),e)}Gu(e){if(this.cursor+e>this.bundleData.length)throw new x(S.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=e)}Wu(){let e=this.cursor,t=this.cursor;for(;t<this.bundleData.length;){if("{"===this.bundleData[t]){if(t===e)throw Error("First character is a bracket and not a number");return this.cursor=t,Number(this.bundleData.slice(e,t))}t++}throw Error("Reached the end of bundle when more is expected.")}}/**
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
 */class ll{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new x(S.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;let t=await async function(e,t){let n={documents:t.map(t=>ic(e.serializer,t))},r=await e.jo("BatchGetDocuments",e.serializer.databaseId,$.emptyPath(),n,t.length),i=new Map;r.forEach(t=>{var n;let r=(n=e.serializer,"found"in t?function(e,t){b(!!t.found,43571),t.found.name,t.found.updateTime;let n=ih(e,t.found.name),r=ia(t.found.updateTime),i=t.found.createTime?ia(t.found.createTime):ei.min(),s=new nv({mapValue:{fields:t.found.fields}});return nI.newFoundDocument(n,r,i,s)}(n,t):"missing"in t?function(e,t){b(!!t.missing,3894),b(!!t.readTime,22933);let n=ih(e,t.missing),r=ia(t.readTime);return nI.newNoDocument(n,r)}(n,t):E(7234,{result:t}));i.set(r.key.toString(),r)});let s=[];return t.forEach(e=>{let t=i.get(e.toString());b(!!t,55234,{key:e}),s.push(t)}),s}(this.datastore,e);return t.forEach(e=>this.recordVersion(e)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(e){this.lastTransactionError=e}this.writtenDocs.add(e.toString())}delete(e){this.write(new rM(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;let e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((e,t)=>{let n=Q.fromPath(t);this.mutations.push(new rL(n,this.precondition(n)))}),await async function(e,t){let n={writes:t.map(t=>iI(e.serializer,t))};await e.Wo("Commit",e.serializer.databaseId,$.emptyPath(),n)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw E(50498,{Hu:e.constructor.name});t=ei.min()}let n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new x(S.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){let t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(ei.min())?rx.exists(!1):rx.updateTime(t):rx.none()}preconditionForUpdate(e){let t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(ei.min()))throw new x(S.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return rx.updateTime(t)}return rx.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
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
 */class lu{constructor(e,t,n,r,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=r,this.deferred=i,this.Zu=n.maxAttempts,this.M_=new aV(this.asyncQueue,"transaction_retry")}Xu(){this.Zu-=1,this.Yu()}Yu(){this.M_.p_(async()=>{let e=new ll(this.datastore),t=this.ec(e);t&&t.then(t=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(t)}).catch(e=>{this.tc(e)}))}).catch(e=>{this.tc(e)})})}ec(e){try{let t=this.updateFunction(e);return!eP(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(e){return this.deferred.reject(e),null}}tc(e){this.Zu>0&&this.nc(e)?(this.Zu-=1,this.asyncQueue.enqueueAndForget(()=>(this.Yu(),Promise.resolve()))):this.deferred.reject(e)}nc(e){if("FirebaseError"===e?.name){let t=e.code;return"aborted"===t||"failed-precondition"===t||"already-exists"===t||!r$(t)}return!1}}/**
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
 */let lc="FirestoreClient";class lh{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=r,this.user=m.UNAUTHENTICATED,this.clientId=M.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async e=>{w(lc,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(w(lc,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();let e=new A;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){let t=oa(n,"Failed to shutdown persistence");e.reject(t)}}),e.promise}}async function ld(e,t){e.asyncQueue.verifyOperationInProgress(),w(lc,"Initializing OfflineComponentProvider");let n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await s2(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function lf(e,t){e.asyncQueue.verifyOperationInProgress();let n=await lm(e);w(lc,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>ot(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>ot(t.remoteStore,n)),e._onlineComponents=t}async function lm(e){if(!e._offlineComponents){if(e._uninitializedComponentsProvider){w(lc,"Using user provided OfflineComponentProvider");try{await ld(e,e._uninitializedComponentsProvider._offline)}catch(t){if(!("FirebaseError"===t.name?t.code===S.FAILED_PRECONDITION||t.code===S.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code))throw t;I("Error using user provided cache. Falling back to memory cache: "+t),await ld(e,new o7)}}else w(lc,"Using default OfflineComponentProvider"),await ld(e,new le(void 0))}return e._offlineComponents}async function lg(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(w(lc,"Using user provided OnlineComponentProvider"),await lf(e,e._uninitializedComponentsProvider._online)):(w(lc,"Using default OnlineComponentProvider"),await lf(e,new lr))),e._onlineComponents}function lp(e){return lm(e).then(e=>e.persistence)}function ly(e){return lm(e).then(e=>e.localStore)}function lw(e){return lg(e).then(e=>e.remoteStore)}function lv(e){return lg(e).then(e=>e.syncEngine)}function lI(e){return lg(e).then(e=>e.datastore)}async function lT(e){let t=await lg(e),n=t.eventManager;return n.onListen=oN.bind(null,t.syncEngine),n.onUnlisten=oP.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=ok.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=oF.bind(null,t.syncEngine),n}/**
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
 */function lE(e){let t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let l_="ComponentProvider",lb=new Map;function lS(e,t,n,r,i){return new t1(e,t,n,i.host,i.ssl,i.experimentalForceLongPolling,i.experimentalAutoDetectLongPolling,lE(i.experimentalLongPollingOptions),i.useFetchStreams,i.isUsingEmulator,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let lx="firestore.googleapis.com";class lA{constructor(e){if(void 0===e.host){if(void 0!==e.ssl)throw new x(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=lx,this.ssl=!0}else this.host=e.host,this.ssl=e.ssl??!0;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new x(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}W("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=lE(e.experimentalLongPollingOptions??{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new x(S.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new x(S.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new x(S.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,n;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class lC{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new lA({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new x(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new x(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new lA(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new D;switch(e.type){case"firstParty":return new R(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new x(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=lb.get(e);t&&(w(l_,"Removing Datastore"),lb.delete(e),t.terminate())}(this),Promise.resolve()}}function lD(e,t,n,r={}){e=ee(e,lC);let i=c.isCloudWorkstation(t),s=e._getSettings(),a={...s,emulatorOptions:e._getEmulatorOptions()},o=`${t}:${n}`;i&&c.pingServer(`https://${o}`),s.host!==lx&&s.host!==o&&I("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let l={...s,host:o,ssl:i,emulatorOptions:r};if(!c.deepEqual(l,a)&&(e._setSettings(l),r.mockUserToken)){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=m.MOCK_USER;else{t=c.createMockUserToken(r.mockUserToken,e._app?.options.projectId);let i=r.mockUserToken.sub||r.mockUserToken.user_id;if(!i)throw new x(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new m(i)}e._authCredentials=new N(new C(t,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lN{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new lN(this.firestore,e,this._query)}}class lk{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new lV(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new lk(this.firestore,e,this._key)}toJSON(){return{type:lk._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(en(t,lk._jsonSchema))return new lk(e,n||null,new Q($.fromString(t.referencePath)))}}lk._jsonSchemaVersion="firestore/documentReference/1.0",lk._jsonSchema={type:et("string",lk._jsonSchemaVersion),referencePath:et("string")};class lV extends lN{constructor(e,t,n){super(e,t,nJ(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new lk(this.firestore,null,new Q(e))}withConverter(e){return new lV(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let lR="AsyncQueue";class lP{constructor(e=Promise.resolve()){this.rc=[],this.sc=!1,this.oc=[],this._c=null,this.ac=!1,this.uc=!1,this.cc=[],this.M_=new aV(this,"async_queue_retry"),this.lc=()=>{let e=aN();e&&w(lR,"Visibility state changed to "+e.visibilityState),this.M_.w_()},this.hc=e;let t=aN();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this.lc)}get isShuttingDown(){return this.sc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Pc(),this.Tc(e)}enterRestrictedMode(e){if(!this.sc){this.sc=!0,this.uc=e||!1;let t=aN();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.lc)}}enqueue(e){if(this.Pc(),this.sc)return new Promise(()=>{});let t=new A;return this.Tc(()=>this.sc&&this.uc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.rc.push(e),this.Ic()))}async Ic(){if(0!==this.rc.length){try{await this.rc[0](),this.rc.shift(),this.M_.reset()}catch(e){if(!eS(e))throw e;w(lR,"Operation failed with retryable error: "+e)}this.rc.length>0&&this.M_.p_(()=>this.Ic())}}Tc(e){let t=this.hc.then(()=>(this.ac=!0,e().catch(e=>{throw this._c=e,this.ac=!1,v("INTERNAL UNHANDLED ERROR: ",lF(e)),e}).then(e=>(this.ac=!1,e))));return this.hc=t,t}enqueueAfterDelay(e,t,n){this.Pc(),this.cc.indexOf(e)>-1&&(t=0);let r=os.createAndSchedule(this,e,t,n,e=>this.Ec(e));return this.oc.push(r),r}Pc(){this._c&&E(47125,{Rc:lF(this._c)})}verifyOperationInProgress(){}async Ac(){let e;do e=this.hc,await e;while(e!==this.hc)}Vc(e){for(let t of this.oc)if(t.timerId===e)return!0;return!1}dc(e){return this.Ac().then(()=>{for(let t of(this.oc.sort((e,t)=>e.targetTimeMs-t.targetTimeMs),this.oc))if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.Ac()})}mc(e){this.cc.push(e)}Ec(e){let t=this.oc.indexOf(e);this.oc.splice(t,1)}}function lF(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lO{constructor(){this._progressObserver={},this._taskCompletionResolver=new A,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}class lM extends lC{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new lP,this._persistenceKey=r?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new lP(e),this._firestoreClient=void 0,await e}}}function lL(e){if(e._terminated)throw new x(S.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||lU(e),e._firestoreClient}function lU(e){let t=e._freezeSettings(),n=lS(e._databaseId,e._app?.options.appId||"",e._persistenceKey,e._app?.options.apiKey,t);e._componentsProvider||t.localCache?._offlineComponentProvider&&t.localCache?._onlineComponentProvider&&(e._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),e._firestoreClient=new lh(e._authCredentials,e._appCheckCredentials,e._queue,n,e._componentsProvider&&function(e){let t=e?._online.build();return{_offline:e?._offline.build(t),_online:t}}(e._componentsProvider))}async function lq(e){I("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");let t=e._freezeSettings();lB(e,lr.provider,{build:e=>new ln(e,t.cacheSizeBytes)})}function lB(e,t,n){if((e=ee(e,lM))._firestoreClient||e._terminated)throw new x(S.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(e._componentsProvider||e._getSettings().localCache)throw new x(S.FAILED_PRECONDITION,"SDK cache is already specified.");e._componentsProvider={_online:t,_offline:n},lU(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lz{constructor(e){this._byteString=e}static fromBase64String(e){try{return new lz(tK.fromBase64String(e))}catch(e){throw new x(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(e){return new lz(tK.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:lz._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(en(e,lz._jsonSchema))return lz.fromBase64String(e.bytes)}}lz._jsonSchemaVersion="firestore/bytes/1.0",lz._jsonSchema={type:et("string",lz._jsonSchemaVersion),bytes:et("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lK{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new x(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new j(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l${constructor(e){this._methodName=e}}/**
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
 */class lG{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new x(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new x(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return L(this._lat,e._lat)||L(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:lG._jsonSchemaVersion}}static fromJSON(e){if(en(e,lG._jsonSchema))return new lG(e.latitude,e.longitude)}}lG._jsonSchemaVersion="firestore/geoPoint/1.0",lG._jsonSchema={type:et("string",lG._jsonSchemaVersion),latitude:et("number"),longitude:et("number")};/**
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
 */class lj{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:lj._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(en(e,lj._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(e=>"number"==typeof e))return new lj(e.vectorValues);throw new x(S.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}lj._jsonSchemaVersion="firestore/vectorValue/1.0",lj._jsonSchema={type:et("string",lj._jsonSchemaVersion),vectorValues:et("object")};/**
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
 */let lQ=/^__.*__$/;class lH{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new rR(e,this.data,this.fieldMask,t,this.fieldTransforms):new rV(e,this.data,t,this.fieldTransforms)}}class lW{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new rR(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function lJ(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw E(40011,{dataSource:e})}}class lY{constructor(e,t,n,r,i,s){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.fc(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new lY({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}yc(e){let t=this.path?.child(e),n=this.i({path:t,arrayElement:!1});return n.wc(e),n}Sc(e){let t=this.path?.child(e),n=this.i({path:t,arrayElement:!1});return n.fc(),n}bc(e){return this.i({path:void 0,arrayElement:!0})}Dc(e){return ur(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}fc(){if(this.path)for(let e=0;e<this.path.length;e++)this.wc(this.path.get(e))}wc(e){if(0===e.length)throw this.Dc("Document fields must not be empty");if(lJ(this.dataSource)&&lQ.test(e))throw this.Dc('Document fields cannot begin and end with "__"')}}class lX{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||ak(e)}V(e,t,n,r=!1){return new lY({dataSource:e,methodName:t,targetDoc:n,path:j.emptyPath(),arrayElement:!1,hasConverter:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function lZ(e){let t=e._freezeSettings(),n=ak(e._databaseId);return new lX(e._databaseId,!!t.ignoreUndefinedProperties,n)}class l0 extends l${_toFieldTransform(e){if(2!==e.dataSource)throw 1===e.dataSource?e.Dc(`${this._methodName}() can only appear at the top level of your update data`):e.Dc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof l0}}function l1(e,t,n){return new lY({dataSource:3,targetDoc:t.settings.targetDoc,methodName:e._methodName,arrayElement:n},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class l2 extends l${_toFieldTransform(e){return new rb(e.path,new rp)}isEqual(e){return e instanceof l2}}class l4 extends l${constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){let t=l1(this,e,!0),n=new ry(this.vc.map(e=>l6(e,t)));return new rb(e.path,n)}isEqual(e){return e instanceof l4&&c.deepEqual(this.vc,e.vc)}}class l5 extends l${constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){let t=l1(this,e,!0),n=new rv(this.vc.map(e=>l6(e,t)));return new rb(e.path,n)}isEqual(e){return e instanceof l5&&c.deepEqual(this.vc,e.vc)}}class l3 extends l${constructor(e,t){super(e),this.Fc=t}_toFieldTransform(e){let t=new rT(e.serializer,rf(e.serializer,this.Fc));return new rb(e.path,t)}isEqual(e){return e instanceof l3&&this.Fc===e.Fc}}function l6(e,t){if(l9(e=c.getModularInstance(e)))return l7("Unsupported field value:",t,e),l8(e,t);if(e instanceof l$)return function(e,t){if(!lJ(t.dataSource))throw t.Dc(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.Dc(`${e._methodName}() is not currently supported inside arrays`);let n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.arrayElement&&4!==t.dataSource)throw t.Dc("Nested arrays are not supported");return function(e,t){let n=[],r=0;for(let i of e){let e=l6(i,t.bc(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if(null===(e=c.getModularInstance(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return rf(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){let n=er.fromDate(e);return{timestampValue:ii(t.serializer,n)}}if(e instanceof er){let n=new er(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:ii(t.serializer,n)}}if(e instanceof lG)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof lz)return{bytesValue:is(t.serializer,e._byteString)};if(e instanceof lk){let n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.Dc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:io(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof lj){var n;return{mapValue:{fields:{[t5]:{stringValue:t8},[t9]:{arrayValue:{values:((n=e)instanceof lj?n.toArray():n).map(e=>{if("number"!=typeof e)throw t.Dc("VectorValues must only contain numeric values.");return rh(t.serializer,e)})}}}}}}if(iD(e))return e._toProto(t.serializer);throw t.Dc(`Unsupported field value: ${Z(e)}`)}(e,t)}function l8(e,t){let n={};return tP(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):tV(e,(e,r)=>{let i=l6(r,t.yc(e));null!=i&&(n[e]=i)}),{mapValue:{fields:n}}}function l9(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof er||e instanceof lG||e instanceof lz||e instanceof lk||e instanceof l$||e instanceof lj||iD(e))}function l7(e,t,n){if(!l9(n)||!X(n)){let r=Z(n);throw"an object"===r?t.Dc(e+" a custom object"):t.Dc(e+" "+r)}}function ue(e,t,n){if((t=c.getModularInstance(t))instanceof lK)return t._internalPath;if("string"==typeof t)return un(e,t);throw ur("Field path arguments must be of type string or ",e,!1,void 0,n)}let ut=RegExp("[~\\*/\\[\\]]");function un(e,t,n){if(t.search(ut)>=0)throw ur(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new lK(...t.split("."))._internalPath}catch(r){throw ur(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function ur(e,t,n,r,i){let s=r&&!r.isEmpty(),a=void 0!==i,o=`Function ${t}() called with invalid data`;n&&(o+=" (via `toFirestore()`)"),o+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${r}`),a&&(l+=` in document ${i}`),l+=")"),new x(S.INVALID_ARGUMENT,o+e+l)}function ui(e,t){return e.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class us{convertValue(e,t="none"){switch(ne(e)){case 0:return null;case 1:return e.booleanValue;case 2:return tj(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(tQ(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw E(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let n={};return tV(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){return new lj(e.fields?.[t9].arrayValue?.values?.map(e=>tj(e.doubleValue)))}convertGeoPoint(e){return new lG(tj(e.latitude),tj(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":let n=tZ(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(t0(e));default:return null}}convertTimestamp(e){let t=tG(e);return new er(t.seconds,t.nanos)}convertDocumentKey(e,t){let n=$.fromString(e);b(iC(n),9688,{name:e});let r=new t4(n.get(1),n.get(3)),i=new Q(n.popFirst(5));return r.isEqual(t)||v(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
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
 */class ua extends us{constructor(e){super(),this.firestore=e}convertBytes(e){return new lz(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new lk(this.firestore,null,t)}}/**
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
 */class uo{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){let n=nv.empty();for(let r in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(r)){let i=this.optionDefinitions[r];if(r in e){let s;let a=e[r];i.nestedOptions&&X(a)?s={mapValue:{fields:new uo(i.nestedOptions).getOptionsProto(t,a)}}:a&&(s=l6(a,t)??void 0),s&&n.set(j.fromServerFormat(i.serverName),s)}}return n}getOptionsProto(e,t,n){let r=this._getKnownOptions(t,e);if(n){let t=new Map(tR(n,(t,n)=>[j.fromServerFormat(n),void 0!==t?l6(t,e):null]));r.setAll(t)}return r.value.mapValue.fields??{}}}/**
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
 */class ul{constructor(e={},t={}){this.Mc=e,this.xc=t,this.Oc=new uo({indexMode:{serverName:"index_mode"}})}_readUserData(e){this.proto=this.Oc.getOptionsProto(e,this.Mc,this.xc)}}class uu{constructor(e,t){this.pipeline=e,this.options=t}_toProto(e){return{pipeline:this.pipeline._toProto(e),options:this.options.proto}}}t.AbstractUserDataWriter=us,t.Bound=nT,t.ByteString=tK,t.Bytes=lz,t.CollectionReference=lV,t.CompositeFilter=nA,t.D=S,t.DatabaseId=t4,t.DocumentKey=Q,t.DocumentReference=lk,t.DocumentSet=oo,t.F=z,t.FieldFilter=nx,t.FieldIndex=es,t.FieldPath=lK,t.FieldPath$1=j,t.FieldValue=l$,t.Firestore=lM,t.FirestoreError=x,t.GeoPoint=lG,t.IndexSegment=eu,t.IndexState=ec,t.LoadBundleTask=lO,t.ObjectValue=nv,t.OnlineComponentProvider=lr,t.OptionsUtil=uo,t.OrderBy=nb,t.Precondition=rx,t.Query=lN,t.ResourcePath=$,t.StructuredPipeline=uu,t.Timestamp=er,t.VectorValue=lj,t.ViewSnapshot=ou,t.__PRIVATE_AggregateImpl=rz,t.__PRIVATE_AutoId=M,t.__PRIVATE_BundleLoader=oT,t.__PRIVATE_DeleteMutation=rM,t.__PRIVATE_EmptyAppCheckTokenProvider=O,t.__PRIVATE_EmptyAuthCredentialsProvider=D,t.__PRIVATE_ExpUserDataWriter=ua,t.__PRIVATE_FirebaseAppCheckTokenProvider=F,t.__PRIVATE_FirebaseAuthCredentialsProvider=k,t.__PRIVATE_IndexedDbOfflineComponentProvider=lt,t.__PRIVATE_LruGcMemoryOfflineComponentProvider=le,t.__PRIVATE_MemoryOfflineComponentProvider=o7,t.__PRIVATE_MultiTabOfflineComponentProvider=ln,t.__PRIVATE_StructuredPipelineOptions=ul,t.__PRIVATE_cast=ee,t.__PRIVATE_createBundleReaderSync=function(e,t){return new lo(e,t)},t.__PRIVATE_databaseIdFromApp=function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new x(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new t4(e.options.projectId,t)},t.__PRIVATE_debugAssert=function(e,t){e||E(57014,t)},t.__PRIVATE_documentKeySet=ru,t.__PRIVATE_fieldPathFromArgument=ue,t.__PRIVATE_fieldPathFromDotSeparatedString=un,t.__PRIVATE_firestoreClientAddSnapshotsInSyncListener=function(e,t){let n=new ls(t);return e.asyncQueue.enqueueAndForget(async()=>{(await lT(e)).xa.add(n),n.next()}),()=>{n.Ku(),e.asyncQueue.enqueueAndForget(async()=>(function(e,t){e.xa.delete(t)})(await lT(e),n))}},t.__PRIVATE_firestoreClientDeleteAllFieldIndexes=function(e){return e.asyncQueue.enqueue(async()=>(function(e){let t=e.indexManager;return e.persistence.runTransaction("Delete All Indexes","readwrite",e=>t.deleteAllFieldIndexes(e))})(await ly(e)))},t.__PRIVATE_firestoreClientExecutePipeline=function(e,t){let n=new A;return e.asyncQueue.enqueueAndForget(async()=>{try{let r=await lI(e);n.resolve(async function(e,t){let n={database:ig(e.serializer),structuredPipeline:t._toProto(e.serializer)},r=await e.jo("ExecutePipeline",e.serializer.databaseId,$.emptyPath(),n),i=[];return r.forEach(t=>{if(t.results&&0!==t.results.length)return t.results.forEach(n=>i.push(iw(e.serializer,t,n)));i.push(iw(e.serializer,t))}),i}(r,t))}catch(e){n.reject(e)}}),n.promise},t.__PRIVATE_firestoreClientGetDocumentFromLocalCache=function(e,t){let n=new A;return e.asyncQueue.enqueueAndForget(async()=>(async function(e,t,n){try{let r=await e.persistence.runTransaction("read document","readonly",n=>e.localDocuments.getDocument(n,t));r.isFoundDocument()?n.resolve(r):r.isNoDocument()?n.resolve(null):n.reject(new x(S.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(r){let e=oa(r,`Failed to get document '${t} from cache`);n.reject(e)}})(await ly(e),t,n)),n.promise},t.__PRIVATE_firestoreClientGetDocumentViaSnapshotListener=function(e,t,n={}){let r=new A;return e.asyncQueue.enqueueAndForget(async()=>(function(e,t,n,r,i){let s=new ls({next:o=>{s.Ku(),t.enqueueAndForget(()=>om(e,a));let l=o.docs.has(n);!l&&o.fromCache?i.reject(new x(S.UNAVAILABLE,"Failed to get document because the client is offline.")):l&&o.fromCache&&r&&"server"===r.source?i.reject(new x(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):i.resolve(o)},error:e=>i.reject(e)}),a=new ow(nJ(n.path),s,{includeMetadataChanges:!0,Wa:!0});return of(e,a)})(await lT(e),e.asyncQueue,t,n,r)),r.promise},t.__PRIVATE_firestoreClientGetDocumentsFromLocalCache=function(e,t){let n=new A;return e.asyncQueue.enqueueAndForget(async()=>(async function(e,t,n){try{let r=await s8(e,t,!0),i=new oS(t,r.ks),s=i._u(r.documents),a=i.applyChanges(s,!1);n.resolve(a.snapshot)}catch(r){let e=oa(r,`Failed to execute query '${t} against cache`);n.reject(e)}})(await ly(e),t,n)),n.promise},t.__PRIVATE_firestoreClientGetDocumentsViaSnapshotListener=function(e,t,n={}){let r=new A;return e.asyncQueue.enqueueAndForget(async()=>(function(e,t,n,r,i){let s=new ls({next:n=>{s.Ku(),t.enqueueAndForget(()=>om(e,a)),n.fromCache&&"server"===r.source?i.reject(new x(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(n)},error:e=>i.reject(e)}),a=new ow(n,s,{includeMetadataChanges:!0,Wa:!0});return of(e,a)})(await lT(e),e.asyncQueue,t,n,r)),r.promise},t.__PRIVATE_firestoreClientListen=function(e,t,n,r){let i=new ls(r),s=new ow(t,i,n);return e.asyncQueue.enqueueAndForget(async()=>of(await lT(e),s)),()=>{i.Ku(),e.asyncQueue.enqueueAndForget(async()=>om(await lT(e),s))}},t.__PRIVATE_firestoreClientRunAggregateQuery=function(e,t,n){let r=new A;return e.asyncQueue.enqueueAndForget(async()=>{try{let i=await lI(e);r.resolve(async function(e,t,n){let{request:r,gt:i,parent:s}=ib(e.serializer,n2(t),n);e.connection.Ko||delete r.parent;let a=(await e.jo("RunAggregationQuery",e.serializer.databaseId,s,r,1)).filter(e=>!!e.result);b(1===a.length,64727);let o=a[0].result?.aggregateFields;return Object.keys(o).reduce((e,t)=>(e[i[t]]=o[t],e),{})}(i,t,n))}catch(e){r.reject(e)}}),r.promise},t.__PRIVATE_firestoreClientSetIndexConfiguration=function(e,t){return e.asyncQueue.enqueue(async()=>(async function(e,t){let n=e.indexManager,r=[];return e.persistence.runTransaction("Configure indexes","readwrite",e=>n.getFieldIndexes(e).next(i=>/**
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
 */(function(e,t,n,r,i){t=[...t],(e=[...e]).sort(n),t.sort(n);let s=e.length,a=t.length,o=0,l=0;for(;o<a&&l<s;){let s=n(e[l],t[o]);s<0?i(e[l++]):s>0?r(t[o++]):(o++,l++)}for(;o<a;)r(t[o++]);for(;l<s;)i(e[l++])})(i,t,el,t=>{r.push(n.addFieldIndex(e,t))},t=>{r.push(n.deleteFieldIndex(e,t))})).next(()=>ew.waitFor(r)))})(await ly(e),t))},t.__PRIVATE_firestoreClientSetPersistentCacheIndexAutoCreationEnabled=function(e,t){return e.asyncQueue.enqueue(async()=>{(await ly(e)).Cs.As=t})},t.__PRIVATE_firestoreClientTransaction=function(e,t,n){let r=new A;return e.asyncQueue.enqueueAndForget(async()=>{let i=await lI(e);new lu(e.asyncQueue,i,n,t,r).Xu()}),r.promise},t.__PRIVATE_firestoreClientWrite=function(e,t){let n=new A;return e.asyncQueue.enqueueAndForget(async()=>oO(await lv(e),t,n)),n.promise},t.__PRIVATE_fromBundledQuery=iU,t.__PRIVATE_fromDocument=iv,t.__PRIVATE_hardAssert=b,t.__PRIVATE_isBase64Available=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(){return"undefined"!=typeof atob},t.__PRIVATE_isCollectionGroupQuery=nZ,t.__PRIVATE_isCollectionReference=function(e){return e instanceof lV},t.__PRIVATE_isDocumentQuery$1=nX,t.__PRIVATE_isNumber$1=function(e){return"number"==typeof e},t.__PRIVATE_isOptionalEqual=function(e,t,n){return void 0===e&&void 0===t||void 0!==e&&void 0!==t&&n(e,t)},t.__PRIVATE_isPlainObject=X,t.__PRIVATE_isServerTimestamp=tX,t.__PRIVATE_isString=function(e){return"string"==typeof e},t.__PRIVATE_isUserData=function(e){return"function"==typeof e._readUserData},t.__PRIVATE_logDebug=w,t.__PRIVATE_logWarn=I,t.__PRIVATE_mapToArray=tR,t.__PRIVATE_newQueryForPath=nJ,t.__PRIVATE_newSerializer=ak,t.__PRIVATE_newUserDataReader=lZ,t.__PRIVATE_parseData=l6,t.__PRIVATE_parseQueryValue=function(e,t,n,r=!1){return l6(n,e.V(r?4:3,t))},t.__PRIVATE_parseSetData=function(e,t,n,r,i,s={}){let a,o;let l=e.V(s.merge||s.mergeFields?2:0,t,n,i);l7("Data must be an object, but it was:",l,r);let u=l8(r,l);if(s.merge)a=new tB(l.fieldMask),o=l.fieldTransforms;else if(s.mergeFields){let e=[];for(let r of s.mergeFields){let i=ue(t,r,n);if(!l.contains(i))throw new x(S.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);ui(e,i)||e.push(i)}a=new tB(e),o=l.fieldTransforms.filter(e=>a.covers(e.field))}else a=null,o=l.fieldTransforms;return new lH(new nv(u),a,o)},t.__PRIVATE_parseUpdateData=function(e,t,n,r){let i=e.V(1,t,n);l7("Data must be an object, but it was:",i,r);let s=[],a=nv.empty();return tV(r,(e,r)=>{let o=un(t,e,n);r=c.getModularInstance(r);let l=i.Sc(o);if(r instanceof l0)s.push(o);else{let e=l6(r,l);null!=e&&(s.push(o),a.set(o,e))}}),new lW(a,new tB(s),i.fieldTransforms)},t.__PRIVATE_parseUpdateVarargs=function(e,t,n,r,i,s){let a=e.V(1,t,n),o=[ue(t,r,n)],l=[i];if(s.length%2!=0)throw new x(S.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let e=0;e<s.length;e+=2)o.push(ue(t,s[e])),l.push(s[e+1]);let u=[],h=nv.empty();for(let e=o.length-1;e>=0;--e)if(!ui(u,o[e])){let t=o[e],n=l[e];n=c.getModularInstance(n);let r=a.Sc(t);if(n instanceof l0)u.push(t);else{let e=l6(n,r);null!=e&&(u.push(t),h.set(t,e))}}return new lW(h,new tB(u),a.fieldTransforms)},t.__PRIVATE_queryNormalizedOrderBy=n0,t.__PRIVATE_queryWithAddedFilter=function(e,t){let n=e.filters.concat([t]);return new nW(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)},t.__PRIVATE_queryWithAddedOrderBy=function(e,t){let n=e.explicitOrderBy.concat([t]);return new nW(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)},t.__PRIVATE_queryWithEndAt=function(e,t){return new nW(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),e.limit,e.limitType,e.startAt,t)},t.__PRIVATE_queryWithLimit=n5,t.__PRIVATE_queryWithStartAt=function(e,t){return new nW(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),e.limit,e.limitType,t,e.endAt)},t.__PRIVATE_refValue=no,t.__PRIVATE_setSDKVersion=function(e){g=e},t.__PRIVATE_setTestingHooksSpi=function(e){if(rj)throw Error("a TestingHooksSpi instance is already set");rj=e},t.__PRIVATE_toMapValue=function(e,t){let n={fields:{}};return t.forEach((t,r)=>{if("string"!=typeof r)throw Error(`Cannot encode map with non-string key: ${r}`);n.fields[r]=t._toProto(e)}),{mapValue:n}},t.__PRIVATE_toPipelineValue=function(e){return{pipelineValue:e}},t.__PRIVATE_toStringValue=function(e){return{stringValue:e}},t.__PRIVATE_validateIsNotUsedTogether=W,t.__PRIVATE_validateJSON=en,t.__PRIVATE_validatePositiveNumber=function(e,t){if(t<=0)throw new x(S.INVALID_ARGUMENT,`Function ${e}() requires a positive number, but it was: ${t}.`)},t.__PRIVATE_valueDescription=Z,t._internalAggregationQueryToProtoRunAggregationQueryRequest=function(e,t){let n=tR(t,(e,t)=>new rz(t,e.aggregateType,e._internalFieldPath)),r=lL(ee(e.firestore,lM)),i=r._onlineComponents?.datastore.serializer;return void 0===i?null:ib(i,n2(e._query),n,!0).request},t._internalPipelineToExecutePipelineRequestProto=function(e){if(!e._db)throw new x(S.FAILED_PRECONDITION,"This pipeline was created without a database and cannot be serialized for execution.");let t=ee(e._db,lM),n=lZ(t).V(3,"_internalPipelineToExecutePipelineRequestProto");e._readUserData(n);let r=function(e){if(e._terminated)throw new x(S.FAILED_PRECONDITION,"The client has already been terminated.");if(!lb.has(e)){w(l_,"Initializing Datastore");let t=new aC(lS(e._databaseId,e.app.options.appId||"",e._persistenceKey,e.app.options.apiKey,e._freezeSettings())),n=ak(e._databaseId),r=new aL(e._authCredentials,e._appCheckCredentials,t,n);lb.set(e,r)}return lb.get(e)}(t).serializer;if(void 0===r)return null;let i=new uu(e,new ul);return{database:ig(r),structuredPipeline:i._toProto(r)}},t._internalQueryToProtoQueryTarget=/**
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
 */function(e){let t=lL(ee(e.firestore,lM)),n=t._onlineComponents?.datastore.serializer;return void 0===n?null:i_(n,n1(e._query)).ft},t.arrayRemove=function(...e){return new l5("arrayRemove",e)},t.arrayUnion=function(...e){return new l4("arrayUnion",e)},t.clearIndexedDbPersistence=function(e){if(e._initialized&&!e._terminated)throw new x(S.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");let t=new A;return e._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(e){if(!eT.v())return Promise.resolve();await eT.delete(e+sH)}(sJ(e._databaseId,e._persistenceKey)),t.resolve()}catch(e){t.reject(e)}}),t.promise},t.collection=function(e,t,...n){if(e=c.getModularInstance(e),H("collection","path",t),e instanceof lC){let r=$.fromString(t,...n);return Y(r),new lV(e,null,r)}{if(!(e instanceof lk||e instanceof lV))throw new x(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child($.fromString(t,...n));return Y(r),new lV(e.firestore,null,r)}},t.collectionGroup=function(e,t){if(e=ee(e,lC),H("collectionGroup","collection id",t),t.indexOf("/")>=0)throw new x(S.INVALID_ARGUMENT,`Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new lN(e,null,new nW($.emptyPath(),t))},t.connectFirestoreEmulator=lD,t.deleteField=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(){return new l0("deleteField")},t.disableNetwork=function(e){var t;return(t=lL(e=ee(e,lM))).asyncQueue.enqueue(async()=>{let e=await lp(t),n=await lw(t);return e.setNetworkEnabled(!1),async function(e){e.da.add(0),await aK(e),e.ga.set("Offline")}(n)})},t.doc=function(e,t,...n){if(e=c.getModularInstance(e),1==arguments.length&&(t=M.newId()),H("doc","path",t),e instanceof lC){let r=$.fromString(t,...n);return J(r),new lk(e,null,new Q(r))}{if(!(e instanceof lk||e instanceof lV))throw new x(S.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child($.fromString(t,...n));return J(r),new lk(e.firestore,e instanceof lV?e.converter:null,new Q(r))}},t.documentId=function(){return new lK(z)},t.enableIndexedDbPersistence=function(e,t){I("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");let n=e._freezeSettings();return lB(e,lr.provider,{build:e=>new lt(e,n.cacheSizeBytes,t?.forceOwnership)}),Promise.resolve()},t.enableMultiTabIndexedDbPersistence=lq,t.enableNetwork=function(e){var t;return(t=lL(e=ee(e,lM))).asyncQueue.enqueue(async()=>{let e=await lp(t),n=await lw(t);return e.setNetworkEnabled(!0),n.da.delete(0),az(n)})},t.ensureFirestoreConfigured=lL,t.fail=E,t.getFirestore=function(e,t){let n="object"==typeof e?e:u.getApp(),r="string"==typeof e?e:t||t2,i=u._getProvider(n,"firestore").getImmediate({identifier:r});if(!i._initialized){let e=c.getDefaultEmulatorHostnameAndPort("firestore");e&&lD(i,...e)}return i},t.increment=function(e){return new l3("increment",e)},t.initializeFirestore=function(e,t,n){n||(n=t2);let r=u._getProvider(e,"firestore");if(r.isInitialized(n)){let e=r.getImmediate({identifier:n}),i=r.getOptions(n);if(c.deepEqual(i,t))return e;throw new x(S.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(void 0!==t.cacheSizeBytes&&void 0!==t.localCache)throw new x(S.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(void 0!==t.cacheSizeBytes&&-1!==t.cacheSizeBytes&&t.cacheSizeBytes<1048576)throw new x(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&c.isCloudWorkstation(t.host)&&c.pingServer(t.host),r.initialize({options:t,instanceIdentifier:n})},t.loadBundle=function(e,t){let n=lL(e=ee(e,lM)),r=new lO;return function(e,t,n,r){var i;let s=(i=ak(t),new la(function(e,t){if(e instanceof Uint8Array)return li(e,void 0);if(e instanceof ArrayBuffer)return li(new Uint8Array(e),void 0);if(e instanceof ReadableStream)return e.getReader();throw Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}("string"==typeof n?rQ().encode(n):n),i));e.asyncQueue.enqueueAndForget(async()=>{!function(e,t,n){(async function(e,t,n){try{var r;let i=await t.getMetadata();if(await function(e,t){let n=ia(t.createTime);return e.persistence.runTransaction("hasNewerBundle","readonly",n=>e.Pi.getBundleMetadata(n,t.id)).then(e=>!!e&&e.createTime.compareTo(n)>=0)}(e.localStore,i))return await t.close(),n._completeWith({taskState:"Success",documentsLoaded:i.totalDocuments,bytesLoaded:i.totalBytes,totalDocuments:i.totalDocuments,totalBytes:i.totalBytes}),Promise.resolve(new Set);n._updateProgress(oE(i));let s=new oT(i,t.serializer),a=await t.Fu();for(;a;){let e=await s.Ha(a);e&&n._updateProgress(e),a=await t.Fu()}let o=await s.Xa(e.localStore);return await oW(e,o.eu,void 0),await (r=e.localStore).persistence.runTransaction("Save bundle","readwrite",e=>r.Pi.saveBundleMetadata(e,i)),n._completeWith(o.progress),Promise.resolve(o.Ya)}catch(e){return I(ox,`Loading bundle failed with ${e}`),n._failWith(e),Promise.resolve(new Set)}})(e,t,n).then(t=>{e.sharedClientState.notifyBundleLoaded(t)})}(await lv(e),s,r)})}(n,e._databaseId,t,r),r},t.namedQuery=function(e,t){var n;return(n=lL(e=ee(e,lM))).asyncQueue.enqueue(async()=>{var e;return(e=await ly(n)).persistence.runTransaction("Get named query","readonly",n=>e.Pi.getNamedQuery(n,t))}).then(t=>t?new lN(e,null,t.query):null)},t.property=et,t.queryEqual=function(e,t){return e=c.getModularInstance(e),t=c.getModularInstance(t),e instanceof lN&&t instanceof lN&&e.firestore===t.firestore&&n3(e._query,t._query)&&e.converter===t.converter},t.refEqual=function(e,t){return e=c.getModularInstance(e),t=c.getModularInstance(t),(e instanceof lk||e instanceof lV)&&(t instanceof lk||t instanceof lV)&&e.firestore===t.firestore&&e.path===t.path&&e.converter===t.converter},t.serverTimestamp=function(){return new l2("serverTimestamp")},t.setLogLevel=function(e){p.setLogLevel(e)},t.sn=-1,t.terminate=function(e){return u._removeServiceInstance(e.app,"firestore",e._databaseId.database),e._delete()},t.toNumber=rf,t.vector=function(e){return new lj(e)},t.waitForPendingWrites=function(e){return function(e){let t=new A;return e.asyncQueue.enqueueAndForget(async()=>oz(await lv(e),t)),t.promise}(lL(e=ee(e,lM)))}}}]);