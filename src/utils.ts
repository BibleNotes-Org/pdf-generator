import {
  Alegreya,
  fonts,
  GowunBatang,
} from "../assets/fonts/fonts.ts";

// @deno-types="npm:@types/pdfkit"

import Quote from "./models/quote.ts";
import * as colors from "./styles/colors.ts";

import * as dims from "./styles/dimensions.ts";

export function registerFonts(doc: PDFKit.PDFDocument) {
  for (const f of fonts) {
    if (f.regular) {
      doc.registerFont(f.regular.normal.id, f.regular.normal.path);
      if (f.regular.italic) {
        doc.registerFont(f.regular!.italic.id, f.regular!.italic.path);
      }
    }
    if (f.medium) {
      doc.registerFont(f.medium.normal.id, f.medium.normal.path);
      if (f.medium.italic) {
        doc.registerFont(f.medium!.italic.id, f.medium!.italic.path);
      }
    }
    if (f.bold) {
      doc.registerFont(f.bold.normal.id, f.bold.normal.path);
      if (f.bold.italic) {
        doc.registerFont(f.bold!.italic.id, f.bold!.italic.path);
      }
    }
  }
}

export function writeTitle(doc: PDFKit.PDFDocument, title: string) {
  doc
    .font(GowunBatang.bold!.normal.path, 20)
    .fillColor(colors.title)
    .text(title);
}

export function writeText(doc: PDFKit.PDFDocument, text: string) {
  doc
    .font(GowunBatang.regular!.normal.path, 14)
    .fillColor(colors.text)
    .text(text);
}

export function writeQuote(doc: PDFKit.PDFDocument, quote: Quote) {
  const q = doc.heightOfString(quote.content);
  const v = doc.heightOfString(quote.verse);
  const space = .1;
  const h = q + v + space;

  if (dims.size.height - doc.y - dims.padding < h) {
    doc.moveDown(dims.size.height - doc.y);
  }

  doc.font(Alegreya.regular?.italic?.path, 12);
  doc.fontSize(12)

  doc
    .fillColor(colors.quote)
    .text(quote.content, { width: dims.size.width * .5, align: "left" });
  doc.moveDown(space);
  doc
    .fillColor(colors.quote)
    .text(quote.verse, { width: dims.size.width * .5, align: "right" });
}
