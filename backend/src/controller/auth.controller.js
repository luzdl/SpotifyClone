import User from "../models/user.model";

export const authCallback = async (req, res) => {
    try {
        const {id, firstName, lastName, imageUrl} = req.body;

        // Check if the user already exists
        const user = await User.findOne({clerkId: id});

        if(!user) {
            //sign up
            await User.create({
            clerkId: id,
            fullName: `${firstName} ${lastName}`,
            imageUrl
            })
        }

        res.status(200).json({success: true})
    } catch (error) {
        console.log("Error in auth callback", error);
        res.status(500).json({message: "Internal server error", error})
    }
};