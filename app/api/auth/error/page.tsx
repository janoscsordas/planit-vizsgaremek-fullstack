import { AlertCircle } from "lucide-react"

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald to-emerald rounded-lg blur opacity-75 animate-pulse" />

        <div className="relative bg-[#1f2937]/90 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-md">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-emerald rounded-full animate-ping" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald to-emerald">
              <AlertCircle className="w-10 h-10 text-foreground" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-gray-300">
              Szerver hiba
            </h2>

            <div className="space-y-2">
              <p className="text-foreground text-lg">
                Probléma lépett fel a szerver beállításaival.
              </p>

              <p className="text-gray-400">
                További információért ellenőrizze a szerver naplókat.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm text-gray-400">
                Server Status: Error
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
