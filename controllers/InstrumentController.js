const Instrument = require("../models/Instrument")

// helpers
const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")
const ObjetcId = require('mongoose').Types.ObjectId

module.exports = class InstrumentController {

    // create a instrument
    static async create(req, res) {
        const  { name, usageTime, color, description } = req.body

        const images = req.files

        const available = true

        // images upload

        // validation
        if(!name) { 
            res.status(422).json({ message: "O nome do instrumento é obrigatório." })
            return
        }

        if(!usageTime) { 
            res.status(422).json({ message: "O tempo de uso do instrumento é obrigatório." })
            return
        }

        if(!color) { 
            res.status(422).json({ message: "A cor do instrumento é obrigatória." })
            return
        }

        if(!description) { 
            res.status(422).json({ message: "A descrição é obrigatório." })
            return
        }

        if (images.length === 0) {
            res.status(422).json({ message: "A imagem do instrumento é obrigatório." })
        }

        // get instrument owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a instrument
        const instrument = new Instrument({
            name,
            usageTime,
            color,
            description,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) => {
            instrument.images.push(image.filename)
        })

        try {
        
            const newInstrument = await instrument.save()
            res.status(201).json({
                message: "Instrumento cadastrado com sucesso!",
                newInstrument,
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAll(req, res) {
        const instruments = await Instrument.find().sort('-createdAt')

        res.status(200).json({
            instruments: instruments,
        })
    }

    static async getAllUserInstruments(req, res) {
        // get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const instruments = await Instrument.find({'user._id': user._id}).sort('-createdAt')
    
        res.status(200).json({
            instruments,
        })
    }

    static async getAllUserChanges(req, res) {
        // get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const instruments = await Instrument.find({'changer._id': user._id}).sort('-createdAt')
    
        res.status(200).json({
            instruments,
        })
    }

    static async getInstrumentById(req, res) {
        const id = req.params.id

        if (!ObjetcId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" })
            return
        }

        // check if instrument exists
        const instrument = await Instrument.findOne({_id: id})

        if(!instrument) {
            res.status(404).json({ message: 'Instrumento não encontrado.' })
        }

        res.status(200).json({
            instrument: instrument,
        })
    }
    
    static async removeInstrumentById(req, res) {
        const id = req.params.id

        // check is id is valid
        if (!ObjetcId.isValid(id)) {
            res.status(422).json({ message: "ID inválido!" })
            return
        }

        // check if instrument exists
        const instrument = await Instrument.findOne({_id: id})

        if(!instrument) {
            res.status(404).json({ message: 'Instrumento não encontrado.' })
            return
        }

        // check if logged in user registered the instrument
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (instrument.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        await Instrument.findByIdAndRemove(id)

        res.status(200).json({ message: "Instrumento removido com sucesso!" })
    }

    static async updateInstrument(req, res) {
        const id = req.params.id

        const  { name, usageTime, color, description, available } = req.body

        const images = req.files

        const updatedData = {}

        // check if instrument exists
        const instrument = await Instrument.findOne({_id: id})

        if(!instrument) {
            res.status(404).json({ message: 'Instrumento não encontrado.' })
            return
        }

        // check if logged in user registered the instrument
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (instrument.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        } else {
            updatedData.name = name
        }
        
        // validation
        if(!name) { 
            res.status(422).json({ message: "O nome do instrumento é obrigatório." })
            return
        } else {
            updatedData.name = name
        }

        if(!usageTime) { 
            res.status(422).json({ message: "O tempo de uso do instrumento é obrigatório." })
            return
        } else {
            updatedData.usageTime = usageTime
        }

        if(!color) { 
            res.status(422).json({ message: "A cor do instrumento é obrigatória." })
            return
        } else {
            updatedData.color = color
        }

        if(!description) { 
            res.status(422).json({ message: "A descrição é obrigatório." })
            return
        } else {
            updatedData.description = description
        }

        if (images.length > 0) {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }

        await Instrument.findByIdAndUpdate(id, updatedData)

        res.status(200).json({ message: "Instrumento atualizado com sucesso!" })
    }

    static async schedule(req, res){

    const id = req.params.id

    // check if instrument exists
    const instrument = await Instrument.findOne({_id: id})

    if(!instrument) {
        res.status(404).json({ message: 'Instrumento não encontrado.' })
        return
    }

    //check if user registered the instrument
    const token = getToken(req)
    const user = await getUserByToken(token)

        if (instrument.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Você não pode adicionar seu próprio instrumento a lista de "Minhas trocas".' })
            return
    }

    //check if user has already scheduled a visit
    if (instrument.changer) {
        if (instrument.changer._id.equals(user._id)) {
            res.status(422).json({ message: 'Você já adicionou esse instrumento a sua lista de "Minhas trocas"' })
            return
        }
    }

    // add user to instrument
    instrument.changer = {
        _id:user._id,
        name: user.name,
        image: user.image
    }

    await Instrument.findByIdAndUpdate(id, instrument)

    res.status(200).json({
        message: `O instrumento foi adicionado a sua lista de "Minhas trocas".`
    })
 }

 static async concludeChange(req, res) {
    const id = req.params.id

    // check if instrument exists
    const instrument = await Instrument.findOne({_id: id})

    if(!instrument) {
        res.status(404).json({ message: 'Instrumento não encontrado.' })
        return
    }

    // check if logged in user registered the instrument
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (instrument.user._id.toString() !== user._id.toString()) {
        res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
        return
    }

    instrument.available = false

    await Instrument.findByIdAndUpdate(id, instrument)

    res.status(200).json({
        message: "Você concluiu a troca do instrumento!"
    })
 }

 static async reopenExchange(req, res) {
    const id = req.params.id

    // check if instrument exists
    const instrument = await Instrument.findOne({_id: id})

    if(!instrument) {
        res.status(404).json({ message: 'Instrumento não encontrado.' })
        return
    }

    // check if logged in user registered the instrument
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (instrument.user._id.toString() !== user._id.toString()) {
        res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
        return
    }

    if (instrument.available == true) {
        res.status(422).json({ message: "Instrumento já está disponível para a troca!" })
        console.log(instrument.available)
        return

    }

    instrument.available = true

    await Instrument.findByIdAndUpdate(id, instrument)

    res.status(200).json({
        message: "O instrumento foi definido como disponível para troca!"
    })
 }
}