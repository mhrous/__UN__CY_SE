import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import {connect} from "./db"
import {blue, line} from "./utils"
import {PORT} from './config'
import {Users} from "./model"
import {HybridCryptography,encrypt,decrypt,Certifcate} from "./cryptography"
import {publicKey,privateKey} from "./CA_KEY"

export const start = async () => {
    await connect()
    console.log(blue("connect to DB"))
    console.log(line)

    // 
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())

    const hybridCryptography = new HybridCryptography(publicKey,privateKey)
    const certifcate =  new Certifcate()
    app.post("/certificate", async (req, res) => {
        try{
            const {body} = req

            hybridCryptography.setReceiverPublicKey(body.publicKey)
            const decryptData= decrypt({data:body.encryptData,hybridCryptography})
            const {password,userName} = decryptData

            if(decryptData==null ){
                return res.status(500).json({error: "someone play with data"})  
            }

            const user = await Users.findOne({userName}).exec()
            if (!user) {
                const encryptData = encrypt({hybridCryptography,data:{error: "error in userName or password"}})
                return res.status(400).json(encryptData)
            }
            const correctPassword = await user.checkPassword(password);
            if (!correctPassword) {
                const encryptData = encrypt({hybridCryptography,data:{error: "error in userName or password"}})
                return res.status(400).json(encryptData)
            }

            const {role,name,can}=user


          const data= certifcate.bulid(body.publicKey,{ userName,name,role,can})
          const encryptData = encrypt({hybridCryptography,data})
          return res.status(200).json(encryptData)

        }catch(e){
            console.log(e)
            const encryptData = encrypt({hybridCryptography,data:{error:" "}})
            return res.status(400).json(encryptData)
        }
        }
    )
    //
    app.listen(PORT, () => {
            console.log("server CA run in port : ", blue(PORT))
            console.log(line)
        }
    )

}

