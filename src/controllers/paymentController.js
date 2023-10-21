const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY)
const cors = require("cors");
const User = require("../models/userModel")

const payment = async (req, res) => {
    const { amount, source, description, currency } = req.body;

  try {
    
    const charge = await stripe.charges.create({
      amount: amount, 
      currency: currency, 
      source: source, 
      description: description, 
    });

    
    if (charge.status === 'succeeded') {
      
      res.status(200).json({ message: 'Payment successful' });
    } else {
      
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
}

const rechargeAccountBalance = async (req, res)=> {
  const { userId, amount } = req.body;
  console.log(amount)

  try{
    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({ message: 'User not found'});
    }

    user.accountBalance += amount;

    await user.save();

    return res.status(200).json({ message: 'Account balance updated successfully'});

  }catch(error){
    console.log(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const getCurrentBalanceByUserId = async (req, res) => {
  const { userId } = req.params; // Change req.body to req.params to get userId from the URL
  

  try {
    const user = await User.findById(userId);
    

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ accountBalance: user.accountBalance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
    payment,
    rechargeAccountBalance,
    getCurrentBalanceByUserId
    
    
  };