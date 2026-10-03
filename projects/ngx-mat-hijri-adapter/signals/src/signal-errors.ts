import type { ValidationErrors } from '@angular/forms';
import type { ValidationError } from '@angular/forms/signals';

/** Datepicker errors from the inner Material control, as signal forms parse errors. */
export function datepickerErrors(
  errors: ValidationErrors | null,
): ValidationError.WithoutFieldTree[] {
  return Object.keys(errors ?? {}).map((kind) => ({ kind }));
}

/**
 * The message for the first error with one. Datepicker errors such as `matDatepickerParse`
 * come before schema errors such as `required`.
 */
export function firstErrorMessage(
  errors: readonly ValidationError.WithOptionalFieldTree[],
  messages: Record<string, string>,
): string {
  const ordered = [
    ...errors.filter((error) => error.kind.startsWith('mat')),
    ...errors.filter((error) => !error.kind.startsWith('mat')),
  ];

  for (const error of ordered) {
    const message = messages[error.kind] ?? error.message;
    if (message) {
      return message;
    }
  }

  return '';
}
