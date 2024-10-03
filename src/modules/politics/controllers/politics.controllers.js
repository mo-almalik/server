import { catchError ,AppError } from "../../../utils/error.handler.js";
import Politics from "../../../models/politics.js";


const getPolitics = catchError(async (req, res) => {
    const politics = await Politics.find({status :'active'}).populate();
    res.json({ data: politics });
});

const addPolitics = catchError(async (req, res) => {
    const { title, content } = req.body;
    let politics = await Politics.findOne({ title});
    if (politics) throw new AppError("السياسة موجودة مسبقا", 400);
    politics = await Politics.create({ title, content ,createdBy:req.user.id });
    res.status(201).json({ data: politics });
})

const updatePolitics = catchError(async (req, res) => {
    const { id } = req.params;
    const { title, content ,status } = req.body;
    let politics = await Politics.findByIdAndUpdate(id, { title, content ,status }, { new: true });
    if (!politics) throw new AppError("السياسة غير موجودة", 404);
    res.json({ data: politics });
})

const deletePolitics = catchError(async (req, res) => {
    const { id } = req.params;
    let politics = await Politics.findByIdAndDelete(id);
    if (!politics) throw new AppError("السياسة غير موجودة", 404);
    res.json({ success: true, message: "تم الحذف بنجاح" });
 
})

const getToAdmin = catchError(async (req, res) => {
    const politics = await Politics.find().populate('createdBy','name');
    res.json({ data: politics });
});
export { getPolitics, addPolitics, updatePolitics, deletePolitics ,getToAdmin };