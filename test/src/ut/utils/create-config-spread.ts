import { TransformerOptions } from 'tstp/src';

/* ****************************************************************************************************************** *
 * Types
 * ****************************************************************************************************************** */

type SpreadableConfig = {
  [K in keyof TransformerOptions]?: TransformerOptions[K][] | TransformerOptions[K];
};

/* ****************************************************************************************************************** *
 * createConfigSpread (Util)
 * ****************************************************************************************************************** */

export function createConfigSpread(config: SpreadableConfig) {
  const staticProps: TransformerOptions = {};
  for (const [k, v] of Object.entries(config)) if (!Array.isArray(v)) (<any>staticProps)[k] = v;

  const res: TransformerOptions[] = [];
  for (const [k, v] of Object.entries(config)) {
    if (!Array.isArray(v)) continue;

    const configs = v.map((val) => ({ ...staticProps, [k]: val }));
    if (!res.length) res.push(...configs);
    else {
      for (const existing of [ ...res ]) {
        res.shift();
        res.push(...configs.map(c => ({ ...existing, ...c })));
      }
    }
  }

  return res;
}
