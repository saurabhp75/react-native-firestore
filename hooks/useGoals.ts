import { useContext } from "react";
import { GoalsContext, GoalsContextType } from "../contexts/GoalsContext";

export function useGoals(): GoalsContextType {
  const context = useContext(GoalsContext);

  if (!context) {
    throw new Error(`useGoals must be used within a GoalsProvider.`);
  }

  return context;
}
