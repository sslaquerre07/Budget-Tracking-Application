const { Builder, By, Key, until } = require("selenium-webdriver");

// Constants for test cases
const BASE_URL = "http://localhost:3000";
const HOME_URL = `${BASE_URL}/`;
const DASHBOARD_URL = `${BASE_URL}/dashboard`;
const LOGIN_URL = `${BASE_URL}/login`;
const SIGNUP_URL = `${BASE_URL}/sign-up`;
const SETTINGS_URL = `${BASE_URL}/settings`;

////////////////////////////////////////// Test Cases For Home Page //////////////////////////////////////////
// Test Case 1: Login Button
// Input: Click on Login button
// Expected output: Redirect to login page
(async function loginButtonTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get(HOME_URL);
        
        await driver.findElement(By.className("profile")).click();

        // Wait for redirect
        await driver.wait(until.urlIs(LOGIN_URL), 10000);

        // Verify login success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === LOGIN_URL) {
            console.log("Test Case 1 Passed: 🟢 Login button clicked. Redirected correctly!");
        } else {
            console.log("Test Case 1 Failed: 🔴 Login button not clicked.");
        }
    } finally {
        await driver.quit();
    }
})();

// // Test Case 2: Sign Up Button
// // Input: Click on Sign Up button
// // Expected output: Redirect to sign up page
// (async function signUpButtonTest() {
//     let driver = await new Builder().forBrowser("chrome").build();

//     try {
//         await driver.get(HOME_URL);
        
//         await driver.findElement(By.linkText("Sign Up")).click();

//         // Wait for redirect
//         await driver.wait(until.urlIs(SIGNUP_URL), 10000);

//         // Verify redirect success
//         let currentURL = await driver.getCurrentUrl();
//         if (currentURL === SIGNUP_URL) {
//             console.log("Test Case 2 Passed: 🟢 Sign Up button clicked. Redirected correctly!");
//         } else {
//             console.log("Test Case 2 Failed: 🔴 Sign Up button not clicked.");
//         }
//     } finally {
//         await driver.quit();
//     }
// })();

// Test Case 3: Settings Button
// Input: Click on Settings button
// Expected output: Redirect to settings page
// (async function settingsButtonTest() {
//     let driver = await new Builder().forBrowser("chrome").build();

//     try {
//         await driver.get(HOME_URL);
        
//         await driver.findElement(By.linkText("Settings")).click();

//         // Wait for redirect
//         await driver.wait(until.urlIs(SETTINGS_URL), 10000);

//         // Verify redirect success
//         let currentURL = await driver.getCurrentUrl();
//         if (currentURL === SETTINGS_URL) {
//             console.log("Test Case 3 Passed: 🟢 Settings button clicked. Redirected correctly!");
//         } else {
//             console.log("Test Case 3 Failed: 🔴 Settings button not clicked.");
//         }
//     } finally {
//         await driver.quit();
//     }
// })();

// Test Case 4: Dashboard Button
// Input: Click on Dashboard button
// Expected output: Redirect to dashboard page
(async function dashboardButtonTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get(HOME_URL);

        await driver.findElement(By.className("cta-primary")).click();

        // Wait for redirect
        await driver.wait(until.urlIs(DASHBOARD_URL), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === DASHBOARD_URL) {
            console.log("Test Case 4 Passed: 🟢 Dashboard button clicked. Redirected correctly!");
        } else {
            console.log("Test Case 4 Failed: 🔴 Dashboard button not clicked.");
        }
    } finally {
        await driver.quit();
    }
})();