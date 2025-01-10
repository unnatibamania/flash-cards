import { NextRequest, NextResponse } from "next/server";
import { prompt } from "@/utils/ai";
import { OpenAI } from "openai";
import { getYoutubeTranscript } from "@/app/actions/youtube";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function waitForRunCompletion(thread, run) {
  while (true) {
    const runStatus = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );

    if (runStatus.status === "completed") {
      return runStatus;
    } else if (runStatus.status === "failed") {
      throw new Error("Run failed");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export async function POST(request: NextRequest) {
  const { fileId, inputText, transcript } = await request.json();
  let assistant, thread;

  let generatedTranscript = "";

  if(transcript.length > 0) {
    generatedTranscript = await getYoutubeTranscript(transcript as string) as string;
  }

  try {
    // Create assistant with appropriate configuration based on input
    const assistantConfig = {
      name: "Flashcard Generator",
      instructions: prompt(inputText, generatedTranscript),
      model: "gpt-4-turbo-preview",
      ...(fileId ? {
        tools: [{ type: "file_search" }]
      } : {})
    };

    assistant = await openai.beta.assistants.create(assistantConfig);

    // Create thread
    thread = await openai.beta.threads.create();

    // Add message to thread with or without file attachment
    const messageConfig = {
      role: "user",
      content: fileId 
        ? "Generate flashcards from the uploaded PDF" 
        : `Generate flashcards about: ${inputText}`,
      ...(fileId ? {
        attachments: [{
          file_id: fileId,
          tools: [{ type: "file_search" }]
        }]
      } : {})
    };

    await openai.beta.threads.messages.create(thread.id, messageConfig);

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    await waitForRunCompletion(thread, run);

    // Get messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data.find((msg) => msg.role === "assistant");

    if (!lastMessage) {
      throw new Error("No response from assistant");
    }

    // Clean up
    await openai.beta.assistants.del(assistant.id);

    return NextResponse.json(lastMessage.content);
  } catch (error) {
    console.error(error);
    if (assistant?.id) {
      await openai.beta.assistants.del(assistant.id).catch(console.error);
    }
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
