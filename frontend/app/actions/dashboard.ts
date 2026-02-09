"use server";

export async function getDashboardData() {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    totalBalance: 24562.00,
    balanceChange: 2.4,
    income: 8250.00,
    incomeChange: 12,
    expenses: 3405.00,
    expensesChange: -2.1,
    recentTransactions: [
      {
        id: 1,
        name: "Starbucks Coffee",
        method: "Debit Card ••4242",
        category: "Food & Drink",
        date: "Today, 9:41 AM",
        amount: -5.50,
        icon: "local_cafe",
        color: "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300",
      },
      {
        id: 2,
        name: "Whole Foods Market",
        method: "Debit Card ••4242",
        category: "Groceries",
        date: "Yesterday, 6:20 PM",
        amount: -124.80,
        icon: "shopping_cart",
        color: "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300",
      },
      {
        id: 3,
        name: "Upwork Inc.",
        method: "Direct Deposit",
        category: "Income",
        date: "Oct 24, 10:00 AM",
        amount: 1450.00,
        icon: "work",
        color: "bg-primary/20 text-slate-700 dark:text-primary",
      },
      {
        id: 4,
        name: "Netflix Subscription",
        method: "Credit Card ••8821",
        category: "Entertainment",
        date: "Oct 21, 11:00 AM",
        amount: -15.99,
        icon: "movie",
        color: "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300",
      },
    ],
    savingGoals: [
      {
        id: 1,
        name: "New Car",
        current: 12000,
        target: 20000,
        icon: "directions_car",
        color: "indigo",
      },
      {
        id: 2,
        name: "Holiday",
        current: 1500,
        target: 3000,
        icon: "flight",
        color: "primary",
      },
    ],
    expensesChart: [
      { month: "Jan", amount: 1200 },
      { month: "Feb", amount: 2100 },
      { month: "Mar", amount: 800 },
      { month: "Apr", amount: 1600 },
      { month: "May", amount: 900 },
      { month: "Jun", amount: 1700 },
    ],
    loanDistribution: [
      { name: "Home Loan", value: 450000, fill: "#0088FE" },
      { name: "Car Loan", value: 15000, fill: "#00C49F" },
      { name: "Personal", value: 5000, fill: "#FFBB28" },
      { name: "Education", value: 20000, fill: "#FF8042" },
    ],
    investmentDistribution: [
      { name: "Stocks", value: 25000, fill: "#8884d8" },
      { name: "Crypto", value: 5000, fill: "#82ca9d" },
      { name: "Real Estate", value: 150000, fill: "#ffc658" },
      { name: "Bonds", value: 10000, fill: "#ff8042" },
    ]
  };
}
