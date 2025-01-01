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
import { CardData } from "@/types/card";

const AICards = () => {
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inputText, setInputText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const handleSend = async () => {
    setIsLoading(true);
    if (uploadFiles.length > 0) {
      const formData = new FormData();
      formData.append("file", uploadFiles[0]);

      const { data } = await axios.post("/api/upload", formData);

      const { data: aiData } = await axios.post("/api/ai", {
        fileId: data.fileId,
        inputText,
      });

      const parsedData = JSON.parse(aiData[0].text.value);

    
      setTitle(parsedData.set_title);
      setDescription(parsedData.set_description);
      setTags(parsedData.set_tags);
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
    }

    setUploadFiles([]);

    setIsLoading(false);
    setInputText("");
  };

  return (
    <div className="flex flex-col bg-gray-50 h-full s w-full p-3 overflow-hidden gap-4">
      <div className="flex flex-col justify-between w-full items-center border border-gray-400 p-4 border-dashed h-full rounded-2xl gap-4">
        {cards.length > 0 ? (
          <div className="grid grid-cols-3 w-full gap-4">
            <SetInfo
              setTitle={setTitle}
              setDescription={setDescription}
              setTags={setTags}
              title={title}
              description={description}
              tags={tags}
            />
            <div className="flex flex-col gap-4">
              <CardView
                cards={cards}
                setCards={setCards}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>

            <SetDetails
              title={title}
              description={description}
              tags={tags}
              cards={cards}
              isPublic={isPublic}
              setIsPublic={setIsPublic}
            />
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div>
            Daal bhai file daal
          </div>
        )}

        <div className="flex w-full bg-white rounded-xl p-3 flex-col gap-4">
          {uploadFiles.map((file) => (
            <UploadFile
              file={file}
              key={file.name}
              uploadFiles={uploadFiles}
              setUploadFiles={setUploadFiles}
            />
          ))}
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
                  setUploadFiles(Array.from(e.target.files || []))
                }
                multiple
                hidden
              />
            </div>
          </div>
        </div>
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
          setUploadFiles(uploadFiles.filter((f) => f.name !== file.name))
        }
        className="bg-gray-100 cursor-pointer rounded-full p-1 absolute -right-1 -top-1"
      >
        <X className="h-2 w-2" />
      </div>
    </div>
  );
};

export default AICards;
