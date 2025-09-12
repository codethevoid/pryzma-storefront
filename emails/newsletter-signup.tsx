import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const NewsletterSignupEmail = ({ email, coupon }: { email: string; coupon: string }) => {
  return (
    <Html lang="en">
      <Preview>Welcome to Pryzma Newsletter!</Preview>
      <Tailwind>
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
              format: "woff2",
            }}
          />
        </Head>
        <Body className="mx-auto my-auto bg-white antialiased">
          <Container className="mx-auto w-full max-w-xl py-4">
            <Section>
              <Row className="items-center">
                <Column>
                  <div className="w-fit rounded-md border border-solid border-zinc-200 bg-zinc-100 p-0.5 shadow-sm">
                    <Img
                      src="https://pryzma-medusa.s3.us-east-1.amazonaws.com/logos/pryzma.png"
                      alt="pryzma logo"
                      width={30}
                      height={30}
                      className="rounded"
                    />
                  </div>
                </Column>
              </Row>
            </Section>
            <Section>
              <Heading className="text-lg font-medium text-black" style={{ marginBottom: 0 }}>
                Thank you for signing up to our newsletter!
              </Heading>
              <Text
                className="text-sm"
                style={{ marginTop: 2, color: "#52525B", lineHeight: "21px" }}
              >
                We're excited to have you on board. As a token of our appreciation, here is a
                special discount code just for you: <strong>{coupon}</strong>
              </Text>
              <Button
                className="block max-w-[180px] rounded-md bg-black py-2.5 text-center text-sm font-normal text-white no-underline"
                href={`https://pryzma.io`}
              >
                Start shopping
              </Button>
            </Section>
            <Section className="mt-6 border-t border-solid border-zinc-200">
              <Text className="text-[13px] text-zinc-500">
                If you have any questions, please contact us at{" "}
                <a href="mailto:support@pryzma.io" className="text-black">
                  support@pryzma.io
                </a>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
