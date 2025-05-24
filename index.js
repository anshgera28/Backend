const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get('/', function (req, res) {
    try {
        fs.readdir(`./files`, function (err, files ) {
            console.log(files);
            if (err) {
                console.error('Error reading files:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.render('index', { files });
        });
    } catch (err) {
        console.error('Error rendering index:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/create', function (req, res) {
  fs.writeFile(`./files/${req.body.title.split(' ').join('-')}.txt`, req.body.details, function (err){
    res.redirect('/');
  })
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
});
