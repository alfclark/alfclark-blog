'use strict';

/**
 * me controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::me.me');
