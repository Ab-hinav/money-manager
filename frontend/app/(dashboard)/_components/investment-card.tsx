"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface InvestmentCardProps {
  data: { name: string; value: number; fill: string }[];
}

export function InvestmentCard({ data }: InvestmentCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
          Investments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm text-slate-500 font-medium">Monthly</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  typeof value === "number" ? `₹${value.toLocaleString("en-IN")}` : String(value ?? "N/A"),
                  "Amount"
                ]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
                itemStyle={{ color: '#1e293b' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <div 
                className="w-3 h-3 rounded-full mt-1 shrink-0" 
                style={{ backgroundColor: item.fill }}
              ></div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  ₹{item.value.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
