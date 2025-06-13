const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
// const userModel = require("../models/userModel"); // <-- Add this if missing


const getDoctorInfoController = async(req, res) =>{
    try{
        const doctor = await doctorModel.findOne({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message:'doctor data fetched successfully',
            data:doctor
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'error in fetching doctor details'
        })
    }
}

const updateProfileController = async(req, res) =>{
    try{
        const doctor = await doctorModel.findOneAndUpdate({userId:req.body.userId}, req.body)
        res.status(200).send({
            success:true,
            message:'doctor profile updated successfully',
            data:doctor
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'error in updating doctor profile'
        })
    }
}

const getDoctorByIdController = async(req, res) =>{
    try{
        const doctor = await doctorModel.findOne({_id:req.body.doctorId})
        res.status(200).send({
            success:true,
            message:'doctor fetched successfully',
            data:doctor
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'error in getting doctor'
        })
    }
}

const doctorAppointmentsController = async(req, res) =>{
    try{
        const doctor = await doctorModel.findOne({userId:req.body.userId})
        const appointments = await appointmentModel.find({doctorId: doctor._id})
        res.status(200).send({
            success:true,
            message:'doctor appointments fetched successfully',
            data:appointments
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'error in getting doctor appointments'
        })
    }
}

const updateStatusController = async(req, res) =>{
    try{
        const { appointmentId, status } = req.body;
        const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, {status}, { new: true });

        const user = await userModel.findOne({_id: appointment.userId});
        if (user) {
            if (!Array.isArray(user.notification)) user.notification = [];
            user.notification.push({
                type: 'status-updated',
                message: `Your appointment status has been updated to ${status}`,
                onClickPath: '/appointments'
            });
            await user.save();
        }
        res.status(200).send({
            success:true,
            message:'status updated successfully',
            data:appointment
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'error in updating status'
        })
    }
}

module.exports = {
    getDoctorInfoController, updateStatusController, updateProfileController, getDoctorByIdController, 
    doctorAppointmentsController
}