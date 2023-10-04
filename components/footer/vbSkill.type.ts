export enum vbSkillTypeEnum {
  primary = "primary",
  secondary = "secondary",
}

export interface IVbSkill {
  name: string;
  type: vbSkillTypeEnum;
  love: boolean;
}
