import express from 'express';
import "dotenv/config";
import router from './router.js';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(router);

const port = 3000;

app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

export default app;