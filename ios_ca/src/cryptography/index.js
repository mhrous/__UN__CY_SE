import crypto from "crypto"

import { TYPE_ACTIVE, TYPE_LIST, PASSPHRASE } from "../config"
import SymmetricCryptography from "./SymmetricCryptography"
import AsymmetricCryptography from "./AsymmetricCryptography"
import HybridCryptography from "./HybridCryptography"
import  Certifcate from "./certifcate"
import { red } from "../utils"

const getHash = (pwd) => crypto.createHash('md5').update(pwd).digest('hex');


const generateKeyPairSync = () => crypto.generateKeyPairSync("rsa", {
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

const encrypt = ({ data, hybridCryptography }) => {
    console.log({ data, hybridCryptography })
    switch (TYPE_ACTIVE) {
        case TYPE_LIST.SYMMETRIC:
            console.log(red("error : "), "work only with hybrid cryptography")
            throw new Error()
        case TYPE_LIST.ASYMMETRIC:
            console.log(red("error : "), "work only with hybrid cryptography")
            throw new Error()
        case TYPE_LIST.HYBRID:
            return hybridCryptography.encrypt(data)
        default:
            return data
    }
}

const decrypt = ({ data, hybridCryptography }) => {

    switch (TYPE_ACTIVE) {
        case TYPE_LIST.SYMMETRIC:
            console.log(red("error : "), "work only with hybrid cryptography")
            throw new Error()
        case TYPE_LIST.ASYMMETRIC:
            console.log(red("error : "), "work only with hybrid cryptography")
            throw new Error()

        case TYPE_LIST.HYBRID:
            return hybridCryptography.decrypt(data)
        default:
            return data
    }
}

export {
    getHash,
    encrypt,
    decrypt,
    HybridCryptography,
    AsymmetricCryptography,
    SymmetricCryptography,
    generateKeyPairSync,
    Certifcate
}