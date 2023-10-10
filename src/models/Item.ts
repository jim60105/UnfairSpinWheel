export interface IItem {
  label: string;
  weight: number;
}

export class Item implements IItem {
  constructor(
    public label: string,
    public weight: number
  ) {}
}
