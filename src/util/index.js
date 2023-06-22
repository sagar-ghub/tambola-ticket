const generateOtp = () => {
  // let otp = Math.floor(Math.random() * 10000);
  var minm = 1000;
  var maxm = 9999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;

  // return otp;
};

const sanatizeMemberData = (memberData) => {
  delete memberData.user_otp;
  delete memberData.user_otp_expiry;
  delete memberData.is_delete;
  delete memberData.is_user_active;
  return memberData;
};

module.exports = { generateOtp, sanatizeMemberData };
