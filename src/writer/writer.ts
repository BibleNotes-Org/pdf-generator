import { jsPDF, TextOptionsLight } from "npm:jspdf";

import { Book, Chapter, Quote, Section } from "./types.ts";

import * as dims from "./styles/dimensions.ts";
import { Alegreya, GowunBatang } from "../../assets/fonts/fonts.ts";
import { ChapterTOCEntry } from "./types.ts";

export class Writer {
  doc: jsPDF;
  xPos: number;
  yPos: number;

  pageIndex: number;

  constructor() {
    this.doc = new jsPDF({ unit: "pt" });
    this.xPos = dims.padding;
    this.yPos = dims.padding;
    this.pageIndex = 1;
  }

  private get pHeight(): number {
    return this.doc.internal.pageSize.getHeight() - dims.padding;
  }

  private get pWidth(): number {
    return dims.size.width - (2 * dims.padding);
  }

  private get lineHeight(): number {
    return this.doc.getLineHeight();
  }

  private get xMid(): number {
    return this.doc.internal.pageSize.getWidth() / 2;
  }

  init(): void {
    this.doc.addFont(Alegreya.regular!.normal.path, "Alegreya", "normal");
    this.doc.addFont(Alegreya.regular!.italic!.path, "Alegreya", "italic");
    this.doc.addFont(Alegreya.bold!.normal!.path, "Alegreya", "bold");

    this.doc.addFont(GowunBatang.regular!.normal.path, "GowunBatang", "normal");
    this.doc.addFont(GowunBatang.bold!.normal!.path, "GowunBatang", "bold");
  }

  private render(texts: string[], options?: TextOptionsLight): void {
    for (let i = 0; i < texts.length; i++) {
      if (this.yPos > this.pHeight) {
        this.addPage();
      }

      this.doc.text(texts[i], this.xPos, this.yPos, options);
      this.yPos += this.lineHeight;
    }
  }

  private addPage() {
    this.doc.addPage();
    this.yPos = dims.padding;
    this.pageIndex += 1;
  }

  write(book: Book, outputPath?: string): void {
    this.init();

    this.writeCover(book);

    this.addPage()

    const tocEntries: ChapterTOCEntry[] = [];

    for (let i = 0; i < book.chapters.length; i++) {
      tocEntries.push({ chapter: book.chapters[i], pageIndex: this.pageIndex });

      const chap = book.chapters[i];
      this.writeChapter(chap);

      for (let i = 0; i < chap.sections.length; i++) {
        this.writeSection(chap.sections[i]);
      }

      if (i != book.chapters.length - 1) {
        this.addPage();
      }
    }

    this.writeTOC(tocEntries);

    this.save(outputPath);
  }

  private writeTOC(entries: ChapterTOCEntry[]): void {
    // rendering book chapters
    this.doc.setPage(2);

    this.xPos = dims.padding;
    this.yPos = dims.padding;

    this.doc.setFont("GowunBatang", "bold");
    this.doc.setFontSize(14);

    this.doc.text("CHAPTERS", this.xPos, this.yPos);
    this.yPos += this.lineHeight * 2;

    this.doc.setFont("GowunBatang", "normal");
    this.doc.setFontSize(14);

    for (const entry of entries) {
      const chapterName = `${entry.chapter.index}. ${entry.chapter.name}`;
      this.doc.textWithLink(chapterName, this.xPos, this.yPos, {
        pageNumber: entry.pageIndex,
      });
      this.yPos += this.lineHeight * 1.5;
    }

    this.doc.addPage();
  }

  /**
   * Writes the given text to the PDF document, wrapping it if necessary to fit within the page dimensions.
   * @param text the text to write
   */
  private writeText(text: string): void {
    this.doc.setFontSize(14);

    const texts = this.doc.splitTextToSize(text, this.pWidth);
    this.render(texts, { maxWidth: this.pWidth, align: "justify" });
    this.yPos += this.lineHeight;
  }

  private writeChapter(chapter: Chapter): void {
    this.doc.setFont("Alegreya", "normal");
    this.doc.setFontSize(30);
    this.yPos += this.lineHeight * 3;

    const chapterName = `${chapter.index}`;
    this.doc.text(chapterName, this.xMid, this.yPos, { align: "center" });
    this.yPos += this.lineHeight;

    this.doc.setFontSize(14);

    const text = `${chapter.name.toUpperCase()}`;
    const texts = this.doc.splitTextToSize(text, this.pWidth);

    for (let i = 0; i < texts.length; i++) {
      if (this.yPos > this.pHeight) {
        this.addPage();
      }

      this.doc.text(texts[i], this.xMid, this.yPos, { align: "center" });
      this.yPos += this.lineHeight;
    }

    this.yPos += this.lineHeight * 6;
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

    const w = this.pWidth * .80;
    const content_xpos = this.pWidth * .35;

    const texts = this.doc.splitTextToSize(quote.content, w);
    for (let i = 0; i < texts.length; i++) {
      if (this.yPos > this.pHeight) {
        this.addPage();
      }

      this.doc.text(texts[i], content_xpos, this.yPos, { align: "justify" });
      this.yPos += this.lineHeight;
    }

    const verse = `– ${quote.verse}`;
    const verse_xpos = this.pWidth - 20;

    const texts2 = this.doc.splitTextToSize(verse, this.pWidth);
    for (let i = 0; i < texts2.length; i++) {
      if (this.yPos > this.pHeight) {
        this.addPage();
      }

      this.doc.text(texts2[i], verse_xpos, this.yPos, { align: "left" });
      this.yPos += this.lineHeight;
    }

    this.yPos += this.lineHeight * 2;
  }

  private writeCover(book: Book): void {
    this.doc.setFont("Alegreya", "bold");
    this.doc.setFontSize(30);

    this.doc.setFillColor("#000000");

    // rendering the book title
    const w = this.pWidth * .75;
    const texts = this.doc.splitTextToSize(book.title, w);
    const text_height = this.doc.getLineHeight() * texts.length;
    this.yPos = (this.doc.internal.pageSize.getHeight() - text_height) / 2;

    for (let i = 0; i < texts.length; i++) {
      this.doc.text(texts[i], this.xMid, this.yPos, { align: "center" });
      this.yPos += this.lineHeight;
    }

    this.addPage();
  }

  private save(path?: string): void {
    const p = path === undefined
      ? `${Deno.cwd()}/output.pdf`
      : `${path}/output.pdf`;
    console.log(p);
    this.doc.save(p);
    console.log("PDF Generated successfully");
  }
}
