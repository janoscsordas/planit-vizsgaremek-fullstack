import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { decryptMessage, encryptMessage } from "../actions/encryptDecryptMessages.action";
import crypto from "crypto";

// Constants matching your implementation
const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const TEST_ENCRYPTION_KEY = "12345678901234567890123456789012"; // 32 chars test key

describe("decryptMessage", () => {
    // Save original env
    const originalEnv = process.env.MESSAGES_ENCRYPTION_KEY;

    beforeAll(() => {
        // Set up test environment
        process.env.MESSAGES_ENCRYPTION_KEY = TEST_ENCRYPTION_KEY;
    });

    afterAll(() => {
        // Restore original env
        process.env.MESSAGES_ENCRYPTION_KEY = originalEnv;
    });

    it("should successfully decrypt a valid message", async () => {
        const message = "Hello, World!";
        const encrypted = await encryptMessage(message);
        const decrypted = await decryptMessage(encrypted);

        expect(decrypted).toBe(message);
    })

    it("should throw for non-string input", async () => {
        // @ts-expect-error testing invalid input
        await expect(decryptMessage(123)).rejects.toThrow();
    })

    it("should use correct crypto parameters", async () => {
        const mockRandomBytes = vi.spyOn(crypto, "randomBytes");
        const mockCreateCipheriv = vi.spyOn(crypto, "createCipheriv");
    
        const message = "Test message";
        const encryptedMessage = await encryptMessage(message);
        await decryptMessage(encryptedMessage);
    
        expect(mockRandomBytes).toHaveBeenCalledWith(IV_LENGTH);
        expect(mockCreateCipheriv).toHaveBeenCalledWith(
          ENCRYPTION_ALGORITHM,
          expect.any(Buffer),
          expect.any(Buffer)
        );
    
        mockRandomBytes.mockRestore();
        mockCreateCipheriv.mockRestore();
    });

    it("should throw error if encryption key is not set", async () => {
        // Temporarily remove encryption key
        const key = process.env.MESSAGES_ENCRYPTION_KEY;
    
        const message = "Test message";
        const encryptedMessage = await encryptMessage(message);

        process.env.MESSAGES_ENCRYPTION_KEY = undefined;

        await expect(decryptMessage(encryptedMessage)).rejects.toThrow(
          "Encryption key must be 32 characters long"
        );
    
        // Restore key
        process.env.MESSAGES_ENCRYPTION_KEY = key;
    });
    
    it("should throw error if encryption key is wrong length", async () => {
        // Temporarily set wrong length key
        const key = process.env.MESSAGES_ENCRYPTION_KEY;
    
        const message = "Test message";
        const encryptedMessage = await encryptMessage(message);

        process.env.MESSAGES_ENCRYPTION_KEY = "123"; // too short

        await expect(decryptMessage(encryptedMessage)).rejects.toThrow(
          "Encryption key must be 32 characters long"
        );
    
        // Restore key
        process.env.MESSAGES_ENCRYPTION_KEY = key;
    });
})