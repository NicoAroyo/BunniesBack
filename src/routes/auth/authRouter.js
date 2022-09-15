import express from "express";
import Model from "../../models/user.js";

export const authRouter = express.Router();

authRouter.post("/", async (req, res) => {
  const dataReq = req.body;
  const data = new Model({
    imageUrl: dataReq.imageUrl,
    loginType: dataReq.loginType,
    email: dataReq.email,
    firstName: dataReq.firstName,
    lastName: dataReq.lastName,
    accessToken: dataReq.accessToken,
  });

  try {
    const user = await Model.findOne({ email: data.email }).exec();
    //if user doesnt exist
    if (!user) {
      const dataToSave = await data.save();
      res
        .status(200)
        .json({ type: "new", message: "created a new user", user: dataToSave });
    } else {
      res
        .status(200)
        .json({ type: "existing", message: "found user", user: user });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
