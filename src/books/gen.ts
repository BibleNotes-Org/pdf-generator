// @deno-types="npm:@types/markdown-it"
import markdownit from "npm:markdown-it";
import { Book, Chapter, Content, Quote, Section } from "../writer/types.ts";

export async function getBookFrom(path: string): Promise<Book> {
  const chapter_paths: Deno.DirEntry[] = [];
  for await (const dirEntry of Deno.readDir(path)) {
    if (dirEntry.isDirectory) chapter_paths.push(dirEntry);
  }

  chapter_paths.sort((a, b) => a.name.localeCompare(b.name));

  const chapters: Chapter[] = [];
  for (let i = 0; i < chapter_paths.length; i++) {
    const p = chapter_paths[i];

    const chapter_path = `${path}/${p.name}`;
    const files: Deno.DirEntry[] = [];
    for await (const dirEntry of Deno.readDir(chapter_path)) {
      if (dirEntry.name.endsWith(".json")) continue;
      files.push(dirEntry);
    }

    files.sort((a, b) => a.name.localeCompare(b.name));

    const sections: Section[] = [];
    for (const file of files) {
      let heading = undefined;
      const contents: Content[] = [];

      const data = Deno.readTextFileSync(`${chapter_path}/${file.name}`);
      const md = new markdownit();
      const result = md.parse(data, {});

      for (let i = 0; i < result.length; i++) {
        const token = result[i];

        if (token.type === "heading_open") {
          heading = result[i + 1].content;
        }
        if (token.type === "paragraph_open") {
          contents.push(result[i + 1].content);
        }
        if (token.type === "fence" && token.tag === "code") {
          const quote: Quote = {
            content: token.content,
            verse: token.info,
          };
          contents.push(quote);
        }
      }

      const section: Section = {
        index: Number(file.name.substring(0, 1)),
        heading: heading,
        contents: contents,
      };
      sections.push(section);
    }

    const json = JSON.parse(
      Deno.readTextFileSync(`${chapter_path}/_chapter.json`),
    );
    const chapter: Chapter = {
      index: i + 1,
      name: json.name,
      sections: sections,
    };
    chapters.push(chapter);
  }

  const json = JSON.parse(Deno.readTextFileSync(`${path}/_book.json`));
  const title = json.title;

  const book: Book = { title: title, chapters: chapters };
  return book;
}
