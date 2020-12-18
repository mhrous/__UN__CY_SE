import socket from "./socket";
import {connect} from "./db"


export const start = async () => {
    await connect()
    socket.start();
};
