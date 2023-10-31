import { ref, watch, type Ref } from 'vue';
import PouchDB from 'pouchdb-browser';
import type { ISetting } from '@/interface/ISetting';
import { throttle } from '@/helpers/UtilHelper';

type AudioSetting = {
  label: string;
  value: string;
};

export const TickSound = ref<AudioSetting>();

export const TickSounds: Ref<{ label: string; items: AudioSetting[] }[]> = ref([
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
]);

export const CongratulationSound = ref<AudioSetting>();

export const CongratulationSounds: Ref<{ label: string; items: AudioSetting[] }[]> = ref([
  {
    label: 'Sound Effect',
    items: [
      { label: 'TA-DA!', value: 'tada-fanfare-a-6313.mp3' },
      { label: 'Crowd Cheering', value: 'crowd-cheering-143103.mp3' },
      { label: 'Bicycle Horn', value: 'bicycle-horn-7126.mp3' },
      { label: 'DJ Airhorn Sound', value: 'dj-airhorn-sound-39405.mp3' }
    ]
  },
  {
    label: 'Funny Voice',
    items: [
      { label: '中~大~獎~ (Chinese)', value: '中大獎.mp3' },
      {
        label: '那個橡皮擦我不要了 (Chinese)',
        value: '350b8fc91c2e4ca4b7b0652f6eee1a42.mp3'
      },
      { label: '不是我！ (Chinese)', value: '不是我笑.mp3' }
    ]
  }
]);

export const LabelLength = ref<number>(0.75);

export class SettingService {
  private db: PouchDB.Database<ISetting> = new PouchDB('setting');

  public init = async () => {
    const dbInfo = await this.db.info();
    if (dbInfo.doc_count !== 0) {
      this.db.compact();
    }

    await this.initLabelLength();
    await this.initTickSound();
    await this.initCongratulationSound();
  };

  private prefetchAudio = (audio: AudioSetting | undefined) => {
    if (!audio) return;
    if (audio.value.startsWith('data:')) return;

    const hint = document.createElement('link');
    hint.rel = 'prefetch';
    hint.as = 'audio';
    hint.href = `/sound/${audio.value}`;
    document.head.appendChild(hint);
  };

  private initLabelLength = async () => {
    try {
      LabelLength.value = (await this.getSetting('labelLength')).value;
    } catch (e) {
      LabelLength.value = 0.75;
      // Don't await
      this.addSetting({ key: 'labelLength', value: LabelLength.value });
    }

    watch(LabelLength, async (newValue) => {
      throttle(async () => {
        try {
          const doc = await this.getSetting('labelLength');
          doc.value = newValue;
          await this.updateSetting(doc, true);
        } catch (e) {
          await this.addSetting({ key: 'labelLength', value: newValue });
        }
      })();
    });
  };

  private buildCustomGroup = (
    audio: AudioSetting | undefined,
    groups: { label: string; items: AudioSetting[] }[]
  ) => {
    let group = groups.find((x) => x.label === 'Custom');
    if (
      !groups
        .flatMap((x) => x.items)
        .find((p) => p.label === audio?.label && p.value === audio?.value)
    ) {
      if (!group) {
        group = { label: 'Custom', items: [] };
        groups.push(group);
      }
      group.items = [audio!];
    } else {
      if (group) {
        const index = groups.indexOf(group);
        groups.splice(index, 1);
      }
    }
  };

  private initTickSound = async () => {
    try {
      TickSound.value = (await this.getSetting('tickSound')).value;
    } catch (e) {
      const firstItem = TickSounds.value[0].items[0];
      TickSound.value = firstItem;
      // Don't await
      this.addSetting({ key: 'tickSound', value: firstItem });
    }
    this.prefetchAudio(TickSound.value);
    this.buildCustomGroup(TickSound.value, TickSounds.value);

    watch(TickSound, async (newValue) => {
      try {
        const doc = await this.getSetting('tickSound');
        doc.value = newValue;
        await this.updateSetting(doc);
        this.buildCustomGroup(newValue, TickSounds.value);
      } catch (e) {
        await this.addSetting({ key: 'tickSound', value: newValue });
      }
      this.prefetchAudio(newValue!);
    });
  };

  private initCongratulationSound = async () => {
    try {
      CongratulationSound.value = (await this.getSetting('congratulationSound')).value;
    } catch (e) {
      const firstItem = CongratulationSounds.value[0].items[0];
      CongratulationSound.value = firstItem;
      // Don't await
      this.addSetting({ key: 'congratulationSound', value: firstItem });
    }
    this.prefetchAudio(CongratulationSound.value);
    this.buildCustomGroup(CongratulationSound.value, CongratulationSounds.value);

    watch(CongratulationSound, async (newValue) => {
      try {
        const doc = await this.getSetting('congratulationSound');
        doc.value = newValue;
        await this.updateSetting(doc);
        this.buildCustomGroup(newValue, CongratulationSounds.value);
      } catch (e) {
        await this.addSetting({ key: 'congratulationSound', value: newValue });
      }
      this.prefetchAudio(CongratulationSound.value);
    });
  };

  public getSettings = async (): Promise<PouchDB.Core.ExistingDocument<ISetting>[]> =>
    (await this.db.allDocs<ISetting>({ include_docs: true })).rows.map((row) => row.doc!);

  public getSetting = async (key: string): Promise<PouchDB.Core.ExistingDocument<ISetting>> =>
    this.db.get(key);

  public addSetting = async (setting: ISetting): Promise<PouchDB.Core.Response> => {
    const doc = setting as PouchDB.Core.ExistingDocument<ISetting>;
    doc._id = setting.key;
    return this.db.put(doc);
  };

  public updateSetting = async (
    item: PouchDB.Core.ExistingDocument<ISetting>,
    force: boolean = false
  ): Promise<PouchDB.Core.Response> => {
    const doc = await this.db.get(item._id);
    doc.value = item.value;
    return this.db.put(item, { force: force });
  };
}
