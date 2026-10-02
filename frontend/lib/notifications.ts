import type { FollowUp } from '@/services/followup.service';
import type { CustomerService } from '@/services/service.service';
import type { Contact } from '@/services/contact.service';
import type { Product } from '@/services/product.service';

export interface DashboardNotification {
  id: string;
  type:
    | 'service'
    | 'followup'
    | 'reminder'
    | 'contact'
    | 'product'
    | 'action';
  title: string;
  message: string;
  customerName: string;
  href: string;
  dueDate: string;
  isOverdue: boolean;
}

function isDue(value: string | Date, reference = new Date()) {
  return new Date(value).getTime() <= reference.getTime();
}

function getCustomerName(contact?: {
  firstName?: string | null;
  lastName?: string | null;
}) {
  const fullName = [
    contact?.firstName,
    contact?.lastName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || 'Unknown customer';
}

export function buildServiceNotifications(
  services: CustomerService[],
  reference = new Date(),
): DashboardNotification[] {
  return services
    .filter(
      (service) =>
        service.status !== 'COMPLETED' &&
        service.status !== 'CANCELLED',
    )
    .reduce<DashboardNotification[]>(
      (notifications, service) => {
      const due = isDue(
        service.scheduledDate,
        reference,
      );

      if (!due) {
        return notifications;
      }

      const customerName = getCustomerName(
        service.contact,
      );
      const productName =
        service.productService?.product?.name;

      notifications.push({
        id: `service-${service.id}`,
        type: 'service',
        title: service.serviceName,
        message: productName
          ? `${customerName} has ${service.serviceName} scheduled for ${productName}.`
          : `${customerName} has a ${service.serviceName} service scheduled.`,
        customerName,
        href: `/contacts/${service.contactId}`,
        dueDate: service.scheduledDate,
        isOverdue: new Date(service.scheduledDate).getTime() < reference.getTime(),
      });

      return notifications;
    },
    [],
    );
}

export function buildFollowUpNotifications(
  followUps: FollowUp[],
  reference = new Date(),
) {
  return followUps
    .filter(
      (followUp) =>
        followUp.status !== 'COMPLETED' &&
        followUp.status !== 'CANCELLED',
    )
    .flatMap((followUp) => {
      const customerName = getCustomerName(
        followUp.contact,
      );
      const notifications: DashboardNotification[] =
        [];

      const followUpDue = isDue(
        followUp.followUpDate,
        reference,
      );

      if (followUpDue) {
        notifications.push({
          id: `followup-${followUp.id}`,
          type: 'followup',
          title: followUp.title,
          message: `${customerName} has a follow-up due.`,
          customerName,
          href: `/contacts/${followUp.contactId}`,
          dueDate: followUp.followUpDate,
          isOverdue: new Date(followUp.followUpDate).getTime() < reference.getTime(),
        });
      }

      if (followUp.reminderDate) {
        const reminderDue = isDue(followUp.reminderDate, reference);

        if (reminderDue) {
          notifications.push({
            id: `reminder-${followUp.id}`,
            type: 'reminder',
            title: followUp.title,
            message: `${customerName} has a follow-up reminder due.`,
            customerName,
            href: `/contacts/${followUp.contactId}`,
            dueDate: followUp.reminderDate,
            isOverdue: new Date(followUp.reminderDate).getTime() < reference.getTime(),
          });
        }
      }

      return notifications;
    });
}

export function buildActivityNotifications(
  contacts: Contact[],
  products: Product[],
  reference = new Date(),
): DashboardNotification[] {
  const newContacts = contacts
    .filter(
      (contact) =>
        new Date(contact.createdAt).toDateString() === reference.toDateString(),
    )
    .map((contact) => {
      const customerName = getCustomerName(contact);

      return {
        id: `contact-${contact.id}`,
        type: 'contact' as const,
        title: 'New contact added',
        message: `${customerName} was added to your contacts today.`,
        customerName,
        href: `/contacts/${contact.id}`,
        dueDate: contact.createdAt,
        isOverdue: false,
      };
    });

  const newProducts = products
    .filter(
      (product) =>
        new Date(product.createdAt).toDateString() === reference.toDateString(),
    )
    .map((product) => ({
      id: `product-${product.id}`,
      type: 'product' as const,
      title: 'New product added',
      message: `${product.name} was added to your products today.`,
      customerName: product.name,
      href: `/products/${product.id}`,
      dueDate: product.createdAt,
      isOverdue: false,
    }));

  return [...newContacts, ...newProducts];
}

export function sortNotifications(
  notifications: DashboardNotification[],
) {
  return [...notifications].sort(
    (left, right) => {
      const dueDateDiff =
        new Date(left.dueDate).getTime() -
        new Date(right.dueDate).getTime();

      if (dueDateDiff !== 0) {
        return dueDateDiff;
      }

      return left.customerName.localeCompare(
        right.customerName,
      );
    },
  );
}

export function getUpcomingServices(
  services: CustomerService[],
  limit = 5,
) {
  const now = new Date();

  return [...services]
    .filter(
      (service) =>
        service.status !== 'COMPLETED' &&
        service.status !== 'CANCELLED' &&
        new Date(service.scheduledDate).getTime() >= now.getTime(),
    )
    .sort(
      (left, right) =>
        new Date(left.scheduledDate).getTime() -
        new Date(right.scheduledDate).getTime(),
    )
    .slice(0, limit);
}

export function getUpcomingFollowUps(
  followUps: FollowUp[],
  limit = 5,
) {
  const now = new Date();

  return [...followUps]
    .filter(
      (followUp) =>
        followUp.status !== 'COMPLETED' &&
        followUp.status !== 'CANCELLED' &&
        new Date(followUp.followUpDate).getTime() >= now.getTime(),
    )
    .sort(
      (left, right) =>
        new Date(left.followUpDate).getTime() -
        new Date(right.followUpDate).getTime(),
    )
    .slice(0, limit);
}
