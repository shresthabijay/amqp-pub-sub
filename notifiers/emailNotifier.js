const Twig = require("twig");
const AWS = require('../aws');

// important constants for company information
const defaultCompanyConstants = require('../constants');

// promisify callback renderFile fn from twig
const renderFileAsync = (filepath, config) =>
    new Promise((resolve, reject) => {
        Twig.renderFile(filepath, config, (err, html) => {
            if (err) reject(err);
            else resolve(html);
        });
    });

const SENDER_EMAIL_ADDRESS = process.env.SENDER_EMAIL ;

// object that gives path to templates and config objects for different type of emails
const emailTypesConfig = {
    "welcome": {
        templateFileName: 'welcome.twig',
        config: ({ firstName, confirmUrl }) => ({ firstName, confirmUrl, ...defaultCompanyConstants }), // just to see the destructured properties clearly and pass default configs
    }
}
exports.sendEmail = async ({ to, subject, template, data }) => {

    const emailConfig = emailTypesConfig[template];
    if (!emailConfig) throw `(${template}) is not a valid email template`;

    const { templateFileName, config } = emailConfig;

    const templatePath = "templates/" + templateFileName;

    const html = await renderFileAsync(templatePath, config(data));

    const params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: html,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: SENDER_EMAIL_ADDRESS,
    };

    return new AWS.SES({ apiVersion: "2010-12-01" })
        .sendEmail(params)
        .promise();
};
