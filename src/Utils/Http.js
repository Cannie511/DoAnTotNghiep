const chalk = require("chalk");

const handleError = (error) => {
  console.log(chalk.red("-----LOG ERROR-----: 500 -"), chalk.red(error.message));
  return {
    status: 500,
    message: error?.message,
  };
};

const handleResult = (status, message, data = {}) => {
  console.log(chalk.blue("-----LOG DATA-----: "), status, " - ", chalk.blue(message));
  return {
    status,
    message,
    ...(data && { data }),
  };
};
module.exports = { handleError, handleResult };
