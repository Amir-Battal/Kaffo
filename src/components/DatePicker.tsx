"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function DatePicker( {...props} ) : React.JSX.Element {
  const [date, setDate] = React.useState<Date>()
  const birth: Date = props[0].field.value;

  // const handleChange = () => {
  //   console.log(date);
  //   props.setNewDate(date);
  // }

  return (
    <Popover>
      {props[0].field.disabled
      ?(
        <PopoverTrigger disabled>
          <Button type="button" className="w-full bg-inherit border-0 border-b-2 border-b-gray-300 rounded-none text-gray-400 flex flex-row justify-between hover:bg-inherit">
            {date ? format(date, "PPP") : <span className="text-gray-400">{birth.toString()}</span>}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
      ):(
        <PopoverTrigger>
          <Button type="button" className="w-full bg-inherit border-0 border-b-2 border-b-gray-300 rounded-none text-gray-400 flex flex-row justify-between cursor-pointer hover:bg-accent">
            {date ? format(date, "PPP") : <span className="text-gray-600">{birth.toString()}</span>}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent className="w-auto p-0">
        <Calendar dir="rtl"
          mode="single"
          selected={date}
          onSelect={props.setNewDate}
          onDayClick={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
