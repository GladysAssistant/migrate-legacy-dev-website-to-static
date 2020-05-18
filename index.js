const fs = require("fs");
const got = require("got");
const path = require("path");
const Promise = require("bluebird");

const BASE_FOLDER_PATH = "./build";
const REVIEWS_FOLDER_PATH = "./build/reviews";
const MODULES_FOLDER_PATH = "./build/modules";
const VERSIONS_FOLDER_PATH = "./build/versions";

async function getModuleReviews(moduleId) {
  const reviews = await got(
    `https://developer.gladysassistant.com/api/v1/modules/${moduleId}/reviews`,
    { responseType: "json", resolveBodyOnly: true }
  );
  fs.writeFileSync(
    path.join(REVIEWS_FOLDER_PATH, `${moduleId}.json`),
    JSON.stringify(reviews)
  );
}

async function getModuleInfo(slug, lang) {
  const infos = await got(
    `https://developer.gladysassistant.com/api/v1/modules/${slug}?lang=${lang}`,
    { responseType: "json", resolveBodyOnly: true }
  );
  fs.writeFileSync(
    path.join(MODULES_FOLDER_PATH, `${slug}.${lang}.json`),
    JSON.stringify(infos)
  );
}

async function getModuleVersion(moduleId) {
  const versions = await got(
    `https://developer.gladysassistant.com/api/v1/modules/${moduleId}/versions`,
    { responseType: "json", resolveBodyOnly: true }
  );
  fs.writeFileSync(
    path.join(VERSIONS_FOLDER_PATH, `${moduleId}.json`),
    JSON.stringify(versions)
  );
}

async function getModules(lang) {
  const modules = await got(
    `https://developer.gladysassistant.com/api/v1/modules?lang=${lang}`,
    { responseType: "json", resolveBodyOnly: true }
  );
  fs.writeFileSync(
    path.join(BASE_FOLDER_PATH, `modules.${lang}.json`),
    JSON.stringify(modules)
  );
  await Promise.map(
    modules,
    async (module) => {
      console.log(`Getting module ${module.name}`);
      await getModuleVersion(module.idModule);
      await getModuleInfo(module.slug, lang);
      await getModuleReviews(module.idModule);
    },
    { concurrency: 1 }
  );
}

(async () => {
  await getModules("fr");
  await getModules("en");
})();
