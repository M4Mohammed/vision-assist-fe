export interface UsageSlice {
  key: "live_video" | "recorded_video" | "images";
  label: string;
  percent: number;
}

export interface ProfileStat {
  key: string;
  label: string;
  value: string;
  caption?: string;
  iconKey:
    | "image"
    | "play"
    | "broadcast"
    | "caption"
    | "document";
}

export interface LexicalUnit {
  word: string;
  uses: number;
}

export type MediaKind =
  | "VIDEO_FILE"
  | "IMAGE_STATIC"
  | "STREAM_BUFFER"
  | "LOG_SEQUENCE";

export interface TranscriptLine {
  timestamp: string;
  text: string;
}

export interface MediaItem {
  id: string;
  name: string;
  kind: MediaKind;
  duration: string;
  transcript: TranscriptLine[];
}

export const profileSummary = {
  userSystemId: "0492-X",
  totalAnalyzedPercent: 100,
};

export const usageSlices: UsageSlice[] = [
  { key: "live_video", label: "LIVE_VIDEO", percent: 65 },
  { key: "recorded_video", label: "RECORDED_VIDEO", percent: 25 },
  { key: "images", label: "IMAGES", percent: 10 },
];

export const profileStats: ProfileStat[] = [
  {
    key: "images_processed",
    label: "IMAGES_PROCESSED",
    value: "4,810",
    caption: "NEW PEAK REACHED",
    iconKey: "image",
  },
  {
    key: "recorded_mins",
    label: "RECORDED_MINS",
    value: "894",
    caption: "STABLE FLOW",
    iconKey: "play",
  },
  {
    key: "live_video_mins",
    label: "LIVE_VIDEO_MINS",
    value: "1,242",
    caption: "+12% MONTHLY",
    iconKey: "broadcast",
  },
  {
    key: "total_captions",
    label: "TOTAL_CAPTIONS",
    value: "12.5k",
    iconKey: "caption",
  },
  {
    key: "lexical_units_total",
    label: "LEXICAL_UNITS_TOTAL",
    value: "842,901",
    caption: "WORDS PROCESSED ACROSS ALL ACTIVE CHANNELS",
    iconKey: "document",
  },
];

export const lexicalUnits: LexicalUnit[] = [
  { word: "Technology", uses: 2410 },
  { word: "Innovation", uses: 2140 },
  { word: "Future", uses: 1980 },
  { word: "Vision", uses: 1620 },
  { word: "Real-time", uses: 1205 },
];

export const mediaArchive: MediaItem[] = [
  {
    id: "project_alpha",
    name: "Project_Alpha.mp4",
    kind: "VIDEO_FILE",
    duration: "12:40",
    transcript: [
      {
        timestamp: "00:00:02",
        text: "The core objective of the system update is to facilitate seamless integration with existing network nodes.",
      },
      {
        timestamp: "00:00:15",
        text: "Initial tests indicate a 24% increase in lexical processing speed under peak loads, primarily driven by the new heuristic engine.",
      },
      {
        timestamp: "00:00:38",
        text: "By leveraging decentralized computation, we reduce latency and ensure real-time visual recognition across all satellite offices.",
      },
      {
        timestamp: "00:01:02",
        text: "Transitioning to the next phase, we will begin stress-testing the neural architecture for long-form context retention.",
      },
      {
        timestamp: "00:01:24",
        text: "End of transcription for session 492-X-Alpha. All parameters nominal.",
      },
    ],
  },
  {
    id: "store_footage_01",
    name: "Store_Footage_01.jpg",
    kind: "IMAGE_STATIC",
    duration: "08:15",
    transcript: [
      {
        timestamp: "00:00:00",
        text: "Single still frame captured at the storefront entrance during midday traffic.",
      },
      {
        timestamp: "00:00:00",
        text: "Caption: A glass storefront with reflective panels, soft natural light, and a small queue forming near the entrance.",
      },
    ],
  },
  {
    id: "keynote_live_clip",
    name: "Keynote_Live_Clip",
    kind: "STREAM_BUFFER",
    duration: "22:10",
    transcript: [
      {
        timestamp: "00:00:05",
        text: "Live broadcast captured during the quarterly platform keynote.",
      },
      {
        timestamp: "00:04:12",
        text: "Speaker presents adoption growth across the satellite offices.",
      },
      {
        timestamp: "00:09:48",
        text: "Q&A segment begins with attendee questions on accessibility tooling.",
      },
    ],
  },
  {
    id: "system_log_export_2",
    name: "System_Log_Export_2",
    kind: "LOG_SEQUENCE",
    duration: "14:02",
    transcript: [
      {
        timestamp: "00:00:00",
        text: "Aggregated system log slice exported from the on-device buffer.",
      },
      {
        timestamp: "00:02:38",
        text: "Latency spike isolated to the inference adapter, recovered within 1.2s.",
      },
      {
        timestamp: "00:11:50",
        text: "End of log batch — all checkpoints validated.",
      },
    ],
  },
];
