"use client"

import * as React from "react"
import { useActionState } from "react"
import { createTransaction } from "@/app/actions/transaction"
import { ChevronDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export type Category = {
  id: string
  name: string
  icon: string
  type: string
}

export type FamilyOrGroup = {
  id: string
  name: string
  type: string
  icon: string
}

interface TransactionFormProps {
  categories: Category[]
  familyOrGroups: FamilyOrGroup[]
}

const initialState = {
  success: false,
  message: "",
  errors: {}
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function TransactionForm({ categories = [], familyOrGroups = [] }: TransactionFormProps) {

  const [state, formAction, isPending] = useActionState(createTransaction, initialState)
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  // Use state.message or internal state for dialog message
  const [errorMessage, setErrorMessage] = React.useState("") 
  
  // Extract unique transaction types from categories
  const availableTypes = React.useMemo(() => {
    const types = new Set(categories.map(c => c.type))
    return Array.from(types)
  }, [categories])

  const [amount, setAmount] = React.useState("")
  const [transactionType, setTransactionType] = React.useState("expense")
  
  // Set initial transaction type if available
  React.useEffect(() => {
    if (availableTypes.length > 0 && !availableTypes.some(t => t.toLowerCase() === transactionType.toLowerCase())) {
       setTransactionType(availableTypes[0].toLowerCase())
    }
  }, [availableTypes, transactionType])

  
  const [selectedGroup, setSelectedGroup] = React.useState(familyOrGroups.length > 0 ? familyOrGroups[0].id : "")
  const [scope, setScope] = React.useState("personal")
  
  // Filter categories based on transaction type
  const currentCategories = React.useMemo(() => {
    return categories.filter(c => c.type.toUpperCase() === transactionType.toUpperCase())
  }, [categories, transactionType])

  const [category, setCategory] = React.useState<Category | undefined>(undefined)
  const [date, setDate] = React.useState("")
  const [description, setDescription] = React.useState("")

  React.useEffect(() => {
    setDate(getTodayDate())
  }, [])

  // Update selected category when type changes or categories load
  React.useEffect(() => {
    if (currentCategories.length > 0) {
      setCategory(currentCategories[0])
    } else {
      setCategory(undefined)
    }
  }, [transactionType, currentCategories])


  React.useEffect(() => {
    if (state.success) {
      setIsDialogOpen(true)
      // resetForm() should be called on dialog close
    } else if (state.message && !state.success) {
      setIsDialogOpen(true)
      setErrorMessage(state.message) // or usage of state.message directly
    }
  }, [state])

  const getSubmitButtonText = () => {
    if (scope === "personal") {
      return "Add Transaction"
    }
    const group = familyOrGroups.find(g => g.id === selectedGroup)
    return group ? `Add to ${group.name}` : "Add to Group"
  }

  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  const resetForm = () => {
    setAmount("")
    setDate(getTodayDate())
    setDescription("")
    // Reset category to first available if exists
    if (currentCategories.length > 0) {
      setCategory(currentCategories[0])
    }
    // We don't reset scope/group/type as user might want to add another similar one
  }

  const handlePostSubmitAction = () => {
    setIsDialogOpen(false)
    if (state.success) {
      resetForm()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      
      {/* Scope Toggles (Personal vs Family) */}
      <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-full w-full max-w-md mx-auto">
        <button
          onClick={() => setScope("personal")}
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-full transition-all",
            scope === "personal"
              ? "bg-white dark:bg-zinc-950 text-emerald-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          )}
        >
          Personal
        </button>
        <button
          onClick={() => setScope("family")}
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-full transition-all",
            scope === "family"
              ? "bg-white dark:bg-zinc-950 text-emerald-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          )}
        >
          Family/Group
        </button>
      </div>

      {/* Group Selection - Only show if scope is family */}
      {scope === "family" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Select Group</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {familyOrGroups.map((group) => (
              <GroupCard
                key={group.id}
                icon={<span className="text-xl">{group.icon}</span>}
                title={group.name}
                subtitle={group.type}
                selected={selectedGroup === group.id}
                onClick={() => setSelectedGroup(group.id)}
                color="bg-emerald-100 text-emerald-600"
              />
            ))}
            <button type="button" className="flex flex-col items-center justify-center h-full min-h-[120px] rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              </div>
              <span className="mt-2 text-xs font-medium text-gray-500 group-hover:text-emerald-600">Add New</span>
            </button>
          </div>
        </div>
      )}

      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
        <CardContent className="p-6 space-y-8">
          
          <form action={formAction}>
            {/* Hidden Inputs for Non-Form Fields */}
            <input type="hidden" name="type" value={transactionType} />
            <input type="hidden" name="categoryId" value={category?.id || ""} />
            <input type="hidden" name="scope" value={scope} />
            <input type="hidden" name="groupId" value={selectedGroup} />
            <input type="hidden" name="amount" value={amount} /> {/* Controlled input mirror */}

            {/* Transaction Type Tabs */}
            <div className="flex border-b border-gray-100 dark:border-zinc-800 mb-6">
              {availableTypes.length > 0 ? (
                availableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTransactionType(type.toLowerCase())}
                  className={cn(
                    "flex-1 pb-4 text-sm font-medium transition-all relative",
                    transactionType === type.toLowerCase()
                      ? "text-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {formatType(type)}
                  {transactionType === type.toLowerCase() && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />
                  )}
                </button>
              ))
              ) : (
              <div className="p-4 text-sm text-gray-500">Loading types...</div>
              )}
            </div>

            {/* Amount Input */}
            <div className="text-center space-y-2 py-4">
              <Label htmlFor="amount-input" className="text-emerald-600 font-medium">Total Amount</Label>
              <div className="relative flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-400 mr-2">₹</span>
                <input
                  id="amount-input"
                  inputMode="decimal"
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-6xl font-bold text-center bg-transparent border-none focus:outline-none w-full placeholder:text-gray-200 text-gray-900 dark:text-white p-0"
                  aria-invalid={!!state.errors?.amount}
                  aria-describedby={state.errors?.amount ? "amount-error" : undefined}
                />
              </div>
              {state.errors?.amount && (
                <p id="amount-error" className="text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{state.errors.amount[0]}</p>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label id="category-label" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-labelledby="category-label" variant="outline" type="button" className="w-full justify-between h-12 bg-gray-50 border-gray-100 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        {category ? (
                          <>
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">{category.icon}</span>
                            {category.name}
                          </>
                        ) : (
                          <span>Select Category</span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[240px] h-[300px] overflow-y-auto">
                      {currentCategories.map((btn) => (
                          <DropdownMenuItem key={btn.id} onClick={() => setCategory(btn)}>
                              <span className="mr-2">{btn.icon}</span>
                              {btn.name}
                          </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {state.errors?.category && (
                    <p className="text-xs text-red-500 mt-1">{state.errors.category[0]}</p>
                 )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</Label>
                <div className="relative">
                  <Input 
                    id="date-input"
                    type="date" 
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={cn(
                      "h-12 bg-gray-50 border-gray-100 dark:bg-zinc-800 dark:border-zinc-700",
                      state.errors?.date && "border-red-500 focus-visible:ring-red-500"
                    )} 
                    aria-invalid={!!state.errors?.date}
                    aria-describedby={state.errors?.date ? "date-error" : undefined}
                  />
                  {state.errors?.date && (
                    <p id="date-error" className="text-xs text-red-500 mt-1">{state.errors.date[0]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</Label>
                <Input 
                  id="description-input"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this for?" 
                  className={cn(
                    "h-12 bg-gray-50 border-gray-100 dark:bg-zinc-800 dark:border-zinc-700 placeholder:text-gray-400"
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={isPending}
              className="w-full h-14 text-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-full mt-4 shadow-lg shadow-emerald-200 dark:shadow-none transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
              {getSubmitButtonText()}
            </Button>
          </form>

        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isPending && "Submitting Transaction"}
              {state.success && "Success!"}
              {!state.success && !isPending && "Submission Failed"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isPending && "Please wait while we record your transaction..."}
              {state.success && "Your transaction has been added successfully."}
              {!state.success && !isPending && (state.message || errorMessage)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-6">
            {isPending && (
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
            )}
            {state.success && (
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            )}
            {!state.success && !isPending && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>

          <DialogFooter className="sm:justify-center">
            {state.success ? (
              <Button onClick={handlePostSubmitAction} className="bg-emerald-500 hover:bg-emerald-600">
                OK
              </Button>
            ) : (
                !isPending && (
              <Button onClick={() => setIsDialogOpen(false)} variant="destructive">
                Retry
              </Button>
                )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function GroupCard({ icon, title, subtitle, selected, onClick, color }: {
  icon: React.ReactNode, 
  title: string, 
  subtitle: string, 
  selected: boolean, 
  onClick: () => void,
  color: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "w-full text-left cursor-pointer rounded-xl p-4 transition-all duration-200 border-2",
        selected 
          ? "border-emerald-500 bg-white dark:bg-zinc-900 shadow-md transform scale-[1.02]" 
          : "border-transparent bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors",
         color
      )}>
        {icon}
      </div>
      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </button>
  )
}
