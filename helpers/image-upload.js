const multer = require('multer');
const B2 = require('backblaze-b2');

// Configurar as credenciais do Backblaze B2
const b2 = new B2({
  accountId: '0050cca9e29dc970000000001',
  applicationKey: 'K005g9wavfezz+lh9F9w79rHJT2Z0rM',
});

// Autenticar com o Backblaze B2
b2.authorize().then(() => {
  console.log('Autenticação bem-sucedida com o Backblaze B2');
}).catch((err) => {
  console.error('Erro na autenticação com o Backblaze B2:', err);
});

// Configurar o armazenamento do multer com o Backblaze B2
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = '';

    if (req.baseUrl.includes('users')) {
      folder = 'users';
    } else if (req.baseUrl.includes('instruments')) {
      folder = 'instruments';
    }

    cb(null, `public/images/${folder}`);
  },
  filename: function (req, file, cb) {
    const filename =
      Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname);
    cb(null, filename);
  },
});

// Criar uma instância do multer com o armazenamento no Backblaze B2
const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Por favor, envie apenas arquivos jpg ou png!'));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
