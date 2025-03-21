const { Builder, By, Key, until } = require("selenium-webdriver");

// Constants for test cases
const BASE_URL = "http://localhost:3000";
const DASHBOARD_URL = `${BASE_URL}/dashboard`;
const LOGIN_URL = `${BASE_URL}/login`;
const SIGNUP_URL = `${BASE_URL}/sign-up`;
const GUEST_ALERT = "You are trying the app as a guest. Your budgets won't be saved.";
const LOGIN_SUCCESS_ALERT = "Login successful!";
const SIGNOUT_ALERT = "You have been signed out.";
const LOGIN_FAIL_ERROR = "Invalid credentials, please try again.";

// Helper function to login
async function login(driver, email, password) {
    await driver.get(LOGIN_URL);
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.name("password")).sendKeys(password);
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
}

////////////////////////////////////////// Test Cases For Login Page //////////////////////////////////////////

// Test Case 5: Login Successful Redirect
// Input: valid email and password
// Expected output: Application successfully redirects to Dashboard Page.
(async function loginRedirectTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await login(driver, "john.doe@example.com", "password123");

        // Wait for redirect
        await driver.wait(until.urlIs(DASHBOARD_URL), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === DASHBOARD_URL) {
            console.log("Test Case 5 Passed: 🟢 Login successful. Redirected to Dashboard page!");
        } else {
            console.log("Test Case 5 Failed: 🔴 Login unsuccessful.");
        }
    }
    finally {
        await driver.quit();
    }
})();

// Test Case 6: Login Successful Alert
// Input: valid email and password
// Expected output: Alert popup with message "Login successful!".
(async function loginAlertTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await login(driver, "jane.smith@example.com", "mypassword456");

        // Wait for alert
        await driver.wait(until.alertIsPresent(), 10000);

        // Get Alert Text
        let alert = await driver.switchTo().alert();
        let alertText = alert.getText();

        // Verify alert message
        if(alertText === LOGIN_SUCCESS_ALERT) {
            console.log("Test Case 6 Passed: 🟢 Alert displayed: Login successful!");
        } else {
            console.log("Test Case 6 Failed: 🔴 Alert not displayed.");
        }

        await alert.accept();

    } finally {
        await driver.quit();
    }
})();

// Test Case 7: Login Failure Alert
// Input: invalid email and password
// Expected output: Error message "Invalid credentials, please try again." is displayed.
(async function failedLoginErrorMessageTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await login(driver, "wrong@example.com", "wrongpassword");

        // Wait for the error message to appear
        let errorElement = await driver.wait(until.elementLocated(By.css(".error-message")), 10000);
        let errorText = await errorElement.getText();

        // Verify error message
        if(errorText === LOGIN_FAIL_ERROR) {
            console.log("Test Case 7 Passed: 🟢 Alert displayed: Invalid credentials, please try again.");
        } else {
            console.log("Test Case 7 Failed: 🔴 Alert not displayed.");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 8: Sign Out Alert
// Input: Click on Sign Out button
// Expected output: Alert popup with message "You have been signed out.".
(async function signoutAlertTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await login(driver, "jane.smith@example.com", "mypassword456");

        await driver.get(LOGIN_URL);

        await driver.wait(until.elementLocated(By.className("signout-button")), 5000);
        await driver.findElement(By.className("signout-button")).click();

        // Wait for alert
        await driver.wait(until.alertIsPresent(), 10000);

        // Get Alert Text
        let alert = await driver.switchTo().alert();
        let alertText = alert.getText();

        // Verify alert message
        if(alertText === SIGNOUT_ALERT) {
            console.log("Test Case 8 Passed: 🟢 Alert displayed: You have been signed out.");
        } else {
            console.log("Test Case 8 Failed: 🔴 Alert not displayed.");
        }
        await alert.accept();

    } finally {
        await driver.quit();
    }
})();

// Test Case 9: Sign Out Redirect
// Input: Click on Sign Out button
// Expected output: Application successfully redirects to Login Page.
(async function signoutRedirectTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await login(driver, "jane.smith@example.com", "mypassword456");

        await driver.get(LOGIN_URL);

        await driver.wait(until.elementLocated(By.className("signout-button")), 5000);
        await driver.findElement(By.className("signout-button")).click();

        // Wait for alert to appear and accept it
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();
        await alert.accept();

        // Wait for redirect
        await driver.wait(until.urlIs("http://localhost:3000/"), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === "http://localhost:3000/") {
            console.log("Test Case 9 Passed: 🟢 Sign Out successful. Redirected to Home page!");
        } else {
            console.log("Test Case 9 Failed: 🔴 Sign Out unsuccessful.");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 10: Signed in user redirect
// Input: User is already signed in
// Expected output: Redirect to Dashboard Page.
(async function signedinUserRedirectTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await login(driver, "jane.smith@example.com", "mypassword456");

        await driver.get(LOGIN_URL);

        // Wait for redirect
        await driver.wait(until.urlIs(DASHBOARD_URL), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === DASHBOARD_URL) {
            console.log("Test Case 10 Passed: 🟢 Redirected to Dashboard page!");
        } else {
            console.log("Test Case 10 Failed: 🔴 Redirect unsuccessful.");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 11: Guest user alert
// Input: Click on Guest user button
// Expected output: Alert popup with message "You are trying the app as a guest. Your budgets won't be saved.".

(async function guestUserAlertTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get(LOGIN_URL);

        await driver.wait(until.elementLocated(By.className("guest-access-button")), 5000);
        await driver.findElement(By.className("guest-access-button")).click();

        // Wait for alert
        await driver.wait(until.alertIsPresent(), 10000);

        // Get Alert Text
        let alert = await driver.switchTo().alert();
        let alertText = alert.getText();

        // Verify alert message
        if(alertText === GUEST_ALERT) {
            console.log("Test Case 11 Passed: 🟢 Alert displayed: You are trying the app as a guest. Your budgets won't be saved.");
        } else {
            console.log("Test Case 11 Failed: 🔴 Alert not displayed.");
        }
        await alert.accept();

    } finally {
        await driver.quit();
    }
})();

// Test Case 12: Guest user redirect
// Input: Click on Guest user button
// Expected output: Application successfully redirects to Dashboard Page.
(async function guestUserRedirectTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get(LOGIN_URL);

        await driver.wait(until.elementLocated(By.className("guest-access-button")), 5000);
        await driver.findElement(By.className("guest-access-button")).click();

        // Wait for alert to appear and accept it
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();
        await alert.accept();

        // Wait for redirect
        await driver.wait(until.urlIs(DASHBOARD_URL), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === DASHBOARD_URL) {
            console.log("Test Case 12 Passed: 🟢 Guest user redirected to Dashboard page!");
        } else {
            console.log("Test Case 12 Failed: 🔴 Redirect unsuccessful.");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 13: Sign Up Redirect
// Input: Click on Sign Up button
// Expected output: Application successfully redirects to Sign Up Page.
(async function signupRedirectTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get(LOGIN_URL);

        await driver.wait(until.elementLocated(By.linkText("Sign Up")), 5000);
        await driver.findElement(By.linkText("Sign Up")).click();

        // Wait for redirect
        await driver.wait(until.urlIs(SIGNUP_URL), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === SIGNUP_URL) {
            console.log("Test Case 13 Passed: 🟢 Sign Up button clicked. Redirected correctly!");
        } else {
            console.log("Test Case 13 Failed: 🔴 Sign Up button not clicked.");
        }
    } finally {
        await driver.quit();
    }
})();
