const User = require("../Model/UserModel");







//display parts
const getAllUsers = async (req,res,next) =>{
    let Users;

    //Get all users
    try{
        users = await User.find();
    }catch (err){
        console.log(err);
    }

    //not found
    if(!users){
        return res.status(404).json({message:"user not found"});
    }

    //Display all users
    return res.status(200).json({ users });

};











//insert
const addUsers = async( req ,res , next ) => {
const {name,gmail,age,address} = req.body;

let users;

try{
    users = new User({name,gmail,age,address});
    await users.save();
}catch (err){
    console.log(err);
}
//not insert users
if(!users){
    return res.status(404).json({message:"unable to addd users"});
}
    return res.status(200).json({ users });
};









//get id
const getbyId = async(req , res , next ) => {
    const id = req.params.id;
    let users;

    try{
        users = await User.findById(id);

    }catch(err){
        console.log(err);
    }
//not in id
if(!users){
    return res.status(404).json({message:"unable find user"});
}
    return res.status(200).json({ users });
};
    







//update parts
/*
const updateUser = async (req , res , next) => {
    const id = req.params.id;
    const {name,gmail,age,address} = req.body;
    let users;
    try{
        users = await user.findByIdAndUpdate(
            id,
            {name : name ,gmail : gmail ,age : age ,address :address});
            users = await users.save();
    }catch(err){
        console.log(err);
    }
//not updte correctly
if(!users){
    return res.status(404).json({message:"unable update user detail"});
}
    return res.status(200).json({ users });
};
*/

const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { name, gmail, age, address } = req.body;

    let user;

    try {
        user = await User.findByIdAndUpdate(
            id,
            { name, gmail, age, address },
            { new: true } // This ensures you get the updated user
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while updating user" });
    }

    if (!user) {
        return res.status(404).json({ message: "Unable to update user detail" });
    }

    return res.status(200).json({ user });
};



//delete parts

const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    let user;
    try{
        user = await User.findByIdAndDelete(id)
    }catch(err){
        console.log(err)
    }


    if (!user) {
        return res.status(404).json({ message: "Unable to selete user detail" });
    }

    return res.status(200).json({ user });


}


















//export
exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getbyId = getbyId ;
exports.updateUser = updateUser ;
exports.deleteUser = deleteUser ;