describe('Part 2 - Cookie verification', () => {
    // beforeEach('open base url', () => {
    //     cy.visit('https://app.archway.finance/signup')
    // })

    let homepageUrl = 'https://archway.finance';
    let registrationUrl = 'https://app.archway.finance/signup'

    // it('Verify Cookie Settings Popup - approach 1 via home page', () => {
    //     cy.visit(homepageUrl)
    //     // click accept all cookies on home page:
    //     // cy.log('Navigate to "Sing Up')
    //     // cy.contains('Sing up').click()
    // })

    it('Verify Cookie Settings Popup - approach 2 via reg and retrieve cc-main', async() => {
        cy.visit(homepageUrl)
        cy.title().pause()
        cy.get('div#cc-main')
        // cy.screenshot()
        // click accept all cookies:
    })
})