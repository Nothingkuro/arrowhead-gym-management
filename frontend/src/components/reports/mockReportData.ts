import type { ReportData } from '../../types/report';

function toIsoDateWithOffset(daysFromToday: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString();
}

const currentYear = new Date().getFullYear();
const previousYear = currentYear - 1;

export const reportData: ReportData = {
  dailyRevenue: {
    cash: 6420,
    gcash: 3890,
    total: 10310,
    date: new Date().toISOString(),
  },
  monthlyRevenue: [
    { month: 10, year: previousYear, total: 137500 },
    { month: 11, year: previousYear, total: 146220 },
    { month: 12, year: previousYear, total: 154880 },
    { month: 1, year: currentYear, total: 142800 },
    { month: 2, year: currentYear, total: 156400 },
    { month: 3, year: currentYear, total: 163200 },
    { month: 4, year: currentYear, total: 171900 },
    { month: 5, year: currentYear, total: 168750 },
    { month: 6, year: currentYear, total: 176240 },
    { month: 7, year: currentYear, total: 182110 },
    { month: 8, year: currentYear, total: 188930 },
    { month: 9, year: currentYear, total: 191550 },
    { month: 10, year: currentYear, total: 198320 },
    { month: 11, year: currentYear, total: 205480 },
    { month: 12, year: currentYear, total: 212740 },
  ],
  membershipExpiryAlerts: [
    {
      id: 'MBR-0027',
      name: 'Alyssa Ramos',
      expiryDate: toIsoDateWithOffset(1),
      contactNumber: '0917-555-1802',
    },
    {
      id: 'MBR-0041',
      name: 'Jerome Villanueva',
      expiryDate: toIsoDateWithOffset(2),
      contactNumber: '0928-773-4901',
    },
    {
      id: 'MBR-0041',
      name: 'Jerome Villanueva',
      expiryDate: toIsoDateWithOffset(2),
      contactNumber: '0928-773-4901',
    },
    {
      id: 'MBR-0041',
      name: 'Jerome Villanueva',
      expiryDate: toIsoDateWithOffset(2),
      contactNumber: '0928-773-4901',
    },
    {
      id: 'MBR-0041',
      name: 'Jerome Villanueva',
      expiryDate: toIsoDateWithOffset(2),
      contactNumber: '0928-773-4901',
    },
    {
      id: 'MBR-0041',
      name: 'Jerome Villanueva',
      expiryDate: toIsoDateWithOffset(2),
      contactNumber: '0928-773-4901',
    },
    {
      id: 'MBR-0041',
      name: 'Jerome Villanueva',
      expiryDate: toIsoDateWithOffset(2),
      contactNumber: '0928-773-4901',
    },
    {
      id: 'MBR-0041',
      name: 'Jerome Villanueva',
      expiryDate: toIsoDateWithOffset(2),
      contactNumber: '0928-773-4901',
    },
    {
      id: 'MBR-0041',
      name: 'Jerome Villanueva',
      expiryDate: toIsoDateWithOffset(2),
      contactNumber: '0928-773-4901',
    },
    {
      id: 'MBR-0014',
      name: 'Trisha Santiago',
      expiryDate: toIsoDateWithOffset(3),
      contactNumber: '0919-210-6683',
    },
    {
      id: 'MBR-0009',
      name: 'Paolo Mendoza',
      expiryDate: toIsoDateWithOffset(6),
      contactNumber: '0908-340-2198',
    },
    {
      id: 'MBR-0052',
      name: 'Janine Cruz',
      expiryDate: toIsoDateWithOffset(-1),
      contactNumber: '0991-661-0240',
    },
  ],
  inventoryAlerts: [
    {
      id: 'EQ-0012',
      itemName: 'Olympic Barbell (20kg)',
      quantity: 3,
      threshold: 5,
    },
    {
      id: 'EQ-0038',
      itemName: 'Resistance Band Set',
      quantity: 2,
      threshold: 5,
    },
    {
      id: 'EQ-0021',
      itemName: 'Kettlebell 16kg',
      quantity: 4,
      threshold: 5,
    },
    {
      id: 'EQ-0044',
      itemName: 'Foam Roller',
      quantity: 8,
      threshold: 5,
    },
    {
      id: 'EQ-0007',
      itemName: 'Medicine Ball 8kg',
      quantity: 1,
      threshold: 5,
    },
    {
      id: 'EQ-0007',
      itemName: 'Medicine Ball 8kg',
      quantity: 1,
      threshold: 5,
    },
    {
      id: 'EQ-0007',
      itemName: 'Medicine Ball 8kg',
      quantity: 1,
      threshold: 5,
    },
    {
      id: 'EQ-0007',
      itemName: 'Medicine Ball 8kg',
      quantity: 1,
      threshold: 5,
    },
  ],
};
