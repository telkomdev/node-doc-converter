const Server = require('./lib/server');
const converter = require('./lib/converter');
const multer = require('multer');

require('dotenv').config();

const PORT = process.env.PORT;

const multerStorage = multer.memoryStorage();
const multerUpload = multer({storage: multerStorage});

const server = new Server(multerUpload, converter);

server.app.listen(PORT, () => {
	console.log(`app listen on port ${PORT}`);
});
