
export type Slot = 'Head' | 'Hand' | 'Feet' | 'Torso';

export interface Item {
  slot: Slot;
  score: number;
  mod: number;
}

export interface Character {
  level: number;
  equipmentBonus: number;
  items: Item[];
}

export interface Combat {
  combatTotal: number;
  combatVisible: boolean;
}