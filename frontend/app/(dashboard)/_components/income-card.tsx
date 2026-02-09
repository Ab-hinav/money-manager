import { ArrowUpRight, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface IncomeCardProps {
  amount: number;
  change: number;
}

export function IncomeCard({ amount, change }: IncomeCardProps) {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors">
      <CardContent className="p-6 flex items-start justify-between">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Income</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-emerald-600 text-sm font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4" />
            {change}%
          </p>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-lg text-emerald-600 dark:text-emerald-400">
          <DollarSign className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
