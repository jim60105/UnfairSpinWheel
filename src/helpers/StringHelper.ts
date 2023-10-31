import pako from 'pako';
import { parse } from 'csv-parse/browser/esm/sync';
import { stringify } from 'csv-stringify/browser/esm/sync';
import { Items } from '@/services/ItemService';

export class StringHelper {
  public static compress = (input: string) =>
    btoa(String.fromCodePoint(...pako.deflate(input)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  public static decompress = (input: string) => {
    let str = input.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4 !== 0) {
      str += '=';
    }
    return pako.inflate(
      Uint8Array.from(atob(str), (m) => m.codePointAt(0) || 0),
      { to: 'string' }
    );
  };

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
