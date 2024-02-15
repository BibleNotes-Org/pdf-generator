import { Writer } from "./src/writer/writer.ts";
import { getBookFrom } from "./src/book_gen/gen.ts";

const writer = new Writer();
writer.init();

const book = await getBookFrom("src/book_gen/sample");
writer.write(book);
