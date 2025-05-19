"use client"

import * as React from "react"
import { format, parseISO, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export default function DatePicker({ ...props }): React.JSX.Element {
  const { field } = props[0]; // extract field from props
  const [date, setDate] = React.useState<Date | undefined>(() => {
    // Try parsing the date from the field value
    if (typeof field.value === "string") {
      const parsed = parseISO(field.value); // Safely parse ISO strings
      return isValid(parsed) ? parsed : undefined;
    } else if (field.value instanceof Date) {
      return field.value;
    }
    return undefined;
  });


  const isDisabled = field.disabled;

  const rawValue = field.value;
  let dateFormula = "تاريخ غير صالح";

  if (typeof rawValue === "string") {
    const parsed = parseISO(rawValue);
    if (isValid(parsed)) {
      dateFormula = parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  } else if (rawValue instanceof Date) {
    dateFormula = rawValue.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }


  return (
    <Popover>
      <PopoverTrigger disabled={isDisabled}>
        <Button
          type="button"
          className={`w-full ${isDisabled ? "text-zinc-600 hover:bg-inherit" : "text-gray-600 hover:bg-accent"} bg-inherit border-0 border-b-2 border-b-zinc-500 rounded-none flex flex-row justify-between`}
        >
          {date ? format(date, "PPP") : <span className="disabled:text-zinc-600">{dateFormula}</span>}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>

      {!isDisabled && (
        <PopoverContent className="w-auto p-0">
          <Calendar
            dir="rtl"
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                selectedDate.setHours(12); // Fix timezone issue
                setDate(selectedDate);
                props.setNewDate(selectedDate); // Update parent state
                field.onChange(selectedDate.toISOString()); // ✅ Sync with React Hook Form
              }
            }}
            captionLayout="dropdown"
            fromYear={1900}
            toYear={new Date().getFullYear()}
            initialFocus
            classNames={{
              caption: "flex justify-center pt-1 relative items-center gap-2",
              caption_label: "hidden",
              dropdown: "w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary",
              dropdown_month: "ml-1 rtl:ml-0 rtl:mr-1",
              dropdown_year: "mr-1 rtl:mr-0 rtl:ml-1",
              nav: "flex items-center",
              nav_button: "h-7 w-7 bg-transparent text-gray-500 hover:text-black"
            }}
          />
        </PopoverContent>
      )}
    </Popover>
  );
}
