"use client";

import { Button, Heading, Select, Text, Input, Label, toast, Textarea } from "@medusajs/ui";
import { clx } from "@medusajs/ui";
import { Plus } from "@medusajs/icons";
import { useEffect, useRef, useState } from "react";
import { Globe, Wifi, Mail, Instagram, Phone, MapPin, FileCode2 } from "lucide-react";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import { useWindowWidth } from "@react-hook/window-size";
import { QRCodeSVG } from "qrcode.react";
import { JSX } from "react/jsx-runtime";

const XIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4"
    >
      <path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"></path>
    </svg>
  );
};

type BaseField = {
  name: string;
  label: string;
  required: boolean;
  placeholder: string;
};

type SelectField = BaseField & {
  type: "select";
  options: Array<{
    label: string;
    value: string;
  }>;
};

type InputField = BaseField & {
  type: "text" | "email" | "tel" | "password" | "number" | "textarea";
};

type Field = SelectField | InputField;

type QuickAction = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }> | (() => JSX.Element);
  description: string;
  fields: Field[];
};

const quickActions: QuickAction[] = [
  {
    id: "website",
    label: "Website",
    icon: Globe,
    description: "Link to any website",
    fields: [
      {
        name: "url",
        label: "Website/link URL",
        type: "text",
        required: true,
        placeholder: "https://example.com",
      },
    ],
  },
  {
    id: "wifi",
    label: "WiFi",
    icon: Wifi,
    description: "Share WiFi credentials",
    fields: [
      {
        name: "ssid",
        label: "Network name (SSID)",
        type: "text",
        required: true,
        placeholder: "Your network name",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: false,
        placeholder: "Leave blank for open networks",
      },
      {
        name: "security",
        label: "Security type",
        type: "select",
        options: [
          {
            label: "WPA/WPA2",
            value: "WPA",
          },
          {
            label: "WEP",
            value: "WEP",
          },
          {
            label: "Open",
            value: "nopass",
          },
        ],
        placeholder: "Select security type",
        required: false,
      },
    ],
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    description: "Create email link",
    fields: [
      {
        name: "email",
        label: "Email address",
        type: "email",
        required: true,
        placeholder: "email@example.com",
      },
    ],
  },
  {
    id: "phone",
    label: "Phone",
    icon: Phone,
    description: "Share phone number",
    fields: [
      {
        name: "phone",
        label: "Phone number",
        type: "tel",
        required: true,
        placeholder: "+1234567890",
      },
    ],
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    description: "Link to Instagram profile",
    fields: [
      {
        name: "instausername",
        label: "Instagram username",
        type: "text",
        required: true,
        placeholder: "username (without @)",
      },
    ],
  },
  {
    id: "x",
    label: "X/Twitter",
    icon: XIcon,
    description: "Link to X profile",
    fields: [
      {
        name: "xusername",
        label: "X Username",
        type: "text",
        required: true,
        placeholder: "username (without @)",
      },
    ],
  },
  {
    id: "location",
    label: "Location",
    icon: MapPin,
    description: "Share GPS coordinates",
    fields: [
      {
        name: "latitude",
        label: "Latitude",
        type: "number",
        required: true,
        placeholder: "e.g. 37.7749",
      },
      {
        name: "longitude",
        label: "Longitude",
        type: "number",
        required: true,
        placeholder: "e.g. -122.4194",
      },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    icon: FileCode2,
    description: "Custom text or any data format",
    fields: [
      {
        name: "customdata",
        label: "Text or data to encode",
        type: "textarea",
        required: true,
        placeholder: "Any text or data",
      },
    ],
  },
];

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const QRClient = ({ faqs }: { faqs: { question: string; answer: string }[] }) => {
  const [selectedAccordion, setSelectedAccordion] = useState<number | null>(0);
  const [selectedAction, setSelectedAction] = useState<(typeof quickActions)[0]["id"]>("website");

  const width = useWindowWidth();
  const flickeringGridContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<SVGSVGElement>(null);

  const [flickeringGridWidth, setFlickeringGridWidth] = useState(0);
  const [downloadType, setDownloadType] = useState<"png" | "svg">("png");

  const [qrValue, setQrValue] = useState("");
  const defaultQrValue = "https://pryzma.io";

  const onConfirmForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);

    let value = "";

    switch (selectedAction) {
      case "website":
        const url = formdata.get("url")?.toString().trim();
        if (!url) {
          toast.error("Please enter a valid url");
          return;
        }
        value = url;
        break;
      case "wifi":
        const ssid = formdata.get("ssid")?.toString().trim();
        const password = formdata.get("password")?.toString().trim() || "";
        let security = formdata.get("security")?.toString().trim() || "";

        if (!ssid) {
          toast.error("Please enter a valid network name (SSID)");
          return;
        }

        if (password && !security) {
          toast.error("Please select a security type");
          return;
        }

        if (!password && !security) {
          security = "nopass";
        }

        if (security !== "nopass" && !password) {
          toast.error("Please enter a password or select open security");
          return;
        }

        value = `WIFI:T:${security};S:${ssid};P:${password};;`;
        break;
      case "email":
        const email = formdata.get("email")?.toString().trim();
        if (!email || !email.includes("@")) {
          toast.error("Please enter a valid email address");
          return;
        }

        value = `mailto:${email}`;
        break;
      case "phone":
        const phone = formdata.get("phone")?.toString().trim();
        if (!phone) {
          toast.error("Please enter a valid phone number");
          return;
        }

        value = `tel:${phone}`;
        break;
      case "instagram":
        const instaUsername = formdata.get("instausername")?.toString().trim();
        if (!instaUsername) {
          toast.error("Please enter your Instagram username");
          return;
        }

        value = `https://instagram.com/${instaUsername}`;
        break;
      case "x":
        const xUsername = formdata.get("xusername")?.toString().trim();
        if (!xUsername) {
          toast.error("Please enter your X username");
          return;
        }

        value = `https://x.com/${xUsername}`;
        break;
      case "location":
        const latitude = formdata.get("latitude")?.toString().trim();
        const longitude = formdata.get("longitude")?.toString().trim();

        if (!latitude || !longitude || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
          toast.error("Please enter valid coordinates");
          return;
        }

        value = `geo:${latitude},${longitude}`;
        break;
      case "custom":
        const customdata = formdata.get("customdata")?.toString().trim();
        if (!customdata) {
          toast.error("Please enter some text or data to encode");
          return;
        }

        value = customdata;
        break;
      default:
        value = defaultQrValue;
        break;
    }

    setQrValue(value);
    toast.success("Your QR code is ready!");
    // send request to backend to create qr code details in db
    // so we can track usage and analytics
    try {
      await fetch("/api/qr/insert", {
        method: "POST",
        body: JSON.stringify({
          qrCodeValue: value,
          template: selectedAction,
        }),
      });
    } catch (e) {
      console.error("Failed to insert QR code details", e);
    }
  };

  const handleDownload = () => {
    if (!qrCodeRef.current) return;

    if (downloadType === "png") {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d");
      const svg = qrCodeRef.current;

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.src = url;

      img.onload = () => {
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const filename = `qr-code-${new Date().getTime()}`;
            downloadBlob(blob, filename);
          }
        });
      };
    } else {
      const svg = qrCodeRef.current;
      const filename = `qr-code-${new Date().getTime()}.svg`;
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      downloadBlob(blob, filename);
    }
  };

  useEffect(() => {
    if (flickeringGridContainerRef.current) {
      setFlickeringGridWidth(flickeringGridContainerRef.current.clientWidth);
    }
  }, [width]);

  return (
    <div className="space-y-20 pb-10 pt-4">
      <section className="space-y-12">
        <div className="space-y-3">
          <Heading className="text-center text-4xl font-semibold max-md:text-2xl">
            QR code generator
          </Heading>
          <Text size="large" className="mx-auto max-w-prose text-center text-subtle-foreground">
            Generate QR codes instantly for WiFi, social media, contact info, and more.
            <br className="max-md:hidden" /> Choose a type to create a custom QR code all for free.
          </Text>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2.5 rounded-md bg-zinc-50 p-4 pt-2.5 shadow-borders-base transition-all dark:bg-ui-bg-field">
              <div>
                <Heading level="h2">Select a type</Heading>
                <Text size="small" className="text-subtle-foreground">
                  Select the type of code to create
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant={selectedAction === action.id ? "primary" : "secondary"}
                      className="flex w-full flex-col items-center space-y-1.5 px-2.5 py-3"
                      onClick={() => setSelectedAction(action.id)}
                    >
                      <Icon className="size-4" />
                      <span>{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            <form
              onSubmit={onConfirmForm}
              className="h-fit space-y-2.5 rounded-md bg-zinc-50 p-4 pt-2.5 shadow-borders-base transition-all dark:bg-ui-bg-field"
            >
              <div>
                <Heading level="h2">
                  {quickActions.find((action) => selectedAction === action.id)?.label}
                </Heading>
                <Text size="small" className="text-subtle-foreground">
                  {quickActions.find((action) => selectedAction === action.id)?.description}
                </Text>
              </div>
              <div className="space-y-3">
                {quickActions
                  .find((action) => selectedAction === action.id)
                  ?.fields.map((field) => (
                    <div key={field.name}>
                      {field.type === "select" ? (
                        <div className="space-y-1.5">
                          <Label htmlFor={field.name}>{field.label}</Label>
                          <Select name={field.name}>
                            <Select.Trigger className="w-full">
                              <Select.Value placeholder={field.placeholder} />
                            </Select.Trigger>
                            <Select.Content>
                              {field.options.map((option: { value: string; label: string }) => (
                                <Select.Item key={option.value} value={option.value}>
                                  {option.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select>
                        </div>
                      ) : field.type === "number" ? (
                        <div className="space-y-1.5">
                          <Label htmlFor={field.name}>{field.label}</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            type="number"
                            step="any"
                          />
                        </div>
                      ) : field.type === "textarea" ? (
                        <div className="space-y-1.5">
                          <Label htmlFor={field.name}>{field.label}</Label>
                          <Textarea
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            className="h-28"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <Label htmlFor={field.name}>{field.label}</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                <Button type="submit" variant="primary" className="w-full">
                  Generate QR code
                </Button>
              </div>
            </form>
          </div>
          <div className="h-fit space-y-2.5 rounded-md bg-zinc-50 p-4 pt-2.5 shadow-borders-base transition-all dark:bg-ui-bg-field">
            <Heading level="h2">Your QR code</Heading>
            <div
              className="relative flex h-48 items-center justify-center overflow-hidden rounded bg-white shadow-borders-base dark:bg-zinc-950"
              ref={flickeringGridContainerRef}
            >
              <FlickeringGrid
                className="absolute inset-0 hidden size-full dark:block"
                color="#fff"
                height={196}
                width={flickeringGridWidth + 10}
                gridGap={2}
                squareSize={2}
                maxOpacity={0.15}
              />

              <FlickeringGrid
                className="absolute inset-0 z-0 size-full dark:hidden"
                color="#000"
                height={196}
                width={flickeringGridWidth + 10}
                gridGap={2}
                squareSize={2}
                maxOpacity={0.15}
              />
              <div className="z-10 size-32 rounded-md border bg-white p-2.5 dark:border-zinc-800 dark:bg-black">
                <QRCodeSVG
                  value={qrValue || defaultQrValue}
                  ref={qrCodeRef}
                  size={108}
                  level="H"
                  className="hidden"
                />
                <QRCodeSVG
                  value={qrValue || defaultQrValue}
                  size={108}
                  level="H"
                  fgColor="#FFFFFF"
                  bgColor="#000000"
                  className="hidden dark:block"
                />
                <QRCodeSVG
                  value={qrValue || defaultQrValue}
                  size={108}
                  level="H"
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                  className="dark:hidden"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" className="w-full" onClick={handleDownload}>
                Download
              </Button>
              <Select
                value={downloadType}
                onValueChange={(value) => setDownloadType(value as "svg" | "png")}
              >
                <Select.Trigger className="w-20">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="png">PNG</Select.Item>
                  <Select.Item value="svg">SVG</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-label="Frequently asked questions"
        className="mx-auto max-w-3xl space-y-4 max-md:space-y-3"
      >
        <Heading level="h3" className="text-base">
          Frequently Asked Questions
        </Heading>
        <div className="w-full rounded-md bg-zinc-50 shadow-borders-base dark:bg-zinc-900/50">
          {faqs.map((faq, index) => (
            <div key={faq.question} className={clx("gap-4", index !== 0 && "border-t")}>
              <div
                className="flex cursor-pointer items-center justify-between gap-4 p-4"
                role="button"
                onClick={() => setSelectedAccordion(selectedAccordion === index ? null : index)}
              >
                <Heading level="h3" className="max-md:text-[0.81rem]">
                  {faq.question}
                </Heading>

                <Plus
                  className={clx(
                    "text-subtle-foreground transition-all",
                    selectedAccordion === index && "rotate-45",
                  )}
                />
              </div>
              <div
                className={clx(
                  "grid grid-rows-[0fr] transition-all",
                  selectedAccordion === index && "grid-rows-[1fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4">
                    <Text size="small" className="text-subtle-foreground">
                      {faq.answer}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
