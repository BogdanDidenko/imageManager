var express = require('express');
var hbs = require( 'express-handlebars' );
var bodyParser = require('body-parser');
var nodeGallery = require('node-gallery');
var csv = require('csv-parser')
var fs = require('fs')
var json2csv = require('json2csv');
var path = require('path');

var stream = csv({
  raw: false,     // do not decode to utf-8 strings 
  separator: null, // specify optional cell separator 
  quote: '',     // specify optional quote character 
  escape: '',    // specify optional escape character (defaults to quote value) 
  newline: '',  // specify a newline character 
  strict: false    // require column length match headers length 
})

var imagesLabels = {},
    images = {},
    labeles,
    fields = ["image_name", "tags"]

fs.readdirSync('./public/images/').forEach(file => {
    var fileName = file.split('.')[0];
    images[fileName] = {
        file: file,
        name:fileName,
        labeles: []
    }
})

fs.createReadStream('./labels/train.csv')
    .pipe(stream)
    .on('data', function (data) {
        imagesLabels[data.image_name] = data.tags;
    }).on('finish', function() {
        for(var k in images) {
            images[k].labeles = imagesLabels[k];
        }
        //console.log(imagesLabels);
    })

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function writeData(data) {
    var dataToWrite = [],
        filePath = './result/updated_train.csv';
    for(var k in data) {
        images[k].labeles = data[k];
        imagesLabels[k] = data[k];
    }
    for(k in imagesLabels) {
        dataToWrite.push({
            image_name: k,
            tags: imagesLabels[k],
        })
    }
    var csv = json2csv({ data: dataToWrite, fields: fields });
    ensureDirectoryExistence(filePath);
    fs.writeFile(filePath, csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
}
// fs.createReadStream('./labels/train_v2.csv')
//     .pipe(stream)
//     .on('data', function (data) {
//         imagesLabels[data.image_name] = data.tags.split(' ')
//     }).on('finish', function() {
//         //console.log(imagesLabels);
//     })

const app = express();


// Again, we define a port we want to listen to
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});
// app.use('/images', nodeGallery({
//   staticFiles : '/images',
//   urlRoot : 'gallery', 
//   title : 'Example Gallery'
// }));
app.use(bodyParser());

app.use(express.static('public'));

app.engine('hbs', hbs());
app.set('views', './views');
app.set('view engine', 'hbs');
//app.set('view engine', 'hbs');

// // This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
     res.render('index');
    //res.sendFile(__dirname + '/public/index.html');
});

app.post('/data', function(req, res) {
    var data = req.body;
    writeData(data);
    res.json({status:'OK'});
    //  res.render('index', {
    //      images: images
    //  });
    //res.sendFile(__dirname + '/public/index.html');
});

app.post('/imagesList', function(req, res) {
    var data = [];
    for(var k in images) {
        data.push({
            name: images[k].name,
            file: images[k].file,
            labeles: images[k].labeles
        });
    }
    res.json(data);
    //  res.render('index', {
    //      images: images
    //  });
    //res.sendFile(__dirname + '/public/index.html');
});