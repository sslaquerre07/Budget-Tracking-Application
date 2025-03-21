const { Builder, By, Key, until } = require("selenium-webdriver");

// Constants for test cases
const BASE_URL = "http://localhost:3000";
const DASHBOARD_URL = `${BASE_URL}/dashboard`;
const LOGIN_URL = `${BASE_URL}/login`;
const SIGNUP_URL = `${BASE_URL}/sign-up`;
const PASSWORD_ERROR_SHORT = "Password must be at least 6 characters long.";
const PASSWORD_ERROR_MATCH = "Passwords do not match.";
const EMAIL_EXISTS_ERROR = "Signup failed. Try again.";

// Helper function to signup
async function signin(driver, fname, lname, email, password, confirmpassword) {
    await driver.get(SIGNUP_URL);

    await driver.findElement(By.name("firstName")).sendKeys(fname);
    await driver.findElement(By.name("lastName")).sendKeys(lname);
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.name("password")).sendKeys(password);
    await driver.findElement(By.name("confirmPassword")).sendKeys(confirmpassword);
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
}

////////////////////////////////////////// Test Cases For Signup Page //////////////////////////////////////////

// Test Case 15: Signup invalid 5-character password
// Input: Enter 5-character password
// Expected output: Password error message displayed
(async function invalidPasswordTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // Sign up with 5-character password
        await signin(driver, "P", "P", "test@testing.com", "12345", "12345");

        // Wait for the password error message to appear
        await driver.wait(until.elementLocated(By.className("error-message")), 5000);

        // Get error message text
        let errorMessageElement = await driver.findElement(By.className("error-message"));
        let errorMessage = await errorMessageElement.getText();

        // DEBUG
        // console.log(`Error Message Displayed: "${errorMessage}"`);

        // Check error message
        if (errorMessage === PASSWORD_ERROR_SHORT) {
            console.log("Test Case 15 Passed: 🟢 Password error message displayed correctly!");
        } else {
            console.log("Test Case 15 Failed: 🔴 Password error message not displayed.");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 16: Signup invalid mismatched passwords
// Input: Enter mismatched passwords
// Expected output: Mismatched password error message displayed
(async function mismatchedPasswordsTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // Sign up with mismatched passwords
        await signin(driver, "P", "P", "test@testing.com", "password123", "passwordmismatched");

        // Wait for the confirm password error message to appear
        await driver.wait(until.elementLocated(By.className("error-message")), 5000);

        // Get error message text
        let errorMessageElement = await driver.findElement(By.className("error-message"));
        let errorMessage = await errorMessageElement.getText();


        // DEBUG
        // console.log(`Error Message Displayedd: "${errorMessage}"`);
        
        // Check error message
        if (errorMessage === PASSWORD_ERROR_MATCH) {
            console.log("Test Case 16 Passed: 🟢 Mismatched password error message displayed correctly!");
        } else {
            console.log("Test Case 16 Failed: 🔴 Mismatched password error message not displayed.");
        }
    } finally {
        await driver.quit();
    }
})();

/////// Note: This test case fails after the first run since the email is already registered to the database, there's no way to remove an email from the database
// Test Case 17: Signup Successful Redirect
// Input: Enter valid signup information
// Expected output: Redirect to login page
(async function signupRedirectTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // Sign up with valid information
        await signin(driver, "P", "P", "test@testing.com", "password123", "password123");

        // Wait for redirect
        await driver.wait(until.urlIs(LOGIN_URL), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === LOGIN_URL) {
            console.log("Test Case 17 Passed: 🟢 Signup successful. Redirected correctly!");
        } else {
            console.log("Test Case 17 Failed: 🔴 Signup failed.");
        }
    } finally {
        await driver.quit();
    }
})();

// Run this SQL query to remove the email from the database to run the test case again.
// DELETE FROM user WHERE email = 'test@testing.com';

// Test Case 18: Signup Existing Email
// Input: Enter an existing email
// Expected output: Email error message displayed
(async function existingEmailTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // Sign up with existing email
        await signin(driver, "P", "P", "john.doe@example.com", "password123", "password123");

        // Wait for the email error message to appear
        await driver.wait(until.elementLocated(By.className("error-message")), 5000);

        // Get error message text
        let errorMessageElement = await driver.findElement(By.className("error-message"));
        let errorMessage = await errorMessageElement.getText();

        // DEBUG
        // console.log(`Error Message Displayed: "${EMAIL_EXISTS_ERROR}"`);

        // Check error message
        if (errorMessage === EMAIL_EXISTS_ERROR) {
            console.log("Test Case 18 Passed: 🟢 \"Signup failed. Try again. error message displayed correctly!\"");
        } else {
            console.log("Test Case 18 Failed: 🔴 \"Signup failed. Try again. error message not displayed.\"");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 19: Login Button Redirect
// Input: Click on Login button
// Expected output: Redirect to login page
(async function loginButtonTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get(BASE_URL);
        
        await driver.findElement(By.css('a[href="/login"]')).click();

        // Wait for redirect
        await driver.wait(until.urlIs(LOGIN_URL), 10000);
        
        // Verify login success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === LOGIN_URL) {
            console.log("Test Case 19 Passed: 🟢 Login button clicked. Redirected correctly!");
        } else {
            console.log("Test Case 19 Failed: 🔴 Login button not clicked.");
        }
    } finally {
        await driver.quit();
    }
})();
