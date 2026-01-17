'use strict';

/**
 * me service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::me.me');
