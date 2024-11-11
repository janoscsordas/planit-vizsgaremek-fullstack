import {
  Html,
  Button,
  Container,
  Heading,
  Text,
} from "@react-email/components";
import * as React from "react";
import Link from "next/link";

type TestEmailProps = {
  name: string | null;
};

export default function TestEmail({ name }: TestEmailProps) {
  return (
    <Html style={{ userSelect: "none" }}>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "40px 20px",
          background: "#ffffff",
        }}
      >
        <Container style={{ width: "100%", textAlign: "center" }}>
          <Heading
            style={{
              color: "#45CB85",
              fontSize: "46px",
              fontWeight: "700",
              margin: "0 0 30px",
              lineHeight: "1.2",
            }}
          >
            Sikeres regisztráció!
          </Heading>
          <Heading
            style={{
              fontSize: "28px",
              fontWeight: "600",
              margin: "0 0 20px",
              color: "#333",
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
            href="https://google.com"
            style={{
              backgroundColor: "#45CB85",
              color: "#ffffff",
              padding: "16px 32px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "16px",
              textDecoration: "none",
              border: "none",
              boxShadow: "0 4px 6px rgba(69, 203, 133, 0.2)",
              margin: "15px 0",
              transition: "all 0.2s ease",
            }}
          >
            Tovább a hitelesítéshez
          </Button>
          <Text style={{ color: "#666", fontSize: "14px", marginTop: "30px" }}>
            Ha a gomb nem működik, kattints ide:{" "}
            <Link
              style={{
                color: "#45CB85",
                textDecoration: "none",
                fontWeight: "600",
              }}
              href="https://google.com"
            >
              https://google.com
            </Link>
          </Text>
          <Text
            style={{
              color: "#666",
              fontSize: "14px",
              marginTop: "24px",
              lineHeight: "1.6",
            }}
          >
            Ha bármilyen kérdése van, kérjük lépjen velünk kapcsolatba az alábbi
            email címen:{" "}
            <Link
              style={{
                color: "#45CB85",
                textDecoration: "none",
                fontWeight: "600",
              }}
              href="mailto:support@planitapp.hu"
            >
              support@planitapp.hu
            </Link>
          </Text>
          <Text style={{ color: "#666", fontSize: "14px", marginTop: "24px" }}>
            Ha nem Ön regisztrált, kérjük, hagyja figyelmen kívül ezt az emailt!
          </Text>
          <Container
            style={{
              marginTop: "40px",
              borderTop: "1px solid #eee",
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
  );
}
