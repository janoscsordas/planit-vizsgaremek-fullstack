import {
  Html,
  Button,
  Container,
  Heading,
  Text,
  Link,
  Img,
  Tailwind,
} from "@react-email/components"
import * as React from "react"

type TestEmailProps = {
  name: string | null
  verificationLink: string
}

export default function TestEmail({ name, verificationLink }: TestEmailProps) {
  const date =
    new Date().toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " " +
    new Date().toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <Tailwind>
      <Html>
        <Container className="max-w-[600px] w-full flex justify-center items-center font-sans pt-8 pb-16">
          <Container className="w-full text-center">
            <Img
              src="/full-logo.png"
              width="65"
              height="65"
              alt="Planitapp"
              style={{ margin: "0 auto" }}
            />
            <Heading style={h1}>Sikeres regisztráció!</Heading>
            <Heading style={h2}>Kedves {name}!</Heading>
            <Heading style={h3}>
              Köszönjük, hogy regisztrált a planitapp.hu-n!
            </Heading>

            <Button href={verificationLink} style={button}>
              Tovább a hitelesítéshez
            </Button>

            <Text style={{ ...commonText, marginTop: "30px" }}>
              Ha a gomb nem működik, kattintson ide:{" "}
              <Link style={links} href={verificationLink}>
                {verificationLink}
              </Link>
            </Text>

            <Text style={commonText}>
              Ha bármilyen kérdése van, kérjük lépjen velünk kapcsolatba az
              alábbi email címen:{" "}
              <Link style={links} href="mailto:support@planitapp.hu">
                support@planitapp.hu
              </Link>
            </Text>

            <Text style={commonText}>
              Ha nem Ön regisztrált, kérjük, hagyja figyelmen kívül ezt az
              emailt!
            </Text>

            <Container style={footerContainer}>
              <Text style={simpleParagraph}>
                Üdvözlettel, a Planitapp csapata!
              </Text>
              <Text style={dateParagraph}>{date}</Text>
              <Text style={italicParagraph}>
                Ez egy regisztrációs email, kérjük ne válaszoljon rá!
              </Text>
            </Container>
          </Container>
        </Container>
      </Html>
    </Tailwind>
  )
}

const footerContainer = {
  borderTop: "1px solid #eee",
  marginTop: "40px",
  paddingTop: "20px",
}

const h1 = {
  color: "#45CB85",
  fontSize: "46px",
  fontWeight: "700",
  lineHeight: "1.2",
  margin: "0 0 30px",
}

const h2 = {
  color: "#333",
  fontSize: "28px",
  fontWeight: "600",
  margin: "0 0 20px",
}

const h3 = {
  color: "#555",
  fontSize: "16px",
  fontWeight: "400",
  lineHeight: "1.6",
  margin: "0 0 30px",
}

const button = {
  backgroundColor: "#45CB85",
  border: "none",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(69, 203, 133, 0.2)",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  margin: "15px 0",
  padding: "16px 32px",
  textDecoration: "none",
}

const simpleParagraph = { color: "#888", fontSize: "14px", margin: "0 0 10px" }

const dateParagraph = { color: "#888", fontSize: "12px", margin: "0 0 10px" }

const italicParagraph = { color: "#999", fontSize: "12px", fontStyle: "italic" }

const commonText = {
  color: "#666",
  fontSize: "14px",
  marginTop: "24px",
  lineHeight: "1.6",
}

const links = {
  color: "#45CB85",
  textDecoration: "none",
  fontWeight: "600",
}
