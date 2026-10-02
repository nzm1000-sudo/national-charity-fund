/**
 * Runs before paint (first child of <body>) to set data-theme and discreet mode
 * from cookies — so the correct theme is on screen immediately, with no flash,
 * and without making the page dynamic (the static Pages build stays static).
 */
export const themeInitScript = `(function(){try{
var c=document.cookie||"";
var disc=/(?:^|;\\s*)kn_discreet=1/.test(c);
var m=c.match(/(?:^|;\\s*)kn_theme=(light|dark|amber)/);
var t=m?m[1]:"light";
var e=document.documentElement;
if(disc){e.setAttribute("data-discreet","1");e.setAttribute("data-theme","dark");e.setAttribute("data-original-title",document.title);}
else{e.setAttribute("data-theme",t);}
}catch(_){}})();`;
