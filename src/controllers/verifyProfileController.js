const dotenv = require('dotenv');
dotenv.config({path:'config.env'})

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
// sendOtp Endpoint
exports.sendOtp=  (req,res) => {
    try {
        if (req.query.phonenumber) {
            console.log("working",req.query);
             client
            .verify
            .services(process.env.SERVICE_ID)
            .verifications
            .create({
                to: `+${req.query.phonenumber}`,
                channel:'sms' 
            })
            .then(data => {
                console.log("data",data);
                res.status(200).send({
                    message: "Verification is sent!!",
                    phonenumber: req.query.phonenumber,
                    data
                })
            }) 
    
         } else {
            res.status(400).send({
                message: "Wrong phone number :(",
                phonenumber: req.query.phonenumber,
                data
            })
         }
    } catch (error) {
        console.log(error);
    }
    
};

// Verify Endpoint
exports.verifyOtp=  (req, res) => {
      if (req.query.phonenumber && (req.query.code)) {
        client
            .verify
            .services(process.env.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+${req.query.phonenumber}`,
                code: req.query.code
            })
            .then(data => {
                if (data.status === "approved") {
                    res.status(200).send({
                        message: "User is Verified!!",
                        data
                    })
                }
            }).catch(error => {
                res.json(400)({
                  message: 'Wrong phone number or code :(',
                  phonenumber: req.query.phonenumber,
                  data
                })
            })
        }
      }
