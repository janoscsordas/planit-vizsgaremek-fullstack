"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Alice", tasks: 78 },
  { name: "Bob", tasks: 65 },
  { name: "Charlie", tasks: 59 },
  { name: "David", tasks: 52 },
  { name: "Eve", tasks: 47 },
]

export function UserActivity() {
  return (
    <ChartContainer
      config={{
        tasks: {
          label: "Tasks Completed",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}