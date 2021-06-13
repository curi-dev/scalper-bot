const puppeteer = require('puppeteer');

async function scalper() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(
        'https://www.nike.com.br/masculino?p=1&Fabricante=&Filtros=Tipo+de+Produto%3ACal%E7ados&cor=&tamanho=&precode=&precoate=&ofertas=sim&ordenacao=0&limit=24&ordemFiltro=Tipo+de+Produto'
    );

    const images = await page.evaluate(() => {
        let allProductsNodes = document.querySelectorAll('.produto');
        let allProductsList = [...allProductsNodes];
        
        let images = [];
        allProductsList.forEach(product => {
            let priceElement = product.querySelector('.produto__preco_por.ws-nr');
            let splittedPrice = priceElement.textContent.split(' ');
            let price = parseFloat(splittedPrice[1]);
            if (price <= 500) {
                let imageNode = product.querySelector('.produto__imagem.aspect-radio-box img');
                if (imageNode.hasAttribute('data-src')) {
                    let imageSource = imageNode.attributes[1].textContent;
                    images.push(imageSource);
                }
            }
        })

        return images;
    }).catch(e => console.log({ error: e }));

    let idx = 0;
    for await (image of images) {
        idx++;
        await page.goto(image)
        await page.screenshot({ path: `image_${idx}.png` });        
    }
    
    await browser.close();
    return images;
}

module.exports = scalper;
