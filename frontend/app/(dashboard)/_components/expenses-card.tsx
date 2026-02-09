"use client";

import { ArrowDownRight, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";

interface ExpensesCardProps {
  amount: number;
  change: number;
  data: { month: string; amount: number }[];
}

export function ExpensesCard({ amount, change, data }: ExpensesCardProps) {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Expenses</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-rose-500 text-sm font-medium mt-1 flex items-center gap-1">
              <ArrowDownRight className="h-4 w-4" />
              {Math.abs(change)}%
            </p>
          </div>
          <div className="bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-lg text-rose-500">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>
        <div className="h-[60px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {payload[0].payload.month}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              ₹{payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="amount" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
