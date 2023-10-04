export enum skillTypeEnum {
  primary = "primary",
  secondary = "secondary",
}

export interface ISkill {
  name: string;
  type: skillTypeEnum;
  love: boolean;
}
