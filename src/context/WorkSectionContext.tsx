'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type WorkSectionContextValue = {
  worksActive: boolean;
  setWorksActive: (active: boolean) => void;
};

const WorkSectionContext = createContext<WorkSectionContextValue | null>(null);

export function WorkSectionProvider({ children }: { children: ReactNode }) {
  const [worksActive, setWorksActive] = useState(false);

  return (
    <WorkSectionContext.Provider value={{ worksActive, setWorksActive }}>
      {children}
    </WorkSectionContext.Provider>
  );
}

export function useWorksActive() {
  const context = useContext(WorkSectionContext);
  if (!context) {
    throw new Error('useWorksActive must be used within a WorkSectionProvider');
  }
  return context.worksActive;
}

export function useSetWorksActive() {
  const context = useContext(WorkSectionContext);
  if (!context) {
    throw new Error('useSetWorksActive must be used within a WorkSectionProvider');
  }
  return context.setWorksActive;
}
