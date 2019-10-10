const express = require('express')
const studentRouter = new express.Router()
const Student = require('../models/student')
const $idgen = require('../algorithms/random-id-generator')
const $auth = require('../middleware/authenticate')


studentRouter.post('/students', async (req, res) => {
  try {
    const student = new Student({
      ...req.body,
      indexNumber: $idgen()
    })
    await student.save()
    const token = await student.generateAuthToken()
    res.status(201).send({
      student,
      token
    })

  } catch (e) {
    res.send({ error: e })
  }
})

studentRouter.post('/students/login', async (req, res) => {
  try {
    const student = await Student.findByCredentials(req.body.indexNumber, req.body.password)
    const token = await student.generateAuthToken()
    res.send({
      token,
      student
    })

  } catch (error) {
    res.send({ "error": error })
  }
})


studentRouter.get('/students/me', $auth, async (req, res) => {
  try {
    await res.send(req.student)
  } catch (error) {
    res.send(error)
  }
})


studentRouter.get('/students/', async (req, res) => {
  Student.find({}).then((stud) => {
    res.send(stud)
  }).catch((e) => {
    res.status(200).send(e)
  })
})

studentRouter.post('/logout', $auth, async (req, res) => {
  try {
    req.student.tokens = req.student.tokens.filter((token) => token.token != req.token)
    await req.student.save()
    res.send()
  } catch (e) {
    res.status(500).send(e)
  }
})

studentRouter.post('/exit', $auth, async (req, res) => {
  try {
    req.student.tokens = []
    await req.student.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})


module.exports = studentRouter;
