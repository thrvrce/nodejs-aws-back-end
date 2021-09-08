'use strict';
const { Client } = require('pg');

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

const createProduct = async (event) => {
  let statusCode = 200;
  let {
    resource = '',
    path = '',
    httpMethod = '',
    queryStringParameters = {},
    body
  } = event;
  let {
    title = '',
    description = '',
    price = '',
    imageUrl = '',
    count = 0
  } = JSON.parse(body);
  const client = new Client(dbOptions);
  let message = 'ok';

  console.log({ resource, path, httpMethod, queryStringParameters, body });

  try {
    if (title && description && price && imageUrl && count) {
      await client.connect();
      await client.query(
        `
          insert into products
            (title, description, price, "imageUrl")
          values
            ('${title}', '${description}', ${price}, '${imageUrl}');

          insert into stocks
            (product_id, count)
          values
            ((select id from products where products.title = '${title}' limit 1 ), ${count});
        `
      );
    } else {
      statusCode = 400;
      message = 'check product parameters';
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
      body: JSON.stringify({statusCode, message,}),
    }
  }
};
module.exports.createProduct = createProduct;
