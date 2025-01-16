import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { encryptMessage } from "../actions/encryptDecryptMessages.action";
import crypto from "crypto";

// Constants matching your implementation
const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const TEST_ENCRYPTION_KEY = "12345678901234567890123456789012"; // 32 chars test key

describe("encryptMessage", () => {
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

  it("should successfully encrypt a valid message", async () => {
    const message = "Hello, World!";
    const encrypted = await encryptMessage(message);

    // Check that the result is a non-empty base64 string
    expect(encrypted).toBeTruthy();
    expect(typeof encrypted).toBe("string");
    expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+$/); // base64 pattern
  });

  it("should generate different ciphertexts for the same message", async () => {
    const message = "Hello, World!";
    const encrypted1 = await encryptMessage(message);
    const encrypted2 = await encryptMessage(message);

    // Due to random IV, encrypting the same message twice should yield different results
    expect(encrypted1).not.toBe(encrypted2);
  });

  it("should throw error for empty message", async () => {
    await expect(encryptMessage("")).rejects.toThrow();
  });

  it("should generate output with correct length", async () => {
    const message = "Test message";
    const encrypted = await encryptMessage(message);
    const decoded = Buffer.from(encrypted, "base64");

    // Expected length: IV (16 bytes) + encrypted content + auth tag (16 bytes)
    expect(decoded.length).toBe(IV_LENGTH + message.length + TAG_LENGTH);
  });

  it("should throw for non-string input", async () => {
    // @ts-expect-error testing invalid input
    await expect(encryptMessage(123)).rejects.toThrow();
  });

  it("should use correct crypto parameters", async () => {
    const mockRandomBytes = vi.spyOn(crypto, "randomBytes");
    const mockCreateCipheriv = vi.spyOn(crypto, "createCipheriv");

    const message = "Test message";
    await encryptMessage(message);

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
    process.env.MESSAGES_ENCRYPTION_KEY = undefined;

    const message = "Test message";
    await expect(encryptMessage(message)).rejects.toThrow(
      "Encryption key must be 32 characters long"
    );

    // Restore key
    process.env.MESSAGES_ENCRYPTION_KEY = key;
  });

  it("should throw error if encryption key is wrong length", async () => {
    // Temporarily set wrong length key
    const key = process.env.MESSAGES_ENCRYPTION_KEY;
    process.env.MESSAGES_ENCRYPTION_KEY = "123"; // too short

    const message = "Test message";
    await expect(encryptMessage(message)).rejects.toThrow(
      "Encryption key must be 32 characters long"
    );

    // Restore key
    process.env.MESSAGES_ENCRYPTION_KEY = key;
  });
});
