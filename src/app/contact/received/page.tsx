import type { Metadata } from "next";
import { Received } from "@/components/ui/Received";

export const metadata: Metadata = { title: "Message received", robots: { index: false } };

export default function ContactReceived() {
  return <Received kind="contact" />;
}
