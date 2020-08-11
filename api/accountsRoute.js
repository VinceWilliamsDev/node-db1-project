const router = require('express').Router()

const db = require('../data/dbConfig')

/////////////////////////////// Middleware ///////////////////////////////////

const validateId = (req, res, next) => {
    db('accounts')
        .where({id: req.params.id})
        .then(account => {
            if (account.length === 1) {
                next()
            } else {
                res.status(404).json({error: 'account not found'})
            }
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
}

const validateData = (req, res, next) => {
    if (!req.body) return res.status(400).json({error: 'missing data'})
    if (!req.body.name || !req.body.budget) {
        return res.status(400).json({error: 'missing one or more required fields'})
    }
    next()
}

/////////////////////////////// Endpoints ///////////////////////////////////

router.get('/', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.json(accounts)
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

router.get('/:id', validateId, (req, res) => {
    db('accounts')
        .where('id', req.params.id)
        .then(account => {
            res.json(account)
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

router.post('/', validateData, (req, res) => {
    db('accounts')
        .insert(req.body)
        .returning('id')
        .then(ids => {
            res.json({ id: `Successfully created account ${ids}`})
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

router.put('/:id', validateId, validateData, (req, res) => {
    db('accounts')
        .where({id: req.params.id})
        .update(req.body)
        .then(count => {
            if (count) {
                res.json({message: 'successfully updated'})
            } else {
                res.status(404).json({error: 'id not found'})
            }
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

router.delete('/:id', validateId, (req, res) => {
    db('accounts')
        .where({id: req.params.id})
        .del()
        .then(count => {
            if (count) {
                res.json({message: 'Record successfully deleted'})
            } else {
                res.status(404).json({error: 'id not found'})
            }
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})



module.exports = router