const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jsonwebtoken = require('jsonwebtoken')
const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  indexNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId
  },
  isAllocated: {
    type: Boolean,
    default: !!this.room
  },
  password: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
      if (value.length < 8) throw new Error("Password must be 8 characters or more")
    }
  }, phone: {
    type: String,
    trim: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) throw new Error('Enter a valid phone Number')
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

studentSchema.pre('save', async function (next) {
  const student = this;
  if (student.isModified('room')) {
    student.isAllocated = student.room ? true : false;
  }
  if (student.isModified('password')) {
    student.password = await bcrypt.hash(student.password, 8)
  }
  next()
})


studentSchema.statics.findByCredentials = async (passedIndex, passedPassword) => {
  let student = await Student.findOne({
    indexNumber: passedIndex
  })

  if (!student) {
    throw new Error('Unable to Authenticate')
  }

  const verified = await bcrypt.compare(passedPassword, student.password)
  console.log(verified)

  console.log(`Verification for ${student.firstName} is ${verified}`)

  if (!verified) {
    throw new Error('Unable to Authenticate')
  }

  return student
}


studentSchema.methods.generateAuthToken = async function () {
  const student = this
  const token = jsonwebtoken.sign({
    _id: student._id.toString()
  }, 'itsdone007@@'
  )

  student.tokens = student.tokens.concat({
    token
  })

  await student.save()
  return token
}

const Student = new mongoose.model('Student', studentSchema)
module.exports = Student
