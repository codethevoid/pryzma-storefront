import { NextRequest, NextResponse } from "next/server";

const PRYZMA_HEADERS = { "x-powered-by": "Pryzma" };

const switchPrefix = "/products/switches";
const lubricantPrefix = "/products/lubricants";
const accessoryPrefix = "/products/accessories";

const redirectMap = {
  [`${switchPrefix}/java-switches`]: `${switchPrefix}/pryzma-java-switches`,
  [`${switchPrefix}/seafoam-switches`]: `${switchPrefix}/pryzma-seafoam-switches`,
  [`${switchPrefix}/akko-fairy-silent`]: `${switchPrefix}/akko-fairy-silent-switches`,
  [`${switchPrefix}/akko-v3-cream-blue`]: `${switchPrefix}/akko-v3-creamy-blue-switches`,
  [`${switchPrefix}/akko-v3-cream-blue-pro`]: `${switchPrefix}/akko-v3-creamy-blue-pro-switches`,
  [`${switchPrefix}/akko-v3-silver-pro`]: `${switchPrefix}/akko-v3-silver-pro-switches`,
  [`${switchPrefix}/akko-v3-cream-yellow-pro`]: `${switchPrefix}/akko-v3-creamy-yellow-pro-switches`,
  [`${switchPrefix}/akko-v3-matcha-green-pro`]: `${switchPrefix}/akko-v3-matcha-green-pro-switches`,
  [`${switchPrefix}/akko-v3-lavender-purple-pro`]: `${switchPrefix}/akko-v3-lavender-purple-pro-switches`,
  [`${switchPrefix}/akko-v3-cream-black-pro`]: `${switchPrefix}/akko-v3-creamy-black-pro-switches`,
  [`${switchPrefix}/gateron-box-ink-v2`]: `${switchPrefix}/gateron-box-ink-v2-black-switches`,
  [`${switchPrefix}/gateron-box-ink-v2-pink`]: `${switchPrefix}/gateron-box-ink-v2-pink-switches`,
  [`${switchPrefix}/gateron-north-pole`]: `${switchPrefix}/gateron-new-north-pole-switches`,
  [`${switchPrefix}/gateron-oil-king`]: `${switchPrefix}/gateron-oil-king-switches`,
  [`${switchPrefix}/gateron-milky-yellow-pro`]: `${switchPrefix}/gateron-milky-yellow-pro-switches`,
  [`${switchPrefix}/gateron-mini-i`]: `${switchPrefix}/gateron-mini-i-switches`,
  [`${switchPrefix}/gateron-mountain-top`]: `${switchPrefix}/gateron-mountain-top-switches`,
  [`${switchPrefix}/gateron-baby-kangaroo`]: `${switchPrefix}/gateron-baby-kangaroo-switches`,
  [`${switchPrefix}/gateron-ink-v2-black`]: `${switchPrefix}/gateron-ink-v2-black-switches`,
  [`${switchPrefix}/gateron-ink-v2-red`]: `${switchPrefix}/gateron-ink-v2-red-switches`,
  [`${switchPrefix}/gateron-ink-v2-yellow`]: `${switchPrefix}/gateron-ink-v2-yellow-switches`,
  [`${switchPrefix}/gateron-curry`]: `${switchPrefix}/gateron-ef-curry-switches`,
  [`${switchPrefix}/gateron-melodic`]: `${switchPrefix}/gateron-melodic-switches`,
  [`${switchPrefix}/gateron-luciola`]: `${switchPrefix}/gateron-luciola-switches`,
  [`${switchPrefix}/gateron-smoothie`]: `${switchPrefix}/gateron-smoothie-switches`,
  [`${switchPrefix}/gateron-grayish`]: `${switchPrefix}/gateron-ef-grayish-switches`,
  [`${switchPrefix}/gateron-yellow-pro`]: `${switchPrefix}/gateron-yellow-pro-switches`,
  [`${switchPrefix}/ktt-rose`]: `${switchPrefix}/ktt-rose-switches`,
  [`${switchPrefix}/ktt-kang-white-v3`]: `${switchPrefix}/ktt-kang-white-v3-switches`,
  [`${switchPrefix}/ktt-strawberry-v2`]: `${switchPrefix}/ktt-strawberry-v2-switches`,
  [`${switchPrefix}/ktt-bear`]: `${switchPrefix}/ktt-bear-switches`,
  [`${switchPrefix}/ktt-vanilla-ice-cream`]: `${switchPrefix}/ktt-vanilla-ice-cream-switches`,
  [`${switchPrefix}/tecsee-strawberry-ice`]: `${switchPrefix}/tecsee-strawberry-ice-switches`,
  [`${switchPrefix}/tecsee-carrot`]: `${switchPrefix}/tecsee-carrot-switches`,
  [`${switchPrefix}/tecsee-jadeite`]: `${switchPrefix}/tecsee-jadeite-switches`,
  [`${switchPrefix}/tecsee-ruby-v2`]: `${switchPrefix}/tecsee-ruby-v2-switches`,
  [`${switchPrefix}/tecsee-sapphire-v2`]: `${switchPrefix}/tecsee-sapphire-v2-switches`,
  // LUBRICANTS
  [`${lubricantPrefix}/205G0-lubricant`]: `${lubricantPrefix}/krytox-gpl-205-grade-0-lubricant`,
  // ACCESSORIES
  [`${accessoryPrefix}/gateron-ink-stabilizers`]: `${accessoryPrefix}/gateron-ink-v2-stabilizers`,
  [`${accessoryPrefix}/lube-brushes`]: `${accessoryPrefix}/nylon-lube-brushes`,
  [`${accessoryPrefix}/cat-switch-opener`]: `${accessoryPrefix}/switch-opener`,
  [`${accessoryPrefix}/stem-holder`]: `${accessoryPrefix}/switch-stem-holder`,
  // COLLECTIONS
  [`${switchPrefix}/linear`]: `/collections/linear-switches`,
  [`${switchPrefix}/tactile`]: `/collections/tactile-switches`,
  [`${switchPrefix}/clicky`]: `/collections/clicky-switches`,
  [`${switchPrefix}/silent`]: `/collections/silent-switches`,
  [`${switchPrefix}/pryzma`]: `/collections/pryzma-switches`,
  [`${switchPrefix}/gateron`]: `/collections/gateron-switches`,
  [`${switchPrefix}/akko`]: `/collections/akko-switches`,
  [`${switchPrefix}/ktt`]: `/collections/ktt-switches`,
  [`${switchPrefix}/tecsee`]: `/collections/tecsee-switches`,
};

export const middleware = async (req: NextRequest) => {
  const url = req.nextUrl;
  const path = url.pathname;

  // check if path includes "sampler" and redirect to /products/samples
  if (path.includes("sampler")) {
    return NextResponse.redirect(new URL("/products/samples", req.url), {
      headers: PRYZMA_HEADERS,
      status: 308, // permanent redirect
    });
  }

  if (redirectMap[path as keyof typeof redirectMap]) {
    return NextResponse.redirect(new URL(redirectMap[path as keyof typeof redirectMap], req.url), {
      headers: PRYZMA_HEADERS,
      status: 308, // permanent redirect
    });
  }

  // otherwise, continue like normal
  return NextResponse.next({ headers: PRYZMA_HEADERS });
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
