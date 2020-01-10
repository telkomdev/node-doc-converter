const router = require('express').Router();

module.exports = (multerUpload, converter) => {

	router.post('/', multerUpload.single('file'), (req, res, next) => {
		const file = req.file;
		if (!file) {
			res.status(400);
			return res.json({'message': 'file cannot be empty'});
		}

		const originalName = file.originalname;

		converter.convertToPdf(file, {mimeReq: file.mimetype, originalName: originalName}, (err, data) => {
			if (err) {
				return res.status(400).json({'message': err});
			}

			res.setHeader('Content-type', data.mime);
			return res.send(data.data);
		});
	});

	router.post('/web', multerUpload.single('file'), (req, res, next) => {
		const file = req.file;
		if (!file) {
			res.status(400);
			return res.redirect('/');
		}

		const originalName = file.originalname;

		converter.convertToPdf(file, {mimeReq: file.mimetype, originalName: originalName}, (err, data) => {
			if (err) {
				res.status(400);
				return res.redirect('/');
			}

			res.setHeader('Content-disposition', 'attachment; filename=' + data.name);
			res.setHeader('Content-type', data.mime);
			return res.send(data.data);
		});
	});

	return router;
};
