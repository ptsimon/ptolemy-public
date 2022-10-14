/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import admin from "firebase-admin"
import {plugin as cypressFirebasePlugin} from "cypress-firebase"
import "dotenv/config"

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  const extendedConfig = cypressFirebasePlugin(on, config, admin)
  extendedConfig.env.TEST_UID = process.env['CYPRESS_TEST_UID']
  extendedConfig.env.COMMAND_DELAY = process.env['COMMAND_DELAY']
  return extendedConfig
}
