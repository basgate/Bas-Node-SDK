"use strict";

const crypto = require('crypto');
const Rijndael = require('rijndael-js');
const padder = require('pkcs7-padding');
class BasChecksum {

	// static encrypt(input, key) {
	// 	console.log("=========192 input, Key:", input, key)
	// 	try {
	// 		const plainText = Buffer.from(input, 'utf8');
	// 		//Pad plaintext before encryption
	// 		const padded = padder.pad(plainText, 24); //Use 32 = 256 bits block sizes

	// 		const key2 = Buffer.from(key, "utf8"); //32 bytes key length
	// 		const iv = Buffer.from(BasChecksum.iv, "utf8")//crypto.randomBytes(16); //32 bytes IV
	// 		console.log("=========192 key2 , iv:", key2, iv)

	// 		const cipher = new Rijndael(key2, 'cbc'); //CBC mode
	// 		const encrypted = cipher.encrypt(padded, 192, iv);
	// 		console.log("=========192 encrypted:", encrypted)
	// 		console.log("=========192 encrypted-base64:", encrypted.toString("base64"))

	// 		return encrypted;
	// 	} catch (error) {
	// 		console.log("=========192 Error192:", error)

	// 	}
	// }
	static encrypt(input, key) {
		key = "R0Biem8wOUIySkJxNGd6cQ=="
		console.log("========= input, Key:", input, key)
		try {
			const keyAscii = Buffer.from(key, "ascii")
			console.log('=======================key-hex ', Buffer.from(key, "base64").toString("hex"));
			console.log('=======================keyAscii-hex ', keyAscii.toString('hex'));
			console.log('=======================keyAscii-base64 ', keyAscii.toString('base64'));
			console.log('=======================keyAscii-binary ', keyAscii.toString("binary"));
			const tmp = crypto.createHash('sha256',).update(keyAscii).digest()
			const len = Buffer.from(tmp, "hex").toString("utf8").length < 32 ? 32 - Buffer.from(tmp, "hex").toString("utf8").length : 0
			const key2 = padder.pad(tmp, len)
			console.log("========= Buffer.from Key ,iv :", Buffer.from(key, "utf8"), Buffer.from(BasChecksum.iv, "utf8"))
			console.log("========= key2:", Buffer.from(key2, "hex").toString("utf8").length, Buffer.from(key2, "ascii"), Buffer.from(key2, "hex").toString("hex").length, Buffer.from(key2, "hex").toString("hex"))
			// console.log("========= key2:", key2.toString("utf8").length, key2.toString("utf8"))
			// console.log("========= cc ,dd:", Buffer.from(cc), Buffer.from(dd))
			// console.log("========= cc ,dd:", Buffer.from(cc, "base64"), Buffer.from(dd, "base64"))
			// var cipher = crypto.createCipheriv('AES-128-CBC', Buffer.from(key, "base64"), BasChecksum.iv);
			var cipher = crypto.createCipheriv('AES-128-CBC', Buffer.from(key2, "hex").toString("utf8"), Buffer.from(BasChecksum.iv, "utf8"));
			var encrypted = cipher.update(Buffer.from(input, "base64"), "base64", 'base64');
			console.log("========= encrypted:", encrypted)
			encrypted += cipher.final('base64');
			console.log("========= encrypted + cipher.final('base64'):", encrypted)
			return encrypted;
		} catch (error) {
			console.log("========= Error:", error)

		}
	}

	static encrypt128(input, key) {
		// key = atob(key)

		console.log("=========128 input, Key:", input, key.toString())
		try {

			const keyAscii = Buffer.from(key, "ascii")
			const plainText = Buffer.from(input, 'ascii');
			//Pad plaintext before encryption
			const padded = padder.pad(plainText, 16); //Use 32 = 256 bits block sizes
			console.log("=========128 keyAscii:", keyAscii.toString("utf-8"))
			console.log("=========128 keyAscii:", keyAscii.toString("binary"))
			// console.log("=========128 padded-hex:", padded.toString("hex"))
			console.log("=========128 plainText-hex:", plainText.toString("hex"))
			const key2 = crypto.createHash('sha256',).update(keyAscii).digest()

			// const key2 = crypto.scryptSync(key, 'aaaa', 16)// Buffer.from(key, "utf8"); //32 bytes key length
			const iv = Buffer.from(BasChecksum.iv, "ascii")//crypto.randomBytes(16); //32 bytes IV
			console.log("=========128 key2 , iv:", key2.toString("hex"), iv.toString("hex"))

			const cipher = new Rijndael(key2, 'cbc'); //CBC mode
			const encrypted = cipher.encrypt(plainText, 128, BasChecksum.iv);
			console.log("=========128 encrypted:", encrypted)
			// var str = encrypted.map(c => String.fromCharCode(c))
			var enc_uft8 = encrypted.toString("utf8")
			var enc_base64 = Buffer.from(encrypted)
			// console.log("=========128 encrypted-string:", str)
			console.log("=========128 encrypted-utf8:", enc_uft8)
			console.log("=========128 encrypted-utf8-base64:", enc_base64.toString("base64"))

			return enc_base64.toString("base64");

			// var cipher128 = crypto.createCipheriv('AES-128-CBC', key, BasChecksum.iv);
			// var encrypted128 = cipher128.update(input, 'binary', 'base64');
			// console.log("========= encrypted128:", encrypted128)
			// encrypted128 += cipher128.final('base64');
			// console.log("========= encrypted128 + cipher.final('base64'):", encrypted128)
			// return encrypted128;
		} catch (error) {
			console.log("========= Error128:", error)

		}
	}

	// static encrypt256(input, key) {
	// 	key = 'UjBCaWVtOHdPVUl5U2tKeE5HZDZjUT09' //atob(key)
	// 	console.log("========= input, Key:", input, key)
	// 	try {

	// 		var cipher256 = crypto.createCipheriv('AES-256-CBC', key, BasChecksum.iv);
	// 		var encrypted256 = cipher256.update(input, 'binary', 'base64');
	// 		console.log("========= encrypted256:", encrypted256)
	// 		encrypted256 += cipher256.final('base64');
	// 		console.log("========= encrypted256 + cipher.final('base64'):", encrypted256)
	// 		return encrypted256;
	// 	} catch (error) {
	// 		console.log("========= Error256:", error)

	// 	}
	// }

	static decrypt(encrypted, key) {
		var decipher = crypto.createDecipheriv('AES-192-CBC', key, BasChecksum.iv);
		var decrypted = decipher.update(encrypted, 'base64', 'binary');
		try {
			decrypted += decipher.final('binary');
		}
		catch (e) {
			console.log(e);
		}
		return decrypted;
	}
	static generateSignature(params, key) {
		console.log(`=========== params :${params}\nkey:${key}`)
		if (typeof params !== "object" && typeof params !== "string") {
			var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if (typeof params !== "string") {
			params = BasChecksum.getStringByParams(params);
		}
		return BasChecksum.generateSignatureByString(params, key);
	}


	static verifySignature(params, key, checksum) {
		if (typeof params !== "object" && typeof params !== "string") {
			var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if (params.hasOwnProperty("CHECKSUMHASH")) {
			delete params.CHECKSUMHASH
		}
		if (typeof params !== "string") {
			params = BasChecksum.getStringByParams(params);
		}
		return BasChecksum.verifySignatureByString(params, key, checksum);
	}

	static async generateSignatureByString(params, key) {
		var salt = await BasChecksum.generateRandomString(4);
		return BasChecksum.calculateChecksum(params, key, salt);
	}

	static verifySignatureByString(params, key, checksum) {
		var paytm_hash = BasChecksum.decrypt(checksum, key);
		var salt = paytm_hash.substr(paytm_hash.length - 4);
		return (paytm_hash === BasChecksum.calculateHash(params, salt));
	}

	static generateRandomString(length) {
		return new Promise(function (resolve, reject) {
			crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
				if (!err) {
					var salt = buf.toString("base64");
					// resolve(salt);
					resolve('aaaa');
				}
				else {
					console.log("error occurred in generateRandomString: " + err);
					reject(err);
				}
			});
		});
	}

	static getStringByParams(params) {
		console.log('====== getStringByParams params:', JSON.stringify(params))
		var data = {};
		Object.keys(params).sort().forEach(function (key, value) {
			console.log('====== getStringByParams key:', key)
			if (params[key] !== null && typeof params[key] !== 'undefined') {
				data[key] = params[key] !== "null" ? params[key] : "";
			} else {
				data[key] = "";
			}
		});
		return Object.values(data).join('|');
	}

	static calculateHash(params, salt) {
		var finalString = params + "|" + salt;
		return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
	}
	static calculateChecksum(params, key, salt) {
		var hashString = BasChecksum.calculateHash(params, salt);
		console.log(`========== calculateChecksum() hashString\n${hashString}`)
		// var enc = BasChecksum.encrypt(hashString, key);
		var enc128 = BasChecksum.encrypt128(hashString, key);
		// var enc256 = BasChecksum.encrypt256(hashString, key);
		// console.log(`========== calculateChecksum():\n${enc}`)
		console.log(`========== calculateChecksum() 128:\n${enc128}`)
		// console.log(`========== calculateChecksum() 256:\n${enc256}`)

		return enc128;
	}
}
// BasChecksum.iv = '@@@@&&&&####$$$$';
BasChecksum.iv = 'dddd888855556666';
module.exports = BasChecksum;