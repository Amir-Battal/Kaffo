"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const StatisticsData = [
  {
    title: 'issues',
    ar_title: 'الشكاوي',
    label: 'الشكاوي المقدمة من قبلك',
    number: 25,
    color: 'red',
    fill: 'bg-red-600',
    path: '/problems',
    activityNum: 10
  },
  // {
  //   title: 'volunteering',
  //   ar_title: 'الأنشطة التطوعية',
  //   label: 'الأنشطة التطوعية التي قمت بها',
  //   number: 25,
  //   color: 'blue',
  //   fill: 'bg-blue-600',
  //   path: '/volunteering',
  //   activityNum: 10
  // },
  {
    title: 'contributions',
    ar_title: 'المساهمات',
    label: 'المساهمات التي قمت بها',
    number: 25,
    color: 'green',
    fill: 'bg-green-600',
    path: '/volunteering/contributions',
    activityNum: 5
  },
  {
    title: 'donations',
    ar_title: 'التبرعات',
    label: 'التبرعات التي قمت بها',
    number: 25,
    color: 'purple',
    fill: 'bg-purple-600',
    path: '/volunteering/donations',
    activityNum: 5
  },
]


export function MainChart({...props}): React.JSX.Element {
  const [chartData, setChartData] = React.useState<any>(
    props.isAdmin || props.isGov
    ?
      props.data.map((data: any) => ({ 
        activity: data.ar_title, 
        activityNum: data.activityNum, 
        fill: data.color 
      }))
    :
    StatisticsData.map((data: any) => ({ 
      activity: data.ar_title, 
      activityNum: data.activityNum, 
      fill: data.color 
    }))
  );

  const [chartConfig, setChartConfig] = React.useState<any>(
    props.isAdmin
    ?
      {
        activityNum: { lable: "عدد الأنشطة" },
        receivedIssues: { label: "الشكاوي الواصلة", color: "red" },
        users: { label: "المستخدمين", color: "blue" },
        concernedGovs: { label: "الجهات المعنية", color: "green" },
        doneIssues: { label: "الشكاوي المنجزة", color: "purple" },
      }
    :props.isGov
    ?
      {
        activityNum: { lable: "عدد الأنشطة" },
        receivedIssues: { label: "الشكاوي الواصلة", color: "red" },
        doneIssues: { label: "الشكاوي المنجزة", color: "blue" },
        auctions: { label: "المناقصات", color: "green" },
      }
    :
      {
        activityNum: { lable: "عدد الأنشطة" },
        complaints: { label: 'الشكاوي', color: "red" },
        // activities: { label: "الأنشطة التطوعية", color: "blue" },
        contributions: { label: "المساهمات", color: "green" },
        donations: { label: "التبرعات", color: "purple" },
      }
  );


  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc: any, curr: any) => acc + curr.activityNum, 0)
  }, [])


  



  return (
    <Card className="flex flex-col w-[40%]">
      <CardContent className="flex flex-row-reverse w-full h-[250px] items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="flex-1 mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="activityNum"
              nameKey="activity"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          العدد الإجمالي
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-col gap-5">
          {props.isAdmin || props.isGov
            ?(
              <div>
                {props.data.map((item: any) => (
                  <div className="flex flex-row gap-2 items-center">
                    <div className={`w-[15px] h-[15px] ${item.fill}`}></div>
                    <h3>{item.ar_title}</h3>
                  </div>
                ))}
              </div>
            ):(
              <div>
                {StatisticsData.map((item: any) => (
                  <div className="flex flex-row gap-2 items-center">
                    <div className={`w-[15px] h-[15px] ${item.fill}`}></div>
                    <h3>{item.ar_title}</h3>
                  </div>
                ))}
              </div>
            )
          }
        </div>

      </CardContent>
    </Card>
  )
}
