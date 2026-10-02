/**
 * Runs before paint (first child of <body>) to set data-theme
 * from cookies — so the correct theme is on screen immediately, with no flash,
 * and without making the page dynamic (the static Pages build stays static).
 */
export const themeInitScript = `(function(){try{
var c=document.cookie||"";
var m=c.match(/(?:^|;\\s*)kn_theme=(light|dark)(?:;|$)/);
var t=m?m[1]:"light";
var e=document.documentElement;
e.removeAttribute("data-discreet");
e.setAttribute("data-theme",t);
var s=c.match(/(?:^|;\\s*)kn_text_size=(80|90|100|110|120|130|140)(?:;|$)/);
e.style.setProperty("--text-scale",s?String(Number(s[1])/100):"1");
}catch(_){}})();`;
