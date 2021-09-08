'use strict';
const {Client} = require('pg');

const { PG_HOST, PG_PORT, PG_DAABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DAABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,

};

const getProductsById = async (event) => {
  let result;
  let statusCode = 200;
  let {
    resource = '',
    path = '',
    httpMethod=  '',
    queryStringParameters = {},
    pathParameters = ''
  } = event;
  let message = 'ok';
  const { productId = '' } = event.pathParameters;
  console.log({ resource, path, httpMethod, queryStringParameters, productId});
  const client = new Client(dbOptions);
  try {
    if (productId) {

      await client.connect();
      const {rows} = await client.query(`
      select products.*, stocks.count
      from products
      inner join stocks on stocks.product_id = products.id
      where '${productId}' = products.id`);
      result = rows[0];
      console.log(result);

      if (!result) {
        statusCode = 400;
        message = 'product not found';
      }
    } else {
      statusCode = 400;
      message = 'incorrect id';
    }

  } catch (err) {
    statusCode = 500;
    message = err.message;
  }
  finally {
    client.end();
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PATCH, PUT',
      },
      statusCode,
      body: JSON.stringify(
        {
          message,
          result
        }
      ),
    }
  }
  };

module.exports.getProductsById = getProductsById;
