const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const DoctorProfile = require('./models/DoctorProfile');
const Department = require('./models/Department');

async function seedDoctor() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/medcore');
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ email: 'dr.sharma@hospital.com' });
        if (existing) {
            console.log('Doctor Sharma already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('doctor123', 10);
        const user = await User.create({
            email: 'dr.sharma@hospital.com',
            username: 'dr_sharma',
            password: hashedPassword,
            first_name: 'Rajesh',
            last_name: 'Sharma',
            role: 'doctor',
            phone: '9876543210'
        });

        // Find a department (e.g., Cardiology or Cardiology ID)
        let dept = await Department.findOne({ name: 'Cardiology' });
        if (!dept) {
            dept = await Department.findOne();
        }

        await DoctorProfile.create({
            user: user._id,
            email: 'dr.sharma@hospital.com',
            specialization: 'Cardiology',
            department: dept?._id,
            license_no: 'DL12345',
            experience_years: 12,
            qualification: 'MBBS, MD',
            fee: 800
        });

        console.log('Doctor Sharma seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding doctor:', err);
        process.exit(1);
    }
}

seedDoctor();
