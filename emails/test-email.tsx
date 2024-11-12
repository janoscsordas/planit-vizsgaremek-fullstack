import {
  Html,
  Button,
  Container,
  Heading,
  Text,
  Img,
} from "@react-email/components"
import * as React from "react"
import Link from "next/link"

type TestEmailProps = {
  name: string | null
  verificationLink: string
}

const commonTextStyles = {
  color: "#666",
  fontSize: "14px",
  marginTop: "24px",
  lineHeight: "1.6",
}

const linkStyles = {
  color: "#45CB85",
  textDecoration: "none",
  fontWeight: "600",
}

export default function TestEmail({ name, verificationLink }: TestEmailProps) {
  return (
    <Html>
      <Container
        style={{
          userSelect: "none",
          alignItems: "center",
          background: "#ffffff",
          display: "flex",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          justifyContent: "center",
          margin: "0 auto",
          maxWidth: "600px",
          padding: "40px 20px",
        }}
      >
        <Container style={{ textAlign: "center", width: "100%" }}>
          <Img src="https://cdn-icons-png.freepik.com/512/3699/3699928.png" width={65} alt="planitapp logo" style={{ margin: "0 auto" }} />
          <Heading
            style={{
              color: "#45CB85",
              fontSize: "46px",
              fontWeight: "700",
              lineHeight: "1.2",
              margin: "0 0 30px",
            }}
          >
            Sikeres regisztráció!
          </Heading>

          <Heading
            style={{
              color: "#333",
              fontSize: "28px",
              fontWeight: "600",
              margin: "0 0 20px",
            }}
          >
            Kedves {name || "Felhasználó"}!
          </Heading>

          <Text
            style={{
              color: "#555",
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "0 0 30px",
            }}
          >
            Köszönjük, hogy regisztrált a planitapp.hu-n!
          </Text>

          <Button
            href={verificationLink || "https://google.com"}
            style={{
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
            }}
          >
            Tovább a hitelesítéshez
          </Button>

          <Text style={{ ...commonTextStyles, marginTop: "30px" }}>
            Ha a gomb nem működik, kattints ide:{" "}
            <Link
              style={linkStyles}
              href={verificationLink || "https://google.com"}
            >
              {verificationLink || "https://google.com"}
            </Link>
          </Text>

          <Text style={commonTextStyles}>
            Ha bármilyen kérdése van, kérjük lépjen velünk kapcsolatba az alábbi
            email címen:{" "}
            <Link style={linkStyles} href="mailto:support@planitapp.hu">
              support@planitapp.hu
            </Link>
          </Text>

          <Text style={commonTextStyles}>
            Ha nem Ön regisztrált, kérjük, hagyja figyelmen kívül ezt az emailt!
          </Text>

          <Container
            style={{
              borderTop: "1px solid #eee",
              marginTop: "40px",
              paddingTop: "20px",
            }}
          >
            <Text
              style={{ color: "#888", fontSize: "14px", margin: "0 0 10px" }}
            >
              Üdvözlettel, a PlanIt csapata
            </Text>

            <Text
              style={{ color: "#888", fontSize: "13px", margin: "0 0 10px" }}
            >
              {new Date().toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) +
                " " +
                new Date().toLocaleTimeString("hu-HU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Text>

            <Text
              style={{ color: "#999", fontSize: "12px", fontStyle: "italic" }}
            >
              Ez egy regisztrációs email, kérjük ne válaszoljon rá!
            </Text>
          </Container>
        </Container>
      </Container>
    </Html>
  )
}
