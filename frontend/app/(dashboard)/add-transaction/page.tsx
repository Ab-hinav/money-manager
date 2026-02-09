import { TransactionForm } from "@/app/(dashboard)/add-transaction/_components/transaction-form"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Session } from "next-auth"

import { getApiUrl } from "@/lib/utils";

async function getCategories(session: Session | null) {
  console.log("Session:", session)
  try {
    const res = await fetch(getApiUrl()+"/api/categories", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`
      },
    })
    if (!res.ok) {
        console.error("Failed to fetch categories status:", res.status)
        return []
    }
    return res.json()
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

async function getFamilyOrGroups(session: Session | null) {
  try {
    const res = await fetch(getApiUrl()+"/api/family", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`
      },
    })
    if (!res.ok) {
        console.error("Failed to fetch family or groups status:", res.status)
        return []
    }
    return res.json()
  } catch (error) {
    console.error("Failed to fetch family or groups:", error)
    return []
  }
}

export default async function AddTransactionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  // Parallelize the fetching of family groups and categories to improve performance
  const [familyOrGroups, categories] = await Promise.all([
    getFamilyOrGroups(session),
    getCategories(session),
  ])

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Add Transaction</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Record a new expense or income</p>
        </div>
        
        <TransactionForm categories={categories} familyOrGroups={familyOrGroups} />
      </div>
    </div>
  )
}
