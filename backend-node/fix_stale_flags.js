const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/medcore').then(async () => {
  const db = mongoose.connection.db;
  // Find all currently admitted patients
  const admissions = await db.collection('admissions').find({ status: 'admitted' }).toArray();
  const admittedPatientIds = admissions.map(a => a.patient.toString());
  console.log('Currently admitted patient IDs:', admittedPatientIds);
  // Clear stale admission_requested flags for patients NOT currently admitted
  const allRequested = await db.collection('appointments').find({ admission_requested: true }).toArray();
  let cleared = 0;
  for (const appt of allRequested) {
    if (!admittedPatientIds.includes(appt.patient?.toString())) {
      await db.collection('appointments').updateOne({ _id: appt._id }, { $set: { admission_requested: false } });
      cleared++;
    }
  }
  console.log('Cleared stale admission_requested flags:', cleared, 'appointments updated');
  mongoose.disconnect();
}).catch(e => console.error(e.message));
