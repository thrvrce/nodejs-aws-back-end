const  express = require('express');
require('dotenv').config();
const axios = require('axios').default;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.all('/*', (req, res) => {
  const [, recipient, ...rest] = req.originalUrl.split('/');
  const recipientURL = process.env[recipient];
  const additionalUrlStringSegments = rest.length ? '/' + rest.join('/') : '';

  // console.log('original url',req.originalUrl)
  // console.log('recipient key',recipient)
  // console.log('recipient url',recipientURL)
  // console.log('additionalUrlStringSegments',additionalUrlStringSegments)
  // console.log('request body',req.body)

  if (recipientURL) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientURL}${additionalUrlStringSegments}`,
      ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
    };
    // console.log('axios config',axiosConfig)
    axios(axiosConfig)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        if (error.response) {
          const { status = 500, data } = error.response;
          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
});

app.listen(PORT, () => {
  console.log(`App running at PORT:${PORT}`)
})
