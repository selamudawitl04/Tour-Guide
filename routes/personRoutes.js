const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });
const personController = require('../controllers/personController')
const path = require('path')

const multer = require('multer');



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  fileFilter: (req, file, cb)=>{
    console.log(file)
  }
}).single('file');

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // 1MB file size limit
//   fileFilter: function(req, file, cb) {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     // console.log('Selamu Dawit Selemon')
//     console.log(file)

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only images allowed'))
//     }
//   }
// }).single('file');

router
  .route('/')
  .get(personController.getAllPersons)
  // .post(async (req, res) => {
  //   upload(req, res, (err) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).json({ status: 'error', message: 'File upload failed' });
  //     }
      
  //     // If the file was uploaded successfully, process the request body
  //     const name = req.body.name;
  //     const email = req.body.email;
  
  //     // Do something with the name and email
  //     console.log('Name:', name);
  //     console.log('Email:', email);
  
  //     res.status(200).json({ status: 'success', message: 'File uploaded and data processed' });
  //   });
  // });
  .post(
    // upload.single('file'),
    personController.createPerson
  );

router
  .route('/:id')
  .get(personController.getPerson)
  .patch(
    personController.updatePerson
  )
  .delete(
    // authController.restrictTo('user', 'admin'),
    personController.deletePerson
  );

module.exports = router;
