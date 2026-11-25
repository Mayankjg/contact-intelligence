// 'use client';

// import {
//     useEffect,
//     useState,
// } from 'react';

// import {
//     useRouter,
// } from 'next/navigation';

// import Link from 'next/link';

// import {
//     contactService,
//     CreateContactPayload,
// } from '@/services/contact.service';

// import { Contact } from '@/types/contact';
// import { getErrorMessage } from '@/lib/error-message';

// interface ContactFormProps {
//     mode: 'create' | 'edit';

//     contact?: Contact;
// }

// export default function ContactForm({
//     mode,
//     contact,
// }: ContactFormProps) {
//     const router = useRouter();

//     const [form, setForm] =
//         useState<CreateContactPayload>({
//             firstName: '',
//             lastName: '',
//             phone: '',
//             email: '',
//             alternatePhone: '',
//             company: '',
//             customerType: 'INDIVIDUAL',
//             status: 'ACTIVE',
//             address: '',
//             city: '',
//             state: '',
//             country: 'India',
//             postalCode: '',
//             notes: '',
//         });

//     const [loading, setLoading] =
//         useState(false);

//     const [error, setError] =
//         useState('');

//     useEffect(() => {
//         if (!contact) return;

//         setForm({
//             firstName:
//                 contact.firstName,

//             lastName:
//                 contact.lastName,

//             phone:
//                 contact.phone,

//             email:
//                 contact.email || '',

//             alternatePhone:
//                 contact.alternatePhone || '',

//             company:
//                 contact.company || '',

//             customerType:
//                 contact.customerType,

//             status:
//                 contact.status,

//             address:
//                 contact.address || '',

//             city:
//                 contact.city || '',

//             state:
//                 contact.state || '',

//             country:
//                 contact.country || 'India',

//             postalCode:
//                 contact.postalCode || '',

//             notes:
//                 contact.notes || '',
//         });
//     }, [contact]);

//     const updateField = (
//         field: keyof CreateContactPayload,

//         value: string,
//     ) => {
//         setForm(
//             (previous) => ({
//                 ...previous,

//                 [field]: value,
//             }),
//         );
//     };

//     const submit = async (
//         event: React.FormEvent,
//     ) => {
//         event.preventDefault();

//         setError('');

//         if (!form.firstName.trim()) {
//             setError(
//                 'First name is required',
//             );

//             return;
//         }

//         if (!form.lastName.trim()) {
//             setError(
//                 'Last name is required',
//             );

//             return;
//         }

//         if (!form.phone.trim()) {
//             setError(
//                 'Phone number is required',
//             );

//             return;
//         }

//         const payload =
//             sanitizeContactPayload(form);

//         try {
//             setLoading(true);

//             if (
//                 mode === 'create'
//             ) {
//                 const response =
//                     await contactService.createContact(
//                         payload,
//                     );

//                 router.push(
//                     `/contacts/${response.data.id}`,
//                 );
//             } else {
//                 if (!contact) return;

//                 const response =
//                     await contactService.updateContact(
//                         contact.id,
//                         payload,
//                     );

//                 router.push(
//                     `/contacts/${response.data.id}`,
//                 );
//             }
//         } catch (err: unknown) {
//             setError(
//                 getErrorMessage(
//                     err,
//                     'Something went wrong',
//                 ),
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form
//             onSubmit={submit}
//             className="space-y-6"
//         >
//             {error && (
//                 <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
//                     {error}
//                 </div>
//             )}

//             <section className="rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
//                 <h2 className="mb-5 text-lg font-semibold text-slate-900">
//                     Basic Information
//                 </h2>

//                 <div className="grid gap-5 md:grid-cols-2">
//                     <Input
//                         label="First Name"
//                         required
//                         value={form.firstName}
//                         onChange={(value) =>
//                             updateField(
//                                 'firstName',
//                                 value,
//                             )
//                         }
//                     />

//                     <Input
//                         label="Last Name"
//                         required
//                         value={form.lastName}
//                         onChange={(value) =>
//                             updateField(
//                                 'lastName',
//                                 value,
//                             )
//                         }
//                     />

//                     <Input
//                         label="Phone Number"
//                         required
//                         value={form.phone}
//                         onChange={(value) =>
//                             updateField(
//                                 'phone',
//                                 value,
//                             )
//                         }
//                     />

//                     <Input
//                         label="Email"
//                         type="email"
//                         value={
//                             form.email || ''
//                         }
//                         onChange={(value) =>
//                             updateField(
//                                 'email',
//                                 value,
//                             )
//                         }
//                     />

//                     <Input
//                         label="Alternate Phone"
//                         value={
//                             form.alternatePhone ||
//                             ''
//                         }
//                         onChange={(value) =>
//                             updateField(
//                                 'alternatePhone',
//                                 value,
//                             )
//                         }
//                     />

//                     <Input
//                         label="Company"
//                         value={
//                             form.company || ''
//                         }
//                         onChange={(value) =>
//                             updateField(
//                                 'company',
//                                 value,
//                             )
//                         }
//                     />

//                     <Select
//                         label="Customer Type"
//                         value={
//                             form.customerType ||
//                             'INDIVIDUAL'
//                         }
//                         options={[
//                             'INDIVIDUAL',
//                             'BUSINESS',
//                         ]}
//                         onChange={(value) =>
//                             updateField(
//                                 'customerType',
//                                 value,
//                             )
//                         }
//                     />

//                     <Select
//                         label="Status"
//                         value={
//                             form.status ||
//                             'ACTIVE'
//                         }
//                         options={[
//                             'ACTIVE',
//                             'INACTIVE',
//                             'BLOCKED',
//                         ]}
//                         onChange={(value) =>
//                             updateField(
//                                 'status',
//                                 value,
//                             )
//                         }
//                     />
//                 </div>
//             </section>

//             <section className="rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
//                 <h2 className="mb-5 text-lg font-semibold text-slate-900">
//                     Address
//                 </h2>

//                 <div className="grid gap-5 md:grid-cols-2">
//                     <Input
//                         label="Address"
//                         value={
//                             form.address || ''
//                         }
//                         onChange={(value) =>
//                             updateField(
//                                 'address',
//                                 value,
//                             )
//                         }
//                     />

//                     <Input
//                         label="City"
//                         value={
//                             form.city || ''
//                         }
//                         onChange={(value) =>
//                             updateField(
//                                 'city',
//                                 value,
//                             )
//                         }
//                     />

//                     <Input
//                         label="State"
//                         value={
//                             form.state || ''
//                         }
//                         onChange={(value) =>
//                             updateField(
//                                 'state',
//                                 value,
//                             )
//                         }
//                     />

//                     <Input
//                         label="Country"
//                         value={
//                             form.country || ''
//                         }
//                         onChange={(value) =>
//                             updateField(
//                                 'country',
//                                 value,
//                             )
//                         }
//                     />

//                     <Input
//                         label="Postal Code"
//                         value={
//                             form.postalCode || ''
//                         }
//                         onChange={(value) =>
//                             updateField(
//                                 'postalCode',
//                                 value,
//                             )
//                         }
//                     />
//                 </div>
//             </section>

//             <section className="rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
//                 <h2 className="mb-4 text-lg font-semibold text-slate-900">
//                     Notes
//                 </h2>

//                 <textarea
//                     value={
//                         form.notes || ''
//                     }
//                     onChange={(event) =>
//                         updateField(
//                             'notes',
//                             event.target.value,
//                         )
//                     }
//                     rows={5}
//                     placeholder="Add notes..."
//                     className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//                 />
//             </section>

//             <div className="flex justify-end gap-3">
//                 <Link
//                     href="/contacts"
//                     className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
//                 >
//                     Cancel
//                 </Link>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
//                 >
//                     {loading
//                         ? mode === 'create'
//                             ? 'Creating...'
//                             : 'Updating...'
//                         : mode === 'create'
//                             ? 'Create Contact'
//                             : 'Update Contact'}
//                 </button>
//             </div>
//         </form>
//     );
// }

// function sanitizeContactPayload(
//     form: CreateContactPayload,
// ): CreateContactPayload {
//     return Object.fromEntries(
//         Object.entries(form)
//             .map(([key, value]) => [
//                 key,
//                 typeof value === 'string'
//                     ? value.trim()
//                     : value,
//             ])
//             .filter(([, value]) => value !== ''),
//     ) as CreateContactPayload;
// }

// function Input({
//     label,
//     value,
//     onChange,
//     type = 'text',
//     required = false,
// }: {
//     label: string;

//     value: string;

//     onChange: (
//         value: string,
//     ) => void;

//     type?: string;

//     required?: boolean;
// }) {
//     return (
//         <div>
//             <label className="mb-2 block text-sm font-medium text-slate-700">
//                 {label}

//                 {required && (
//                     <span className="ml-1 text-red-500">
//                         *
//                     </span>
//                 )}
//             </label>

//             <input
//                 type={type}
//                 value={value}
//                 required={required}
//                 onChange={(event) => onChange(event.target.value)}
//                 className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//             />
//         </div>
//     );
// }

// function Select({
//     label,
//     value,
//     options,
//     onChange,
// }: {
//     label: string;

//     value: string;

//     options: string[];

//     onChange: (
//         value: string,
//     ) => void;
// }) {
//     return (
//         <div>
//             <label className="mb-2 block text-sm font-medium text-slate-700">
//                 {label}
//             </label>

//             <select
//                 value={value}
//                 onChange={(event) =>
//                     onChange(
//                         event.target.value,
//                     )
//                 }
//                 className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//             >
//                 {options.map(
//                     (option) => (
//                         <option
//                             key={option}
//                             value={option}
//                         >
//                             {option}
//                         </option>
//                     ),
//                 )}
//             </select>
//         </div>
//     );
// }



'use client';

import {
  useState,
} from 'react';

import {
  X,
  UserRound,
} from 'lucide-react';

import {
  CreateContactPayload,
} from '@/services/contact.service';

interface ContactFormProps {
  initialData?: Partial<CreateContactPayload>;
  presentation?: 'modal' | 'page';
  error?: string;

  loading?: boolean;

  onSubmit: (
    data: CreateContactPayload,
  ) => Promise<void>;

  onClose: () => void;
}

export default function ContactForm({
  initialData,
  presentation = 'modal',
  error,
  loading,
  onSubmit,
  onClose,
}: ContactFormProps) {
  const [form, setForm] =
    useState<CreateContactPayload>({
      firstName:
        initialData?.firstName || '',
      lastName:
        initialData?.lastName || '',
      phone:
        initialData?.phone || '',
      email:
        initialData?.email || '',
      alternatePhone:
        initialData?.alternatePhone || '',
      company:
        initialData?.company || '',
      customerType:
        initialData?.customerType ||
        'INDIVIDUAL',
      status:
        initialData?.status ||
        'ACTIVE',
      address:
        initialData?.address || '',
      city:
        initialData?.city || '',
      state:
        initialData?.state || '',
      country:
        initialData?.country || '',
      postalCode:
        initialData?.postalCode || '',
      notes:
        initialData?.notes || '',
    });

  const update = (
    key: keyof CreateContactPayload,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    await onSubmit(form);
  };

  const isPage = presentation === 'page';

  return (
    <div className={isPage ? 'w-full' : 'contact-form-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6'}>
      <section aria-labelledby="contact-form-title" role={isPage ? undefined : 'dialog'} aria-modal={isPage ? undefined : true} className={`flex w-full flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-38px_rgba(15,23,42,.32)] ${isPage ? 'mx-auto max-w-4xl' : 'max-h-[92vh] max-w-3xl border-white/70 shadow-2xl'}`}>
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"><UserRound className="h-5 w-5" /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-indigo-600">Customer profile</p>
              <h2 id="contact-form-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-950">{initialData ? 'Edit contact' : 'Add a new contact'}</h2>
              {/* <p className="mt-0.5 text-xs text-slate-500">Save the details your team needs to build the relationship.</p> */}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close contact form" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X className="h-4 w-4" /></button>
        </header>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-5 overflow-y-auto p-5 sm:p-7">
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div>
              <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Basic information</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-semibold text-slate-600">First name<input required autoFocus={!initialData} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="e.g. Aanya" className="block h-11 w-full px-3.5 text-sm font-normal text-slate-900 placeholder:font-normal" /></label>
                <label className="space-y-1.5 text-sm font-semibold text-slate-600">Last name<input required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="e.g. Shah" className="block h-11 w-full px-3.5 text-sm font-normal text-slate-900 placeholder:font-normal" /></label>
                <label className="space-y-1.5 text-sm font-semibold text-slate-600">Phone number<input required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" className="block h-11 w-full px-3.5 text-sm font-normal text-slate-900 placeholder:font-normal" /></label>
                <label className="space-y-1.5 text-sm font-semibold text-slate-600">Email address<input type="email" value={form.email ?? ''} onChange={(e) => update('email', e.target.value)} placeholder="name@company.com" className="block h-11 w-full px-3.5 text-sm font-normal text-slate-900 placeholder:font-normal" /></label>
                <label className="space-y-1.5 text-sm font-semibold text-slate-600">Company<input value={form.company ?? ''} onChange={(e) => update('company', e.target.value)} placeholder="Company name (optional)" className="block h-11 w-full px-3.5 text-sm font-normal text-slate-900 placeholder:font-normal" /></label>
                <label className="space-y-1.5 text-sm font-semibold text-slate-600">Customer type<select value={form.customerType} onChange={(e) => update('customerType', e.target.value)} className="block h-11 w-full bg-white px-3.5 text-sm font-normal text-slate-900"><option value="INDIVIDUAL">Individual</option><option value="BUSINESS">Business</option></select></label>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Location & notes</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-semibold text-slate-600">City<input value={form.city ?? ''} onChange={(e) => update('city', e.target.value)} placeholder="City" className="block h-11 w-full px-3.5 text-sm font-normal" /></label>
                <label className="space-y-1.5 text-sm font-semibold text-slate-600">State<input value={form.state ?? ''} onChange={(e) => update('state', e.target.value)} placeholder="State" className="block h-11 w-full px-3.5 text-sm font-normal" /></label>
                <label className="space-y-1.5 text-sm font-semibold text-slate-600 sm:col-span-2">Address<textarea rows={2} value={form.address ?? ''} onChange={(e) => update('address', e.target.value)} placeholder="Street, area, and any useful directions" className="block w-full resize-y px-3.5 py-3 text-sm font-normal" /></label>
                <label className="space-y-1.5 text-sm font-semibold text-slate-600 sm:col-span-2">Private notes<textarea rows={2} value={form.notes ?? ''} onChange={(e) => update('notes', e.target.value)} placeholder="Context for your team (optional)" className="block w-full resize-y px-3.5 py-3 text-sm font-normal" /></label>
              </div>
            </div>
          </div>

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-7">
            <p className="hidden text-xs text-slate-400 sm:block"><span className="text-rose-500">*</span> Required fields</p>
            <div className="ml-auto flex gap-2.5">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>
              <button disabled={loading} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 transition hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Saving…' : initialData ? 'Save changes' : 'Create contact'}</button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}
