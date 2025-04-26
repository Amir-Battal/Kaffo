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

const chartData = [
  { activity: "الشكاوي", activityNum: 10, fill: "red" },
  { activity: "الأنشطة التطوعية", activityNum: 10, fill: "blue" },
  { activity: "المساهمات", activityNum: 5, fill: "green" },
  { activity: "التبرعات", activityNum: 5, fill: "purple" },
]

const labelData = [
  { activity: "الشكاوي", fill: "bg-red-600" },
  { activity: "الأنشطة التطوعية", fill: "bg-blue-600" },
  { activity: "المساهمات", fill: "bg-green-600" },
  { activity: "التبرعات", fill: "bg-purple-600" },
]

const chartConfig = {
  activityNum: {
    label: "عدد الأنشطة",
  },
  complaints: {
    label: "الشكاوي",
    color: "red",
  },
  activities: {
    label: "الأنشطة التطوعية",
    color: "blue",
  },
  contributions: {
    label: "المساهمات",
    color: "green",
  },
  donations: {
    label: "التبرعات",
    color: "purple",
  },

} satisfies ChartConfig

export function MainChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.activityNum, 0)
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
          {labelData.map((item) => (
            <div className="flex flex-row gap-2 items-center">
              <div className={`w-[15px] h-[15px] ${item.fill}`}></div>
              <h3>{item.activity}</h3>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}
