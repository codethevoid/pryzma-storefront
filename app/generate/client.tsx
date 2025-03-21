"use client";

import { Textarea, Heading, Button, toast, Text, Tooltip, TooltipProvider } from "@medusajs/ui";
import { ArrowDownTray, WandSparkle } from "@medusajs/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const formSchema = z.object({
  prompt: z.string().min(1, { message: "Please enter a prompt" }),
});

export const GenerateClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt: values.prompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to generate image");
        return;
      }

      const data = (await res.json()) as { images: string[] };
      console.log(data);
      if (data.images?.length > 0) {
        setImages(images.length > 0 ? [...data.images, ...images] : data.images);
      } else {
        toast.error("Failed to generate image");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-24 pb-24 pt-32 max-md:space-y-20 max-md:pb-12 max-md:pt-20">
      <div>
        <div className="space-y-8 max-md:space-y-6">
          <Heading className="text-center text-4xl font-bold max-md:text-2xl max-md:font-semibold">
            What can I help you generate?
          </Heading>
          <div className="mx-auto max-w-3xl space-y-1.5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Textarea
                aria-invalid={!!errors.prompt}
                placeholder="Enter a prompt to generate an image"
                className="h-24 p-3"
                {...register("prompt")}
              />
            </form>
            <div className="flex justify-between">
              <div className="flex items-center gap-2 max-sm:hidden">
                <Button
                  variant="secondary"
                  size="small"
                  className="h-6 rounded-full px-3 font-normal"
                  onClick={() => {
                    const prompt =
                      "Cyberpunk workspace with holographic displays, neon purple and blue lighting, floating mechanical keyboard, and rain-streaked window overlooking a neon city.";
                    setValue("prompt", prompt, { shouldValidate: true });
                    handleSubmit(onSubmit)();
                  }}
                  disabled={isLoading}
                >
                  Cyberpunk Desk
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  className="h-6 rounded-full px-3 font-normal"
                  onClick={() => {
                    const prompt =
                      "Indoor zen garden room with raked sand patterns, moss-covered rocks, and a small bamboo fountain. Bonsai trees on wooden pedestals, soft natural light through shoji screens, and minimalist tatami flooring. Peaceful atmosphere with muted earth tones and gentle shadows.";
                    setValue("prompt", prompt, { shouldValidate: true });
                    handleSubmit(onSubmit)();
                  }}
                  disabled={isLoading}
                >
                  Zen Garden
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  className="h-6 rounded-full px-3 font-normal"
                  onClick={() => {
                    const prompt =
                      "Massive lunar space station complex built into moon's crater, with gleaming metallic domes and spires reaching into space. Orbital rings connecting multiple habitation modules, landing pads with spacecraft, and Earth visible in the starlit background. Solar arrays and communication dishes catching light from distant sun.";
                    setValue("prompt", prompt, { shouldValidate: true });
                    handleSubmit(onSubmit)();
                  }}
                  disabled={isLoading}
                >
                  Space Station
                </Button>
              </div>
              <Button
                type="submit"
                size="small"
                disabled={!watch("prompt")?.trim() || isLoading}
                isLoading={isLoading}
                className="h-7 w-[95px] max-sm:h-9 max-sm:w-full"
                onClick={handleSubmit(onSubmit)}
              >
                <WandSparkle className="size-4" />
                Generate
              </Button>
            </div>
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <div className="space-y-4">
          <Text weight="plus" size="large">
            Generated images
          </Text>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-md:gap-3">
              {images.map((image) => (
                <div
                  key={image}
                  className="relative aspect-square overflow-hidden rounded-md shadow-borders-base"
                >
                  <img src={image} alt="Generated image" className="h-full w-full object-cover" />
                  <TooltipProvider>
                    <Tooltip content="Download">
                      <Button size="small" className="absolute bottom-2 right-2" asChild>
                        <a href={image} download={`pryzma-generated-image-${Date.now()}.png`}>
                          <ArrowDownTray />
                        </a>
                      </Button>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
