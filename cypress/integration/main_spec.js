describe('Main UI testing', { scrollBehavior: false }, () => {
    beforeEach(function () {
        cy.log(Cypress.env())
        cy.login()
    })

    it('Various happy path testing', () => {
        cy.viewport(1920, 1080)
        cy.visit('/')
        cy.scrollTo('top')
        cy.scrollTo(0, 100)

        // Check total
        cy.expectTotal('$8,990.81')

        // Change assumptions
        cy.scrollTo(0, 800)
        cy.get('input[name=assumption_value_BQ_Query_Size_GB]').type('{selectall}3')
        cy.contains('there are unsaved changes')
        cy.scrollTo(0, 2000)
        cy.get('.assumptions-save').click()
        cy.contains('there are unsaved changes').should('not.exist')

        // Check total
        cy.expectTotal('$8,990.81')

        // Remove BQ node
        cy.scrollTo(0, 100)
        cy.clickNode('BQ')
        cy.get('.toolbarRemove').click()
        cy.contains('Confirm').click()

        // Check total
        cy.expectTotal('$8,983.51')

        // Add constant node from tableau
        cy.clickNode('Tableau')
        cy.get('.toolbarAdd').click()
        cy.get('.popup').contains('Add New Node')
        cy.get('input[name=nodeId]').type('Dummy')
        cy.clickTemplate('Default')
        cy.contains('Confirm').click()
        cy.dblClickNode('Dummy')
        cy.get('.ace_content').type('{selectall}300')
        cy.get('.popup-btns').contains('Confirm').click()

        // Check total
        cy.expectTotal('$9,283.51')

        // Test function expressions
        cy.clickNode('Dummy')
        cy.get('.toolbarEdit').click()
        cy.get('.popup').contains('Edit Node')
        cy.get('.ace_content').type('{selectall}max(5, round(999.5))')
        cy.get('.popup-btns').contains('Confirm').click()

        // Check total
        cy.expectTotal('$9,983.51')
    })

    it('Edge cases when loading a new JSON', () => {
        const newJSON = JSON.stringify({
            "skeleton": [
                { "id": "TCO", "eval": "0", units: "${}" }
            ],
            "metadata": {
                "chart": {
                    "nodes": {
                        "TCO": { "position": { "x": 352, "y": 48 }, "isCollapsed": false }
                    }
                }
            }
        })

        cy.viewport(1920, 1080)
        cy.visit('/')
        cy.scrollTo('top')
        cy.scrollTo(0, 100)

        // Check total
        cy.expectTotal('$8,990.81')

        // Change code in code widget
        cy.scrollTo(0, 2200)
        cy.get('.code-editor').contains('Clear').click()
        cy.get('.CodeMirror textarea').type(newJSON, { force: true, parseSpecialCharSequences: false })
        cy.get('.code-editor').contains('Set Skeleton').click()
        cy.scrollTo(0, 100)

        // Check total
        cy.expectTotal('$0.00')

        // Add new node
        cy.clickNode('TCO')
        cy.get('.toolbarAdd').click()
        cy.get('.popup').contains('Add New Node')
        cy.get('input[name=nodeId]').type('Dummy')
        cy.clickTemplate('Default')
        cy.contains('Confirm').click()
        cy.dblClickNode('Dummy')
        cy.get('.ace_content').type('{selectall}300')
        cy.get('.popup-btns').contains('Confirm').click()

        // Check total
        cy.expectTotal('$300.00')
    })
})
