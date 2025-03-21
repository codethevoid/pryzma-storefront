import { Metadata } from "next";
import { GenerateClient } from "./client";
import { constructMetadata } from "@/utils/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Free AI Image Generator - Pryzma",
  description: "Create stunning images and more for free with Pryzma's powerful AI Art Generator.",
  image: "https://cdn.pryzma.io/logos/pryzma-og.png",
});

const GeneratePage = () => {
  return (
    <div className="min-h-[calc(100vh-375px)] px-4 py-8">
      <div className="mx-auto max-w-screen-xl">
        <GenerateClient />
      </div>
    </div>
  );
};

export default GeneratePage;
