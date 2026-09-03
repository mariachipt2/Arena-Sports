import { useState, useEffect, useCallback } from 'react';
import type { QuotaInfo } from '../types/dashboard';
import { storageService } from '../services/storage';

export const useQuotaMonitor = () => {
  const [quota, setQuota] = useState<QuotaInfo | null>(null);

  const refreshQuota = useCallback(() => {
    setQuota(storageService.getQuota());
  }, []);

  useEffect(() => {
    refreshQuota();
    
    // Escuta alterações de localStorage para manter sincronizado se houver chamadas em outros hooks
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'arena_quota') {
        refreshQuota();
      }
    };

    const handleLocalQuotaChange = () => {
      refreshQuota();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('quotaChanged', handleLocalQuotaChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('quotaChanged', handleLocalQuotaChange);
    };
  }, [refreshQuota]);

  return {
    quota,
    refreshQuota,
  };
};
