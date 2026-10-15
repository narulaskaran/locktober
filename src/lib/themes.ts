/**
 * One theme per calendar month, in getMonth() order. The palettes live in
 * globals.css as [data-theme="<key>"] blocks (November is the :root default),
 * and the icons in components/month-icon.tsx.
 */
export const MONTH_THEMES = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
] as const;

/**
 * Runs in <head> before first paint so there is no flash of the wrong palette.
 * It uses the visitor's own calendar month, which also keeps this out of the
 * server render. `?theme=dec` previews a month for the rest of the tab's
 * session; `?theme=auto` goes back to the current month.
 */
export const THEME_SCRIPT = `(function(){
var keys=${JSON.stringify(MONTH_THEMES)};
var theme=keys[new Date().getMonth()];
try{
var store=window.sessionStorage;
var asked=/[?&]theme=([a-z]+)/.exec(location.search);
if(asked){
if(asked[1]==="auto")store.removeItem("theme");
else if(keys.indexOf(asked[1])>-1)store.setItem("theme",asked[1]);
}
var saved=store.getItem("theme");
if(keys.indexOf(saved)>-1)theme=saved;
}catch(e){}
var root=document.documentElement;
root.setAttribute("data-theme",theme);
document.addEventListener("DOMContentLoaded",function(){
var paper=getComputedStyle(root).getPropertyValue("--paper").trim();
document.querySelectorAll('meta[name="theme-color"]').forEach(function(meta){meta.setAttribute("content",paper)});
});
})();`;
