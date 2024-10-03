import Doctor from "../../../models/doctor.js";
import { AppError, catchError } from "../../../utils/error.handler.js";
import Appointment from "../../../models/appointment.js";
import Review from "../../../models/review.js";
import Time from "../../../models/time.js";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'


const updateDoctorProfile = catchError(async (req, res) => {

  
  const { id } = req.user;
  const { name, email, phone, DOB, gender, specialization, bio, location, price } = req.body;
  let doctor = await Doctor.findById(id);
  if (!doctor) throw new AppError("Doctor not found!", 404);


  if (req.file) {
    const Image = await cloudinary.uploader.upload(req.file.path, {
      folder: "Doctors",
    });


    if (doctor.profilePhoto && doctor.profilePhoto.public_id) {
      await cloudinary.uploader.destroy(doctor.profilePhoto.public_id);
    }


    doctor.profilePhoto = {
      name: Image.asset_id,
      path: Image.secure_url,
      public_id: Image.public_id,
    };

 
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });
  }


  if (name) doctor.name = name;
  if (email) doctor.email = email;
  if (phone) doctor.phone = phone;
  if (DOB) doctor.DOB = DOB;
  if (gender) doctor.gender = gender;
  if (specialization) doctor.specialization = specialization;
  if (bio) doctor.bio = bio;
  if (location) doctor.location = location;
  if (price) doctor.price = price;


  if (doctor.price && doctor.location && doctor.specialization && doctor.phone) {
    doctor.accountComplite = true;
  }


  await doctor.save();

  return res.json({ message: "تم التعديل بنجاح", data: doctor });
});



const DoctorAccount = catchError(async (req, res) => {
  const { id: doctorId } = req.user;

  let data = await Doctor.findById(req.user.id);
  if (!data) return res.json({ message: "لم يتم العور علي المستخدم " });

  const appointments = await Appointment.find({ doctorId })
    .populate("doctorId", "_id")
    .populate("userId", "_id")
    .populate("time", "_id")
    .exec();
const review = await Review.countDocuments({doctor:doctorId})
  const totalAmount = appointments.reduce(
    (total, appointment) => total + appointment.price,
    0
  );

  if (!data.accountComplite) {
    return res.json({
      data: {
        message: "اكمل اعدادات الحجز",
        data,
        count: {
          review: review.length,
          appointmentCount: appointments.length,
          patientCount: appointments.filter(
            (appointment) => appointment.status === "confirmed"
          ).length,
          totalAmount,
        },
      },
    });
  }

  return res.json({
    data: {
      data,
      count: {
         review,
        appointmentCount: appointments.length,
        patientCount: appointments.filter(
          (appointment) => appointment.status === "confirmed"
        ).length,
        totalAmount,
      },
    },
  });
});

const deleteAccount = catchError(async (req, res) => {
  const { id } = req.user;
  await Doctor.findByIdAndDelete(id);
  res.json({ success: true, message: "تم جذف الحساب" });
});

const getMyAppointment = catchError(async (req, res) => {
  const { id: doctorId } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: "time",
  };

  const appointments = await Appointment.paginate({ doctorId }, options);
  res.json({ appointments });
});

const getMypatients = catchError(async (req, res) => {
  const { id: doctorId } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };
  const data = await Appointment.paginate(
    { doctorId, status: "confirmed" },
    options
  );
  if (!data) throw new AppError("not found !", 404);

  res.json({ data });
});


const GetAdsDoctor = catchError(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    select: "-password ",
  };
  const data = await Doctor.paginate(
    { ads: true, isBlock: false, accountComplite: true },
    options
  );
  res.json({ data });
});


const AppointmentStatus = catchError(async (req, res) => {
  const doctorId = req.user.id;
  const { status } = req.body;
  const {appointmentId} = req.params
  let data = await Appointment.findById(appointmentId);

  if (data && data.doctorId.toString() === doctorId) {
    await Appointment.findByIdAndUpdate(appointmentId, { status: status });
    const appointment = await Appointment.find({doctorId})
    return res.json({ success: true, message: "تم تغيير الحالة بنجاح" ,appointment});

  }else{
    throw new AppError("الموعد غير موجود ", 404);
  }
});




const filter = catchError(async (req, res) => {
  const { id: doctorId } = req.user;
  const { page = 1, limit = 10, visitNo, status, phone, name } = req.query;
  let filters = { doctorId };

  if (visitNo) filters.visitNo = visitNo;
  if (status) filters.status = status;
  if (phone) filters.phone = phone;
  if (name) filters.name = name;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const appointments = await Appointment.paginate(filters, options);

  return res.json({ data: appointments });
});

const pationtfilter = catchError(async (req, res) => {
  const { id: doctorId } = req.user;
  const { page = 1, limit = 10, visitNo, status, phone, name } = req.query;
  let filters = { doctorId, status: "confirmed" };

  if (visitNo) filters.visitNo = visitNo;
  if (status) filters.status = status;
  if (phone) filters.phone = phone;
  if (name) filters.name = name;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const appointments = await Appointment.paginate(filters, options);

  return res.json({ data: appointments });
});



/**
 * @description  users only
 * @access public 
 * @router doctor/
 * */

const GetAllDoctor = catchError(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    select: "profilePhoto name location ads price specialization bio ",
  };
  const data = await Doctor.paginate(
    { isVerify: true, isBlock: false, accountComplite: true },
    {options}
  );
  
  res.json({ data });
});
const DocotrInfo = catchError(async (req, res) => {
  const { id } = req.params;
  const info = await Doctor.findById({ _id: id }).select("profilePhoto name ads price specialization bio");
  if (!info) throw new AppError("not found", 404);

  const time = await Time.find({doctorId: id,isAvailable: true});
  res.json({
    data: {
      info,
      time
    },
  });
});


export {
  DocotrInfo,
  GetAllDoctor,
  deleteAccount,
  getMyAppointment,
  AppointmentStatus,
  updateDoctorProfile,
  DoctorAccount,
  getMypatients,
  GetAdsDoctor,
  filter,
  pationtfilter,
};
