import type { Messages } from "../messages";
import { about } from "./about";
import { blog } from "./blog";
import { contact } from "./contact";
import { hero } from "./hero";
import { navbar } from "./navbar";
import { notFound } from "./notFound";
import { profile } from "./profile";
import { projects } from "./projects";
import { skills } from "./skills";
import { ui } from "./ui";
import { work } from "./work";

/** The same shape as T, with any text in place of the English text. */
type Translated<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer Item)[]
        ? readonly Translated<Item>[]
        : { readonly [Key in keyof T]: Translated<T[Key]> };

// The site in Indonesian: every section of the English copy, in the same shape. Skill groups
// are the exception to "same shape": they are keyed by their own, translated, names.
export const id = {
  ...profile,
  hero,
  about,
  skills,
  navbar,
  contact,
  work,
  blog,
  notFound,
  projects,
  ui,
} satisfies Omit<Translated<Messages>, "skills"> & {
  skills: Record<string, Translated<Messages["skills"][keyof Messages["skills"]]>>;
};
