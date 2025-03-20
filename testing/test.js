const { Builder, By, Key, until } = require("selenium-webdriver");

(async function loginTest() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("https://lesso.help/login");

        await driver.findElement(By.id("username")).sendKeys("username1");
        await driver.findElement(By.id("password")).sendKeys("password1");
        await driver.findElement(By.xpath("//button[@type='submit']")).click();

        // Wait for redirect
        await driver.wait(until.urlIs("https://lesso.help/"), 10000);

        // Verify login success
        let currentURL = await driver.getCurrentUrl();
        if (currentURL === "https://lesso.help/") {
            console.log("✅ Login successful. Redirected correctly!");
        } else {
            console.log("❌ Login failed.");
        }
    } finally {
        await driver.quit();
    }
})();