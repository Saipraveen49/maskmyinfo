import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create buffers from environment variables
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes
const iv = Buffer.from(process.env.IV, 'hex'); // 16 bytes

/**
 * Encrypt data using AES-256-CBC
 * @param {string} data - The plaintext data to be encrypted
 * @returns {string} - The encrypted data in hexadecimal format
 */
const encryptData = (data) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv); // Create a cipher object
    let encrypted = cipher.update(data, 'utf8', 'hex'); // Encrypt data
    encrypted += cipher.final('hex'); // Finalize encryption
    return encrypted; // Return encrypted data as a hex string
};

// Example usage
const sampleText = "Hello, World!";
const encryptedText = encryptData(sampleText);
console.log("Encrypted Text:", encryptedText);
