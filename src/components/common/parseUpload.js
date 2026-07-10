import * as XLSX from 'xlsx';

/**
 * Counts the number of user rows in an uploaded list (CSV / XLS / XLSX).
 * The first row is treated as the header, so the count = data rows.
 *
 * @param {Uint8Array|ArrayBuffer} bytes - raw file contents
 * @returns {number} number of users (0 if the file can't be parsed)
 */
export function countUsers(bytes) {
  try {
    const workbook = XLSX.read(bytes, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!firstSheet) return 0;
    const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: null });
    return rows.length;
  } catch {
    return 0;
  }
}

/**
 * Reads a File and resolves with its user-row count. Rejects nothing —
 * returns 0 on any read/parse error.
 */
export function countUsersInFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(countUsers(new Uint8Array(ev.target.result)));
    reader.onerror = () => resolve(0);
    reader.readAsArrayBuffer(file);
  });
}
