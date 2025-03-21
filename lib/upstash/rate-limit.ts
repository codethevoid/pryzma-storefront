import { Duration, Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const ratelimiter = ({ requests, duration }: { requests: number; duration: Duration }) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, duration),
    analytics: true,
    prefix: "storefront",
  });
};
