var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },

    firstName: { type: 'string' },
    lastName: { type: 'string' },
    backgroundImagesInterval: { type: 'integer' },
    backgroundImages: { type: 'array' },
    avatar: { type: 'string', defaultsTo: '/images/profile_small.jpg' }
  }
};

module.exports = User;