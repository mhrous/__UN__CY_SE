const obj = new Vue({
  el: "#app",
  data: {
    active: "add-transaction",
    from: "",
    password: "",
    to: "",
    amount: null,
    reason: ""
  },
  methods: {
    addTransaction() {
      socket.off(ERROR);
      socket.off(NO_ERROR);

      const { from, password, to, amount, reason } = this.$data;

      if (!from || !password || !to || !amount || !reason) {
        swal("error", "Some information is missing", "error");
        return;
      }
      if (password.length < 8) {
        swal("error", "password so week", "error");
        return;
      }
      const clientTransactionId = new Date().getTime();
      let data = { from, password, to, amount, reason, clientTransactionId };
      if (REQUEST == 1) {
        const { key, iv } = JSON.parse(KEY);
        SymmetricCryptography.setKye(key);
        SymmetricCryptography.setIv(iv);
        data = SymmetricCryptography.encrypt(data);
      } else {
 
        data = HybridCryptography.encrypt(data);
        SymmetricCryptography.setKye(HybridCryptography.symmetric.key);
        SymmetricCryptography.setIv(HybridCryptography.symmetric.iv);
      }

      socket.emit(SEND_TRANSACTION, data);

      socket.on(ERROR, data => {
        data = SymmetricCryptography.decrypt(data, false);
        swal("error", data, "error");
      });
      socket.on(NO_ERROR, data => {
        data = SymmetricCryptography.decrypt(data, false);

        swal("success", data, "success");
      });
      this.from = "";
      this.password = "";
      this.to = "";
      this.amount = null;
      this.reason = "";
    }
  }
});
