
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

export let transactions: Transaction[] = [];

export const addTransaction = (transaction: Transaction) => {
    transactions.unshift(transaction);
};
