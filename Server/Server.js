const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const passport = require('passport');
const session = require('express-session');
require('./passport-setup');
const path = require('path');
const categoryRoutes = require('./routes/category');
const articleRoutes = require('./routes/article');
const myUserRoutes = require('./routes/myuser');
const propertyRoutes = require('./routes/property');
const huggingfaceRoutes = require("./routes/huggingface");
const dealRoutes = require("./routes/deals");
const dealDocumentsRoutes = require("./routes/dealDocuments");
const toursRouter = require("./routes/tours");
const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'fdssdf',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

mongoose.connect('mongodb://127.0.0.1:27017/STRWEB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});


app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ filePath: `/uploads/${req.file.filename}` }); 
});

app.use('/api/properties', propertyRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', myUserRoutes);
app.use('/auth', authRoutes);
app.use("/api/requests", require("./routes/request"));
app.use('/uploads', express.static('uploads'));
app.use("/api", huggingfaceRoutes);
app.use("/api/deals", dealRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/deal-documents", dealDocumentsRoutes);
app.use("/api/tours", toursRouter);


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});