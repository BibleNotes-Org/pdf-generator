export interface Book {
  title: string;
  chapters: Chapter[];
}

export interface Chapter {
  index: number;
  name: string;
  sections: Section[];
}

export type Content = Quote | string;

export interface Section {
  index: number;
  heading?: string;
  contents: Content[];
}

export interface Quote {
  content: string;
  verse: string;
}
