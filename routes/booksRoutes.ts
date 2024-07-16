export const express = require('express');

const router = express.Router();
const {readBooks, updateBook, addBook, deleteBook,getBookById} = require('../mongo/CRUD/booksCRUD');
const {verifyUserIsAuthenticated, isAdmin} = require('../permissions/permissionRequired');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ BOOK routes
// protected (role:admin, authenticated)
router.post('/books',verifyUserIsAuthenticated,isAdmin,(req: { body: { title: any; author: any; publicationDate: any; genres: any; }; }, res: { send: (arg0: any) => void; }) => {
    const {title, author, publicationDate, genres} = req.body;
    const newBook = {title, author, publicationDate, genres};
    
    addBook(newBook).then((res: any, err: any) =>{
        if(!err) console.log(res);
    }).catch((err: any) => {
        console.log(err);
    });

    // API response
    res.send(req.body);
});

// [X] Auth required and Admin
router.put('/books/:id',verifyUserIsAuthenticated,isAdmin,(req: { params: { id: any; }; body: any; },res: { json: (arg0: any) => void; })=>{
    const { id } = req.params;
    const newBook = req.body;

    updateBook(id,newBook).then((data: any,err: any)=>{
        if(!err) console.log(data);
        res.json(data);
    });
});
// [X] Auth required and Admin
router.delete('/books/:id',verifyUserIsAuthenticated,isAdmin,(req: { params: { id: any; }; },res: { send: (arg0: any) => void; })=>{
    deleteBook(req.params.id).then((ok: any,err: any) =>{
        if(!err) res.send(ok);
    }).catch((err: any) => {console.log(err)});
});

// [X] DONE
router.get('/books',(_: any,res: { send: (arg0: any) => void; }) => {
    readBooks().then((response: any,err: any)=>{
        if(!err) res.send(response);
        console.log(response);
    }).catch((err: any) => {console.log(err)});
});

// [X] DONE
router.get('/books/:id', (req: { params: { id: any; }; }, res: { send: (arg0: any) => void; }) =>{
    getBookById(req.params.id).then((data: any,err: any) => {
        if(!err) res.send(data);
        console.log(data);
    }).catch((err: any) => {console.log(err)});
});

module.exports = router;