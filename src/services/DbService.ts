import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import type { IItem } from '@/models/Item';
import { templateItems } from '@/assets/TemplateData';

export class DbService {
  db: PouchDB.Database<IItem> = new PouchDB('db');
  public groupLabel: string = '';
  public syncEvent: EventTarget = new EventTarget();

  async init() {
    // PouchDB
    // https://pouchdb.com/guides/databases.html
    PouchDB.plugin(PouchDBFind);
    const dbInfo = await this.db.info();

    const firstItem = await this.getFirstItem();
    this.groupLabel = firstItem.group;

    if (dbInfo.doc_count !== 0) {
      this.db.compact();
    }

    this.db
      .changes({ live: true, since: 'now', include_docs: true })
      .on('change', () => this.syncEvent.dispatchEvent(new Event('change')));
  }

  public getItemCount = async () => (await this.db.info()).doc_count;

  public getGroupLabels = async (): Promise<string[]> => [
    ...new Set(
      (await this.db.allDocs<IItem>({ include_docs: true })).rows
        .map((row) => row.doc!.group)
        .filter((group) => !!group)
        .sort()
    )
  ];

  public getItems = async (): Promise<PouchDB.Core.ExistingDocument<IItem>[]> =>
    this.getItemByGroupLabel(this.groupLabel || (await this.getFirstItem()).group);

  public getItemByGroupLabel = async (
    groupLabel: string
  ): Promise<PouchDB.Core.ExistingDocument<IItem>[]> =>
    (
      await this.db.find({
        selector: {
          group: groupLabel
        }
      })
    ).docs.sort((a, b) => a.order - b.order);

  insertTemplateItems = (): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]> =>
    this.db.bulkDocs(templateItems);

  public addItem = async (item: IItem): Promise<PouchDB.Core.Response> => this.db.post(item);

  private _firstItem: PouchDB.Core.ExistingDocument<IItem> | undefined;
  public async getFirstItem(): Promise<PouchDB.Core.ExistingDocument<IItem>> {
    if (this._firstItem) return this._firstItem;

    const item = (await this.db.allDocs<IItem>({ include_docs: true })).rows
      .sort((a, b) => a.doc!.order - b.doc!.order)
      .shift();
    if (!item) {
      await this.insertTemplateItems();
      return this.getFirstItem()!;
    } else {
      this._firstItem = item.doc;
      return this._firstItem!;
    }
  }

  public async updateItem(
    item: PouchDB.Core.ExistingDocument<IItem>
  ): Promise<PouchDB.Core.Response> {
    const doc = await this.db.get(item._id);
    doc.label = item.label;
    doc.weight = item.weight;
    return this.db.put(item);
  }

  public removeItem = (item: PouchDB.Core.ExistingDocument<IItem>) => {
    const _item: PouchDB.Core.ExistingDocument<IItem & PouchDB.Core.ChangesMeta> = item;
    _item._deleted = true;
    return this.db.put(_item);
  };

  public removeGroup = async (groupLabel: string) => {
    if (groupLabel === this._firstItem?.group) this._firstItem = undefined;

    const items: PouchDB.Core.ExistingDocument<IItem & PouchDB.Core.ChangesMeta>[] =
      await this.getItemByGroupLabel(groupLabel);
    items.forEach((item) => (item._deleted = true));
    await this.db.bulkDocs(items);

    const firstItem = await this.getFirstItem();
    this.groupLabel = firstItem.group;

    this.syncEvent.dispatchEvent(new Event('change'));
  };
}
