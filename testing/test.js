const { Builder, By, Key, until } = require("selenium-webdriver");

////////////////////////////////////////// Test Cases For Home Page //////////////////////////////////////////
// Test Case 1: Login Button
// Input: Click on Login button
// Expected output: Redirect to login page
(async function loginButtonTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("http://localhost:3000/");
        
        await driver.findElement(By.linkText("Login")).click();

        // Wait for redirect
        await driver.wait(until.urlIs("http://localhost:3000/login"), 10000);

        // Verify login success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === "http://localhost:3000/login") {
            console.log("Test Case 1 Passed: ✅ Login button clicked. Redirected correctly!");
        } else {
            console.log("Test Case 1 Failed: ❌ Login button not clicked.");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 2: Sign Up Button
// Input: Click on Sign Up button
// Expected output: Redirect to sign up page
(async function signUpButtonTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("http://localhost:3000/");
        
        await driver.findElement(By.linkText("Sign Up")).click();

        // Wait for redirect
        await driver.wait(until.urlIs("http://localhost:3000/sign-up"), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === "http://localhost:3000/sign-up") {
            console.log("Test Case 2 Passed: ✅ Sign Up button clicked. Redirected correctly!");
        } else {
            console.log("Test Case 2 Failed: ❌ Sign Up button not clicked.");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 3: Settings Button
// Input: Click on Settings button
// Expected output: Redirect to settings page
(async function settingsButtonTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("http://localhost:3000/");
        
        await driver.findElement(By.linkText("Settings")).click();

        // Wait for redirect
        await driver.wait(until.urlIs("http://localhost:3000/settings"), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === "http://localhost:3000/settings") {
            console.log("Test Case 3 Passed: ✅ Settings button clicked. Redirected correctly!");
        } else {
            console.log("Test Case 3 Failed: ❌ Settings button not clicked.");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 4: Dashboard Button
// Input: Click on Dashboard button
// Expected output: Redirect to dashboard page
(async function dashboardButtonTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("http://localhost:3000/");

        await driver.findElement(By.className("explore-button")).click();

        // Wait for redirect
        await driver.wait(until.urlIs("http://localhost:3000/dashboard"), 10000);

        // Verify redirect success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === "http://localhost:3000/dashboard") {
            console.log("Test Case 4 Passed: ✅ Dashboard button clicked. Redirected correctly!");
        } else {
            console.log("Test Case 4 Failed: ❌ Dashboard button not clicked.");
        }
    } finally {
        await driver.quit();
    }
})();

// Test Case 1: Login
// Input: valid username and password
// Expected output: Redirect to dashboard page
(async function loginTest1() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("http://localhost:3000/login");

        await driver.findElement(By.name("username")).sendKeys("john.doe@example.com");
        await driver.findElement(By.name("password")).sendKeys("password123");
        await driver.findElement(By.xpath("//button[@type='submit']")).click();

        // Wait for redirect
        await driver.wait(until.urlIs("http://localhost:3000/dashboard"), 10000);

        // Verify login success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === "http://localhost:3000/dashboard") {
            console.log("Test Case 1 Passed: ✅ Login successful. Redirected correctly!");
        } else {
            console.log("Test Case 2 Failed: ❌ Login failed.");
        }
    } finally {
        await driver.quit();
    }
})();

// // Test Case 2: Login
// // Input: valid username and password
// // Expected output: Alert popup with message "Login successful!".
// (async function loginTest2() {
//     let driver = await new Builder().forBrowser("chrome").build();

//     try {
//         await driver.get("http://localhost:3000/login");

//         await driver.findElement(By.name("username")).sendKeys("jane.smith@example.com");
//         await driver.findElement(By.name("password")).sendKeys("mypassword456");
//         await driver.findElement(By.xpath("//button[@type='submit']")).click();

//         // Wait for alert
//         await driver.wait(until.alertIsPresent(), 10000);

//         // Get Alert Text
//         let alert = await driver.switchTo().alert();
//         let alertText = alert.getText();

//         // Verify alert message
//         if(alertText === "Login successful!") {
//             console.log("Test Case 2 Passed: ✅ Alert displayed: Login successful!");
//         } else {
//             console.log("Test Case 2 Failed: ❌ Alert not displayed.");
//         }

//         await alert.accept();

//     } finally {
//         await driver.quit();
//     }
// })();

// // Test Case 3: change password
// // Input: valid email and password
// // Expected output: Alert popup with message "Login successful!".
// (async function changePasswordTest() {
//     let driver = await new Builder().forBrowser("chrome").build();

//     try {
//         await driver.get("http://localhost:3000/settings");

//         await driver.findElement(By.type("username")).sendKeys("jane.smith@example.com");
//         await driver.findElement(By.type("password")).sendKeys("changePassword456");
//         await driver.findElement(By.className("save-btn")).click();
        
//         // Wait until the message is visible
//         let messageElement = await driver.wait(
//             until.elementLocated(By.className("message")), 
//             5000
//         );
        
//         // Get the message text
//         let messageText = await messageElement.getText();

//         // Check message
//         if (messageText === "Password updated successfully!") {
//             console.log("Test Case 3 Passed: ✅ Password updated successfully!");
//         } else {
//             console.log("Test Case 3 Failed: ❌ Password update failed.");
//         }

//         await alert.accept();

//     } finally {
//         await driver.quit();
//     }
// })();