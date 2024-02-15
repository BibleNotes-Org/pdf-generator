const dir = `${Deno.cwd()}/assets/fonts`;
const allegreya = `${dir}/Alegreya`;
const ws = `${dir}/WorkSans`;
const gb = `${dir}/GowunBatang`;

export const Alegreya: FontFamily = {
  regular: {
    normal: {
      id: "AL-Regular",
      path: `${allegreya}/Alegreya-Regular.ttf`,
    },
    italic: {
      id: "AL-Italic",
      path: `${allegreya}/Alegreya-Italic.ttf`,
    },
  },
  bold: {
    normal: {
      id: "AL-Bold",
      path: `${allegreya}/Alegreya-Bold.ttf`,
    },
    italic: {
      id: "AL-Bold-Italic",
      path: `${allegreya}/Alegreya-BoldItalic.ttf`,
    },
  },
  medium: {
    normal: {
      id: "AL-Medium",
      path: `${allegreya}/Alegreya-Medium.ttf`,
    },
    italic: {
      id: "AL-Medium-Italic",
      path: `${allegreya}/Alegreya-MediumItalic.ttf`,
    },
  },
};

export const WorkSans: FontFamily = {
  regular: {
    normal: {
      id: "WorkSans-Regular",
      path: `${ws}/WorkSans-Regular.ttf`,
    },
    italic: {
      id: "WorkSans-Italic",
      path: `${ws}/WorkSans-Italic.ttf`,
    },
  },
};

export const GowunBatang: FontFamily = {
  regular: {
    normal: {
      id: "GB-Regular",
      path: `${gb}/GowunBatang-Regular.ttf`,
    },
  },
  bold: {
    normal: {
      id: "GB-Bold",
      path: `${gb}/GowunBatang-Bold.ttf`,
    },
  },
};

export const fonts = [WorkSans, GowunBatang, Alegreya];

interface FontFamily {
  regular?: Font;
  bold?: Font;
  medium?: Font;
}

interface Font {
  normal: FontStyle;
  italic?: FontStyle;
}

interface FontStyle {
  id: string;
  path: string;
}
