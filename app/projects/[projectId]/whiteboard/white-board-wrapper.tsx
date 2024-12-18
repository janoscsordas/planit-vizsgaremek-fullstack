"use client"

import dynamic from "next/dynamic"

const WhiteBoard = dynamic(() => import("./white-board"), { ssr: false })

export default function WhiteBoardWrapper({ userId }: { userId: string }) {
    return <WhiteBoard userId={userId} />
}