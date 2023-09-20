<script>
	/**
	 * Verifies the signature
	 * @param signatureBase64 {string}
	 * @param originalText {string}
	 */
	async function verifySignature(signatureBase64, originalText) {
		const textEncoder = new TextEncoder();
		const data = textEncoder.encode(originalText);

		const pubKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk1+Q8PS/T8E0G67VTwsN
JHgB5YiVo0xWyLU7kimDUBzHn/l+HJ+j6C45R5hptw5mwiRGXJCeE5uDp/d19reV
z6gg2c+9XHe+wIsi0SERO1hOIYisLDFgycanTYpUf/VE+Z8ek9t7mlKzVGmTPmEY
AyZ2s5Bz5RwwWXr0fHpwJVHVh+GGf1p3h+CJ3UTw6RoOD00BrxtL+9B3ZRro1BEl
PW5wEsSVuocuo9WsbfaoCqMpQVzGBAyLHIEbF+cb341agYHHU2PjztuaUgf7DVkH
LEfuDqaStcsDky0t1GTXQT8cgSL1DBClUO5xQlEoWf/p+ID1HUh7cxF2vLcdzrlg
qQIDAQAB
-----END PUBLIC KEY-----
`;

		// Convert public key from PEM to an ArrayBuffer
		const base64PublicKey = pubKey
			.replace(/-----BEGIN PUBLIC KEY-----/, "")
			.replace(/-----END PUBLIC KEY-----/, "")
			.replace(/\s+/g, "");
		const publicKeyBuffer = new Uint8Array(
			Array.from(atob(base64PublicKey), (c) => c.charCodeAt(0))
		).buffer;

		// Import the public key
		const publicKeyCrypto = await window.crypto.subtle.importKey(
			"spki",
			publicKeyBuffer,
			{
				name: "RSASSA-PKCS1-v1_5",
				hash: "SHA-256",
			},
			true,
			["verify"]
		);

		// Convert Base64 signature to ArrayBuffer
		const signatureBuffer = new Uint8Array(
			Array.from(atob(signatureBase64), (c) => c.charCodeAt(0))
		).buffer;

		// Verify the signature
		const isValid = await window.crypto.subtle.verify(
			{
				name: "RSASSA-PKCS1-v1_5",
			},
			publicKeyCrypto,
			signatureBuffer,
			data
		);

		return isValid;
	}

	/**
	 * Verifies the signature and sets the result
	 * @param signature {string}
	 * @param text {string}
	 */
	function keyIsValid(signature, text) {
		console.log({ signature, text });
		verifySignature(signature, text)
			.then((isValid) => {
				if (isValid) {
					result = "The signature is valid!";
				} else {
					result = "The signature is NOT valid!";
				}
			})
			.catch((err) => {
				result = "An error occurred: " + err;
				console.error(err);
			});
	}

	let signature =
		"cER6+OJT9o/L2mtbmc73A7l1u5OoN7mOicqVs8JSrmABRJa2mfL3o3eU3J38rgwd28cmKkYyWbOnJuU/4CLs1JjgGttjvfLOn3PczDkhDmMWpp0CL+oStrH275h1VMYfpbknXHMcoZ1Cwj7ImvgBXWIWkVwVpwK2uPBJW1Ueu/Q1gFn+INNe5Mzr78DXyQAcuCI29Nad+A+JfqlK6JkiqoIAc954NbCWI7DvdRZ6iX+zmflUQE3ieIQoV6uEtTrB+e8HySMZ+UKQGwYShk+PlDhS+Lnv36QU52drow6f5rTAer/uEZAJAR+aS85/RJD/pUBtFuyi6emdvn1JjuDqfg==";
	let text = "username:feature1";
	let result = "";
</script>

<h1>Welcome to SvelteKit</h1>

<div class="label-input">
	<label for="signature">Signature</label>
	<input type="text" id="signature" name="signature" bind:value={signature} />
</div>
<div class="label-input">
	<label for="text">Text</label>
	<input type="text" id="text" name="text" bind:value={text} />
</div>

<button on:click={() => keyIsValid(signature, text)}> Verify </button>

<div>{result}</div>

<style>
	input {
		width: 40ch;
		font-size: 1.25rem;
		margin: 4px;
		padding: 2px;
	}

	.label-input {
		display: flex;
		flex-direction: column;
		margin-bottom: 16px;
	}

	button {
		font-size: 1.25rem;
		margin: 4px;
		padding: 2px;
	}
</style>
