let listVerificationCode = [];

const generateCode = (email)=>{
  if(email){
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const index = listVerificationCode.findIndex((x) => x.email === email);
    if (index === -1) listVerificationCode.push({ email, verificationCode });
    else {
      listVerificationCode[index].verificationCode = verificationCode;
    }
    return verificationCode;
  }
  return null;
}
module.exports = { generateCode, listVerificationCode };