export function openBlob(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function selectFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}

type DebouncedFunction<TArgs extends unknown[]> = {
  (...args: TArgs): void;
  cancel: () => void;
};

export function useDebounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void | Promise<void>,
  delay = 400,
): DebouncedFunction<TArgs> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = ((...args: TArgs) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = undefined;
      void callback(...args);
    }, delay);
  }) as DebouncedFunction<TArgs>;

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced;
}
