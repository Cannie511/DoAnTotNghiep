
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
