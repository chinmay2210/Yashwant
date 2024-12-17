import admin from './firebaseadmin.mjs';

const sendNotification = async (token, payload) => {
  try {
    await admin.messaging().send({
      token,  // The token must be part of the message object
      ...payload // Spread the payload here to include notification and data
    });
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Example usage
// const token = 'fsmPSLNtSCWo1FwJFgN_WC:APA91bFa_0KvsTSADmX0VCoYuVYD-Y2NsoK8mSlakZOwNMNUXbs6ih4-HVVIPWSuqKiRZ89s52yJRIbCF7p0pz-9wu_Gghu0j6OofORBQj66GrOLNq3LVCSvUcHMYi_emiDySoSJD8jA'

// const payload = {
//   notification: {
//     title: 'Hello',
//     body: 'This is a test notification',
//   },
 
// };

// sendNotification(token, payload);

export default sendNotification;
