const Model = require('../models');
const { handleError } = require('./HttpError');
const LIMIT = 10;

const pagination = async (table, attr, page) =>{
    try {
        const offset = (+page - 1) * LIMIT;
        if(!attr){
            const totalRecords = await Model[table].count();
            const totalPages = Math.ceil(totalRecords / LIMIT);
            const data = await Model[table].findAll({
                limit: LIMIT,
                offset,
                raw: true,
            });
            if (data && totalPages) {
            return {
                status: 200,
                message: "get data successfully",
                currentPage: page,
                total: totalPages,
                data,
            };
            }
        }
        
        if(!table) return {
          status: 422,
          message: "table is required",
        };
        if(typeof attr !== "object")
            return {
              status: 422,
              message: "attr must be an array",
            };
        if(!page) page = 1;
        const totalRecords = await Model[table].count();
        const totalPages = Math.ceil(totalRecords / LIMIT);
        const data = await Model[table].findAll({
            attributes: attr ? attr : ["*"],
            limit: LIMIT,
            offset,
            raw: true,
        });
        if (data && totalPages) {
          return {
            status: 200,
            message: "get data successfully",
            currentPage: page,
            total: totalPages,
            data,
          };
        }
        return {
          status: 422,
          message: "get data false",
          data: [],
        };
    } catch (error) {
        const err = handleError(error)
        return {
          status: err.status,
          message: err.message,
          data: [],
        };
    }
    
}
module.exports = pagination;