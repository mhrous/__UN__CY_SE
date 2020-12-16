if (false) {
    window.location.replace("./index.html");
}
new Vue({
    el:"#app",
    data: {
        password: "",
        userName: ""
    },
    methods:{
        async login(){
            const obj = {
                password:this.password,
                userName:this.userName,
                publicKey:PUBLIC_KYE
            }
            try {
                await axios.post(CA_GET_CERTIFICATE_URL, obj)
            }catch (e){
                console.dir(e.response.data,{depth:null})
            }
        }
    }
})
