import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

type PurchaseReceiptEmailProps = {
  product: {
    name: string;
    imagePath: string;
    description: string;
  };
  order: { id: string; createdAt: Date; pricePaid: number };
  downloadVerificationId: string;
};

export const PurchaseReceiptEmail = ({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) => (
  <Html>
    <Preview>Download {product.name} and view receipt</Preview>
    <Tailwind>
      <Head />
      <Body className="font-sans bg-white">
        <Container className="max-w-xl">
          <Heading>Purchase Receipt</Heading>
          <OrderInformation
            order={order}
            product={product}
            downloadVerificationId={downloadVerificationId}
          />
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
