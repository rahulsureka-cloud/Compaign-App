import React from 'react';
import { countUsersInFile } from './parseUpload';

const DEFAULT_HINT = 'For manual list, please upload CSV, XLS, XLSX files. Max file size: 60MB.';

/**
 * Reusable file-picker for user lists (CSV/XLS/XLSX). Parses the chosen file and
 * reports the real user-row count via onUpload(fileName, count). Shared by the
 * campaign wizard's Segment step and the User Segment builder so uploads behave
 * identically in both places.
 */
export default function FileUpload({ fileName, onUpload, hint = DEFAULT_HINT }) {
  const handleChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // allow re-selecting the same file name
    if (!file) return;
    const count = await countUsersInFile(file);
    onUpload(file.name, count);
  };

  return (
    <>
      <p className="hint">ⓘ {hint}</p>
      <div className="upload-row">
        <label className="btn btn-outline file-btn">
          Select a file
          <input type="file" accept=".csv,.xls,.xlsx" hidden onChange={handleChange} />
        </label>
        <div className="dropzone">{fileName || 'Drop your file here'}</div>
      </div>
    </>
  );
}
