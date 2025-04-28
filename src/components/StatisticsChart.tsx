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
import { JSX, useState } from "react"


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

const GovChartData = [
  { month: "January", receivedIssues: 186, doneIssues: 86, auctions: 286 },
  { month: "February", receivedIssues: 305, doneIssues: 205, auctions: 105 },
  { month: "March", receivedIssues: 237, doneIssues: 137, auctions: 57 },
  { month: "April", receivedIssues: 73,  doneIssues: 173, auctions: 273 },
  { month: "May", receivedIssues: 209,  doneIssues: 109, auctions: 309 },
  { month: "June", receivedIssues: 214,  doneIssues: 114, auctions: 314 },
  { month: "July", receivedIssues: 205,  doneIssues: 105, auctions: 305 },
  { month: "August", receivedIssues: 214,  doneIssues: 114, auctions: 314 },
  { month: "September", receivedIssues: 50,  doneIssues: 150, auctions: 250 },
  { month: "October", receivedIssues: 100,  doneIssues: 50, auctions: 200 },
  { month: "November", receivedIssues: 150,  doneIssues: 250, auctions: 50 },
  { month: "December", receivedIssues: 214,  doneIssues: 114, auctions: 50 },
]

const AdminChartData = [
  { month: "January", receivedIssues: 186, users: 86, concernedGovs: 286, doneIssues: 60},
  { month: "February", receivedIssues: 305, users: 205, concernedGovs: 105, doneIssues: 150},
  { month: "March", receivedIssues: 237, users: 137, concernedGovs: 57, doneIssues: 200},
  { month: "April", receivedIssues: 73,  users: 173, concernedGovs: 273, doneIssues: 200},
  { month: "May", receivedIssues: 209,  users: 109, concernedGovs: 309, doneIssues: 120},
  { month: "June", receivedIssues: 214,  users: 114, concernedGovs: 314, doneIssues: 150},
  { month: "July", receivedIssues: 205,  users: 105, concernedGovs: 305, doneIssues: 120},
  { month: "August", receivedIssues: 214,  users: 114, concernedGovs: 314, doneIssues: 170},
  { month: "September", receivedIssues: 50,  users: 150, concernedGovs: 250, doneIssues: 170},
  { month: "October", receivedIssues: 100,  users: 50, concernedGovs: 200, doneIssues: 120},
  { month: "November", receivedIssues: 150,  users: 250, concernedGovs: 50, doneIssues: 100},
  { month: "December", receivedIssues: 214,  users: 114, concernedGovs: 50, doneIssues: 75},
]

// type StatisticsProp = {
//   title?: string;
//   ar_title?: string;
//   label?: string;
//   number?: number;
//   color?: string;
//   fill?: string;
//   isTotal?: boolean;
//   data?: Array<any>;
//   isAdmin?: Boolean;
//   isGov?: Boolean;
// }

// const chartConfig = {
//   issues: {
//     label: "الشكاوي",
//     color: "hsl(var(--chart-1))",
//   },
//   volunteering: {
//     label: "الأنشطة التطوعية",
//     color: "hsl(var(--chart-1))",
//   },
//   contributions: {
//     label: "المساهمات",
//     color: "hsl(var(--chart-1))",
//   },
//   donations: {
//     label: "التبرعات",
//     color: "hsl(var(--chart-1))",
//   },
// } satisfies ChartConfig

// const StatisticsData = [
//   {
//     title: 'issues',
//     ar_title: 'الشكاوي',
//     label: 'الشكاوي المقدمة من قبلك',
//     number: 25,
//     color: 'red',
//     fill: 'bg-red-600',
//   },
//   {
//     title: 'volunteering',
//     ar_title: 'الأنشطة التطوعية',
//     label: 'الأنشطة التطوعية التي قمت بها',
//     number: 25,
//     color: 'blue',
//     fill: 'bg-blue-600',
//   },
//   {
//     title: 'contributions',
//     ar_title: 'المساهمات',
//     label: 'المساهمات التي قمت بها',
//     number: 25,
//     color: 'green',
//     fill: 'bg-green-600',
//   },
//   {
//     title: 'donations',
//     ar_title: 'التبرعات',
//     label: 'التبرعات التي قمت بها',
//     number: 25,
//     color: 'purple',
//     fill: 'bg-purple-600',
//   },
// ]


export function StatisticsChart({...props}): JSX.Element {

  const [chartConfig, setChartConfig] = useState<any>(
      props.isAdmin
      ?
        {
          receivedIssues: { label: "الشكاوي الواصلة", color: "red" },
          users: { label: "المستخدمين", color: "blue" },
          concernedGovs: { label: "الجهات المعنية", color: "green" },
          doneIssues: { label: "الشكاوي المنجزة", color: "purple" },
        }
      :props.isGov
      ?
        {
          receivedIssues: { label: "الشكاوي الواصلة", color: "red" },
          doneIssues: { label: "الشكاوي المنجزة", color: "blue" },
          auctions: { label: "المناقصات", color: "green" },
        }
      :
        {
          complaints: { label: 'الشكاوي', color: "red" },
          activities: { label: "الأنشطة التطوعية", color: "blue" },
          contributions: { label: "المساهمات", color: "green" },
          donations: { label: "التبرعات", color: "purple" },
        }
    );


  return (
    <Card dir="ltr" className="w-full">
      <CardHeader className="text-center">
        {props.isTotal 
          ?(
            <div className="flex flex-row justify-center items-center gap-5">
              {props.data.map((item: any) => (
                <CardTitle className="flex flex-row gap-2 justify-center items-center">
                  <div className={`w-[10px] h-[10px] ${item.fill}`}></div>
                  <h3>{item.ar_title}</h3>
                </CardTitle>
              ))}
            </div>
          ):(
            <CardTitle className="flex flex-row gap-2 justify-center items-center">
              <div className={`w-[10px] h-[10px] ${props.fill}`}></div>
              <h3>{props.label}</h3>
            </CardTitle>
          )
        }
      </CardHeader>
      <CardContent>

        <ChartContainer config={chartConfig}>
          {props.isTotal && props.isAdmin
            ?(
              <LineChart
                accessibilityLayer
                data={AdminChartData}
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
                {props.data.map((item: any) => (
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
            ):props.isTotal && props.isGov
            ?(
              <LineChart
                accessibilityLayer
                data={GovChartData}
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
                {props.data.map((item: any) => (
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
            ):props.isTotal && !props.isGov && !props.isAdmin
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
                {props.data.map((item: any) => (
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

            ):props.isAdmin
            ?(
              <LineChart
                accessibilityLayer
                data={AdminChartData}
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
                  dataKey={props.title}
                  type="natural"
                  stroke={props.color}
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-desktop)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            ):props.isGov
            ?(
              <LineChart
                accessibilityLayer
                data={GovChartData}
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
                  dataKey={props.title}
                  type="natural"
                  stroke={props.color}
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-desktop)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
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
                  dataKey={props.title}
                  type="natural"
                  stroke={props.color}
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
