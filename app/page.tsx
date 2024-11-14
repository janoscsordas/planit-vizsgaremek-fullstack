import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, MessagesSquare } from "lucide-react";

export default function Home() {
  return (
    <main className="pt-16">
        <div className="w-[95%] lg:w-[65%] mx-auto">
          <div className="relative max-w-screen-xl px-5 mx-auto">
            <div className="-z-10 absolute lg:left-30 xl:left-24 top-80 w-10 h-10 border-[3px] border-emerald rounded-full animate-bounce-first-object"></div>
            <div className="-z-10 hidden lg:block absolute left-[45rem] top-44 w-10 h-10 border-[3px] border-emerald rounded-full animate-bounce-second-object"></div>
            <div className="-z-10 absolute hidden md:block md:left-[43.5rem] lg:left-[45rem] xl:left-[57rem] 2xl:left-[65rem] top-[28rem] w-10 h-10 border-[3px] border-emerald rounded-full animate-bounce-third-object"></div>
          </div>
          <Link className="block w-max" href={"/"}>
            <Image
              className="hidden sm:block select-none"
              src="/full-logo.png"
              alt="Logo"
              width={300}
              height={68}
            />
            <Image
              className="mt-16 block sm:hidden select-none"
              src="/icon.png"
              alt="Logo"
              width={68}
              height={68}
            />
          </Link>
          <div className="relative flex justify-end">
            <div className="-z-[2] absolute -top-16 border border-emerald h-12 w-36 "></div>
            <Link className="absolute -top-16" href={"/login"}>
              <Button className="flex items-center w-36 text-lg p-6 px-10 uppercase transition transform translate-x-[4px] translate-y-[4px] hover:translate-x-0 hover:translate-y-0 bg-emerald hover:bg-emerald rounded-none"><LogIn /> Belépés</Button>
            </Link>
          </div>
          <h1 className="mt-28 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold">
            Kövesd nyomon a terveid
          </h1>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold text-emerald">
            a Planitapp-pal!
          </h1>
          <p className="text-muted-foreground text-md md:w-[30rem] lg:text-lg mt-16 lg:w-[35rem] mx-auto text-center">
            A Planitapp egy projekt- és feladatkezelő alkalmazás, amely segít a
            csapatoknak a feladatok és munkafolyamatok nyomon követésében és
            rendszerezésében.{" "}
          </p>

          <div className="py-24 md:pt-24 lg:pt-36">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2">
                <Image
                  src="/placeholder.png"
                  width={600}
                  height={400}
                  alt="Hollóvár Folyosó"
                  className="rounded-lg shadow-md block mx-auto md:mx-0"
                />
              </div>
              <div className="md:order-1">
                <h3 className="text-center md:text-left text-2xl font-semibold mb-4">
                  Könnyed csapatmunka és feladatkövetés.
                </h3>
                <p className="text-center md:text-left text-muted-foreground ">
                  A Planitapp lehetővé teszi a csapatok számára, hogy
                  átláthatóan kezeljék a projekteket és feladatokat. A
                  felhasználók feladatokat hozhatnak létre, módosíthatják és
                  törölhetik azokat.
                </p>
                <div className="relative mt-10 w-max block mx-auto md:mx-0">
                  <div className="-z-[2] absolute border border-emerald h-12 w-36"></div>
                  <Link href={"/login"}>
                    <Button className="w-36 text-lg p-6 px-10 uppercase transition transform hover:translate-x-[-4px] hover:translate-y-[-4px] bg-emerald hover:bg-emerald rounded-none select-none">
                      Vágj bele!
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-8 items-center md:pt-24 pb-12">
            <Card className="p-4 w-[22rem] h-[30rem] rounded-3xl">
              <CardHeader>
                <CardTitle>Projektkezelés</CardTitle>
              </CardHeader>
              <MessagesSquare />
            </Card>
            <Card className="p-4 w-[22rem] h-[30rem] rounded-3xl">
              <CardHeader>
                <CardTitle>Projektkezelés</CardTitle>
              </CardHeader>
            </Card>
            <Card className="p-4 w-[22rem] h-[30rem] rounded-3xl">
              <CardHeader>
                <CardTitle>Projektkezelés</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
    </main>
  );
}
