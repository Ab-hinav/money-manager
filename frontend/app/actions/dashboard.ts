"use server";

import { authOptions } from "@/lib/auth";
import { getApiUrl } from "@/lib/utils";
import { getServerSession } from "next-auth";


async function getTotalBalance(start: string , end: string) {

  try{
   const session = await getServerSession(authOptions);
   
     if (!session || !session.accessToken) {
       return { success: false, message: "Unauthorized: Please log in." };
     }
    
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-balance?fromDate=${start}&toDate=${end}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      console.error(`Error fetching total income: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    return data;
 

  }catch(error){
    console.log(`Error fetching total income: ${error}`);
    return 0;
  }
  
}

async function getTotalIncome(start: string , end: string) {
  try{
   const session = await getServerSession(authOptions);
   
     if (!session || !session.accessToken) {
       return { success: false, message: "Unauthorized: Please log in." };
     }
    
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-income?fromDate=${start}&toDate=${end}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      console.error(`Error fetching total income: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    return data;
 

  }catch(error){
    console.log(`Error fetching total income: ${error}`);
    return 0;
  }
}

async function getTotalExpenses(start: string , end: string) {
  try{
   const session = await getServerSession(authOptions);
   
     if (!session || !session.accessToken) {
       return { success: false, message: "Unauthorized: Please log in." };
     }
    
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-expenses?fromDate=${start}&toDate=${end}&monthlyData=false`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      console.log('url', url)
      console.error(`Error fetching total expenses: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    return data;
 

  }catch(error){
    console.log(`Error fetching total expenses: ${error}`);
    return 0;
  }
}


async function getTotalInvestments(start: string , end: string) {
  try{
   const session = await getServerSession(authOptions);
   
     if (!session || !session.accessToken) {
       return { success: false, message: "Unauthorized: Please log in." };
     }
    
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-investment?fromDate=${start}&toDate=${end}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      console.error(`Error fetching total investments: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    // TotalInvestment is 450000 and Investments is {"amount":450000,"name":"Home Loan"}
    // we need to return {"TotalInvestment":450000,"Investments":{"Home Loan":450000}}


    return data;
 

  }catch(error){
    console.log(`Error fetching total investments: ${error}`);
    return 0;
  }
}

async function getTotalLoans(start: string , end: string) {
  try{
   const session = await getServerSession(authOptions);
   
     if (!session || !session.accessToken) {
       return { success: false, message: "Unauthorized: Please log in." };
     }
    
    const backendUrl = getApiUrl(); // On server, this uses internal URL
    const url = `${backendUrl}/api/dashboard/total-loans?fromDate=${start}&toDate=${end}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      console.error(`Error fetching total loans: ${res.statusText}`);
      return 0;
    }

    const data = await res.json();
    // {"TotalLoans":0,"Loans":{}}
    return data;
 

  }catch(error){
    console.log(`Error fetching total loans: ${error}`);
    return 0;
  }
}



export async function getDashboardData() {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

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
    getTotalBalance(getStartOfMonth(), getEndOfMonth()),
    getTotalIncome(getStartOfMonth(), getEndOfMonth()),
    getTotalExpenses(getStartOfMonth(), getEndOfMonth()),
    getTotalInvestments(getStartOfMonth(), getEndOfMonth()),
    getTotalLoans(getStartOfMonth(), getEndOfMonth()),
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
    loanDistribution: totalLoans?.Loans ? Object.keys(totalLoans?.Loans).map((loan:any) => {

      const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0080", "#00FF80", "#8000FF", "#FF8000", "#808080", "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF8080", "#80FF80", "#8080FF", "#FFFF80", "#FF80FF", "#80FFFF", "#804000", "#008040", "#400080", "#804040", "#408040", "#404080", "#808040", "#804080", "#408080", "#404040", "#808080", "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF8080", "#80FF80", "#8080FF", "#FFFF80", "#FF80FF", "#80FFFF", "#804000", "#008040", "#400080", "#804040", "#408040", "#404080", "#808040", "#804080", "#408080"];
      const color = colors[Math.floor(Math.random() * Object.keys(totalLoans?.Loans).length)];

      return {
        name: loan,
        value: totalLoans?.Loans[loan],
        fill: color,
      }
    }) : [], // handle null case
    investmentDistribution: totalInvestments?.Investments ? Object.keys(totalInvestments?.Investments).map((investment:any) => {

      // assign random color to each investment
      const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0080", "#00FF80", "#8000FF", "#FF8000", "#808080", "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF8080", "#80FF80", "#8080FF", "#FFFF80", "#FF80FF", "#80FFFF", "#804000", "#008040", "#400080", "#804040", "#408040", "#404080", "#808040", "#804080", "#408080", "#404040", "#808080", "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF8080", "#80FF80", "#8080FF", "#FFFF80", "#FF80FF", "#80FFFF", "#804000", "#008040", "#400080", "#804040", "#408040", "#404080", "#808040", "#804080", "#408080"];
      const color = colors[Math.floor(Math.random() * Object.keys(totalInvestments?.Investments).length)];
      return {
        name: investment,
        value: totalInvestments?.Investments[investment],
        fill: color,
      };
    }) : []
  };
}
