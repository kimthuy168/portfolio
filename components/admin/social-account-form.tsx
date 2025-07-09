"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Trash2, Plus } from "lucide-react"
import { NewSocialAccount, SocialAccount } from "@/lib/db/schema"
import { AccountType } from "@/lib/utils"


export function SocialAccountManager({ userId }: { userId: string }) {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [formData, setFormData] = useState<NewSocialAccount>({
    accountName: '',
    accountType: '',
    account: '',
    userId,
  })
  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`/api/social-account/${userId}`)
      const data = await res.json()
      setAccounts(data)
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch social accounts", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({
      accountName: '',
      accountType: '',
      account: "",
      userId,
    })
    setEditingAccount(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingAccount
        ? `/api/social-account/${editingAccount.id}`
        : `/api/social-account`
      const method = editingAccount ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      })

      if (!response.ok) throw new Error("Failed to save social account")
      toast({
        title: "Success",
        description: `Social account ${editingAccount ? "updated" : "created"} successfully`,
      })
      fetchAccounts()
      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  const handleEdit = (account: SocialAccount) => {
    setEditingAccount(account)
    setFormData(account)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social account?")) return
    try {
      const res = await fetch(`/api/social-accounts/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete account")
      toast({ title: "Success", description: "Account deleted successfully" })
      fetchAccounts()
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  if (loading) return <div>Loading social accounts...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Social Account Manager</h2>
          <p className="text-gray-600">Manage your social media links</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Social Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAccount ? "Edit Social Account" : "Add Social Account"}</DialogTitle>
              <DialogDescription>
                {editingAccount
                  ? "Update your social media URLs"
                  : "Enter links to your GitHub, LinkedIn, or Telegram"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
               <Input
                name="accountName"
                value={formData?.accountName || ''}
                onChange={handleChange}
                placeholder="account name"
              />
              <Input
                name="account"
                value={formData?.account || ''}
                onChange={handleChange}
                placeholder="account"
              />
              <select
                name="accountType"
                value={formData.accountType || ""}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Account Type</option>
                {AccountType.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingAccount ? "Update" : "Save"} Account</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {accounts?.map((account) => (
          <div key={account.id} className="border rounded-md p-4 space-y-2">
            <p>
              <strong>Account :</strong> {account.account || "-"}
            </p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(account)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(account.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
