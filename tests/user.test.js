const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')

chai.should()
chai.use(chaiHttp)

describe('user tests', () => {
	// it('sign up test', (done) => {
	// 	const body = {
	// 		username: 'admin',
	// 		password: 'admin',
	// 		email: 'admin@mail.ru',
	// 	}
	// 	chai.request(app)
	// 		.post('/api/sign_up')
	// 		.send(body)
	// 		.end((err, response) => {
	// 			response.should.have.status(200)
	// 			done()
	// 		})
	// })

	it('sign in test', (done) => {
		const body = {
			username: 'test',
			password: 'test',
		}
		chai.request(app)
			.post('/api/sign_in')
			.send(body)
			.end((err, response) => {
				response.should.have.status(200)
				done()
			})
	})
})
