let clientTransactionId;
const obj = new Vue({
  el: "#app",
  data: {
    active: "add-transaction",
    from: "jod_123",
    password: "11111111",
    to: "ali_123",
    amount: 1,
    reason: "1"
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
      if (!clientTransactionId) clientTransactionId = new Date().getTime();
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
        clientTransactionId = null
      });
      socket.on(NO_ERROR, data => {
        data = SymmetricCryptography.decrypt(data, false);

        swal("success", data, "success");
        clientTransactionId = null

      });
      this.from = "jod_123";
      this.password = "11111111";
      this.to = "ali_123";
      this.amount = 1;
      this.reason = "1";
    }
  }
});
