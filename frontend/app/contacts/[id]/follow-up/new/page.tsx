'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FollowUpDialog from '@/components/contacts/followup-dialog';
import { followupService } from '@/services/followup.service';
import { useRouter } from 'next/navigation';

export default function AddContactFollowUpPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const backHref = `/contacts/${id}`;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-700">
        <ArrowLeft className="h-4 w-4" /> Back to contact
      </Link>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-indigo-600">Contact reminder</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">Add follow-up</h1>
      </div>
      <FollowUpDialog presentation="page" contactId={id} onClose={() => router.push(backHref)} onSubmit={async (data) => { await followupService.createFollowUp(data); }} />
    </div>
  );
}
