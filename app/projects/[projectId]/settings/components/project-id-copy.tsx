"use client"

import { Flex } from '@radix-ui/themes'
import { Code, IconButton } from '@radix-ui/themes'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ProjectIdCopy({ projectId }: { projectId: string }) {
    const [copied, setCopied] = useState(false)

    const handleIdCopy = () => {
        navigator.clipboard.writeText(projectId)
        toast.success("ID kimásolva a vágólapra!")
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)

    }

    return (
        <Flex
            align="center"
            gap="2"
        >
            <Code variant="ghost">{projectId}</Code>
            <IconButton
                onClick={handleIdCopy}
                aria-label="Copy value"
                color="jade"
                variant="ghost"
                className="size-4 cursor-pointer p-1 m-1"
            >
                {copied ? (
                    <CheckIcon />
                ) : (
                    <CopyIcon />
                )}
            </IconButton>
        </Flex>
    )
}