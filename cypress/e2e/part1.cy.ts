describe('Part 1 - Basic setup', () => {
    it('Navigate to registration page and assert key elements', () => {
        cy.visit('https://app.archway.finance/signup')
        cy.url().should('equal', 'https://app.archway.finance/signup')

        //verify some of the key elements on the page:

        //'Have an account?' text is visible:
        cy.contains('Have an account?').should('be.visible')

        //'Log in' link is visible and clickable:
        cy.get('a[data-test="login-link"]').should('has.text', 'Log in')
            .and('be.visible').and('has.attr', 'href').and('deep.equal', '/login')

        //'Individual' radio button - visible and checked by default:
        cy.get('label:has(input[value = "10"])').as('individualRadioButtonLabel')
        let individualRadioButton = cy.get('@individualRadioButtonLabel').children()
        individualRadioButton.should('be.visible').and('be.checked')
        cy.get('@individualRadioButtonLabel').should('have.text', 'Individual')

        //'Company' radio button - visible and not checked by default:
        cy.get('label:has(input[value = "20"])').as('companyRadioButtonLabel')
        let companyRadioButton = cy.get('@companyRadioButtonLabel').children()
        companyRadioButton.should('be.visible').and('not.be.checked')
        cy.get('@companyRadioButtonLabel').should('have.text', 'Company')

        // 'First name' input field - visible:
        cy.get('input[type = "text"][name = "first_name"]').as('firstNameField')
        cy.get('@firstNameField').should('be.visible').and('be.enabled')
        cy.get('span').contains('First name').should('be.visible')

        // 'Last name' input field - visible:
        cy.get('input[type = "text"][name = "last_name"]').as('lastNameField')
        cy.get('@lastNameField').should('be.visible').and('be.enabled')
        cy.get('span').contains('Last name').should('be.visible')

        // 'Email' input field - visible:
        cy.get('input[type = "email"][name = "email"]').as('emailField')
        cy.get('@emailField').should('be.visible').and('be.enabled')
        cy.get('span').contains('Email').should('be.visible')

        // 'Create password' input field - visible:
        cy.get('input[type = "password"][name = "password"]')
            .should('be.visible').and('be.enabled')
        cy.get('button[data-test = "show-hide-password-btn"]').should('be.visible').and('be.enabled')

        // 'Keep me in the loop with only the juiciest product updates' checkbox - visible and unchecked:
        cy.get('label:has(input[type = "checkbox"])').should('be.visible').and('not.be.checked')
        cy.get('label:has(input[type = "checkbox"])').should('have.text', 'Keep me in the loop with only the juiciest product updates')

        // 'Sign up' button - visible and disabled:
        cy.get('button').should('be.visible').and('have.text', 'Sign Up').and('be.disabled')

        // 'By registering, you accept our Terms of use and Privacy Policy' text is present on the page:
        cy.contains('By registering, you accept our Terms of use and Privacy Policy').should('be.visible')
    })
})