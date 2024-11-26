import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react"

export const labels = [
  {
    value: "tesztelés",
    label: "Tesztelés",
  },
  {
    value: "fejlesztés",
    label: "Fejlesztés",
  },
  {
    value: "dokumentáció",
    label: "Dokumentáció",
  },
  {
    value: "optimalizálás",
    label: "Optimalizálás",
  },
  {
    value: "design",
    label: "Design",
  },
]

export const statuses = [
  {
    value: "maradék",
    label: "Maradék",
    icon: HelpCircle,
  },
  {
    value: "elvégzendő",
    label: "Elvégzendő",
    icon: Circle,
  },
  {
    value: "folyamatban",
    label: "Folyamatban",
    icon: Timer,
  },
  {
    value: "befejezett",
    label: "Befejezett",
    icon: CheckCircle,
  },
  {
    value: "törölt",
    label: "Törölt",
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: "Alacsony",
    value: "alacsony",
    icon: ArrowDown,
  },
  {
    label: "Közepes",
    value: "közepes",
    icon: ArrowRight,
  },
  {
    label: "Magas",
    value: "magas",
    icon: ArrowUp,
  },
]
