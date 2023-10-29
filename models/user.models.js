const db = require("../data/database");
const bcrypt = require("bcrypt");
const {ObjectId} = require("mongodb");

class User {
  constructor(email, password, fullName, street, postalCode, city) {
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.address = {
      street: street,
      postalCode: postalCode,
      city: city,
    };
  }
  async signup() {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      await db.getDb().collection("users").insertOne({
        email: this.email,
        password: hashedPassword,
        fullName: this.fullName,
        address: this.address,
      });
    return;
  }

  static async findById(userId){
    if(userId){
      const id = new ObjectId(userId);
      const userData = await db.getDb().collection("users").findOne({_id: id}, {projection: {password: 0}});

      return userData;
    }
  }
  async getUserWithSameEmail() {
    const userLoggedIn = await db
      .getDb()
      .collection("users")
      .findOne({ email: this.email });
    if (!userLoggedIn) {
      //errore mail non registrata
      return;
    }

    return userLoggedIn;
  }

  async existsAlready(){
    const existingUser = await this.getUserWithSameEmail();
    console.log("existingUser"+existingUser);
    if(existingUser){
      return true;
    }
    else{
      return false;
    }
  }

  async comparePassword(hashedPassword) {
    return await bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
