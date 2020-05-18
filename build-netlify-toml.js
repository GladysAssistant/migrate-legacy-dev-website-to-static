const fs = require("fs");

const modulesFr = require("./build/modules.fr.json");
const modulesEn = require("./build/modules.en.json");

function getRedirects(idModule, slug, lang) {
  const infos = `
    [[redirects]]
      from = "/api/v1/modules/${slug}"
      to = "/build/modules/${slug}.${lang}.json"
      query = {lang = "${lang}"}
      status = 200
      force = true

  `;

  const reviews = `
    [[redirects]]
      from = "/api/v1/modules/${idModule}/reviews"
      to = "/build/reviews/${idModule}.json"
      status = 200
      force = true

  `;

  const versions = `
    [[redirects]]
      from = "/api/v1/modules/${idModule}/versions"
      to = "/build/versions/${idModule}.json"
      status = 200
      force = true

  `;

  return infos + reviews + versions;
}

let allRedirects = "";

modulesFr.forEach((module) => {
  allRedirects += getRedirects(module.idModule, module.slug, "fr");
});

modulesEn.forEach((module) => {
  allRedirects += getRedirects(module.idModule, module.slug, "en");
});

fs.writeFileSync("./netlify.toml", allRedirects);
