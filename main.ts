import * as descs from "./src/sample.ts";
import { Writer } from "./src/writer.ts";
import { Quote, Chapter } from "./src/types.ts";

const writer = new Writer();
writer.init();

const chapter : Chapter = {index: 1, name: "Introduction"};
writer.writeChapter(chapter);
writer.writeText(descs.desc1);

const quote: Quote = { content: descs.quote, verse: descs.verse };
writer.writeQuote(quote);

writer.save();
