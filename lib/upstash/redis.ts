import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: "https://cute-gar-34820.upstash.io",
  token: process.env.UPSTASH_REDIS_TOKEN,
});
