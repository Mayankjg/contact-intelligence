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
} from 'lucide-react';

import {
  CreateContactPayload,
} from '@/services/contact.service';

interface ContactFormProps {
  initialData?: Partial<CreateContactPayload>;

  loading?: boolean;

  onSubmit: (
    data: CreateContactPayload,
  ) => Promise<void>;

  onClose: () => void;
}

export default function ContactForm({
  initialData,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {initialData
                ? 'Edit Contact'
                : 'Add Contact'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter customer information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="space-y-6 p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              placeholder="First name"
              value={form.firstName}
              onChange={(e) =>
                update(
                  'firstName',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
            />

            <input
              required
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) =>
                update(
                  'lastName',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
            />

            <input
              required
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) =>
                update(
                  'phone',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email ?? ''}
              onChange={(e) =>
                update(
                  'email',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
            />

            <input
              placeholder="Company"
              value={form.company ?? ''}
              onChange={(e) =>
                update(
                  'company',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
            />

            <select
              value={form.customerType}
              onChange={(e) =>
                update(
                  'customerType',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3 outline-none"
            >
              <option value="INDIVIDUAL">
                Individual
              </option>

              <option value="BUSINESS">
                Business
              </option>
            </select>

            <input
              placeholder="City"
              value={form.city ?? ''}
              onChange={(e) =>
                update(
                  'city',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3 outline-none"
            />

            <input
              placeholder="State"
              value={form.state ?? ''}
              onChange={(e) =>
                update(
                  'state',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3 outline-none"
            />
          </div>

          <textarea
            placeholder="Address"
            rows={3}
            value={form.address ?? ''}
            onChange={(e) =>
              update(
                'address',
                e.target.value,
              )
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />

          <textarea
            placeholder="Notes"
            rows={3}
            value={form.notes ?? ''}
            onChange={(e) =>
              update(
                'notes',
                e.target.value,
              )
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-3 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : 'Save Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
