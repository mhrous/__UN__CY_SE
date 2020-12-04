import crypto from "crypto"

import {TYPE_ACTIVE, TYPE_LIST,PASSPHRASE} from "../config"
import SymmetricCryptography from "./SymmetricCryptography"
import AsymmetricCryptography from "./AsymmetricCryptography"
import HybridCryptography from "./HybridCryptography"

const getHash = (pwd) => crypto.createHash('md5').update(pwd).digest('hex');


const generateKeyPairSync =()=> crypto.generateKeyPairSync("rsa", {
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

const encrypt = ({data, symmetricCryptography, asymmetricCryptography, hybridCryptography}) => {
    switch (TYPE_ACTIVE) {
        case TYPE_LIST.SYMMETRIC:
            return symmetricCryptography.encrypt(data)
        case TYPE_LIST.ASYMMETRIC:
            return asymmetricCryptography.encrypt(data)
        case TYPE_LIST.HYBRID:
            return hybridCryptography.encrypt(data)
        default:
            return data
    }
}

const decrypt = ({data, symmetricCryptography, asymmetricCryptography, hybridCryptography}) => {

    switch (TYPE_ACTIVE) {
        case TYPE_LIST.SYMMETRIC:
            return symmetricCryptography.decrypt(data)
        case TYPE_LIST.ASYMMETRIC:
            return asymmetricCryptography.decrypt(data)
        case TYPE_LIST.HYBRID:
            return hybridCryptography.decrypt(data)
        default:
            return data
    }
}

export  {
    getHash,
    encrypt,
    decrypt,
    HybridCryptography,
    AsymmetricCryptography,
    SymmetricCryptography,
    generateKeyPairSync
}