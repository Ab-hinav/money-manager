import Link from "next/link";
import { Coffee, ShoppingCart, Briefcase, Film } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  id: number;
  name: string;
  method: string;
  category: string;
  date: string;
  amount: number;
  icon: string;
  color: string;
}

interface RecentTransactionsCardProps {
  transactions: Transaction[];
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "local_cafe": return <Coffee className="h-5 w-5" />;
    case "shopping_cart": return <ShoppingCart className="h-5 w-5" />;
    case "work": return <Briefcase className="h-5 w-5" />;
    case "movie": return <Film className="h-5 w-5" />;
    default: return <ShoppingCart className="h-5 w-5" />;
  }
};

export function RecentTransactionsCard({ transactions }: RecentTransactionsCardProps) {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden col-span-2">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</CardTitle>
        <Link href="#" className="text-sm font-bold text-primary hover:text-primary/80">
          View All
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center ${tx.color}`}>
                        {getIcon(tx.icon)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{tx.name}</p>
                        <p className="text-xs text-slate-400">{tx.method}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.amount > 0 
                        ? "bg-primary/20 text-slate-800 dark:text-primary" 
                        : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300"
                    }`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{tx.date}</td>
                  <td className={`px-6 py-4 text-right font-bold ${tx.amount > 0 ? "text-emerald-500" : "text-slate-900 dark:text-white"}`}>
                    {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
