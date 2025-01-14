"use client"

import { signOut } from "next-auth/react"
import { AlertDialogAction } from "../ui/alert-dialog"

export default function DialogLogoutButton() {
  return (
    <AlertDialogAction
      onClick={() => signOut()}
      className="text-white bg-red-500 hover:bg-red-600"
    >
      Kijelentkezés
    </AlertDialogAction>
  )
}
