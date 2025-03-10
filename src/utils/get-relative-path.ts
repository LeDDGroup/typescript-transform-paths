import fs from "node:fs";
import * as os from "node:os";
import path from "node:path";

/* ****************************************************************************************************************** */
// region: Locals
/* ****************************************************************************************************************** */

let isCaseSensitiveFilesystem: boolean | undefined;

// endregion

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

function tryRmFile(fileName: string) {
  try {
    if (fs.existsSync(fileName)) fs.rmSync(fileName, { force: true });
  } catch {}
}

function getIsFsCaseSensitive() {
  if (isCaseSensitiveFilesystem != undefined) return isCaseSensitiveFilesystem;

  for (let i = 0; i < 1000; i++) {
    const tmpFileName = path.join(os.tmpdir(), `tstp~${i}.tmp`);

    tryRmFile(tmpFileName);

    try {
      fs.writeFileSync(tmpFileName, "");
      isCaseSensitiveFilesystem = !fs.existsSync(tmpFileName.replace("tstp", "TSTP"));
      return isCaseSensitiveFilesystem;
    } catch {
    } finally {
      tryRmFile(tmpFileName);
    }
  }

  console.warn(
    `Could not determine filesystem's case sensitivity. Please file a bug report with your system's details`,
  );
  isCaseSensitiveFilesystem = false;

  return isCaseSensitiveFilesystem;
}

/**
 * @private The export is only for unit tests
 */
export function getMatchPortion(from: string, to: string) {
  const lowerFrom = from.toLocaleLowerCase();
  const lowerTo = to.toLocaleLowerCase();

  const maxLen = Math.max(lowerFrom.length, lowerTo.length);

  let i = 0;
  while (i < maxLen) {
    if (lowerFrom[i] !== lowerTo[i]) break;
    i++;
  }

  return to.slice(0, i);
}

// endregion

/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */

export function getRelativePath(from: string, to: string) {
  try {
    from = fs.realpathSync.native(from);
    to = fs.realpathSync.native(to);
  } catch {
    if (!getIsFsCaseSensitive()) {
      const matchPortion = getMatchPortion(from, to);
      from = matchPortion + from.slice(matchPortion.length);
      to = matchPortion + to.slice(matchPortion.length);
    }
  }

  return path.relative(from, to);
}

// endregion
