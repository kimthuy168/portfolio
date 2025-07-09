"use client"

import { useEffect, useState } from "react"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { SocialAccount } from "@/lib/db/schema"

export function SocialAccountMultiSelect({
  userId,
  selectedIds,
  onChange,
}: {
  userId: string
  selectedIds: string[] 
  onChange: (ids: string[]) => void
}) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch(`/api/social-account/${userId}`)
      const data = await res.json()
      setAccounts(data)
    }
    fetchAccounts()
  }, [userId])

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedIds.length > 0
            ? `Selected ${selectedIds.length} account(s)`
            : "Select social accounts"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2">
        {/* Replace ScrollArea with a scrollable div */}
        <div className="max-h-48 overflow-y-auto">
          {accounts.map((acc) => {
            const label = acc.accountName
            return (
              <div key={acc.id} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`account-${acc.id}`}
                  checked={selectedIds.includes(acc.id)}
                  onCheckedChange={() => toggleSelection(acc.id)}
                />
                <Label htmlFor={`account-${acc.id}`} className="text-sm">
                  {label}
                </Label>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
