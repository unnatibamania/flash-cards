import { NextRequest, NextResponse } from "next/server";

import { openai } from "@/utils/ai";

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to OpenAI
    const uploadedFile = await openai.files.create({
      file: new File([buffer], file.name, { type: file.type }),
      purpose: "assistants",
    });

    return NextResponse.json({ fileId: uploadedFile.id });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 }
    );
  }
}
