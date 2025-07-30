class User {
  constructor(id, name, email, password, phone_number, acc_number) {
    this.id = id;
    this.name = name;
    this.acc_number = acc_number;
    this.password = password;
    this.email = email;
    this.phone_number = phone_number;
  }
}

const users = [new User(1, "john", "password", "email", "phone_number")];

module.exports = {
  User,
  users,
};
