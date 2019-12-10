import { User } from "./model";

const array = [
  {
    userName: "jod_123",
    name: "jod",
    password: "12345678",
    accountBalance: 1000
  },
  {
    userName: "mhamad_123",

    name: "mhamad",
    password: "12345678",
    accountBalance: 1000
  }
];

export default () => {
  User.collection.drop();
  array.forEach(user => {
    User.create(user);
  });
};
