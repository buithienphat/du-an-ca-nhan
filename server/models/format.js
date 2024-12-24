const convertTimestamps = (schema) => {
  schema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
      ret.created_at = ret.createdAt;
      ret.updated_at = ret.updatedAt;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    },
  });
  schema.set("toObject", {
    virtuals: true,
    transform: (doc, ret) => {
      ret.created_at = ret.createdAt;
      ret.updated_at = ret.updatedAt;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    },
  });
};

module.exports = convertTimestamps;
