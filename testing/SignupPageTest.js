const { Builder, By, Key, until } = require("selenium-webdriver");

// Constants for test cases
const BASE_URL = "http://localhost:3000";
const DASHBOARD_URL = `${BASE_URL}/dashboard`;
const LOGIN_URL = `${BASE_URL}/login`;
const SIGNUP_URL = `${BASE_URL}/sign-up`;
const PASSWORD_ERROR_SHORT = "Password must be at least 6 characters long.";

////////////////////////////////////////// Test Cases For Signup Page //////////////////////////////////////////

// Test Case 13: Signup invalid 5-character password
// Input: Enter 5-character password
// Expected output: Password error message displayed
(async function invalidPasswordTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get(SIGNUP_URL);

        await driver.findElement(By.name("firstName")).sendKeys("P");
        await driver.findElement(By.name("lastName")).sendKeys("P");
        await driver.findElement(By.name("email")).sendKeys("test@testing.com");
        await driver.findElement(By.name("password")).sendKeys("12345");
        await driver.findElement(By.name("confirmPassword")).sendKeys("12345");
        await driver.findElement(By.xpath("//button[@type='submit']")).click();

        // Wait for the password error message to appear
        await driver.wait(until.elementLocated(By.className("error-message")), 5000);

        // Get error message text
        let errorMessageElement = await driver.findElement(By.className("error-message"));
        let errorMessage = await errorMessageElement.getText();
        console.log(`Error Message Displayed: "${errorMessage}"`);

        // Check error message
        if (errorMessage === PASSWORD_ERROR_SHORT) {
            console.log("Test Case 13 Passed: ✅ Password error message displayed correctly!");
        } else {
            console.log("Test Case 13 Failed: ❌ Password error message not displayed.");
        }
    } finally {
        await driver.quit();
    }
})();
