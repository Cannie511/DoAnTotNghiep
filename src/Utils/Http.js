
const handleError = (error) =>{
    console.log("-----LOG ERROR-----: ", error.message);
    return {
        status: 500,
        message: error?.message
    }
}

const handleResult = (status, message,data={}) => {
    console.log("-----LOG DATA-----: ", status, message);
  return {
    status,
    message,
    ...(data && { data }),
  };
};
module.exports = { handleError, handleResult };