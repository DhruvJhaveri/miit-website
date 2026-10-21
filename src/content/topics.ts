import { articleTopics } from "./articles";

export const topicSlug = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const topics = articleTopics.map((name) => ({ name, slug: topicSlug(name) }));
export const topicBySlug = (slug: string) => topics.find((t) => t.slug === slug);
