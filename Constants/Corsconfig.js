
require('dotenv').config();

var whitelist = [process.env.REACT_CLIENT_URL]

var corsOptions = {
  credentials:true,
  // methods:["GET", "PUT", "POST", "DELETE","PATCH"],
  // allowedHeaders:["origin", "x-requested-with", "content-type", "accept","range","authorization","accept-language","accept-encoding"],
  // maxAge:-1,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = corsOptions
