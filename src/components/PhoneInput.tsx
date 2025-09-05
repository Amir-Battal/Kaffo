import { useEffect, useState } from "react"
import { useFormContext, Controller } from "react-hook-form"
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Country = {
  name: string
  dial_code: string
  code: string
}

export function PhoneInput() {
  const { control } = useFormContext()
  const [countries, setCountries] = useState<Country[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/codes")
        const data = await res.json()

        let filtered: Country[] = data.data.filter(
          (c: Country) => c.name.toLowerCase() !== "israel" && c.code !== "IL"
        )

        // سوريا أولاً
        filtered = filtered.sort((a, b) => {
          if (a.name === "Syria") return -1
          if (b.name === "Syria") return 1
          return a.name.localeCompare(b.name)
        })

        setCountries(filtered)
      } catch (error) {
        console.error("خطأ في جلب الدول:", error)
      }
    }
    fetchCountries()
  }, [])

  // فلترة حسب البحث
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div dir="ltr" className="flex items-end gap-2 w-full">
      {/* Select لاختيار الدولة */}
      <Controller
        name="countryCode"
        control={control}
        render={({ field }) => (
          <FormItem className="w-[25%]">
            <FormLabel dir="rtl">الدولة</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {/* مربع البحث */}
                <div className="p-2">
                  <Input
                    dir="rtl"
                    placeholder="ابحث عن دولة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* قائمة الدول */}
                {filteredCountries.map((country) => (
                  <SelectItem key={`${country.code}-${country.dial_code}`} value={country.dial_code}>
                    <div className="flex items-center gap-2">
                      <span>{country.name} ({country.dial_code})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Input لرقم الهاتف */}
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel dir="rtl">رقم الهاتف</FormLabel>
            <FormControl dir="ltr">
              <Input
                placeholder="999999999"
                {...field}
                onChange={(e) => {
                  // السماح فقط بالأرقام
                  const val = e.target.value.replace(/\D/g, "")
                  field.onChange(val)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
