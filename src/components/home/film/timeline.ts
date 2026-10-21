/**
 * Shot timing of the scroll film, as progress (0–1) through the edited sequence.
 * Derived from the EDL in scripts/media/build_media.py (durations minus 0.5 s
 * cross-fades, total 25.8 s). If the edit changes, update these values.
 */
export const SHOTS = {
  hall: 0,
  nightAerial: 0.159,
  lathe: 0.24,
  drill: 0.322,
  disc: 0.388,
  plate: 0.461,
  fasteners: 0.527,
  chain: 0.593,
  pipes: 0.659,
  refinery: 0.733,
  port: 0.822,
} as const;

export interface Beat {
  id: string;
  index?: string;
  title: string;
  body: string;
  start: number;
  end: number;
  labels: { text: string; start: number; end: number }[];
}

export const BEATS: Beat[] = [
  {
    id: "heritage",
    title: "Five decades of industrial supply.",
    body: "From Apco Tools Traders — magnets, drills and tools — to a broad industrial portfolio.",
    start: 0.15,
    end: 0.235,
    labels: [],
  },
  {
    id: "products",
    index: "01",
    title: "The right products.",
    body: "Cutting tools, abrasives, engineering tools and the consumables that keep work moving.",
    start: 0.245,
    end: 0.455,
    labels: [
      { text: "Precision-machined steel", start: SHOTS.lathe, end: SHOTS.drill },
      { text: "Drills & cutting tools", start: SHOTS.drill, end: SHOTS.disc },
      { text: "Cutting & grinding", start: SHOTS.disc, end: SHOTS.plate },
    ],
  },
  {
    id: "specifications",
    index: "02",
    title: "The right specifications.",
    body: "Size, grade, standard and quantity — reviewed line by line before sourcing.",
    start: 0.465,
    end: 0.655,
    labels: [
      { text: "Plates, cut to requirement", start: SHOTS.plate, end: SHOTS.fasteners },
      { text: "Nuts, bolts & fasteners", start: SHOTS.fasteners, end: SHOTS.chain },
      { text: "Chain & lifting", start: SHOTS.chain, end: SHOTS.pipes },
    ],
  },
  {
    id: "coordination",
    index: "03",
    title: "The right procurement coordination.",
    body: "Multiple categories and suppliers, consolidated into one requirement and one point of contact.",
    start: 0.665,
    end: 0.815,
    labels: [
      { text: "Pipes, valves & fittings", start: SHOTS.pipes, end: SHOTS.refinery },
      { text: "Project-scale supply", start: SHOTS.refinery, end: SHOTS.port },
    ],
  },
];

/** Final identity + CTA beat. */
export const FINALE_START = 0.835;
