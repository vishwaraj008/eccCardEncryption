# ECC Card Encryption

A secure card encryption system using Elliptic Curve Cryptography (ECC) for protecting sensitive payment card data.

## Features

- Secure encryption of card data using ECC
- PCI DSS compliant encryption methods
- Easy-to-use API for encryption and decryption
- Support for multiple card formats

## Installation

```bash
npm install ecc-card-encryption
```


## Security

This library implements industry-standard security practices:
- ECC (Elliptic Curve Cryptography)
- Secure key generation and storage
- Data sanitization
- PCI DSS compliance measures

## API Reference

### `encryptCard(cardData)`
Encrypts card data using ECC.

### `decryptCard(encryptedData)`
Decrypts previously encrypted card data.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security Notice

This software is provided "as is" without warranty of any kind. Use at your own risk.
