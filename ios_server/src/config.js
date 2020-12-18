import {join} from "path"
export const DATA_PATH =join(__dirname,"..","/src/data")

export const SOCKET_EVENT = {
    CREATE_FILE:"create_file",
    DELETE_FILE:"delete_file",
    UPDATE_FILE :"update_file",
    READ_FILE:"read_file",
    CRYPTOGRAPHY_ERROR:"cryptography_error",
    ERROR:"ERROR",
    SUCCESS:"success",
    THIS_MY_PUBLIC_KEY :"this_my_public_Key",
    THIS_MY_CERTIFCATE:"this_my_certifcate"
}

export const PASSPHRASE = "1234567"


export const PORT =3000


export const TYPE_LIST ={
    SYMMETRIC :"symmetric",
    ASYMMETRIC :"asymmetric",
    HYBRID:"hybrid"
}
export const DB_URL = "mongodb://localhost:27017/ios_server";

export const CA_GET_CERTIFICATE_URL="http://localhost:4000/certificate"

export const TYPE_ACTIVE = TYPE_LIST.HYBRID
