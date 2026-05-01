const axios=require("axios")

const sendSms=async(mobileNo,otp)=>{
    try {
        const response=await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                variables_values:otp,
                route:"otp",
                numbers:mobileNo,
            },
            {
                headers:{
                 authorization:process.env.FAST2SMS_API_KEY,
                 "Content-Type":"application/json",
                }
            }
        )

        if(response.data.return===true){
            console.log("SMS sent successfully to:",mobileNo)
        }else{
            console.error("Fast2SMS error:",response.data)
            throw new Error("SMS could not be sent")
        }
    } catch (error) {
        console.error("SMS sent error:",error.message)
        throw new Error("SMS could not be sent")
    }
}

module.exports=sendSms