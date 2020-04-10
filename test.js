const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

const testCases = require('./testCases')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

testCases.studentRecordUpdation().map((test) => {
  tape('studentData', async function (t) {
    const url = `${endpoint}${test.url}`
    const data = {
      'score': 80
    }
    jsonist.put(url, data, (err, body) => {
      if (err) t.error(err)
      t.ok(200, test.message)
      t.end()
    })
  })
})

testCases.studentRecord().map((test) => {
  tape('getStudentData', async function (t) {
    const url = `${endpoint}${test.url}`
    const data = {
      'score': 80
    }
    jsonist.get(url, data, (err, body) => {
      if (err) t.error(err)
      t.ok(200, test.message)
      t.end()
    })
  })
})

testCases.deleteStudentRecord().map((test) => {
  tape('studentDataDeletion', async function (t) {
    const url = `${endpoint}${test.url}`
    const data = {
      'score': 80
    }
    jsonist.delete(url, data, (err, body) => {
      if (err) t.error(err)
      t.ok(200, test.message)
      t.end()
    })
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
