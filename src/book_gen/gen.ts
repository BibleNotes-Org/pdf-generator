// @deno-types="npm:@types/markdown-it"
import markdownit from "npm:markdown-it";
import { Chapter, Content } from "../writer/types.ts";

// read chapters
const data = Deno.readTextFileSync("src/book_gen/sample/chapter_1/1.md");

const md = new markdownit();
const result = md.parse(data, {});

type Data = "heading" | "paragraph" | "blockquote";
var cond = true;
let chapters: Chapter[] = [];

var heading = "";
var contents: Content[] = [];
for (let i = 0; i < result.length; i++) {
  const token = result[i];
  console.log(token.type)

  if (token.type === "heading_open") {
    heading = result[i + 1].content;
  }
  if (token.type === "paragraph_open") {
    contents.push(result[i + 1].content);
  }
  if (token.type === "fence") {
    console.log(result[i + 1]);
   // contents.push(result[i + 1].content);
  }
}
chapters.push({
  index: 1,
  name: heading,
  sections: [{ index: 1, contents: contents }],
});

console.log("Chapters");
console.log(chapters);
