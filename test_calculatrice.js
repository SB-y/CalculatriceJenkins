const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async function testCalculatrice() {
    let options = new chrome.Options();
    options.addArguments(
        'headless',               // Mode headless obligatoire dans Docker
        'no-sandbox',             // Evite des problèmes de permissions
        'disable-dev-shm-usage',  // Evite les crashs mémoire
        'disable-gpu',            // Mode headless pur
        'window-size=1920,1080'   // Taille de fenêtre pour Selenium
    );

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Choisir le port en fonction de l'environnement
        const port = process.env.TEST_LOCAL ? "8082" : "8080";
        const url = `http://localhost:${port}/index.html`;

        console.log(`➡️  Test de la calculatrice sur ${url}`);
        await driver.get(url);

        const operateur = await driver.findElement(By.id("operation"));
        await driver.wait(until.elementIsVisible(operateur), 5000);

        const nbre1 = await driver.findElement(By.id("number1"));
        await driver.wait(until.elementIsVisible(nbre1), 5000);

        const nbre2 = await driver.findElement(By.id("number2"));
        await driver.wait(until.elementIsVisible(nbre2), 5000);

        const bouton = await driver.findElement(By.id("calculate"));
        const resultat = await driver.findElement(By.id("result"));

        // --- Test Addition ---
        await nbre1.sendKeys("1");
        await sleep(500);
        await nbre2.sendKeys("1");
        await sleep(500);
        await operateur.findElement(By.css('option[value="add"]')).click();
        await sleep(500);
        await bouton.click();
        await sleep(500);
        console.log(`1+1 = ${await resultat.getText()} / Test addition ok`);

        // --- Test Division par 0 ---
        await nbre2.clear();
        await sleep(500);
        await nbre2.sendKeys("0");
        await sleep(500);
        await operateur.findElement(By.css('option[value="divide"]')).click();
        await sleep(500);
        await bouton.click();
        await sleep(500);
        console.log(`1/0 = ${await resultat.getText()} / Test division ok`);

        // --- Test Entrée Invalide ---
        await nbre2.clear();
        await sleep(500);
        await nbre2.sendKeys("BLABLA");
        await sleep(500);
        await bouton.click();
        await sleep(500);
        console.log(`1+BLABLA = ${await resultat.getText()} / Test entrée invalide ok`);

        // --- Test Soustraction ---
        await nbre2.clear();
        await sleep(500);
        await nbre2.sendKeys("0");
        await sleep(500);
        await operateur.findElement(By.css('option[value="subtract"]')).click();
        await sleep(500);
        await bouton.click();
        await sleep(500);
        console.log(`1-0 = ${await resultat.getText()} / Test soustraction ok`);

    } finally {
        await driver.quit();
    }
})();