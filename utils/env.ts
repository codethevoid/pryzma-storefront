const requiredEnvVars = [
  "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_S3_URL",
  "NEXT_PUBLIC_CDN_URL",
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
  "NEXT_PUBLIC_STRIPE_PK",
  "MEDUSA_SECRET_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY",
  "FIREWORKS_API_KEY",
  "UPSTASH_REDIS_TOKEN",
];

export const validateEnv = () => {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
};
