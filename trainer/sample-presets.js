// Fictional classroom readings. These are not observations of real lunar or Martian samples.
const observations = [
  'A clear practice signal; repeat with a blank.',
  'A strong practice signal; check the sample label.',
  'A signal in both practice readings; compare the blank.',
  'A positive practice response; check for contamination.',
  'A repeatable practice response; record its uncertainty.',
  'No practice signal above the training threshold.',
  'No practice signal; preserve the sample for another test.',
  'No practice response in this simulated run.',
  'The practice reading stays below the training threshold.',
  'No practice signal after the blank check.',
  'No practice signal; the real composition remains unknown.',
  'The simulated indicator remains below the threshold.',
  'No practice response; check the instrument before repeating.',
  'No practice signal in this imaginary sample.',
  'The practice response does not pass the threshold.',
  'No practice signal; another method could be used.',
  'The simulated blank and sample show no positive response.',
  'The practice result remains below the threshold.',
  'No practice response after the simulated repeat.',
  'No practice signal; keep the location and label with the sample.'
];
export const SAMPLE_PRESETS = Object.freeze(observations.map((note, index) => Object.freeze({
  id: `T${String(index + 1).padStart(2, '0')}`,
  positive: index < 5,
  note
})));

export function samplePreset(world, region, rockIndex) {
  const regions = ['shackleton', 'haworth', 'faustini', 'cabeus', 'jezero', 'utopia', 'arcadia', 'gale'];
  const regionIndex = Math.max(0, regions.indexOf(region));
  const offset = world === 'Mars' ? 3 : 0;
  const i = Number.isInteger(rockIndex) && rockIndex >= 0 ? rockIndex : 0;
  return SAMPLE_PRESETS[(i * 7 + regionIndex + offset) % SAMPLE_PRESETS.length];
}
