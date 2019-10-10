const express = require('express')
const chalk = require('chalk')
require('../db/connect')
const Hostel = require('../models/hostel')
const Room = require('../models/room')
const Student = require('../models/student')
const hostelRouter = new express.Router()
const $auth = require('../middleware/authenticate')

hostelRouter.get('/hostels', async (req, res) => {
  try {
    const hostels = await Hostel.find({})
    res.send(hostels)
  } catch (e) {
    res.status(500).send(e)
  }
})

hostelRouter.get('/hostels/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      res.staus(204).send()
    }
    res.send(hostel)
  } catch (e) {
    res.status(500).send(e)
  }
})



hostelRouter.post('/hostels', async (req, res) => {
  try {
    const hostel = new Hostel(req.body)
    await hostel.save()
    res.send('saved')
  } catch (e) {
    res.status(500).send(e)
  }
})

hostelRouter.patch('/hostels/:id', async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "motto"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(404).send({
      "Error": "Invalid Update\(s\)"
    })
  }

  try {
    const hostel = await Hostel.findById(req.params.id)
    updates.forEach((update) => {
      hostel[update] = req.body[update]
    })

    await hostel.save();
    if (!hostel) {
      res.status(404).send();
    }
    res.send(hostel);
  } catch (e) {
    res.status(400).send(e)
  }
})


hostelRouter.post('/:id/room', async (req, res) => {
  try {
    const id = req.params.id;
    const hostel = await Hostel.findById(id)
    if (!hostel) {
      throw new Error('Hostel Does not exist')
    }
    const room = new Room({
      ...req.body,
      hall: hostel._id
    })
    await room.save()
    res.send(room)
  } catch (e) {
    res.status(500).send(e)
  }
})

hostelRouter.get('/:id/rooms', async (req, res) => {
  try {
    if (req.query.occ) {


      if (req.query.occ == 0) {
        const rooms = await Room.find({ hall: req.params.id, occupied: false }, 'number occupied')
        return res.send(rooms)
      }

      const rooms = awaitRoom.find({
        hall: req.params.id,
        occupants: {
          $size: req.query.occ
        }
      })
      return res.send(rooms)
    }

    const hostel = await Room.find({ hall: req.params.id }, 'number occupants occupied')
    res.send(hostel)
  } catch (e) {
    res.status(500).send(e)
  }
})

hostelRouter.post('/register/:roomId', $auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
    let hostel = await Hostel.find({ _id: room.hall })
    hostel = hostel[0]


    if (!room || room.occupied == true || req.student.isAllocated == true || !hostel) throw new Error()
    if (room.occupants.includes(req.student._id)) throw new Error()
    if (room.occupants.length == 4) throw new Error()

    room.occupants = room.occupants.concat([req.student._id])
    req.student.room = room._id
    req.student.isAllocated = true
    hostel.numberOfOccupants++

    await req.student.save()
    await room.save()
    await hostel.save()

    res.send({
      student: req.student,
      room,
      hostel
    });

  } catch (error) {
    res.status(500).send(e);
  }
})


module.exports = hostelRouter
