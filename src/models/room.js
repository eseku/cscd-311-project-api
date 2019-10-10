const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
   number: {
     type: String,
     required: true,
     trim: true,
     unique: true
   },
   hall:{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Hostel',
     required: true
   },
   occupants:[
     mongoose.Schema.Types.ObjectId
   ],
   occupied: {
     type: Boolean,
     default: false
   }
},{
  timestamps : true
})


roomSchema.pre('save', function(next){
  const room = this;
  if (room.isModified('occupants')) {
    if (room.occupants.length == 4) {
      room.occupied = true;
    } else {
      room.occupied = false;
    }
  }
  next()
})


const Room = new mongoose.model('Room', roomSchema)
module.exports = Room
