/* Hintergrundmusik: assets/music-menu.mp3 (Menü) und assets/music-quiz.mp3 (Fragen). Fehlende Dateien werden ignoriert. */
const Music=(()=>{
 const T={menu:new Audio('assets/music-menu.mp3'),quiz:new Audio('assets/music-quiz.mp3')};
 Object.values(T).forEach(a=>{a.loop=true;a.volume=0;a.preload='auto'});
 let want='menu',vol=.35,muted=false,on=false;
 setInterval(()=>{
  Object.keys(T).forEach(k=>{
   const a=T[k],tgt=(on&&!muted&&want===k)?vol:0,rate=want==='off'?.4:.12;
   a.volume=Math.abs(tgt-a.volume)<.01?tgt:Math.max(0,Math.min(1,a.volume+(tgt-a.volume)*rate));
   if(a.volume>0&&a.paused)a.play().catch(()=>{});
   if(a.volume===0&&tgt===0&&!a.paused)a.pause();
  });
 },100);
 return{start(){on=true},mode(m){want=m},toggle(){muted=!muted;return muted},louder(d){vol=Math.max(.05,Math.min(1,vol+d));return Math.round(vol*100)}};
})();
