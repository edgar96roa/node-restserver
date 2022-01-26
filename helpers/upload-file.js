const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {
        const { archivo } = files;

        const nombreNuevo = archivo.name.split('.');
    
        const extension = nombreNuevo[ nombreNuevo.length - 1 ];
    
        //validar la extension
        if( !extensionesValidas.includes(extension) ){
            return reject(`La extensión ${extension} no es permitida, debe ser: ${extensionesValidas} `);
        }
      
        const nombreTemp = uuidv4() + '.' + extension; // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
    
        archivo.mv(uploadPath, (err) => {
          if (err) {
            reject(err);
          }
      
          resolve( nombreTemp );
        });
    });

}

module.exports = {
    uploadFile
}