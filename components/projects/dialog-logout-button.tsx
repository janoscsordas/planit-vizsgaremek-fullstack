"use client"

import { signOut } from "next-auth/react"
import { AlertDialogAction } from "../ui/alert-dialog"

export default function DialogLogoutButton() {
  return (
    <AlertDialogAction
      onClick={() => signOut()}
      className="bg-red-500 hover:bg-red-600 text-white"
    >
      Kijelentkezés
    </AlertDialogAction>
  )
}
