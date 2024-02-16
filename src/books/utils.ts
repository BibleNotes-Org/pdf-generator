import { Writer } from "../writer/writer.ts";
import { getBookFrom } from "./gen.ts";

export async function GenSampleBook() {
  const path =
    "/Users/mac/Downloads/Programs/personal/notes_pdf/server/src/books/sample/";
  const book = await getBookFrom(path);

  const writer = new Writer();
  writer.write(book);
}

/**
Generates PDF for a book in the given directory.
@param path the directory path
 */
export async function GenBookFrom(path: string) {
  const book = await getBookFrom(path);
  const writer = new Writer();
  writer.write(book, path);
}

/**
Recursively generates PDFs for each book in the given directory.
@param path the directory path
 */
export async function GenBooksFrom(path: string) {
  const dirs: Deno.DirEntry[] = [];
  for await (const dirEntry of Deno.readDir(path)) {
    if (dirEntry.name.startsWith(".")) continue;
    if (dirEntry.isDirectory) dirs.push(dirEntry);
  }

  for (const dir of dirs) {
    await GenBookFrom(`${path}/${dir.name}`);
  }
}
