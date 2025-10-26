import { type AudioSetting } from '@/services/SettingService';
export interface IItem {
  group: string;
  label: string;
  weight: number;
  order: number;
  congratulationSound?: AudioSetting;
}
