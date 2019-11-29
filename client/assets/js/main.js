const toJson = obj => JSON.parse(JSON.stringify(obj));
const obj = new Vue({
  el: "#app",
  data: {
    activeTab:"__RT__",
    accountBalance: 555555,
    transaction: {
      from: 1111111111,
      to: "",
      amount: null,
      reason: "",
      password: ""
    }
  },

  methods: {
    sendTransaction() {
      const { from, to, amount, reason, password } = this.transaction;
      if (!from || !to || !amount || !reason || !password) {
        swal("error", "Some information is missing", "error");
        return;
      }
    }
  }
});

const start = async () => {};

start();
