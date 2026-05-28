export interface MockCaption {
  text: string;
  confidence: number;
}

export const liveCaptions: MockCaption[] = [
  {
    text: "A sophisticated urban workspace at dusk, featuring a minimalist desk with high-end tech peripherals. Soft light spills from a large window reflecting off pristine glass surfaces.",
    confidence: 0.984,
  },
  {
    text: "A quiet street scene framed by tall buildings, with a single figure walking towards a crosswalk beneath warm streetlights.",
    confidence: 0.963,
  },
  {
    text: "A cozy reading nook with a vintage armchair, a tall floor lamp casting amber light, and books stacked neatly on a side table.",
    confidence: 0.949,
  },
  {
    text: "An open kitchen counter with a fresh cup of coffee, an open notebook, and a phone resting beside it under bright daylight.",
    confidence: 0.972,
  },
  {
    text: "A panoramic view of a modern city skyline at night, with skyscrapers illuminated and a calm river reflecting the lights.",
    confidence: 0.957,
  },
];

export const sampleImageCaption: MockCaption = {
  text: "A close-up still frame showing a wooden desk with a notebook, fountain pen, and a steaming mug of tea, lit by soft morning light from a side window.",
  confidence: 0.971,
};

export const sampleRecordedCaption: MockCaption = {
  text: "A short clip following a person walking across a busy plaza at midday, weaving between pedestrians and pausing briefly at a fountain.",
  confidence: 0.939,
};
