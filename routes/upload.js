const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const checkAuth = require('../middleware/auth');

module.exports = (router) => {

    router.post('/image', checkAuth, (req, res) => {
        if (!req.files.file) {
            res.json({ success: false, message: 'no file attached' });
            return;
        }
        const acceptedMIMEType = ['image/bmp', 'image/vnd.microsoft.icon', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
        if (acceptedMIMEType.indexOf(req.files.file.mimetype) == -1) {
            res.json({ success: false, message: 'only accpt image file' });
            return;
        }
        if (req.files.file.size / 1024 / 1024 > 10) {
            res.json({ success: false, message: 'file exceeds 10MB' });
            return;
        }

        const s3 = new AWS.S3();

        console.log('received upload image file', req.files.file)

        const fileContent = Buffer.from(req.files.file.data, 'binary');

        const params = {
            Bucket: 'image.dedd.ca',
            ContentType: req.files.file.mimetype,
            ContentEncoding: 'base64',
            ContentDisposition: 'attachment',
            Key: uuidv4(),
            Body: fileContent
        };

        s3.upload(params, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                res.json({ success: false, message: err });
                return;
            }
            console.log('uploaded', data.key)
            res.json({ success: true, message: 'image uploaded', key: data.key });
        });

    });

    return router;
};
