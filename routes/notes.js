/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require('../middleware/fetchUser');
const Note = require('../models/Note');

//   ROUTE 1: Get All the Notes using: GET "/api/notes/fetchallnotes". login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//   ROUTE 2: Add a new Note using: POST "/api/notes/addnote". login required
router.post('/addnote', fetchuser, [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("decription", "Decription must be atleast 5 characters").isLength({ min: 5 }),], async (req, res) => {
    try {

        const { title, decription, tag } = req.body;
        // if there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, decription, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//   ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, decription, tag } = req.body;
    // Create a newNote object
    const newNote = {};
    if (title) { newNote.title = title }
    if (decription) { newNote.decription = decription }
    if (tag) { newNote.tag = tag }

    // find the note to be updated and update it
    let note = await Note.findById(req.params.id);

    if (!note) { return res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("not Allowed")
    }
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true})
    res.json({note});

})//   ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    // find the note to be updated and update it
    let note = await Note.findById(req.params.id);

    if (!note) { return res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("not Allowed")
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been Deleted", note: note});

})
module.exports = router