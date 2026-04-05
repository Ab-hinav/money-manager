"use server";

import { authOptions } from "@/lib/auth";
import { handleInvalidTokenResponse, logoutAndRedirectToLogin, rethrowIfRedirect } from "@/lib/auth-failure";
import { getApiUrl } from "@/lib/utils";
import { getServerSession } from "next-auth";


async function getTotalBalance(start: string , end: string, accessToken: string) {

  try{
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-balance?fromDate=${start}&toDate=${end}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    await handleInvalidTokenResponse(res);

    if (!res.ok) {
      console.error(`Error fetching total income: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    return data;
 

  }catch(error){
    rethrowIfRedirect(error);
    console.log(`Error fetching total income: ${error}`);
    return 0;
  }
  
}

async function getTotalIncome(start: string , end: string, accessToken: string) {
  try{
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-income?fromDate=${start}&toDate=${end}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    await handleInvalidTokenResponse(res);

    if (!res.ok) {
      console.error(`Error fetching total income: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    return data;
 

  }catch(error){
    rethrowIfRedirect(error);
    console.log(`Error fetching total income: ${error}`);
    return 0;
  }
}

async function getTotalExpenses(start: string , end: string, accessToken: string) {
  try{
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-expenses?fromDate=${start}&toDate=${end}&monthlyData=false`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    await handleInvalidTokenResponse(res);

    if (!res.ok) {
      console.log('url', url)
      console.error(`Error fetching total expenses: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    return data;
 

  }catch(error){
    rethrowIfRedirect(error);
    console.log(`Error fetching total expenses: ${error}`);
    return 0;
  }
}


async function getTotalInvestments(start: string , end: string, accessToken: string) {
  try{
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-investment?fromDate=${start}&toDate=${end}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    await handleInvalidTokenResponse(res);

    if (!res.ok) {
      console.error(`Error fetching total investments: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    // TotalInvestment is 450000 and Investments is {"amount":450000,"name":"Home Loan"}
    // we need to return {"TotalInvestment":450000,"Investments":{"Home Loan":450000}}


    return data;
 

  }catch(error){
    rethrowIfRedirect(error);
    console.log(`Error fetching total investments: ${error}`);
    return 0;
  }
}

async function getTotalLoans(start: string , end: string, accessToken: string) {
  try{
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-loans?fromDate=${start}&toDate=${end}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    await handleInvalidTokenResponse(res);

    if (!res.ok) {
      console.error(`Error fetching total loans: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    // {"TotalLoans":0,"Loans":{}}
    return data;
 

  }catch(error){
    rethrowIfRedirect(error);
    console.log(`Error fetching total loans: ${error}`);
    return 0;
  }
}



export async function getDashboardData() {
  // ⚡ Bolt Optimization:
  // 1. Hoisted `getServerSession` from 5 distinct helper functions to this parent function.
  //    This prevents Next.js from processing session authentication 5 times concurrently.
  // 2. Removed artificial 1-second delay `await new Promise((resolve) => setTimeout(resolve, 1000));`
  //    to instantly improve dashboard load performance.
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return logoutAndRedirectToLogin();
  }

  //like 01-01-2024
  const getStartOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
  }

  const getEndOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];
  }

  const [totalBalance , totalIncome , totalExpenses , totalInvestments, totalLoans] = await Promise.all([
    getTotalBalance(getStartOfMonth(), getEndOfMonth(), session.accessToken),
    getTotalIncome(getStartOfMonth(), getEndOfMonth(), session.accessToken),
    getTotalExpenses(getStartOfMonth(), getEndOfMonth(), session.accessToken),
    getTotalInvestments(getStartOfMonth(), getEndOfMonth(), session.accessToken),
    getTotalLoans(getStartOfMonth(), getEndOfMonth(), session.accessToken),
  ])

  return {
    totalBalance: totalBalance,
    balanceChange: 2.4,
    income: totalIncome,
    incomeChange: 12,
    expenses: totalExpenses,
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
    loanDistribution: totalLoans?.loans ? Object.keys(totalLoans?.loans).map((loan: string, index: number) => {

      const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0080", "#00FF80", "#8000FF", "#FF8000", "#808080", "#804000", "#008040", "#400080", "#804040", "#408040", "#404080", "#808040", "#804080", "#408080"];
      const color = colors[index % colors.length];

      return {
        name: loan,
        value: totalLoans?.loans[loan],
        fill: color,
      }
    }) : [], // handle null case
    investmentDistribution: totalInvestments?.investments ? Object.keys(totalInvestments?.investments).map((investment: string, index: number) => {

      const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0080", "#00FF80", "#8000FF", "#FF8000", "#808080", "#804000", "#008040", "#400080", "#804040", "#408040", "#404080", "#808040", "#804080", "#408080"];
      const color = colors[index % colors.length];
      return {
        name: investment,
        value: totalInvestments?.investments[investment],
        fill: color,
      };
    }) : []
  };
}
