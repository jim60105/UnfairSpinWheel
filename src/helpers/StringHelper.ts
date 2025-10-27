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

    // 將 AudioSetting 物件轉為字串
    const processedItems = items.map(item => ({
      label: item.label,
      weight: item.weight,
      congratulationSound: item.congratulationSound?.value || ''
    }));

    return stringify(processedItems, { 
      columns: ['label', 'weight', 'congratulationSound'], 
      eof: false 
    });
  };

  public static csvParse = (input: string, fixWeight: boolean = false) => {
    return parse(input, {
      columns: ['label', 'weight', 'congratulationSound'],
      skipEmptyLines: true,
      trim: true,
      cast: true,
      relax_column_count: true  // 允許欄位數量不同
    });
  };
}
