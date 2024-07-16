const jwt = require('jsonwebtoken');
const { checkUserRole} = require('../mongo/CRUD/usersCRUD');

function verifyUserIsAuthenticated(req: { headers: { [x: string]: any; }; user: any; },res: { sendStatus: (arg0: number) => any; },next: () => void){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) =>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });

    console.log("User is authorized");
}

// working version if role is send in req body
// 
function isAdmin(req: { body: { role: number; }; role: number; },res: { json: (arg0: string) => void; },next: () => void){
    const admin = 1;
        console.log(req.body.role);
        console.log(req.role == admin);
        if(req.body.role != admin){
            res.json("Not admin");
        }
        next(); 
}
// database version
// function isAdmin(req: { user: { username: any; }; },res: { send: (arg0: string) => void; },next: () => void){
//     const admin = 1;

//     checkUserRole(req.user.username).then(function (role: number, err: any) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(role == admin);
//             if (role != admin) {
//                 res.send("Not admin");
//             }
//         }
//         next();
//     }); 
       
// }

module.exports = {
    verifyUserIsAuthenticated,
    isAdmin
};