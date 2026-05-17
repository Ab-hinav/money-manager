import { ArrowUpRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TotalBalanceCardProps {
  balance: number;
  change: number;
}

export function TotalBalanceCard({ balance, change }: TotalBalanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 text-white relative overflow-hidden shadow-xl col-span-2">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-sm font-medium">Total Balance</span>
          <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-300 hover:text-white transition-colors" title="Toggle balance visibility" aria-label="Toggle balance visibility">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">
          ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="flex items-center gap-2 mt-4">
          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            +{change}%
          </span>
          <span className="text-sm text-slate-400">vs last month</span>
        </div>
      </div>
    </div>
  );
}
