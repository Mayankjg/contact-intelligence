// 'use client';

// import {
//   useEffect,
//   useState,
// } from 'react';

// import Link from 'next/link';

// import {
//   ArrowLeft,
//   Building2,
//   CheckSquare,
//   CreditCard,
//   Mail,
//   MapPin,
//   Pencil,
//   Phone,
//   ShoppingBag,
//   Truck,
// } from 'lucide-react';

// import {
//   contactService,
// } from '@/services/contact.service';

// import {
//   Contact,
// } from '@/types/contact';
// import { getErrorMessage } from '@/lib/error-message';

// interface PageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default function ContactDetailsPage({
//   params,
// }: PageProps) {
//   const [contact, setContact] =
//     useState<Contact | null>(
//       null,
//     );

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState('');

//   useEffect(() => {
//     async function load() {
//       try {
//         const { id } =
//           await params;

//         const response =
//           await contactService.getContact(
//             id,
//           );

//         setContact(
//           response.data,
//         );
//       } catch (err: unknown) {
//         setError(
//           getErrorMessage(
//             err,
//             'Unable to load contact',
//           ),
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [params]);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-slate-50 p-6">
//         <div className="mx-auto max-w-6xl py-20 text-center text-slate-500">
//           Loading contact...
//         </div>
//       </main>
//     );
//   }

//   if (error || !contact) {
//     return (
//       <main className="min-h-screen bg-slate-50 p-6">
//         <div className="mx-auto max-w-6xl">

//           <Link
//             href="/contacts"
//             className="flex items-center gap-2 text-sm text-indigo-600"
//           >
//             <ArrowLeft size={16} />
//             Back to Contacts
//           </Link>

//           <div className="mt-6 rounded-xl bg-red-50 p-6 text-red-600">
//             {error ||
//               'Contact not found'}
//           </div>

//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 p-6">

//       <div className="mx-auto max-w-6xl">

//         {/* Header */}

//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//           <div>

//             <Link
//               href="/contacts"
//               className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
//             >
//               <ArrowLeft size={16} />
//               Back to Contacts
//             </Link>

//             <h1 className="mt-3 text-2xl font-bold text-slate-900">
//               {contact.firstName}{' '}
//               {contact.lastName}
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               Contact profile and information
//             </p>

//           </div>

//           <Link
//             href={`/contacts/${contact.id}/edit`}
//             className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
//           >
//             <Pencil size={17} />
//             Edit Contact
//           </Link>

//         </div>

//         {/* Profile */}

//         <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">

//           <div className="flex flex-col gap-6 md:flex-row md:items-center">

//             <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
//               {
//                 contact.firstName[0]
//               }
//               {
//                 contact.lastName[0]
//               }
//             </div>

//             <div className="flex-1">

//               <div className="flex flex-wrap items-center gap-3">

//                 <h2 className="text-xl font-semibold text-slate-900">
//                   {
//                     contact.firstName
//                   }{' '}
//                   {
//                     contact.lastName
//                   }
//                 </h2>

//                 <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
//                   {
//                     contact.status
//                   }
//                 </span>

//               </div>

//               <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">

//                 <span className="flex items-center gap-2">
//                   <Phone size={16} />
//                   {
//                     contact.phone
//                   }
//                 </span>

//                 {contact.email && (
//                   <span className="flex items-center gap-2">
//                     <Mail size={16} />
//                     {
//                       contact.email
//                     }
//                   </span>
//                 )}

//                 {contact.company && (
//                   <span className="flex items-center gap-2">
//                     <Building2 size={16} />
//                     {
//                       contact.company
//                     }
//                   </span>
//                 )}

//               </div>

//             </div>

//           </div>

//         </section>

//         {/* Summary */}

//         <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

//           <SummaryCard
//             title="Orders"
//             value="0"
//             icon={
//               <ShoppingBag
//                 size={20}
//               />
//             }
//           />

//           <SummaryCard
//             title="Pending Payment"
//             value="₹0"
//             icon={
//               <CreditCard
//                 size={20}
//               />
//             }
//           />

//           <SummaryCard
//             title="Deliveries"
//             value="0"
//             icon={
//               <Truck
//                 size={20}
//               />
//             }
//           />

//           <SummaryCard
//             title="Pending Tasks"
//             value="0"
//             icon={
//               <CheckSquare
//                 size={20}
//               />
//             }
//           />

//         </div>

//         {/* Personal Information */}

//         <section className="rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">

//           <h2 className="mb-6 text-lg font-semibold text-slate-900">
//             Contact Information
//           </h2>

//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

//             <Info
//               label="First Name"
//               value={
//                 contact.firstName
//               }
//             />

//             <Info
//               label="Last Name"
//               value={
//                 contact.lastName
//               }
//             />

//             <Info
//               label="Phone"
//               value={
//                 contact.phone
//               }
//             />

//             <Info
//               label="Email"
//               value={
//                 contact.email
//               }
//             />

//             <Info
//               label="Alternate Phone"
//               value={
//                 contact.alternatePhone
//               }
//             />

//             <Info
//               label="Company"
//               value={
//                 contact.company
//               }
//             />

//             <Info
//               label="Customer Type"
//               value={
//                 contact.customerType
//               }
//             />

//             <Info
//               label="City"
//               value={
//                 contact.city
//               }
//             />

//             <Info
//               label="State"
//               value={
//                 contact.state
//               }
//             />

//             <Info
//               label="Country"
//               value={
//                 contact.country
//               }
//             />

//             <Info
//               label="Postal Code"
//               value={
//                 contact.postalCode
//               }
//             />

//           </div>

//           <div className="mt-8">

//             <div className="mb-2 flex items-center gap-2">
//               <MapPin
//                 size={17}
//                 className="text-indigo-600"
//               />

//               <h3 className="font-semibold text-slate-900">
//                 Address
//               </h3>
//             </div>

//             <p className="text-sm text-slate-600">
//               {
//                 contact.address ||
//                 'No address available'
//               }
//             </p>

//           </div>

//           <div className="mt-8">

//             <h3 className="mb-2 font-semibold text-slate-900">
//               Notes
//             </h3>

//             <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
//               {
//                 contact.notes ||
//                 'No notes added.'
//               }
//             </div>

//           </div>

//         </section>

//         {/* Future modules */}

//         <section className="mt-6">

//           <h2 className="mb-4 text-lg font-semibold text-slate-900">
//             Customer Activity
//           </h2>

//           <div className="grid gap-4 md:grid-cols-3">

//             <FutureCard
//               title="Orders"
//               description="Order history will be connected in Phase 3."
//             />

//             <FutureCard
//               title="Payments"
//               description="Payment information will be connected in Phase 4."
//             />

//             <FutureCard
//               title="Deliveries"
//               description="Delivery tracking will be connected in Phase 5."
//             />

//             <FutureCard
//               title="Tasks"
//               description="Follow-up tasks will be connected in Phase 6."
//             />

//             <FutureCard
//               title="Activities"
//               description="Customer activity timeline will be connected in Phase 6."
//             />

//             <FutureCard
//               title="AI Summary"
//               description="Generative AI insights will be added later."
//             />

//           </div>

//         </section>

//       </div>

//     </main>
//   );
// }

// function SummaryCard({
//   title,
//   value,
//   icon,
// }: {
//   title: string;
//   value: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">

//       <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
//         {icon}
//       </div>

//       <p className="text-sm text-slate-500">
//         {title}
//       </p>

//       <p className="mt-1 text-2xl font-bold text-slate-900">
//         {value}
//       </p>

//     </div>
//   );
// }

// function Info({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | null;
// }) {
//   return (
//     <div>

//       <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
//         {label}
//       </p>

//       <p className="mt-1 text-sm font-medium text-slate-800">
//         {value || '-'}
//       </p>

//     </div>
//   );
// }

// function FutureCard({
//   title,
//   description,
// }: {
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5">

//       <h3 className="font-semibold text-slate-900">
//         {title}
//       </h3>

//       <p className="mt-2 text-sm text-slate-500">
//         {description}
//       </p>

//     </div>
//   );
// }



'use client';

import {
  use,
  useEffect,
  useState,
} from 'react';

import {
  Plus,
  ShoppingBag,
  BellRing,
} from 'lucide-react';

import {
  contactService,
} from '@/services/contact.service';

import {
  purchaseService,
} from '@/services/purchase.service';

import {
  serviceService,
} from '@/services/service.service';

import {
  followupService,
} from '@/services/followup.service';

import {
  productService,
} from '@/services/product.service';

import ContactHeader from '@/components/contacts/contact-header';

import ContactSummary from '@/components/contacts/contact-summary';

import PurchaseHistory from '@/components/contacts/purchase-history';

import PurchaseDialog from '@/components/contacts/purchase-dialog';

import ServiceList from '@/components/contacts/service-list';

import FollowUpList from '@/components/contacts/followup-list';

import FollowUpDialog from '@/components/contacts/followup-dialog';

import CustomerTimeline from '@/components/contacts/customer-timeline';

import { Contact } from '@/types/contact';

import { Product } from '@/types/product';

export default function ContactDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);

  const [contact, setContact] =
    useState<Contact | null>(null);

  const [purchases, setPurchases] =
    useState<any[]>([]);

  const [services, setServices] =
    useState<any[]>([]);

  const [followUps, setFollowUps] =
    useState<any[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showPurchaseDialog, setShowPurchaseDialog] =
    useState(false);

  const [showFollowUpDialog, setShowFollowUpDialog] =
    useState(false);

  async function loadData() {
    try {
      setLoading(true);

      const [
        contactResponse,
        purchaseResponse,
        serviceResponse,
        followUpResponse,
        productResponse,
      ] = await Promise.all([
        contactService.getContact(id),

        purchaseService.getPurchases({
          contactId: id,
        }),

        serviceService.getServices({
          contactId: id,
        }),

        followupService.getFollowUps({
          contactId: id,
        }),

        productService.getProducts({
          page: 1,
          limit: 100,
          status: 'ACTIVE',
        }),
      ]);

      setContact(
        contactResponse.data,
      );

      setPurchases(
        purchaseResponse.data,
      );

      setServices(
        serviceResponse.data,
      );

      setFollowUps(
        followUpResponse.data,
      );

      setProducts(
        productResponse.data,
      );
    } catch (error) {
      console.error(
        'Contact details error:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">
        Loading customer...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center">
        Customer not found.
      </div>
    );
  }

  const completeService = async (
    service: any,
  ) => {
    await serviceService.completeService(
      service.id,
    );

    await loadData();
  };

  const completeFollowUp = async (
    followUp: any,
  ) => {
    await followupService.completeFollowUp(
      followUp.id,
    );

    await loadData();
  };

  const timeline = [
    ...purchases.map((purchase) => ({
      id: `purchase-${purchase.id}`,
      type: 'PURCHASE' as const,
      title: `Purchased ${purchase.items
        ?.map(
          (item: any) =>
            item.product?.name,
        )
        .join(', ')}`,
      description:
        purchase.purchaseNumber,
      date: purchase.purchaseDate,
    })),

    ...services.map((service) => ({
      id: `service-${service.id}`,
      type: 'SERVICE' as const,
      title: service.serviceName,
      description: service.status,
      date: service.scheduledDate,
    })),

    ...followUps.map((followUp) => ({
      id: `followup-${followUp.id}`,
      type: 'FOLLOWUP' as const,
      title: followUp.title,
      description:
        followUp.description || '',
      date: followUp.followUpDate,
    })),
  ].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-6">
      <ContactHeader
        contact={contact}
      />

      <ContactSummary
        totalPurchases={
          purchases.length
        }
        totalProducts={purchases.reduce(
          (sum, purchase) =>
            sum +
            (purchase.items?.length ||
              0),
          0,
        )}
        upcomingServices={
          services.filter(
            (service) =>
              service.status !==
                'COMPLETED' &&
              service.status !==
                'CANCELLED',
          ).length
        }
        pendingFollowUps={
          followUps.filter(
            (item) =>
              item.status === 'PENDING',
          ).length
        }
      />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() =>
            setShowPurchaseDialog(true)
          }
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          <ShoppingBag className="h-4 w-4" />
          Add Purchase
        </button>

        <button
          onClick={() =>
            setShowFollowUpDialog(true)
          }
          className="flex items-center gap-2 rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-slate-700"
        >
          <BellRing className="h-4 w-4" />
          Add Follow-up
        </button>
      </div>

      <PurchaseHistory
        purchases={purchases}
      />

      <ServiceList
        services={services}
        onComplete={completeService}
      />

      <FollowUpList
        followUps={followUps}
        onComplete={completeFollowUp}
      />

      <CustomerTimeline
        items={timeline}
      />

      {showPurchaseDialog && (
        <PurchaseDialog
          contactId={id}
          products={products}
          onSubmit={async (data) => {
            await purchaseService.createPurchase(
              data,
            );

            await loadData();
          }}
          onClose={() =>
            setShowPurchaseDialog(false)
          }
        />
      )}

      {showFollowUpDialog && (
        <FollowUpDialog
          contactId={id}
          onSubmit={async (data) => {
            await followupService.createFollowUp(
              data,
            );

            await loadData();
          }}
          onClose={() =>
            setShowFollowUpDialog(false)
          }
        />
      )}
    </div>
  );
}