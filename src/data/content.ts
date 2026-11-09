import type { Video } from "./types";

/**
 * Latest content (YouTube).
 * Paste a YouTube video ID into `youtubeId` and fill in the title and
 * description — the section switches from placeholder to the real video.
 * Example: for https://www.youtube.com/watch?v=abc123XYZ the ID is "abc123XYZ".
 */
export const featuredVideo: Video = {
  youtubeId: "",
  title: "First video coming soon",
  description:
    "Videos and write-ups on my engineering and software projects will appear here.",
};

/** Link to your YouTube channel (optional). */
export const youtubeChannel = "";
