import crypto from "crypto";
import fs from "fs/promises";

// read program args
const args = process.argv.slice(2);
console.log("args:", args);

const privKey = await fs.readFile("./private_key.pem", "utf-8");

const textToSign = args[0];
if (!textToSign) {
	throw new Error("No text to sign");
}

const sign = crypto.createSign("SHA256");
sign.update(textToSign);
const signature = sign.sign(privKey, "base64");

console.log("Signature:", signature);

let signatures;

try {
	await fs.access("./signatures.json");
	const signaturesJSON = await fs.readFile("./signatures.json", "utf-8");
	signatures = JSON.parse(signaturesJSON);
} catch (error) {
	signatures = {};
}

signatures[textToSign] = signature;

await fs.writeFile("./signatures.json", JSON.stringify(signatures, null, 2));
