import { useNavigate } from 'react-router-dom';

const DoctorList = ({ doctor }) => {
    const navigate = useNavigate();

    return (
        <>
            <div
                onClick={() => { navigate(`/doctor/book-appointment/${doctor._id}`) }}
                className="doctor-list cursor-pointer bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200"
            >
                <div className="text-xl font-semibold text-blue-700 mb-2">
                    Dr. {doctor.firstName} {doctor.lastName}
                </div>
                <div className="space-y-1 text-gray-700">
                    <p>
                        <b>Specialization:</b> {doctor.specialization}
                    </p>
                    <p>
                        <b>Experience:</b> {doctor.experience} years
                    </p>
                    <p>
                        <b>Contact:</b> {doctor.phone} | {doctor.email}
                    </p>
                    <p>
                        <b>Address:</b> {doctor.address}
                    </p>
                    <p>
                        <b>Timings:</b> {doctor.timings[0]} to {doctor.timings[1]}
                    </p>
                    <p>
                        <b>Fees:</b> ${doctor.feesPerConsultation}
                    </p>
                </div>
            </div>
        </>
    );
}

export default DoctorList;