// Express
const express = require('express');
const app = express();

// Node Core Module FS
const fs = require('fs');

// express-fileUpload: resim yükleme işlemi için kullanıyoruz.
const fileUpload = require('express-fileupload');

// PUT methodu Post gibi göstermek için
const methodOverride = require('method-override');

// Mongoose
const mongoose = require('mongoose');

// oluşturduğumuz models klasörü altındaki Photo.js dosyasını çekiyoruz.
const Photo = require('./models/Photo');
// ****************************************************************************
// Burada veritabanımıza bağlanıyoruz.
mongoose.connect('mongodb://localhost/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ****************************************************************************
// index.html response olarak döndürürken path.resolve kullanımı için path projeye çağırılmalıdır.
const path = require('path');

// ****************************************************************************
// TEMPLATE ENGINE olarak ejs kullanılırken ilk önce projeye çağır
const ejs = require('ejs');
// TEMPLATE ENGINES olarak ejs kullanılacaksa view engine olarak ejs ataması yap.
app.set('view engine', 'ejs');

// ****************************************************************************
// Middleware oluşturmak için fonksiyon ve app.use ile çağırma: app.use(express.static('public')); altına app.use(myLogger); yazılarak çağırılır.
// const myLogger = (req, res, next) => {
//      console.log('Middleware 1');
//      next();
// };

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
app.get('/', async (req, res) => {
    // ****************************************************************************
    // index.html dosyasının response olarak dönmesini istiyorsan aşağıdaki kodu yaz.
    // res.sendFile(path.resolve(__dirname, 'temp/index.html'));

    // ****************************************************************************
    // index.ejs dosyasının response olarak dönmesini istiyorsan aşağıdaki kodu yaz. Engine Template olarak ejs kullanıldı. Dosya uzantıları ejs olarak değiştirildi.
    const photos = await Photo.find({}).sort('-dateCreated');
    res.render('index', {
        photos,
    });
});

// Photo'lar için özel sayfalar
app.get('/photos/:id', async (req, res) => {
    // console.log(req.params.id);
    // res.render('about');

    // ****************************************************************************
    // Veritabanına bağlanacak tıklanan id değerini alacak ve arayacak. Sonuç olarak photo sayfasına id değeri verilen verinin tüm değerlerini gönderecek.
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
        photo,
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/add', (req, res) => {
    res.render('add');
});

// Form üzerinden fotoğraf ekleme fonksiyonu.
app.post('/photos', async (req, res) => {
    // Gönderilen resmin verileri için req.files.name
    // console.log(req.files.image);
    // await Photo.create(req.body);
    // res.redirect('/');

    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    // İlk önce kullanıcının yüklediği resim uploadImage değişkenine atanıyor.
    let uploadImage = req.files.image;
    // uploadImage değişkenine atanan resim kullanıcı bilgisayarında. Bu resmi alıp kendi sunucumuzda /public klasörü altına uploads klasörü altına yeni resim olarak kaydedecez.
    // Bu sadece bir dosya yoludur.
    let uploadPath = __dirname + '/public/uploads/' + uploadImage.name;

    // Üst tarafta aldığımız uploadPath dosya yolunu taşımamız gerekiyor. ilk önce konumu sonraki parametre olarak callback fnc yazıyoruz ve sunucumuza da dosyanın konumunu kaydediyoruz.
    uploadImage.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadImage.name,
        });
        res.redirect('/');
    });
});

// Özel resim sayfa içeriğinde bulunan update butonu ile açılan yeni sayfanın fonksiyonu
app.get('/photos/edit/:id', async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    res.render('edit', {
        photo,
    });
});

// Edit sayfasından gönderilen PUT isteğini POST olarak değiştiriyoruz.
app.put('/photos/:id', async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();
    // Sayfanın url bilgisi için req.params.id kullanıyoruz.
    res.redirect(`/photos/${req.params.id}`);
});

// Photo sayfasından resim silmek için kullanılan fonksiyon
// Bu isteğin yakalanması için yukarıda methodOverride fonksiyonu içine parametre girilmeli.
app.delete('/photos/:id', async (req, res) => {
    const photo = await Photo.findOne({_id: req.params.id});
    let deletedImage = __dirname + '/public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove(req.params.id);

    res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Port: ${port} üzerinden yayına başlandı`);
});
