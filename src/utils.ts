import { Alegreya, WorkSans, fonts } from "../assets/fonts/fonts.ts";
import Quote from "./models/quote.ts";
import * as colors from "./styles/colors.ts";

import * as dims from "./styles/dimensions.ts";

export function registerFonts(doc: PDFKit.PDFDocument) {
  for (const f of fonts) {
    if (f.regular) {
      doc.registerFont(f.regular!.normal.id, f.regular!.normal.path);
      doc.registerFont(f.regular!.italic.id, f.regular!.italic.path);
    }
    if (f.bold) {
      doc.registerFont(f.bold!.normal.id, f.bold!.normal.path);
      doc.registerFont(f.bold!.italic.id, f.bold!.italic.path);
    }
    if (f.medium) {
      doc.registerFont(f.medium!.normal.id, f.medium!.normal.path);
      doc.registerFont(f.medium!.italic.id, f.medium!.italic.path);
    }
  }
}

export function writeQuote(doc: PDFKit.PDFDocument, quote: Quote) {
  const q = doc.heightOfString(quote.content);
  const v = doc.heightOfString(quote.verse);
  const h = q + v;

  if (dims.size.height - doc.y - dims.padding < h) {
    doc.moveDown(dims.size.height - doc.y);
  }
  doc
    .font(Alegreya.regular!.italic.id)
    .fillColor(colors.quote)
    .text(quote.content, { width: dims.size.width * .6, align: "left" });
  doc.moveDown(.1);
  doc
    .font(Alegreya.medium!.italic.id)
    .fillColor(colors.verse)
    .text(quote.verse, { width: dims.size.width * .6, align: "left" });
}

export function writeText(doc: PDFKit.PDFDocument, text: string) {
  doc
    .fillColor(colors.text)
    .font(WorkSans.regular!.normal.id)
    .text(text);
}

export function writeTitle(doc: PDFKit.PDFDocument, title: string) {
    doc
      .fillColor(colors.title)
      .font(WorkSans.regular!.normal.id, 30)
      .text(title);
  }
  