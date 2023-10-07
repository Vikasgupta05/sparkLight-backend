const accountSid =  process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);



    
    const sendMsg = (reqBody) => {
        const servicePrices = reqBody?.billingServiceData.map(item => item.servicePrice);
        const totalServicePrice = servicePrices.reduce((total, price) => total + price, 0);
        try {
            client.messages.create({
                body: `Hi ${reqBody.customerName}, you paid Rs. ${totalServicePrice} for ${reqBody?.billingServiceData.length} services at Mckingstown - (Kelambakkam ). `,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+91${reqBody?.customerPhoneNo}`
            })
            .then(message => console.log(message.sid))
            .done();
            // return res.status(200).json({success : true , msg : "Message sent successfully"})
            
        } catch (error) {
            // return res.status(500).send(err.message);
        }
    }

module.exports = { sendMsg };
