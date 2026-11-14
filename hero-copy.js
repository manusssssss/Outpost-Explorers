const messages = [
  { label: 'MOON + MARS', sentence: 'Meet the missions exploring worlds beyond Earth.' },
  { label: 'LUNAR CLUES', sentence: 'Search for signs of ice, then check what the ground can really tell us.' },
  { label: 'MARS ROCKS', sentence: 'Read the rocks for clues about the Red Planet’s past.' },
  { label: 'OUTPOST PLANNING', sentence: 'A future outpost needs power, shelter, air, water and science.' },
  { label: 'ROVER ROUTES', sentence: 'Pick a safe path across craters, slopes and rocky ground.' },
  { label: 'SCIENCE IN ACTION', sentence: 'Collect samples carefully and keep them clean for study.' },
  { label: 'POWER TEAM', sentence: 'Balance energy between driving, tools, lights and communication.' },
  { label: 'LUNAR SHADOWS', sentence: 'Dark craters can be very cold and make signal routes tricky.' },
  { label: 'MARTIAN DUST', sentence: 'Dust can cover solar panels and make rover travel harder.' },
  { label: 'SUNLIGHT + POWER', sentence: 'Sunlight helps, but shade and dust can limit available energy.' },
  { label: 'STAY CONNECTED', sentence: 'Plan a relay path to help send discoveries back home.' },
  { label: 'CHOOSE A SITE', sentence: 'Compare science clues with sunlight, safe routes and signal access.' },
  { label: 'TEAM SCIENCE', sentence: 'Work as Engineer and Scientist to solve shared mission problems.' },
  { label: 'PRACTICE SAFELY', sentence: 'Try mission choices in a learning simulation, not a real spacecraft.' },
  { label: 'MISSION ATLAS', sentence: 'Explore missions that studied the Moon, Mars and beyond.' },
  { label: 'ARTEMIS', sentence: 'Follow plans for people to explore the Moon again.' },
  { label: 'CHANDRAYAAN', sentence: 'Discover how India’s lunar missions have studied the Moon.' },
  { label: 'APOLLO', sentence: 'Explore the historic missions that first carried people to the lunar surface.' },
  { label: 'PERSEVERANCE', sentence: 'See how a Mars rover studies rocks for clues to ancient environments.' },
  { label: 'WATER QUESTIONS', sentence: 'Orbital hints can guide a search, but they do not prove water is easy to reach.' },
  { label: 'PLANET SCIENCE', sentence: 'Compare each world’s conditions before planning a place to live.' },
  { label: 'BEGINNER + PRO', sentence: 'Start with simple tasks or try deeper science challenges.' },
  { label: 'YOUR EXPEDITION', sentence: 'Choose a world, explore a site and see what your crew can learn.' }
];

// Three short lines preserve the original headline layout. The last line is highlighted.
const headlines = [
 ['Next stop.','The Moon.','Or maybe Mars.'],
 ['Look up.','Dream big.','Explore farther.'],
 ['Small steps.','Big questions.','New worlds.'],
 ['Two worlds.','One crew.','Endless curiosity.'],
 ['Find clues.','Ask questions.','Think like a scientist.'],
 ['Your mission.','Your choices.','Your discovery.'],
 ['Beyond Earth.','Across space.','Into discovery.'],
 ['Meet a rover.','Choose a route.','Explore Mars.'],
 ['A little dust.','A big mystery.','A world to explore.'],
 ['Light and shadow.','Rocks and ice.','What will you find?'],
 ['Power the base.','Protect the crew.','Keep exploring.'],
 ['Look from orbit.','Choose a site.','Make a plan.'],
 ['Plant a seed.','Save some water.','Grow together.'],
 ['Every sample.','Every question.','A new clue.'],
 ['The Moon is near.','The challenge is big.','Are you ready?'],
 ['Mars is calling.','Pack your curiosity.','Let’s explore.'],
 ['One outpost.','Many systems.','One brave crew.'],
 ['Explore a crater.','Study a rock.','Share the story.'],
 ['Bright ridges.','Cold shadows.','Careful choices.'],
 ['A rover rolls.','A scientist wonders.','A mission begins.'],
 ['Think together.','Solve together.','Discover together.'],
 ['Look for water.','Test the clues.','Follow the evidence.'],
 ['Meet the missions.','Learn their stories.','Imagine what’s next.'],
 ['From Earth.','To the Moon.','And beyond.'],
 ['A world of questions.','A crew of explorers.','A place to begin.'],
 ['A little power.','A careful plan.','A giant adventure.'],
 ['Look closer.','Wonder more.','Keep exploring.'],
 ['Make a plan.','Try an idea.','Learn from it.'],
 ['Rocks have stories.','Missions find clues.','You connect them.'],
 ['New horizons.','Real questions.','Your next mission.'],
 ['Build a home.','Care for a crew.','Explore a world.'],
 ['Follow the light.','Plan for shadow.','Protect your crew.'],
 ['Science starts.','With a question.','What is yours?'],
 ['Explore the past.','Imagine the future.','Start today.'],
 ['Ready, explorer?','Choose your world.','Begin your mission.']
];

const label = document.querySelector('#hero-tagline');
const sentence = document.querySelector('#hero-message');
const headline = document.querySelector('#hero-headline');

if (label && sentence) {
  let index = 0;
  let timer;

  const display = () => {
    const message = messages[index % messages.length];
    label.textContent = message.label;
    sentence.textContent = message.sentence;
    if (headline) {
      const [first, second, last] = headlines[index];
      const highlight = document.createElement('em');
      highlight.textContent = last;
      headline.replaceChildren(document.createTextNode(first), document.createElement('br'), document.createTextNode(second), document.createElement('br'), highlight);
    }
  };

  const scheduleNext = () => {
    clearTimeout(timer);
    if (document.hidden) return;
    timer = setTimeout(() => {
      index = (index + 1) % headlines.length;
      display();
      scheduleNext();
    }, 45000);
  };

  display();
  scheduleNext();
  document.addEventListener('visibilitychange', scheduleNext);
}
