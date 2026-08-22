export interface AudioSetting {
  label: string;
  value: string;
}

export type SettingValue = string | number | boolean | AudioSetting;

export interface ISetting {
  key: string;
  value: SettingValue;
}
