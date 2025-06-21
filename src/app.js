const express = require('express');
const mongoClient = require('./db/mongoose');
const errorHandler = require('./middleware/error_handler');
const userRouter = require('./routers/user_router');
const postRouter = require('./routers/post_router');
const commentRouter = require('./routers/comment_router');
const mainRouter = require('./api/routes');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
require('./utils/tasks');

const app = express();

const port = process.env.PORT || 3000;

// Apply rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Apply CORS
app.use(cors());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Instagram Clone API',
      version: '1.0.0',
      description: 'API documentation for the Instagram Clone backend',
    },
  },
  apis: ['./src/routers/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

async function start() {

    await mongoClient.connect();

    app.get('/test', (req, res) => {
        res.send(`Server is up and running at ${new Date().toString()}`);
    });

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use(mainRouter);

    app.use(errorHandler);

    // app.use(userRouter);

    // app.use(postRouter);

    // app.use(commentRouter);

    try {
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();