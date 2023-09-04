// Photo Model Include
const Photo = require('../models/Photo');

// ****************************************************************************
// About Page Yönlendirmesi
exports.getAboutPage = (req, res) => {
    res.render('about');
};

// ****************************************************************************
// Add Page Yönlendirmesi
exports.getAddPage = (req, res) => {
    res.render('add');
};

// ****************************************************************************
// Yeni resim oluşturulduğu zaman, resmin özel sayfasını oluşturup yönlendirme yapacak fonksiyon.
exports.getEditPage = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    res.render('edit', {
        photo,
    });
};
