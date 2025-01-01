"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useParams } from "next/navigation";

import axios from "axios";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { ListRestart, Shuffle } from "lucide-react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { Pill } from "@/components/Pill/Pill";

// import { Card } from "@/types/cards";
// import { Set } from "@/types/set";

import { useHotkeys } from "@mantine/hooks";
// import { Pill } from "../Pill";

// import { CardData } from "@/app/types/card";

const CardSet = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const [isShuffledOn, setIsShuffledOn] = useState(false);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const { id } = useParams();

  useHotkeys([
    ["space", () => setIsFlipped(!isFlipped)],
    ["ArrowRight", () => goToNextCard()],
    ["ArrowLeft", () => goToPreviousCard()],
  ]);

  const goToNextCard = () => {
    setCurrentCardIndex(Math.min(cards.length - 1, currentCardIndex + 1));
  };

  const goToPreviousCard = () => {
    setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
  };

  const { data: cards, isLoading: cardsLoading } = useQuery({
    queryKey: ["cards", id],
    queryFn: () => axios.get(`/api/card/${id}`).then((res) => res.data),
  });

  const { data: set } = useQuery({
    queryKey: ["set", id],
    queryFn: () => axios.get(`/api/set/${id}`).then((res) => res.data),
  });

  const handleCardVisited = async (id: string) => {
    await axios.post(`/api/card/visited/${id}`);
  };

  if (cardsLoading) return <div>Loading...</div>;

  return (
    <div className="flex h-full w-full justify-center">
      <div className="max-w-3xl w-full p-8 flex gap-4 flex-col">
        <section className="flex flex-col">
          <h1 className="text-2xl font-semibold">{set[0]?.title}</h1>

          <p className="text-md text-gray-400">{set[0]?.description}</p>
        </section>

        <div
          className="flex justify-center items-center h-80  p-4"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            className="w-full h-full cursor-pointer perspective-1000"
            animate={{ rotateX: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, animationDirection: "normal" }}
          >
            <motion.div
              className="relative w-full h-full transform-style-3d"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Front of the card */}
              <div
                className={`absolute w-full h-full bg-white rounded-xl shadow-lg p-6 
            backface-hidden flex flex-col justify-center items-center
            ${!isFlipped ? "z-10" : "z-0"}`}
              >
                <div className=" gap-y-2">
                  <h2 className="text-2xl font-bold mb-4">
                    {cards[currentCardIndex]?.question}
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {cards[currentCardIndex]?.tags.map((tag: string) => (
                      <Pill
                        key={tag}
                        tag={tag}
                        onClick={() => {}}
                        hasAction={false}
                      />
                    ))}
                  </div>
                </div>
                {/* <p className="text-center">Click to flip the card!</p>
            <div className="mt-4 text-blue-500">🃏 Front Content</div> */}
              </div>

              {/* Back of the card */}
              <div
                className={`absolute w-full h-full bg-gray-100  rounded-xl shadow-sm p-6 
            backface-hidden flex flex-col justify-center items-center
            transform rotate-x-180
            ${isFlipped ? "z-10" : "z-0"}`}
              >
                <h2 className="text-md font-medium mb-4">
                  {cards[currentCardIndex]?.answer}
                </h2>
                {/* <p className="text-center">Card has been flipped!</p>
                <div className="mt-4">🔄 Back Content</div> */}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-1">
            <Button
              onClick={() => goToPreviousCard()}
              disabled={currentCardIndex === 0}
              className="rounded-full"
              size={"icon"}
              variant={"outline"}
            >
              <ArrowLeft />
            </Button>

            <p>
              {currentCardIndex + 1} / {cards.length}
            </p>

            <Button
              disabled={currentCardIndex === cards.length - 1}
              onClick={async () => {
                await handleCardVisited(cards[currentCardIndex].id);
                goToNextCard();
              }}
              className="rounded-full"
              size={"icon"}
              variant={"outline"}
            >
              <ArrowRight />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => {
                setCurrentCardIndex(0);
              }}
              className="rounded-full"
              size={"icon"}
              variant={"outline"}
            >
              <ListRestart />
            </Button>

            <Button
              onClick={() => {
                setIsShuffledOn(!isShuffledOn);
              }}
              className="rounded-full"
              size={"icon"}
              variant={"outline"}
            >
              <Shuffle />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSet;
