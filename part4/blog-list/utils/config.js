require('dotenv').config()

const PORT = process.env.PORT
const CONNECTION_STRING = process.env.CONNECTION_STRING

module.exports = {
    PORT,
    CONNECTION_STRING
}