"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function DateRangePicker({...props}): React.JSX.Element {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  const handleSelect = (value: any) => {
    setDate(value);
    props.setDate(value);
  }

  return (
      <Popover>
          {props.isDateSet
            ?(
            <PopoverTrigger disabled dir="ltr">
              <Button
                disabled
                id="date"
                type="button"
                variant={"outline"}
                className="w-full bg-inherit border-0 border-b-2 border-b-gray-300 rounded-none text-gray-400 flex flex-row justify-between cursor-pointer hover:bg-accent"
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>

            ):(
            <PopoverTrigger dir="ltr">
              <Button
                id="date"
                type="button"
                variant={"outline"}
                className="w-full bg-inherit border-0 border-b-2 border-b-gray-300 rounded-none text-gray-400 flex flex-row justify-between cursor-pointer hover:bg-accent"
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            )
          }
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
  )
}
