https://youtu.be/JQ2JR-zSjng

**These are example keys that's why I am publishing them**

## Gen Certs

```sh
openssl genpkey -algorithm RSA -out private_key.pem
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

## Gen Signature

```sh
node ./server/index.js username:feature1
```

