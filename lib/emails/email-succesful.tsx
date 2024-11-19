import {
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Tailwind,
  Text,
} from "@react-email/components"
import * as React from "react"


// Memoize styles to prevent recreation on each render
const styles = {
  verificationButton: {
    backgroundColor: "#45CB85",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(69, 203, 133, 0.2)",
    color: "#ffffff",
    fontWeight: "600",
    margin: "15px 0",
    padding: "16px 32px", 
    textDecoration: "none",
  },
  body: {
    color: "#666",
    lineHeight: "1.6",
    marginTop: "24px",
  },
  timestamp: {
    color: "#888",
    margin: "0 0 10px",
  },
  footer: {
    borderTop: "1px solid #eee",
    marginTop: "40px",
    paddingTop: "20px",
  },
  title: {
    color: "#45CB85",
    fontWeight: "700",
    lineHeight: "1.2", 
    margin: "0 0 30px",
  },
  nameHeading: {
    color: "#333",
    fontWeight: "600",
    margin: "0 0 20px",
  },
  subtitle: {
    color: "#555",
    fontWeight: "400",
    lineHeight: "1.6",
    margin: "0 0 30px",
  },
  disclaimer: {
    color: "#999",
    fontStyle: "italic",
  },
  link: {
    color: "#45CB85",
    fontWeight: "600",
    textDecoration: "none",
  },
  footerText: {
    color: "#888",
    margin: "0 0 10px",
  }
}

// Format date function
function formatDate() {
  const now = new Date()
  const date = now.toLocaleDateString("hu-HU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const time = now.toLocaleTimeString("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${date} ${time}`
}

type EmailProps = {
  name: string | null
  verificationLink: string
}

const VerificationEmail = function VerificationEmail({
  name,
  verificationLink,
}: EmailProps) {
  const formattedDate = formatDate()

  return (
    <Tailwind>
      <Html>
        <Head>
          <title>Planitapp - Sikeres regisztráció</title>
        </Head>
        <Container className="flex-center max-w-[600px] py-8 font-sans">
          <Container className="text-center">
            <Heading style={styles.title} className="sm:text-5xl">
              Sikeres regisztráció!
            </Heading>
            <Heading style={styles.nameHeading} className="sm:text-3xl sm:mb-4 mb-3 text-xl">
              Kedves {name}!
            </Heading>
            <Heading style={styles.subtitle} className="sm:text-lg text-base">
              Köszönjük, hogy regisztrált a planitapp.hu-n!
            </Heading>

            <Button href={verificationLink} style={styles.verificationButton} className="sm:text-base text-sm">
              Tovább a hitelesítéshez
            </Button>

            <Text style={{ ...styles.body, marginTop: "30px" }} className="sm:text-base text-sm">
              Ha a gomb nem működik, kattintson ide:{" "}
              <Link style={styles.link} href={verificationLink || "https://planitapp.hu"} className="sm:text-base text-sm">
                {verificationLink}
              </Link>
            </Text>

            <Text style={styles.body} className="sm:text-base text-sm">
              Ha bármilyen kérdése van, kérjük lépjen velünk kapcsolatba az
              alábbi email címen:{" "}
              <Link style={styles.link} href="mailto:support@planitapp.hu" className="sm:text-base text-sm">
                support@planitapp.hu
              </Link>
            </Text>

            <Text style={styles.body} className="sm:text-base text-sm">
              Ha nem Ön regisztrált, kérjük, hagyja figyelmen kívül ezt az
              emailt!
            </Text>

            <Container style={styles.footer}>
              <Text style={styles.footerText} className="sm:text-sm text-xs">
                Üdvözlettel, a Planitapp csapata!
              </Text>
              <Text style={styles.timestamp} className="sm:text-xs text-[10px]">
                {formattedDate}
              </Text>
              <Text style={styles.disclaimer} className="sm:text-xs text-[10px]">
                Ez egy regisztrációs email, kérjük ne válaszoljon rá!
              </Text>
            </Container>
          </Container>
        </Container>
      </Html>
    </Tailwind>
  )
}

export default VerificationEmail