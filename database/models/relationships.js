import { DataTypes } from 'sequelize';
import { sequelize } from './index';

const Composit = sequelize.define('composit', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
});

const Component = sequelize.define('component', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  main_component: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const ParentComponentChildComponent = sequelize.define('parent_component_child_component', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  parentComponentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Component,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  childComponentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Component,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
});



Composit.hasMany(Component, {
  foreignKey: 'compositId',
  onDelete: 'CASCADE',
});

Component.belongsTo(Composit, {
  foreignKey: 'compositId',
  onDelete: 'CASCADE',
});
  
Component.belongsToMany(Component, {as: 'Children', through: ParentComponentChildComponent, foreignKey: 'parentComponentId'});
Component.belongsToMany(Component, {as: 'Parents', through: ParentComponentChildComponent, foreignKey: 'childComponentId' });
  
// Component.belongsToMany(Component, {as: 'parentComponents', through: 'ParentComponentChildComponent',foreignKey: 'parentComponentId'});
// Component.belongsToMany(Component, {as: 'childComponents', through: 'ParentComponentChildComponent', foreignKey: 'childComponentId' });


export { Component, Composit, ParentComponentChildComponent }