
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModel')

const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.status(404).send({ message: 'User not found', success: false });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials', success: false });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).send({
            message: 'Login successful',
            success: true,
            token,
        });
    } catch (error) {
        res.status(500).send({ message: `Login error: ${error.message}`, success: false });
    }
};



const registerController = async(req, res) =>{
    try{
        const existingUser = await userModel.findOne({email:req.body.email}) 
        if(existingUser) return res.status(200).send({
            message:'user already exist',
            success:false
        })

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword

        const newUser = new userModel(req.body)
        console.log("Saving new user to DB:", req.body)
        await newUser.save()
        console.log("User saved:", newUser)


        res.status(201).send({
            message:'registered succesfully',
            success:true
        })

    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:`register controller ${error.message}`
        })
    }
}


const authController = async (req, res) => {
  try {

    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined; // Remove password from response
    if (!user) {
      return res.status(404).send({
        message: 'User not found',
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Auth error',
      success: false,
      error: err.message,
    });
  }
};

const applyDoctorController = async (req, res) => {
  try{
    const newDoctor = await doctorModel({...req.body, status:'pending'})
    await newDoctor.save()
    const adminUser = userModel.findOne({isAdmin:true})
    const notification = adminUser.notification
    notification.push({
      type:'apply doctor request',
      message:`${newDoctor.firstName} ${newDoctor.lastName} has has applied for a doctor account`,
      data:{
        doctorId:newDoctor._id,
        name:newDoctor.firstName + ' ' + newDoctor.lastName,
        onClickPath : '/admin/doctors'
      }
    })

    await userModel.findByIdAndUpdate(adminUser._id, {notification})
    res.status(201).send({
      success:true,
      message:'Doctor applied successfully'
    })

  }catch(error){
    console.log(error);
    return res.status(500).send({
      success:false,
      message:'error while applying for doctor'
    })
  }
}

const getAllNotificationsController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification
    const notification = user.notification
    seennotification.push(...notification)
    user.notification = []
    user.seennotification = notification
    const updatedUser = await user.save()
    res.status(200).send({
      success: true,
      message: 'Notifications fetched successfully',
      data: updatedUser.seennotification,
    });
  }
  catch (error) {

    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while getting notifications',
    });
  }

}

const deleteAllNotificationsController = async(req, res)=>{
  try{
    const user = await userModel.findOne({_id:req.body.userId})
    user.notification = []
    user.seennotification = []
    const updatedUser = await user.save()
    updatedUser.password = undefined
    res.status(200).send({
      success:true,
      message:'all messages deleted successfully',
      data:updatedUser
    })
  }catch(error){
    console,log(error)
    res.status(500).send({
      success:false,
      massage:'unable to delete all notifications',
      error
    })
  }
}

module.exports = {loginController, registerController, authController, applyDoctorController, getAllNotificationsController, deleteAllNotificationsController};