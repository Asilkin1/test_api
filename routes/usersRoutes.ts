

export const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// Import email sending functionality
export const { sendConfirmationEmail } = require('../email/sendEmail');

// Permissions
export const {verifyUserIsAuthenticated, isAdmin} = require('../permissions/permissionRequired');
const router = express.Router();

// JWT auth
export const jwt = require('jsonwebtoken');
export const { addUser,confirmEmail} = require('../mongo/CRUD/usersCRUD');

// [X] User Registration
router.post('/users/register',(/** @type {{ body: { username: any; password: any; email: any; }; }} */ req: { body: { username: any; password: any; email: any; }; }, /** @type {{ json: (arg0: { username: any; password: any; email: any; role: number; isConfirmed: boolean; }) => void; }} */ res: { json: (arg0: { username: any; password: any; email: any; role: number; isConfirmed: boolean; }) => void; }) => {

    // payload 
    const {username, password, email} = req.body;
    
    // Additional field to save in the database
    const role = 0x1;
    const isConfirmed = false;

    // create user
    const newUser = {username, password, email, role,isConfirmed};

    try{
        addUser(newUser);

        // create token
        const token = jwt.sign(
        {   email:email,
            username: username,
            password:password},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
        );
        
        sendConfirmationEmail(email,token)
    }catch(error){
        console.log("Cannot register", error);
    }

    // API response
    res.json(newUser);
});

// [x] EMAIL confirmation
router.get('/users/confirm/:token',(req: { params: { token: any; }; },res: { json: (arg0: any) => void; }) =>{
    
    // token from email
    const tokenReceived = req.params.token;
    const email = jwt.verify(tokenReceived,process.env.JWT_SECRET);

    const userConfirmed = confirmEmail(email.email);
    
    userConfirmed.then((user: any,err: any)=>{
        if(!err) console.log(user);
    }).catch((err: any) => { console.log(err)});
    res.json(email);
});

// [X] User auth 
router.post('/users/login', (req: { body: { username: any; password: any; }; },res: { json: (arg0: { authToken: any; }) => void; })=>{
    
    // payload
    const {username, password } = req.body;
    const user = {username, password};

    const authToken = jwt.sign(user, process.env.JWT_SECRET);
    res.json({authToken});
});

// [X] Auth required check if authenticated
router.get('/users/me',verifyUserIsAuthenticated,isAdmin, (req: { user: any; },res: { json:any })=>{
    res.json(req.user);
});

// [X] Auth required and Admin change user role (no db operations)
router.put('/users/:id/role',verifyUserIsAuthenticated,isAdmin,(req: { params: { id: string | number; }; body: { username: any; email: any; password: any; }; },res: { json: (arg0: { username: any; password: any; email: any; role: any; }) => void; }) => {
    
    const ROLES = {
        ADMIN: 1 << 0,           
        USER: 1 << 1,
    };

    const roleAssigned = req.params.id;
    console.log(typeof(ROLES.ADMIN))

    let newRole = req.params.id;
    
    let r = ROLES.ADMIN && newRole;
    const {username, email, password} = req.body;

    const updatedUser = {username,password,email,role:r};

    res.json(updatedUser);
    
});

module.exports = router;