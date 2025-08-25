const mongoose = require('mongoose');
async function connect(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true,
    maxPoolSize: 20
  });
  return mongoose;
}

module.exports = { connect };
