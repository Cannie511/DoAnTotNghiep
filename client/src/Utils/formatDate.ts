const moment = require('moment-timezone');
export const formatDate = (date_string:string, time?:string) =>{
    const dateObj = new Date(date_string);
    const daysOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const dayOfWeek = daysOfWeek[dateObj.getDay()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const year = dateObj.getFullYear();
    if(time){
     const formattedDate = `${dayOfWeek}, ${day}/${month}/${year} ${time}`;
     return formattedDate;
    }
    const formattedDate = `${dayOfWeek}, ${day}/${month}/${year}`;
    return formattedDate;
}

/**
 * 
 * @param time :string
 * convert string time to hh:mm
 */
export const getCurrentTime = ()=>{
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
}

export const formatDateMessage = (dateString:string) => {
  const inputDate = moment.tz(dateString, 'Asia/Ho_Chi_Minh');
  const now = moment.tz('Asia/Ho_Chi_Minh');
  const today = moment.tz('Asia/Ho_Chi_Minh').startOf('day');
  const yesterday = moment.tz('Asia/Ho_Chi_Minh').subtract(1, 'days').startOf('day');
  const dayBeforeYesterday = moment.tz('Asia/Ho_Chi_Minh').subtract(2, 'days').startOf('day');
  if (inputDate.isSame(today, 'd')) {
    return inputDate.format('HH:mm');
  } else if (inputDate.isSame(yesterday, 'd')) {
    return `hôm qua, ${inputDate.format('HH:mm')}`;
  } else if (inputDate.isAfter(dayBeforeYesterday)) {
    return inputDate.format('DD/MM HH:mm');
  } else {
    return inputDate.format('DD/MM HH:mm');
  }
};
