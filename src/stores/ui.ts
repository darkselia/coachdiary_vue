import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const mobileTitle = ref('');
  const confirmDialogs = ref<Dialog[]>([]);

  function showConfirmDialog({
    title,
    text,
    confirmText = 'Да',
    cancelText = 'Нет',
  }: ConfirmDialogOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const dialog: Dialog = {
        title,
        text,
        confirmText,
        cancelText,
        confirmAction: () => removeDialog(dialog, resolve),
        cancelAction: () => removeDialog(dialog, reject),
      };
      confirmDialogs.value.push(dialog);
    });
  }

  function removeDialog(dialog: Dialog, action: () => void) {
    const index = confirmDialogs.value.indexOf(dialog);
    confirmDialogs.value.splice(index, 1);
    action();
  }

  return {
    mobileTitle,
    confirmDialogs,
    showConfirmDialog,
  };
});

type ConfirmDialogOptions = {
  title?: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
};

type Dialog = {
  title?: string;
  text: string;
  confirmText: string;
  cancelText: string;
  confirmAction: () => void;
  cancelAction: () => void;
};
