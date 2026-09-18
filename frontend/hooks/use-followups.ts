'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  serviceService,
} from '@/services/service.service';

import {
  CustomerService,
} from '@/types/service';

export function useServices(
  contactId?: string,
) {
  const [services, setServices] =
    useState<CustomerService[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchServices =
    useCallback(async () => {
      if (!contactId) {
        setServices([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await serviceService.getServices({
            contactId,
          });

        setServices(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load services',
        );
      } finally {
        setLoading(false);
      }
    }, [contactId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateService = async (
    id: string,
    data: {
      status?: any;
      completedDate?: string;
      scheduledDate?: string;
      notes?: string;
    },
  ) => {
    const response =
      await serviceService.updateService(
        id,
        data,
      );

    await fetchServices();

    return response.data;
  };

  const completeService = async (
    id: string,
    notes?: string,
  ) => {
    const response =
      await serviceService.completeService(
        id,
        notes,
      );

    await fetchServices();

    return response;
  };

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
    updateService,
    completeService,
  };
}