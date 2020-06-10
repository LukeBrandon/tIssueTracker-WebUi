const webpack = require('webpack')

let dotConfigPath;
switch (process.env.NODE_ENV) {
  case "local":
    dotConfigPath = "./env/.env.local";
    break;
  case "stage":
    dotConfigPath = "./env/.env.stage";
    break;
  case "production":
    dotConfigPath = "./env/.env.production";
    break;
  default:
    throw new Error("No Node Env");
}

const result = require("dotenv").config({
  path: dotConfigPath
});

if (result.error) {
  throw result.error;
}

const envOptions = {
  env: {
    API_URL: process.env.API_URL,
  },
  webpack: (config) => {
    config.plugins.push(
        new webpack.EnvironmentPlugin(process.env)
    );
    return config;
  }
};

const options = envOptions;

module.exports = options;