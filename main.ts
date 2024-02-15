import { Writer } from "./src/writer/writer.ts";
import { book } from "./src/writer/sample/book.ts";

const writer = new Writer();
writer.init();

writer.write(book)
