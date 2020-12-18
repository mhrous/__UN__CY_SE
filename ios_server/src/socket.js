import express from "express";
import http from "http";
import socket_io from "socket.io";
import { PORT, SOCKET_EVENT, TYPE_ACTIVE, TYPE_LIST, CA_GET_CERTIFICATE_URL } from "./config"
import { blue, createFile, deleteFile, green, line, readFile, red, updateFile } from "./utils"
import {
    decrypt,
    encrypt,
    getHash,
    HybridCryptography,
    SymmetricCryptography,
    AsymmetricCryptography,
    generateKeyPairSync,
    Certifcate
} from "./cryptography"
import axios from "axios";
import { publicKey } from "../CA_KEY"
import { Operations } from "./model"


const app = express();
const server = http.Server(app);
const io = socket_io(server);

const certifcate = new Certifcate()


class Socket {
    constructor() {
        const { publicKey, privateKey } = generateKeyPairSync();
        this.publicKey = publicKey;
        this.privateKey = privateKey
        this.certifcate = null
        this.init()

    }



    errorHandel = ({ socketEvent = null, data = {}, type = null, error = null, socket = null }) => {

        if (socketEvent && socket) {
            socket.emit(socketEvent, data)
        }
        if (error) {
            console.log(red("error"))
            console.log(error)
            console.log(line)
        }
    }
    eventStartHandel = ({ socketEvent, data = null, socket, hybridCryptography, symmetricCryptography, asymmetricCryptography }) => {
        let decryptData = null
        console.log(blue(socketEvent), green("SOCKEt ID :"), socket.id)
        if (!data) {
            console.log(line)
        } else {
            console.log(green("DATA ENCRYPT"))
            console.log(data)
            try {
                decryptData = decrypt({ data, hybridCryptography, symmetricCryptography, asymmetricCryptography })
            } catch (error) {
                console.log(error)

                this.errorHandel({ socketEvent: SOCKET_EVENT.CRYPTOGRAPHY_ERROR, socket, error })
                return null
            }
            console.log(green("DATA DECRYPT"))
            console.log(decryptData)
            console.log(line)
        }
        return decryptData
    }
    emitResultHandle = ({ socketEvent, data, socket, hybridCryptography, symmetricCryptography, asymmetricCryptography }) => {
        const resultEncrypt = encrypt({ data, hybridCryptography, symmetricCryptography, asymmetricCryptography })
        socket.emit(socketEvent, resultEncrypt)
    }

    async init() {

        const hybridCryptography = new HybridCryptography(this.publicKey, this.privateKey);

        hybridCryptography.setReceiverPublicKey(publicKey)

        const obj = {
            password: "123456",
            userName: "admin",
        }
        const encryptData = encrypt({ data: obj, hybridCryptography })
        const { data } = await axios.post(CA_GET_CERTIFICATE_URL, { encryptData, publicKey: this.publicKey })
        const decryptData = decrypt({ data, hybridCryptography })
        console.log(decryptData)
        this.certifcate = decryptData;
        io.use((socket, next) => {
            next()
        }).on("connection", (socket) => {

            this.eventStartHandel({ socketEvent: "NEW CONNECTION", socket })


            const hybridCryptography = new HybridCryptography(this.publicKey, this.privateKey);
            const symmetricCryptography = new SymmetricCryptography();
            const asymmetricCryptography = new AsymmetricCryptography(this.publicKey, this.privateKey)

            const symmetricCryptographyKey = getHash(socket.id)
            symmetricCryptography.setKye(symmetricCryptographyKey)
            // symmetricCryptography.setKye("errorerrorerrorerrorerrorerrorer")

            let sokectCertifcate = null


            if (TYPE_ACTIVE !== TYPE_LIST.SYMMETRIC) {
                // socket.emit(SOCKET_EVENT.THIS_MY_PUBLIC_KEY,{publicKey:this.publicKey})
                socket.emit(SOCKET_EVENT.THIS_MY_CERTIFCATE, { certifcate: this.certifcate })
            }


            socket.on(SOCKET_EVENT.THIS_MY_CERTIFCATE, ({ certifcate: userCertifcate }) => {
                const { error } = certifcate.verify(userCertifcate)
                if (error) {
                    console.log(red("error certficate"), error, socket.id)
                    return
                }
                sokectCertifcate = userCertifcate
                asymmetricCryptography.setReceiverPublicKey(userCertifcate.publicId)
                hybridCryptography.setReceiverPublicKey(userCertifcate.publicId)
                console.log(hybridCryptography.symmetric.r)
            })

            socket.on(SOCKET_EVENT.THIS_MY_PUBLIC_KEY,(data)=>{
                this.eventStartHandel({socketEvent: "received socket public key", socket})
                console.log(data)
                console.log(line)

                asymmetricCryptography.setReceiverPublicKey(data.publicKey)
                hybridCryptography.setReceiverPublicKey(data.publicKey)
            })


            socket.on(SOCKET_EVENT.READ_FILE, (data) => {
                if (sokectCertifcate === null) {
                    console.log(red("error certficate"), error, socket.id)
                    return;
                }
                if (!sokectCertifcate.subject.can.includes("read")) {
                    this.emitResultHandle({
                        socket,
                        data: { data: "you dont have permission" },
                        socketEvent: SOCKET_EVENT.ERROR,
                        hybridCryptography, symmetricCryptography, asymmetricCryptography
                    })
                }
                const decryptData = this.eventStartHandel({
                    socketEvent: SOCKET_EVENT.READ_FILE,
                    socket,
                    data,
                    hybridCryptography,
                    symmetricCryptography,
                    asymmetricCryptography
                })
                if (!decryptData) return

                const result = readFile({ fileName: decryptData.title })
                if (result === "error") {

                    this.emitResultHandle({
                        socket,
                        data: { data: "this file not fount" },
                        socketEvent: SOCKET_EVENT.ERROR,
                        hybridCryptography, symmetricCryptography, asymmetricCryptography
                    })
                } else {
                    Operations.create({
                        user: sokectCertifcate.subject,
                        data: { fileName: decryptData.title },
                        type: "read",
                        signature: data.signature

                    })
                    this.emitResultHandle({
                        socket,
                        data: result,
                        socketEvent: SOCKET_EVENT.READ_FILE,
                        hybridCryptography,
                        symmetricCryptography,
                        asymmetricCryptography
                    })
                }
            })
            socket.on(SOCKET_EVENT.CREATE_FILE, (data) => {

                if (sokectCertifcate === null) {
                    console.log(red("error certficate"), error, socket.id)
                    return;
                }
                if (!sokectCertifcate.subject.can.includes("add")) {
                    this.emitResultHandle({
                        socket,
                        data: { data: "you dont have permission" },
                        socketEvent: SOCKET_EVENT.ERROR,
                        hybridCryptography, symmetricCryptography, asymmetricCryptography
                    })
                }
                const decryptData = this.eventStartHandel({
                    socketEvent: SOCKET_EVENT.CREATE_FILE,
                    socket,
                    data,
                    hybridCryptography,
                    symmetricCryptography,
                    asymmetricCryptography
                })
                if (!decryptData) return

                const result = createFile({ text: decryptData.content, fileName: decryptData.title })

                if (result === 'error') {
                    this.emitResultHandle({
                        socket,
                        data: { data: "Sorry This File Is Exit" },
                        socketEvent: SOCKET_EVENT.ERROR,
                        hybridCryptography, symmetricCryptography, asymmetricCryptography
                    })
                } else {
                    Operations.create({
                        user: sokectCertifcate.subject,
                        data: { text: decryptData.content, fileName: decryptData.title },
                        type: "add",
                        signature: data.signature

                    })
                    this.emitResultHandle({
                        socket,
                        data: { data: "Done" },
                        socketEvent: SOCKET_EVENT.SUCCESS,
                        hybridCryptography,
                        symmetricCryptography,
                        asymmetricCryptography
                    })

                }
            })
            socket.on(SOCKET_EVENT.DELETE_FILE, (data) => {
                if (sokectCertifcate === null) {
                    console.log(red("error certficate"), error, socket.id)
                    return;
                }
                if (!sokectCertifcate.subject.can.includes("delete")) {
                    this.emitResultHandle({
                        socket,
                        data: { data: "you dont have permission" },
                        socketEvent: SOCKET_EVENT.ERROR,
                        hybridCryptography, symmetricCryptography, asymmetricCryptography
                    })
                }
                const decryptData = this.eventStartHandel({
                    socketEvent: SOCKET_EVENT.DELETE_FILE,
                    socket,
                    data,
                    hybridCryptography,
                    symmetricCryptography,
                    asymmetricCryptography
                })
                if (!decryptData) return
                const result = deleteFile({ fileName: decryptData.title })
                if (result === "success") {
                    Operations.create({
                        user: sokectCertifcate.subject,
                        data: { fileName: decryptData.title },
                        type: "delete",
                        signature: data.signature

                    })
                    this.emitResultHandle({
                        socket,
                        data: { data: "Delete success" },
                        socketEvent: SOCKET_EVENT.SUCCESS,
                        hybridCryptography,
                        symmetricCryptography,
                        asymmetricCryptography
                    })
                }
            })
            socket.on(SOCKET_EVENT.UPDATE_FILE, (data) => {
                if (sokectCertifcate === null) {
                    console.log(red("error certficate"), error, socket.id)
                    return;
                }
                if (!sokectCertifcate.subject.can.includes("update")) {
                    this.emitResultHandle({
                        socket,
                        data: { data: "you dont have permission" },
                        socketEvent: SOCKET_EVENT.ERROR,
                        hybridCryptography, symmetricCryptography, asymmetricCryptography
                    })
                }
                const decryptData = this.eventStartHandel({
                    socketEvent: SOCKET_EVENT.UPDATE_FILE,
                    socket,
                    data,
                    hybridCryptography,
                    symmetricCryptography,
                    asymmetricCryptography
                })
                if (!decryptData) return
                updateFile({
                    lastFileName: decryptData.lastTitle,
                    newFileName: decryptData.title,
                    newText: decryptData.content
                })
                Operations.create({
                    user: sokectCertifcate.subject,
                    data: {
                        lastFileName: decryptData.lastTitle,
                        newFileName: decryptData.title,
                        newText: decryptData.content
                    },
                    type: "update",
                    signature: data.signature

                })
                this.emitResultHandle({
                    socket,
                    data: { data: "Update success" },
                    socketEvent: SOCKET_EVENT.SUCCESS,
                    hybridCryptography,
                    symmetricCryptography,
                    asymmetricCryptography
                })
            })
            socket.on("disconnect", () => {
                this.eventStartHandel({
                    socketEvent: "DISCONNECT",
                    socket,
                    hybridCryptography,
                    symmetricCryptography,
                    asymmetricCryptography
                })
            })
        })
    }

    async start() {
        server.close();
        server.listen(PORT, () => {
            console.log(line)
            console.log(green("success"), `socket run on port:`, blue(PORT));
            console.log(line)

        });



    }
}

export default new Socket()