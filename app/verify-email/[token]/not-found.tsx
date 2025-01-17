export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">
        Nem található vagy nem érvényes link
      </h1>
      <p className="text-gray-500 text-md">
        A link valószínűleg már lejárt vagy nem érvényes. Kérjük, próbálja meg
        újra a regisztrációt!
      </p>
    </div>
  )
}
