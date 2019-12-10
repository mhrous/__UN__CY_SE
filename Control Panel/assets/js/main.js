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
      let data = { from, password, to, amount, reason };
      if (REQUEST == 1) {
        data = SymmetricCryptography.encrypt(data);
      } else {
        data = HybridCryptography.encrypt(data);
      }

      socket.emit(SEND_TRANSACTION, data);

      socket.on(ERROR, data => {
        if (REQUEST == 1) {
          data = SymmetricCryptography.decrypt(data, false);
        } else if (REQUEST == 2) {
          data = HybridCryptography.decrypt(data, false);
        }

        swal("error", data, "error");
      });
      socket.on(NO_ERROR, () => {
        swal("success", "Done ..", "success");
      });
      this.from = "";
      this.password = "";
      this.to = "";
      this.amount = null;
      this.reason = "";
    }
  }
});
