"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { ApiOption } from "@/types";

interface OptionDropdownProps {
  options: ApiOption[];
  selected: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function OptionDropdown({
  options,
  selected,
  onChange,
  label = "Option",
}: OptionDropdownProps) {
  const selectedOption = options.find((o) => o.id === selected);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <span className="block truncate">
              {selectedOption?.label || "Select an option"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg focus:outline-none">
            {options.map((opt) => (
              <ListboxOption
                key={opt.id}
                value={opt.id}
                className="cursor-pointer select-none px-3 py-2 text-gray-900 data-[focus]:bg-blue-50 data-[selected]:font-medium"
              >
                {opt.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
