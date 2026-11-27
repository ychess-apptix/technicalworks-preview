/* 株式会社テクニカル工房 — site script (vanilla, no libraries) */
(function(){
"use strict";
var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var $=function(s,c){return (c||document).querySelector(s);};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

/* ---------- photo slots ---------- */
function loadPhoto(f){
 var n=f.querySelector(".photo-note"),alt="";
 if(n){var c=n.cloneNode(true),b=c.querySelector("b");if(b){b.remove();}alt=c.textContent.trim();}
 var src=f.dataset.src,im=new Image();
 im.onload=function(){
  var i=document.createElement("img");i.src=src;i.alt=alt;i.decoding="async";
  f.insertBefore(i,f.firstChild);f.classList.add("loaded");
  var vs=f.dataset.video;
  if(vs&&!rm){
   var v=document.createElement("video");
   v.muted=true;v.loop=true;v.autoplay=true;v.playsInline=true;
   v.setAttribute("muted","");v.setAttribute("playsinline","");v.setAttribute("aria-hidden","true");v.poster=src;
   v.addEventListener("canplay",function once(){v.removeEventListener("canplay",once);f.insertBefore(v,i.nextSibling);var p=v.play();if(p&&p.catch){p.catch(function(){});}});
   v.src=vs;
  }
 };
 im.src=src;
}
var photos=$$(".photo[data-src]");
photos.forEach(function(f){if(f.dataset.ratio){f.style.aspectRatio=f.dataset.ratio;}});
if("IntersectionObserver" in window){
 var pio=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){pio.unobserve(e.target);loadPhoto(e.target);}});},{rootMargin:"600px 0px"});
 photos.forEach(function(f){pio.observe(f);});
}else{photos.forEach(loadPhoto);}

/* ---------- navigation ---------- */
var bg=$(".burger"),nav=$("#gnav");
if(bg&&nav){
 var closeNav=function(){nav.classList.remove("open");bg.setAttribute("aria-expanded","false");};
 bg.addEventListener("click",function(){var o=nav.classList.toggle("open");bg.setAttribute("aria-expanded",o?"true":"false");});
 $$("a",nav).forEach(function(a){a.addEventListener("click",closeNav);});
 var dds=$$(".dd-b");
 dds.forEach(function(b){b.addEventListener("click",function(){var o=b.getAttribute("aria-expanded")==="true";dds.forEach(function(x){x.setAttribute("aria-expanded","false");});b.setAttribute("aria-expanded",o?"false":"true");});});
 document.addEventListener("click",function(e){if(!e.target.closest(".dd")){dds.forEach(function(x){x.setAttribute("aria-expanded","false");});}});
 document.addEventListener("keydown",function(e){if(e.key==="Escape"){dds.forEach(function(x){x.setAttribute("aria-expanded","false");});if(nav.classList.contains("open")){closeNav();bg.focus();}}});
}

/* ---------- exploded room (top page) ---------- */
var iso=$("#iso");
if(iso){
 if(iso.classList.contains("pre")){requestAnimationFrame(function(){requestAnimationFrame(function(){iso.classList.remove("pre");});});}
 var D={
  int:{k:"L1 · INT — 内装・リフォーム工事事業",h:"「壁の裏側まで、職人の仕事で。」",t:"オフィス・店舗・住宅・賃貸物件の内装仕上げから、間取り変更を伴うリノベーション、退去後の原状回復までを手がけます。",u:"service/interior.html"},
  ele:{k:"L2 · ELE — 電気・弱電工事事業",h:"「電気を通す。情報をつなぐ。建物を、20年先まで。」",t:"分電盤やコンセントの増設といった強電工事から、LAN配線、インターホン、放送設備などの弱電工事までを一つの窓口でお引き受けします。",u:"service/electrical.html"},
  sec:{k:"L3 · SEC — 防犯カメラ・地上デジタル放送設備工事事業",h:"「見守る技術と、届ける技術を。」",t:"防犯カメラの設計・施工・保守と、地上デジタル放送の受信設備工事を担います。",u:"service/security.html"},
  ins:{k:"L4 · INS — 保険事業",h:"「万一のとき、事業と暮らしが止まらないように。」",t:"損害保険代理店として、また生命保険募集人として、法人・個人双方の備えを整理します。",u:"service/insurance.html"}
 };
 var fp=$("#fp"),def=fp?fp.innerHTML:"",btns=$$(".lb-btn"),cur=null;
 var show=function(l){if(l){iso.setAttribute("data-active",l);}else{iso.removeAttribute("data-active");}};
 var select=function(l){
  cur=(cur===l)?null:l;
  btns.forEach(function(b){b.setAttribute("aria-pressed",b.dataset.l===cur?"true":"false");});
  show(cur);
  if(!fp){return;}
  if(!cur){fp.innerHTML=def;return;}
  var d=D[cur];
  fp.innerHTML='<p class="fp-k">'+d.k+'</p><p class="fp-h">'+d.h+'</p><p class="fp-t">'+d.t+'</p><a class="more" href="'+d.u+'">詳しく見る <span class="ar" aria-hidden="true">→</span></a>';
 };
 btns.forEach(function(b){b.addEventListener("click",function(){select(b.dataset.l);});});
 $$(".lyr",iso).forEach(function(g){
  var l=g.dataset.l;
  g.addEventListener("pointerenter",function(){show(l);});
  g.addEventListener("pointerleave",function(){show(cur);});
  g.addEventListener("focus",function(){show(l);});
  g.addEventListener("blur",function(){show(cur);});
  g.addEventListener("click",function(){select(l);});
  g.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();select(l);}});
 });
}

/* ---------- voice carousel ---------- */
var tr=$("#cxt");
if(tr){
 var sl=$$(".cx-s",tr),dots=$$("#cxd button"),pv=$("#cxp"),nx=$("#cxn"),cc=$("#cxc"),idx=0,tick=false;
 var go=function(i){i=Math.max(0,Math.min(sl.length-1,i));idx=i;var max=tr.scrollWidth-tr.clientWidth;tr.scrollTo({left:i===sl.length-1?max:Math.min(max,sl[i].offsetLeft-sl[0].offsetLeft),behavior:rm?"auto":"smooth"});pv.disabled=i===0;nx.disabled=i===sl.length-1;if(cc){cc.textContent="0"+(i+1)+" / 0"+sl.length;}dots.forEach(function(d,j){d.setAttribute("aria-current",j===i?"true":"false");});};
 var upd=function(){
  tick=false;var x=tr.scrollLeft,best=0,bd=1e9;
  sl.forEach(function(s,i){var d=Math.abs(s.offsetLeft-sl[0].offsetLeft-x);if(d<bd){bd=d;best=i;}});
  if(tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-4){best=sl.length-1;}
  idx=best;
  dots.forEach(function(d,i){d.setAttribute("aria-current",i===idx?"true":"false");});
  pv.disabled=idx===0;nx.disabled=idx===sl.length-1;if(cc){cc.textContent="0"+(idx+1)+" / 0"+sl.length;}
 };
 tr.addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});
 pv.addEventListener("click",function(){go(idx-1);});
 nx.addEventListener("click",function(){go(idx+1);});
 dots.forEach(function(d,i){d.addEventListener("click",function(){go(i);});});
 window.addEventListener("resize",upd);
 upd();
}

/* ---------- contact form (no backend in this build) ---------- */
var form=$("#cform");
if(form){
 var svc=$$('input[name="service"]',form),em=form.querySelector('input[name="email"]'),em2=form.querySelector('input[name="email_confirm"]');
 var check=function(){
  if(svc.length){var any=svc.some(function(c){return c.checked;});svc[0].setCustomValidity(any?"":"ご希望のサービスを1つ以上お選びください。");}
  if(em&&em2){em2.setCustomValidity(em2.value&&em.value!==em2.value?"メールアドレスが一致しません。":"");}
 };
 svc.forEach(function(c){c.addEventListener("change",check);});
 if(em&&em2){em.addEventListener("input",check);em2.addEventListener("input",check);}
 check();
 form.addEventListener("submit",function(e){
  e.preventDefault();check();
  if(!form.reportValidity||form.reportValidity()){
   var m=$("#cform-msg");if(m){m.hidden=false;m.focus();}
  }
 });
}

/* ---------- fold long blocks on phones ---------- */
var mqFold=window.matchMedia("(max-width:767px)");
var FOLD=".sheet .spec dd, .case-b, .voice-b, .st-b, .card:not(.link):not(.member)";
function bgOf(el){while(el&&el!==document.documentElement){var c=getComputedStyle(el).backgroundColor;var m=c.match(/[\d.]+/g);if(m&&(m.length<4||+m[3]>0.5)){return c;}el=el.parentElement;}return "#fbfcfb";}
function setupFold(){
 $$(".fold-btn").forEach(function(b){b.parentNode.removeChild(b);});
 $$(".folded").forEach(function(el){el.classList.remove("folded");});
 if(!mqFold.matches){return;}
 $$(FOLD).forEach(function(el,n){
  if(el.closest(".folded")||el.scrollHeight<320){return;}
  if(!el.id){el.id="fold-"+n;}
  el.classList.add("folded");el.style.setProperty("--fold-bg",bgOf(el));
  var b=document.createElement("button");b.type="button";b.className="fold-btn";b.textContent="続きを読む";
  b.setAttribute("aria-expanded","false");b.setAttribute("aria-controls",el.id);
  b.addEventListener("click",function(){var o=el.classList.toggle("folded");b.setAttribute("aria-expanded",o?"false":"true");b.textContent=o?"続きを読む":"閉じる";if(o){el.scrollIntoView({block:"nearest"});}});
  el.insertAdjacentElement("afterend",b);
 });
}
setupFold();
if(mqFold.addEventListener){mqFold.addEventListener("change",setupFold);}
window.addEventListener("load",setupFold);
var fW=window.innerWidth,fT;window.addEventListener("resize",function(){if(window.innerWidth===fW){return;}fW=window.innerWidth;clearTimeout(fT);fT=setTimeout(setupFold,200);});

/* ---------- in-page nav: highlight current section ---------- */
var lnav=$(".lnav");
if(lnav&&"IntersectionObserver" in window){
 var lks=$$("a[href^='#']",lnav),map={};
 lks.forEach(function(a){var t=document.getElementById(a.getAttribute("href").slice(1));if(t){map[t.id]=a;}});
 var cur2=null;
 var sio=new IntersectionObserver(function(en){
  en.forEach(function(e){if(e.isIntersecting){var a=map[e.target.id];if(a&&a!==cur2){if(cur2){cur2.removeAttribute("aria-current");}a.setAttribute("aria-current","true");cur2=a;var ul=lnav.querySelector("ul");ul.scrollTo({left:a.parentElement.offsetLeft-16,behavior:rm?"auto":"smooth"});}}});
 },{rootMargin:"-45% 0px -50% 0px"});
 Object.keys(map).forEach(function(id){sio.observe(document.getElementById(id));});
}

/* ---------- back to top ---------- */
var tt=document.createElement("button");
tt.type="button";tt.className="totop";tt.setAttribute("aria-label","ページの先頭へ戻る");tt.innerHTML='<span aria-hidden="true">↑</span>';
document.body.appendChild(tt);
tt.addEventListener("click",function(){window.scrollTo({top:0,behavior:rm?"auto":"smooth"});var h=$(".brand");if(h){h.focus({preventScroll:true});}});
var ttTick=false;
window.addEventListener("scroll",function(){if(ttTick){return;}ttTick=true;requestAnimationFrame(function(){ttTick=false;tt.classList.toggle("show",window.scrollY>window.innerHeight*1.5);});},{passive:true});

/* ---------- reveal on scroll (below the fold only) ---------- */
if(rm||!("IntersectionObserver" in window)){return;}
var vh=window.innerHeight;
var rvs=[];
$$(".rv").forEach(function(el){if(el.getBoundingClientRect().top>=vh){el.classList.add("pre");rvs.push(el);}});
var io=new IntersectionObserver(function(en){
 en.forEach(function(e){
  if(!e.isIntersecting){return;}
  var t=e.target;
  t.classList.add("in");
  io.unobserve(t);
 });
},{rootMargin:"0px 0px -12% 0px"});
rvs.forEach(function(el){io.observe(el);});
})();
