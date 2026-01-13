
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export enum Tab {
  ROSTER = 'roster',
  DRAW = 'draw',
  GROUPS = 'groups'
}
