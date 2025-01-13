"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pill } from "../Pill/Pill";

let interval: NodeJS.Timeout;

type Card = {
  id: number;
  question: string;
  tags: string[];
};

const items: Card[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    tags: ["France", "Europe"],
  },
  {
    id: 2,
    question: "What is the meaning of desultory?",
    tags: ["Vocabulary", "English"],
  },
  {
    id: 3,
    question: "What is the color of KMno4?",
    tags: ["Chemistry", "Science"],
  },
];

export const EmptyCardView = ({}) => {
  const offset = 10;
  const scaleFactor = 0.06;
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      
      <div className="relative  h-60 w-60 md:h-60 md:w-96">
        {cards.map((card, index) => {
          return (
            <motion.div
              key={card.id}
              className="absolute dark:bg-black bg-white h-60 w-60 md:h-60 md:w-96 rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col items-center justify-center gap-4"
              style={{
                transformOrigin: "top center",
              }}
              animate={{
                top: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
                zIndex: cards.length - index, //  decrease z-index for the cards that are behind
              }}
            >
              <div className="font-bold text-lg text-neutral-700  dark:text-neutral-200">
                {card.question}
              </div>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <Pill
                    key={tag}
                    tag={tag}
                    onClick={() => {}}
                    hasAction={false}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
