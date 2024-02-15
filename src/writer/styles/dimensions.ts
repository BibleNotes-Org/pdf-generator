// @deno-types="npm:@types/jspdf"
import { jsPDF } from "npm:jspdf";

export const size = { width: 595.28, height: 841.89 };
export const padding = 72;

export function getPageSize(doc: jsPDF): { w: number; h: number } {
  const pHeight = doc.internal.pageSize.getHeight() - padding;
  const pWidth = size.width - (2 * padding);
  return { w: pWidth, h: pHeight };
}
