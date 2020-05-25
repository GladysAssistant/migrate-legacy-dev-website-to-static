const fs = require("fs");

const NETLIFY_TOML_PATH = "./build/netlify.toml";

const modulesFr = require("./build/modules.fr.json");
const modulesEn = require("./build/modules.en.json");

function getRedirects(idModule, slug, lang) {
  const infos = `
    [[redirects]]
      from = "/api/v1/modules/${slug}"
      to = "/modules/${slug}.${lang}.json"
      query = {lang = "${lang}"}
      status = 200
      force = true

  `;

  const reviews = `
    [[redirects]]
      from = "/api/v1/modules/${idModule}/reviews"
      to = "/reviews/${idModule}.json"
      status = 200
      force = true

  `;

  const versions = `
    [[redirects]]
      from = "/api/v1/modules/${idModule}/versions"
      to = "/versions/${idModule}.json"
      status = 200
      force = true

  `;

  const saveDownload = `
     [[redirects]]
      from = "/api/v1/modules/${idModule}/download"
      to = "/versions/${idModule}.json"
      status = 200
      force = true
  `;

  return infos + reviews + versions + saveDownload;
}

let allRedirects = `
   [[headers]]
     # Define which paths this specific [[headers]] block will cover.
     for = "/*"
      [headers.values]
      Access-Control-Allow-Origin = "*"
   [[redirects]]
      from = "/api/gladys/version"
      to = "/last_version.json"
      status = 200
      force = true

    [[redirects]]
      from = "/api/v1/modules"
      to = "/modules.fr.json"
      query = {lang = "fr"}
      status = 200
      force = true
  
    [[redirects]]
      from = "/api/v1/modules"
      to = "/modules.en.json"
      status = 200
      force = true

`;

modulesFr.forEach((module) => {
  allRedirects += getRedirects(module.idModule, module.slug, "fr");
});

modulesEn.forEach((module) => {
  allRedirects += getRedirects(module.idModule, module.slug, "en");
});

fs.writeFileSync(NETLIFY_TOML_PATH, allRedirects);
