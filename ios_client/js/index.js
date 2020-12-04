const mode = {
    CREATE: "create",
    UPDATE: "update",
    DELETE: 'delete',
    READ: "read",

}

const app = new Vue({
    el: "#app",
    data: {
        search: "",
        mode: null,
        title: "",
        content: "",
        lastTitle:'',
        lastContent:""
    },

    methods: {
        createText() {
            document.getElementById("content").innerHTML=""
            this.title=""
            this.mode = mode.CREATE

        },
        deleteText() {
            this.mode = mode.DELETE

            const data = {title: this.title}
            const dataEncrypt = encrypt({data})
            socket.emit(SOCKET_EVENT.DELETE_FILE,dataEncrypt)

        },
        update() {
            this.mode = mode.UPDATE
            this.lastTitle = this.title
            this.lastContent = document.getElementById("content").innerHTML

        },
        read() {
            this.mode = mode.READ
        },
        cancel(){
         if(this.mode===mode.CREATE){
             document.getElementById("content").innerHTML=""
             this.title=""
             this.mode=null
            }
         else if (this.mode===mode.UPDATE){
             this.title=this.lastTitle;
             this.content=this.lastContent;
             this.lastContent=""
             this.lastTitle=''
             document.getElementById("content").innerHTML=this.content
             this.mode=mode.READ


         }

        },
        searchMethod(){
            if(this.search.length===0){
                Swal.fire(
                    'error',
                    'please enter search',
                    'error'
                )
                this.mode = null
                return
            }
            this.mode =mode.READ
            const data = {title: this.search}
            const dataEncrypt = encrypt({data})
            socket.emit(SOCKET_EVENT.READ_FILE,dataEncrypt)
            this.search=""

        },

        onTextBtn(func, value = null) {
            document.execCommand(func, false, value)
        },

        saveText(){
            const content = document.getElementById("content").innerHTML
            if(this.title.length===0){
                Swal.fire(
                    'error',
                    'please enter title',
                    'error'
                )
                return
            }

            if(content.length===0){
                Swal.fire(
                    'error',
                    'please enter content',
                    'error'
                )
                return
            }

            if(this.mode===mode.UPDATE){
                const data = {content,title: this.title,lastTitle:this.lastTitle}
                const dataEncrypt = encrypt({data})
                socket.emit(SOCKET_EVENT.UPDATE_FILE,dataEncrypt)
            }
            else if(this.mode===mode.CREATE){
                const data = {content,title: this.title}
                const dataEncrypt = encrypt({data})
                socket.emit(SOCKET_EVENT.CREATE_FILE,dataEncrypt)
            }

        }



    }
})
