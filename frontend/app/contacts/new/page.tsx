'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContactForm from '@/components/contacts/contact-form';
import { contactService, CreateContactPayload } from '@/services/contact.service';
import { useRouter } from 'next/navigation';

export default function NewContactPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const createContact = async (data: CreateContactPayload) => {
    setSaving(true);
    setError('');
    try {
      await contactService.createContact(data);
      router.push('/contacts');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create this contact.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link href="/contacts" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-700">
        <ArrowLeft className="h-4 w-4" /> Back to contacts
      </Link>
      <div className="pb-1">
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-indigo-600">Relationships</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">Add contact</h1>
        {/* <p className="mt-2 text-sm text-slate-500">Create a customer profile for your team.</p> */}
      </div>
      <ContactForm presentation="page" loading={saving} error={error} onSubmit={createContact} onClose={() => router.push('/contacts')} />
    </div>
  );
}
