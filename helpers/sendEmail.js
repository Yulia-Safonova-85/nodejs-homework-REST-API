const Mailjet = require("node-mailjet");
require("dotenv").config();

const {MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, MJ_SENDER_EMAIL} = process.env;

const mailjet = new Mailjet({
    apiKey: MJ_APIKEY_PUBLIC,
    apiSecret: MJ_APIKEY_PRIVATE
  });

  const data = {
     to:"",
     subject:"Verification email sent",
     html:"<h3>Dear Konsyella, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"

  }

  const sendEmail = async (data) => {
    await mailjet.post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: MJ_SENDER_EMAIL,
                // Name: "Mailjet Pilot"
              },
              To: [
                {
                  Email: data.to,
                  Name: ""
                }
              ],
              Subject: data.subject,
              TextPart: "Dear friend, welcome to Mailjet! May the delivery force be with you!",
              HTMLPart: data.html,
            
            }
          ]
        })

return true;
  }

module.exports = sendEmail;
  