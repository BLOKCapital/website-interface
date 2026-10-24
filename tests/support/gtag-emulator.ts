/**
 * A stand-in for gtag.js, served in place of the real script so consent tests
 * never reach Google. It models only the behaviour the consent contract
 * depends on:
 *
 * - it drains `window.dataLayer` and keeps the Consent Mode state;
 * - `config` sends a page_view hit, and so does every history change (GA4
 *   enhanced measurement, which is how client-side navigations are counted);
 * - hits go out **even when `analytics_storage` is denied**, as cookieless
 *   pings (`gcs=G100`), which is what real gtag.js does (SEC-03 evidence);
 * - `window["ga-disable-<ID>"] = true` stops all hits, Google's documented
 *   kill switch.
 *
 * Hits are sent to https://www.google-analytics.com/g/collect, where the
 * shared fixture records and aborts them.
 */
export const GTAG_EMULATOR = `(function () {
  var dl = (window.dataLayer = window.dataLayer || []);
  var ids = [];
  var consent = {};
  function hit(id, en) {
    if (window["ga-disable-" + id] === true) return;
    var g = function (k) { return consent[k] === "granted" ? "1" : "0"; };
    var url = "https://www.google-analytics.com/g/collect?v=2&tid=" + encodeURIComponent(id) +
      "&en=" + en + "&gcs=G1" + g("ad_storage") + g("analytics_storage") +
      "&dl=" + encodeURIComponent(location.href);
    try { fetch(url, { method: "POST", mode: "no-cors", keepalive: true }).catch(function () {}); } catch (e) {}
  }
  function run(args) {
    if (!args || typeof args.length !== "number") return;
    if (args[0] === "consent" && args[2] && typeof args[2] === "object") {
      for (var k in args[2]) consent[k] = args[2][k];
    } else if (args[0] === "config" && typeof args[1] === "string") {
      if (ids.indexOf(args[1]) === -1) ids.push(args[1]);
      hit(args[1], "page_view");
    }
  }
  for (var i = 0; i < dl.length; i++) run(dl[i]);
  var push = dl.push;
  dl.push = function () {
    for (var j = 0; j < arguments.length; j++) run(arguments[j]);
    return push.apply(dl, arguments);
  };
  function pageView() { setTimeout(function () { ids.forEach(function (id) { hit(id, "page_view"); }); }, 0); }
  var pushState = history.pushState;
  history.pushState = function () { var r = pushState.apply(this, arguments); pageView(); return r; };
  addEventListener("popstate", pageView);
})();`;
