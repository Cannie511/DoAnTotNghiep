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
    const formattedDate:string = `${dayOfWeek}, ${day}/${month}/${year}`;
    return formattedDate;
}

/**
 * 
 * @returns string today 
 */

export const getCurrentTime = ()=>{
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
}
/**
 * 
 * @param dateString:string
 * convert string time to DD/MM HH:mm
 */
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

/**
 * 
 * @param dayString string of date need to compare
 * @returns minutes + seconds
 */
export const calculateTimeDifference = (dayString: string, time: string) => {
    const today = new Date();
    let timeDiffInMinutes = 0;
    const dateCompare = new Date(dayString);
    if (isNaN(dateCompare.getTime())) {
        throw new Error("Sai kiểu dữ liệu: Invalid Date");
    }
    const [hours, minutes] = time.split(':').map(Number);
    const dateWithTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0);
    const timeDiffInMilliseconds = Math.abs(today.getTime() - dateWithTime.getTime());
    timeDiffInMinutes = Math.floor(timeDiffInMilliseconds / 1000 / 60);
    const dateDiffInDays = Math.abs(+today.getDate() - +dateCompare.getDate());
    return {
      dateDiff: dateDiffInDays,
      timeDiff: timeDiffInMinutes
    };
}

export const combineDateTime = (dateString:string, timeString:string)=> {
    const datePart = new Date(dateString);
    if (isNaN(datePart.getTime())) {
        throw new Error("Sai kiểu dữ liệu: Invalid Date");
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    datePart.setHours(hours);
    datePart.setMinutes(minutes);
    datePart.setSeconds(0);

    return datePart;
}

export const formatRoomKey = (roomKey:string | number)=>{
  const roomKeyStr = roomKey.toString().replace(/(\d{3})(?=\d)/g, "$1-");
  return roomKeyStr;
}