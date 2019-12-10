import { generateKeyPairSync } from "crypto";
import { PASSPHRASE } from "../config";

/**
 *   تابع لتوليد زوج مفاتيح خاص وعام
 * <br>
 * res الخورزمية المستخدمة في التوليد
 *

 */
export const generateKeys = () =>
  generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: PASSPHRASE
    }
  });
