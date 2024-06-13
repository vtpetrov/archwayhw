describe('Part 2 - Verify Cookie Settings Popup - approach 1 via home page', {testIsolation: true}, () => {

    let homepageUrl = 'https://archway.finance';

    beforeEach('open base url', () => {
        cy.visit(homepageUrl)
        cy.clearAllCookies()
        cy.get('div.cookie__buttons-grid.small > a[fs-cc = "allow"][href = "#"]').as('acceptBtn')
    })

    it('"Accept All Cookies" button is visible and enabled', () => {
        cy.log('Test 1')
        cy.get('@acceptBtn').should("be.visible")
            .and("have.text", 'Accept All Cookies')
            .and('have.attr', 'role').and("equal", 'button')
    })

    it('"Deny All Cookies" button is visible and enabled', () => {
        cy.log('Test 2')
        cy.get('div.cookie__buttons-grid.small > a[fs-cc = "deny"][href = "#"]').should("be.visible")
            .and("have.text", 'Deny All Cookies')
            .and('have.attr', 'role').and("equal", 'button')
    })

    it('"Cookie Settings" button is visible and enabled', () => {
        cy.log('Test 3')
        cy.get('a[fs-cc = "submit"] > div[fs-cc = "open-preferences"]').should("be.visible")
            .and("have.text", 'Cookie Settings')
    })

    // ALL cookies:
    // _ga               GA1.1.145281754.1718140473
    // _ga_MLM9RD0VCQ    GS1.1.1718232720.1.0.1718232720.0.0.0
    // ar_debug          1
    // bcookie           "v=2&c0daca8a-c289-4341-8929-3224f38c30df"
    // fs-cc             %257B%2522id%2522%253A%2522ijoI_zBp15CxfhJ1pcnKw%2522%252C%2522consents%2522%253A%257B%2522analytics%2522%253Atrue%252C%2522essential%2522%253Atrue%252C%2522marketing%2522%253Atrue%252C%2522personalization%2522%253Atrue%252C%2522uncategorized%2522%253Atrue%257D%257D
    // fs-cc-updated     TRUE
    // li_gc             MTswOzE3MTgxNDA0NzI7MjswMjGBucaav8SQ+N/HT4uMT3I38mlY71w0BNAz9bA6QkoplA==
    // lidc= new Cookie  "b=OGST06:s=O:r=O:a=O:p=O:g=2997:u=1:x=1:i=1718220262:t=1718306662:v=2:sig=AQFaKgSAa66v_E7_DUi1KD6zfo0Ej_3f"

    // .archway.finance only:
    // _ga	            GA1.1.145281754.1718140473	                    .archway.finance
    // _ga_MLM9RD0VCQ	GS1.1.1718232720.1.0.1718232720.0.0.0	        .archway.finance
    // fs-cc	        %257B%2522id%2522%253A%2522ijoI_zBp15CxfhJ1pcnKw%2522%252C%2522consents%2522%253A%257B%2522analytics%2522%253Atrue%252C%2522essential%2522%253Atrue%252C%2522marketing%2522%253Atrue%252C%2522personalization%2522%253Atrue%252C%2522uncategorized%2522%253Atrue%257D%257D	.archway.finance
    // fs-cc-updated	TRUE	                                        .archway.finance

    it('Clicking "Accept All Cookies" button stores all 4 cookies in app storage', () => {
        cy.get('@acceptBtn').click()
        cy.log('Actual cookies are:')
        cy.getAllCookies()
            .should('have.length', 4)
            .then((cookies) => {
                cookies.forEach(function (c, index) {
                    cy.log(index.toString(), c.name, c.value)
                })
            })

        // verify cookie name and values match expected:
        cy.getCookie('_ga').should('exist')
            .its('value').should('contain', 'GA1.1.')

        cy.getCookie('_ga_MLM9RD0VCQ').should('exist')
            .its('value').should("contain", 'GS1.1.171')


        cy.getCookie('fs-cc').should('exist')
            .its('value').should("contain", '%2522%252C%2522consents%2522%253A%257B%2522analytics%2522%253Atrue%252C%2522essential%2522%253Atrue%252C%2522marketing%2522%253Atrue%252C%2522personalization%2522%253Atrue%252C%2522uncategorized%2522%253Atrue%257D%257D')

         cy.getCookie('fs-cc-updated').should('exist')
             .its('value').should("equal", 'true')
    })

})