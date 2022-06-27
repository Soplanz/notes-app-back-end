/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable indent */

const notes = require('./notes');
const {nanoid} = require('nanoid');


const addNoteHandler = (request, h) => {
    const {title, tags, body} = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {title, tags, body, id, createdAt, updatedAt};

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === newNote.id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });

        response.code = 201;
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });

    response.code = 500;
    return response;
};


const getAllNotesHandler = (request, h) => {
    const response = h.response({
        status: 'success',
        data: {
            'notes': notes,
        },
    });
    response.code = 200;
    return response;
};


const getNotesByIdHandler = (request, h) => {
    const {id} = request.params;
    const targetNote = notes.filter((note) => note.id === id)[0];
    if (targetNote !== 'undefined') {
        const response = h.response({
            status: 'success',
            data: {
                'note': targetNote,
            },
        });
        response.code = 200;
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code = 404;
    return response;
};


const editNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    const {title, tags, body} = request.payload;
    const updatedAt = new Date().toISOString();

    const idx = notes.findIndex((note) => note.id === id);

    if (idx !== -1) {
        notes[idx] = {
            ...notes[idx],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbaharui',
        });

        response.code = 200;
        return response;
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan',
    }).code(404);
};


const deleteNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const idx = notes.findIndex((note) => note.id === id);

    if (idx !== -1) {
        notes.splice(idx, 1);

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        }).code(200);

        return response;
    }

    return h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id catatan tidak ditemukan',
    }).code(404);
};

module.exports = {addNoteHandler, getAllNotesHandler, getNotesByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler};
