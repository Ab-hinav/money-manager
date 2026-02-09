import { Suspense } from "react";
import { getDashboardData } from "@/app/actions/dashboard";
import { TotalBalanceCard } from "../_components/total-balance-card";
import { IncomeCard } from "../_components/income-card";
import { ExpensesCard } from "../_components/expenses-card";
import { RecentTransactionsCard } from "../_components/recent-transactions-card";
import { SavingGoalsCard } from "../_components/saving-goals-card";
import { LoanCard } from "../_components/loan-card";
import { InvestmentCard } from "../_components/investment-card";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-10 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Personal Space</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Balance & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <TotalBalanceCard balance={data.totalBalance} change={data.balanceChange} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <IncomeCard amount={data.income} change={data.incomeChange} />
            <ExpensesCard amount={data.expenses} change={data.expensesChange} data={data.expensesChart} />
          </div>

          <RecentTransactionsCard transactions={data.recentTransactions} />
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          <SavingGoalsCard goals={data.savingGoals} />
          <LoanCard data={data.loanDistribution} />
          <InvestmentCard data={data.investmentDistribution} />
        </div>
      </div>
    </div>
  );
}