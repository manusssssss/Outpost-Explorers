import * as THREE from './vendor/three.module.js';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function missionSteps(m){
 const n=m.name.toLowerCase();
 if(n==='chandrayaan-3')return [
  ['Lunar orbit','The spacecraft reached lunar orbit before the landing attempt.'],
  ['Vikram descends','The lander made a controlled descent toward the lunar surface.'],
  ['Soft landing','Vikram landed in the Moon’s southern high latitudes on 23 August 2023.'],
  ['Pragyan rolls out','The rover left the lander to move across the surface.'],
  ['Surface science','The lander and rover tested instruments and gathered surface measurements.']
 ];
 if(n==='chandrayaan-1')return [
  ['Travel to the Moon','The orbiter travelled from Earth and entered lunar orbit.'],
  ['Map the surface','Instruments observed the Moon in different wavelengths.'],
  ['Study water-related signatures','Measurements helped reveal water-related material on the Moon.'],
  ['Send results home','Orbital science data was sent back for researchers to study.']
 ];
 if(n==='chandrayaan-2')return [
  ['Lunar arrival','The orbiter reached lunar orbit and began its observations.'],
  ['Vikram landing attempt','The lander attempted a descent but contact was lost before landing.'],
  ['Orbiter science continues','The orbiter remained to study and map the Moon.'],
  ['A mixed mission result','The landing attempt failed, while the orbiter continued its science work.']
 ];
 if(n==='chandrayaan-4')return [
  ['Travel to the Moon','Concept preview: a future spacecraft travels to lunar orbit.'],
  ['Collect a sample','A lander is planned to gather lunar material.'],
  ['Transfer the sample','Mission elements would transfer the sample to a return vehicle.'],
  ['Bring it to Earth','The announced goal is to return lunar material for laboratory study.']
 ];
 if(n.includes('chandrayaan-5')||n.includes('lupex'))return [
  ['Reach the lunar south pole','Concept preview based on the announced polar exploration goals.'],
  ['Deploy a rover','A rover is planned to travel near the landing area.'],
  ['Study polar material','Instruments would investigate lunar soil and volatile materials.'],
  ['Share findings','The mission aims to send its science data back to Earth.']
 ];
 if(n==='apollo 11')return [
  ['Enter lunar orbit','Apollo 11 arrived with the command module in lunar orbit.'],
  ['The Eagle descends','The lunar module separated for its powered descent.'],
  ['Land and explore','Armstrong and Aldrin explored the surface while Collins remained in orbit.'],
  ['Return to Earth','The crew reunited in orbit and returned home with lunar samples.']
 ];
 const type=m.type.toLowerCase(),world=m.world;
 if(/sample return/.test(type))return [
  ['Travel to '+world,'The spacecraft makes its journey to the target world.'],
  ['Collect material','A sampling system gathers material for closer study.'],
  ['Launch the sample','A return vehicle carries the collected material away.'],
  ['Study the result','Returned samples can be examined with laboratory instruments.']
 ];
 if(/rover/.test(type))return [
  ['Approach the surface','The spacecraft arrives at its destination.'],
  ['Land and deploy','A landing system places the rover on the ground.'],
  ['Explore the terrain','The rover moves between points of scientific interest.'],
  ['Examine the target','Onboard instruments inspect rocks, soil or other materials.']
 ];
 if(/lander|impactor/.test(type))return [
  ['Approach the target','The spacecraft lines up with its destination.'],
  ['Descend to the surface','The vehicle follows its planned landing or impact path.'],
  ['Reach the target','The surface event provides the mission’s key observation.'],
  ['Send findings','The spacecraft or a relay sends results to Earth.']
 ];
 if(/orbiter|flyby|orbit/.test(type))return [
  ['Cruise through space','The spacecraft follows its interplanetary route.'],
  ['Reach '+world,'The vehicle passes the world or enters an orbit around it.'],
  ['Observe the world','Cameras and instruments collect images and measurements.'],
  ['Transmit the data','The mission sends its observations to Earth.']
 ];
 return [
  ['Begin the journey','The mission launches toward '+world+'.'],
  ['Reach the mission target','The spacecraft begins its planned exploration work.'],
  ['Carry out the science','Instruments collect observations connected to the mission goal.'],
  ['Share the results','The mission sends information back for scientists to study.']
 ];
}

function addStars(scene){
 const positions=new Float32Array(210*3);
 for(let i=0;i<210;i++){
  positions[i*3]=(Math.random()-.5)*22;positions[i*3+1]=(Math.random()-.5)*12;positions[i*3+2]=-2-Math.random()*12;
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 scene.add(new THREE.Points(geometry,new THREE.PointsMaterial({color:0xdde9e5,size:.035,transparent:true,opacity:.8,sizeAttenuation:true})));
}

function makeRover(){
 const group=new THREE.Group(),body=new THREE.Mesh(new THREE.BoxGeometry(1.15,.36,.78),new THREE.MeshStandardMaterial({color:0xd7d9cc,metalness:.25,roughness:.62}));
 body.position.y=.52;group.add(body);
 const top=new THREE.Mesh(new THREE.BoxGeometry(.62,.22,.55),new THREE.MeshStandardMaterial({color:0x617a76,metalness:.3,roughness:.42}));top.position.set(-.1,.81,0);group.add(top);
 const mast=new THREE.Mesh(new THREE.CylinderGeometry(.045,.055,.67,10),new THREE.MeshStandardMaterial({color:0xaab9ac,metalness:.55,roughness:.35}));mast.position.set(-.28,1.23,0);group.add(mast);
 const cam=new THREE.Mesh(new THREE.BoxGeometry(.34,.2,.28),new THREE.MeshStandardMaterial({color:0xe5b86b,metalness:.3,roughness:.3}));cam.position.set(-.28,1.55,0);group.add(cam);
 const wheels=[];
 for(const x of [-.42,.42])for(const z of [-.47,.47]){
  const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.16,14),new THREE.MeshStandardMaterial({color:0x202c2b,roughness:.86}));wheel.rotation.x=Math.PI/2;wheel.position.set(x,.3,z);group.add(wheel);wheels.push(wheel);
 }
 return {group,wheels};
}

function makeLander(){
 const group=new THREE.Group();
 const shell=new THREE.Mesh(new THREE.CylinderGeometry(.43,.57,.72,6),new THREE.MeshStandardMaterial({color:0xe2e2d4,metalness:.2,roughness:.52}));shell.position.y=.83;group.add(shell);
 const cap=new THREE.Mesh(new THREE.CylinderGeometry(.23,.43,.3,6),new THREE.MeshStandardMaterial({color:0x718880,metalness:.35,roughness:.38}));cap.position.y=1.32;group.add(cap);
 const footMaterial=new THREE.MeshStandardMaterial({color:0x9da99b,metalness:.48,roughness:.4});
 for(let i=0;i<3;i++){
  const a=i*Math.PI*2/3,leg=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.94,8),footMaterial);
  leg.position.set(Math.cos(a)*.62,.38,Math.sin(a)*.62);leg.rotation.z=-Math.cos(a)*.45;leg.rotation.x=Math.sin(a)*.45;group.add(leg);
  const pad=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.08,12),footMaterial);pad.position.set(Math.cos(a)*.83,.03,Math.sin(a)*.83);group.add(pad);
 }
 const panelMat=new THREE.MeshStandardMaterial({color:0x315c70,metalness:.55,roughness:.28,side:THREE.DoubleSide});
 const panel=new THREE.Mesh(new THREE.BoxGeometry(.94,.04,.43),panelMat);panel.position.set(.83,1.04,0);group.add(panel);
 return group;
}

export function mountMissionDemo(container,mission,ui){
 const steps=missionSteps(mission);let step=0,frame=0,disposed=false,dragging=false,lastX=0,lastY=0,rotX=0,rotY=0,zoom=1;
 const type=mission.type.toLowerCase(),isOrbital=/orbiter|flyby|orbit/.test(type),isReturn=/sample return/.test(type);
 container.innerHTML='<canvas class="mission-demo-canvas" aria-label="Interactive three-dimensional illustration of '+mission.name.replace(/[&<>"']/g,'')+'"></canvas><div class="mission-demo-hint">DRAG TO ROTATE · SCROLL TO ZOOM</div>';
 const canvas=container.querySelector('canvas'),renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(container.clientWidth,container.clientHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x111f24,.025);
 const camera=new THREE.PerspectiveCamera(37,container.clientWidth/container.clientHeight,.1,100);camera.position.set(4,3.3,8);
 scene.add(new THREE.HemisphereLight(0xc7d9d8,0x493a31,1.65));
 const key=new THREE.DirectionalLight(0xffe7c4,3.1);key.position.set(-4,6,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0x6ca2b2,2.1);rim.position.set(5,2,-5);scene.add(rim);addStars(scene);
 const worldColor=mission.world==='Mars'?0xa44d32:0x969b96;
 const planetGroup=new THREE.Group();scene.add(planetGroup);
 const planetMaterial=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.98,metalness:0});
 const planet=new THREE.Mesh(new THREE.SphereGeometry(1.78,48,32),planetMaterial);planetGroup.add(planet);
 let planetTexture=null;new THREE.TextureLoader().load('./assets/'+mission.world.toLowerCase()+'.jpg',texture=>{if(disposed){texture.dispose();return;}planetTexture=texture;texture.colorSpace=THREE.SRGBColorSpace;planetMaterial.map=texture;planetMaterial.needsUpdate=true;});
 const surface=new THREE.Mesh(new THREE.PlaneGeometry(22,22),new THREE.MeshStandardMaterial({color:worldColor,roughness:1,metalness:0}));surface.rotation.x=-Math.PI/2;surface.position.y=-1.45;scene.add(surface);
 const randomSeed=(mission.name.length*971+mission.year||193)*53;
 let seed=randomSeed>>>0;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const rockMat=new THREE.MeshStandardMaterial({color:mission.world==='Mars'?0x80503e:0x727a76,roughness:1});
 for(let i=0;i<26;i++){
  const size=.07+rand()*.24,rock=new THREE.Mesh(new THREE.DodecahedronGeometry(size,0),rockMat);
  rock.position.set((rand()-.5)*10,-1.36+size*.45,(rand()-.5)*6-1.3);rock.rotation.set(rand()*2,rand()*2,rand()*2);scene.add(rock);
 }
 const target=new THREE.Group();target.position.set(2.3,-1.38,-.1);scene.add(target);
 const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.48,8),new THREE.MeshStandardMaterial({color:0xc7dc9b,emissive:0x466b37,emissiveIntensity:1.1}));beacon.position.y=.24;target.add(beacon);
 const halo=new THREE.Mesh(new THREE.TorusGeometry(.36,.028,8,32),new THREE.MeshBasicMaterial({color:0xdde9a5}));halo.rotation.x=Math.PI/2;halo.position.y=.03;target.add(halo);
 const lander=makeLander();lander.position.set(.4,-1.43,-.4);scene.add(lander);
 const rover=makeRover();rover.group.position.set(-2.1,-1.43,.3);scene.add(rover.group);
 const orbitRing=new THREE.Mesh(new THREE.TorusGeometry(2.12,.012,8,96),new THREE.MeshBasicMaterial({color:0x8bd4cf,transparent:true,opacity:.72}));orbitRing.rotation.x=.48;planetGroup.add(orbitRing);
 const satellite=new THREE.Group();
 const bus=new THREE.Mesh(new THREE.BoxGeometry(.42,.36,.38),new THREE.MeshStandardMaterial({color:0xd9dfd4,metalness:.58,roughness:.3}));satellite.add(bus);
 const panelMat=new THREE.MeshStandardMaterial({color:0x37728b,metalness:.5,roughness:.35});
 for(const side of [-1,1]){const panel=new THREE.Mesh(new THREE.BoxGeometry(.72,.045,.4),panelMat);panel.position.x=side*.59;satellite.add(panel);}
 const ant=new THREE.Mesh(new THREE.ConeGeometry(.17,.26,16),new THREE.MeshStandardMaterial({color:0xf0c477,metalness:.25,roughness:.3}));ant.rotation.z=Math.PI;ant.position.y=-.27;satellite.add(ant);planetGroup.add(satellite);
 const sample=new THREE.Mesh(new THREE.OctahedronGeometry(.2,0),new THREE.MeshStandardMaterial({color:0xd4c396,metalness:.12,roughness:.72}));sample.position.set(1.95,-1.23,.18);scene.add(sample);
 const returnCapsule=new THREE.Group();
 const capsuleBody=new THREE.Mesh(new THREE.ConeGeometry(.24,.62,8),new THREE.MeshStandardMaterial({color:0xdadbd0,metalness:.25,roughness:.4}));capsuleBody.rotation.z=Math.PI;returnCapsule.add(capsuleBody);
 const capsuleBase=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.11,12),new THREE.MeshStandardMaterial({color:0xc36a43,metalness:.2,roughness:.52}));capsuleBase.position.y=-.3;returnCapsule.add(capsuleBase);scene.add(returnCapsule);
 const moonEarth=new THREE.Mesh(new THREE.SphereGeometry(.28,24,18),new THREE.MeshStandardMaterial({color:0x4b88a2,roughness:.75,emissive:0x123044,emissiveIntensity:.25}));moonEarth.position.set(-3.5,2.3,-4.6);moonEarth.visible=mission.world==='Moon';scene.add(moonEarth);

 const resize=()=>{const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
 const onDown=e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);};
 const onMove=e=>{if(!dragging)return;rotY+=(e.clientX-lastX)*.008;rotX=clamp(rotX+(e.clientY-lastY)*.006,-.65,.65);lastX=e.clientX;lastY=e.clientY;};
 const onUp=()=>{dragging=false;};
 const onWheel=e=>{e.preventDefault();zoom=clamp(zoom+e.deltaY*.001,.78,1.35);};
 canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',onUp);canvas.addEventListener('wheel',onWheel,{passive:false});
 const observer=new ResizeObserver(resize);observer.observe(container);

 const touchdownStep=Math.max(1,steps.findIndex(s=>/land|surface|deploy/i.test(s[0])));
 let landerTargetY=-1.43;
 function showStep(){
  const s=steps[step];ui.label.textContent=s[0];ui.copy.textContent=s[1];ui.progress.textContent='STEP '+(step+1)+' OF '+steps.length;
  ui.previous.disabled=step===0;ui.next.textContent=step===steps.length-1?'Replay mission ↻':'Next step →';
  landerTargetY=step<touchdownStep?0.8:-1.43;
  lander.visible=!isOrbital;rover.group.visible=!isOrbital&&step>=touchdownStep&&(/rover/.test(type)||steps.some(x=>/rover/i.test(x[0])));
  sample.visible=/sample/.test(type)&&step>=steps.length-2;
  returnCapsule.visible=isReturn&&step===steps.length-1;
  satellite.visible=isOrbital||step===steps.length-1;
  if(isOrbital){planetGroup.visible=true;surface.visible=false;target.visible=false;rover.group.visible=false;lander.visible=false;}
  else{planetGroup.visible=false;surface.visible=true;target.visible=true;}
 }
 const previous=()=>{step=Math.max(0,step-1);showStep();};
 const next=()=>{step=step===steps.length-1?0:step+1;showStep();};
 ui.previous.addEventListener('click',previous);ui.next.addEventListener('click',next);showStep();resize();
 const animate=()=>{
  if(disposed)return;frame=requestAnimationFrame(animate);const t=performance.now()*.001;
  planetGroup.rotation.y=t*.065;
  satellite.position.set(Math.cos(t*.34)*2.12,Math.sin(t*.34)*.78,Math.sin(t*.34)*1.35);
  satellite.rotation.y=-t*.34;
  if(!isOrbital){
   const travel=step/(steps.length-1);rover.group.position.x=-2.1+travel*3.1;rover.group.rotation.y=.12+travel*.18;
   rover.wheels.forEach(w=>w.rotation.z=-travel*2.2);
   target.rotation.y=t*.25;halo.material.opacity=.55+Math.sin(t*2.4)*.25;
   lander.position.y=THREE.MathUtils.damp(lander.position.y,landerTargetY,.8,1/60);lander.rotation.y=Math.sin(t*.4)*.04;
  }
  if(returnCapsule.visible)returnCapsule.position.set(.4,-.9+Math.sin(t*1.6)*.65,-.4);
  camera.position.set(4*Math.cos(rotY)*zoom,3.3+rotX*3,8*Math.sin(rotY)*zoom);camera.lookAt(0,-.05,0);
  renderer.render(scene,camera);
 };
 animate();
 return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointermove',onMove);canvas.removeEventListener('pointerup',onUp);canvas.removeEventListener('pointercancel',onUp);canvas.removeEventListener('wheel',onWheel);ui.previous.removeEventListener('click',previous);ui.next.removeEventListener('click',next);planetTexture?.dispose();renderer.dispose();scene.traverse(o=>{o.geometry?.dispose?.();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose?.();});};
}

