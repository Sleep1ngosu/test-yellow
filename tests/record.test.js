const chai = require('chai')
const chaiHttp = require('chai-http')
const auth = require('../middleware/auth')
const app = require('../server')
const baseUrl = 'http://localhost:5000'

chai.should()
chai.use(chaiHttp)

describe('record tests', () => {
	it('create record test', (done) => {
		chai.request(app)
			.post('/api/records/create')
			.end((error, response) => {
				response.should.have.status(400)
				done()
			})
	})

	it('get record test', (done) => {
		const id =
			'e0fcf354df52f23a1cb11d4b248879b8903ff049b5b49556fe1e1502a8edbd8b'
		chai.request(app)
			.get(`/api/records/get_record/${id}`)
			.set(
				'auth',
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjVmZmRjMDAxZDIzYTA0MDVjOGE2ZDlmMiIsImlhdCI6MTYxMDQ2NzQ0MX0.iLHOGtLKiRIkAI1QX_XEsVgQPKDs0s_XbJqBHs0HGLk'
			)
			.end((error, response) => {
				response.should.have.status(200)
				done()
			})
	})

	it('get all records test', (done) => {
		chai.request(app)
			.get(`/api/records/get_all_records`)
			.set(
				'auth',
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjVmZmRjMDAxZDIzYTA0MDVjOGE2ZDlmMiIsImlhdCI6MTYxMDQ2NzQ0MX0.iLHOGtLKiRIkAI1QX_XEsVgQPKDs0s_XbJqBHs0HGLk'
			)
			.end((error, response) => {
				response.should.have.status(200)
				done()
			})
	})

	it('get report test', (done) => {
		const body = {
			startDate: '2021/1/10',
			endDate: '2021/1/14',
		}

		chai.request(app)
			.post(`/api/records/get_report`)
			.set(
				'auth',
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjVmZmRjMDAxZDIzYTA0MDVjOGE2ZDlmMiIsImlhdCI6MTYxMDQ2NzQ0MX0.iLHOGtLKiRIkAI1QX_XEsVgQPKDs0s_XbJqBHs0HGLk'
			)
			.send(body)
			.end((error, response) => {
				response.should.have.status(200)
				response.body.should.have
					.property('totalDistance')
					.eq('30000 meters')
				response.body.should.have.property('avgSpeed').eq('7.02 km/h')
				response.body.should.have.property('avgTime').eq('01:25:25')
				done()
			})
	})

	// it('delete record test', (done) => {
	// 	const id =
	// 		'f2a67446e2c5c7947f43c706dc40971c29e3fa86e5da3b58dfaaa91a7eb9f561'
	// 	chai.request(app)
	// 		.post(`/api/records/delete/${id}`)
	// 		.end((error, response) => {
	// 			response.should.have.status(200)
	// 			done()
	// 		})
	// })

	// it('delete all records record test', (done) => {
	// 	chai.request(app)
	// 		.delete('/api/records/delete_all_records')
	// 		.set(
	// 			'auth',
	// 			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjVmZmRjMDAxZDIzYTA0MDVjOGE2ZDlmMiIsImlhdCI6MTYxMDQ2NzQ0MX0.iLHOGtLKiRIkAI1QX_XEsVgQPKDs0s_XbJqBHs0HGLk'
	// 		)
	// 		.end((error, response) => {
	// 			response.should.have.status(200)
	// 			done()
	// 		})
	// })
})
