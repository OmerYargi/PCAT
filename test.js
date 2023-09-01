const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// *****************************************************************************************
// connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
    useNewURLParser: true,
    useUnifiedTopology: true,
});

// *****************************************************************************************
// create Schema
const PhotoSchema = new Schema({
    title: String,
    description: String,
});

// *****************************************************************************************
// Create New Model
const Photo = mongoose.model('Photo', PhotoSchema);

// *****************************************************************************************
// Create a Photo Data
// Photo.create({
//   title: 'Photo Title 2',
//   description: 'Photo description 2 lorem ipsum',
// });

// *****************************************************************************************
// read a photo data
// Photo.find({}).then(data => console.log(data)).finally(() => mongoose.connection.close());

// *****************************************************************************************
// update photo
// const id = '64f06bd8625989bec1212d6c';
// Photo.findByIdAndUpdate(
//     id,
//     {
//         title: 'Photo Title 1 Updated',
//         description: 'Photo description 1 updated',
//     },
//     {
//         // Alt tarafta log ile yazılacak datanın yenilenmesi için bunu yaptık.
//         new: true,
//     }
// )
//     .then((data) => console.log(data))
//     .finally(() => mongoose.connection.close());

// *****************************************************************************************
// Delete Photo Data
// const id = '64f06bd8625989bec1212d6c';
// Photo.findByIdAndDelete(id)
//     .then((data) => console.log(data))
//     .finally(() => mongoose.connection.close());
