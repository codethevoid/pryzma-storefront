import { constructMetadata } from "@/utils/metadata";

export const metadata = constructMetadata({
  title: "Returns and Refunds - Pryzma",
});

const Returns = () => {
  return (
    <div className="min-h-[calc(100vh-330.5px)] p-4 py-12">
      <div className="prose prose-sm mx-auto max-w-screen-md dark:prose-invert">
        <h2>Returns and Refunds</h2>
        <h3>Basic returns</h3>
        <p>
          We provide a 30-day return policy for qualifying items that are new and in their original
          packaging. To initiate the return process, reach out to us at{" "}
          <a href="mailto:support@pryzma.io">support@pryzma.io</a>. The customer must pay for the
          shipping label to send the item back to us. It's important to include the order number and
          name in the box so we can process the return quickly and efficiently. If we receive the
          item in its original condition, we will issue a refund to the original payment method. If
          the item is damaged or missing parts, we will contact you to discuss the next steps.
        </p>
        <h3>Damaged, Defective, or Incorrect Items</h3>
        <p>
          To ensure a prompt resolution, we require our customers to report any damages, defects, or
          incorrect items within 72 hours of receiving it. Please contact us immediately if you
          receive a damaged or defective product so we can address the issue as soon as possible.
        </p>
        <h3>Return Shipping</h3>
        <p>
          If you wish to return an item, you are responsible for the shipping costs and must pay for
          the shipping label. Additionally, you are responsible for safely and securely packaging
          the item for return shipment. We recommend using a trackable shipping method to ensure the
          item is delivered to us successfully. Thank you for your understanding.
        </p>
        <h3>Refunds</h3>
        <p>
          We will issue a refund for returned items to the same card used for the original purchase.
          However, please note that we cannot be held responsible for lost refunds due to prepaid,
          canceled, or lost cards that you no longer possess. To ensure a successful refund, please
          ensure that your payment information is up-to-date and valid. Thank you for your
          understanding and cooperation in our return process.
        </p>
        <h3>Exchanges</h3>
        <p>
          At this time, we do not offer exchanges. If you would like to return an item, please
          follow our return process to initiate a refund. We apologize for any inconvenience this
          may cause and appreciate your understanding. If you have any questions or concerns, please
          do not hesitate to contact us.
        </p>
      </div>
    </div>
  );
};

export default Returns;
