import type { Metadata } from "next";
import { Received } from "@/components/ui/Received";

export const metadata: Metadata = { title: "Quotation request received", robots: { index: false } };

export default function RfqReceived() {
  return <Received kind="rfq" />;
}
