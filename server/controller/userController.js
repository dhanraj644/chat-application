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
    console.error("userCreate error:", error);
    res.status(500).json({ error: error.message || error });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await user.findOne({ userEmail: email });

      console.log(data);
      
    if (data == null) {
      res.status(404).json({ msg: "user is not found" });
    } else if (bcrypt.compareSync(password, data.userPassword) == false) {
      res.status(201).json("password is incorrected");
    } else {
      data.status = "true";
      await data.save();

      // Mongoose automatically provides data.id via virtual, or we use data._id
      res
        .status(200)
        .json({ msg: "user is loging ", name: data.userName, id: data.id });
    }
  } catch (error) {
    console.error("userLogin error:", error);
    res.status(500).json({ error: "something wrong", msg: error.message || error });
  }
};

const getAllUser = async (req, res) => {
  try {
    const data = await user.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error("getAllUser error:", error);
    res.status(500).json({ error: "something wrong", msg: error.message || error });
  }
};

const statusupdate = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Updating status to false for user ID:", id);
    await user.findByIdAndUpdate(id, { status: "false" });

    res.status(200).json({ msg: "updated" });
  } catch (error) {
    console.error("statusupdate error:", error);
    res.status(500).json({ error: "something wrong", msg: error.message || error });
  }
};

export { userCreate, userLogin, getAllUser, statusupdate };
