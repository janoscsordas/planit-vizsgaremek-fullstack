import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center ">
        <div className="w-[90%] lg:w-[65%]">
          <div className="relative">
            <div className="-z-10 absolute lg:left-30 xl:left-24 top-80 w-10 h-10 border-[6px] border-emerald rounded-full animate-bounce-slow"></div>
            <div className="-z-10 hidden lg:block absolute left-[45rem] top-44 w-10 h-10 border-[6px] border-emerald rounded-full animate-bounce-slow"></div>
            <div className="-z-10 absolute hidden md:block md:left-[43.5rem] lg:left-[45rem] xl:left-[57rem] 2xl:left-[65rem] top-[28rem] w-10 h-10 border-[6px] border-emerald rounded-full animate-bounce-slow"></div>
          </div>
          <Link className="block w-max" href={"/"}>
            <Image className="mt-16 hidden sm:block" src="/full-logo.png" alt="Logo" width={300} height={300} />
            <Image className="mt-16 block sm:hidden" src="/icon.png" alt="Logo" width={68} height={68} />
          </Link>
          <div className="relative flex justify-end">
            <div className="-z-[2] absolute -top-16 border border-emerald h-12 w-36 "></div>
            <Link className="absolute -top-16" href={"/login"}>
              <Button className="flex items-center w-36 text-lg p-6 px-10 uppercase transition transform translate-x-[4px] translate-y-[4px] hover:translate-x-0 hover:translate-y-0 bg-emerald hover:bg-emerald rounded-none"><LogIn /> Belépés</Button>
            </Link>
          </div>
          <h1 className="mt-28 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold">Kövesd nyomon a terveid</h1>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold text-emerald">a Planitapp-pal!</h1>
          <p className="text-muted-foreground text-md md:w-[30rem] lg:text-lg mt-16 lg:w-[35rem] mx-auto text-center">A Planitapp egy projekt- és feladatkezelő alkalmazás, amely segít a csapatoknak a feladatok és munkafolyamatok nyomon követésében és rendszerezésében. </p>
          <div className="relative mt-10 flex items-center justify-center">
            <div className="-z-[2] absolute border border-emerald h-12 w-36 "></div>
            <Link href={"/login"}>
              <Button className="w-36 text-lg p-6 px-10 uppercase transition transform hover:translate-x-[-4px] hover:translate-y-[-4px] bg-emerald hover:bg-emerald rounded-none">Vágj bele!</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
