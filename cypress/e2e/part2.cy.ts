import * as domain from "node:domain";

describe('Part 2 - Verify Cookie Settings Popup - approach 1 via home page', {testIsolation: true}, () => {

    const homepageUrl: string = 'https://archway.finance';
    const EXPECTED_ARCHWAY_COOKIE_COUNT: number = 8;
    const archwayCookieDomain: string = '.archway.finance';

    //locators:
    const ACCEPT_BTN_LOCATOR: string = 'div.cookie__buttons-grid.small > a[fs-cc = "allow"][href = "#"]'
    const DENY_BTN_LOCATOR: string = 'div.cookie__buttons-grid.small > a[fs-cc = "deny"][href = "#"]'
    const COOKIE_SETTINGS_BTN_LOCATOR: string = 'a[fs-cc = "submit"] > div[fs-cc = "open-preferences"]'
    const CHAT_BTN_LOCATOR: string = 'div.intercom-lightweight-app-launcher.intercom-launcher[role = "button"]'

    beforeEach('open base url', () => {
        cy.visit(homepageUrl)
        cy.clearAllCookies()
    })

    it('"Accept All Cookies" button is visible and enabled', () => {
        cy.log('Test 1')
        cy.get(ACCEPT_BTN_LOCATOR).should("be.visible")
            .and("have.text", 'Accept All Cookies')
            .and('have.attr', 'role').and("equal", 'button')
    })

    it('"Deny All Cookies" button is visible and enabled', () => {
        cy.log('Test 2')
        cy.get(DENY_BTN_LOCATOR).should("be.visible")
            .and("have.text", 'Deny All Cookies')
            .and('have.attr', 'role').and("equal", 'button')
    })

    it('"Cookie Settings" button is visible and enabled', () => {
        cy.log('Test 3')
        cy.get(COOKIE_SETTINGS_BTN_LOCATOR).should("be.visible")
            .and("have.text", 'Cookie Settings')
    })

    class ArchwayCookie {
        cookieName: string;
        chainerToUse: string;
        valueToChain: string | RegExp;
    }

    // Archway expected cookies:
    const UUID_PATTERN = "^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$";

    const expected_ga_Cookie: ArchwayCookie = {cookieName: "_ga", chainerToUse: "contain", valueToChain: "GA1.1."}
    const expected_ga_MLM_Cookie: ArchwayCookie = {
        cookieName: "_ga_MLM9RD0VCQ",
        chainerToUse: "contain",
        valueToChain: "GS1.1.171840"
    }
    const expected_ga_X4V_Cookie: ArchwayCookie = {
        cookieName: "_ga_X4VEPW17ZN",
        chainerToUse: "contain",
        valueToChain: "GS1.1.171840"
    }
    const expected_fs_cc_Cookie: ArchwayCookie = {
        cookieName: "fs-cc",
        chainerToUse: "contain",
        valueToChain: "%2522%252C%2522consents%2522%253A%257B%2522analytics%2522%253Atrue%252C%2522essential%2522%253Atrue%252C%2522marketing%2522%253Atrue%252C%2522personalization%2522%253Atrue%252C%2522uncategorized%2522%253Atrue%257D%257D"
    }
    const expected_fs_cc_updated_Cookie: ArchwayCookie = {
        cookieName: "fs-cc-updated",
        chainerToUse: "equal",
        valueToChain: "true"
    }
    // unique UUID, verify only the pattern;
    const expected_intercom_device_id_w06r82km_Cookie: ArchwayCookie = {
        cookieName: "intercom-device-id-w06r82km",
        chainerToUse: "match", valueToChain: new RegExp(UUID_PATTERN)
    }
    // unique UUID, verify only the pattern;
    const expected_intercom_id_w06r82km_Cookie: ArchwayCookie = {
        cookieName: "intercom-id-w06r82km",
        chainerToUse: "match", valueToChain: new RegExp(UUID_PATTERN)
    }
    const expected_intercom_session_w06r82km_Cookie: ArchwayCookie = {
        cookieName: "intercom-session-w06r82km",
        chainerToUse: "equal", valueToChain: ""
    }

    it(`Clicking "Accept All Cookies" button stores all ${EXPECTED_ARCHWAY_COOKIE_COUNT} cookies in App storage`, () => {
        cy.log("**Verify 'Accept All Cookies' Functionality**")
        // wait for "chat" button to appear before checking the cookies as they get fully stored only after the last API response which makes chat window to appear:
        cy.log('wait for "chat" button to appear')
        cy.get(CHAT_BTN_LOCATOR, {timeout: 25000, log: true}).should('be.visible')

        cy.log('*click* Accept All Cookies button')
        cy.get(ACCEPT_BTN_LOCATOR, {timeout: 8000, log: true}).should('be.visible')
        cy.get(ACCEPT_BTN_LOCATOR).click()

        const waitTime: number = 3200
        cy.log(`*wait* "${waitTime}" milliseconds for API response to appear`)
        cy.wait(waitTime)

        cy.log('Actual cookies:')

        cy.getAllCookies()
            .then((cookies) => {
                cy.log(`**All** cookies, count= **${cookies.length}**, data:`)

                cookies.sort(sortCookiesByDomainAscFn())
                cookies.forEach(function (currCookie, index) {
                    cy.log(`${index}: name= "${currCookie.name}", **domain= "${currCookie.domain}"**`)
                })
            })

        cy.getAllCookies()
            .then((cookies) => {
                let archwayCookies = cookies.filter(cookie => cookie.domain == archwayCookieDomain);
                cy.wrap(archwayCookies).should(($archwayCookies) => {
                    expect(archwayCookies.length).to.equal(EXPECTED_ARCHWAY_COOKIE_COUNT)
                })
                cy.log(`**Archway** cookies ONLY, count= **${archwayCookies.length}**, data:`)

                archwayCookies.sort(sortCookiesByNameAscFn())
                archwayCookies.forEach(function (currCookie, index) {
                    cy.log(`${index}: name= "${currCookie.name}", **domain= "${currCookie.domain}"**`)
                })
            })

        // verify all 8 Archway cookies are present and have matching values:
        cy.log('Assert all 8 Archway cookies are present and have matching values:')
        cy.getCookie(expected_ga_Cookie.cookieName).should('exist')
            .its('value')
            .should(expected_ga_Cookie.chainerToUse, expected_ga_Cookie.valueToChain)

        cy.getCookie(expected_ga_MLM_Cookie.cookieName).should('exist')
            .its('value').should(expected_ga_MLM_Cookie.chainerToUse, expected_ga_MLM_Cookie.valueToChain)

        cy.getCookie(expected_ga_X4V_Cookie.cookieName).should('exist')
            .its('value').should(expected_ga_X4V_Cookie.chainerToUse, expected_ga_X4V_Cookie.valueToChain)

        cy.getCookie(expected_fs_cc_Cookie.cookieName).should('exist')
            .its('value').should(expected_fs_cc_Cookie.chainerToUse, expected_fs_cc_Cookie.valueToChain)

        cy.getCookie(expected_fs_cc_updated_Cookie.cookieName).should('exist')
            .its('value').should(expected_fs_cc_updated_Cookie.chainerToUse, expected_fs_cc_updated_Cookie.valueToChain)

        cy.getCookie(expected_intercom_device_id_w06r82km_Cookie.cookieName).should('exist')
            .its('value')
            .should(expected_intercom_device_id_w06r82km_Cookie.chainerToUse
                , expected_intercom_device_id_w06r82km_Cookie.valueToChain)

        cy.getCookie(expected_intercom_id_w06r82km_Cookie.cookieName).should('exist')
            .its('value')
            .should(expected_intercom_id_w06r82km_Cookie.chainerToUse
                , expected_intercom_id_w06r82km_Cookie.valueToChain)

        cy.getCookie(expected_intercom_session_w06r82km_Cookie.cookieName).should('exist')
            .its('value').should(expected_intercom_session_w06r82km_Cookie.chainerToUse
            , expected_intercom_session_w06r82km_Cookie.valueToChain)


    })

    const COOKIE_SETTINGS_TITLE_LOCATOR: string = 'div.ck-modal:not(.small) div[class*="heading-24px"]';
    const STRICTLY_N_RADIO_LOCATOR: string = 'div.radio-wrapper.cookies.is--not-allowed.w-clearfix';
    const MARKETING_RADIO_LOCATOR: string = 'div.w-checkbox-input:has(~ span[for="fs__marketing-2"])';
    const MARKETING_RADIO_TEXT_LOCATOR: string = 'div.w-checkbox-input ~ span[for="fs__marketing-2"]';
    const PERSONALIZATION_RADIO_LOCATOR: string = 'div.w-checkbox-input:has(~ span[for="fs__personalization-2"])';
    const PERSONALIZATION_RADIO_TEXT_LOCATOR: string = 'div.w-checkbox-input ~ span[for="fs__personalization-2"]';
    const ANALYTICS_RADIO_LOCATOR: string = 'div.w-checkbox-input:has(~ span[for="fs__analytics-2"])';
    const ANALYTICS_RADIO_TEXT_LOCATOR: string = 'div.w-checkbox-input ~ span[for="fs__analytics-2"]';
    const SAVE_SETTINGS_BTN_LOCATOR: string = 'div.ck-button__txt:contains("Save Settings")';


    it('Verify \'Cookie Settings\' Functionality', () => {
        cy.log("**Verify 'Cookie Settings' Functionality**")
        // wait for "chat" button to appear before checking the cookies as they get fully stored only after the last API response which makes chat window to appear:
        cy.log('wait for "chat" button to appear')
        cy.get(CHAT_BTN_LOCATOR, {timeout: 25000, log: true}).should('be.visible')
        cy.get(COOKIE_SETTINGS_BTN_LOCATOR).click()

        // validate all cookie settings dialogue elements:
        // Title:
        cy.get(COOKIE_SETTINGS_TITLE_LOCATOR).should('be.visible')
        cy.get(COOKIE_SETTINGS_TITLE_LOCATOR).should('have.text', 'Cookie Settings')

        // radio buttons (Strictly necessary, Marketing, Personalization, Analytics):
        cy.get(STRICTLY_N_RADIO_LOCATOR).should('be.visible')
        cy.get(STRICTLY_N_RADIO_LOCATOR).find('.radio-label').should('have.text', 'Strictly Necessary (Always Active)')

        cy.get(MARKETING_RADIO_LOCATOR).should('be.visible')
        cy.get(MARKETING_RADIO_TEXT_LOCATOR).should('have.text', 'Marketing')

        cy.get(PERSONALIZATION_RADIO_LOCATOR).should('be.visible')
        cy.get(PERSONALIZATION_RADIO_TEXT_LOCATOR).should('have.text', 'Personalization')

        cy.get(ANALYTICS_RADIO_LOCATOR).should('be.visible')
        cy.get(ANALYTICS_RADIO_TEXT_LOCATOR).should('have.text', 'Analytics')

        // Save settings button:
        cy.get(SAVE_SETTINGS_BTN_LOCATOR).should('be.visible')
        cy.get(SAVE_SETTINGS_BTN_LOCATOR).should('have.text', 'Save Settings')


        // click "Marketing" radio button and assert changes
        cy.get(MARKETING_RADIO_LOCATOR).click()
        cy.get(MARKETING_RADIO_LOCATOR).should('have.class', 'w--redirected-checked')

        // click Save settings
        cy.get(SAVE_SETTINGS_BTN_LOCATOR).click()

    })

    it("Verify 'Deny All Cookies' Functionality", () => {
        cy.log("**Verify 'Deny All Cookies' Functionality**")
        cy.log("cookie 'fs-cc-updated' is **NOT** stored")

        // wait for "chat" button to appear before checking the cookies as they get fully stored only after the last API response which makes chat window to appear:
        cy.log('wait for "chat" button to appear')
        cy.get(CHAT_BTN_LOCATOR, {timeout: 25000, log: true}).should('be.visible')

        cy.get(DENY_BTN_LOCATOR).click()

        //verify fs-cc-updated cookie doesn't exist:
        cy.getCookie(expected_fs_cc_updated_Cookie.cookieName).should('not.exist')

    })
})

function sortCookiesByDomainAscFn() {
    return (a: Cypress.Cookie, b: Cypress.Cookie) => {
        if (a.domain > b.domain) {
            return 1;
        }
        if (a.domain < b.domain) {
            return -1;
        }
        return 0;
    };
}

function sortCookiesByNameAscFn() {
    return (a: Cypress.Cookie, b: Cypress.Cookie) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    };
}