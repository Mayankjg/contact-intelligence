import type { DashboardNotification } from '@/lib/notifications';

export const NOTIFICATIONS_UPDATED_EVENT =
  'contactiq:notifications-updated';

const ACTION_NOTIFICATIONS_KEY =
  'contactiq_action_notifications';
const DISMISSED_NOTIFICATIONS_KEY =
  'contactiq_dismissed_notifications';
const MAX_ACTION_NOTIFICATIONS = 30;
const MAX_DISMISSED_NOTIFICATIONS = 500;

function getActionDescription(endpoint: string) {
  if (endpoint.startsWith('/contacts')) return 'Contact';
  if (endpoint.startsWith('/products')) return 'Product';
  if (endpoint.startsWith('/purchases')) return 'Purchase';
  if (endpoint.startsWith('/followups')) return 'Follow-up';
  if (
    endpoint.startsWith('/services') ||
    endpoint.startsWith('/customer-services')
  ) {
    return 'Service';
  }

  return 'Record';
}

function getActionMessage(method: string) {
  if (method === 'POST') return 'created successfully.';
  if (method === 'DELETE') return 'deleted successfully.';
  return 'updated successfully.';
}

export function getStoredActionNotifications() {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(
      ACTION_NOTIFICATIONS_KEY,
    );
    const notifications = stored
      ? (JSON.parse(stored) as DashboardNotification[])
      : [];

    return Array.isArray(notifications) ? notifications : [];
  } catch {
    return [];
  }
}

export function getDismissedNotificationIds() {
  if (typeof window === 'undefined') return new Set<string>();

  try {
    const stored = window.localStorage.getItem(
      DISMISSED_NOTIFICATIONS_KEY,
    );
    const ids = stored ? (JSON.parse(stored) as unknown) : [];

    return new Set(
      Array.isArray(ids)
        ? ids.filter((id): id is string => typeof id === 'string')
        : [],
    );
  } catch {
    return new Set<string>();
  }
}

export function dismissNotifications(ids: string[]) {
  if (typeof window === 'undefined' || ids.length === 0) return;

  const dismissed = new Set([
    ...getDismissedNotificationIds(),
    ...ids,
  ]);
  window.localStorage.setItem(
    DISMISSED_NOTIFICATIONS_KEY,
    JSON.stringify(
      [...dismissed].slice(-MAX_DISMISSED_NOTIFICATIONS),
    ),
  );

  const idsToDismiss = new Set(ids);
  window.localStorage.setItem(
    ACTION_NOTIFICATIONS_KEY,
    JSON.stringify(
      getStoredActionNotifications().filter(
        (notification) => !idsToDismiss.has(notification.id),
      ),
    ),
  );
}

export function notifySuccessfulAction(
  endpoint: string,
  method: string,
) {
  if (typeof window === 'undefined') return;

  const itemName = getActionDescription(endpoint);
  const notification: DashboardNotification = {
    id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: 'action',
    title: `${itemName} ${method === 'POST' ? 'created' : method === 'DELETE' ? 'deleted' : 'updated'}`,
    message: `${itemName} ${getActionMessage(method)}.`,
    customerName: itemName,
    href: endpoint.startsWith('/contacts') ? '/contacts' : '/',
    dueDate: new Date().toISOString(),
    isOverdue: false,
  };

  const notifications = [
    notification,
    ...getStoredActionNotifications(),
  ].slice(0, MAX_ACTION_NOTIFICATIONS);

  window.localStorage.setItem(
    ACTION_NOTIFICATIONS_KEY,
    JSON.stringify(notifications),
  );
  window.dispatchEvent(
    new CustomEvent<DashboardNotification>(
      NOTIFICATIONS_UPDATED_EVENT,
      { detail: notification },
    ),
  );
}
