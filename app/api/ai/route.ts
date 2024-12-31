import { NextRequest, NextResponse } from "next/server";
import { prompt } from "@/utils/ai";
import { OpenAI, } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function waitForRunCompletion(thread, run) {
  while (true) {
    const runStatus = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );
    
    if (runStatus.status === 'completed') {
      return runStatus;
    } else if (runStatus.status === 'failed') {
      throw new Error('Run failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}


export async function POST(request: NextRequest) {
  const { fileId, inputText } = await request.json();
  let assistant, thread;

  try {
    // Create assistant with the file
    assistant = await openai.beta.assistants.create({
      name: "Flashcard Generator",
      instructions: prompt(inputText),
      model: "gpt-4o-mini", // Updated model
      tools: [{ type: "file_search" }],
      // attachments: [fileId]
       // Changed to retrieval
    });

    // Create thread
    thread = await openai.beta.threads.create();

    // Add message to thread (simplified)
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Generate flashcards from the uploaded PDF",
      attachments: [{
        file_id: fileId,
        tools: [{
          type: "file_search",
        }]
      }]
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    });

    await waitForRunCompletion(thread, run);

    // Get messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data.find(msg => msg.role === 'assistant');

    if (!lastMessage) {
      throw new Error('No response from assistant');
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
