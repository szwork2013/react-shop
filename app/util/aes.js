
/***
 * 使用示例
    var stringInput = 'i love china'
    var key = 'f0ki13SQeRpLQrqk73UxhBAI7vd35FgYrNkVybgBIxc=';

    aes.encrypt(stringInput, key)
       .then(function(encrypted){
          console.log(JSON.stringify(encrypted));
          aes.decrypt(encrypted, key)
             .then(function(plaintext){
                console.log(plaintext);
             })
       })
 */
var AES = require('react-native-aes');
var Buffer = require('buffer').Buffer;

var cipherName = 'AES-256-CBC';

module.exports = {
    encrypt: function(input, key){
        input = new Buffer(input)
        key = new Buffer(key, 'base64')
        return new Promise(function(resolve, reject) {
            AES.encryptWithCipher(
                cipherName,
                input,
                key,
                function (err, encrypted) {
                    if (!err && encrypted) {
                        resolve(encrypted);
                    } else {
                        reject(Error("encrypt error"));
                    }
                })
        });
    },
    decrypt: function(encrypted, key){
        key = new Buffer(key, 'base64')
        return new Promise(function(resolve, reject) {
            AES.decryptWithCipher(
                cipherName,
                encrypted.ciphertext,
                key,
                encrypted.iv,
                function (err, plaintext) {
                    if (!err && plaintext) {
                        resolve(plaintext.toString());
                    } else {
                        reject(Error("decrypt error"));
                    }
                }
            )
        });
    }
}


