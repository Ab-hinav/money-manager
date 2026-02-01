import { TransactionForm } from "@/components/forms/transaction-form"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function getCategories() {
  const session = await getServerSession(authOptions)
  console.log("Session:", session)
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/categories", {
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

export default async function AddTransactionPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Add Transaction</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Record a new expense or income</p>
        </div>
        
        <TransactionForm categories={categories} />
      </div>
    </div>
  )
}