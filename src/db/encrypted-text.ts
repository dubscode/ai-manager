import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

import { customType } from 'drizzle-orm/pg-core';

// Ensure this code only runs on the server
if (typeof window === 'undefined') {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is required for encryption'
    );
  }
}

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
// Only initialize the key on the server
const key =
  typeof window === 'undefined'
    ? Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')
    : null;

function encrypt(text: string): string {
  if (typeof window !== 'undefined') {
    throw new Error('Encryption can only be performed on the server side');
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key!, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Combine IV, encrypted text, and auth tag
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

function decrypt(encryptedData: string): string {
  if (typeof window !== 'undefined') {
    throw new Error('Decryption can only be performed on the server side');
  }

  if (!encryptedData) return '';

  const [ivHex, encrypted, authTagHex] = encryptedData.split(':');

  if (!ivHex || !encrypted || !authTagHex) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = createDecipheriv(ALGORITHM, key!, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export const encryptedText = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'text';
  },
  fromDriver(value: unknown): string {
    if (value === null) return '';
    // Decrypt the value from the database
    return decrypt(value as string);
  },
  toDriver(value: string): string {
    if (!value) return '';
    // Encrypt the value before storing in the database
    return encrypt(value);
  },
});
