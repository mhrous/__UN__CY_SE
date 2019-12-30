const socket = () => {};

new Vue({
  el: "#app",
  data: {
    pageActive: "logIn",
    logIn: {
      userName: "jod_123",
      password: "11111111"
    }
  },
  methods: {
    signIn() {
      const { userName, password } = this.logIn;

      if (!userName || !password) {
        swal("error", "Some information is missing", "error");
        return;
      }
      if (password.length < 8) {
        swal("error", "password so week", "error");
        return;
      }

      const data = { userName, password };
      HybridCryptography.setReceiverPublicKey(publicKeyCA);
      const dataEn = HybridCryptography.encrypt(data);
      const _data = { dataEn, publicKey };
      $.ajax({
        type: "POST",
        url: `http://${CA_IP}:${CA_PORT}/its/singin`,
        success(data) {

          localStorage.setItem("__CERTIFCATE__", JSON.stringify(data));
        },
        error(e) {
          swal("error", e.responseText, "error");
        },

        data: _data
      });
    }
  }
});
