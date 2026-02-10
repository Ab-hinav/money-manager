import { TransactionForm } from "@/app/(dashboard)/add-transaction/_components/transaction-form"

import { getCategories } from "@/app/actions/transaction";
import { getFamilyOrGroups } from "@/app/actions/transaction";
import { getGoals } from "@/app/actions/transaction";



export default async function AddTransactionPage() {

  // Parallelize the fetching of family groups and categories to improve performance
  const [familyOrGroups, categories, goals] = await Promise.all([
    getFamilyOrGroups(),
    getCategories(),
    getGoals(),
  ])

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Add Transaction</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Record a new expense or income</p>
        </div>
        
        <TransactionForm categories={categories} familyOrGroups={familyOrGroups} goals={goals} />
      </div>
    </div>
  )
}