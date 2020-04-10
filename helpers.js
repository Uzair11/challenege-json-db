const fs = require('fs')
module.exports = {
  writeFile,
  updateJson,
  getRecord,
  deleteRecord
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
