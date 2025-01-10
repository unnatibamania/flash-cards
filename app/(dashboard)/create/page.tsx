"use client";

import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { CardView } from "@/components/CreationFlow/CardView";
import { SetInfo } from "@/components/CreationFlow/SetInfo";
import { SetDetails } from "@/components/CreationFlow/SetDetails";
import { Paperclip, File, X } from "lucide-react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { CardData } from "@/types/card";

import { getYoutubeTranscript } from "@/app/actions/youtube";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const setFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()),
});

export type SetFormValues = z.infer<typeof setFormSchema>;

const AICards = () => {
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inputText, setInputText] = useState<string>("");
  // const [title, setTitle] = useState<string>("");
  // const [description, setDescription] = useState<string>("");
  // const [tags, setTags] = useState<string[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");

  const [youtubeUrl, setYoutubeUrl] = useState<string>("");

  const { toast } = useToast();

  const handleUploadFile = async () => {
    if (uploadFiles.length === 0) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", uploadFiles[0]);

    const { data } = await axios.post("/api/upload", formData);

    return data.fileId;
  };

  const handleSend = async () => {
    const totalFileSize = uploadFiles.reduce((acc, file) => acc + file.size, 0);

    if (totalFileSize > 5000000) {
      toast({
        title: "File size too large",
        description: "Please upload a smaller file",
        variant: "destructive",
      });
      return;
    }

    // return;
    setIsLoading(true);

    const fileId = await handleUploadFile();

    console.log({ fileId });

    const { data: aiData } = await axios.post("/api/ai", {
      fileId,
      inputText,
      transcript: transcript || "",
    });

    const parsedData = JSON.parse(aiData[0].text.value);

    form.setValue("title", parsedData.set_title);
    form.setValue("description", parsedData.set_description);
    form.setValue("tags", parsedData.set_tags);

    const transformedCards = parsedData.set_cards.map(
      (card: CardData, index: number) => ({
        id: uuidv4(),
        order: index,
        question: card.question,
        answer: card.answer,
        tags: card.tags,
      })
    );

    setCards(transformedCards);
    setCurrentIndex(0); // Reset to first card

    setUploadFiles([]);

    setIsLoading(false);
    setInputText("");
  };

  const form = useForm<SetFormValues>({
    resolver: zodResolver(setFormSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  return (
    <div className="flex flex-col bg-gray-50 h-full s w-full p-3 overflow-hidden gap-4">
      <div className="flex flex-col justify-between w-full items-center border border-gray-400 p-4 border-dashed h-full rounded-2xl gap-4">
        <Form {...form}>
          {cards.length > 0 ? (
            <div className="grid grid-cols-3 w-full gap-4">
              {/*  */}
              <SetInfo form={form} />
              <div className="flex flex-col gap-4">
                <CardView
                  cards={cards}
                  setCards={setCards}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                />
              </div>

              <SetDetails
                form={form}
                isPublic={isPublic}
                setIsPublic={setIsPublic}
                cards={cards}
              />
            </div>
          ) : isLoading ? (
            <div className="flex flex-col gap-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center p-4 rounded-2xl">
              <div className="flex bg-white min-w-[300px] flex-col gap-2 p-4 rounded-2xl">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">
                    Upload a file to create flashcards
                  </p>

                  <Input
                    placeholder="Enter youtube url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    onKeyDown={async (e) => {
                      console.log(youtubeUrl.split("v=")[1]);
                      if (e.key === "Enter") {
                        const transcript = await getYoutubeTranscript(
                          youtubeUrl
                        );
                        console.log({ transcript });
                        setTranscript(transcript as string);
                        // console.log({ transcript });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex w-full bg-white rounded-xl p-3 flex-col gap-4">
            <div className="gap-x-2 flex">
              {uploadFiles.map((file, index) => (
                <UploadFile
                  file={file}
                  key={`${file.name}-${index}`}
                  uploadFiles={uploadFiles}
                  setUploadFiles={setUploadFiles}
                />
              ))}
            </div>
            <div className="relative">
              <Textarea
                rows={8}
                className="p-4"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Create flashcards on Newton's three laws of motion..."
              />

              <div className="flex absolute right-4 gap-4 bottom-4 justify-end">
                <Button
                  disabled={inputText.length === 0 || isLoading}
                  size="icon"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4 -rotate-45" />
                </Button>

                <Button
                  type="button"
                  size="icon"
                  className=""
                  disabled={inputText.length === 0 || isLoading}
                  onClick={handleSend}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send />
                  )}
                </Button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) =>
                    setUploadFiles([
                      ...uploadFiles,
                      ...Array.from(e.target.files || []),
                    ])
                  }
                  multiple
                  hidden
                />
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

const UploadFile = ({
  file,
  setUploadFiles,
  uploadFiles,
}: {
  file: File;
  setUploadFiles: (files: File[]) => void;
  uploadFiles: File[];
}) => {
  return (
    <div
      className="flex gap-2 items-center w-fit border relative rounded-lg p-2"
      key={file.name}
    >
      <File className="h-4 w-4" />
      <div className="flex flex-col">
        <p className="text-sm">{file.name}</p>
      </div>
      <div
        onClick={() =>
          setUploadFiles(
            uploadFiles.filter(
              (f, index) => `${f.name}-${index}` !== `${file.name}-${index}`
            )
          )
        }
        className="bg-gray-100 cursor-pointer rounded-full p-1 absolute -right-1 -top-1"
      >
        <X className="h-2 w-2" />
      </div>
    </div>
  );
};

export default AICards;
