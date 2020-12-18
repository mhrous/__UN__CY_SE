const socket = io(`http://${IP}:${PORT}`, {
    query: {}
});
socket.on("connect", function () {
    const symmetricCryptographyKey = getHash(socket.id)

    symmetricCryptography.setKye(symmetricCryptographyKey)
    // symmetricCryptography.setKye("errorerrorerrorerrorerrorerrorer")

    socket.on(SOCKET_EVENT.THIS_MY_PUBLIC_KEY, ({publicKey}) => {
        console.log({publicKey})
        asymmetricCryptography.setReceiverPublicKey(publicKey)
        hybridCryptography.setReceiverPublicKey(publicKey)
    })

    if (TYPE_ACTIVE !== TYPE_LIST.SYMMETRIC) {
        socket.emit(SOCKET_EVENT.THIS_MY_PUBLIC_KEY, {publicKey: PUBLIC_KYE})
    }

    socket.on(SOCKET_EVENT.CRYPTOGRAPHY_ERROR, data => {
        Swal.fire('error', "cryptography error", 'error')
        app.mode = null
    })
    socket.on(SOCKET_EVENT.ERROR, data => {
        try {
            const {data: message} = decrypt({data})
            Swal.fire('error', message, 'error')
            if (app.mode === mode.READ) {
                app.mode = null
            }
        } catch (e) {
            console.log(e)
            Swal.fire('error', "cryptography error", 'error')
            app.mode = null
        }

    })
    socket.on(SOCKET_EVENT.SUCCESS, data => {
        try {
            const {data: message} = decrypt({data})
            Swal.fire('success', message, 'success')
            if (app.mode === mode.CREATE || app.mode === mode.UPDATE) {
                app.mode = mode.READ
            } else if (app.mode === mode.DELETE) {
                app.mode = null
            }
        } catch (e) {
            Swal.fire('error', "cryptography error", 'error')
            app.mode = null
        }
    })
    socket.on(SOCKET_EVENT.READ_FILE, data => {
        try {
            data = decrypt({data})
            app.mode = mode.READ;
            app.title = data.title;
            app.content = data.content
        } catch (e) {

            Swal.fire('error', "cryptography error", 'error')
            app.mode = null
        }
    })
});