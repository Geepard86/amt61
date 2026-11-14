/* Hintergrundmusik mit weichen Überblendungen + Fenster-Knarzen.
   Dateien: assets/music-menu.mp3 (Menü) und assets/music-quiz.mp3 (Fragen). Fehlende Dateien werden ignoriert. */
const Music=(()=>{
 const T={menu:new Audio('assets/music-menu.mp3'),quiz:new Audio('assets/music-quiz.mp3')};
 const lvl={menu:0,quiz:0};
 Object.values(T).forEach(a=>{a.loop=true;a.volume=0;a.preload='auto'});
 let want='menu',fade=3,vol=.35,muted=false,on=false,ac=null;
 // gleichmäßige Überblendung (Equal-Power): beide Lieder ändern sich zeitgleich mit Sinus-Kurve
 setInterval(()=>{
  Object.keys(T).forEach(k=>{
   const a=T[k],tgt=(on&&!muted&&want===k)?1:0,step=.05/Math.max(.2,fade);
   lvl[k]=tgt>lvl[k]?Math.min(tgt,lvl[k]+step):Math.max(tgt,lvl[k]-step);
   a.volume=Math.min(1,vol*Math.sin(lvl[k]*Math.PI/2));
   if(lvl[k]>0&&a.paused)a.play().catch(()=>{});
   if(lvl[k]===0&&!a.paused)a.pause();
  });
 },50);
 const ctx=()=>{ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume();return ac};
 // Fenster öffnet sich: Holz knarzt, am Ende klingeln zwei Glöckchen
 function creak(){
  const c=ctx(),t=c.currentTime,d=1.05;
  const o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain(),l=c.createOscillator(),lg=c.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(92,t);o.frequency.linearRampToValueAtTime(155,t+d*.5);o.frequency.linearRampToValueAtTime(105,t+d);
  l.frequency.value=23;lg.gain.value=24;l.connect(lg);lg.connect(o.frequency);
  f.type='bandpass';f.Q.value=7;f.frequency.setValueAtTime(650,t);f.frequency.linearRampToValueAtTime(1350,t+d*.6);f.frequency.linearRampToValueAtTime(900,t+d);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.25,t+.08);g.gain.linearRampToValueAtTime(.13,t+d*.7);g.gain.linearRampToValueAtTime(0,t+d);
  o.connect(f);f.connect(g);g.connect(c.destination);o.start(t);l.start(t);o.stop(t+d);l.stop(t+d);
  [[1568,.82],[2093,.94]].forEach(([fr,at])=>{const b=c.createOscillator(),bg=c.createGain(),s=t+d*at;
   b.type='sine';b.frequency.value=fr;bg.gain.setValueAtTime(0,s);bg.gain.linearRampToValueAtTime(.11,s+.02);bg.gain.exponentialRampToValueAtTime(.001,s+1);
   b.connect(bg);bg.connect(c.destination);b.start(s);b.stop(s+1.05)});
 }
 return{start(){on=true;ctx()},mode(m,secs){want=m;fade=secs||(m==='off'?.8:3)},toggle(){muted=!muted;return muted},louder(d){vol=Math.max(.05,Math.min(1,vol+d));return Math.round(vol*100)},creak};
})();
