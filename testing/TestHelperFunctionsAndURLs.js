const { Builder, By, Key, until } = require("selenium-webdriver");

const BASE_URL = "http://localhost:3000";
const HOME_URL = `${BASE_URL}/`;
const DASHBOARD_URL = `${BASE_URL}/dashboard`;
const LOGIN_URL = `${BASE_URL}/login`;
const SIGNUP_URL = `${BASE_URL}/sign-up`;

// Helper function to login
async function login(driver, email, password) {
    await driver.get(LOGIN_URL);
    await driver.findElement(By.name("email")).sendKeys(email);
    await driver.findElement(By.name("password")).sendKeys(password);
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
}

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

module.exports = {
    login,
    signin,
    BASE_URL,
    HOME_URL,
    DASHBOARD_URL,
    LOGIN_URL,
    SIGNUP_URL
};