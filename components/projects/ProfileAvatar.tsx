import { auth, signOut } from "@/auth"
import {
  AlertDialog,
  Avatar,
  Button,
  Flex,
  DropdownMenu,
} from "@radix-ui/themes"
import { redirect } from "next/navigation"
import Image from "next/image"
import { logOut } from "@/actions/user.action"

export default async function ProfileAvatar() {
  const session = await auth()

  if (!session?.user) {
    return redirect("/login")
  }

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="Profilkép"
              width={38}
              height={32}
              className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
            />
          ) : (
            <Avatar
              radius="full"
              fallback={session.user.name?.[0] || "?"}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          )}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content variant="soft" color="green">
          <DropdownMenu.Item>Profil</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button variant="soft" color="red">
                Kijelentkezés
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Kijelentkezés</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Biztosan ki szeretnél jelentkezni?
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray" type="button">
                    Mégsem
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="solid" color="red" type="submit">
                    Kijelentkezés
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
