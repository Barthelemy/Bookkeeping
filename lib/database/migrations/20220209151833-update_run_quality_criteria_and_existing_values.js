'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.changeColumn('runs', 'run_quality', {
        run_quality: {
            type: Sequelize.ENUM('GOOD', 'BAD', 'TEST'),
            allowNull: false,
            defaultValue: 'TEST',
        },
    }),

    down: (queryInterface, _Sequelize) => queryInterface.changeColumn('runs', 'run_quality', {
        run_quality: {
            type: _Sequelize.ENUM('good', 'bad', 'unknown'),
        },
    }),
};
