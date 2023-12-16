const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const publicPath = path.join(__dirname);
const assetsPath = path.join(__dirname, 'assets');

app.use(express.static(publicPath));
app.use('/assets', express.static(assetsPath));
app.use(express.json());

// Запросы к разным страницам
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(publicPath, 'about.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(publicPath, 'services.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(publicPath, 'contact.html'));
});

app.get('/reviews', (req, res) => {
    res.sendFile(path.join(publicPath, 'reviews.html'));
});

// Запросы для CSS и JS файлов
app.get('/assets/css/style-starter.css', (req, res) => {
    res.sendFile(path.join(assetsPath, 'css', 'style-starter.css'));
});

app.get('/assets/js/bootstrap.min.js', (req, res) => {
    res.sendFile(path.join(assetsPath, 'js', 'bootstrap.min.js'));
});

app.get('/assets/js/jquery-3.3.1.min.js', (req, res) => {
    res.sendFile(path.join(assetsPath, 'js', 'jquery-3.3.1.min.js'));
});

app.get('/assets/js/theme-change.js', (req, res) => {
    res.sendFile(path.join(assetsPath, 'js', 'theme-change.js'));
});

const reviewsFile = 'reviews.json';

if (!fs.existsSync(reviewsFile)) {
    fs.writeFileSync(reviewsFile, '[]');
}

function loadReviews() {
    try {
        const data = fs.readFileSync(reviewsFile);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveReviews(reviews) {
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
}

app.get('/get-reviews', (req, res) => {
    const reviews = loadReviews();
    res.send(reviews);
});

app.post('/submit-review', (req, res) => {
    const { userName, userReview } = req.body;

    const timestamp = new Date(); // Get current timestamp

    fs.readFile(reviewsFile, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        let reviews = JSON.parse(data || '[]');
        reviews.push({ userName, userReview, timestamp });

        saveReviews(reviews);

        console.log('Review added');
        res.send('The review has been sent');
    });
});

app.post('/send_email', (req, res) => {
    const { name, email, phone, from, to, weight } = req.body;
    const pythonProcess = spawn('python', ['Gmail.py', name, email, phone, from, to, weight]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Mail: ${data}`);
        res.json({ result: data.toString() });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Mail Script Error: ${data}`);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
