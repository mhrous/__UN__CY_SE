import {join} from "path"


export const PASSPHRASE = "123456789"


export const PORT =4000


export const TYPE_LIST ={
    SYMMETRIC :"symmetric",
    ASYMMETRIC :"asymmetric",
    HYBRID:"hybrid"
}
export const DB_URL = "mongodb://localhost:27017/ios_ca";

export const TYPE_ACTIVE = TYPE_LIST.SYMMETRIC
