// Each group contains five questions, progressing from basics to mission trade-offs.
const blocks = [
[
['What does an astronaut need to breathe?','Air','Moon dust','Sunlight','Astronauts need breathable air inside a habitat or spacesuit.'],
['What supplies power to a solar panel?','Sunlight','Rocks','Radio messages','Solar panels convert light into electrical energy.'],
['What does a rover help the crew do?','Explore the surface','Make a planet bigger','Stop the Sun','A rover carries people or instruments across the surface.'],
['What do plants need to grow?','Water and light','Only rocks','Only radio signals','Plants need water, light, nutrients and suitable conditions.'],
['Why does the crew need a habitat?','To have a protected living space','To make the Moon shine','To remove all craters','A habitat protects the crew and supports living and working.']
],
[
['Who helps manage power and equipment in the trainer?','The Engineer','The mission map','A rock','The Engineer role works on power and equipment.'],
['Who helps study and protect samples?','The Scientist','The solar panel','The crater','The Scientist role helps examine samples and evidence.'],
['What can block a solar panel’s sunlight on the Moon?','A crater’s shadow','A sample label','A text message','Terrain and shadows can block sunlight from reaching panels.'],
['What can cover solar panels on Mars?','Dust','Ocean waves','Forest leaves','Dust can reduce the light reaching solar panels.'],
['What does the message dish help the crew do?','Send information','Grow food instantly','Make oxygen from rocks instantly','The dish represents the crew’s communication system.']
],
[
['What should you do before touching a sample?','Use clean tools','Mix it with other dirt','Remove its label','Clean tools help avoid contaminating the sample.'],
['Why save rover power?','The crew needs energy to return','It changes the planet’s colour','It turns rocks into food','A return reserve helps the crew get back safely.'],
['What should be done if habitat pressure falls?','Check and repair the leak safely','Open the hatch immediately','Ignore the warning','The trainer asks the crew to isolate the leak, repair it and check pressure.'],
['What can a crater wall do to a radio signal?','Block its path','Make the message into food','Stop all sunlight on Earth','A radio path can be blocked by terrain.'],
['Do seeds give the crew food immediately?','No, plants need time to grow','Yes, instantly','Only on Mars','Growing food takes time and uses resources.']
],
[
['Which mission first landed people on the Moon?','Apollo 11','Chandrayaan-3','Curiosity','Apollo 11 landed astronauts on the Moon in 1969.'],
['What did the Chandrayaan-3 mission include?','A lander and rover','A crewed Mars station','A submarine','India’s Chandrayaan-3 included the Vikram lander and Pragyan rover.'],
['Which rover studies rocks in Gale Crater on Mars?','Curiosity','Apollo 11','LCROSS','Curiosity investigates rocks and past environments in Gale Crater.'],
['What did LCROSS investigate?','Material from a shadowed lunar crater','Mars ocean fish','The Sun’s surface by landing','LCROSS examined material thrown from Cabeus crater for water-related clues.'],
['What is Perseverance exploring?','Rocks in Jezero Crater on Mars','The bottom of Earth’s oceans','The surface of Venus','Perseverance studies the Jezero area and collects samples.']
],
[
['Why might a crew scan from orbit first?','To compare promising places and routes','To prove every rock contains ice','To remove all dust','Orbital observations help plan where to investigate.'],
['Does a cold, dark crater prove useful ice is easy to reach?','No, the crew needs more measurements','Yes, always','Only if the crater is large','A cold shadow is a clue; the amount and accessibility remain uncertain.'],
['Which site has an ancient river delta in the trainer?','Jezero','Shackleton','Haworth','Jezero’s delta preserves clues about Mars’s ancient environment.'],
['Why use a relay?','To help a message reach its destination','To create instant food','To make gravity disappear','A relay can pass signals when the direct path is difficult.'],
['Why label a sample?','To remember where it came from','To make it heavier','To turn it into water','Location and handling information give a sample context.']
],
[
['Dust is reducing solar output. What is a sensible first goal?','Protect essential systems and check the panels','Run every instrument at full power','Ignore the power meter','The crew needs a power reserve and a safe inspection plan.'],
['The greenhouse is short of water. What should the crew check?','Water flow to the plants','The colour of the Moon','The mission’s title','The trainer asks players to check the water loop and plants.'],
['What should a Scientist do after the Engineer repairs a seal?','Check whether pressure stabilises','Open every hatch','Discard the gauge','A reading after repair helps verify whether the fix worked.'],
['What does the supply display help players monitor?','Power, water and food','Only the rover’s colour','The number of stars in space','The trainer uses simplified supply indicators.'],
['What does a green route beacon help a rover crew find?','The science destination','A shortcut to Earth','A new atmosphere','The beacon marks a target in the training scene.']
],
[
['What can a rock at Jezero help scientists study?','Ancient Martian environments','Today’s guaranteed drinking water supply','A present-day ocean beach','Ancient river deposits can preserve environmental clues.'],
['What did Ingenuity demonstrate on Mars?','Powered flight in the Martian atmosphere','A crewed lunar landing','Growing a forest','Ingenuity demonstrated powered flight on another planet.'],
['Was Artemis I a crewed flight?','No, it was an uncrewed test','Yes, four astronauts landed','Yes, astronauts walked on Mars','Artemis I tested Orion without a crew aboard.'],
['What did Pragyan do during Chandrayaan-3?','Explore the lunar surface as a rover','Orbit Mars carrying people','Fly through Jupiter’s clouds','Pragyan was the rover carried by the Vikram lander.'],
['Why study more than one mission in the atlas?','Different missions answer different questions','All missions do exactly the same work','Only crewed missions collect information','Orbiters, landers, rovers and crewed missions have different goals.']
],
[
['The rover finds a rock. What preserves its scientific value?','Record its location and keep it clean','Remove its label before testing','Mix it with another sample','A clean, labelled sample retains information about its origin.'],
['A plant tray is wilting in the trainer. What should the Scientist check?','Water flow and plant condition','Whether the rover has a new paint colour','The number of atlas cards','The trainer’s dust scenario includes checking plants and the water loop.'],
['What is a safe way to inspect a faulty power circuit?','Isolate it before checking a connector','Touch the connector while it is live','Use more power without inspecting it','The trainer teaches isolation before inspecting electrical connections.'],
['Why does a Mars crew need a plan while waiting for Earth?','Radio replies take time','Earth cannot receive any message','Mars rotates around the Moon','The large distance means radio messages are not instant.'],
['A scan suggests buried ice. What is still unknown?','Local depth and accessibility','Whether the planet exists','Whether rocks have mass','Orbital evidence does not automatically show local depth or ease of access.']
],
[
['What is the purpose of an airlock?','Help the crew move outside while protecting habitat air','Create food without plants','Make a rover fly','An airlock separates the habitat from the outside during exit and entry.'],
['What does the lab’s sample comparison teach?','Compare readings and record uncertainty','Declare life from one positive signal','Treat practice results as real measurements','The results are fictional practice indicators, not proof of life or usable water.'],
['What does a simulated positive water-related indicator prove?','Only that the game showed a practice signal','That usable water is available','That life was discovered','The trainer’s results are fictional and do not establish water or life.'],
['Why might a lit ridge be useful near a dark crater?','It may help power and access','It guarantees the crater is full of ice','It removes the need for communication','A brighter route may help operations near a cold prospect.'],
['What should a crew do before a long rover trip?','Plan the route and reserve enough power to return','Spend all power before leaving','Remove all navigation markers','Route planning and a return reserve reduce risk.']
],
[
['What is a key difference between Moon and Mars missions in the trainer?','Their environments create different problems','Both have identical dust and air','Neither needs power','Moon scenarios include shadow and pressure; Mars scenarios include dust.'],
['Why compare power readings before and after a repair?','To check whether the repair helped','To make the panel larger','To eliminate the need for maintenance','A baseline and a follow-up reading help evaluate the repair.'],
['Which sample practice reduces cross-contamination?','Use clean tools and separate containers','Use the same dirty scoop for every sample','Mix samples before labelling','Clean tools and separate containers keep material from mixing.'],
['What can block communication in a crater?','Terrain between the antenna and relay','A label on a sample','A closed notebook','Line of sight may be blocked by surrounding terrain.'],
['Why keep stored food while growing plants?','Crops need time before harvest','Plants become meals instantly','Food cannot be stored in a habitat','A new crop does not replace stored food immediately.']
],
[
['Which mission examined material from Cabeus crater?','LCROSS','Apollo 11','Mars Pathfinder','LCROSS studied material ejected from Cabeus, including water-related evidence.'],
['Why is an orbital map useful for a rover team?','It helps them compare terrain and choose targets','It guarantees every route is safe','It replaces all ground measurements','Orbital maps guide planning but do not remove the need to check locally.'],
['What should a team do when a landing site has science clues but poor signal?','Plan a relay and a safe return route','Assume the radio will always work','Discard the power reserve','A relay and a return plan can help manage the communication risk.'],
['Which mission’s team included Armstrong, Aldrin and Collins?','Apollo 11','Chandrayaan-3','Curiosity','Armstrong and Aldrin landed while Collins orbited in Apollo 11.'],
['What does the atlas mean by a planned mission?','A future goal that may change','A mission that has certainly finished','A live simulation of the spacecraft','Planned dates and objectives are targets, not guarantees.']
],
[
['The rover has little power and a sample is far away. What is safer?','Keep enough energy to return and reconsider the route','Drive until the battery is empty','Turn off the habitat without discussion','The crew must balance science with a safe return.'],
['A sample result is unexpected. What is a good next step?','Check the instrument and repeat with a control','Announce a discovery immediately','Remove the sample’s label','Repeating and using a control can reveal errors or contamination.'],
['A crater is cold and shaded. What other factors matter for a visit?','Slope, power, signal and return route','Only the crater’s name','Only the colour of the screen','Good site planning combines science and operational safety.'],
['Why does a greenhouse use supplies before producing food?','Lights and watering need resources while plants grow','Food grows without time or water','A greenhouse makes power automatically','Growing plants requires resources and time.'],
['What is the purpose of a clean blank in a lab test?','Help check whether the process introduced contamination','Guarantee every sample is positive','Show the rover’s battery level','A blank can help reveal contamination from tools or handling.']
],
[
['What can a rover’s clean sample reveal about ancient Mars?','Clues that need careful interpretation','Certain proof of life','An automatic supply of water today','A sample can preserve evidence of past conditions without proving life.'],
['Why compare a safe ridge with a shadowed target?','To balance access and power against possible science','Because all shadows contain equal ice','Because ridges never have hazards','Both science potential and operational safety matter.'],
['In the trainer, who should verify the pressure reading after repair?','The Scientist','The rock sample','The rover’s wheel','The Scientist checks the gauge while the Engineer repairs the seal.'],
['Why protect the sample label during transport?','It connects the material to its location and history','It makes the sample radioactive','It increases the radio signal','A label preserves essential context for interpretation.'],
['Why is the trainer not a real mission procedure?','It simplifies systems and uses fictional scenarios','Every number is real spacecraft telemetry','The scenes are live NASA control rooms','The trainer is a teaching simulation, not operational guidance.']
],
[
['A dusty panel produces less power. What should the two roles compare?','Readings before and after a safe repair','Only the panel’s colour','Only the name of the crater','Comparing readings helps the team judge whether output changed.'],
['Why might a solar-powered outpost need stored energy?','Sunlight can be interrupted by shadow or dust','Sunlight is always constant at every site','Batteries create water','Storage can help bridge periods of low generation.'],
['What does radar evidence at Utopia suggest in the trainer?','A possible subsurface ice deposit that needs local checks','A ready-to-drink lake at every point','A confirmed forest beneath Mars','The local depth, purity and accessibility need investigation.'],
['What should a rover team do when the path becomes dangerous?','Reassess the route and protect the return reserve','Drive faster without checking','Ignore the warning','A safe route and enough energy to return are important.'],
['What is a good conclusion from one uncertain sample result?','Record it as a clue and explain its limits','Say it proves life','Assume the instrument can never be wrong','A cautious conclusion matches the strength of the evidence.']
],
[
['How do Mars rocks and lunar ice prospects differ as goals?','Mars rocks may record ancient water; lunar shadows may hold ice clues','Both guarantee liquid water at the surface','Neither needs scientific testing','The questions and evidence differ between sites.'],
['Which task supports the Engineer during a panel repair?','Scientist records a baseline and checks the result','Scientist hides the readings','Scientist spends all the stored power','Measuring before and after supports verification.'],
['A result could come from a dirty tool. What is the concern called?','Contamination','Illumination','Navigation','Contamination can add material that was not part of the original sample.'],
['Which is an example of a communication trade-off?','Sending more data can use more power','A larger message removes radio delay','A short message changes the planet’s orbit','The trainer models power costs when sending information.'],
['What does the atlas’s agency-source link help a learner do?','Read more from the mission’s source','Control the real spacecraft','Change a mission’s launch date','The source link provides further reading, not live control.']
],
[
['A mission site has strong science clues but steep terrain. What should the team compare?','Science value, route safety, power and communications','Only the strength of the clue','Only the number of rocks','Site choices need to consider both science and safe operations.'],
['What makes a repeated reading useful?','It helps check whether a signal is consistent','It automatically proves the instrument is perfect','It guarantees life is present','Repeat measurements help assess consistency but do not remove every uncertainty.'],
['The Moon’s crater blocks direct radio. What could help?','A relay with a suitable path','More sample labels','A bigger greenhouse crop','A relay can help pass a message around an obstruction.'],
['Why not treat a training crater as an exact map?','Its shape and location are illustrative','It is a live satellite photograph','Every surface feature uses real elevation data','The trainer rearranges and scales its surface features for learning.'],
['A user finds a positive practice sample. What must they remember?','It is fictional and does not establish real water','It confirms a real discovery','It proves the crew can drink the sample','The comparison activity uses simulated training results.']
],
[
['A crew wants maximum science but has little power. What is a sensible plan?','Prioritise essential systems and a smaller investigation','Run every instrument until the reserve is gone','Skip the return route','A reduced investigation can protect critical reserves.'],
['What makes a conclusion stronger after a repair?','A measured baseline, a safe repair and a follow-up check','A guess made before seeing a reading','Changing the label on the meter','Before-and-after evidence helps evaluate a repair.'],
['A Mars message has not received an immediate reply. What should the crew expect?','A delay because the planets are far apart','A reply faster than the signal can travel','That radio waves need no travel time','Mars–Earth communication takes minutes one way depending on distance.'],
['Why record where each rock was collected?','Its surroundings help explain what the sample may mean','Location changes the sample into water','All rocks have exactly the same history','Geological context is important when interpreting samples.'],
['Why can a shadowed target need extra planning?','Power, cold, route and communication may all be difficult','Shadow guarantees safe flat ground','Solar panels work equally well with no light','Shadowed areas can introduce several operational challenges.']
],
[
['A control test is also positive. What should the Scientist consider?','Possible contamination or an instrument issue','Proof that every sample contains life','That controls are unnecessary','A positive blank or control can indicate a problem with the test process.'],
['Why compare two rock samples from different places?','Their differences may help investigate environmental history','They must always give identical results','It guarantees an immediate food supply','Comparing labelled samples can reveal useful differences.'],
['The crew fixes a leak but pressure is still falling. What next?','Continue diagnosing and keep the crew safe','Assume the problem is solved','Open the hatch wider','A continuing pressure drop means the team needs further investigation.'],
['What is the difference between a target and a confirmed resource?','A target is a lead that still needs testing','A target guarantees usable material','There is no difference','Promising observations require follow-up measurements and evaluation.'],
['Why might a mission choose a less direct route?','It may be safer and protect the return reserve','It guarantees no scientific uncertainty','It eliminates the need for navigation','A longer route can sometimes offer better access and safety.']
],
[
['Two samples give different signals. What is the careful response?','Check labels, controls and instrument limits before explaining why','Declare the stronger one proof of life','Swap the labels to make them match','Differences need context, quality checks and cautious interpretation.'],
['Why balance greenhouse lighting with habitat power?','Both need limited energy and the crew must set priorities','The greenhouse can never use electricity','Light instantly creates stored food','The trainer asks the crew to balance essential uses of power.'],
['A ridge has good sunlight but weak science clues. What is its advantage?','It may offer a better operating and power margin','It proves ice is present','It guarantees the shortest route','A brighter site can support operations while providing fewer direct science clues.'],
['What does a successful practice mission debrief include?','Choices, evidence, remaining supplies and uncertainties','Only the number of stars shown','A claim that the simulation is real data','A debrief helps the crew review evidence and trade-offs.'],
['Why should both crew members coordinate during an incident?','Repair and independent checks support a safer response','Only one player can learn','A message removes the need for repair','The Engineer and Scientist have complementary jobs in the scenario.']
],
[
['A cold crater has a strong ice clue, a steep slope and weak signal. Which plan is strongest?','Map a safer route, plan a relay and reserve power before checking','Drive straight down with no return reserve','Call the ice a confirmed water supply','A sound plan considers science, safe access, communications and uncertainty.'],
['A Mars sample has a positive practice signal but the blank is also positive. What should the crew report?','The result is uncertain; check contamination and repeat','Life has been discovered','The control proves usable water','A positive blank can indicate contamination or a testing issue.'],
['A dust event reduces power while plants wilt. Which teamwork fits the trainer?','Engineer safely checks panels; Scientist checks water and plants','Both ignore the warning and use full power','Scientist discards all readings while Engineer drives away','The scenario combines power repair with a plant and water check.'],
['An orbital radar clue looks promising. What evidence is needed before counting on a local resource?','Surface checks of location, material and accessibility','One map colour by itself','A mission name that sounds promising','Orbital clues guide investigation but do not establish a usable supply.'],
['What is the best final mission conclusion?','Explain what was observed, what remains uncertain and what to test next','Claim every objective is proven without evidence','Treat every game number as a real measurement','Good scientific conclusions match the evidence and state their limits.']
]
];
export const questions = blocks.flatMap((block, level) => block.map(([q,correct,wrong1,wrong2,why], index) => {
  const answers = [correct, wrong1, wrong2];
  const shift = (level + index) % answers.length;
  return {q, a: [...answers.slice(shift), ...answers.slice(0, shift)], right: (3-shift)%3, why, level: level+1};
}));
