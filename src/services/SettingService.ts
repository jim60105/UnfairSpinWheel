import { ref, watch } from 'vue';
import PouchDB from 'pouchdb-browser';
import type { ISetting } from '@/interface/ISetting';

type soundOption = {
  label: string;
  value: string;
};

export const tickSound = ref<soundOption>();

export const tickSounds = [
  {
    label: 'Sound Effect',
    items: [
      { label: 'Start', value: 'start-13691.mp3' },
      { label: 'Car horn', value: 'car_horn-108152.mp3' },
      { label: 'Cork', value: 'cork-85200.mp3' },
      { label: 'Ding', value: 'ding-108042.mp3' },
      { label: 'Interface', value: 'interface-1-126517.mp3' }
    ]
  },
  {
    label: 'Funny Voice',
    items: [
      { label: 'Screaming', value: '尖叫2.mp3' },
      { label: 'Laughing', value: '哈哈ᏊꈊᏊ_638014168033514976.mp3' },
      { label: 'Laughing', value: '哈哈ᏊꈊᏊ_638014227957579626.mp3' },
      { label: '臥槽 (Chinese Swear words)', value: '臥槽.mp3' },
      { label: '靠北喔 (Taiwanese mild expletive)', value: '靠北喔.mp3' }
    ]
  }
];

export class SettingService {
  private db: PouchDB.Database<ISetting> = new PouchDB('setting');
  public syncEvent: EventTarget = new EventTarget();

  public async init() {
    const dbInfo = await this.db.info();
    if (dbInfo.doc_count !== 0) {
      this.db.compact();
    }

    await this.initTickSound();

    this.db
      .changes({ live: true, since: 'now', include_docs: true })
      .on('change', () => this.syncEvent.dispatchEvent(new Event('change')));
  }

  private async initTickSound() {
    try {
      tickSound.value = (await this.getSetting('tickSound')).value;
    } catch (e) {
      const firstItem = tickSounds[0].items[0];
      tickSound.value = firstItem;
      // Don't await
      this.addSetting({ key: 'tickSound', value: firstItem });
    }

    watch(tickSound, async (newValue) => {
      try {
        const doc = await this.getSetting('tickSound');
        doc.value = newValue;
        await this.updateSetting(doc);
      } catch (e) {
        await this.addSetting({ key: 'tickSound', value: newValue });
      }
    });
  }

  public getSettings = async (): Promise<PouchDB.Core.ExistingDocument<ISetting>[]> =>
    (await this.db.allDocs<ISetting>({ include_docs: true })).rows.map((row) => row.doc!);

  public getSetting = async (key: string): Promise<PouchDB.Core.ExistingDocument<ISetting>> =>
    this.db.get(key);

  public addSetting = async (setting: ISetting): Promise<PouchDB.Core.Response> => {
    const doc = setting as PouchDB.Core.ExistingDocument<ISetting>;
    doc._id = setting.key;
    return this.db.put(doc);
  };

  public async updateSetting(
    item: PouchDB.Core.ExistingDocument<ISetting>
  ): Promise<PouchDB.Core.Response> {
    const doc = await this.db.get(item._id);
    doc.value = item.value;
    return this.db.put(item);
  }
}
