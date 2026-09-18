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

function startOfDay(value: string | Date) {
  const date = new Date(value);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
}

function compareCalendarDay(
  value: string | Date,
  reference = new Date(),
) {
  const itemDay = startOfDay(value).getTime();
  const refDay = startOfDay(reference).getTime();

  if (itemDay === refDay) {
    return 0;
  }

  return itemDay < refDay ? -1 : 1;
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
      const dayComparison = compareCalendarDay(
        service.scheduledDate,
        reference,
      );

      if (dayComparison > 0) {
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
          ? `${customerName} needs ${service.serviceName} for ${productName}.`
          : `${customerName} needs ${service.serviceName} today.`,
        customerName,
        href: `/contacts/${service.contactId}`,
        dueDate: service.scheduledDate,
        isOverdue: dayComparison < 0,
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

      const followUpComparison = compareCalendarDay(
        followUp.followUpDate,
        reference,
      );

      if (followUpComparison <= 0) {
        notifications.push({
          id: `followup-${followUp.id}`,
          type: 'followup',
          title: followUp.title,
          message: `${customerName} has a follow-up scheduled today.`,
          customerName,
          href: `/contacts/${followUp.contactId}`,
          dueDate: followUp.followUpDate,
          isOverdue: followUpComparison < 0,
        });
      }

      if (followUp.reminderDate) {
        const reminderComparison =
          compareCalendarDay(
            followUp.reminderDate,
            reference,
          );

        if (reminderComparison <= 0) {
          notifications.push({
            id: `reminder-${followUp.id}`,
            type: 'reminder',
            title: followUp.title,
            message: `${customerName} has a reminder due for this follow-up.`,
            customerName,
            href: `/contacts/${followUp.contactId}`,
            dueDate: followUp.reminderDate,
            isOverdue:
              reminderComparison < 0,
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
        compareCalendarDay(contact.createdAt, reference) === 0,
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
        compareCalendarDay(product.createdAt, reference) === 0,
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
        compareCalendarDay(
          service.scheduledDate,
          now,
        ) >= 0,
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
        compareCalendarDay(
          followUp.followUpDate,
          now,
        ) >= 0,
    )
    .sort(
      (left, right) =>
        new Date(left.followUpDate).getTime() -
        new Date(right.followUpDate).getTime(),
    )
    .slice(0, limit);
}
