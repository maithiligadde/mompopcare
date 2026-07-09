import { createContext, ReactNode, useContext, useState } from "react";
import { CareData, CareEvent, CareRecipient, CareTask, PROTOTYPE_USER_ID, User } from "../../domain/types";
import { AddCareRecipientInput, AddCareTaskInput, CareRepository } from "../../repositories/careRepository";
import { createInMemoryCareRepository } from "../../repositories/inMemoryCareRepository";

interface CareContextValue {
  snapshot: CareData;
  user: User;
  addCareRecipient: (input: AddCareRecipientInput) => CareRecipient;
  addCareTask: (input: AddCareTaskInput) => CareTask;
  completeCareTask: (taskId: string) => CareEvent | undefined;
}

const CareContext = createContext<CareContextValue | null>(null);

interface CareProviderProps {
  children: ReactNode;
}

export function CareProvider({ children }: CareProviderProps) {
  const [repository] = useState<CareRepository>(() => createInMemoryCareRepository());
  const [snapshot, setSnapshot] = useState<CareData>(() => repository.getSnapshot());
  const user = snapshot.users.find((item) => item.id === PROTOTYPE_USER_ID) ?? snapshot.users[0];

  const refresh = () => {
    setSnapshot(repository.getSnapshot());
  };

  const value: CareContextValue = {
    snapshot,
    user,
    addCareRecipient: (input) => {
      const recipient = repository.addCareRecipient(input);
      refresh();
      return recipient;
    },
    addCareTask: (input) => {
      const task = repository.addCareTask(input);
      refresh();
      return task;
    },
    completeCareTask: (taskId) => {
      const event = repository.completeCareTask(taskId);
      refresh();
      return event;
    }
  };

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

export function useCare(): CareContextValue {
  const context = useContext(CareContext);

  if (!context) {
    throw new Error("useCare must be used inside CareProvider");
  }

  return context;
}
