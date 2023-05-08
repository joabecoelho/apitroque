const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb+srv://dev:x8BLpeDixVVAEwsP@cluster0.v8b7y63.mongodb.net/troqueetoque')
    console.log('Conectou ao Mongoose!')
}

main().catch((err) => console.log(err))

module.exports = mongoose