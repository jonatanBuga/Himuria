import React, { createContext, useContext, useMemo, useState } from 'react';

const SeasonModalContext = createContext(null);

export function SeasonModalProvider({ children }) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open,
      openModal: () => setOpen(true),
      closeModal: () => setOpen(false),
      setOpen,
    }),
    [open]
  );

  return <SeasonModalContext.Provider value={value}>{children}</SeasonModalContext.Provider>;
}

export function useSeasonModal() {
  const ctx = useContext(SeasonModalContext);
  if (!ctx) {
    throw new Error('useSeasonModal must be used within SeasonModalProvider');
  }
  return ctx;
}
