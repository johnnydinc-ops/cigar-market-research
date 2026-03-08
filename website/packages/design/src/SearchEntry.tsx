import type { FormEvent } from "react";

export interface SearchEntryProps {
  placeholder: string;
  onSubmit: (query: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export function SearchEntry({
  placeholder,
  onSubmit,
  disabled = false,
  ariaLabel = "Search for a cigar you like",
}: SearchEntryProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector<HTMLInputElement>('input[name="cigar-search"]');
    const value = input?.value?.trim();
    if (value) onSubmit(value);
  };

  return (
    <form
      className="cigar-search-entry"
      onSubmit={handleSubmit}
      role="search"
      aria-label={ariaLabel}
    >
      <label htmlFor="cigar-search-input" className="visually-hidden">
        {ariaLabel}
      </label>
      <input
        id="cigar-search-input"
        name="cigar-search"
        type="search"
        className="cigar-search-entry__input"
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        autoComplete="off"
      />
      <button
        type="submit"
        className="cigar-search-entry__btn"
        disabled={disabled}
        aria-label="Submit search"
      >
        Find similar
      </button>
    </form>
  );
}
