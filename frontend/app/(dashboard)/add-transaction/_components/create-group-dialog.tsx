"use client"

import * as React from "react"
import { useActionState } from "react"
import { createFamily } from "@/app/actions/family"
import type { FamilyOrGroup, CreateFamilyState } from "@/app/actions/family"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, ChevronDown } from "lucide-react"

const COMMON_EMOJIS = [
  "👨‍👩‍👧‍👦", "👫", "👥", "🏠", "🏢", "💼",
  "🎓", "🍕", "✈️", "🎮", "💰", "🛒",
  "🎉", "❤️", "⭐", "🌟", "🔥", "💎",
  "🎯", "🏆", "🌈", "🎵", "📚", "🤝",
]

const GROUP_TYPES = ["Family", "Friends", "Work", "Roommates", "Other"]

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGroupCreated: (group: FamilyOrGroup) => void
}

const initialState: CreateFamilyState = {
  success: false,
  message: "",
}

export function CreateGroupDialog({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) {
  const [state, formAction, isPending] = useActionState(createFamily, initialState)

  const [name, setName] = React.useState("")
  const [selectedIcon, setSelectedIcon] = React.useState(COMMON_EMOJIS[0])
  const [selectedType, setSelectedType] = React.useState(GROUP_TYPES[0])

  // Handle successful creation
  React.useEffect(() => {
    if (state.success && state.family) {
      onGroupCreated(state.family)
      // Reset form
      setName("")
      setSelectedIcon(COMMON_EMOJIS[0])
      setSelectedType(GROUP_TYPES[0])
      onOpenChange(false)
    }
  }, [state, onGroupCreated, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Add a family or group to track shared expenses.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          {/* Hidden inputs for non-text fields */}
          <input type="hidden" name="icon" value={selectedIcon} />
          <input type="hidden" name="type" value={selectedType} />

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="group-name" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Group Name
            </Label>
            <Input
              id="group-name"
              name="name"
              placeholder="e.g. My Family"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className={cn(
                "h-12 bg-gray-50 border-gray-100 dark:bg-zinc-800 dark:border-zinc-700",
                state.errors?.name && "border-red-500 focus-visible:ring-red-500"
              )}
              aria-invalid={!!state.errors?.name}
              aria-describedby={state.errors?.name ? "name-error" : undefined}
            />
            {state.errors?.name && (
              <p id="name-error" className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Icon
            </Label>
            <div className="grid grid-cols-6 gap-2">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedIcon(emoji)}
                  className={cn(
                    "w-full aspect-square rounded-lg flex items-center justify-center text-xl transition-all border-2",
                    selectedIcon === emoji
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 scale-110 shadow-sm"
                      : "border-transparent bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {state.errors?.icon && (
              <p className="text-xs text-red-500 mt-1">{state.errors.icon[0]}</p>
            )}
          </div>

          {/* Type Selector */}
          <div className="space-y-2">
            <Label id="group-type-label" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Type
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-labelledby="group-type-label"
                  variant="outline"
                  type="button"
                  className="w-full justify-between h-12 bg-gray-50 border-gray-100 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300"
                >
                  {selectedType}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[240px]">
                {GROUP_TYPES.map((type) => (
                  <DropdownMenuItem key={type} onClick={() => setSelectedType(type)}>
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {state.errors?.type && (
              <p className="text-xs text-red-500 mt-1">{state.errors.type[0]}</p>
            )}
          </div>

          {/* Error Message */}
          {!state.success && state.message && (
            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-950 p-2 rounded">
              {state.message}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
