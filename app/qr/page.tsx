import { constructMetadata } from "@/utils/metadata";
import { QRClient } from "./client";
import { constructFaqJsonLd } from "@/utils/construct-jsonld";

const faqs = [
  {
    question: "How does the QR code generator work?",
    answer:
      "Our free QR code generator instantly creates high-quality QR codes from your text, URLs, WiFi credentials, contact info, and more. Simply select a template, enter your information, and generate your QR code in seconds.",
  },
  {
    question: "Is this QR code generator really free?",
    answer:
      "Yes! You can generate unlimited QR codes completely free with no registration or subscription required. Create as many QR codes as you need for personal or commercial use.",
  },
  {
    question: "What types of QR codes can I create?",
    answer:
      "Generate QR codes for websites, WiFi networks, emails, phone numbers, SMS messages, social media profiles, locations, and plain text. Our quick action buttons make it easy to create any type of QR code.",
  },
  {
    question: "Can I download the generated QR codes?",
    answer:
      "Absolutely! All generated QR codes can be downloaded as high-resolution PNG images that are perfect for printing, sharing, or using in your projects.",
  },
  {
    question: "Do the QR codes expire?",
    answer:
      "No, the QR codes generated are static and will never expire. They contain the information directly, so they'll work forever without depending on our service.",
  },
  {
    question: "Can I use these QR codes for commercial purposes?",
    answer:
      "Yes, you can use all generated QR codes for any purpose including commercial use, marketing materials, business cards, flyers, and any other application.",
  },
  {
    question: "What's the difference between static and dynamic QR codes?",
    answer:
      "Our generator creates static QR codes, which means the data is embedded directly in the code. They work offline and never expire, but you can't change the content after creation.",
  },
  {
    question: "How do I create a WiFi QR code?",
    answer:
      "Click the WiFi button, enter your network name (SSID), password, and select the security type (WPA, WEP, or Open). The generated QR code will allow others to connect to your WiFi instantly.",
  },
  {
    question: "Are there any limits on QR code generation?",
    answer:
      "No limits! Generate as many QR codes as you need. The service works entirely in your browser, so there are no server restrictions or daily limits.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No installation required! The QR code generator works directly in your web browser. It's compatible with all modern browsers on desktop and mobile devices.",
  },
  {
    question: "What size are the generated QR codes?",
    answer:
      "QR codes are generated at 2048x2048 pixels by default, which provides excellent quality for both digital use and printing. The PNG format ensures crisp, clear codes. SVG format is also available.",
  },
  {
    question: "Can I create QR codes for social media profiles?",
    answer:
      "Yes! We support QR codes for Instagram, Twitter, LinkedIn, Facebook, TikTok, and YouTube. Just enter your username or profile URL, and we'll create the perfect QR code.",
  },
  {
    question: "How do I scan QR codes?",
    answer:
      "Most smartphones can scan QR codes using the built-in camera app. Simply point your camera at the QR code, and your phone will automatically detect and process it.",
  },
  {
    question: "Are my QR codes private and secure?",
    answer:
      "Yes, all QR code generation happens locally in your browser. We don't store or transmit your data to any servers, ensuring complete privacy and security.",
  },
  {
    question: "Can I create location QR codes?",
    answer:
      "Absolutely! Enter latitude and longitude coordinates to create location QR codes. When scanned, they'll open the location in the user's default maps application.",
  },
];

const faqJsonLd = constructFaqJsonLd(faqs);

export const metadata = constructMetadata({
  title: "Free QR Code Generator - Pryzma",
  description:
    "Generate QR codes instantly for WiFi, social media, contact info, and more. Completely free with no limits or registration required.",
  image: "https://cdn.pryzma.io/logos/pryzma-og.png",
});

export default function QRPage() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <main className="min-h-[calc(100vh-403px)] px-4 py-8">
        <div className="mx-auto max-w-screen-lg">
          <QRClient faqs={faqs} />
        </div>
      </main>
    </>
  );
}
