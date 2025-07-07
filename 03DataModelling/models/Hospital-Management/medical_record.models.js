import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    visitDate: { type: Date, required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String },
    prescription: { type: String },
    notes: { type: String }

}, { timestamps: true })

export const MedicalRecord = mongoose.model(
    'MedicalRecord', medicalRecordSchema
)