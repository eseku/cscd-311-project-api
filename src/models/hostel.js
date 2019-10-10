const mongoose = require('mongoose')
const Room = require('./room')


const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  motto: {
    type: String,
    trim: true
  },
  sex: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
      if (value != 'M' && value != 'F' && value != 'M/F') throw new Error('Invalid Type')
    }
  },
  numberOfOccupants: {
    type: Number
  }
}, {
  timestamps: true
})


hostelSchema.pre('save', async function (next) {
  const hostel = this;
  const rooms = await Room.find({ hall: this.id })
  let number = new Number;

  rooms.forEach((room) => {
    number += room.occupants.length
  })

  this.numberOfOccupants = number

  next()
})


hostelSchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'hostel'
})

const Hostel = new mongoose.model('Hostel', hostelSchema)
module.exports = Hostel
