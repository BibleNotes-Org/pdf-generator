import { desc1, desc2, quote, verse } from "./texts.ts";
import { Book } from "../types.ts";
import { Chapter, Quote, Section } from "../types.ts";

const q: Quote = { content: quote, verse: verse };
const section: Section = {
  index: 1,
  heading: "A story of Ammy and Benjamin",
  contents: [
    desc1,
    q,
    desc2,
  ],
};

const chapter1: Chapter = {
  index: 1,
  name: "Introduction",
  sections: [
    section,
  ],
};

const chapters: Chapter[] = [chapter1];

export const book : Book = {title: "OliveTree Study App", chapters: chapters};
