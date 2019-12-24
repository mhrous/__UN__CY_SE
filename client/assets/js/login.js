new Vue({
  el: "#app",
  data: {
    userName: "jod_123",
    password: "11111111"
  },
  methods: {
    signIn() {
      const { userName, password } = this.$data;

      if (!userName || !password) {
        swal("error", "Some information is missing", "error");
        return;
      }
      if (password.length < 8) {
        swal("error", "password so week", "error");
        return;
      }

      console.log({ userName, password });
      const publicKey = localStorage.getItem("_PUBLIC_KEY_");
      const data = { userName, password, publicKey };
      HybridCryptography.setReceiverPublicKey(publicKeyCA);
      const dataEn = HybridCryptography.encrypt(data);
      $.ajax({
        type: "POST",
        url: `http://localhost:8888/its/singin`,
        success(data) {
          console.log(data);
        },
        error(e) {
          swal("erroe", e, "erroe");
        },

        data: dataEn
      });

      // this.userName = "";
      // this.password = "";
    }
  }
});
