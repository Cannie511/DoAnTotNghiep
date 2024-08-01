const Model = require("../models");
const { handleError } = require("./Http");
require('dotenv').config();
const LIMIT = +process.env.LIMIT_RECORD;

const pagination = async (table, attr = {}, page, where = {}, order={}, include={}) => {
  try {
    if (!table) {
      return {
        status: 422,
        message: "table is required",
      };
    }
    if (typeof attr !== "object") {
      return {
        status: 422,
        message: "attr must be an object",
      };
    }

    if (!page) page = 1;
    const offset = (+page - 1) * LIMIT;

    const totalRecords = await Model[table].count({ include, where });
    const totalPages = Math.ceil(totalRecords / LIMIT);
    const data = await Model[table].findAll({
      include,
      attributes: attr.length !== 0 ? attr : ["*"],
      limit: LIMIT,
      offset,
      where: where || {},
      order: order || [],
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
    const err = handleError(error);
    return {
      status: err.status,
      message: err.message,
      data: [],
    };
  }
};

module.exports = pagination;
