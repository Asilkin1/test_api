// CRUD.js
export const { getCollection, closeMongo, connectMongo } = require('../mongoDatabase');

async function addBook(book: any) {

    await connectMongo();

    const db = getCollection('books');
    try {
        const result = await db.insertOne({ book });
        return { result};
    } catch (error) {
        console.error('Error adding book:', error);
        return { success: false, message: 'Failed to add book', error };
    }
     finally {
        // close the MongoDB connection after use
        await closeMongo();
}
}

async function readBooks() {

    await connectMongo();

    const db = getCollection('books');
    try {
        const books = await db.find({}).toArray();
        return books;
    } catch (error) {
        console.error('Error reading books:', error);
        return { e: 'Failed to read books' };
    }
    finally {
        // close the MongoDB connection after use
        await closeMongo();
}
}

async function getBookById(id: any){
    await connectMongo();

    const db = getCollection('books');
    const { ObjectId} = require('mongodb');

    try{
        const result = await db.findOne(
            {_id: new ObjectId(id)}
        );
        if(!result){
            return {message: "Book not found"};
        }
        return result 
    } catch(error ){
        console.error('Error finding a book', error);
    }
};

async function updateBook(id: any, newBook: any) {
    
    await connectMongo();

    const db = getCollection('books');
    const { ObjectId } = require('mongodb');

    // find book
    try {
        let result = await db.updateOne(
            { _id: new ObjectId(id) },
            { $set: {book: newBook} }

        );
        if(result.modifiedCount === 0){
            return { message: 'Book not found' };
        }
        else{
            const updatedBook = await db.findOne({ _id: new ObjectId(id) });
            return updatedBook;
        }
        

    } catch (error) {
        console.error('Error updating book:', error);
        return { message: 'Failed to update a book', error };
    }
    finally {
        // close the MongoDB connection after use
        await closeMongo();
}
}

async function deleteBook(id: any) {

    await connectMongo();

    const db = getCollection('books');
    const { ObjectId } = require('mongodb');
    try {
        const result = await db.deleteOne({ _id: new ObjectId(id) });
        console.log("How many delleted",result.deletedCount);
         if (result.deletedCount === 0) {
             return { message: 'Book not found' };
         }
        return { message: 'Book deleted successfully' };
    } catch (error) {
        console.error('Error deleting book:', error);
        return {  message: 'Failed to delete book', error };
    }
    
    finally {
    // close the MongoDB connection after use
    await closeMongo();
}
}

module.exports = {
    addBook,
    readBooks,
    updateBook,
    deleteBook,
    getBookById,
};
