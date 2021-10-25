'use strict';

const basicAuthorizer = async (event, ctx, cb) => {
  console.log(`event authorizationToken: ${event.authorizationToken}`)

  if (event.type !== 'TOKEN') {
    return 'Unauthorized'
  }

  try {
    const { authorizationToken } = event

    const encodedCreds = authorizationToken.split(' ')[1]
    const buff = Buffer.from(encodedCreds, 'base64')
    const plainCreds = buff.toString('utf-8').split(':')
    const [username, password] = plainCreds

    console.log(`username: ${username}, password: ${password}`)

    const storedUserPAssword = process.env[username]
    const effect = !storedUserPAssword || storedUserPAssword !== password ? 'Deny' : 'Allow'

    const policy = {
      principalId: encodedCreds,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: event.methodArn
          }
        ]
      },
    }

    return policy
  } catch (err) {
    return `Unauthorized: ${err.message}`
  }
};
module.exports = {
  basicAuthorizer,
}
