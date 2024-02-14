const dir = `${Deno.cwd()}/assets/fonts`
console.log(dir)

export const Alegreya: FontFamily = {
  name: "Alegreya",
  regular: {
    normal: {
      id: "Alegreya-Regular",
      path: `${dir}/Alegreya/Alegreya-Regular.ttf`,
    },
    italic: {
      id: "Alegreay-Italic",
      path: `${dir}/Alegreya/Alegreya-Italic.ttf`,
    },
  },
  bold: {
    normal: {
      id: "Alegreya-Bold",
      path: `${dir}/Alegreya/Alegreya-Bold.ttf`,
    },
    italic: {
      id: "Alegreya-Bold-Italic",
      path: `${dir}/Alegreya/Alegreya-BoldItalic.ttf`,
    },
  },
  medium: {
    normal: {
      id: "Alegreya-Medium", 
      path: `${dir}/Alegreya/Alegreya-Medium.ttf`,
    },
    italic: {
      id: "Alegreya-Medium-Italic",
      path: `${dir}/Alegreya/Alegreya-MediumItalic.ttf`,
    },
  },
};

export const WorkSans: FontFamily = {
  name: "WorkSans",
  regular: {
    normal: {
      id: "WorkSans-Regular",
      path: `${dir}/WorkSans/WorkSans-Regular.ttf`,
    },
    italic: {
      id: "WorkSans-Italic",
      path:  `${dir}/WorkSans/WorkSans-Italic.ttf`,
    },
  },
};

export const fonts = [Alegreya, WorkSans];

interface FontFamily {
  name: string;
  regular?: Font;
  bold?: Font;
  medium?: Font;
}

interface Font {
  normal: FontStyle;
  italic: FontStyle;
}

interface FontStyle {
  id: string;
  path: string;
}
