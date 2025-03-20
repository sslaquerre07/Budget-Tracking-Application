const { Builder, By, until } = require("selenium-webdriver");
const { describe, it, before, after } = require("mocha");
const assert = require("assert");

describe("Login Page Tests", function () {
    let driver;

    // Increase default timeout since Selenium actions may take time
    this.timeout(20000);

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
    });

    after(async function () {
        await driver.quit();
    });

    // Test Case 1: Login and redirect to dashboard
    it("should login and redirect to dashboard", async function () {
        await driver.get("http://localhost:3000/login");

        await driver.findElement(By.name("username")).sendKeys("john.doe@example.com");
        await driver.findElement(By.name("password")).sendKeys("password123");
        await driver.findElement(By.xpath("//button[@type='submit']")).click();

        // Wait for redirect to dashboard
        await driver.wait(until.urlIs("http://localhost:3000/dashboard"), 10000);

        let currentURL = await driver.getCurrentUrl();
        assert.strictEqual(currentURL, "http://localhost:3000/dashboard");

        console.log("✅ Test Passed: Redirected to dashboard!");
    });

    // Test Case 2: Display alert with 'Login successful!' message
    it("should display alert with 'Login successful!' message", async function () {
        await driver.get("http://localhost:3000/login");

        await driver.findElement(By.name("username")).sendKeys("jane.smith@example.com");
        await driver.findElement(By.name("password")).sendKeys("mypassword456");
        await driver.findElement(By.xpath("//button[@type='submit']")).click();

        // Wait for alert
        await driver.wait(until.alertIsPresent(), 10000);

        // Get alert text
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();

        assert.strictEqual(alertText, "Login successful!");
        console.log("✅ Test Passed: Correct alert displayed.");

        await alert.accept();
    });
});
