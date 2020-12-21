const nodemailer = require(`nodemailer`);
const { config: mailerConfig } = require(`../../config/mailer.config`);

const transporter = nodemailer.createTransport(mailerConfig);

let host;
process.env.NODE_ENV === `dev`
	? (host = process.env.DEV_HOST)
	: (host = process.env.PROD_HOST);

// TODO: Добавить логирование
// TODO: Возможно стоит возвращать промис и покрыть тестом, чтобы в accepted был email
function sendConfirmation(email, jwt) {
	const mailOptions = {
		from: `<${mailerConfig.auth.user}>`,
		to: email,
		subject: `Email confirmation`,
		html: `<p>To confirm your email plese follow the link:</br><a href=${host}/confirmation/${
			process.env.NODE_ENV === `test` ? `${'test' + Date.now()}` : jwt
		}>confirm</a></p>`,
	};

	// eslint-disable-next-line no-unused-expressions
	process.env.NODE_ENV === `dev`
		? console.log(`${host}/confirmation/${jwt}`)
		: ``;

	return transporter.sendMail(mailOptions, (err, info) => {
		if (err) return console.error(err);
		return console.info(info);
	});
}

module.exports = sendConfirmation;
