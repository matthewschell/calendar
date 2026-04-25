export const DEFAULT_MEMBERS = [
  { id: 'dad', name: 'Dad', color: '#3B82F6', isKid: false },
  { id: 'mom', name: 'Mom', color: '#EC4899', isKid: false },
  { id: 'madison', name: 'Madison', color: '#8B5CF6', isKid: true, age: 13, signatureSound: 'fairy-chimes', schedule: { type: 'alternating-weeks', referenceDate: '2025-02-11', offset: 0, description: 'Every other week (Tue-Tue)' } },
  { id: 'mason', name: 'Mason', color: '#10B981', isKid: true, age: 11, signatureSound: 'level-up' },
  { id: 'hudson', name: 'Hudson', color: '#F59E0B', isKid: true, age: 7, signatureSound: 'arcade-coin' },
  { id: 'hunter', name: 'Hunter', color: '#EF4444', isKid: true, age: 5, signatureSound: 'victory-fanfare' }
];

export const DEFAULT_CHORES = [
  { id: 'dishwasher', name: 'Empty Dishwasher', assignedTo: 'mason', points: 10, frequency: 'daily' },
  { id: 'cat-litter', name: 'Clean Cat Litter', assignedTo: 'madison', points: 15, frequency: 'weekly' },
  { id: 'room-madison', name: 'Clean Room', assignedTo: 'madison', points: 5, frequency: 'daily' }
];