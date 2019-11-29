const toJson = obj => JSON.parse(JSON.stringify(obj));
const obj = new Vue({
  el: "#app",
  data: {
    active: "user",
    users: [],
    user: {
      name: "",
      password: "",
      accountBalance: null
    }
  },

  methods: {
    async addUser() {
      
      const { name, password, accountBalance } = this.user;
      if (!password || !name || !accountBalance) {
        swal("error", "Some information is missing", "error");
        return;
      }
      if (password.length < 8) {
        swal("error", "The password is too weak", "error");
        return;
      }
      try {
        const newUser = await $UserDB.create({
          name,
          password,
          accountBalance
        });
        const { _id } = newUser._doc;
        this.users = [{ name, accountBalance, _id }, ...this.users];
        this.user.name = "";
        this.user.password = "";
        this.user.accountBalance = null;
      } catch (e) {
        console.log(e);
      }
    }
  }
});

const start = async () => {
  try {
    const data = await $UserDB
      .find({})
      .sort({ updatedAt: -1 })
      .select("name accountBalance")
      .lean()
      .exec();

    obj.users = data;
  } catch (e) {
    console.log(e);
  }
};

start();
