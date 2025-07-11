
export type Transaction = {
    id: string;
    type: 'Sale' | 'Purchase';
    itemId: string;
    itemName: string;
    quantity: number;
    date: string;
    total: number;
    status: 'Lunas' | 'Kredit';
    category: 'Production' | 'Purchase';
};

export let transactions: Transaction[] = [
    { id: 'T001', type: 'Sale', itemId: '1', itemName: 'Ground Arabika 250gr Full Roasted', quantity: 2, date: '2024-07-15', total: 170000, status: 'Lunas', category: 'Production' },
    { id: 'T002', type: 'Purchase', itemId: '19', itemName: 'Green Beans Arabika 1Kg Honey Process', quantity: 10, date: '2024-07-14', total: 2500000, status: 'Lunas', category: 'Purchase' },
    { id: 'T003', type: 'Sale', itemId: '5', itemName: 'Ground Arabika 500gr Medium Roasted', quantity: 1, date: '2024-07-13', total: 150000, status: 'Kredit', category: 'Production' },
];

export const addTransaction = (transaction: Transaction) => {
    transactions.unshift(transaction);
};
