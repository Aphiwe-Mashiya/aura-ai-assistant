import { createFileRoute } from "@tanstack/react-router";
import { ProductivityApp } from "@/components/productivity-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      { name: "description", content: "Create emails, summarize meetings, and prioritize your work in one private productivity workspace." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "A private workspace for clearer communication, meeting outcomes, and focused plans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductivityApp,
});
