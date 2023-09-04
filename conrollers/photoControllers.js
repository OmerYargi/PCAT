// Photo Modelini Çağırıyoruz.
const Photo = require('../models/Photo');

// fs module include
const fs = require('fs');

// ****************************************************************************
// Tüm fotoğraflar index sayfasına gönderiliyor. Son yükleme tarihine göre sıralanıyor.
exports.getAllPhotos = async (req, res) => {
    const photos = await Photo.find({}).sort('-dateCreated');
    res.render('index', {
        photos,
    });
};

// ****************************************************************************
// Her bir fotoğraf için özel sayfalar oluşturuluyor.
exports.getPhoto = async (req, res) => {
    // Veritabanına bağlanacak tıklanan id değerini alacak ve arayacak. Sonuç olarak photo sayfasına id değeri verilen verinin tüm değerlerini gönderecek.
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
        photo,
    });
};

// ****************************************************************************
// Form üzerinden girilen değerlere göre veritabanında yeni bir fotoğraf oluşturuyor.
exports.createPhoto = async (req, res) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    // req.files.image: Kullanıcının yüklediği resmin bilgilerini alır.
    let uploadImage = req.files.image;
    // Kullanıcının yüklediği resmin name özelliği ile ismini aldık.
    let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name;

    // Üst tarafta aldığımız uploadPath dosya yolunu taşımamız gerekiyor. ilk önce konumu sonraki parametre olarak callback fnc yazıyoruz ve sunucumuza da dosyanın konumunu kaydediyoruz.
    uploadImage.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadImage.name,
        });
        res.redirect('/');
    });
};

// ****************************************************************************
// Edit sayfasından gönderilen PUT isteğini POST olarak değiştiriyoruz. Sonra verilen değerlere göre fotoğraf verisini güncelliyoruz.
exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();
    // Sayfanın url bilgisi için req.params.id kullanıyoruz.
    res.redirect(`/photos/${req.params.id}`);
};

// ****************************************************************************
// Bir resim silmek için kullanılan fonksiyon
exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    let deletedImage = __dirname + '/../public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove(req.params.id);
    res.redirect('/');
};
