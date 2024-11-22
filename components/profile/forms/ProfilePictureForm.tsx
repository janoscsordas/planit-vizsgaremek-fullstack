import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePictureForm() {
    return (
        <form action="" className="border border-muted rounded-md p-4 mt-6">
            <h4 className="font-medium text-sm">Profilkép</h4>
            <Input name="profilePicture" id="profilePicture" type="file" className="mt-2" />
            <Button className="mb-10 md:mb-0 mt-10 bg-emerald hover:bg-emerald-hover" type="submit">Mentés</Button>
        </form>
    )
}