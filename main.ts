// @deno-types="npm:@types/pdfkit"
import PDFDocument from "npm:pdfkit";
import * as mod from "https://deno.land/std@0.177.0/node/fs.ts";

import * as descs from "./src/sample.ts";
import * as utils from "./src/utils.ts";
import * as dims from "./src/styles/dimensions.ts";

import Quote from "./src/models/quote.ts";

// deno run -A --watch main.ts

const doc = new PDFDocument({ size: [dims.size.width, dims.size.height] });
doc.pipe(mod.createWriteStream("./out.pdf"));

// Register a font
utils.registerFonts(doc);

utils.writeTitle(doc, "Chapter 1")

utils.writeText(doc, descs.desc1)

const quote: Quote = { content: descs.quote, verse: descs.verse };
utils.writeQuote(doc, quote);

doc.end();
console.log("PDF Generated successfully");
