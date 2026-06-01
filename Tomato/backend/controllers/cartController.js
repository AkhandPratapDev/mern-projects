// import userModel from "../models/userModel.js"

// // add items to user cart
// const addToCart = async (req,res) =>{
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;
//         if (!cartData[req.body.itemId]) {
//             cartData[req.body.itemId] = 1
//         }
//         else{
//             cartData[req.body.itemId] += 1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//         res.json({success:true,message:"Added To Cart"})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"}) 
        
//     }
// }

// // remove items from user cart
// const removeFromCart = async (req,res) =>{
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;
//         if (cartData[req.body.itemId]>0) {
//             cartData[req.body.itemId] -= 1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData})
//         res.json({success:true,message:"Removed From Cart"})
//     } catch (error) {
//         console.log(error);
//         res.josn({success:false,message:"Error "})
        
//     }
// }

// // fetch user cart data
// const getCart = async (req,res) =>{
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;
//         res.json({success:true,cartData})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }
// }

// export {addToCart,removeFromCart,getCart}






import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // Find user
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize cartData if undefined
        const cartData = userData.cartData || {};

        // Add or increment item
        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        // Update user document
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // Find user
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};

        // Decrement item count if exists
        if (cartData[itemId] && cartData[itemId] > 0) {
            cartData[itemId] -= 1;

            // Optional: remove item if quantity is 0
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error removing from cart" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find user
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};

        res.json({ success: true, cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching cart" });
    }
};

export { addToCart, removeFromCart, getCart };
