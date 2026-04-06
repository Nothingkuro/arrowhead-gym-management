export enum EquipmentCondition {
  GOOD = 'GOOD',
  MAINTENANCE = 'MAINTENANCE',
  BROKEN = 'BROKEN',
}

export interface Equipment {
  id: string;
  itemName: string;
  quantity: number;
  condition: EquipmentCondition;
  lastChecked: string | null;
  createdAt: string;
  updatedAt: string;
}
