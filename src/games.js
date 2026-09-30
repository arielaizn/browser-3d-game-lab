import * as T from '/public/vendor/three.module.js';

const m = (color, emissive = 0x000000, extra = {}) => new T.MeshStandardMaterial({
  color, emissive, emissiveIntensity: emissive ? 1.4 : 0, roughness: .48, metalness: .28, ...extra
});
const mesh = (parent, geometry, material, x=0, y=0, z=0) => {
  const o = new T.Mesh(geometry, material); o.position.set(x,y,z); parent.add(o); return o;
};
const group = (parent, x=0, y=0, z=0) => { const g=new T.Group(); g.position.set(x,y,z); parent.add(g); return g; };
const box = (parent, x,y,z,sx,sy,sz, material) => mesh(parent,new T.BoxGeometry(sx,sy,sz),material,x,y,z);
const glow = (parent, x,y,z, radius, color, intensity=1.5) => { const l=new T.PointLight(color,intensity,radius*3,2);l.position.set(x,y,z);parent.add(l);return l; };
const seeded = (seed) => () => { seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; };

export function makeCity(scene, seed=7) {
  const rnd=seeded(seed), city=group(scene), pavement=m(0x1b2426);
  mesh(city,new T.PlaneGeometry(260,320),pavement,0,-.18,-85).rotation.x=-Math.PI/2;
  const buildingBoxes=[], roofBoxes=[], baseBoxes=[], windowBoxes=[];
  const makeMatrix=(x,y,z,sx,sy,sz)=>new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion(),new T.Vector3(sx,sy,sz));
  const addInstance=(list,matrix,color)=>list.push({matrix,color});
  for(let z=-4;z>-278;z-=24){
    box(city,-27,.01,z,2,.02,24,m(0x424b48));box(city,27,.01,z,2,.02,24,m(0x424b48));
    box(city,0,.015,z,1,.025,6,m(0xd8dcac));
    for(let side of [-1,1]) for(let lane=0;lane<3;lane++){
      const h=9+rnd()*44,w=7+rnd()*8,d=9+rnd()*13,x=side*(43+lane*13+rnd()*5);
      const zz=z-rnd()*8, bodyColor=new T.Color().setHSL(.48+rnd()*.08,.14,.16+rnd()*.1);
      addInstance(buildingBoxes,makeMatrix(x,h/2,zz,w,h,d),bodyColor);
      addInstance(roofBoxes,makeMatrix(x,h+.09,zz,w*.77,.18,d*.76),new T.Color(0x526261));
      addInstance(baseBoxes,makeMatrix(x,-.02,zz,w+1,.32,d+1),new T.Color(0x171e20));
      const rows=Math.max(2,Math.floor(h/4));
      for(let row=0;row<rows;row++) for(let col=0;col<3;col++){
        if(rnd()<.17) continue;const c=new T.Color().setHSL([.49,.11,.59][Math.floor(rnd()*3)],.58,.48+rnd()*.17);addInstance(windowBoxes,makeMatrix(x-w*.27+col*w*.27,-h*.43+row*3.7,zz+d/2+.02,w*.12,.42,.035),c);
      }
    }
  }
  function addInstanced(list,color,roughness=.55,metalness=.16){const im=new T.InstancedMesh(new T.BoxGeometry(1,1,1),m(color,0,{roughness,metalness}),list.length);for(let i=0;i<list.length;i++){im.setMatrixAt(i,list[i].matrix);im.setColorAt(i,list[i].color);}im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.receiveShadow=true;city.add(im);}
  addInstanced(buildingBoxes,0xffffff,.72,.12);addInstanced(roofBoxes,0xffffff,.61,.18);addInstanced(baseBoxes,0xffffff,.78,.08);addInstanced(windowBoxes,0xffffff,.22,.3);
  for(let z=-11;z>-270;z-=26){for(let x of [-32,32]){const pole=mesh(city,new T.CylinderGeometry(.08,.12,5,7),m(0x343f40),x,2.5,z);glow(pole,0,2.1,0,4,0xcfff78,.55);}}
  return city;
}

function makeShip(parent, palette=0xd9fa6b) {
  const root=group(parent); const body=m(0xdce9c9,0x26311b,{metalness:.52,roughness:.34});
  mesh(root,new T.CapsuleGeometry(.38,1.3,4,10),body,0,0,0).rotation.x=Math.PI/2;
  const wing=mesh(root,new T.ConeGeometry(.9,2.2,4),m(0x9caf85,0x172011),0,0,.15);wing.rotation.x=Math.PI/2;wing.scale.set(1,.52,.8);
  const cockpit=mesh(root,new T.SphereGeometry(.29,14,10),m(0x72d8cf,0x2cbca9,{metalness:.8,roughness:.13,transparent:true,opacity:.85}),0,.22,-.38);cockpit.scale.set(1,.68,1.25);
  for(const side of [-1,1]){mesh(root,new T.CylinderGeometry(.09,.16,.42,9),m(palette,palette),side*.83,-.06,.02).rotation.z=Math.PI/2;glow(root,side*.93,-.05,.02,2,palette,.45);}
  root.userData.wings=wing;return root;
}

function starfield(parent, count=650, radius=150, seed=17){
  const rnd=seeded(seed), positions=new Float32Array(count*3), colors=new Float32Array(count*3);
  for(let i=0;i<count;i++){const r=radius*(.2+rnd()*.8),a=rnd()*Math.PI*2,b=Math.acos(2*rnd()-1);positions[i*3]=r*Math.sin(b)*Math.cos(a);positions[i*3+1]=r*Math.cos(b);positions[i*3+2]=r*Math.sin(b)*Math.sin(a);const c=new T.Color().setHSL(.45+rnd()*.23,.45,.54+rnd()*.42);colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));geo.setAttribute('color',new T.BufferAttribute(colors,3));
  const p=new T.Points(geo,new T.PointsMaterial({size:.2,vertexColors:true,transparent:true,opacity:.85,sizeAttenuation:true}));parent.add(p);return p;
}

export function buildFlight(scene, runtime){
  scene.background=new T.Color(0x101a1c);scene.fog=new T.FogExp2(0x101a1c,.008);
  scene.add(new T.HemisphereLight(0xcfe5df,0x252122,2.1));const sun=new T.DirectionalLight(0xffc495,3.2);sun.position.set(-30,50,30);scene.add(sun);
  makeCity(scene,93);starfield(scene,150,230,4);
  const player=makeShip(scene,0xd7f665);player.position.set(0,5,8);
  const rings=[], hazards=[], rnd=seeded(41);
  for(let i=0;i<16;i++){
    const z=-18-i*15, x=(rnd()-.5)*34, y=3+rnd()*18;
    const ring=mesh(scene,new T.TorusGeometry(2.5,.1,12,48),m(0xcafa70,0x9abf2e,{emissiveIntensity:2}),x,y,z);ring.rotation.y=(rnd()-.5)*.5;ring.rotation.z=(rnd()-.5)*.25;glow(ring,0,0,0,4,0xcffa72,.8);rings.push(ring);
    if(i%2===1){const h=mesh(scene,new T.OctahedronGeometry(1.15,0),m(0xff825c,0x682015,{emissiveIntensity:1.3}),x+(rnd()-.5)*8,y+(rnd()-.5)*5,z-7);hazards.push(h);}
  }
  const clouds=[];for(let i=0;i<16;i++){const c=mesh(scene,new T.SphereGeometry(1,8,6),m(0x496367,0,{transparent:true,opacity:.18}),((i*37)%100)-50,2+(i*11)%25,-i*19);c.scale.set(7,1.3,3.4);clouds.push(c);}
  let collected=0, distance=0, crashed=false, elapsed=0;
  return {update(dt,keys){if(crashed)return;elapsed+=dt;distance+=dt*24;player.position.z=8-distance;const speed=18*dt;
      if(keys.has('ArrowLeft')||keys.has('KeyA'))player.position.x-=speed;if(keys.has('ArrowRight')||keys.has('KeyD'))player.position.x+=speed;
      if(keys.has('ArrowUp')||keys.has('KeyW'))player.position.y+=speed*.72;if(keys.has('ArrowDown')||keys.has('KeyS'))player.position.y-=speed*.72;
      player.position.x=T.MathUtils.clamp(player.position.x,-29,29);player.position.y=T.MathUtils.clamp(player.position.y,1.5,25);
      player.rotation.z=T.MathUtils.damp(player.rotation.z,((keys.has('ArrowLeft')||keys.has('KeyA'))?-.24:0)+((keys.has('ArrowRight')||keys.has('KeyD'))?.24:0),4,dt);player.rotation.x=Math.sin(elapsed*3)*.035;player.userData.wings.rotation.y=Math.sin(elapsed*13)*.045;
      for(const r of rings){r.rotation.z+=dt*.4;if(!r.userData.taken&&r.position.distanceTo(player.position)<3.1){r.userData.taken=true;r.visible=false;collected++;runtime.points(120,'טבעת נאספה · +120');runtime.progress(collected/12);}}
      for(const h of hazards){h.rotation.x+=dt;h.rotation.y-=dt*.6;if(h.position.distanceTo(player.position)<1.4){h.position.z-=30;runtime.points(-35,'התחככת במכשול');}}
      const target=new T.Vector3(player.position.x*.24,player.position.y+4,player.position.z+14);runtime.camera.position.lerp(target,1-Math.exp(-2*dt));runtime.camera.lookAt(player.position.x,player.position.y,player.position.z-5);
      if(player.position.z<-250||collected>=12)runtime.complete(collected>=12?'המסלול הושלם':'העיר מאחוריך');
    },get progress(){return Math.min(1,collected/12)},get score(){return collected*120},get info(){return {collected,distance:Math.round(distance)}}};
}

export function buildOrbit(scene,runtime){
  scene.background=new T.Color(0x070c17);scene.fog=new T.FogExp2(0x070c17,.003);scene.add(new T.HemisphereLight(0x889bcc,0x151322,1.5));
  const key=new T.PointLight(0xff9b73,150,150,1.5);key.position.set(-20,30,12);scene.add(key);starfield(scene,1400,300,8);
  const planet=mesh(scene,new T.SphereGeometry(9,48,32),new T.MeshStandardMaterial({color:0x693f7f,roughness:.95,metalness:.06}),0,0,0);
  const planetMat=planet.material;planetMat.onBeforeCompile=(s)=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vOrb;').replace('#include <begin_vertex>','#include <begin_vertex>\nvOrb = position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vOrb;').replace('#include <color_fragment>','#include <color_fragment>\nfloat bands=sin(vOrb.y*2.4+sin(vOrb.x*0.6)*2.0)*0.10; diffuseColor.rgb += vec3(bands*0.60,bands*0.32,bands*0.90);');};
  for(let i=0;i<7;i++){const rock=mesh(scene,new T.DodecahedronGeometry(.65+rndOrbit(i)*.55,0),m(i%2?0x996b70:0x364d70),Math.sin(i*2.2)*10,Math.cos(i*1.9)*7,Math.cos(i*1.4)*10);rock.userData.orbit=i;}
  const orbit1=mesh(scene,new T.TorusGeometry(13,.035,5,120),m(0x84e2d3,0x287e73),0,0,0);orbit1.rotation.x=.65;orbit1.rotation.y=.24;
  const orbit2=mesh(scene,new T.TorusGeometry(18,.028,5,120),m(0xdb9e7a,0x59321d),0,0,0);orbit2.rotation.x=1.2;orbit2.rotation.y=-.38;
  const player=makeShip(scene,0x8bdbff);player.scale.setScalar(.72);const crystals=[];
  for(let i=0;i<14;i++){const a=i*Math.PI*2/14;const crystal=mesh(scene,new T.OctahedronGeometry(.55,0),m(i%3===0?0xffbb75:0x8df6ee,i%3===0?0xd85118:0x236e87,{emissiveIntensity:2}),Math.cos(a)*16,Math.sin(a*1.8)*5,Math.sin(a)*16);crystal.userData.angle=a;glow(crystal,0,0,0,3,0x78ebed,.55);crystals.push(crystal);}
  let angle=0,radius=16,altitude=0,collected=0,elapsed=0;
  return {update(dt,keys){elapsed+=dt;planet.rotation.y+=dt*.055;orbit1.rotation.z+=dt*.04;orbit2.rotation.z-=dt*.025;angle+=dt*.35;
      if(keys.has('ArrowLeft')||keys.has('KeyA'))radius-=dt*6;if(keys.has('ArrowRight')||keys.has('KeyD'))radius+=dt*6;radius=T.MathUtils.clamp(radius,11,22);
      if(keys.has('ArrowUp')||keys.has('KeyW'))altitude+=dt*4;if(keys.has('ArrowDown')||keys.has('KeyS'))altitude-=dt*4;altitude=T.MathUtils.clamp(altitude,-5,7);
      player.position.set(Math.cos(angle)*radius,altitude+Math.sin(angle*1.4)*1.3,Math.sin(angle)*radius);player.rotation.y=-angle;player.userData.wings.rotation.y=Math.sin(elapsed*10)*.05;
      let current=0;for(const c of crystals){c.rotation.y+=dt*1.4;c.rotation.x+=dt*.55;if(c.userData.taken)continue;const targetAngle=c.userData.angle;const dist=Math.abs(Math.atan2(Math.sin(angle-targetAngle),Math.cos(angle-targetAngle)));if(dist<.16&&Math.abs(radius-16)<2.5&&Math.abs(player.position.y-c.position.y)<4){c.userData.taken=true;c.visible=false;collected++;current++;runtime.points(150,'שבר אור נאסף · +150');}}
      runtime.camera.position.lerp(new T.Vector3(player.position.x+0,player.position.y+8,player.position.z+24),1-Math.exp(-1.2*dt));runtime.camera.lookAt(0,0,0);runtime.progress(collected/10);if(collected>=10)runtime.complete('המסלול נטען');
    },get progress(){return collected/10},get score(){return collected*150},get info(){return {collected,orbitRadius:Math.round(radius*10)/10}}};
}
function rndOrbit(i){return ((i*73+31)%101)/101;}

export function buildCamera(scene,runtime){
  scene.background=new T.Color(0x131815);scene.fog=new T.Fog(0x131815,34,90);scene.add(new T.HemisphereLight(0xb8d5c7,0x2b2122,2.0));
  const warm=new T.SpotLight(0xffcc8a,95,75,Math.PI/5,.5,1.4);warm.position.set(-8,14,10);warm.target.position.set(0,2,0);scene.add(warm,warm.target);const cool=new T.PointLight(0x9cf4e3,34,25);cool.position.set(10,7,-5);scene.add(cool);
  const floor=m(0x222b28,0,{roughness:.83});mesh(scene,new T.PlaneGeometry(90,90),floor,0,-.15,0).rotation.x=-Math.PI/2;
  const grid=new T.GridHelper(72,36,0x66796a,0x2f3c35);grid.position.y=-.13;grid.material.transparent=true;grid.material.opacity=.38;scene.add(grid);
  const plinth=mesh(scene,new T.CylinderGeometry(2.1,2.5,.55,48),m(0x343e37,0x101a11,{metalness:.4}),0,.25,0);plinth.receiveShadow=true;
  const person=group(scene,0,0,0);mesh(person,new T.SphereGeometry(.75,28,20),m(0xd5b494),0,3.35,0);mesh(person,new T.CapsuleGeometry(.62,1.1,6,16),m(0x557269),0,1.88,0);mesh(person,new T.CylinderGeometry(.19,.23,.55,12),m(0xcfad8a),0,1.25,.05);
  for(const side of [-1,1]){mesh(person,new T.CapsuleGeometry(.18,.95,4,9),m(0xb78d70),side*.82,2.05,0).rotation.z=side*.18;mesh(person,new T.CapsuleGeometry(.2,.7,4,9),m(0x303934),side*.3,.77,0).rotation.z=side*.07;}
  const targetRing=mesh(scene,new T.TorusGeometry(2.15,.035,8,64),m(0xd7fa6f,0x52742a),0,3.3,0);targetRing.rotation.x=Math.PI/2;
  const cameraRig=group(scene,7,4.3,10);cameraRig.scale.setScalar(.5);const camBody=mesh(cameraRig,new T.BoxGeometry(1.05,.7,1.1),m(0x293836,0x0e2823,{metalness:.72}));const lens=mesh(cameraRig,new T.CylinderGeometry(.28,.38,.34,24),m(0x8ce7d7,0x246359,{metalness:.8,roughness:.1}),0,0,-.65);lens.rotation.x=Math.PI/2;const lensGlow=glow(cameraRig,0,0,-1.1,3,0xa1ffde,.7);
  const tripod=mesh(cameraRig,new T.ConeGeometry(.62,1.45,3),m(0x343d39));tripod.position.y=-.88;tripod.rotation.x=Math.PI;
  const markers=[];for(let i=0;i<3;i++){const ring=mesh(scene,new T.TorusGeometry(1.1,.045,8,40),m([0xd7fa6f,0x8df6ee,0xff9a74][i],[0x4e6914,0x1d5d58,0x61311f][i]),[-9,0,9][i],.1,-8-i*2);ring.rotation.x=Math.PI/2;markers.push(ring);}
  let yaw=.58,zoom=12,focus=0,elapsed=0,locked=false,captures=0,quality=0;const targets=[{x:-9,z:-8,label:'שלוש רבעי',yaw:1.25,zoom:13},{x:0,z:-10,label:'דיוקן',yaw:.1,zoom:10},{x:9,z:-12,label:'פריים רחב',yaw:-1,zoom:16}];
  function evaluate(){const t=targets[focus%targets.length];const dx=targetRing.position.x-t.x,dz=targetRing.position.z-t.z;const posErr=Math.hypot(dx,dz),yawErr=Math.abs(Math.atan2(Math.sin(yaw-t.yaw),Math.cos(yaw-t.yaw))),zoomErr=Math.abs(zoom-t.zoom);const q=Math.max(0,100-Math.round(posErr*4+yawErr*22+zoomErr*3));quality+=q;captures++;runtime.points(q*3,q>72?'פריים נקי · '+q+' נקודות':'פריים נשמר · '+q+' נקודות');runtime.progress(captures/3);focus++;if(captures>=3)runtime.complete('שלושה פריימים. במאי אחד.');}
  const onAction=()=>{if(!locked)evaluate();};runtime.onAction=onAction;
  return {update(dt,keys){elapsed+=dt;const spin=(keys.has('ArrowLeft')||keys.has('KeyA')?-1:0)+(keys.has('ArrowRight')||keys.has('KeyD')?1:0);yaw+=spin*dt*.9;
      if(keys.has('ArrowUp')||keys.has('KeyW'))zoom-=dt*4;if(keys.has('ArrowDown')||keys.has('KeyS'))zoom+=dt*4;zoom=T.MathUtils.clamp(zoom,7,22);
      const t=targets[focus%targets.length], orbitX=Math.sin(yaw)*zoom, orbitZ=Math.cos(yaw)*zoom;
      cameraRig.position.set(orbitX,4.3+Math.sin(yaw*1.3)*.7,orbitZ);cameraRig.lookAt(person.position.x,2.4,person.position.z);
      runtime.camera.position.lerp(new T.Vector3(cameraRig.position.x+Math.sin(yaw)*5,cameraRig.position.y+2.5,cameraRig.position.z+Math.cos(yaw)*5),1-Math.exp(-2*dt));runtime.camera.lookAt(person.position.x,2,person.position.z);
      targetRing.position.x=T.MathUtils.damp(targetRing.position.x,t.x,1.8,dt);targetRing.position.z=T.MathUtils.damp(targetRing.position.z,t.z,1.8,dt);targetRing.material.emissiveIntensity=1.35+Math.sin(elapsed*3)*.25;
      for(let i=0;i<markers.length;i++){markers[i].material.emissiveIntensity=i===focus%3?1.6:.35;markers[i].rotation.z+=dt*.13;}
      runtime.objective('סצנה '+(focus+1)+' מתוך 3 · '+t.label+' · לחץ Space כדי לצלם');runtime.progress(captures/3);if(captures>=3)runtime.complete('שלושה פריימים. במאי אחד.');
    },get progress(){return captures/3},get score(){return quality*3},get info(){return {captures,composition:targets[focus%3]?.label||'done',yaw,zoom}}};
}
