const router = require('express').Router()

const InstrumentController = require('../controllers/InstrumentController')

//middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post(
    '/create', 
    verifyToken, 
    imageUpload.array('images'),
    InstrumentController.create,
)
router.get('/', InstrumentController.getAll)
router.get('/myinstruments', verifyToken, InstrumentController.getAllUserInstruments)
router.get('/mychanges', verifyToken, InstrumentController.getAllUserChanges)
router.get('/:id', InstrumentController.getInstrumentById)
router.delete('/:id', verifyToken, InstrumentController.removeInstrumentById)
router.patch('/:id', verifyToken, imageUpload.array('images'), InstrumentController.updateInstrument)
router.patch('/schedule/:id', verifyToken, InstrumentController.schedule)
router.patch('/conclude/:id', verifyToken, InstrumentController.concludeChange)
router.patch('/reopen/:id', verifyToken, InstrumentController.reopenExchange)

module.exports = router