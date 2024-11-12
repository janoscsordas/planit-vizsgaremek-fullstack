"use client"

export default function EmailTest() {
  return (
    <main>
      <button
        className="bg-emerald hover:bg-emerald-hover text-white font-bold py-2 px-4 rounded"
        onClick={async () =>
          await fetch("/api/email", {
            method: "POST",
            body: JSON.stringify({
              // TODO: email, name, verificationLink repleace with real data
              email: "example@gmail.com",
              name: "John Doe",
              verificationLink: "https://google.com",
            }),
          })
        }
      >
        Regisztrálj
      </button>
    </main>
  )
}
