"use server";

import { YoutubeTranscript } from 'youtube-transcript';

export async function getYoutubeTranscript(youtubeUrl: string) {
  try {
    console.log(youtubeUrl);
    const transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl);
    return transcript.map((t) => t.text).join(" ");
  } catch (error) {
    console.error(error);
    return [];
  }
};

// YoutubeTranscript.fetchTranscript('videoId or URL').then(console.log);
