module.exports = {
  studentRecordUpdation,
  studentRecord,
  deleteStudentRecord
}

function studentRecordUpdation () {
  return [
    {
      url: '/rn1abu8',
      message: 'successful student file creation'
    },
    {
      url: '/rn1abu8/courses/calculus/quizzes',
      message: 'pass test 2'
    },
    {
      url: '/rn1abu8/courses/math/quizzes',
      message: 'pass test 2'
    }
  ]
}

function studentRecord () {
  return [
    {
      url: '/rn1abu8/courses/calculus/quizzes/ye0ab6',
      message: 'pass test 1'
    },
    {
      url: '/rn1abu8/courses/newCourse/quizzes/ye0ab6',
      message: 'pass test 1'
    },
    {
      url: '/rn1abu8',
      message: 'pass test 1'
    }
  ]
}

function deleteStudentRecord () {
  return [
    {
      url: '/rn1abu8/courses/newCourse',
      message: 'pass test 1'
    },
    {
      url: '/rn1abu8',
      message: 'pass test 1'
    }
  ]
}
