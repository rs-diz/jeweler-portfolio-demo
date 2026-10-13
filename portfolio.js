(function(){
  var NS="http://www.w3.org/2000/svg";
  function el(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);parent.appendChild(e);return e}
  function pt(r,a){return [ (r*Math.cos(a)).toFixed(2), (r*Math.sin(a)).toFixed(2) ]}

  /* Огранка Кр-57, вид сверху, рисуется линиями при загрузке */
  var svg=document.getElementById("brilliant");
  var R=190, T=96, M=150, n=8, parts=[];
  parts.push(el("circle",{cx:0,cy:0,r:R},svg));
  var table=[],star=[],girdle=[];
  for(var i=0;i<n;i++){
    var a=-Math.PI/2+i*2*Math.PI/n, b=a+Math.PI/n;
    table.push(pt(T,a)); star.push(pt(M,b)); girdle.push(pt(R,a));
  }
  parts.push(el("polygon",{points:table.map(function(p){return p.join(",")}).join(" ")},svg));
  for(var j=0;j<n;j++){
    var t1=table[j], t2=table[(j+1)%n], s=star[j], g1=girdle[j], g2=girdle[(j+1)%n];
    var gm=pt(R,-Math.PI/2+(j+.5)*2*Math.PI/n);
    parts.push(el("path",{d:"M"+t1+"L"+s+"L"+t2},svg));
    parts.push(el("path",{d:"M"+t1+"L"+g1+"M"+s+"L"+gm,class:"thin"},svg));
    parts.push(el("path",{d:"M"+g1+"L"+s+"L"+g2,class:"thin"},svg));
  }
  el("path",{d:"M-200 0H200M0-200V200",class:"thin","stroke-dasharray":"4 6"},svg);
  var tx=el("text",{x:0,y:214,"text-anchor":"middle"},svg); tx.textContent="Кр-57, вид сверху";
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduce){
    parts.forEach(function(p,k){
      var L=p.getTotalLength?p.getTotalLength():800;
      p.style.strokeDasharray=L; p.style.strokeDashoffset=L;
      p.style.transition="stroke-dashoffset 1.6s cubic-bezier(.6,.1,.2,1) "+(0.15+k*0.035)+"s";
    });
    requestAnimationFrame(function(){requestAnimationFrame(function(){parts.forEach(function(p){p.style.strokeDashoffset=0})})});
  }

  /* Морозный узор */
  var frost=document.getElementById("frost");
  function branch(x,y,ang,len,depth){
    if(depth===0||len<4)return;
    var x2=x+Math.cos(ang)*len, y2=y+Math.sin(ang)*len;
    el("path",{d:"M"+x.toFixed(1)+" "+y.toFixed(1)+"L"+x2.toFixed(1)+" "+y2.toFixed(1),"stroke-width":(depth*.35).toFixed(2)},frost);
    for(var s=1;s<=3;s++){
      var f=s/4, bx=x+(x2-x)*f, by=y+(y2-y)*f;
      branch(bx,by,ang-0.9,len*0.38,depth-1);
      branch(bx,by,ang+0.9,len*0.38,depth-1);
    }
  }
  branch(20,540,-1.25,260,3); branch(300,420,-2.4,200,3); branch(150,560,-1.7,180,3);

  /* Зёрна граната */
  var seeds=document.getElementById("seeds"), seed=7;
  function rnd(){seed=(seed*9301+49297)%233280;return seed/233280}
  for(var q=0;q<70;q++){
    el("ellipse",{cx:(rnd()*300).toFixed(1),cy:(rnd()*200).toFixed(1),rx:(7+rnd()*5).toFixed(1),ry:(9+rnd()*5).toFixed(1),transform:"rotate("+(rnd()*180|0)+")",opacity:(0.5+rnd()*0.5).toFixed(2)},seeds);
  }
  // rotate around own centre
  Array.prototype.forEach.call(seeds.children,function(e){var cx=e.getAttribute("cx"),cy=e.getAttribute("cy");e.setAttribute("transform","rotate("+(rnd()*180|0)+" "+cx+" "+cy+")")});

  /* Дорожка бриллиантов на шинке рендера */
  var pave=document.getElementById("pave");
  for(var p=0;p<14;p++){
    var ang=Math.PI*(1.15+p*0.05), c=pt(114,ang);
    var cxp=200+ +c[0], cyp=250+ +c[1];
    if(p>=7){ang=Math.PI*(1.85-(p-7)*0.05); c=pt(114,ang); cxp=200+ +c[0]; cyp=250+ +c[1];}
    el("circle",{cx:cxp.toFixed(1),cy:cyp.toFixed(1),r:3.6,fill:"#fff",stroke:"#9AA2A7","stroke-width":.6},pave);
  }

  /* Сравнение эскиз / рендер */
  var cmp=document.getElementById("compare"), range=cmp.querySelector("input");
  range.addEventListener("input",function(){cmp.style.setProperty("--pos",range.value+"%")});
})();
