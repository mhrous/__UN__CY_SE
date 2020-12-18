const token = localStorage.getItem("token")
if (token) {
    window.location.replace("./index.html");
}

hybridCryptography.setReceiverPublicKey(CA_BUBLIC_KEY)

new Vue({
    el:"#app",
    data: {
        password: "",
        userName: ""
    },
    methods:{
        async login(){
            try {
                const { publicKey, privateKey } =getKeys()
                const obj = {
                    password:this.password,
                    userName:this.userName,
                }

                asymmetricCryptography.setPublicKey(publicKey)
                asymmetricCryptography.setPrivateKey(privateKey)
                hybridCryptography.setPublicKey(publicKey)
                hybridCryptography.setPrivateKey(privateKey)
                const encryptData = encrypt({data:obj})
                const {data}=  await axios.post(CA_GET_CERTIFICATE_URL, {encryptData,publicKey})
                const decryptData = decrypt({data})
                localStorage.setItem("token",JSON.stringify(decryptData))
                localStorage.setItem("publicKey",publicKey)
                localStorage.setItem("privateKey",privateKey)
                window.location.replace("./index.html");
            }catch (e){
                if(e.response.status===500){
                    Swal.fire('error', "error", 'error')
                    return
                }
                const decryptData = decrypt({data:e.response.data})
                console.log(decryptData)

                Swal.fire('error', decryptData.error, 'error')
            }
        }
    }
})
