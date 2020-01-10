const exec = require('child_process').exec;
const tmp = require('tmp');
const fs = require('fs');
const mime = require('mime');
const logger = require('./logger/log');

function executeCommand(fileTmpNameIn, opts, buffer, cb) {
	const CONTEXT = 'libreoffice-execute';

    const BASE_COMMAND = 'libreoffice';
    
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
    if (opts.mimeReq != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && opts.mimeReq != 'application/msword') {
        return cb('file must be docx or doc', null, null);
    }

	fs.writeFile(fileTmpNameIn, buffer, (errorWriteFile) => {
		if (errorWriteFile) {
			return cb(errorWriteFile, null);
		}

		exec(BASE_COMMAND+' --headless --convert-to pdf '+fileTmpNameIn+ ' --outdir /tmp', (errorExecCommand, stdout, stderr) => {
			if (stderr) {
                logger.log(CONTEXT, stderr, 'exec');
			}

			if (errorExecCommand) {
				return cb(errorExecCommand, null);
            }

			fs.readFile(fileTmpNameIn+'.pdf', (errorReadFile, data) => {
				if (errorReadFile) {
					return cb(errorReadFile, null);
                }
				return cb(null, data);
			});

		});

	});

}

function convertToPdf(file, opts, cb) {
    const fileTmpIn = tmp.fileSync({mode: 0664});
    let fileOutName = `${opts.originalName.split('.')[0]}.pdf`;
    const mimeType = mime.getType(fileOutName);

	executeCommand(fileTmpIn.name, opts, file.buffer, (err, data) => {
		if (err) {
			return cb(err, null);
        }
		
		return cb(null, {'name': fileOutName, 'mime': mimeType, 'data': data});

	});
}

module.exports = {convertToPdf};
