import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import {connect} from "./db"
import {blue, line} from "./utils"
import {PORT} from './config'
import {Users} from "./model"


export const start = async () => {
    await connect()
    console.log(blue("connect to DB"))
    console.log(line)
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())
    app.post("/certificate", async (req, res) => {
            const {body: {userName, password, publicKey}} = req

            // Users.create({
            //     userName,
            //     password,
            //     name:userName,
            //     role:"user"
            // })

            const user = await Users.findOne({userName}).exec()
            if (!user) {
                return res.status(400).json({error: "error in userName or password"})
            }
            const correctPassword = await user.checkPassword(password);
            if (!correctPassword) {
                return res.status(400).json({error: "error in userName or password"})

            }
            return {}
        }
    )
    //
    app.listen(PORT, () => {
            console.log("server CA run in port : ", blue(PORT))
            console.log(line)
        }
    )

}

