import { about } from "./about";
import { blog } from "./blog";
import { contact } from "./contact";
import { hero } from "./hero";
import { id } from "./id";
import { navbar } from "./navbar";
import { profile } from "./profile";
import { projects } from "./projects";
import { skills } from "./skills";
import { ui } from "./ui";
import { work } from "./work";

// Every piece of copy the pages show, in English: each section has its own file, named after
// it. English is the language the site is written in; data/id/ holds the Indonesian of each
// section, in the same shape.
export const en = {
  ...profile,
  hero,
  about,
  skills,
  navbar,
  contact,
  work,
  blog,
  projects,
  ui,
} as const;

export type Messages = typeof en;

/** The languages the site is in, by the code vue-i18n and the <html lang> attribute use. */
export const messages = { en, id };
export type Locale = keyof typeof messages;
