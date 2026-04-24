/* ── PathoQuest — Human Body Festival Canvas Animation ── */
(function() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  let t = 0;

  /* ── plasma flow field ── */
  function flow(x,y) {
    const a = Math.sin(x*.0022+t*.28)*Math.cos(y*.0022+t*.20)*Math.PI*1.6;
    return { vx:Math.cos(a)*.18, vy:Math.sin(a)*.11 };
  }

  /* ── BIOLOGIST WITH MICROSCOPE ── */
  function drawBiologist(px, py, sc, al) {
    ctx.save(); ctx.translate(px,py); ctx.scale(sc,sc); ctx.globalAlpha=al;
    // Lab coat body
    ctx.fillStyle='#E3F2FD'; ctx.strokeStyle='#90CAF9'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(-28,-8,56,85,6); ctx.fill(); ctx.stroke();
    // Blue shirt
    ctx.fillStyle='#1565C0'; ctx.fillRect(-11,-8,22,18);
    // Lapels
    ctx.fillStyle='#BBDEFB';
    ctx.beginPath(); ctx.moveTo(-10,-8); ctx.lineTo(-28,20); ctx.lineTo(-14,-8); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(10,-8); ctx.lineTo(28,20); ctx.lineTo(14,-8); ctx.closePath(); ctx.fill();
    // Pocket + pen
    ctx.fillStyle='#fff'; ctx.strokeStyle='#90CAF9'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(13,10,11,14,2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#EF5350'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(18,10); ctx.lineTo(17,0); ctx.stroke();
    // Arms forward (on microscope)
    ctx.strokeStyle='#90CAF9'; ctx.lineWidth=9; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-28,5); ctx.lineTo(-45,40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(28,5); ctx.lineTo(55,30); ctx.stroke();
    // Hands
    ctx.fillStyle='#FFB74D';
    ctx.beginPath(); ctx.arc(-45,44,8,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(55,34,8,0,Math.PI*2); ctx.fill();
    // Legs
    ctx.fillStyle='#1A237E'; ctx.lineWidth=0;
    ctx.beginPath(); ctx.roundRect(-20,75,17,42,5); ctx.fill();
    ctx.beginPath(); ctx.roundRect(4,75,17,42,5); ctx.fill();
    // Shoes
    ctx.fillStyle='#212121';
    ctx.beginPath(); ctx.ellipse(-11,118,13,6,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(13,118,13,6,0,0,Math.PI*2); ctx.fill();
    // Neck + head
    ctx.fillStyle='#FFB74D';
    ctx.beginPath(); ctx.roundRect(-7,-24,14,18,4); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,-46,22,27,0,0,Math.PI*2); ctx.fill();
    // Hair
    ctx.fillStyle='#37474F';
    ctx.beginPath(); ctx.ellipse(0,-64,22,14,0,0,Math.PI*2); ctx.fill();
    ctx.fillRect(-22,-64,44,10);
    // Glasses
    ctx.strokeStyle='#333'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(-9,-46,7,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(9,-46,7,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2,-46); ctx.lineTo(2,-46); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-22,-43); ctx.lineTo(-26,-42); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(22,-43); ctx.lineTo(26,-42); ctx.stroke();
    // Eyes
    ctx.fillStyle='#1A237E';
    ctx.beginPath(); ctx.arc(-9,-46,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(9,-46,3,0,Math.PI*2); ctx.fill();
    // Smile
    ctx.strokeStyle='#8D6E63'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(0,-36,7,0.2,Math.PI-.2); ctx.stroke();
    // --- MICROSCOPE ---
    ctx.strokeStyle='#455A64'; ctx.fillStyle='#78909C'; ctx.lineWidth=3; ctx.lineCap='round';
    // Base
    ctx.beginPath(); ctx.roundRect(28,68,52,9,3); ctx.fill(); ctx.stroke();
    // Stand pillar
    ctx.beginPath(); ctx.moveTo(54,68); ctx.lineTo(54,18); ctx.stroke();
    // Arm
    ctx.beginPath(); ctx.moveTo(54,20); ctx.lineTo(72,20); ctx.stroke();
    // Tube
    ctx.beginPath(); ctx.moveTo(72,20); ctx.lineTo(72,-8); ctx.stroke();
    // Eyepiece
    ctx.fillStyle='#607D8B';
    ctx.beginPath(); ctx.ellipse(72,-12,8,5,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Objective
    ctx.beginPath(); ctx.ellipse(72,38,5,9,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Stage
    ctx.strokeStyle='#78909C'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(44,40,20,8,2); ctx.stroke();
    // Light beam from lamp
    const beam = ctx.createLinearGradient(54,50,54,68);
    beam.addColorStop(0,'rgba(255,235,59,.65)');
    beam.addColorStop(1,'rgba(255,235,59,0)');
    ctx.beginPath(); ctx.moveTo(50,50); ctx.lineTo(47,68); ctx.lineTo(61,68); ctx.lineTo(58,50);
    ctx.fillStyle=beam; ctx.fill();
    // Label badge
    ctx.fillStyle='rgba(33,150,243,.18)'; ctx.strokeStyle='rgba(33,150,243,.5)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(-40,130,80,22,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#1565C0'; ctx.font='bold 11px Outfit,sans-serif'; ctx.textAlign='center';
    ctx.fillText('Biologiste',0,145);
    ctx.restore();
  }

  /* ── RED BLOOD CELL ── */
  function drawRBC(x,y,r,alpha,angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle); ctx.globalAlpha=alpha;
    const ty=.42+.36*Math.abs(Math.sin(angle*1.8)); ctx.scale(1,ty);
    const g=ctx.createRadialGradient(-r*.2,-r*.2,r*.02,0,0,r);
    g.addColorStop(0,'rgba(239,83,80,1)'); g.addColorStop(.45,'rgba(211,47,47,.95)');
    g.addColorStop(.82,'rgba(183,28,28,.85)'); g.addColorStop(1,'rgba(150,10,10,.5)');
    ctx.beginPath(); ctx.ellipse(0,0,r,r,0,0,Math.PI*2);
    ctx.fillStyle=g; ctx.fill();
    const d=ctx.createRadialGradient(0,0,0,0,0,r*.46);
    d.addColorStop(0,'rgba(90,5,5,.80)'); d.addColorStop(.6,'rgba(140,20,20,.38)'); d.addColorStop(1,'rgba(140,20,20,0)');
    ctx.beginPath(); ctx.ellipse(0,0,r*.46,r*.46,0,0,Math.PI*2); ctx.fillStyle=d; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-r*.3,-r*.3,r*.23,r*.09,-0.6,0,Math.PI*2);
    ctx.fillStyle='rgba(255,210,210,.55)'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,0,r,r,0,0,Math.PI*2);
    ctx.strokeStyle='rgba(183,28,28,.35)'; ctx.lineWidth=.8; ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.translate(x,y); ctx.globalAlpha=alpha*.22;
    const h=ctx.createRadialGradient(0,0,r*.5,0,0,r*2.2);
    h.addColorStop(0,'rgba(239,83,80,.55)'); h.addColorStop(1,'rgba(239,83,80,0)');
    ctx.beginPath(); ctx.arc(0,0,r*2.2,0,Math.PI*2); ctx.fillStyle=h; ctx.fill();
    ctx.restore();
  }

  /* ── WHITE BLOOD CELL ── */
  function drawWBC(c) {
    const {x,y,r,alpha,id}=c; ctx.save(); ctx.translate(x,y); ctx.globalAlpha=alpha;
    const ph=t*.28+id, pts=10;
    ctx.beginPath();
    for(let i=0;i<=pts;i++){
      const a=(i/pts)*Math.PI*2;
      const w=r*(.82+.22*Math.sin(a*3+ph)+.10*Math.cos(a*2+ph*1.5));
      const px=Math.cos(a)*w, py=Math.sin(a)*w*.9;
      i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.closePath();
    const bg=ctx.createRadialGradient(-r*.15,-r*.15,0,0,0,r);
    bg.addColorStop(0,'rgba(179,229,252,.80)'); bg.addColorStop(.6,'rgba(129,212,250,.58)'); bg.addColorStop(1,'rgba(79,195,247,.20)');
    ctx.fillStyle=bg; ctx.fill(); ctx.strokeStyle='rgba(2,136,209,.5)'; ctx.lineWidth=1.5; ctx.stroke();
    const np=t*.14+id*1.9;
    [{ox:0,oy:-r*.18,rx:r*.30,ry:r*.23},{ox:r*.20,oy:r*.12,rx:r*.23,ry:r*.26},{ox:-r*.20,oy:r*.14,rx:r*.25,ry:r*.21}]
    .forEach((lb,li)=>{
      const nx=lb.ox+Math.sin(np+li*1.7)*r*.04, ny=lb.oy+Math.cos(np+li*2.2)*r*.04;
      const ng=ctx.createRadialGradient(nx-lb.rx*.3,ny-lb.ry*.3,0,nx,ny,lb.rx);
      ng.addColorStop(0,'rgba(103,58,183,.88)'); ng.addColorStop(.6,'rgba(81,45,168,.62)'); ng.addColorStop(1,'rgba(55,30,140,.15)');
      ctx.beginPath(); ctx.ellipse(nx,ny,lb.rx,lb.ry,np*.09,0,Math.PI*2); ctx.fillStyle=ng; ctx.fill();
    });
    ctx.restore();
  }

  /* ── PLATELET ── */
  function drawPlatelet(p) {
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle); ctx.globalAlpha=p.alpha;
    ctx.beginPath(); ctx.ellipse(0,0,p.r,p.r*.55,0,0,Math.PI*2);
    const g=ctx.createRadialGradient(0,0,0,0,0,p.r);
    g.addColorStop(0,'rgba(255,214,0,1)'); g.addColorStop(.5,'rgba(255,160,0,.85)'); g.addColorStop(1,'rgba(230,100,0,.15)');
    ctx.fillStyle=g; ctx.fill(); ctx.restore();
  }

  /* ── DNA HELIX ── */
  function drawDNA(x,y,sc,al,ph) {
    ctx.save(); ctx.translate(x,y); ctx.scale(sc,sc); ctx.globalAlpha=al;
    const len=90, turns=2.8;
    for(let i=0;i<len;i++){
      const frac=i/len, a=frac*Math.PI*turns*2+ph;
      const x1=Math.cos(a)*18, x2=-x1, y1=frac*len-len/2;
      if(i%3===0){
        ctx.beginPath(); ctx.arc(x1,y1,2.8,0,Math.PI*2); ctx.fillStyle=`rgba(33,150,243,${al})`; ctx.fill();
        ctx.beginPath(); ctx.arc(x2,y1,2.8,0,Math.PI*2); ctx.fillStyle=`rgba(244,67,54,${al})`; ctx.fill();
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y1);
        ctx.strokeStyle=`rgba(120,120,120,${al*.5})`; ctx.lineWidth=1.2; ctx.stroke();
      }
    }
    ctx.restore();
  }

  /* ── TISSUE HEX BACKGROUND ── */
  function drawTissue() {
    const rh=50, cols=Math.ceil(W/80)+2, rows=Math.ceil(H/70)+2;
    ctx.save(); ctx.globalAlpha=.07; ctx.strokeStyle='rgba(33,150,243,.7)'; ctx.lineWidth=1;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const ox=(r%2)*40, cx=c*80+ox-40, cy=r*70-35;
        ctx.beginPath();
        for(let i=0;i<6;i++){
          const a=(i/6)*Math.PI*2-Math.PI/6;
          const px=cx+rh*Math.cos(a), py=cy+rh*Math.sin(a);
          i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
        }
        ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx,cy,rh*.28,0,Math.PI*2);
        ctx.fillStyle='rgba(33,150,243,.12)'; ctx.fill();
      }
    }
    ctx.restore();
  }

  /* ── FIBRIN CONNECTIONS ── */
  function drawFibrin(cells,maxD,color){
    for(let i=0;i<cells.length;i++) for(let j=i+1;j<cells.length;j++){
      const dx=cells[i].x-cells[j].x, dy=cells[i].y-cells[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<maxD){ ctx.save(); ctx.globalAlpha=(1-d/maxD)*.22; ctx.strokeStyle=color;
        ctx.lineWidth=.8; ctx.setLineDash([4,6]);
        ctx.beginPath(); ctx.moveTo(cells[i].x,cells[i].y); ctx.lineTo(cells[j].x,cells[j].y); ctx.stroke();
        ctx.setLineDash([]); ctx.restore(); }
    }
  }

  /* ── FACTORIES ── */
  const mkRBC=(d)=>({x:Math.random()*W,y:Math.random()*H,r:(13+Math.random()*18)*d,angle:Math.random()*Math.PI*2,rotSpeed:(Math.random()-.5)*.008,alpha:(.48+Math.random()*.32)*d,depth:d,pulse:Math.random()*Math.PI*2,pulseSpeed:.02+Math.random()*.012,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.20});
  const mkWBC=()=>({x:Math.random()*W,y:Math.random()*H,r:32+Math.random()*18,alpha:.78+Math.random()*.15,vx:(Math.random()-.5)*.10,vy:(Math.random()-.5)*.07,id:Math.random()*100});
  const mkPlt=()=>({x:Math.random()*W,y:Math.random()*H,r:5+Math.random()*5,angle:Math.random()*Math.PI*2,rotSpeed:(Math.random()-.5)*.06,alpha:.55+Math.random()*.35,vx:(Math.random()-.5)*.85,vy:(Math.random()-.5)*.65,pulse:Math.random()*Math.PI*2});
  const mkDNA=()=>({x:Math.random()*W,y:Math.random()*H,scale:.55+Math.random()*.8,alpha:.38+Math.random()*.35,phase:Math.random()*Math.PI*2,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.08});
  const mkPlasma=()=>({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*2.5,alpha:.18+Math.random()*.28,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.3,pulse:Math.random()*Math.PI*2,pulseSpeed:.03+Math.random()*.02});
  function wrap(c,pad){if(c.x<-pad)c.x=W+pad;if(c.x>W+pad)c.x=-pad;if(c.y<-pad)c.y=H+pad;if(c.y>H+pad)c.y=-pad;}
  function applyFlow(c){const f=flow(c.x,c.y);c.x+=c.vx+f.vx*(c.r/16);c.y+=c.vy+f.vy*(c.r/16);}

  const rbcsFar =Array.from({length:14},()=>mkRBC(.44));
  const rbcsMid =Array.from({length:18},()=>mkRBC(.75));
  const rbcsNear=Array.from({length:9}, ()=>mkRBC(1.0));
  const wbcs    =Array.from({length:6}, mkWBC);
  const platelets=Array.from({length:38},mkPlt);
  const dnas    =Array.from({length:5}, mkDNA);
  const plasma  =Array.from({length:80},mkPlasma);

  /* ── MAIN LOOP ── */
  function draw(){
    ctx.clearRect(0,0,W,H);
    t+=.016;

    // Tissue hex grid
    drawTissue();

    // Plasma sparks
    plasma.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.pulse+=p.pulseSpeed; wrap(p,5);
      const a=p.alpha*(.6+.4*Math.sin(p.pulse));
      ctx.save(); ctx.globalAlpha=a;
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2);
      g.addColorStop(0,'rgba(33,150,243,.9)'); g.addColorStop(1,'rgba(33,150,243,0)');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      ctx.restore();
    });

    // DNA helixes
    dnas.forEach(d=>{d.x+=d.vx;d.y+=d.vy;d.phase+=.025;wrap(d,90);drawDNA(d.x,d.y,d.scale,d.alpha,d.phase);});

    // Fibrin net
    drawFibrin(rbcsMid,140,'rgba(33,150,243,1)');

    // Far RBCs
    rbcsFar.forEach(c=>{c.angle+=c.rotSpeed*.5;c.pulse+=c.pulseSpeed;applyFlow(c);wrap(c,60);drawRBC(c.x,c.y,c.r*(1+.03*Math.sin(c.pulse)),c.alpha,c.angle);});

    // WBCs
    wbcs.forEach(c=>{applyFlow(c);wrap(c,80);drawWBC(c);});

    // Mid RBCs
    rbcsMid.forEach(c=>{c.angle+=c.rotSpeed;c.pulse+=c.pulseSpeed;applyFlow(c);wrap(c,60);drawRBC(c.x,c.y,c.r*(1+.04*Math.sin(c.pulse)),c.alpha,c.angle);});

    // Platelets
    platelets.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.angle+=p.rotSpeed;p.pulse+=.05;wrap(p,10);p.alpha=.45+.30*Math.abs(Math.sin(p.pulse));drawPlatelet(p);});

    // Near RBCs
    rbcsNear.forEach(c=>{c.angle+=c.rotSpeed*1.3;c.pulse+=c.pulseSpeed;applyFlow(c);wrap(c,60);drawRBC(c.x,c.y,c.r*(1+.045*Math.sin(c.pulse)),c.alpha,c.angle);});

    // Biologist — bottom-left, large & visible
    const bScale = Math.min(W,H)/520;
    drawBiologist(160*bScale, H-160*bScale, bScale*1.1, .72);

    requestAnimationFrame(draw);
  }
  draw();
})();
