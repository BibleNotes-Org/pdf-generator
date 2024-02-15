import { Writer } from "./src/writer.ts";
import { book } from "./src/sample/book.ts";

const writer = new Writer();
writer.init();

writer.write(book)
