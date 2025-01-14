import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bot,
  CircleCheck,
  ClipboardList,
  LogIn,
  MessageCircle,
} from "lucide-react"
import CookieConsent from "@/components/CookieConsent"
import BackToTop from "@/components/back-to-top"
import AutoSlideshow from "@/components/auto-slideshow"

export default function Home() {
  return (
    <main className="pt-16 mx-auto w-fit">
      <div className="w-[95%] lg:w-[65%] mx-auto">
        <div className="relative max-w-screen-xl px-5 mx-auto">
          <div className="-z-10 absolute lg:left-30 xl:left-24 top-80 w-10 h-10 border-[3px] border-emerald rounded-full animate-bounce-first-object"></div>
          <div className="-z-10 hidden lg:block absolute left-[40rem] top-44 w-10 h-10 border-[3px] border-emerald rounded-full animate-bounce-second-object"></div>
          <div className="-z-10 absolute hidden md:block md:left-[43.5rem] lg:left-[45rem] xl:left-[52rem] 2xl:left-[60rem] top-[28rem] w-10 h-10 border-[3px] border-emerald rounded-full animate-bounce-third-object"></div>
        </div>

        <BackToTop />

        <Link className="block pointer-events-none w-max" href={"/"}>
          <Image
            className="hidden select-none sm:block"
            src="/full-logo.png"
            alt="Logo"
            width={300}
            height={68}
          />
          <Image
            className="block select-none sm:hidden"
            src="/icon.png"
            alt="Logo"
            width={68}
            height={68}
          />
        </Link>
        <div className="relative flex justify-end">
          <div className="-z-[2] absolute -top-16 border border-emerald h-12 w-36 "></div>
          <Link className="absolute -top-16" href={"/login"}>
            <Button className="flex items-center w-36 text-lg p-6 px-10 uppercase transition transform translate-x-[4px] translate-y-[4px] hover:translate-x-0 hover:translate-y-0 bg-emerald hover:bg-emerald rounded-none select-none">
              <LogIn /> Belépés
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-center mt-28 sm:text-5xl md:text-6xl lg:text-7xl">
          Kövesd nyomon a terveid
        </h1>
        <h1 className="mt-4 text-4xl font-bold text-center sm:text-5xl md:text-6xl lg:text-7xl text-emerald">
          a Planitapp-pal!
        </h1>
        <p className="text-muted-foreground text-md md:w-[30rem] lg:text-lg mt-16 lg:w-[35rem] mx-auto text-center">
          A Planitapp egy projekt- és feladatkezelő alkalmazás, amely segít a
          csapatoknak a feladatok és munkafolyamatok nyomon követésében és
          rendszerezésében.{" "}
        </p>
        <div className="py-24 md:pt-24 lg:pt-64">
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
            <div className="md:order-2">
              <AutoSlideshow />
            </div>
            <div className="md:order-1">
              <h3 className="mb-4 text-2xl font-semibold text-center md:text-left">
                Könnyed csapatmunka és feladatkövetés.
              </h3>
              <p className="text-center md:text-left text-muted-foreground ">
                A Planitapp lehetővé teszi a csapatok számára, hogy átláthatóan
                kezeljék a projekteket és feladatokat. A felhasználók
                feladatokat hozhatnak létre, módosíthatják és törölhetik azokat.
              </p>
              <div className="relative block mx-auto mt-10 w-max md:mx-0">
                <div className="-z-[2] absolute border border-emerald h-12 w-36"></div>
                <Link href={"/signup"}>
                  <Button className="w-36 text-lg p-6 px-10 uppercase transition transform hover:translate-x-[-4px] hover:translate-y-[-4px] bg-emerald hover:bg-emerald rounded-none select-none">
                    Vágj bele!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <h1 className="mt-24 mb-10 text-5xl font-bold text-center">
          Amit kínálunk
        </h1>
        <div className="grid grid-cols-1 gap-8 mb-8 xl:grid-cols-2 place-items-center place-content-center md:pt-24 2xl:mb-16">
          <Card className="min-w-[20rem] max-w-[23rem] p-6 h-[30rem] rounded-3xl hover:border-cyan-700 border-2 transition-all">
            <CardHeader>
              <div className="p-5 mx-auto mt-2 mb-6 rounded-full bg-cyan-700 w-max">
                <MessageCircle
                  className="block mx-auto text-white w-max"
                  width={48}
                  height={48}
                />
              </div>
              <CardTitle className="mb-4 text-2xl font-bold text-center">
                Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                A chat funkció lehetővé teszi a csapatok számára, hogy
                egyszerűen kommunikáljanak egymással, valamint megosszák
                gondolataikat és ötleteiket.
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-[20rem] max-w-[23rem] p-6 h-[30rem] rounded-3xl hover:border-emerald-700 border-2 transition-all">
            <CardHeader>
              <div className="p-5 mx-auto mt-2 mb-6 rounded-full bg-emerald-700 w-max">
                <ClipboardList
                  className="block mx-auto text-white w-max"
                  width={48}
                  height={48}
                />
              </div>
              <CardTitle className="mb-4 text-2xl font-bold text-center">
                Task Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                A task management funkció lehetővé teszi a csapatok számára,
                hogy egyszerűen kezeljék a feladatokat, valamint nyomon
                követhessék a munkafolyamatot.
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-[20rem] max-w-[23rem] p-6 h-[30rem] rounded-3xl hover:border-red-700 border-2 transition-all">
            <CardHeader>
              <div className="p-5 mx-auto mt-2 mb-6 bg-red-700 rounded-full w-max">
                <CircleCheck
                  className="block mx-auto text-white w-max"
                  width={48}
                  height={48}
                />
              </div>
              <CardTitle className="mb-4 text-2xl font-bold text-center">
                Problémák kezelése
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                A problémák kezelése funkció lehetőséget nyújt a csapattagok
                számára, hogy létrehozzanak problémákat, vagy hozzászóljanak egy
                már meglévőhöz.
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-[20rem] max-w-[23rem] p-6 h-[30rem] rounded-3xl hover:border-yellow-700 border-2 transition-all">
            <CardHeader>
              <div className="p-5 mx-auto mt-2 mb-6 bg-yellow-700 rounded-full w-max">
                <Bot
                  className="block mx-auto text-white w-max"
                  width={48}
                  height={48}
                />
              </div>
              <CardTitle className="mb-4 text-2xl font-bold text-center">
                AI asszisztens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Az AI asszisztens intelligens javaslatokkal segít a projektek és
                feladatok hatékony kezelésében, miközben támogatja a
                csapatmunkát és a kommunikációt.
              </p>
            </CardContent>
          </Card>
        </div>

        <div
          id="pricing"
          className="relative px-6 py-24 isolate sm:py-32 lg:px-8"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-semibold text-base/7 text-emerald">Árazás</h2>
            <p className="mt-2 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              Válaszd ki a csapatod számára a megfelelő tervet!
            </p>
          </div>
          <p className="max-w-2xl mx-auto mt-6 text-lg font-medium text-center text-pretty text-muted-foreground sm:text-xl/8">
            Válasszon az ingyenes és a megfizethető csomagjaink közül!
          </p>
          <div className="grid items-center max-w-lg grid-cols-1 mx-auto mt-16 gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
            <div className="p-8 rounded-3xl rounded-t-3xl bg-primary-foreground ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-bl-3xl lg:rounded-tr-none">
              <h3
                id="tier-hobby"
                className="font-semibold text-base/7 text-emerald"
              >
                Ingyenes
              </h3>
              <p className="flex items-baseline mt-4 gap-x-2">
                <span className="text-5xl font-semibold tracking-tight text-primary">
                  0 HUF
                </span>
                <span className="text-base text-muted-foreground">/hó</span>
              </p>
              <p className="mt-6 text-base/7 text-muted-foreground">
                Tökéletes választás, ha kis csapattal dolgozol!
              </p>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm/6 text-muted-foreground sm:mt-10"
              >
                <li className="flex gap-x-3">
                  <svg
                    className="flex-none w-5 h-6 text-emerald"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  5 projekt
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="flex-none w-5 h-6 text-emerald"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Akár 20 csapattag
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="flex-none w-5 h-6 text-emerald"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Analitikák
                </li>
              </ul>
              <Link
                href="/signup"
                aria-describedby="tier-hobby"
                className="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-emerald ring-1 ring-inset ring-emerald hover:ring-emerald-hover hover:text-emerald-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald sm:mt-10"
              >
                Kezd el most!
              </Link>
            </div>
            <div className="relative p-8 shadow-2xl rounded-3xl bg-emerald-hover dark:bg-emerald-900 ring-1 ring-gray-900/10 sm:p-10">
              <h3
                id="tier-enterprise"
                className="font-semibold text-base/7 text-emerald"
              >
                Pro
              </h3>
              <p className="flex items-baseline mt-4 gap-x-2">
                <span className="text-5xl font-semibold tracking-tight text-white">
                  3.990 HUF
                </span>
                <span className="text-base text-gray-400">/hó</span>
              </p>
              <p className="mt-6 text-gray-300 text-base/7">
                Tökéletes választás a vállalatoknak, akik nagy csapatokkal és
                több projekten dolgoznak!
              </p>
              <ul
                role="list"
                className="mt-8 space-y-3 text-gray-300 text-sm/6 sm:mt-10"
              >
                <li className="flex gap-x-3">
                  <svg
                    className="flex-none w-5 h-6 text-emerald"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Végtelen számú projekt
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="flex-none w-5 h-6 text-emerald"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Akár 100 csapattag
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="flex-none w-5 h-6 text-emerald"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Részletes analitikák
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="flex-none w-5 h-6 text-emerald"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Befejezett projektek archiválása
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="flex-none w-5 h-6 text-emerald"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Különleges funkciók
                </li>
              </ul>
              <button
                aria-describedby="tier-enterprise"
                disabled
                className="w-full mt-8 block rounded-md bg-emerald px-3.5 py-2.5 text-center text-sm font-semibold text-black shadow-sm cursor-not-allowed"
              >
                Hamarosan...
              </button>
            </div>
          </div>
        </div>

        <CookieConsent />

        <footer className="absolute left-0 right-0 py-12 border-t-2 bg-card text-muted-foreground">
          <div className="container flex flex-col items-center justify-center px-4 mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-4 mb-4 md:mb-0">
                <Link
                  href="/"
                  className="flex items-center mb-2 pointer-events-none"
                >
                  <Image
                    src="/full-logo.png"
                    alt="Logo"
                    width={200}
                    height={68}
                  />
                </Link>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    &copy; 2025 Planitapp. Minden jog fenntartva.
                  </p>
                </div>
              </div>
              <div></div>
              <div>
                <h3 className="mb-2 text-lg font-semibold uppercase">
                  szolgáltatások
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#pricing"
                      className="transition-colors hover:text-foreground"
                    >
                      Árazás
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="transition-colors hover:text-foreground"
                    >
                      Funkciók
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="transition-colors hover:text-foreground"
                    >
                      Támogatás
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="transition-colors hover:text-foreground"
                    >
                      Kapcsolat
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold uppercase">
                  szabályzat
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="transition-colors hover:text-foreground"
                    >
                      Adatvédelmi szabályzat
                    </Link>
                  </li>
                  {["ÁSZF", "Süti szabályzat"].map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="transition-colors hover:text-foreground"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
