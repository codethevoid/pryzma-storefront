import { Duration, Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const ratelimiter = ({ requests, duration }: { requests: number; duration: Duration }) => {
  if (process.env.NODE_ENV === "development") {
    return {
      limit: () => {
        return {
          success: true,
        };
      },
    };
  }
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, duration),
    analytics: true,
    prefix: "storefront",
  });
};
