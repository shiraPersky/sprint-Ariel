import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';


export async function extractTextFromPdfBuffer(buffer) {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    fullText += strings.join(' ') + '\n';
  }

  return fullText.slice(0, 10000); // Optional: limit
}
