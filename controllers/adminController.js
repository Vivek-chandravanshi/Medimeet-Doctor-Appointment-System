
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModel');


const getAllUsersController = async()=>{
    try{
        const users = await userModel.find({})
        res.status(200).send({
            success:true,
            message:'users data',
            data:users
        })
    }
    catch(error){
        console.log(error).send({
            success:false,
            message:'error while fetching users',
            error
        })
    }

}

const getAllDoctorsController = async()=>{
        try{
            const doctors = await doctorModel.find({})
            res.status(200).send({
            success:true,
            message:'doctors data',
            data:doctors
        })
    }
    catch(error){
        console.log(error).send({
            success:false,
            message:'error while fetching doctors',
            error
        })
    }
}

const changeAccountStatusController = async(req, res) => {
    try {
         const {doctorId, status} = req.body;
         const doctor = await doctorModel.findByIdAndUpdate(doctorId, {status});
         const user = await userModel.findOne({_id:doctor.userId})
         const notification = user.notification;
         notification.push({
            type: 'doctor-account-request-updated',
            message: `Your account status has been updated to ${status}`,
            onClickPath: '/notifications'
         });
        user.isDoctor = status === 'approved';
        await user.save();
        res.status(200).send({
            success:true,
            message:'account status updated successfully',
            data:doctor
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error while changing account status',
            error
        })
    }
}

module.exports = {getAllUsersController, getAllDoctorsController, changeAccountStatusController};