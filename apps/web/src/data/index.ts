import { about } from "./about";
import { blog } from "./blog";
import { contact } from "./contact";
import { hero } from "./hero";
import { navbar } from "./navbar";
import { profile } from "./profile";
import { projects } from "./projects";
import { skills } from "./skills";
import { work } from "./work";

// Every piece of copy the pages show. Each section has its own file, named after it.
export const DATA = {
  ...profile,
  hero,
  about,
  skills,
  navbar,
  contact,
  work,
  blog,
  projects,
} as const;
