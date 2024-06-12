describe('Part 1 - Basic setup', () => {
    it('Navigate to registration page', () => {
        cy.visit('https://app.archway.finance/signup')
        cy.url().should('equal', 'https://app.archway.finance/signup')

        //verify some of the key elements on the page:

        //'individual' radio button - visible and checked by default:
        cy.get('input[type="radio"]').contains('Individual').as('individualRadioButton')
        cy.get('@individualRadioButton').should('be.visible').and('be.checked')

        //'Company' radio button - visible and not checked by default:
        cy.get('input[type="radio"]').contains('Company').as('companyRadioButton')
        cy.get('@companyRadioButton').should('be.visible').and('not.be.checked')

    })
})