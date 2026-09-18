'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  contactService,
  CreateContactPayload,
} from '@/services/contact.service';

import { Contact } from '@/types/contact';

export function useContacts(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const [contacts, setContacts] = useState<Contact[]>(
    [],
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchContacts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await contactService.getContacts(
            params,
          );

        setContacts(response.data);
        setMeta(response.meta);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load contacts',
        );
      } finally {
        setLoading(false);
      }
    }, [
      params?.search,
      params?.status,
      params?.page,
      params?.limit,
    ]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const createContact = async (
    data: CreateContactPayload,
  ) => {
    const response =
      await contactService.createContact(
        data,
      );

    await fetchContacts();

    return response.data;
  };

  const updateContact = async (
    id: string,
    data: Partial<CreateContactPayload>,
  ) => {
    const response =
      await contactService.updateContact(
        id,
        data,
      );

    await fetchContacts();

    return response.data;
  };

  const deleteContact = async (
    id: string,
  ) => {
    await contactService.deleteContact(id);

    await fetchContacts();
  };

  return {
    contacts,
    loading,
    error,
    meta,
    refetch: fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}