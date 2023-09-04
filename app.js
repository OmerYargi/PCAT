// Express
const express = require('express');
const app = express();

// express-fileUpload: resim yükleme işlemi için kullanıyoruz.
const fileUpload = require('express-fileupload');

// PUT methodu Post gibi göstermek için
const methodOverride = require('method-override');

// Mongoose
const mongoose = require('mongoose');

// Photo Conrtollers
const photoController = require('./conrollers/photoControllers');

// Page Controllers
const pageControllers = require('./conrollers/pageControllers');

// ****************************************************************************
// Burada veritabanımıza bağlanıyoruz.
mongoose.connect('mongodb://localhost/pcat-test-db');

// ****************************************************************************
// TEMPLATE ENGINE olarak ejs kullanılırken ilk önce projeye çağır
const ejs = require('ejs');

// TEMPLATE ENGINES olarak ejs kullanılacaksa view engine olarak ejs ataması yap.
app.set('view engine', 'ejs');

// ****************************************************************************
// Midlewares
app.use(express.static('public'));

// URL de bulunan datanın okunmasını sağlıyor.
app.use(express.urlencoded({ extended: true }));

// URL de bulunan datayı json formatına dönüştürüyor.
app.use(express.json());

// express-fileUpload için
app.use(fileUpload());

// method-override: metodları post metoduna dönüştürmek için
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
);

// ****************************************************************************
// ROUTES
// Tüm fotoğraflar index sayfasına gönderiliyor. Son yükleme tarihine göre sıralanıyor.
app.get('/', photoController.getAllPhotos);

// Her bir fotoğraf için özel sayfalar oluşturuluyor.
app.get('/photos/:id', photoController.getPhoto);

// Form üzerinden girilen değerlere göre veritabanında yeni bir fotoğraf oluşturuyor.
app.post('/photos', photoController.createPhoto);

// Edit sayfasından gönderilen PUT isteğini POST olarak değiştiriyoruz. Sonra verilen değerlere göre fotoğraf verisini güncelliyoruz.
app.put('/photos/:id', photoController.updatePhoto);

// Bir resim silmek için kullanılan fonksiyon
app.delete('/photos/:id', photoController.deletePhoto);

// About Page Yönlendirmesi
app.get('/about', pageControllers.getAboutPage);

// Add Page Yönlendirmesi
app.get('/add', pageControllers.getAddPage);

// Yeni resim oluşturulduğu zaman, resmin özel sayfasını oluşturup yönlendirme yapacak fonksiyon.
app.get('/photos/edit/:id', pageControllers.getEditPage);

const port = 3000;
app.listen(port, () => {
    console.log(`Port: ${port} üzerinden yayına başlandı`);
});
