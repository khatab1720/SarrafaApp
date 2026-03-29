// Powered by OnSpace.AI
export type Currency = 'USD' | 'EUR' | 'SYP' | 'TRY';
export type TransactionType = 'give' | 'take';

export interface Client {
  id: string;
  name: string;
  phone?: string;
  createdAt: string;
  isPermanent?: boolean; // permanent accounts cannot be deleted
}

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: Currency;
  type: TransactionType; // give = we give money, take = we take money
  notes?: string;
  isDoubleEntry: boolean;
  counterAmount?: number;
  counterCurrency?: Currency;
  counterClientName?: string; // for double-entry: name of the counter-party
  date: string;
  time: string;
  createdAt: string;
}

export interface MultiCurrencyBalance {
  USD: number;
  EUR: number;
  SYP: number;
  TRY: number;
}

// Exchange rates relative to USD
export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  SYP: 13000,
  TRY: 32.5,
};

export function toUSD(amount: number, currency: Currency): number {
  return amount / EXCHANGE_RATES[currency];
}

export function formatAmount(amount: number, currency: Currency): string {
  const absAmount = Math.abs(amount);
  switch (currency) {
    case 'USD':
      return `$${absAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'EUR':
      return `€${absAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'SYP':
      return `${absAmount.toLocaleString('ar-SY')} ل.س`;
    case 'TRY':
      return `${absAmount.toLocaleString('tr')} ₺`;
  }
}

export function formatUSD(amount: number): string {
  return `$${Math.abs(amount).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Permanent core accounts that cannot be deleted
export const PERMANENT_CLIENTS: Client[] = [
  {
    id: 'permanent_sham',
    name: 'Sham Cash',
    createdAt: '2024-01-01T00:00:00',
    isPermanent: true,
  },
  {
    id: 'permanent_vault',
    name: 'الصندوق (Cash Vault)',
    createdAt: '2024-01-01T00:00:00',
    isPermanent: true,
  },
];

export const INITIAL_CLIENTS: Client[] = [
  ...PERMANENT_CLIENTS,
  { id: 'c1', name: 'أحمد محمد السيد', phone: '0991234567', createdAt: '2025-01-15T10:00:00' },
  { id: 'c2', name: 'خالد عبد الرحمن', phone: '0998765432', createdAt: '2025-01-20T11:00:00' },
  { id: 'c3', name: 'فاطمة حسن علي', phone: '0941122334', createdAt: '2025-02-01T09:00:00' },
  { id: 'c4', name: 'محمود سليمان نجار', phone: '0937788990', createdAt: '2025-02-10T14:00:00' },
  { id: 'c5', name: 'سارة يوسف إبراهيم', phone: '0961234567', createdAt: '2025-03-01T10:00:00' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1', clientId: 'c1', clientName: 'أحمد محمد السيد',
    amount: 5000, currency: 'USD', type: 'take',
    notes: 'دفعة أولى', isDoubleEntry: false,
    date: '2025-03-20', time: '10:30', createdAt: '2025-03-20T10:30:00',
  },
  {
    id: 't2', clientId: 'c2', clientName: 'خالد عبد الرحمن',
    amount: 2000, currency: 'EUR', type: 'give',
    notes: 'تحويل خارجي', isDoubleEntry: false,
    date: '2025-03-21', time: '12:15', createdAt: '2025-03-21T12:15:00',
  },
  {
    id: 't3', clientId: 'c1', clientName: 'أحمد محمد السيد',
    amount: 1500000, currency: 'SYP', type: 'take',
    notes: 'صرف ليرة', isDoubleEntry: false,
    date: '2025-03-22', time: '09:00', createdAt: '2025-03-22T09:00:00',
  },
  {
    id: 't4', clientId: 'c3', clientName: 'فاطمة حسن علي',
    amount: 10000, currency: 'TRY', type: 'give',
    notes: 'حوالة تركية', isDoubleEntry: false,
    date: '2025-03-23', time: '14:45', createdAt: '2025-03-23T14:45:00',
  },
  {
    id: 't5', clientId: 'c4', clientName: 'محمود سليمان نجار',
    amount: 3000, currency: 'USD', type: 'give',
    notes: 'سداد دين', isDoubleEntry: false,
    date: '2025-03-24', time: '11:00', createdAt: '2025-03-24T11:00:00',
  },
  {
    id: 't6', clientId: 'c5', clientName: 'سارة يوسف إبراهيم',
    amount: 800, currency: 'EUR', type: 'take',
    notes: 'دفعة جديدة', isDoubleEntry: false,
    date: '2025-03-25', time: '16:30', createdAt: '2025-03-25T16:30:00',
  },
  {
    id: 't7', clientId: 'c2', clientName: 'خالد عبد الرحمن',
    amount: 500, currency: 'USD', type: 'take',
    notes: 'عمولة', isDoubleEntry: false,
    date: '2025-03-26', time: '08:00', createdAt: '2025-03-26T08:00:00',
  },
  {
    id: 't8', clientId: 'c1', clientName: 'أحمد محمد السيد',
    amount: 1200, currency: 'USD', type: 'give',
    notes: '', isDoubleEntry: false,
    date: '2025-03-27', time: '13:00', createdAt: '2025-03-27T13:00:00',
  },
];

export function calculateClientBalance(transactions: Transaction[], clientId: string): MultiCurrencyBalance {
  const balance: MultiCurrencyBalance = { USD: 0, EUR: 0, SYP: 0, TRY: 0 };
  transactions
    .filter(t => t.clientId === clientId)
    .forEach(t => {
      // take = we receive = positive for us, give = we give = negative for us
      const sign = t.type === 'take' ? 1 : -1;
      balance[t.currency] += sign * t.amount;
    });
  return balance;
}

export function calculateTotalBalance(transactions: Transaction[]): MultiCurrencyBalance {
  const balance: MultiCurrencyBalance = { USD: 0, EUR: 0, SYP: 0, TRY: 0 };
  transactions.forEach(t => {
    const sign = t.type === 'take' ? 1 : -1;
    balance[t.currency] += sign * t.amount;
  });
  return balance;
}

export function balanceToUSD(balance: MultiCurrencyBalance): number {
  return (
    balance.USD +
    balance.EUR / EXCHANGE_RATES.EUR +
    balance.SYP / EXCHANGE_RATES.SYP +
    balance.TRY / EXCHANGE_RATES.TRY
  );
}
