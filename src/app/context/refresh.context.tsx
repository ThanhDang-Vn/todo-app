'use client';
import { createContext, useContext, useState } from 'react';

const RefreshContext = createContext({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>{children}</RefreshContext.Provider>;
};

export const useRefresh = () => useContext(RefreshContext);
