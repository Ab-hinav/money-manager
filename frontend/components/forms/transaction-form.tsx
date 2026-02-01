"use client"

import * as React from "react"
import { ChevronDown, Plus, Home, Briefcase, Plane } from "lucide-react"
import { cn, getApiUrl } from "@/lib/utils"
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
import { useSession } from "next-auth/react"

export type Category = {
  id: string
  name: string
  icon: string
  type: string
}

interface TransactionFormProps {
  categories: Category[]
}

export function TransactionForm({ categories = [] }: TransactionFormProps) {
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submissionStatus, setSubmissionStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [validationErrors, setValidationErrors] = React.useState<{
    amount?: string
    date?: string
    description?: string
  }>({})
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

  const [selectedGroup, setSelectedGroup] = React.useState("home")
  const [scope, setScope] = React.useState("personal")
  
  // Filter categories based on transaction type
  const currentCategories = React.useMemo(() => {
    return categories.filter(c => c.type.toUpperCase() === transactionType.toUpperCase())
  }, [categories, transactionType])

  const [category, setCategory] = React.useState<Category | undefined>(undefined)
  const [date, setDate] = React.useState("")
  const [description, setDescription] = React.useState("")

  // Update selected category when type changes or categories load
  React.useEffect(() => {
    if (currentCategories.length > 0) {
      setCategory(currentCategories[0])
    } else {
      setCategory(undefined)
    }
  }, [transactionType, currentCategories])

  const getSubmitButtonText = () => {
    if (scope === "personal") {
      return "Add Transaction"
    }
    const groupName = selectedGroup === "home" ? "Home" : 
                      selectedGroup === "vacation" ? "Vacation" : 
                      selectedGroup === "business" ? "Business" : "Group"
    return `Add to ${groupName}`
  }

  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  const resetForm = () => {
    setAmount("")
    setDate("")
    setDescription("")
    // Reset category to first available if exists
    if (currentCategories.length > 0) {
      setCategory(currentCategories[0])
    }
    // We don't reset scope/group/type as user might want to add another similar one
    setValidationErrors({})
  }

  const handlePostSubmitAction = () => {
    setIsDialogOpen(false)
    resetForm()
    // Reset status after a delay to allow dialog close animation
    setTimeout(() => {
      setSubmissionStatus("idle")
      setErrorMessage("")
    }, 300)
  }

  const handleSubmit = async () => {
    // Reset errors
    setValidationErrors({})
    let errors: typeof validationErrors = {}
    let hasError = false

    // Validate Amount
    const parsedAmount = parseFloat(amount)
    if (!amount) {
      errors.amount = "Amount is required"
      hasError = true
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.amount = "Amount must be positive"
      hasError = true
    }

    // Validate Date
    if (!date) {
      errors.date = "Date is required"
      hasError = true
    } 
    // Removed past date validation as per user request

    // Validate Description
    if (description.length > 200) {
      errors.description = "Description must be 200 characters or less"
      hasError = true
    }

    if (!category) {
      // Should not happen if button validation works, but just in case
      return
    }

    if (hasError) {
      setValidationErrors(errors)
      return
    }

    setIsSubmitting(true)
    setSubmissionStatus("loading")
    setIsDialogOpen(true)
    setErrorMessage("")

    try {
      const payload = {
        amount: parseFloat(amount),
        type: transactionType,
        categoryId: category.id,
        date: date,
        description: description,
        scope: scope,
        groupId: scope === "family" ? selectedGroup : null // Note: API expects pointer for groupId, but let's see how JSON handles null
      }

      console.log("Submitting Transaction:", payload)
      
      const res = await fetch(`${getApiUrl()}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error(`Failed to add transaction: ${res.statusText}`)
      }

      setSubmissionStatus("success")
    } catch (error) {
      console.error("Submission error:", error)
      setSubmissionStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      
      {/* Scope Toggles (Personal vs Family) */}
      <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-full w-full max-w-md mx-auto">
        <button
          onClick={() => setScope("personal")}
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
            <GroupCard
              icon={<Home className="w-6 h-6" />}
              title="Home"
              subtitle="Shared Expenses"
              selected={selectedGroup === "home"}
              onClick={() => setSelectedGroup("home")}
              color="bg-emerald-100 text-emerald-600"
            />
            <GroupCard
              icon={<Plane className="w-6 h-6" />}
              title="Vacation"
              subtitle="Bali 2024"
              selected={selectedGroup === "vacation"}
              onClick={() => setSelectedGroup("vacation")}
              color="bg-blue-100 text-blue-600"
            />
            <GroupCard
              icon={<Briefcase className="w-6 h-6" />}
              title="Business"
              subtitle="Startup Costs"
              selected={selectedGroup === "business"}
              onClick={() => setSelectedGroup("business")}
              color="bg-amber-100 text-amber-600"
            />
            <button className="flex flex-col items-center justify-center h-full min-h-[120px] rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors group">
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
          
          {/* Transaction Type Tabs */}
          <div className="flex border-b border-gray-100 dark:border-zinc-800">
            {availableTypes.length > 0 ? (
              availableTypes.map((type) => (
              <button
                key={type}
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
             // Fallback if no categories loaded
             <div className="p-4 text-sm text-gray-500">Loading types...</div>
            )}
          </div>

          {/* Amount Input */}
          <div className="text-center space-y-2 py-4">
            <Label className="text-emerald-600 font-medium">Total Amount</Label>
            <div className="relative flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-400 mr-2">₹</span>
              <input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  if (validationErrors.amount) setValidationErrors({...validationErrors, amount: undefined})
                }}
                className="text-6xl font-bold text-center bg-transparent border-none focus:outline-none w-full placeholder:text-gray-200 text-gray-900 dark:text-white p-0"
              />
            </div>
            {validationErrors.amount && (
              <p className="text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{validationErrors.amount}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-12 bg-gray-50 border-gray-100 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300">
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
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</Label>
              <div className="relative">
                <Input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={cn(
                    "h-12 bg-gray-50 border-gray-100 dark:bg-zinc-800 dark:border-zinc-700",
                    validationErrors.date && "border-red-500 focus-visible:ring-red-500"
                  )} 
                />
                {validationErrors.date && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.date}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
               <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</Label>
               <Input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this for?" 
                className={cn(
                  "h-12 bg-gray-50 border-gray-100 dark:bg-zinc-800 dark:border-zinc-700 placeholder:text-gray-400",
                  validationErrors.description && "border-red-500 focus-visible:ring-red-500"
                )}
               />
               {validationErrors.description && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.description}</p>
               )}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting} // Removing !amount || !date || !category check to allow validation feedback on click
            className="w-full h-14 text-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-full mt-4 shadow-lg shadow-emerald-200 dark:shadow-none transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 mr-2" />
            {getSubmitButtonText()}
          </Button>

        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {submissionStatus === "loading" && "Submitting Transaction"}
              {submissionStatus === "success" && "Success!"}
              {submissionStatus === "error" && "Submission Failed"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {submissionStatus === "loading" && "Please wait while we record your transaction..."}
              {submissionStatus === "success" && "Your transaction has been added successfully."}
              {submissionStatus === "error" && errorMessage}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-6">
            {submissionStatus === "loading" && (
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
            )}
            {submissionStatus === "success" && (
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            )}
            {submissionStatus === "error" && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>

          <DialogFooter className="sm:justify-center">
            {submissionStatus === "success" && (
              <Button onClick={handlePostSubmitAction} className="bg-emerald-500 hover:bg-emerald-600">
                OK
              </Button>
            )}
            {submissionStatus === "error" && (
              <Button onClick={handlePostSubmitAction} variant="destructive">
                Retry
              </Button>
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
    <div 
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl p-4 transition-all duration-200 border-2",
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
    </div>
  )
}
