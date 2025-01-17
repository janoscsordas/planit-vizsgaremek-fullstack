"use server"

import crypto from "crypto"
import { z } from "zod"

// Encryption Configuration
const ENCRYPTION_ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16
const TAG_LENGTH = 16

function getEncryptionKey() {
  const key = process.env.MESSAGES_ENCRYPTION_KEY as string
  if (!key || key.length !== 32) {
    throw new Error("Encryption key must be 32 characters long")
  }
  return key
}

/**
 * Encrypts message content compactly
 * @param content Plain text message content to encrypt
 * @returns Base64 encoded string containing encrypted content, IV, and auth tag
 */
export async function encryptMessage(content: string): Promise<string> {
  const ENCRYPTION_KEY = getEncryptionKey()

  // Validated content
  const validatedContent = z.string().min(1).safeParse(content)

  if (!validatedContent.success) {
    throw new Error(validatedContent.error.message)
  }

  // Generate a random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH)

  // Create cipher
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  )

  // Encrypt content
  const encryptedContent = Buffer.concat([
    cipher.update(content, "utf8"),
    cipher.final(),
  ])

  // Get the authentication tag
  const tag = cipher.getAuthTag()

  // Combine IV, encrypted content, and tag into a single buffer
  const combineBuffer = Buffer.concat([iv, encryptedContent, tag])

  // Base64 encode the combined buffer
  return combineBuffer.toString("base64")
}

/**
 * Decrypts message content compactly
 * @param encryptedContent Base64 encoded string containing encrypted content, IV, and auth tag
 * @returns Plain text message content
 */
export async function decryptMessage(
  encryptedContent: string
): Promise<string> {
  const ENCRYPTION_KEY = getEncryptionKey()
  
  // Decode the combined buffer
  const combinedBuffer = Buffer.from(encryptedContent, "base64")

  // Extract components
  const iv = combinedBuffer.slice(0, IV_LENGTH)
  const tag = combinedBuffer.slice(-TAG_LENGTH)
  const encryptedData = combinedBuffer.slice(IV_LENGTH, -TAG_LENGTH)

  // Create decipher
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, "utf8"),
    iv
  )

  // Set the authentication tag
  decipher.setAuthTag(tag)

  // Decrypt content
  const decryptedContent = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ])

  // Return decrypted content
  return decryptedContent.toString("utf8")
}

/**
 * Batch decrypts an array of encrypted contents
 * @param encryptedContents Array of base64 encrypted strings
 * @returns Array of decrypted plain text messages
 */
export async function decryptMultipleMessages(
  encryptedContents: string[]
): Promise<string[]> {
  return Promise.all(encryptedContents.map(decryptMessage))
}
