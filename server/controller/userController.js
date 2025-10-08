import { user } from "../model/index.js";
import bcrypt from "bcrypt";

const secrectkey = "123456";
const userCreate = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const haspass = bcrypt.hashSync(password, 5);

    await user.create({
      userName: name,
      userEmail: email,
      userPassword: haspass,
    });

    res.status(200).json({ msg: "user is created" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const userLogin = async (req, res) => {
  try {
    // console.log("hello")
    const { email, password } = req.body;
    const data = await user.findOne({ where: { userEmail: email } });

    if (data == null) {
      res.status(404).json({ msg: "user is not found" });
    } else if (bcrypt.compareSync(password, data.userPassword) == false) {
      res.status(201).json("password is incorrected");
    } else {
      await user.update({ status: "true" }, { where: { userEmail: email } });

      res
        .status(200)
        .json({ msg: "user is loging ", name: data.userName, id: data.id });
    }
  } catch (error) {
    res.status(500).json({ error: "something wrong", msg: error });
  }
};

const getAllUser = async (req, res) => {
  try {
    const data = await user.findAll();

    // console.log(data)

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "something wrong", msg: error });
  }
};

const statusupdate = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await user.update({ status: "false" }, { where: { id: id } });

    res.status(200).json({ msg: "updated" });
  } catch (error) {
    res.status(500).json({ error: "something wrong", msg: error });
  }
};

export { userCreate, userLogin, getAllUser, statusupdate };
