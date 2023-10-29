import { Items } from '@/services/ItemService';
import { stringify } from 'csv-stringify/browser/esm/sync';
import { parse } from 'csv-parse/browser/esm/sync';
import pako from 'pako';

export class StringHelper {
  public static compress = (input: string) =>
    btoa(String.fromCodePoint(...pako.deflate(input, { level: 9 })));

  public static decompress = (input: string) =>
    pako.inflate(
      Uint8Array.from(atob(input), (m) => m.codePointAt(0) || 0),
      { to: 'string' }
    );

  public static csvStringify = (input?: any[]) => {
    const items = input ? input : Items.value;
    if (!items || items?.length === 0) return '';

    return stringify(items, { columns: ['label', 'weight'], eof: false });
  };

  public static csvParse = (input: string, fixWeight: boolean = false) =>
    parse(
      fixWeight
        ? input
            .split('\n')
            .map((line) => (line.indexOf(',') === -1 ? `${line},1` : line))
            .join('\n')
        : input,
      {
        columns: ['label', 'weight'],
        skipEmptyLines: true,
        trim: true,
        cast: true
      }
    ) as { label: string; weight: number }[];
}
