export default function sitemap() {
  const baseUrl = "https://affordthiscar.com";

  const prices = [
    15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000,
    55000, 60000, 70000, 80000, 90000, 100000,
  ];

  const incomes = [
    30000, 40000, 50000, 60000, 70000,
    80000, 90000, 100000, 120000, 150000,
  ];

  const urls: { url: string; lastModified: Date }[] = [];

  const staticPages = [
    "",
    "/compare",
    "/ownership-cost",
    "/deal-review",
  ];

  staticPages.forEach((path) => {
    urls.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    });
  });

  prices.forEach((price) => {
    urls.push({
      url: `${baseUrl}/can-i-afford-a/${price}`,
      lastModified: new Date(),
    });

    urls.push({
      url: `${baseUrl}/car-payment/${price}`,
      lastModified: new Date(),
    });

    urls.push({
      url: `${baseUrl}/income-needed/${price}`,
      lastModified: new Date(),
    });

    urls.push({
      url: `${baseUrl}/fr/puis-je-me-permettre-une-voiture/${price}`,
      lastModified: new Date(),
    });

    urls.push({
      url: `${baseUrl}/fr/paiement-auto/${price}`,
      lastModified: new Date(),
    });

    urls.push({
      url: `${baseUrl}/es/puedo-permitirme-un-auto/${price}`,
      lastModified: new Date(),
    });

    urls.push({
      url: `${baseUrl}/es/pago-auto/${price}`,
      lastModified: new Date(),
    });
  });

  incomes.forEach((income) => {
    urls.push({
      url: `${baseUrl}/salary/${income}`,
      lastModified: new Date(),
    });

    urls.push({
      url: `${baseUrl}/fr/salaire/${income}`,
      lastModified: new Date(),
    });

    urls.push({
      url: `${baseUrl}/es/salario/${income}`,
      lastModified: new Date(),
    });
  });

  return urls;
}