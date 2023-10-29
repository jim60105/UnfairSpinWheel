import { ref } from 'vue';
import PouchDB from 'pouchdb-browser';
import type { IItem } from '@/interface/IItem';
import { templateItems } from '@/assets/TemplateData';

export const GroupLabel = ref<string>();
export const GroupLabels = ref<string[]>([]);
export const Items = ref<PouchDB.Core.ExistingDocument<IItem>[]>();

export class ItemService {
  private db: PouchDB.Database<IItem> = new PouchDB('item');

  async init() {
    const dbInfo = await this.db.info();
    if (dbInfo.doc_count !== 0) {
      this.db.compact();
    }

    await this.resetGroupLabel();
    Items.value = await this.getItems();
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
    this.getItemByGroupLabel(GroupLabel.value || (await this.getFirstItem()).group);

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

  private syncGroups = async () => (GroupLabels.value = await this.getGroupLabels());
  private syncItems = async () => (Items.value = await this.getItems());

  public addItem = async (item?: IItem): Promise<PouchDB.Core.Response> => {
    if (!item)
      item = {
        group: GroupLabel.value ?? 'New Group',
        label: 'New Item',
        weight: 1,
        order: (await this.getItemCount()) ?? 0
      };

    const doc = item as PouchDB.Core.ExistingDocument<IItem>;
    doc._id = '';
    doc._rev = '';
    const result = await this.db.post(doc);
    await this.syncGroups();
    await this.syncItems();
    return result;
  };

  public addItems = async (
    items: IItem[]
  ): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]> => {
    let count = await this.getItemCount();
    const docs = items.map((item) => ({
      group: item.group,
      label: item.label,
      weight: item.weight,
      order: count++
    }));
    const result = await this.db.bulkDocs(docs);

    await this.syncGroups();
    await this.syncItems();
    return result;
  };

  private insertTemplateItems = (): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]> =>
    this.db.bulkDocs(templateItems);

  private _firstItem: PouchDB.Core.ExistingDocument<IItem> | undefined;

  public async getFirstItem(): Promise<PouchDB.Core.ExistingDocument<IItem>> {
    if (this._firstItem) return this._firstItem;

    const item = (await this.db.allDocs<IItem>({ include_docs: true })).rows
      .sort((a, b) => a.doc!.order - b.doc!.order)
      .shift();
    if (!item) {
      await this.insertTemplateItems();
      await this.syncItems();
      return this.getFirstItem()!;
    } else {
      this._firstItem = item.doc;
      return this._firstItem!;
    }
  }

  public changeGroupLabel = async (newGroupLabel: string) => {
    if (newGroupLabel !== GroupLabel.value) {
      GroupLabel.value = newGroupLabel;
    }
    await this.syncItems();
  };

  public async resetGroupLabel() {
    const firstItem = await this.getFirstItem();
    GroupLabel.value = firstItem.group;
    await this.syncGroups();
    await this.syncItems();
  }

  public async renameGroup(oldGroupLabel: string, newGroupLabel: string) {
    if (newGroupLabel === oldGroupLabel) return;

    const items: PouchDB.Core.ExistingDocument<IItem & PouchDB.Core.ChangesMeta>[] =
      await this.getItemByGroupLabel(oldGroupLabel);
    items.forEach((item) => (item.group = newGroupLabel));
    await this.db.bulkDocs(items);

    await this.syncGroups();
    await this.changeGroupLabel(newGroupLabel);
  }

  public async updateItem(
    item: PouchDB.Core.ExistingDocument<IItem>
  ): Promise<PouchDB.Core.Response> {
    const doc = await this.db.get(item._id);
    if (doc.label === item.label && doc.weight === item.weight)
      return Promise.resolve({} as PouchDB.Core.Response);

    doc.label = item.label;
    doc.weight = item.weight;
    const result = await this.db.put(item);
    await this.syncItems();
    return result;
  }

  public removeItem = async (item: PouchDB.Core.ExistingDocument<IItem>) => {
    const _item: PouchDB.Core.ExistingDocument<IItem & PouchDB.Core.ChangesMeta> = item;
    _item._deleted = true;
    const result = await this.db.put(_item);
    await this.syncItems();
    return result;
  };

  public removeGroup = async (groupLabel: string) => {
    if (groupLabel === this._firstItem?.group) this._firstItem = undefined;

    await this.cleanUpGroup(groupLabel);
    await this.resetGroupLabel();
  };

  public cleanUpGroup = async (groupLabel: string) => {
    const items: PouchDB.Core.ExistingDocument<IItem & PouchDB.Core.ChangesMeta>[] =
      await this.getItemByGroupLabel(groupLabel);
    items.forEach((item) => (item._deleted = true));
    await this.db.bulkDocs(items);
    await this.syncItems();
  };
}
