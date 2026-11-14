// Fictional opening challenges, grounded in the trainer's resource trade-offs.
const variants={
 Moon:[
  {name:'Long-shadow power check',power:'A long shadow reaches the solar panels sooner than planned. The habitat and rover still need power. How will your team protect the reserve?',eng:'Inspect the panel and protect essential circuits.',sci:'Check the habitat air and water reserve.',food:'The greenhouse will receive less light while the panels are shaded. How will the crew start its crop? ',small:'Start a small crop with timed lights',large:'Plant extra trays using stored power'},
  {name:'Cold battery warning',power:'A cold battery is supplying less power in this training scenario. The team needs heat for the habitat and enough energy for a safe return. What should you do first?',eng:'Check the cold battery and reserve.',sci:'Watch habitat air and temperature readings.',food:'A cold work period makes it harder to warm the greenhouse. Choose how much food to grow while protecting heat and water.',small:'Keep one protected tray warm',large:'Warm and plant more trays'},
  {name:'Panel connection fault',power:'A solar-panel connection shows an uncertain reading near the lunar outpost. The crew must check it safely without interrupting life support. What is the plan?',eng:'Isolate and inspect the affected panel circuit.',sci:'Record a baseline and watch the life-support meter.',food:'The power check leaves less time for gardening. Choose a crop plan that keeps some energy for the crew.',small:'Set up one low-power crop tray',large:'Prepare several trays and use more power'}
 ],
 Mars:[
  {name:'Dust on the array',power:'Dust is covering the solar panels and reducing their output in this training scenario. The habitat and rover both need power. How should the crew respond?',eng:'Check the dusty panels and protect essential circuits.',sci:'Record the power reading and check the air loop.',food:'Dusty conditions limit solar power for greenhouse lights. How much food should the crew start growing?',small:'Start a small crop with timed lights',large:'Plant extra trays using stored power'},
  {name:'Cold morning battery',power:'A cold Martian morning makes a training battery less effective. Your team needs heat for the habitat and enough energy to return safely. What comes first?',eng:'Check the cold battery and protect the reserve.',sci:'Watch habitat air and temperature readings.',food:'A cold work period makes greenhouse heating more demanding. Choose a growing plan while protecting heat and water.',small:'Keep one protected tray warm',large:'Warm and plant more trays'},
  {name:'Array connector warning',power:'One power-array connection gives an uncertain reading. The team must inspect it safely while dust is in the forecast. What is the best first plan?',eng:'Isolate and inspect the affected panel circuit.',sci:'Log the power baseline and watch habitat systems.',food:'A power check leaves less energy for greenhouse work. Choose how many crop trays to prepare.',small:'Set up one low-power crop tray',large:'Prepare several trays and use more power'}
 ]
};
const option=(label,lesson,power=0,water=0,food=0,effect='')=>({label,lesson,cost:{power,water,food},effect});
export const SCENARIO_COUNT=3;
export function validScenario(id){return Number.isInteger(id)&&id>=0&&id<SCENARIO_COUNT;}
export function applyOpeningScenario(missions,world,level,id){
 const v=(variants[world]||variants.Moon)[validScenario(id)?id:0];
 const power=missions[1],food=missions[2];
 power.title=v.name;power.brief=v.power;
 power.choices=[option('Protect the habitat and check the fault','Keep essential systems running, isolate the affected circuit when needed and check the reserve.',-5,0,0,'Life support protected; investigation takes time.'),option('Use extra power to keep all tools running','Science can continue briefly, but the reserve falls while the team investigates.',-12,0,0,'More work now; less backup power.')];
 if(level==='pro')power.choices.push(option('Move the rover toward a better-lit work area','Travel may improve access to light or equipment, but it spends power and water; a benefit is not guaranteed.',-10,-3,0,'Possible operating advantage; tighter return reserve.'));
 food.brief=v.food;
 food.choices=[option(v.small,'One small crop uses some power and water now. Stored food supports the crew while the plants grow.',-3,-5,0,'Small crop; lower initial resource use.'),option(v.large,'More trays need more water and power. A future harvest is possible, but food is not immediate.',-7,-10,0,'Larger crop plan; tighter reserves today.')];
 if(level==='pro')food.choices.push(option('Pause new planting and use stored meals','Save water and power now, but use stored food and delay future crops.',0,0,-8,'Preserve power and water; stored food decreases.'));
 return missions;
}
export function openingDuty(world,id){const index=validScenario(id)?id:0,v=(variants[world]||variants.Moon)[index];const actions=world==='Mars'?[['Inspect dust and protect habitat power','Log panel output and check air'],['Check battery warmth and reserve','Check cabin temperature and air'],['Isolate the connector and protect the reserve','Log the baseline and watch life support']]:[['Check the shadow and protect habitat power','Check the habitat air and water reserve'],['Check battery warmth and reserve','Check cabin temperature and air'],['Isolate the connector and protect the reserve','Log the baseline and watch life support']];return {...v,engSafe:actions[index][0],sciSafe:actions[index][1]};}
