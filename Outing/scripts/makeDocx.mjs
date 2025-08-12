import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageOrientation,
} from "docx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [,, inputPathArg, outputPathArg] = process.argv;
  if (!inputPathArg || !outputPathArg) {
    console.error("Usage: node makeDocx.mjs <input.txt> <output.docx>");
    process.exit(1);
  }

  const inputPath = path.resolve(inputPathArg);
  const outputPath = path.resolve(outputPathArg);

  const raw = await fs.readFile(inputPath, "utf8");
  const lines = raw.split(/\r?\n/);

  // Heuristic heading detection
  const isBigTitle = (line, index) => index === 0 && line.trim().length > 0;
  const isSectionTitle = (line) => /^(\d+\.|APPENDIX\s+[A-Z]|[A-Z][A-Z\s\-–&]+)$/.test(line.trim());

  const paragraphs = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      paragraphs.push(new Paragraph({ text: "", spacing: { after: 120 } }));
      continue;
    }

    if (isBigTitle(line, i)) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [new TextRun({ text: trimmed, bold: true })],
        })
      );
      continue;
    }

    if (isSectionTitle(line)) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 120 },
          children: [new TextRun({ text: trimmed, bold: true })],
        })
      );
      continue;
    }

    paragraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: line })],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
            size: { orientation: PageOrientation.PORTRAIT },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outputPath, buffer);
  console.log(`Created DOCX: ${outputPath}`);
}

main().catch((err) => {
  console.error("Failed to create DOCX:", err);
  process.exit(1);
});
