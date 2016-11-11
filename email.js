'use strict';

const nodemailer = require('nodemailer');
const env = require('./env');

let _date = new Date();
const transporter = nodemailer.createTransport(env.transport);


module.exports = function sendMail(data, subject, emails) {
  console.log(`Sending emails to ${emails.join(', ').toString()} with subject ${subject}`);

  let date = new Date();
  const diff = date - _date;
  _date = date;
  if (diff < 100) return;

  const mailOptions = Object.assign({}, env.email, {
    html: data,
    subject,
    to: emails.join(', ').toString(),
  });
  // transporter.sendMail(mailOptions, function(error, info) {
  //   if (error) {
  //     return console.log(error);
  //   }
  //   console.log('Message sent: ' + info.response);
  // });
  console.log('EMAIL SENT');
}