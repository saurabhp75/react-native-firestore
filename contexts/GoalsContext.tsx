import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { createContext, ReactNode, useEffect, useState } from "react";
import { db } from "../firebaseConfig";

// Define types
export interface Goal {
  id: string;
  goal: string;
  progress: number;
}

export interface GoalData {
  goal: string;
  progress: number;
}

export interface GoalsContextType {
  goals: Goal[];
  fetchGoals: () => Promise<void>;
  createGoal: (goalData: GoalData) => Promise<void>;
  deleteGoal: () => Promise<void>;
  updateGoal: (id: string, updates: Partial<GoalData>) => Promise<void>;
}

export interface GoalsProviderProps {
  children: ReactNode;
}

export const GoalsContext = createContext<GoalsContextType | undefined>(
  undefined
);

export function GoalsProvider({ children }: GoalsProviderProps) {
  const [goals, setGoals] = useState<Goal[]>([]);

  async function fetchGoals() {
    const snapshot = await getDocs(collection(db, "goals"));

    const documents = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as Goal;
    });

    setGoals(documents);
  }

  async function createGoal(goalData: GoalData) {
    console.log(goalData);
    await addDoc(collection(db, "goals"), goalData);
  }

  async function deleteGoal() {}

  async function updateGoal(id: string, updates: Partial<GoalData>) {
    await updateDoc(doc(db, "goals", id), { ...updates });
  }

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "goals"), (snapshot) => {
      const documents = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as Goal;
      });

      setGoals(documents);
    });

    return () => unsub();
  }, []);

  return (
    <GoalsContext.Provider
      value={{ goals, fetchGoals, createGoal, deleteGoal, updateGoal }}
    >
      {children}
    </GoalsContext.Provider>
  );
}
