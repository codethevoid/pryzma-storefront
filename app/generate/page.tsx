import { Metadata } from "next";
import { GenerateClient } from "./client";
import { constructMetadata } from "@/utils/metadata";
import { constructFaqJsonLd } from "@/utils/construct-jsonld";

const faqs = [
  {
    question: "How does the AI image generator work?",
    answer:
      "Our AI image generator uses advanced machine learning models to turn text prompts into high-quality images instantly.",
  },
  {
    question: "Is this AI art generator really free?",
    answer:
      "Yes! You can generate AI images for free with no subscription required. We're committed to providing a fast and easy way to create stunning images.",
  },
  {
    question: "How many images can I generate?",
    answer:
      "You can generate up to 10 images per hour. If you need more, you can reach out to us at support@pryzma.io",
  },
  {
    question: "Can I use the images for commercial purposes?",
    answer:
      "Yes, you can use the AI-generated images for commercial purposes or any other purpose you want.",
  },
  {
    question: "What types of images can I create?",
    answer:
      "Generate realistic photos, digital art, concept designs, and abstract artwork in various styles.",
  },
  {
    question: "Do I need to download or install anything?",
    answer:
      "No, you don't need to download or install anything. You can generate images directly in your browser.",
  },
  {
    question: "Can I customize the AI-generated images?",
    answer:
      "Yes! You can refine your prompts, experiment with different styles, and generate multiple variations until you get the perfect image.",
  },
];

const faqJsonLd = constructFaqJsonLd(faqs);

export const metadata: Metadata = constructMetadata({
  title: "Free AI Image Generator - Pryzma",
  description: "Create stunning images and more for free with Pryzma's powerful AI Art Generator.",
  image: "https://cdn.pryzma.io/logos/pryzma-og.png",
});

const GeneratePage = () => {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <main className="min-h-[calc(100vh-375px)] px-4 py-8">
        <div className="mx-auto max-w-screen-xl">
          <GenerateClient faqs={faqs} />
        </div>
      </main>
    </>
  );
};

export default GeneratePage;
