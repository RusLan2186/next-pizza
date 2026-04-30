"use client";

import React from "react";
import { Input } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { ClearButton } from "../clear-button";
import { ErrorText } from "../error-text";

type AddressSuggestion = {
  id: string;
  label: string;
};

type SearchScope = "ua" | "world";

interface Props<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  suggestionIdName: FieldPath<TFieldValues>;
  className?: string;
  placeholder?: string;
}

export const FormAddressInput = <TFieldValues extends FieldValues>({
  name,
  suggestionIdName,
  className,
  placeholder = "Enter your address...",
}: Props<TFieldValues>) => {
  const { control, setValue } = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control,
  });

  const [scope, setScope] = React.useState<SearchScope>("ua");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<AddressSuggestion[]>([]);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  React.useEffect(() => {
    const query = String(field.value ?? "").trim();

    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/address/suggest?query=${encodeURIComponent(query)}&scope=${scope}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          setSuggestions([]);
          setIsOpen(false);
          return;
        }

        const data = (await response.json()) as AddressSuggestion[];
        setSuggestions(data);
        setIsOpen(data.length > 0);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [field.value, scope]);

  const handleChange = (value: string) => {
    field.onChange(value);
    setValue(suggestionIdName, "" as TFieldValues[FieldPath<TFieldValues>], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleSelectAddress = (suggestion: AddressSuggestion) => {
    setValue(name, suggestion.label as TFieldValues[FieldPath<TFieldValues>], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue(
      suggestionIdName,
      suggestion.id as TFieldValues[FieldPath<TFieldValues>],
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
    setIsOpen(false);
  };

  const handleClear = () => {
    setValue(name, "" as TFieldValues[FieldPath<TFieldValues>], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue(suggestionIdName, "" as TFieldValues[FieldPath<TFieldValues>], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 xs:flex-row sm:flex-row">
        <div className="relative flex-1" ref={containerRef}>
          <Input
            ref={field.ref}
            name={field.name}
            value={field.value ?? ""}
            onChange={(event) => handleChange(event.target.value)}
            onBlur={field.onBlur}
            className="h-12 text-base"
            placeholder={placeholder}
            autoComplete="off"
            aria-invalid={fieldState.invalid}
          />

          {field.value && <ClearButton onClick={handleClear} />}

          {isOpen && (
            <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSelectAddress(suggestion)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Select
          value={scope}
          onValueChange={(value) => setScope(value as SearchScope)}
        >
          <SelectTrigger className="h-12 w-full px-3 text-sm sm:w-[160px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ua">Ukraine</SelectItem>
            <SelectItem value="world">Worldwide</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {fieldState.error?.message && (
        <ErrorText className="mt-2" text={fieldState.error.message} />
      )}

      {isLoading && (
        <p className="mt-2 text-sm text-muted-foreground">
          Searching addresses...
        </p>
      )}
    </div>
  );
};
