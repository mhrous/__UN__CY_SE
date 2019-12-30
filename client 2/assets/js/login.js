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

      const publicKey = localStorage.getItem("_PUBLIC_KEY_");
      const data = { userName, password };
      HybridCryptography.setReceiverPublicKey(publicKeyCA);
      const dataEn = HybridCryptography.encrypt(data);
      const _data = { dataEn, publicKey };
      $.ajax({
        type: "POST",
        url: `http://localhost:8888/its/singin`,
        success(data) {
          localStorage.setItem("__certifcate__", JSON.stringify(data));
          window.location.href = "index.html";
        },
        error(e) {
          swal("error", e.responseText, "error");
        },

        data: _data
      });
    }
  }
});
