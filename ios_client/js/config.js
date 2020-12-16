const IP = "localhost";
const PORT = "3000";

const CA_GET_CERTIFICATE_URL="http://localhost:4000/certificate"

const SOCKET_EVENT = {
    CREATE_FILE:"create_file",
    DELETE_FILE:"delete_file",
    UPDATE_FILE :"update_file",
    READ_FILE:"read_file",
    CRYPTOGRAPHY_ERROR:"cryptography_error",
    ERROR:"ERROR",
    SUCCESS:"success",
    THIS_MY_PUBLIC_KEY :"this_my_public_Key"

}
const PASSPHRASE = "123456789"


const TYPE_LIST ={
    SYMMETRIC :"symmetric",
    ASYMMETRIC :"asymmetric",
    HYBRID:"hybrid"
}

const TYPE_ACTIVE = TYPE_LIST.SYMMETRIC;



// module.exports ={
//     PASSPHRASE,
//     TYPE_ACTIVE,
//     SOCKET_EVENT,
//     PORT,
//     IP
// }
