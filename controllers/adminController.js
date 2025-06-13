const doctorModel = require("../models/doctorModel");
const userModel = require('../models/userModel')


const getAllUsersController = async(req, res)=>{
    try{
        const users = await userModel.find({})
        res.status(200).send({
            success:true,
            message:'users data',
            data:users
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error while fetching users',
            error
        })
    }

}

const getAllDoctorsController = async(req, res)=>{
        try{
            const doctors = await doctorModel.find({})
            res.status(200).send({
            success:true,
            message:'doctors data',
            data:doctors
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error while fetching doctors',
            error
        })
    }
}

const changeAccountStatusController = async(req, res) => {
    try {
        const { doctorId, status } = req.body;
        // Get the updated doctor document
        const doctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { status },
            { new: true }
        );
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor not found'
            });
        }
        const user = await userModel.findOne({ _id: doctor.userId });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        user.notification.push({
            type: 'doctor-account-request-updated',
            message: `Your account status has been updated to ${status}`,
            onClickPath: '/notifications'
        });
        // Set isDoctor to true only if status is 'approved'
        user.isDoctor = status === 'approved';
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Account status updated successfully',
            data: doctor
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while changing account status',
            error
        });
    }
}

module.exports = {getAllUsersController, getAllDoctorsController, changeAccountStatusController};