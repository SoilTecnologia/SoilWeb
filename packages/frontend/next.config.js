/** @type {import('next').NextConfig} */
require('dotenv').config();
module.exports = {
  reactStrictMode: true,
  env: {
    COOKIE_SECRET: process.env.SECRET_COOKIE_PASSWORD,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  }
};
