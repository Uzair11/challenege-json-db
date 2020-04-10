const fs = require('fs')
module.exports = {
  getHealth,
  updateRecord,
  getStudentRecord,
  deleteStudentRecord
}

const recordHelpers = require('./helpers')

const directory = './public'

async function getHealth (req, res, next) {
  res.json({ success: true })
}

async function updateRecord (req, res, next) {
  const properties = req.params[0].split('/')
  properties.shift()
  const file = `public/${req.params.studentId}.json`
  const value = { ...req.body }
  let studentRecord = {}
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory)
    }
    if (fs.existsSync(file)) {
      fs.readFile(file, 'utf8', function (err, contents) {
        if (err) throw err
        studentRecord = contents ? JSON.parse(contents) : {}
        studentRecord = recordHelpers.updateJson(studentRecord, properties, value)
        recordHelpers.writeFile(file, studentRecord)
        return res.json({ success: true })
      })
    } else {
      if (properties.length === 0) {
        studentRecord = req.body
      } else {
        properties.reduce((prev, curr) => (
          prev[curr] = {}
        ), studentRecord)
        studentRecord = recordHelpers.updateJson(studentRecord, properties, value)
      }
      recordHelpers.writeFile(file, studentRecord)
      return res.json({ success: true })
    }
  } catch (err) {
    return res.status(404).json({ success: false })
  }
}

async function getStudentRecord (req, res, next) {
  const properties = req.params[0].split('/')
  properties.shift()
  let studentRecord = {}
  const file = `public/${req.params.studentId}.json`
  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf8', function (err, contents) {
      if (err) {
        throw err
      }
      if (!err) {
        studentRecord = JSON.parse(contents) || {}
        if (properties.length === 0) {
          return res.json({ studentRecord })
        } else {
          studentRecord = recordHelpers.getRecord(studentRecord, properties)
          if (studentRecord) {
            return res.json({ studentRecord })
          } else {
            return res.status(404).json({ error: 'record not found' })
          }
        }
      }
    })
  } else {
    return res.status(404).json({ error: 'file not found' })
  }
}

async function deleteStudentRecord (req, res, next) {
  const properties = req.params[0].split('/')
  properties.shift()
  let student = {}
  const file = `public/${req.params.studentId}.json`
  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf8', function (err, contents) {
      if (err) throw err
      if (!err) {
        student = contents ? JSON.parse(contents) : {}
        if (properties.length === 0) {
          recordHelpers.writeFile(file, {})
          return res.status(200).json({ status: true })
        } else {
          let studentRecord = recordHelpers.deleteRecord(student, properties)
          if (!studentRecord) {
            return res.status(404).json({ error: 'record not found' })
          }
          recordHelpers.writeFile(file, studentRecord)
          return res.status(200).json({ studentRecord })
        }
      }
    })
  } else {
    return res.status(404).json({ error: 'file not found' })
  }
}
