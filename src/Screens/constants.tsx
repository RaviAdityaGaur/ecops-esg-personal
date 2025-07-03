let _API_BASE_URL = 'https://dev-api.ecopshub.com';
let _SSO_SITE_URL = "https://dev-api.ecopshub.com";
let _IS_PRODUCTION = import.meta.env.PROD;


/*
if (process.env.NODE_ENV === "ecops-prod") {
    _API_BASE_URL = "https://api.ecopshub.com";
    _SSO_SITE_URL = "https://app.ecopshub.com";
    _IS_PRODUCTION = import.meta.env.PROD;
  } else if (process.env.NODE_ENV === "ecops-uat") {
    _API_BASE_URL = "https://dev-api.ecopshub.com";
    _SSO_SITE_URL = "https://dev-api.ecopshub.com";
    _IS_PRODUCTION = import.meta.env.PROD;
  } else if (process.env.NODE_ENV === "ecops-uat") {
    _API_BASE_URL = "https://uat-api.ecopshub.com";
    _SSO_SITE_URL = "https://uat-app.ecopshub.com";
    _IS_PRODUCTION = import.meta.env.PROD;
  } else {
    _API_BASE_URL = "http://localhost:8320";
    _SSO_SITE_URL = "http://localhost:3000";
    _IS_PRODUCTION = false;
  } 
*/

export const API_BASE_URL = _API_BASE_URL;
export const SSO_SITE = _SSO_SITE_URL;
export const IS_PRODUCTION = _IS_PRODUCTION;
