

// Mongo operations on users collection
export const { getCollection, closeMongo, connectMongo } = require('../mongoDatabase');
export const dotenv = require('dotenv');
dotenv.config();
const collection = process.env.COLLETION_USERS;

// add user
async function addUser(user: any) {

    await connectMongo();

    const db = getCollection(collection);
    try {
        await db.insertOne({ user });
        
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, message: 'Failed to add user', error };
    }
     finally {
        // close the MongoDB connection after use
        await closeMongo();
}
}

async function findUserByEmail(email: any){
    await connectMongo();

    const db = getCollection(collection);

    try {
        const res = await db.findOne({ "user.email" : email });

        if (!res) {
            return { message: 'User not found' };
        }
        
        return res;
    } catch (error) {
        console.error('Error finding user:', error);
        return { message: 'Failed to find user', error };
    } finally {
        await closeMongo();
    }
}

async function checkUserRole(username: any){
    await connectMongo();

    const db = getCollection(collection);

    try {
        const res = await db.findOne({ "user.username" : username });

        if (!res) {
            return { message: 'User not found' };
        }
        return res.user.role;
    } catch (error) {
        console.error('Error finding user:', error);
        return { message: 'Failed to find user', error };
    } finally {
        await closeMongo();
    }
}

async function confirmEmail(email: String){
    await connectMongo();

    const db = getCollection(collection);

    try{
        const res = await db.updateOne(
            {"user.email" : email},
            { $set: {"user.isConfirmed":true}}
        );
        if(res.modifiedCount === 0){
            return { message: 'User not found' };
        }
        else{
            const updatedUser = await db.findOne({ "user.email" : email });
            return updatedUser;
        }
    }catch(error){
        console.error("Error updating a user", error);
        return {error}
    }finally{
        await closeMongo();
    }
}

async function changeUserRole(email:String,role:number){

    await connectMongo();

    const db = getCollection(collection);

    // find user
    try{
        const res = await db.updateOne(
            {"user.email" : email},
            { $set: {"user.role":role}}
        );
        if(res.modifiedCount === 0){
            return { message: 'User not found' };
        }
        // saved a new role
        else{
            const updatedUser = await db.findOne({ "user.email" : email });
            return updatedUser;
        }
    }catch(error){
        console.error("Error updating a user", error);
        return {error}
    }finally{
        await closeMongo();
    }

}

module.exports = {
    addUser,
    changeUserRole,
    findUserByEmail,
    confirmEmail,
    checkUserRole
};