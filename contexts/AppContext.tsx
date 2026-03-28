// Powered by OnSpace.AI
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import {
  Client, Transaction, INITIAL_CLIENTS, INITIAL_TRANSACTIONS,
  calculateClientBalance, calculateTotalBalance, balanceToUSD,
  MultiCurrencyBalance, Currency, TransactionType, PERMANENT_CLIENTS,
} from '@/services/dataService';

interface AppContextType {
  clients: Client[];
  transactions: Transaction[];
  addClient: (name: string, phone?: string) => Client;
  deleteClient: (id: string) => void;
  addTransaction: (data: {
    clientId: string;
    amount: number;
    currency: Currency;
    type: TransactionType;
    notes?: string;
    isDoubleEntry: boolean;
    counterAmount?: number;
    counterCurrency?: Currency;
    counterClientName?: string;
  }) => void;
  deleteTransaction: (id: string) => void;
  getClientBalance: (clientId: string) => MultiCurrencyBalance;
  totalBalance: MultiCurrencyBalance;
  totalUSD: number;
  totalGiven: number;
  totalTaken: number;
  getClientTransactions: (clientId: string) => Transaction[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const PERMANENT_IDS = new Set(PERMANENT_CLIENTS.map(c => c.id));

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const addClient = useCallback((name: string, phone?: string): Client => {
    const newClient: Client = {
      id: `c${Date.now()}`,
      name,
      phone,
      createdAt: new Date().toISOString(),
    };
    setClients(prev => [newClient, ...prev]);
    return newClient;
  }, []);

  const deleteClient = useCallback((id: string) => {
    // Prevent deletion of permanent accounts
    if (PERMANENT_IDS.has(id)) return;
    setClients(prev => prev.filter(c => c.id !== id));
    setTransactions(prev => prev.filter(t => t.clientId !== id));
  }, []);

  const addTransaction = useCallback((data: {
    clientId: string;
    amount: number;
    currency: Currency;
    type: TransactionType;
    notes?: string;
    isDoubleEntry: boolean;
    counterAmount?: number;
    counterCurrency?: Currency;
    counterClientName?: string;
  }) => {
    const client = clients.find(c => c.id === data.clientId);
    if (!client) return;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      clientId: data.clientId,
      clientName: client.name,
      amount: data.amount,
      currency: data.currency,
      type: data.type,
      notes: data.notes,
      isDoubleEntry: data.isDoubleEntry,
      counterAmount: data.counterAmount,
      counterCurrency: data.counterCurrency,
      counterClientName: data.counterClientName,
      date: dateStr,
      time: timeStr,
      createdAt: now.toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);
  }, [clients]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const getClientBalance = useCallback((clientId: string) => {
    return calculateClientBalance(transactions, clientId);
  }, [transactions]);

  const totalBalance = calculateTotalBalance(transactions);
  const totalUSD = balanceToUSD(totalBalance);

  const totalGiven = transactions
    .filter(t => t.type === 'give')
    .reduce((sum, t) => {
      const rates: Record<string, number> = { USD: 1, EUR: 1.087, SYP: 1/13000, TRY: 1/32.5 };
      return sum + t.amount * (rates[t.currency] || 1);
    }, 0);

  const totalTaken = transactions
    .filter(t => t.type === 'take')
    .reduce((sum, t) => {
      const rates: Record<string, number> = { USD: 1, EUR: 1.087, SYP: 1/13000, TRY: 1/32.5 };
      return sum + t.amount * (rates[t.currency] || 1);
    }, 0);

  const getClientTransactions = useCallback((clientId: string) => {
    return transactions.filter(t => t.clientId === clientId);
  }, [transactions]);

  return (
    <AppContext.Provider value={{
      clients, transactions, addClient, deleteClient,
      addTransaction, deleteTransaction, getClientBalance,
      totalBalance, totalUSD, totalGiven, totalTaken,
      getClientTransactions,
    }}>
      {children}
    </AppContext.Provider>
  );
}
