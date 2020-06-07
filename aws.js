const AWS = require("aws-sdk");

// AWS s3 congifurations
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_MAIN,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_MAIN,
    region: process.env.AWS_REGION_MAIN,
});

module.exports = AWS;
