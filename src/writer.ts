// @deno-types="npm:@types/jspdf"
import { jsPDF, TextOptionsLight } from "npm:jspdf";

import { Chapter, Quote } from "./types.ts"

import * as dims from "./styles/dimensions.ts";
import { Alegreya, GowunBatang, WorkSans } from "../assets/fonts/fonts.ts";

export class Writer {
  doc: jsPDF;
  xPos: number;
  yPos: number;

  constructor() {
    this.doc = new jsPDF({ unit: "pt" });
    this.xPos = dims.padding;
    this.yPos = dims.padding;
  }

  public get pHeight(): number {
    return this.doc.internal.pageSize.getHeight() - dims.padding;
  }

  public get pWidth(): number {
    return dims.size.width - (2 * dims.padding);
  }

  public get lineHeight(): number {
    return this.doc.getLineHeight();
  }

  init(): void {
    this.doc.addFont(Alegreya.regular!.normal.path, "Alegreya", "normal");
    this.doc.addFont(Alegreya.regular!.italic!.path, "Alegreya", "italic");
    this.doc.addFont(Alegreya.bold!.normal!.path, "Alegreya", "bold");

    this.doc.addFont(GowunBatang.regular!.normal.path, "GowunBatang", "normal");
    this.doc.addFont(GowunBatang.bold!.normal!.path, "GowunBatang", "bold");

    this.doc.addFont(WorkSans.regular!.normal.path, "WorkSans", "normal");
  }

  private render(texts: string[], options?: TextOptionsLight): void {
    for (let i = 0; i < texts.length; i++) {
      if (this.yPos > this.pHeight) {
        this.doc.addPage();
        this.yPos = dims.padding;
      }

      this.doc.text(texts[i], this.xPos, this.yPos, options);
      this.yPos += this.lineHeight;
    }
  }

  /**
   * Writes the given text to the PDF document, wrapping it if necessary to fit within the page dimensions.
   * @param text the text to write
   */
  writeText(text: string): void {
    this.doc.setFont("GowunBatang", "normal");

    const texts = this.doc.splitTextToSize(text, this.pWidth);
    this.render(texts);
  }

  writeChapter(chapter: Chapter): void {
    this.doc.setFont("Alegreya", "bold");

    const text = `${chapter.index}. ${chapter.name.toUpperCase()}`
    const texts = this.doc.splitTextToSize(text, this.pWidth);
    this.render(texts);
  }

  writeQuote(quote: Quote): void {
    this.doc.setFont("Alegreya", "italic");

    const w = this.pWidth;
    const texts = this.doc.splitTextToSize(quote.content, w);
    this.render(texts, { align: "justify" });

    const texts2 = this.doc.splitTextToSize(quote.verse, w);
    this.render(texts2);
  }

  save(): void {
    this.doc.save("out.pdf");
    console.log("PDF Generated Successfully");
  }
}
