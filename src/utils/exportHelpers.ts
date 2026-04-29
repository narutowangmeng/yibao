import * as XLSX from 'xlsx';

export function exportJsonToWorkbook(
  rows: Array<Record<string, string | number>>,
  sheetName: string,
  fileName: string,
  headers?: string[],
) {
  const sheet = XLSX.utils.json_to_sheet(rows, headers ? { header: headers } : undefined);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, sheetName);
  XLSX.writeFile(book, fileName);
}

export function downloadTextFile(fileName: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
