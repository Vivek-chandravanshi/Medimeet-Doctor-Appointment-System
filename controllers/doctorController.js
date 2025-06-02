
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

module.exports = {
    getDoctorInfoController, updateProfileController
}