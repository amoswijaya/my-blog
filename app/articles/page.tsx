import type { Metadata } from "next";
import ArticlesPage from "./articles-page";

export const metadata: Metadata = {
  title: {
    template: "%s | Web Blog",
    default: "Articles ",
  },
  description: "Generated by create next app",
};

export default function Articles() {
  return <ArticlesPage />;
}
