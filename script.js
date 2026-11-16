const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

// ===== PAGE NAVIGATION =====
const pages=$$('.page');let cur=0;
function go(n){pages[cur].classList.remove('on');cur=n;pages[cur].classList.add('on')}
const next=()=>go(cur+1);
$$('[data-next]').forEach(b=>b.onclick=next);

// ===== MOVING BUTTONS (can't be clicked) =====
function dodge(b){
  const r=b.getBoundingClientRect(),x=+b.dataset.x||0,y=+b.dataset.y||0;
  const nx=10+Math.random()*(innerWidth-r.width-20),ny=10+Math.random()*(innerHeight-r.height-20);
  b.dataset.x=x+nx-r.left;b.dataset.y=y+ny-r.top;
  b.style.transform=`translate(${b.dataset.x}px,${b.dataset.y}px)`;
}
$$('.run').forEach(b=>{
  ['pointerenter','pointerdown'].forEach(e=>b.addEventListener(e,ev=>{ev.preventDefault();dodge(b)}));
  b.addEventListener('touchstart',ev=>{ev.preventDefault();dodge(b)},{passive:false});
  b.addEventListener('click',ev=>ev.preventDefault());
});

// ===== LOCK SCREEN =====
const CORRECT_PIN="2521";let pin="",busy=false;
const dots=$$('#dots span');
["1","2","3","4","5","6","7","8","9","","0","⌫"].forEach(k=>{
  const b=document.createElement('button');b.className='key'+(k?'':' e');b.textContent=k;
  if(k)b.onclick=()=>key(k);$('#keypad').appendChild(b);
});
document.addEventListener('keydown',e=>{if(cur)return;if(/^\d$/.test(e.key))key(e.key);else if(e.key==='Backspace')key('⌫')});
function key(k){
  if(busy)return;
  if(k==='⌫')pin=pin.slice(0,-1);else if(pin.length<4)pin+=k;
  dots.forEach((d,i)=>d.classList.toggle('f',i<pin.length));
  if(pin.length===4){busy=true;setTimeout(check,200)}
}
function check(){
  if(pin===CORRECT_PIN){
    $('#msg').textContent='Welcome, my love ♥';document.body.classList.add('unlocked');setTimeout(next,1300);
  }else{
    $('#dots').classList.add('wrong');$('#lockCard').classList.add('shake');
    $('#msg').textContent="Hmm… that's not it. Only my love knows 💔";
    setTimeout(()=>{$('#lockCard').classList.remove('shake');$('#dots').classList.remove('wrong');pin="";dots.forEach(d=>d.classList.remove('f'));busy=false},700);
  }
}

// ===== CARD BUILDER =====
function cards(id,items,fn){
  items.forEach(([img,label,story])=>{
    const d=document.createElement('div');d.className='card';
    d.innerHTML=`<img src="${img}.jpg">${label?`<b>${label}</b>`:''}${story?`<div class="st">${story}</div>`:''}`;
    d.onclick=()=>fn(d);$(id).appendChild(d);
  });
}
const choose=(box,note,msg,btn)=>d=>{
  $$(box+' .card').forEach(x=>x.classList.remove('sel'));d.classList.add('sel');
  $(note).textContent=msg;$(btn).classList.remove('hid');
};

// 4 gallery
const G=['g1','g2','g3','g4','g5'];let gi=0;
$('#gimg').src='g1.jpg';
$('#gal').onclick=()=>{gi=(gi+1)%G.length;$('#gimg').style.opacity=0;setTimeout(()=>{$('#gimg').src=`${G[gi]}.jpg`;$('#gimg').style.opacity=1},200)};

// 5 dates
cards('#dates',[['dinner','Dinner date 🍽️'],['coffee','Coffee & long talks ☕'],['rooftop','Rooftop evening 🌙'],['surprise','A surprise date 🎁']],
  choose('#dates','#dnote',"It's a date! I'm already excited ♥",'#dnext'));

// 7 mad -> game
$('#mno').onclick=()=>{$('#m1').classList.add('hid');$('#m2').classList.remove('hid')};

// 8 relive
cards('#relive',[['m1'],['m2'],['m3']],choose('#relive','#rnote','That one is special to me too ♥','#rnext'));

// 10 memory lane (EDIT THE STORIES)
cards('#lane',[
  ['l1','','Write the story of memory 1 here ♥'],
  ['l2','','Write the story of memory 2 here ♥'],
  ['l3','','Write the story of memory 3 here ♥']
],d=>d.classList.toggle('open'));

// 11 scratch
const sc=$('#sc'),g=sc.getContext('2d');let dn=0;
const gr=g.createLinearGradient(0,0,300,170);gr.addColorStop(0,'#ffd1dc');gr.addColorStop(1,'#d4a5ff');
g.fillStyle=gr;g.fillRect(0,0,300,170);g.fillStyle='#7a1a4a';g.font='18px Poppins';g.textAlign='center';g.fillText('Scratch here ✨',150,92);
const scratch=e=>{const r=sc.getBoundingClientRect();g.globalCompositeOperation='destination-out';g.beginPath();g.arc((e.clientX-r.left)*300/r.width,(e.clientY-r.top)*170/r.height,18,0,7);g.fill()};
sc.onpointerdown=e=>{dn=1;scratch(e)};sc.onpointermove=e=>dn&&scratch(e);
sc.onpointerup=()=>{dn=0;const d=g.getImageData(0,0,300,170).data;let c=0;
  for(let i=3;i<d.length;i+=16)if(!d[i])c++;
  if(c>d.length/16*.5){sc.style.opacity=0;sc.style.pointerEvents='none';$('#snext').classList.remove('hid')}};

// 12 wheel
const W=["Virtual hug 🤗","Kiss coupon 💋","Surprise date 🌹","Handwritten note ✍️","Any dare 😈","Trip to a city ✈️","Many gifts 🎁","iPhone 📱 (lol)","PS5 🎮 (amake diba)","Diamond nose pin 💎"];
const wc=$('#wc'),x=wc.getContext('2d'),A=2*Math.PI/W.length;
W.forEach((t,i)=>{
  x.beginPath();x.moveTo(150,150);x.arc(150,150,148,i*A-Math.PI/2,(i+1)*A-Math.PI/2);
  x.fillStyle=i%2?'#ff4d8d':'#7a1a4a';x.fill();
  x.save();x.translate(150,150);x.rotate((i+.5)*A-Math.PI/2);x.fillStyle='#fff';x.font='11px Poppins';x.textAlign='right';x.fillText(t,138,4);x.restore();
});
let rot=0;
$('#spin').onclick=function(){
  this.disabled=true;rot+=1800+Math.random()*360;wc.style.transform=`rotate(${rot}deg)`;
  setTimeout(()=>{const i=Math.floor(((360-rot%360)%360)/(360/W.length));
    $('#wnote').textContent='You won: '+W[i]+' 🎉';$('#wnext').classList.remove('hid')},4200);
};

// song (after the gallery): starts at 2:00, keeps playing on all later pages
$('#disk').onclick=function(){
  if($('#yt').children.length)return;
  this.classList.add('spin');this.textContent='♪';
  $('#yt').innerHTML='<iframe width="200" height="200" src="https://www.youtube-nocookie.com/embed/H2f7MZaw3Yo?autoplay=1&start=120&rel=0" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay;encrypted-media" style="border:0"></iframe>';
  $('#pnext').classList.remove('hid');
};

// 15 fun: quiz -> gifts -> mood
const steps=[
["What is our ultimate cozy date vibe?",["Ordering takeout and binge-watching a show in pajamas","Late-night drive with our favorite playlist on blast","Cooking a messy, fun dinner together from scratch","Getting dressed up for a cute hidden cafe or rooftop"]],
["What small gesture melts your heart the fastest?",["A random \"thinking of you\" text or voice note","A long, tight hug without saying a word","Remembering a tiny detail I mentioned weeks ago","Bringing me my favorite snack out of nowhere"]],
["What is our relationship superpower?",["Making each other laugh until we can't breathe","Understanding each other with just one look","Turning boring errands into the best part of the day","Always having each other's back no matter what"]],
["Pick a spontaneous weekend getaway for us:",["A cozy cabin in the mountains with zero Wi-Fi","A sunny beach town with street food and sunsets","A bustling city where we explore every corner on foot","A staycation in a nice hotel with room service"]],
["🎁 Pick one virtual gift to redeem!",["🌹 Digital Bouquet of Velvet Roses — one real flower delivery soon","☕ Cozy Coffee / Boba Run — delivered on a stressful day","🎟️ Movie Night Director Pass — you control movie, snacks, blankets","💆 15-Minute Shoulder & Back Massage — no expiration date","🍔 Craving Emergency Voucher — whatever you crave, it's on me","🤗 Infinite Warm Hug Pass — one extra-long hug when I see you"]],
["How are you feeling right now? Pick your emoji!",["🥰 Soft & Affectionate","🔋 Low Battery / Tired","🤪 Playful & Chaotic","🍜 Hangry","🌙 Deep & Thoughtful","✨ Adventure Mode"]]
];
let si=0;
function step(){
  if(si>=steps.length)return next();
  const[t,o]=steps[si];
  $('#fun').innerHTML=(si?'':'<h2>Now this is going to be fun 🎉</h2><br>')+`<p class="big">${t}</p><br>`+
    o.map(v=>`<button class="btn ghost opt" style="display:block;margin:8px auto;max-width:340px;width:100%">${v}</button>`).join('');
  $$('.opt').forEach(b=>b.onclick=()=>{b.classList.remove('ghost');setTimeout(()=>{si++;step()},450)});
}
step();

// ===== FALLING HEARTS =====
const cols=["#fff","#ff4d6d","#ff8fa3","#ffb3c1","#e0113f"];
setInterval(()=>{
  const h=document.createElement('span');h.className='heart';h.textContent='♥';
  h.style.left=Math.random()*100+'vw';h.style.fontSize=10+Math.random()*22+'px';
  h.style.color=cols[Math.floor(Math.random()*cols.length)];
  const d=5+Math.random()*6;h.style.animationDuration=d+'s';
  h.style.setProperty('--d',Math.random()*120-60+'px');h.style.setProperty('--r',Math.random()*60-30+'deg');
  $('#hearts').appendChild(h);setTimeout(()=>h.remove(),d*1000);
},250);

// missing photos just show the pink placeholder
$$('img').forEach(i=>i.onerror=()=>i.style.visibility='hidden');
// 17 video: tap to play (also stops the song from page 13)
const fv=$('#fv'),vp=$('#vplay');
vp.onclick=()=>{
  $('#yt').innerHTML='';
  fv.controls=true;
  fv.play().catch(()=>{});
  vp.classList.add('gone');
  
};