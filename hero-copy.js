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

const label = document.querySelector('#hero-tagline');
const sentence = document.querySelector('#hero-message');

if (label && sentence) {
  let index = 0;
  let timer;

  const display = () => {
    label.textContent = messages[index].label;
    sentence.textContent = messages[index].sentence;
  };

  const scheduleNext = () => {
    clearTimeout(timer);
    if (document.hidden) return;
    timer = setTimeout(() => {
      index = (index + 1) % messages.length;
      display();
      scheduleNext();
    }, 45000);
  };

  display();
  scheduleNext();
  document.addEventListener('visibilitychange', scheduleNext);
}
