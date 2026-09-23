/**
 * Drives components/ui/Reveal.tsx. Inline and first in <body>, so it runs
 * while the page parses rather than after React hydrates.
 *
 * - Adds `js` to <html>; globals.css only hides reveal targets under html.js,
 *   so if this never runs, everything stays visible.
 * - A MutationObserver picks targets up as the parser (and later client-side
 *   navigation) inserts them; an IntersectionObserver marks each one
 *   data-revealed once it's within 60px of the viewport bottom.
 * - Fast scrolls and jumps (End key, anchor links) can carry a target past
 *   the viewport between two observer checks, so a rAF-throttled scroll check
 *   also reveals anything already at or above the trigger line. It only runs
 *   while unrevealed targets remain.
 * - Groups number their items (--i) so CSS can stagger the delays.
 */
const SCRIPT = `(function(){
var d=document.documentElement;
if(!("IntersectionObserver" in window)||!("MutationObserver" in window))return;
d.classList.add("js");
var sel="[data-reveal]:not([data-revealed]),[data-reveal-group]:not([data-revealed])";
var pending=new Set();
function reveal(t){
if(t.hasAttribute("data-reveal-group"))t.querySelectorAll("[data-reveal-item]").forEach(function(el,i){el.style.setProperty("--i",i)});
t.setAttribute("data-revealed","");io.unobserve(t);pending.delete(t);}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)reveal(e.target)})},{rootMargin:"0px 0px -60px 0px"});
function watch(el){if(!pending.has(el)){pending.add(el);io.observe(el)}}
function scan(r){if(r.matches&&r.matches(sel))watch(r);r.querySelectorAll(sel).forEach(watch);}
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n)})})}).observe(d,{childList:true,subtree:true});
var ticking=false;
addEventListener("scroll",function(){
if(ticking||!pending.size)return;ticking=true;
requestAnimationFrame(function(){ticking=false;var line=innerHeight-60;
pending.forEach(function(t){if(!t.isConnected){pending.delete(t);return}
var b=t.getBoundingClientRect();if(b.height&&b.top<line)reveal(t)})})},{passive:true});
scan(document);
})();`;

export function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
