import bcrypt from "bcrypt";
// import Jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import { generateCookie } from "../utils/feature.js";


export const userRegister = async (req, res) => {

    const { name, email, password } = req.body;  // destructuring 
    let user = await User.findOne({ email });  // from mongoDB

    if (user) return res.status(404).json({
        success: false,
        message: "user already exist",
    })

    const hashPassword = await bcrypt.hash(password, 10);
    user = await User.create({
        name,
        email,
        password: hashPassword,  // updating password  with hashpassword 
    });

    generateCookie(user, res, 201, "User Register Successfully");

};



export const userLogin = async (req, res) => {

    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({
        success: false,
        message: "user do not exist",
    });

    // user.password = comming from db 
    // password      = comming from frontend website 
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credential"
        })
    }

    generateCookie(user, res, 201, `Welcome ${user.name}`);

};



export const userLogout = (req, res) => {
    res.status(200).clearCookie("token", {
        httpOnly: true,
        sameSite: 'None', // Important for cross-origin requests
        secure: true,     // Important for cross-origin requests
    }).json({
        success: true,
        message: "Logout successfully"
    });
}


export const getMyProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}


export const getUserById = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({
        success: false,
        message: "Invalid id, user does not exist "
    })

    res.json({
        success: true,
        message: "This  is the data of user ",
        data: user
    })
}