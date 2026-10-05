// Generates the settlement documents a client has to act on — the excess invoice and the
// Agreement of Loss — as real PDFs from the claim's own data (the mock store only keeps
// file names). Uses the vendored pdf-lib (/vendor/pdf-lib.min.js). Nothing is invented:
// amounts come from the policy section / recorded claim value, and payment details are
// left to the broker rather than made up.

interface PdfFont {
  widthOfTextAtSize(text: string, size: number): number;
}
interface PdfPage {
  drawText(text: string, options: { x: number; y: number; size: number; font: PdfFont; color?: unknown }): void;
  drawLine(options: { start: { x: number; y: number }; end: { x: number; y: number }; thickness: number; color?: unknown }): void;
  drawRectangle(options: { x: number; y: number; width: number; height: number; color?: unknown }): void;
  getSize(): { width: number; height: number };
}
interface PdfDoc {
  addPage(size?: [number, number]): PdfPage;
  embedFont(name: string): Promise<PdfFont>;
  save(): Promise<Uint8Array>;
}
interface PdfLibCreate {
  PDFDocument: { create(): Promise<PdfDoc> };
  StandardFonts: { Helvetica: string; HelveticaBold: string };
  rgb(r: number, g: number, b: number): unknown;
}

export interface SettlementDocInput {
  reference: string;
  clientName: string;
  claimType: string;
  insurer: string;
  insurerClaimNo?: string;
  dateOfLoss: string; // formatted
  issuedOn: string; // formatted
  amount?: number;
  companyName: string;
}

// Standard PDF fonts can't encode the narrow/no-break spaces Intl inserts — use plain spaces.
const zar = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 }).format(n).replace(/[\u00a0\u202f]/g, " ");

async function build(title: string, input: SettlementDocInput, body: (ctx: Ctx) => void): Promise<Uint8Array> {
  const lib = (window as unknown as { PDFLib?: PdfLibCreate }).PDFLib;
  if (!lib) throw new Error("The PDF engine is still loading — try again in a moment.");
  const doc = await lib.PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const regular = await doc.embedFont(lib.StandardFonts.Helvetica);
  const bold = await doc.embedFont(lib.StandardFonts.HelveticaBold);
  const ink = lib.rgb(0.08, 0.08, 0.08);
  const grey = lib.rgb(0.45, 0.45, 0.44);
  const red = lib.rgb(0.83, 0.07, 0.07);
  const { width, height } = page.getSize();
  const M = 56;

  // Header band
  page.drawRectangle({ x: 0, y: height - 6, width, height: 6, color: red });
  page.drawText(input.companyName, { x: M, y: height - 64, size: 11, font: bold, color: ink });
  page.drawText(title, { x: M, y: height - 104, size: 24, font: bold, color: ink });
  page.drawText(`Issued ${input.issuedOn}`, { x: M, y: height - 124, size: 10, font: regular, color: grey });

  const ctx: Ctx = { page, regular, bold, ink, grey, red, M, width, y: height - 170 };
  const row = (label: string, value: string) => {
    page.drawText(label, { x: M, y: ctx.y, size: 9, font: regular, color: grey });
    page.drawText(value, { x: M + 150, y: ctx.y, size: 11, font: regular, color: ink });
    ctx.y -= 22;
  };
  row("Claim reference", input.reference);
  row("Client", input.clientName);
  row("Claim type", input.claimType);
  row("Insurer", input.insurer);
  if (input.insurerClaimNo) row("Insurer claim number", input.insurerClaimNo);
  row("Date of loss", input.dateOfLoss);
  ctx.y -= 10;
  page.drawLine({ start: { x: M, y: ctx.y }, end: { x: width - M, y: ctx.y }, thickness: 0.6, color: grey });
  ctx.y -= 34;

  body(ctx);

  page.drawText(`${input.companyName} · Generated from the Aris Claims portal`, { x: M, y: 40, size: 8, font: regular, color: grey });
  return doc.save();
}

interface Ctx {
  page: PdfPage;
  regular: PdfFont;
  bold: PdfFont;
  ink: unknown;
  grey: unknown;
  red: unknown;
  M: number;
  width: number;
  y: number;
}

function paragraph(ctx: Ctx, text: string, size = 10) {
  const maxWidth = ctx.width - ctx.M * 2;
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.regular.widthOfTextAtSize(next, size) > maxWidth) {
      ctx.page.drawText(line, { x: ctx.M, y: ctx.y, size, font: ctx.regular, color: ctx.ink });
      ctx.y -= size + 5;
      line = word;
    } else line = next;
  }
  if (line) ctx.page.drawText(line, { x: ctx.M, y: ctx.y, size, font: ctx.regular, color: ctx.ink });
  ctx.y -= size + 12;
}

export function buildExcessInvoicePdf(input: SettlementDocInput): Promise<Uint8Array> {
  return build("Excess invoice", input, (ctx) => {
    ctx.page.drawText("Amount due (policy excess)", { x: ctx.M, y: ctx.y, size: 10, font: ctx.regular, color: ctx.grey });
    ctx.y -= 30;
    ctx.page.drawText(input.amount !== undefined ? zar(input.amount) : "As advised by your broker", {
      x: ctx.M,
      y: ctx.y,
      size: 26,
      font: ctx.bold,
      color: ctx.ink,
    });
    ctx.y -= 44;
    paragraph(
      ctx,
      `Your claim was settled by repair or replacement, so the policy excess is payable before the work is completed. Please use ${input.reference} as the payment reference, then upload your proof of payment in the Settlement tab of your claim.`,
    );
    paragraph(ctx, "Payment details are confirmed by your broker. If you have not received them, message your broker from the Support page.");
  });
}

export function buildAgreementOfLossPdf(input: SettlementDocInput): Promise<Uint8Array> {
  return build("Agreement of Loss", input, (ctx) => {
    ctx.page.drawText("Agreed settlement amount", { x: ctx.M, y: ctx.y, size: 10, font: ctx.regular, color: ctx.grey });
    ctx.y -= 30;
    ctx.page.drawText(input.amount !== undefined ? zar(input.amount) : "As recorded by your insurer", {
      x: ctx.M,
      y: ctx.y,
      size: 26,
      font: ctx.bold,
      color: ctx.ink,
    });
    ctx.y -= 44;
    paragraph(
      ctx,
      `I, the undersigned, accept the amount above in full and final settlement of claim ${input.reference} with ${input.insurer}. Sign below, then upload the signed copy in the Settlement tab of your claim.`,
    );
    ctx.y -= 30;
    for (const label of ["Full name", "Signature", "Date"]) {
      ctx.page.drawLine({ start: { x: ctx.M, y: ctx.y }, end: { x: ctx.M + 260, y: ctx.y }, thickness: 0.8, color: ctx.ink });
      ctx.page.drawText(label, { x: ctx.M, y: ctx.y - 14, size: 9, font: ctx.regular, color: ctx.grey });
      ctx.y -= 56;
    }
  });
}
