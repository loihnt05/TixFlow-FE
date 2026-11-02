import type { Metadata } from "next";
import { NotFoundView } from "@/components/states/not-found-view";

export const metadata: Metadata = {
  title: "Page not found — TixFlow",
};

export default function NotFound() {
  return <NotFoundView />;
}
