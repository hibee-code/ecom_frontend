import { Notify } from 'quasar';

export function useNotify({
  type = 'positive',
  message,
}: {
  type?: 'positive' | 'negative' | 'warning' | 'info';
  message?: string;
} = {}) {
  Notify.create({
    message:
      message || type === 'negative'
        ? 'Process failed'
        : 'Process was successful',
    type,
    timeout: type === 'positive' ? 300 : 5000,
  });
}
