module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_sessions", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timeToLive: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  });
};
