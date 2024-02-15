// @deno-types="npm:@types/jspdf"
import { jsPDF, TextOptionsLight } from "npm:jspdf";

import { Book, Chapter, Quote, Section } from "./types.ts";

import * as dims from "./styles/dimensions.ts";
import { Alegreya, GowunBatang, WorkSans } from "../../assets/fonts/fonts.ts";

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

  write(book: Book): void {
    this.writeCover(book);

    for (let i = 0; i < book.chapters.length; i++) {
      const chap = book.chapters[i];
      this.writeChapter(chap);

      for (let i = 0; i < chap.sections.length; i++) {
        this.writeSection(chap.sections[i]);
      }

      this.doc.addPage();
      this.yPos = dims.padding;
    }

    this.save();
  }

  /**
   * Writes the given text to the PDF document, wrapping it if necessary to fit within the page dimensions.
   * @param text the text to write
   */
  private writeText(text: string): void {
    this.doc.setFontSize(14);

    const texts = this.doc.splitTextToSize(text, this.pWidth);
    this.render(texts);
    this.yPos += this.lineHeight;
  }

  private writeChapter(chapter: Chapter): void {
    this.doc.setFont("Alegreya", "bold");
    this.doc.setFontSize(14);

    const text = `${chapter.index}. ${chapter.name.toUpperCase()}`;
    const texts = this.doc.splitTextToSize(text, this.pWidth);
    this.render(texts);

    this.yPos += this.lineHeight;
  }

  private writeSection(section: Section): void {
    if (section.heading) {
      this.doc.setFont("GowunBatang", "bold");
      this.doc.setFontSize(14);
      this.writeText(section.heading);
    }

    for (const content of section.contents) {
      if (typeof content === "string") {
        this.doc.setFont("GowunBatang", "normal");
        this.writeText(content);
      } else {
        this.writeQuote(content);
      }
    }

    this.yPos += this.lineHeight * 3;
  }

  private writeQuote(quote: Quote): void {
    this.yPos += this.lineHeight;

    this.doc.setFont("Alegreya", "italic");
    this.doc.setFontSize(14);

    const w = this.pWidth;
    const texts = this.doc.splitTextToSize(quote.content, w);
    this.render(texts, { align: "justify" });

    const texts2 = this.doc.splitTextToSize(quote.verse, w);
    this.render(texts2);

    this.yPos += this.lineHeight * 2;
  }

  private writeCover(book: Book): void {
    this.doc.setFont("Alegreya", "bold");
    this.doc.setFontSize(30);
    this.render([book.title]);

    this.doc.setFont("GowunBatang", "normal");
    this.doc.setFontSize(14);

    for (const chapter of book.chapters) {
      this.render([`${chapter.index}. ${chapter.name}`]);
      this.yPos += this.lineHeight * 0.5;
    }

    this.doc.addPage();
    this.yPos = dims.padding;
  }

  private save(): void {
    this.doc.save("out.pdf");
    console.log("PDF Generated successfully");
  }
}
