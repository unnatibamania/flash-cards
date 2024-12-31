"use client";

import {  useEffect } from "react";

import { CardData } from "@/types/card";
// import { CardData } from "@/app/types/card";
import { z } from "zod";
import { formCardSchema } from "@/types/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
//   Upload,
} from "lucide-react";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

type FormValues = z.infer<typeof formCardSchema>;


export const CardView = ({
  cards,
  setCards,
  setCurrentIndex,
  currentIndex,
}: {
  cards: CardData[];
  setCards: (cards: CardData[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}) =>{
  //   const [currentCard, setCurrentCard] = useState<CardData>(cards[currentIndex]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formCardSchema),
    defaultValues: {
      question: cards[currentIndex]?.question || "",
      answer: cards[currentIndex]?.answer || "",
      tags: cards[currentIndex]?.tags || [],
    },
  });


//   const fileInputRef = useRef<HTMLInputElement>(null);

  const addTag = (currentTags: string[], newTag: string) => {
    if (newTag && !currentTags.includes(newTag)) {
      const updatedTags = [...currentTags, newTag];
      form.setValue("tags", updatedTags);
      return updatedTags;
    }
    return currentTags;
  };

  const removeTag = (currentTags: string[], tagToRemove: string) => {
    const updatedTags = currentTags.filter((tag) => tag !== tagToRemove);
    form.setValue("tags", updatedTags);
    return updatedTags;
  };

  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (!formData) return;
      
      // Get the current form values
      const currentFormValues = form.getValues();
      
      // Skip updating cards if any of the values are undefined
      if (!currentFormValues.question || !currentFormValues.answer || !currentFormValues.tags) {
        return;
      }

      // Skip updating cards if the form data matches the current card
      const currentCard = cards[currentIndex];
      if (
        currentCard &&
        currentCard.question === currentFormValues.question &&
        currentCard.answer === currentFormValues.answer &&
        JSON.stringify(currentCard.tags) === JSON.stringify(currentFormValues.tags)
      ) {
        return;
      }

      const updatedCards = [...cards];
      updatedCards[currentIndex] = {
        ...cards[currentIndex],
        ...currentFormValues,
      };
      setCards(updatedCards as CardData[]);
    });

    return () => subscription.unsubscribe();
  }, [currentIndex, cards, setCards]);

;

  // Update form when current index changes
  useEffect(() => {
    // Skip resetting if the form already matches the current card
    const currentCard = cards[currentIndex];
    const formValues = form.getValues();
    if (
      currentCard?.question === formValues.question &&
      currentCard?.answer === formValues.answer &&
      JSON.stringify(currentCard?.tags) === JSON.stringify(formValues.tags)
    ) {
      return;
    }

    form.reset({
      question: currentCard?.question || "",
      answer: currentCard?.answer || "",
      tags: currentCard?.tags || [],
    });
  }, [currentIndex, cards, form]);

  const handleAddCard = () => {
    const newCard: CardData = {
      id: `card-${Date.now()}`, // Generate unique ID
      question: "",
      answer: "",
      tags: [],
      order: cards?.length + 1,
    };

    setCards([...cards, newCard]);
    setCurrentIndex(cards.length); // Move to the new card
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDeleteCard = () => {
    if (cards.length <= 1) return; // Prevent deleting the last card

    const updatedCards = cards.filter((_, index) => index !== currentIndex);
    setCards(updatedCards);

    // Adjust current index if necessary
    if (currentIndex === cards.length - 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Form {...form}>
      <form>
        <Card className=" h-fit">
          <CardHeader>
            <CardDescription>
              Card {currentIndex + 1} of {cards.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Card name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Answer"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-sm rounded-full text-blue-600 bg-blue-300/40 hover:bg-blue-300/60"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant={"ghost"}
                          // variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-transparent hover:text-blue-600"
                          onClick={() => removeTag(field.value, tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <FormControl>
                    <Input
                      placeholder="New tag (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          const newTag = input.value.trim();
                          addTag(field.value, newTag);
                          input.value = "";
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {field.value ? (
                        <div className="relative">
                          <img
                            src={field.value}
                            alt="Card image"
                            className="w-full h-auto rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => form.setValue("image", "")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-[200px] bg-muted rounded-md">
                          <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  form.setValue(
                                    "image",
                                    reader.result as string
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </CardContent>

          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleDeleteCard}
                variant="outline"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size={"icon"}
                onClick={handlePrevCard}
                variant={"outline"}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={"outline"}
                size={"icon"}
                onClick={handleNextCard}
                disabled={currentIndex === cards.length - 1}
              >
                <ChevronRight className="h-4 w-4 " />
              </Button>
              <Button type="button" onClick={handleAddCard}>
                <PlusCircle className="h-4 w-4 " />
                Add card
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}