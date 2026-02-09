import Link from "next/link";
import { Car, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Goal {
  id: number;
  name: string;
  current: number;
  target: number;
  icon: string;
  color: string;
}

interface SavingGoalsCardProps {
  goals: Goal[];
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "directions_car": return <Car className="h-4 w-4" />;
    case "flight": return <Plane className="h-4 w-4" />;
    default: return <Car className="h-4 w-4" />;
  }
};

export function SavingGoalsCard({ goals }: SavingGoalsCardProps) {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Savings Goal</CardTitle>
        <Link href="#" className="text-sm font-bold text-primary hover:text-primary/80">
          View
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between items-end mb-1">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${
                  goal.color === 'indigo' 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500' 
                    : 'bg-primary/20 text-slate-700 dark:text-primary'
                }`}>
                  {getIcon(goal.icon)}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{goal.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                ₹{(goal.current / 1000).toFixed(1)}k / ₹{(goal.target / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${goal.color === 'indigo' ? 'bg-indigo-500' : 'bg-primary'}`} 
                style={{ width: `${(goal.current / goal.target) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
