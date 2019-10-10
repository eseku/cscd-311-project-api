const jsonwebtoken = require('jsonwebtoken')
const Student = require('../models/student')


const auth = async (req, res, next) => {
    try {
        const token = (req.header('Authorization').replace('Bearer', '')).trim()

        const decoded = jsonwebtoken.verify(token, 'itsdone007@@')


        const student = await Student.findOne({
            _id: decoded._id,
            'tokens.token': token
        })


        if (!student) {
            throw new Error()
        }



        req.student = student
        req.token = token




        next()

    } catch (error) {
        res.status(401).send({
            "Error": "Authentication Error"
        })
    }
}


module.exports = auth