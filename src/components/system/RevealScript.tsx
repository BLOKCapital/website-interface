import { announcement, BAR_KEY } from "@/lib/announce";
import { MOTION_KEY } from "@/lib/motion-pref";

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
 * - Split headings ([data-split], components/motion/SplitText.tsx) reveal
 *   the same way; CSS staggers their words.
 * - Also hides the announcement bar before first paint if the visitor
 *   dismissed this announcement (lib/announce.ts), and applies the
 *   visitor's Pause-motion choice as html[data-motion="paused"]
 *   (lib/motion-pref.ts), so nothing animates even for a frame.
 * - Off-screen pausing: a second IntersectionObserver keeps `data-inview`
 *   on every page band, the footer and any [data-loop] element while it is
 *   within 300px of the viewport, and globals.css pauses the loops inside
 *   anything without it. It starts after load, once the main thread is
 *   idle, so React has hydrated those elements first (an attribute added
 *   before hydration is reported as a mismatch in development); until it
 *   sets html[data-io], nothing is paused.
 */

/** Elements that get data-inview. Mirrored in globals.css ("Off-screen pausing"). */
const LOOP_TARGETS = "[data-loop],main>section,main>div>section,main section[id],footer";

const SCRIPT = `(function(){
var d=document.documentElement;
try{if(localStorage.getItem("${BAR_KEY}")==="${announcement.id}")d.setAttribute("data-bar","hidden")}catch(e){}
try{if(localStorage.getItem("${MOTION_KEY}")==="paused")d.setAttribute("data-motion","paused")}catch(e){}
if(!("IntersectionObserver" in window)||!("MutationObserver" in window))return;
d.classList.add("js");
var sel="[data-reveal]:not([data-revealed]),[data-reveal-group]:not([data-revealed]),[data-split]:not([data-revealed])";
var pending=new Set();
function reveal(t){
if(t.hasAttribute("data-reveal-group"))t.querySelectorAll("[data-reveal-item]").forEach(function(el,i){el.style.setProperty("--i",i)});
t.setAttribute("data-revealed","");io.unobserve(t);pending.delete(t);}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)reveal(e.target)})},{rootMargin:"0px 0px -60px 0px"});
function watch(el){if(!pending.has(el)){pending.add(el);io.observe(el)}}
var lsel="${LOOP_TARGETS}",loops=null,lio=null;
function lwatch(el){if(!loops.has(el)){loops.add(el);lio.observe(el)}}
function scan(r){if(r.matches&&r.matches(sel))watch(r);r.querySelectorAll(sel).forEach(watch);
if(loops){if(r.matches&&r.matches(lsel))lwatch(r);r.querySelectorAll(lsel).forEach(lwatch)}}
new MutationObserver(function(ms){var gone=0;ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n)});gone+=m.removedNodes.length});
if(gone&&loops)loops.forEach(function(el){if(!el.isConnected){lio.unobserve(el);loops.delete(el)}})}).observe(d,{childList:true,subtree:true});
var ticking=false;
addEventListener("scroll",function(){
if(ticking||!pending.size)return;ticking=true;
requestAnimationFrame(function(){ticking=false;var line=innerHeight-60;
pending.forEach(function(t){if(!t.isConnected){pending.delete(t);return}
var b=t.getBoundingClientRect();if(b.height&&b.top<line)reveal(t)})})},{passive:true});
scan(document);
function loopsOn(){loops=new Set();var first=1;
lio=new IntersectionObserver(function(es){es.forEach(function(e){e.target.toggleAttribute("data-inview",e.isIntersecting)});
if(first){first=0;d.setAttribute("data-io","")}},{rootMargin:"300px 0px"});
d.querySelectorAll(lsel).forEach(lwatch)}
addEventListener("load",function(){(window.requestIdleCallback||function(f){setTimeout(f,200)})(loopsOn,{timeout:2000})},{once:true});
})();`;

export function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
