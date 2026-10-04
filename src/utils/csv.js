/**
 * One CSV cell. Quotes are doubled so values containing " or , don't break the row, and values that
 * spreadsheet apps would run as formulas (=, +, -, @, tab, CR) are prefixed with ' so they stay text.
 * Zero is kept (it used to export as blank).
 */
export function csvCell(value) {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** Builds CSV text from rows and `{ header, key, formatter? }` columns. */
export function toCsv(rows, columns) {
  const header = columns.map((c) => csvCell(c.header)).join(",");
  const body = rows.map((item) =>
    columns.map((c) => csvCell(c.formatter ? c.formatter(item[c.key], item) : item[c.key])).join(",")
  );
  return [header, ...body].join("\n");
}
