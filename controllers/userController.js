const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModel');
const { get } = require('mongoose');
const appointmentModel = require('../models/appointmentModel');
const moment = require('moment');

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
        //console.log("Saving new user to DB:", req.body)
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
  try {
    const newDoctor = new doctorModel({ ...req.body, status: 'pending' });
    await newDoctor.save();

    // Await the admin user query!
    const adminUser = await userModel.findOne({ isAdmin: true });

    if (adminUser) {
      adminUser.notification.push({
        type: 'apply doctor request',
        message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
        data: {
          doctorId: newDoctor._id,
          name: newDoctor.firstName + ' ' + newDoctor.lastName,
          onClickPath: '/admin/doctors'
        }
      });
      await adminUser.save();
    } else {
      console.log("Admin user not found");
    }

    res.status(201).send({
      success: true,
      message: 'Doctor applied successfully'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'error while applying for doctor'
    });
  }
}

const getAllNotificationsController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    // Move all notifications to seennotification
    user.seennotification.push(...user.notification);
    user.notification = [];
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: 'Notifications marked as read',
      data: updatedUser.seennotification,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while getting notifications',
      error
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

const getAllDoctorsController = async(req, res) =>{
  try{
    const doctors = await doctorModel.find({status:'approved'})
    res.status(200).send({
      success:true,
      message:'doctors fetched successfully',
      data:doctors
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'unable to fetch doctors',
      error
    })
  }
}

const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment request sent succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

const bookingAvailabilityController = async(req, res)=>{
  try{
    const { doctorId, date, time } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).send({
        success: false,
        message: "doctorId, date, and time are required"
      });
    }

    const formattedDate = moment(date, 'DD-MM-YYYY').toISOString();
    const fromTime = moment(time, 'HH:mm').subtract(1, 'hours').toISOString();
    const toTime = moment(time, 'HH:mm').add(1, 'hours').toISOString();

    const appointments = await appointmentModel.find({
      doctorId,
      date: formattedDate,
      time: {
        $gte: fromTime,
        $lte: toTime
      }
    });

    if(appointments.length > 0){
      return res.status(200).send({
        success: true,
        message: 'No available slots',
        data: appointments
      });
    } else {
      return res.status(200).send({
        success: true,
        message: 'Available slot',
      });
    }
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'unable to fetch booking availability',
      error
    })
  }
}

const userAppointmentsController = async(req, res)=>{
  try{
    const appointments = await appointmentModel.find({userId:req.body.userId})
    res.status(200).send({
      success:true,
      message:'Appointments fetched successfully',
      data:appointments
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'unable to fetch appointments',
      error
    })
  }
}

module.exports = {loginController, registerController, authController, applyDoctorController,
  getAllNotificationsController, deleteAllNotificationsController, getAllDoctorsController, 
  bookAppointmentController, bookingAvailabilityController, userAppointmentsController}