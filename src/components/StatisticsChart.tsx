"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", issues: 186, volunteering: 86, contributions: 286, donations: 60},
  { month: "February", issues: 305, volunteering: 205, contributions: 105, donations: 150},
  { month: "March", issues: 237, volunteering: 137, contributions: 57, donations: 200},
  { month: "April", issues: 73,  volunteering: 173, contributions: 273, donations: 200},
  { month: "May", issues: 209,  volunteering: 109, contributions: 309, donations: 120},
  { month: "June", issues: 214,  volunteering: 114, contributions: 314, donations: 150},
  { month: "July", issues: 205,  volunteering: 105, contributions: 305, donations: 120},
  { month: "August", issues: 214,  volunteering: 114, contributions: 314, donations: 170},
  { month: "September", issues: 50,  volunteering: 150, contributions: 250, donations: 170},
  { month: "October", issues: 100,  volunteering: 50, contributions: 200, donations: 120},
  { month: "November", issues: 150,  volunteering: 250, contributions: 50, donations: 100},
  { month: "December", issues: 214,  volunteering: 114, contributions: 50, donations: 75},
]

type StatisticsProp = {
  title?: string;
  ar_title?: string;
  label?: string;
  number?: number;
  color?: string;
  fill?: string;
  isTotal?: boolean;
  data?: Array<any>
}

const chartConfig = {
  issues: {
    label: "الشكاوي",
    color: "hsl(var(--chart-1))",
  },
  volunteering: {
    label: "الأنشطة التطوعية",
    color: "hsl(var(--chart-1))",
  },
  contributions: {
    label: "المساهمات",
    color: "hsl(var(--chart-1))",
  },
  donations: {
    label: "التبرعات",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const StatisticsData = [
  {
    title: 'issues',
    ar_title: 'الشكاوي',
    label: 'الشكاوي المقدمة من قبلك',
    number: 25,
    color: 'red',
    fill: 'bg-red-600',
  },
  {
    title: 'volunteering',
    ar_title: 'الأنشطة التطوعية',
    label: 'الأنشطة التطوعية التي قمت بها',
    number: 25,
    color: 'blue',
    fill: 'bg-blue-600',
  },
  {
    title: 'contributions',
    ar_title: 'المساهمات',
    label: 'المساهمات التي قمت بها',
    number: 25,
    color: 'green',
    fill: 'bg-green-600',
  },
  {
    title: 'donations',
    ar_title: 'التبرعات',
    label: 'التبرعات التي قمت بها',
    number: 25,
    color: 'purple',
    fill: 'bg-purple-600',
  },
]


export function StatisticsChart(prop: StatisticsProp) {
  return (
    <Card dir="ltr" className="w-full">
      <CardHeader className="text-center">
        {prop.isTotal 
          ?(
            <div className="flex flex-row justify-center items-center gap-5">
              {StatisticsData.map((item) => (
                <CardTitle className="flex flex-row gap-2 justify-center items-center">
                  <div className={`w-[10px] h-[10px] ${item.fill}`}></div>
                  <h3>{item.ar_title}</h3>
                </CardTitle>
              ))}
            </div>
          ):(
            <CardTitle className="flex flex-row gap-2 justify-center items-center">
              <div className={`w-[10px] h-[10px] ${prop.fill}`}></div>
              <h3>{prop.label}</h3>
            </CardTitle>
          )
        }
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {prop.isTotal 
            ?(
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                {StatisticsData.map((item) => (
                  <Line
                    dataKey={item.title}
                    type="natural"
                    stroke={item.color}
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-desktop)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                ))}
              </LineChart>
            ):(
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey={prop.title}
                  type="natural"
                  stroke={prop.color}
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-desktop)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
