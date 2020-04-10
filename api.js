const fs = require('fs')
module.exports = {
  getHealth,
  updateRecord,
  getStudentRecord,
  deleteStudentRecord
}

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
        studentRecord = updateJson(studentRecord, properties, value)
        writeFile(file, studentRecord)
        return res.json({ success: true })
      })
    } else {
      if (properties.length === 0) {
        studentRecord = req.body
      } else {
        properties.reduce((prev, curr) => (
          prev[curr] = {}
        ), studentRecord)
        studentRecord = updateJson(studentRecord, properties, value)
      }
      writeFile(file, studentRecord)
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
          studentRecord = getRecord(studentRecord, properties)
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
          writeFile(file, {})
          return res.status(200).json({ status: true })
        } else {
          let studentRecord = deleteRecord(student, properties)
          if (!studentRecord) {
            return res.status(404).json({ error: 'record not found' })
          }
          writeFile(file, studentRecord)
          return res.status(200).json({ studentRecord })
        }
      }
    })
  } else {
    return res.status(404).json({ error: 'file not found' })
  }
}

function writeFile (file, obj) {
  fs.writeFile(file, JSON.stringify(obj), function (err) {
    if (err) throw err
  })
}

function updateJson (studentRecord, properties, value) {
  const studentRecordCopy = studentRecord
  if (properties.length === 0) {
    studentRecord = mergeObjects(studentRecord, value)
    return studentRecord
  }
  for (let i = 0; i < properties.length; i++) {
    if (studentRecord.hasOwnProperty(properties[i])) {
      studentRecord = studentRecord[properties[i]]
      if (i === properties.length - 1) {
        studentRecord = mergeObjects(studentRecord, value)
        return studentRecordCopy
      }
    } else {
      for (i; i < properties.length; i++) {
        studentRecord[properties[i]] = {}
        studentRecord = studentRecord[properties[i]]
      }
      studentRecord = mergeObjects(studentRecord, value)
      return studentRecordCopy
    }
  }
}

function mergeObjects (obj1, obj2) {
  for (const attrname in obj2) { obj1[attrname] = obj2[attrname] }
  return obj1
}

function getRecord (studentRecord, properties) {
  for (let i = 0; i < properties.length; i++) {
    if (studentRecord.hasOwnProperty(properties[i])) {
      if (i === properties.length - 1) {
        return studentRecord || {}
      } else {
        studentRecord = studentRecord[properties[i]]
      }
    } else {
      return false
    }
  }
}

function deleteRecord (studentRecord, properties) {
  const studentRecordCopy = studentRecord
  for (let i = 0; i < properties.length; i++) {
    if (studentRecord.hasOwnProperty(properties[i])) {
      if (i === properties.length - 1) {
        delete studentRecord[properties[i]]
        return studentRecordCopy
      } else {
        studentRecord = studentRecord[properties[i]]
      }
    } else {
      return false
    }
  }
}
