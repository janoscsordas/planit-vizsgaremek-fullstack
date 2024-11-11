"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpForm() {
  return (
    <form action="">
        <div>
        <Label htmlFor="username">Felhasználónév</Label>
        <Input
          className="mb-2"
          type="text"
          name="username"
          id="username"
          placeholder="Felhasználónév"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          className="mb-2"
          type="email"
          name="email"
          id="email"
          placeholder="Email cím"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Jelszó</Label>
        <Input
          className="mb-2"
          type="password"
          name="password"
          id="password"
          placeholder="Jelszó"
          required
        />
      </div>
      <Button className="w-full bg-emerald hover:bg-emerald-hover">Regisztráció</Button>
    </form>
  );
}