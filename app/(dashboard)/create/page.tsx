"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { CardView } from "@/components/CreationFlow/CardView";
import { SetInfo } from "@/components/CreationFlow/SetInfo";
import { SetDetails } from "@/components/CreationFlow/SetDetails";
import { Paperclip, File, X } from "lucide-react";

const AICards = () => {

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log({
    uploadFiles
  })

  return (
    <div className="flex flex-col bg-gray-50 h-full s w-full p-3 overflow-hidden gap-4">
      <div className="flex flex-col justify-between w-full items-center border border-gray-400 p-4 border-dashed h-full rounded-2xl gap-4">
        <div className="grid grid-cols-3 w-full gap-4">
          <SetInfo />
          <div className="flex flex-col gap-4">
            <CardView
              cards={[]}
              setCards={() => {}}
              currentIndex={0}
              setCurrentIndex={() => {}}
            />
          </div>
          <SetDetails />
        </div>

        <div className="flex w-full bg-white rounded-xl p-3 flex-col gap-4">
          {
            uploadFiles.map((file) => (
              <UploadFile file={file} key={file.name} uploadFiles={uploadFiles} setUploadFiles={setUploadFiles} />
            ))
          }
          <div className="relative">
            <Textarea
              rows={8}
              className="p-4"
              placeholder="Create flashcards on Newton's three laws of motion..."
            />

            <div className="flex absolute right-4 gap-4 bottom-4 justify-end">
            <Button size="icon" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-4 w-4 -rotate-45" />
            </Button>

            <Button
              type="button"
              size="icon"
              className=""
            >
              <Send />
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
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


const UploadFile = ({ file, setUploadFiles, uploadFiles }: { file: File, setUploadFiles: (files: File[]) => void, uploadFiles: File[]  }) => {
  return (
    <div className="flex gap-2 items-center w-fit border relative rounded-lg p-2" key={file.name}>
      <File className="h-4 w-4" />
      <div className="flex flex-col">
        <p className="text-sm">{file.name}</p>
      </div>
      <div onClick={() => setUploadFiles(uploadFiles.filter((f) => f.name !== file.name))} className="bg-gray-100 cursor-pointer rounded-full p-1 absolute -right-1 -top-1">
        <X className="h-2 w-2" />
        </div>
    </div>
  );
};

export default AICards;
