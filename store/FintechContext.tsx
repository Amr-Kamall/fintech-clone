import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// interfaces
interface Transaction {
  id: string;
  amount: number;
  date: string;
  title: string;
}
interface FintechContextType {
  transactions: Transaction[];
  balance: number;
  runTransaction: (transaction: Transaction) => void;
  clearTransaction: () => void;
}

interface FintechProviderProps {
  children: ReactNode;
}

const FintechContext = createContext<FintechContextType | undefined>(undefined);

function FintechProvider({ children }: FintechProviderProps) {
  const [transactions, setTransaction] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);


  function runTransaction(transaction: Transaction) {
    setTransaction((oldTransactions) => {
      const newTramsactions = [...oldTransactions, transaction];
      const balance = newTramsactions.reduce((acc, cur) => acc + cur.amount, 0); //update balance here 😍
      setBalance(balance);
      return newTramsactions;
    });
  }
  function clearTransaction() {
    setTransaction([]);
    setBalance(0);
  }
  return (
    <FintechContext.Provider
      value={{ transactions, balance, runTransaction, clearTransaction }}
    >
      {children}
    </FintechContext.Provider>
  );
}

function useFintech() {
  //create our custom hook to use the context in every place
  const context = useContext(FintechContext);
  if (context === undefined)
    throw new Error("Fintech context was used outside the CitiesProvider ");
  return context;
}
export { FintechProvider, useFintech };
