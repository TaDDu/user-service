module.exports = (sequelize, DataTypes) => {
  return sequelize.define("meta", {
    entity: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    value: {
      type: DataTypes.JSON,
      allowNull: true
    }
  });
};
