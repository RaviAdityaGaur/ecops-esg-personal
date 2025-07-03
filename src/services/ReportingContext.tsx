import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ReportingContextType {
  reportingId: string | null;
  setReportingId: (id: string) => void;
  clearReportingId: () => void;
}

const ReportingContext = createContext<ReportingContextType | undefined>(undefined);

interface ReportingProviderProps {
  children: ReactNode;
}

export const ReportingProvider: React.FC<ReportingProviderProps> = ({ children }) => {
  const [reportingId, setReportingIdState] = useState<string | null>(() => {
    return sessionStorage.getItem('reportingId');
  });

  const setReportingId = (id: string) => {
    setReportingIdState(id);
    sessionStorage.setItem('reportingId', id);
  };

  const clearReportingId = () => {
    setReportingIdState(null);
    sessionStorage.removeItem('reportingId');
  };

  return (
    <ReportingContext.Provider value={{ reportingId, setReportingId, clearReportingId }}>
      {children}
    </ReportingContext.Provider>
  );
};

export const useReporting = (): ReportingContextType => {
  const context = useContext(ReportingContext);
  if (context === undefined) {
    throw new Error('useReporting must be used within a ReportingProvider');
  }
  return context;
};