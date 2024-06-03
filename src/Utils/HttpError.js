const handleError = (error) =>{
    console.log("-----LOG ERROR-----: ",error.message);
    return {
        status: 500,
        message: error.message
    }
}
module.exports = {handleError}