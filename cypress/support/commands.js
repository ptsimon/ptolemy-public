import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { attachCustomCommands } from "cypress-firebase";
import "../../src/hooks/useFirebaseAuth"  // Firebase initialize app and login

attachCustomCommands({ Cypress, cy, firebase })

Cypress.Commands.add('clickNode', (name) => {
    return cy.contains('.react-flow__node', name).click()
})

Cypress.Commands.add('dblClickNode', (name) => {
    return cy.contains('.react-flow__node', name).dblclick()
})

Cypress.Commands.add('clickTemplate', (name) => {
    return cy.contains('.template-card', name).click()
})

Cypress.Commands.add('expectTotal', (total) => {
    return cy.get('.total-text').should('have.text', total)
})

// Commands Delay (from https://github.com/cypress-io/cypress/issues/249)
const COMMAND_DELAY = Cypress.env('COMMAND_DELAY') || 0;
if (COMMAND_DELAY > 0) {
    for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
        Cypress.Commands.overwrite(command, (originalFn, ...args) => {
            const origVal = originalFn(...args);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(origVal);
                }, COMMAND_DELAY);
            });
        });
    }
}