import jwt from 'jsonwebtoken';

const secret = 'defaultSecretKey';

const payload = {
  username: 'georges',
  role: 'admin'
};

const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('TOKEN:', token);
