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
 if(n==='apollo 9')return [
  ['Launch to Earth orbit','Apollo 9 launched on Saturn V and remained in low Earth orbit; it never travelled to the Moon.'],
  ['Spider separates','The Lunar Module tested free flight, engine burns and life-support systems near the Command and Service Module.'],
  ['Rendezvous and dock','The crew practised bringing the two spacecraft back together in Earth orbit.'],
  ['Return to Earth','The crew brought the Apollo spacecraft home and splashed down in the Atlantic.']
 ];
 if(n==='apollo 10')return [
  ['Launch to Earth orbit','Saturn V placed the crew and Apollo spacecraft into Earth orbit before translunar injection.'],
  ['Enter lunar orbit','The crew reached lunar orbit and checked the landing site and navigation.'],
  ['Rehearse the descent','The Lunar Module descended to about 15.6 kilometres above the surface, then turned back; Apollo 10 did not land.'],
  ['Rendezvous and return','The Lunar Module rejoined the Command Module, and the crew returned to Earth.']
 ];
 if(n==='apollo 11')return [
  ['Enter lunar orbit','Columbia and Eagle arrived in lunar orbit; Michael Collins stayed aboard Columbia.'],
  ['Eagle separates','The Lunar Module made a powered descent toward the Sea of Tranquility.'],
  ['Land and explore','Eagle landed on 20 July 1969. Armstrong and Aldrin explored while Collins remained in lunar orbit.'],
  ['Ascent and return','The ascent stage rendezvoused with Columbia; the crew returned to Earth with lunar samples.']
 ];
 if(n==='chandrayaan-1')return [
  ['Launch from Sriharikota','PSLV-C11 launched India’s first lunar mission on 22 October 2008.'],
  ['Enter lunar orbit','The orbiter mapped the Moon with cameras and instruments in several wavelengths.'],
  ['Release the impact probe','The Moon Impact Probe descended and impacted near the lunar south pole on 14 November 2008.'],
  ['Study the measurements','Orbital observations helped reveal water-related signatures; this was not a soft landing mission.']
 ];
 if(n==='chandrayaan-2')return [
  ['Launch and cruise','The mission launched on 22 July 2019; its orbiter later entered lunar orbit.'],
  ['Separate the lander','Vikram separated from the orbiter and began its planned descent.'],
  ['Descent interrupted','Contact was lost during the final descent on 7 September 2019; Vikram did not make a successful landing.'],
  ['Orbiter science','The orbiter continued its lunar observations independently of the landing attempt.']
 ];
 if(n==='chandrayaan-3')return [
  ['Launch and lunar transfer','LVM3 launched the mission on 14 July 2023 and sent it on a multi-step journey to the Moon.'],
  ['Vikram descends','The lander used a powered descent to approach the selected landing area.'],
  ['Soft landing','Vikram landed on 23 August 2023; this was a successful robotic landing, not a crewed mission.'],
  ['Pragyan rolls out','The six-wheeled rover deployed and performed short-range surface science.']
 ];
 if(n==='artemis i')return [
  ['SLS launch','The uncrewed Orion spacecraft launched on the Space Launch System on 16 November 2022.'],
  ['Travel to the Moon','Orion travelled beyond the Moon and tested systems for future crewed flights.'],
  ['Lunar orbit test','Orion operated in a distant retrograde orbit; it did not land on the Moon.'],
  ['Earth return','Orion re-entered Earth’s atmosphere and splashed down on 11 December 2022.']
 ];
 if(n==='artemis ii')return [
  ['SLS launch with crew','Four astronauts launched aboard Orion on 01 April 2026.'],
  ['Crewed lunar flyby','Orion travelled around the Moon; Artemis II was a flyby and did not attempt a landing.'],
  ['Deep-space systems test','The crew checked spacecraft and life-support systems during the flight.'],
  ['Return to Earth','Orion splashed down on 10 April 2026 after the crewed lunar flyby.']
 ];
 if(n==='luna 9')return [
  ['Launch from Earth','Luna 9 launched on 31 January 1966 toward the Moon.'],
  ['Brake for the surface','A retro-rocket slowed the landing capsule and airbags cushioned touchdown.'],
  ['First successful soft landing','The capsule landed on 3 February 1966 and survived on the lunar surface.'],
  ['Unfold and photograph','Protective petals opened and panoramic television images were transmitted to Earth.']
 ];
 if(n==='luna 1')return [
  ['Launch from Earth','The Soviet probe launched on 02 January 1959 on a trajectory intended to reach the Moon.'],
  ['Miss the impact target','A guidance error left Luna 1 on a path that missed the Moon.'],
  ['First escape from Earth','It became the first human-made object to reach escape velocity from Earth.'],
  ['Fly past the Moon','Luna 1 passed about 6,400 kilometres from the Moon; it did not land or enter lunar orbit.']
 ];
 const type=m.type.toLowerCase(),world=m.world,planned=m.status==='Planned';
 const missionStage=[planned?'Planned objective':m.status==='Unsuccessful'?'Mission outcome':'Mission record',m.summary];
 const detailStage=[planned?'Science this mission may investigate':'Discovery or mission detail',m.fact];
 if(/sample return/.test(type))return [
  ['Journey to '+world,planned?'Illustrative route for the announced sample-return goal.':'A simplified view of a spacecraft journey to the target world.'],
  ['Sampling sequence','See how a mission can collect, protect and prepare material for return.'],
  missionStage,detailStage
 ];
 if(/rover/.test(type))return [
  ['Approach '+world,'A simplified view of the journey to the mission destination.'],
  ['Rover operations','The model rover is shown travelling to a point of scientific interest.'],
  missionStage,detailStage
 ];
 if(/lander|impactor|precision land/.test(type))return [
  ['Approach the target','The scene illustrates a spacecraft closing in on its destination.'],
  [/impactor/.test(type)?'Impact experiment':'Landing sequence','A simplified model of the surface operation; the mission record below explains its actual result.'],
  missionStage,detailStage
 ];
 if(/orbiter|flyby|orbit/.test(type))return [
  ['Cruise through space','A simplified route toward '+world+' begins the mission sequence.'],
  [/flyby/.test(type)?'Pass the target':'Enter or follow an orbit','The spacecraft model follows a path around or past the target world.'],
  missionStage,detailStage
 ];
 if(/programme|program|series|mission/.test(type))return [
  ['Explore the mission family','This atlas entry may group related spacecraft or attempts.'],
  ['Compare the mission goals','The illustration uses a general spacecraft to help picture the exploration task.'],
  missionStage,detailStage
 ];
 return [
  ['Begin the '+world+' mission','A simplified view of the journey and exploration setting.'],
  ['Explore the mission activity','The model shows one possible way the mission type can investigate its target.'],
  missionStage,detailStage
 ];
}

function rodBetween(a,b,radius,material){
 const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),delta=new THREE.Vector3().subVectors(vb,va);
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,delta.length(),8),material);
 mesh.position.copy(va).add(vb).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return mesh;
}
function makeSolarArray(material){
 const group=new THREE.Group();
 for(let i=0;i<6;i++){const panel=new THREE.Mesh(new THREE.BoxGeometry(.28,.025,.42),material);panel.position.x=i*.3;group.add(panel);}
 const spine=new THREE.Mesh(new THREE.BoxGeometry(1.85,.045,.055),new THREE.MeshStandardMaterial({color:0xb9b9a6,metalness:.7,roughness:.3}));spine.position.set(.75,0,0);group.add(spine);
 return group;
}
function makeApolloVehicle(){
 const group=new THREE.Group(),silver=new THREE.MeshStandardMaterial({color:0xc5c8bf,metalness:.68,roughness:.32}),foil=new THREE.MeshStandardMaterial({color:0xb78650,metalness:.58,roughness:.43}),dark=new THREE.MeshStandardMaterial({color:0x334b52,metalness:.5,roughness:.28}),panel=new THREE.MeshStandardMaterial({color:0x1a4c66,metalness:.45,roughness:.32});
 const csm=new THREE.Group(),service=new THREE.Mesh(new THREE.CylinderGeometry(.39,.43,.88,12),foil);service.rotation.x=Math.PI/2;service.position.z=.3;csm.add(service);
 const cm=new THREE.Mesh(new THREE.ConeGeometry(.38,.58,12),silver);cm.rotation.x=-Math.PI/2;cm.position.z=-.39;csm.add(cm);
 const shield=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.09,12),new THREE.MeshStandardMaterial({color:0x3d3431,metalness:.2,roughness:.9}));shield.rotation.x=Math.PI/2;shield.position.z=-.67;csm.add(shield);
 const window=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),dark);window.scale.set(1,.72,.35);window.position.set(0,.18,-.5);csm.add(window);
 for(const s of [-1,1]){const wing=makeSolarArray(panel);wing.rotation.y=Math.PI/2;wing.position.set(s*.42,0,.25);csm.add(wing);}
 const dish=new THREE.Mesh(new THREE.SphereGeometry(.2,16,8,0,Math.PI*2,0,Math.PI/2),silver);dish.rotation.x=Math.PI;dish.position.set(0,.52,.38);csm.add(dish);
 csm.name='command';group.add(csm);
 const lm=new THREE.Group(),descent=new THREE.Mesh(new THREE.CylinderGeometry(.55,.68,.42,8),foil);descent.position.y=.22;lm.add(descent);
 const ascent=new THREE.Mesh(new THREE.BoxGeometry(.55,.42,.5),silver);ascent.position.set(0,.67,0);lm.add(ascent);
 const front=new THREE.Mesh(new THREE.BoxGeometry(.22,.18,.04),dark);front.position.set(0,.73,-.27);lm.add(front);
 for(const x of [-1,1])for(const z of [-1,1]){const leg=rodBetween([x*.2,.23,z*.18],[x*.56,-.18,z*.48],.035,silver);lm.add(leg);const pad=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.045,10),silver);pad.position.set(x*.56,-.2,z*.48);lm.add(pad);}
 lm.name='lunar-module';group.add(lm);
 return group;
}
function makeChandrayaanCraft(kind){
 const group=new THREE.Group(),gold=new THREE.MeshStandardMaterial({color:0xc79650,metalness:.55,roughness:.42}),white=new THREE.MeshStandardMaterial({color:0xd9ddd5,metalness:.28,roughness:.48}),blue=new THREE.MeshStandardMaterial({color:0x235b78,metalness:.48,roughness:.3}),dark=new THREE.MeshStandardMaterial({color:0x283b40,metalness:.45,roughness:.35});
 const orbiter=new THREE.Group(),bus=new THREE.Mesh(new THREE.BoxGeometry(.62,.48,.62),gold);orbiter.add(bus);
 const array=makeSolarArray(blue);array.scale.set(.85,.8,.8);array.position.x=.45;orbiter.add(array);
 const dish=new THREE.Mesh(new THREE.SphereGeometry(.22,16,8,0,Math.PI*2,0,Math.PI/2),white);dish.position.set(0,.36,.22);orbiter.add(dish);orbiter.name='orbiter';group.add(orbiter);
 if(kind!=='orbiter'){
  const lander=new THREE.Group(),shell=new THREE.Mesh(new THREE.CylinderGeometry(.42,.52,.56,8),white);shell.position.y=.6;lander.add(shell);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(.24,.37,.27,8),gold);top.position.y=1;lander.add(top);
  for(let i=0;i<4;i++){const a=i*Math.PI/2;lander.add(rodBetween([Math.cos(a)*.23,.42,Math.sin(a)*.23],[Math.cos(a)*.62,.05,Math.sin(a)*.62],.035,gold));const pad=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.04,10),white);pad.position.set(Math.cos(a)*.62,.02,Math.sin(a)*.62);lander.add(pad);}
  const p=makeSolarArray(blue);p.rotation.z=Math.PI/2;p.scale.set(.7,.7,.7);p.position.set(.55,.65,0);lander.add(p);lander.name='lander';group.add(lander);
 }
 if(kind==='rover'){
  const rover=new THREE.Group(),deck=new THREE.Mesh(new THREE.BoxGeometry(.48,.18,.4),gold);deck.position.y=.42;rover.add(deck);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(.035,.04,.38,8),white);mast.position.set(-.12,.7,0);rover.add(mast);
  const cam=new THREE.Mesh(new THREE.BoxGeometry(.18,.13,.16),dark);cam.position.set(-.12,.93,0);rover.add(cam);
  for(const x of [-1,0,1])for(const z of [-1,1]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.09,12),dark);wheel.name='rover-wheel';wheel.rotation.x=Math.PI/2;wheel.position.set(x*.24,.17,z*.28);rover.add(wheel);}
  rover.name='rover';rover.position.set(1.12,.02,0);group.add(rover);
 }
 if(kind==='orbiter'){const mip=new THREE.Group(),probe=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),white);mip.add(probe);const antenna=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.28,6),gold);antenna.position.y=.2;mip.add(antenna);mip.name='impact-probe';group.add(mip);}
 return group;
}
function makeOrionVehicle(){
 const group=new THREE.Group(),white=new THREE.MeshStandardMaterial({color:0xe0e1d9,metalness:.25,roughness:.52}),foil=new THREE.MeshStandardMaterial({color:0xb07f4e,metalness:.52,roughness:.43}),blue=new THREE.MeshStandardMaterial({color:0x214f68,metalness:.52,roughness:.3}),black=new THREE.MeshStandardMaterial({color:0x292c2c,metalness:.12,roughness:.9});
 const capsule=new THREE.Mesh(new THREE.ConeGeometry(.52,.84,12),white);capsule.position.y=.36;group.add(capsule);
 const heat=new THREE.Mesh(new THREE.CylinderGeometry(.51,.51,.12,12),black);heat.position.y=-.12;group.add(heat);
 const service=new THREE.Mesh(new THREE.CylinderGeometry(.38,.4,.66,12),foil);service.position.y=-.48;group.add(service);
 for(let i=0;i<4;i++){const p=makeSolarArray(blue);p.scale.set(.65,.65,.65);p.rotation.y=i*Math.PI/2;p.position.set(Math.cos(i*Math.PI/2)*.43,-.47,Math.sin(i*Math.PI/2)*.43);group.add(p);}
 const window=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),blue);window.scale.set(1,.75,.3);window.position.set(0,.5,-.4);group.add(window);
 return group;
}
function makeLunaNine(){
 const group=new THREE.Group(),shell=new THREE.MeshStandardMaterial({color:0xd6d3c5,metalness:.28,roughness:.58}),dark=new THREE.MeshStandardMaterial({color:0x253a3d,metalness:.48,roughness:.34}),gold=new THREE.MeshStandardMaterial({color:0xb99058,metalness:.5,roughness:.42});
 const pressureSphere=new THREE.Mesh(new THREE.SphereGeometry(.36,20,16),shell);pressureSphere.position.y=.25;group.add(pressureSphere);
 const instrumentDeck=new THREE.Mesh(new THREE.CylinderGeometry(.3,.32,.16,12),gold);instrumentDeck.position.y=.58;group.add(instrumentDeck);
 for(let i=0;i<4;i++){const a=i*Math.PI/2,antenna=new THREE.Mesh(new THREE.CylinderGeometry(.018,.025,.6,8),gold);antenna.position.set(Math.cos(a)*.25,.9,Math.sin(a)*.25);antenna.rotation.z=-Math.cos(a)*.45;antenna.rotation.x=Math.sin(a)*.45;group.add(antenna);}
 for(let i=0;i<4;i++){const a=i*Math.PI/2,petal=new THREE.Mesh(new THREE.BoxGeometry(.34,.06,.42),shell);petal.position.set(Math.cos(a)*.3,.08,Math.sin(a)*.3);petal.rotation.y=a;group.add(petal);}
 const camera=new THREE.Mesh(new THREE.CylinderGeometry(.08,.12,.17,10),dark);camera.position.y=.72;group.add(camera);
 return group;
}
function makeLunaOne(){
 const group=new THREE.Group(),metal=new THREE.MeshStandardMaterial({color:0xbfc0b6,metalness:.58,roughness:.4}),gold=new THREE.MeshStandardMaterial({color:0xd2a65c,metalness:.5,roughness:.42});
 const core=new THREE.Mesh(new THREE.SphereGeometry(.36,20,16),metal);group.add(core);
 for(let i=0;i<4;i++){const a=i*Math.PI/2,boom=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.82,8),gold);boom.position.set(Math.cos(a)*.38,.18,Math.sin(a)*.38);boom.rotation.z=Math.cos(a)*-.55;boom.rotation.x=Math.sin(a)*.55;group.add(boom);const tip=new THREE.Mesh(new THREE.SphereGeometry(.055,8,6),gold);tip.position.set(Math.cos(a)*.72,.42,Math.sin(a)*.72);group.add(tip);}
 const antenna=new THREE.Mesh(new THREE.ConeGeometry(.16,.28,12),gold);antenna.rotation.z=Math.PI;antenna.position.y=-.3;group.add(antenna);
 return group;
}
function makePerseverance(){
 const group=new THREE.Group(),bodymat=new THREE.MeshStandardMaterial({color:0xb5b7aa,metalness:.35,roughness:.54}),dark=new THREE.MeshStandardMaterial({color:0x252d2d,roughness:.86}),gold=new THREE.MeshStandardMaterial({color:0xb88448,metalness:.48,roughness:.45}),blue=new THREE.MeshStandardMaterial({color:0x304a50,metalness:.4,roughness:.38});
 const body=new THREE.Mesh(new THREE.BoxGeometry(1.12,.42,.84),bodymat);body.position.y=.64;group.add(body);
 const deck=new THREE.Mesh(new THREE.BoxGeometry(.8,.11,.74),gold);deck.position.y=.92;group.add(deck);
 const mast=new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,.62,10),bodymat);mast.position.set(-.28,1.3,0);group.add(mast);
 const head=new THREE.Mesh(new THREE.BoxGeometry(.46,.28,.35),blue);head.position.set(-.28,1.67,0);group.add(head);
 for(let i=0;i<3;i++){const cam=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),new THREE.MeshStandardMaterial({color:0x182b31,metalness:.6,roughness:.2}));cam.position.set(-.28+(i-1)*.13,1.67,-.2);group.add(cam);}
 const arm=rodBetween([.3,.64,-.32],[.75,.36,-.38],.045,bodymat);group.add(arm);
 for(const x of [-.4,0,.4])for(const z of [-1,1]){const hub=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.12,10),gold);hub.rotation.x=Math.PI/2;hub.position.set(x,.34,z*.46);group.add(hub);const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.17,16),dark);wheel.name='rover-wheel';wheel.rotation.x=Math.PI/2;wheel.position.set(x,.34,z*.59);group.add(wheel);for(let k=0;k<8;k++){const lug=new THREE.Mesh(new THREE.BoxGeometry(.04,.04,.19),gold);lug.position.set(x+Math.cos(k*Math.PI/4)*.23,.34+Math.sin(k*Math.PI/4)*.23,z*.59);group.add(lug);}}
 const heli=new THREE.Group(),hull=new THREE.Mesh(new THREE.BoxGeometry(.36,.15,.3),gold);heli.add(hull);
 const mast2=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.35,8),bodymat);mast2.position.y=.22;heli.add(mast2);
 const blade=new THREE.Mesh(new THREE.BoxGeometry(.9,.025,.055),dark);blade.name='rotor-blade';blade.position.y=.4;heli.add(blade);
 const legmat=new THREE.MeshStandardMaterial({color:0x313632,metalness:.5,roughness:.4});for(const s of [-1,1]){const leg=rodBetween([s*.12,-.04,0],[s*.24,-.22,0],.018,legmat);heli.add(leg);}
 heli.name='ingenuity';heli.position.set(1.55,.38,-.15);group.add(heli);return group;
}
function makeFlagship(mission){
 if(!mission.featured)return null;
 const n=mission.name.toLowerCase();
 if(n==='apollo 9'||n==='apollo 10'||n==='apollo 11')return makeApolloVehicle();
 if(n==='luna 9')return makeLunaNine();
 if(n==='chandrayaan-1')return makeChandrayaanCraft('orbiter');
 if(n==='chandrayaan-2')return makeChandrayaanCraft('lander');
 if(n==='chandrayaan-3')return makeChandrayaanCraft('rover');
 if(n==='artemis i'||n==='artemis ii')return makeOrionVehicle();
 if(n==='luna 1')return makeLunaOne();
 if(n==='perseverance / ingenuity')return makePerseverance();
 if(n==='chang’e 3 / yutu'||n==='chang’e 4 / yutu-2'||n==='chang’e 5'||n==='chang’e 6'||n==='selene / kaguya'||n==='mars express'||n==='mars orbiter mission'||n==='hope / al amal'||n==='tianwen-1 / zhurong'||n==='danuri'||n==='slim'||n==='im-1 / odysseus'||n==='blue ghost mission 1')return makeChandrayaanCraft(/yutu|zhurong|odysseus|blue ghost|slim/.test(n)?'rover':'orbiter');
 return null;
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
 const type=mission.type.toLowerCase(),name=mission.name.toLowerCase(),apollo9=name==='apollo 9',apollo10=name==='apollo 10',apollo11=name==='apollo 11',chandrayaan2=name==='chandrayaan-2',chandrayaan3=name==='chandrayaan-3',artemis=/^artemis (?:i|ii)$/.test(name),isFlyby=/flyby/.test(type)||name==='luna 1'||name==='artemis ii',isOrbital=(/orbiter|orbit/.test(type)||apollo9||apollo10||(artemis&&name!=='artemis ii'))&&!isFlyby&&!chandrayaan2&&!chandrayaan3,isSpaceScene=isOrbital||isFlyby,isReturn=/sample return/.test(type);
 container.innerHTML='<canvas class="mission-demo-canvas" aria-label="Interactive three-dimensional illustration of '+mission.name.replace(/[&<>"']/g,'')+'"></canvas><div class="mission-demo-hint">DRAG TO ROTATE · SCROLL TO ZOOM · SCALE SIMPLIFIED</div>';
 const canvas=container.querySelector('canvas'),renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(container.clientWidth,container.clientHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x111f24,.025);
 const camera=new THREE.PerspectiveCamera(37,container.clientWidth/container.clientHeight,.1,100);camera.position.set(4,3.3,8);
 scene.add(new THREE.HemisphereLight(0xc7d9d8,0x493a31,1.65));
 const key=new THREE.DirectionalLight(0xffe7c4,3.1);key.position.set(-4,6,5);key.castShadow=true;key.shadow.mapSize.set(512,512);key.shadow.camera.near=.1;key.shadow.camera.far=30;key.shadow.camera.left=-10;key.shadow.camera.right=10;key.shadow.camera.top=10;key.shadow.camera.bottom=-10;scene.add(key);
 const rim=new THREE.DirectionalLight(0x6ca2b2,2.1);rim.position.set(5,2,-5);scene.add(rim);addStars(scene);
 const worldColor=mission.world==='Mars'?0xa44d32:0x969b96;
 const planetGroup=new THREE.Group();scene.add(planetGroup);
 const planetMaterial=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.98,metalness:0});
 const planet=new THREE.Mesh(new THREE.SphereGeometry(2.05,48,32),planetMaterial);planetGroup.add(planet);
 let planetTexture=null;new THREE.TextureLoader().load('./assets/'+mission.world.toLowerCase()+'.jpg',texture=>{if(disposed){texture.dispose();return;}planetTexture=texture;texture.colorSpace=THREE.SRGBColorSpace;planetMaterial.map=texture;planetMaterial.needsUpdate=true;});
 const surface=new THREE.Mesh(new THREE.PlaneGeometry(24,16),new THREE.MeshStandardMaterial({color:worldColor,roughness:1,metalness:0}));surface.rotation.x=-Math.PI/2;surface.position.y=-1.45;surface.receiveShadow=true;scene.add(surface);
 const randomSeed=(mission.name.length*971+mission.year||193)*53;
 let seed=randomSeed>>>0;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const rockMat=new THREE.MeshStandardMaterial({color:mission.world==='Mars'?0x80503e:0x727a76,roughness:1});
 for(let i=0;i<26;i++){
  const size=.07+rand()*.24,rock=new THREE.Mesh(new THREE.DodecahedronGeometry(size,0),rockMat);rock.castShadow=true;rock.receiveShadow=true;rock.visible=!isSpaceScene;
  rock.position.set((rand()-.5)*10,-1.36+size*.45,(rand()-.5)*6-1.3);rock.rotation.set(rand()*2,rand()*2,rand()*2);scene.add(rock);
 }
 for(let i=0;i<7;i++){const ridge=new THREE.Mesh(new THREE.DodecahedronGeometry(.9+rand()*.5,0),rockMat);ridge.scale.set(1.25,.65,.75);ridge.position.set(-7+i*2.3,-1.23,-6.15);ridge.rotation.y=rand()*2;ridge.castShadow=true;ridge.receiveShadow=true;ridge.visible=!isSpaceScene;scene.add(ridge);}
 const target=new THREE.Group();target.position.set(2.3,-1.38,-.1);scene.add(target);
 const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.48,8),new THREE.MeshStandardMaterial({color:0xc7dc9b,emissive:0x466b37,emissiveIntensity:1.1}));beacon.position.y=.24;target.add(beacon);
 const halo=new THREE.Mesh(new THREE.TorusGeometry(.36,.028,8,32),new THREE.MeshBasicMaterial({color:0xdde9a5}));halo.rotation.x=Math.PI/2;halo.position.y=.03;target.add(halo);
 const lander=makeLander();lander.position.set(.4,-1.43,-.4);scene.add(lander);
 const rover=makeRover();rover.group.position.set(-2.1,-1.43,.3);scene.add(rover.group);
 const orbitRing=new THREE.Mesh(new THREE.TorusGeometry(2.65,.012,8,96),new THREE.MeshBasicMaterial({color:0x8bd4cf,transparent:true,opacity:.72}));orbitRing.rotation.x=.48;planetGroup.add(orbitRing);
 const satellite=new THREE.Group();
 const bus=new THREE.Mesh(new THREE.BoxGeometry(.42,.36,.38),new THREE.MeshStandardMaterial({color:0xd9dfd4,metalness:.58,roughness:.3}));satellite.add(bus);
 const panelMat=new THREE.MeshStandardMaterial({color:0x37728b,metalness:.5,roughness:.35});
 for(const side of [-1,1]){const panel=new THREE.Mesh(new THREE.BoxGeometry(.72,.045,.4),panelMat);panel.position.x=side*.59;satellite.add(panel);}
 const ant=new THREE.Mesh(new THREE.ConeGeometry(.17,.26,16),new THREE.MeshStandardMaterial({color:0xf0c477,metalness:.25,roughness:.3}));ant.rotation.z=Math.PI;ant.position.y=-.27;satellite.add(ant);planetGroup.add(satellite);
 const approachCraft=satellite.clone(true);scene.add(approachCraft);
 const sample=new THREE.Mesh(new THREE.OctahedronGeometry(.2,0),new THREE.MeshStandardMaterial({color:0xd4c396,metalness:.12,roughness:.72}));sample.position.set(1.95,-1.23,.18);scene.add(sample);
 const returnCapsule=new THREE.Group();
 const capsuleBody=new THREE.Mesh(new THREE.ConeGeometry(.24,.62,8),new THREE.MeshStandardMaterial({color:0xdadbd0,metalness:.25,roughness:.4}));capsuleBody.rotation.z=Math.PI;returnCapsule.add(capsuleBody);
 const capsuleBase=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.11,12),new THREE.MeshStandardMaterial({color:0xc36a43,metalness:.2,roughness:.52}));capsuleBase.position.y=-.3;returnCapsule.add(capsuleBase);scene.add(returnCapsule);
 const moonEarth=new THREE.Mesh(new THREE.SphereGeometry(.28,24,18),new THREE.MeshStandardMaterial({color:0x4b88a2,roughness:.75,emissive:0x123044,emissiveIntensity:.25}));moonEarth.position.set(-3.5,2.3,-4.6);moonEarth.visible=mission.world==='Moon'&&!apollo9;scene.add(moonEarth);
 const earthCanvas=document.createElement('canvas');earthCanvas.width=1024;earthCanvas.height=512;
 const earthCtx=earthCanvas.getContext('2d'),ocean=earthCtx.createLinearGradient(0,0,0,512);ocean.addColorStop(0,'#17486f');ocean.addColorStop(.5,'#2779a4');ocean.addColorStop(1,'#123552');earthCtx.fillStyle=ocean;earthCtx.fillRect(0,0,1024,512);
 earthCtx.strokeStyle='rgba(151,205,219,.12)';earthCtx.lineWidth=1;
 for(let y=64;y<512;y+=64){earthCtx.beginPath();earthCtx.moveTo(0,y);earthCtx.lineTo(1024,y);earthCtx.stroke();}
 for(let x=64;x<1024;x+=64){earthCtx.beginPath();earthCtx.moveTo(x,0);earthCtx.lineTo(x,512);earthCtx.stroke();}
 const continents=[
  [[.08,.24],[.12,.17],[.19,.13],[.26,.18],[.30,.25],[.27,.31],[.23,.34],[.24,.40],[.19,.48],[.15,.44],[.13,.36],[.09,.33]],
  [[.24,.48],[.30,.46],[.35,.52],[.37,.61],[.35,.70],[.32,.81],[.29,.90],[.26,.81],[.24,.70],[.22,.58]],
  [[.43,.24],[.48,.19],[.53,.21],[.55,.27],[.51,.31],[.47,.29]],
  [[.46,.34],[.53,.31],[.60,.35],[.64,.43],[.61,.55],[.58,.66],[.55,.77],[.51,.73],[.49,.62],[.46,.52],[.43,.43]],
  [[.54,.20],[.62,.16],[.70,.19],[.76,.17],[.85,.22],[.92,.28],[.89,.35],[.82,.38],[.77,.43],[.70,.40],[.66,.35],[.60,.33],[.56,.28]],
  [[.62,.40],[.67,.43],[.70,.50],[.67,.57],[.64,.53]],
  [[.74,.63],[.80,.62],[.85,.66],[.84,.73],[.80,.77],[.76,.73]],
  [[.07,.12],[.12,.10],[.14,.14],[.12,.18],[.08,.17]]
 ];
 for(const poly of continents){earthCtx.beginPath();poly.forEach(([x,y],i)=>{const px=x*1024,py=y*512;i?earthCtx.lineTo(px,py):earthCtx.moveTo(px,py);});earthCtx.closePath();earthCtx.fillStyle='#6c9667';earthCtx.fill();earthCtx.strokeStyle='#9bb981';earthCtx.lineWidth=2;earthCtx.stroke();}
 earthCtx.fillStyle='#d5e0dc';earthCtx.beginPath();earthCtx.moveTo(0,486);earthCtx.lineTo(110,475);earthCtx.lineTo(230,488);earthCtx.lineTo(360,478);earthCtx.lineTo(500,490);earthCtx.lineTo(650,477);earthCtx.lineTo(790,488);earthCtx.lineTo(920,476);earthCtx.lineTo(1024,485);earthCtx.lineTo(1024,512);earthCtx.lineTo(0,512);earthCtx.closePath();earthCtx.fill();
 const earthMap=new THREE.CanvasTexture(earthCanvas);earthMap.colorSpace=THREE.SRGBColorSpace;
 const earthGroup=new THREE.Group(),earthSurface=new THREE.Mesh(new THREE.SphereGeometry(1.78,64,48),new THREE.MeshStandardMaterial({color:0xffffff,map:earthMap,roughness:.88,metalness:0,emissive:0x071522,emissiveIntensity:.12}));earthGroup.add(earthSurface);
 const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.82,48,32),new THREE.MeshBasicMaterial({color:0x4ca9d4,transparent:true,opacity:.1,side:THREE.BackSide}));earthGroup.add(atmosphere);
 const clouds=new THREE.Mesh(new THREE.SphereGeometry(1.805,36,24),new THREE.MeshStandardMaterial({color:0xe8f1eb,transparent:true,opacity:.1,roughness:1}));earthGroup.add(clouds);earthGroup.visible=apollo9;scene.add(earthGroup);
 const flagship=makeFlagship(mission);if(flagship){flagship.scale.setScalar((apollo9||apollo10||apollo11)?0.46:artemis?0.42:(name==='luna 1'||name==='chandrayaan-1')?0.72:1.05);scene.add(flagship);}


 const artemisFlybyCurve=name==='artemis ii'?new THREE.CatmullRomCurve3([new THREE.Vector3(-4.7,.72,.1),new THREE.Vector3(-3.45,.5,-1.3),new THREE.Vector3(-2.35,.15,-2.05),new THREE.Vector3(-1.15,-.25,-2.62),new THREE.Vector3(0,-.4,-2.82),new THREE.Vector3(1.15,-.25,-2.62),new THREE.Vector3(2.35,.15,-2.05),new THREE.Vector3(3.45,.5,-1.3),new THREE.Vector3(4.7,.72,.1)],false,'centripetal'):null;
 const artemisTrail=artemisFlybyCurve?new THREE.Line(new THREE.BufferGeometry().setFromPoints(artemisFlybyCurve.getPoints(120)),new THREE.LineBasicMaterial({color:0x79d8e8,transparent:true,opacity:.72})):null;if(artemisTrail)scene.add(artemisTrail);
 let stepStartedAt=performance.now()*.001;
 const resize=()=>{const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
 const onDown=e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);};
 const onMove=e=>{if(!dragging)return;rotY+=(e.clientX-lastX)*.008;rotX=clamp(rotX+(e.clientY-lastY)*.006,-.65,.65);lastX=e.clientX;lastY=e.clientY;};
 const onUp=()=>{dragging=false;};
 const onWheel=e=>{e.preventDefault();zoom=clamp(zoom-e.deltaY*.001,.72,1.5);};
 canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',onUp);canvas.addEventListener('wheel',onWheel,{passive:false});
 const observer=new ResizeObserver(resize);observer.observe(container);

 const touchdownStep=Math.max(1,steps.findIndex(s=>/soft landing|land and explore|land and deploy|reach the target/i.test(s[0])));
 const landerVisibleFrom=Math.max(1,touchdownStep-1);
 let landerTargetY=-1.43;
 function showStep(){
  stepStartedAt=performance.now()*.001;
  const s=steps[step];ui.label.textContent=s[0];ui.copy.textContent=s[1];ui.progress.textContent='STEP '+(step+1)+' OF '+steps.length;
  ui.previous.disabled=step===0;ui.next.textContent=step===steps.length-1?'Replay mission ↻':'Next step →';
  landerTargetY=step<touchdownStep?0.8:-1.43;
  approachCraft.visible=!isOrbital&&step<landerVisibleFrom;lander.visible=!isOrbital&&step>=landerVisibleFrom;rover.group.visible=!isOrbital&&step>=touchdownStep&&(/rover/.test(type)||steps.some(x=>/rover/i.test(x[0])));
  sample.visible=/sample/.test(type)&&step>=steps.length-2;
  returnCapsule.visible=isReturn&&step===steps.length-1;
  satellite.visible=!flagship&&(isSpaceScene||step===steps.length-1);orbitRing.visible=isOrbital;
  earthGroup.visible=apollo9;
  if(isSpaceScene){planetGroup.visible=!apollo9;surface.visible=false;target.visible=false;rover.group.visible=false;lander.visible=false;}
  else{planetGroup.visible=false;surface.visible=true;target.visible=true;}
  if(artemisTrail)artemisTrail.visible=name==='artemis ii'&&step===1;
  if(flagship){
   flagship.visible=true;approachCraft.visible=false;lander.visible=false;rover.group.visible=false;returnCapsule.visible=false;sample.visible=false;
   const command=flagship.getObjectByName('command'),lm=flagship.getObjectByName('lunar-module'),probe=flagship.getObjectByName('impact-probe');
   if(apollo9){
    planetGroup.visible=false;earthGroup.visible=true;surface.visible=false;target.visible=false;
    if(command)command.position.set(-2.65,.25,.12);
    if(lm){lm.visible=true;lm.position.set(step===0?-2.92:step===1?2.65:step===2?-1.35:-2.92,step===1?.15:.25,step===1?.35:.12);}
   }else if(apollo10){
    planetGroup.visible=true;surface.visible=false;target.visible=false;
    if(command)command.position.set(step>=2?3.05:2.85,.48,.2);
    if(lm){lm.visible=step>=1;lm.position.set(step===1?-.9:step===2?-.75:-.55,step===2?2.08:2.15,step===2?.2:.1);}
   }else if(apollo11){
    planetGroup.visible=false;surface.visible=true;target.visible=true;
    if(command)command.position.set(step>=2?2.45:2.15,step===2?1.15:.8,-1.1);
    if(lm){lm.visible=step>=1&&step<3;lm.position.set(step===1?.1:step===2?.45:.25,step===1?1.1:-1.2,-.15);}
   }else if(name==='chandrayaan-1'){
    planetGroup.visible=true;surface.visible=false;target.visible=false;
    flagship.position.set(2.45,.45,0);if(probe){probe.visible=step>=2;probe.position.set(.6,step===2?-.55:-1.1,0);}
   }else if(chandrayaan2){
    planetGroup.visible=false;surface.visible=true;target.visible=true;
    const c2land=flagship.getObjectByName('lander'),orb=flagship.getObjectByName('orbiter');if(orb){orb.position.set(-2.3,.9,-.2);orb.visible=true;}if(c2land){c2land.position.set(step<2?-.2:step===2?.55:1.45,step<2?1.8:step===2?.45:1.5,.05);c2land.visible=true;}
   }else if(chandrayaan3){
    planetGroup.visible=false;surface.visible=true;target.visible=true;
    const c3land=flagship.getObjectByName('lander'),c3rover=flagship.getObjectByName('rover');if(c3land){c3land.position.set(-.45,step<2?1.8:-1.43,-.1);c3land.visible=step<3;}if(c3rover){c3rover.visible=step>=3;c3rover.position.x=step===3?.55:1.35;}
   }else if(apollo9||apollo10||apollo11){
    /* Positioning is handled in the mission specific branches above. */
   }else if(name==='luna 9'){
    planetGroup.visible=false;surface.visible=true;target.visible=true;flagship.position.set(0,step<2?.55:-1.43,0);flagship.rotation.z=step===1?.12:0;
   }else if(name==='luna 1'){
    planetGroup.visible=true;surface.visible=false;target.visible=false;flagship.position.set(step<2?2.35:3.3,.7,.15);
   }else if(name==='artemis ii'){
    planetGroup.visible=true;surface.visible=false;target.visible=false;flagship.position.copy(artemisFlybyCurve.getPoint(step===0?0:step===1?0:1));
   }else if(name==='perseverance / ingenuity'){
    planetGroup.visible=false;surface.visible=true;target.visible=true;flagship.position.set(-1.35,-1.43,.1);
   }else if(isOrbital){
    flagship.position.set(2.45,.7,.15);
   }else{
    flagship.position.set(2.1,-1.43,.15);
   }
  }
 }
 const previous=()=>{step=Math.max(0,step-1);showStep();};
 const next=()=>{step=step===steps.length-1?0:step+1;showStep();};
 ui.previous.addEventListener('click',previous);ui.next.addEventListener('click',next);showStep();resize();
 const animate=()=>{
  if(disposed)return;frame=requestAnimationFrame(animate);const t=performance.now()*.001;
  planetGroup.rotation.y=t*.065;earthGroup.rotation.y=t*.045;if(flagship){flagship.rotation.y=(apollo9||apollo10||artemis?0.12:0.03)+Math.sin(t*.35)*.025;if(name==='luna 1'){const pass=(t*.055)%1;flagship.position.set(-3.6+pass*7,2.5+Math.sin(pass*Math.PI)*.2,.2);}if(name==='artemis ii'&&step===1){const progress=clamp((t-stepStartedAt)/11,0,1),eased=progress*progress*(3-2*progress);flagship.position.copy(artemisFlybyCurve.getPoint(eased));const tangent=artemisFlybyCurve.getTangent(eased);flagship.rotation.y=Math.atan2(tangent.x,tangent.z);}if(apollo9||apollo10){flagship.position.set(0,0,0);flagship.rotation.y=t*.14;}else if((artemis&&name==='artemis i'||name==='chandrayaan-1')&&step<steps.length){const radius=2.78;flagship.position.set(Math.cos(t*.14)*radius,.38+Math.sin(t*.14)*.35,Math.sin(t*.14)*radius);}if(name==='perseverance / ingenuity'){flagship.position.x=-1.35+(step/(steps.length-1))*2.1;flagship.traverse(o=>{if(o.name==='rover-wheel')o.rotation.z=-t*1.8;});const ing=flagship.getObjectByName('ingenuity');if(ing){const blade=ing.getObjectByName('rotor-blade');if(blade)blade.rotation.y=t*12;ing.position.y=.38+(step>=2?Math.sin(t*4)*.18:0);}}if(chandrayaan3){const r=flagship.getObjectByName('rover');if(r)r.traverse(o=>{if(o.name==='rover-wheel')o.rotation.z=-t*1.2;});}}
  if(isFlyby&&!flagship){const path=(t*.24)%1;satellite.position.set(-3.5+path*7,2.5+Math.sin(path*Math.PI)*.18,0);}else satellite.position.set(Math.cos(t*.34)*2.12,Math.sin(t*.34)*.78,Math.sin(t*.34)*1.35);
  satellite.rotation.y=-t*.34;
  if(!isOrbital){
  const travel=step/(steps.length-1);rover.group.position.x=-2.1+travel*3.1;rover.group.rotation.y=.12+travel*.18;
   rover.wheels.forEach(w=>w.rotation.z=-travel*2.2);
   target.rotation.y=t*.25;halo.material.opacity=.55+Math.sin(t*2.4)*.25;
   lander.position.y=THREE.MathUtils.damp(lander.position.y,landerTargetY,.8,1/60);lander.rotation.y=Math.sin(t*.4)*.04;
   if(approachCraft.visible){approachCraft.position.set(-2.1+Math.sin(t*.6)*.14,1.25+Math.sin(t*1.4)*.08,.8);approachCraft.rotation.y=t*.12;}
  }
  if(returnCapsule.visible)returnCapsule.position.set(.4,-.9+Math.sin(t*1.6)*.65,-.4);
  const yaw=.464+rotY,distance=(flagship?9.8:13.5)/zoom;camera.position.set(distance*Math.sin(yaw),3.3+rotX*3,distance*Math.cos(yaw));camera.lookAt(0,-.05,0);
  renderer.render(scene,camera);
 };
 animate();
 return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointermove',onMove);canvas.removeEventListener('pointerup',onUp);canvas.removeEventListener('pointercancel',onUp);canvas.removeEventListener('wheel',onWheel);ui.previous.removeEventListener('click',previous);ui.next.removeEventListener('click',next);planetTexture?.dispose();renderer.dispose();scene.traverse(o=>{o.geometry?.dispose?.();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose?.();});};
}

