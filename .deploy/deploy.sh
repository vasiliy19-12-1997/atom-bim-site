cd ~
cd ..
cd atom-bim-site
git pull origin main
npm run build:prod
cd ..
rm -rf /var/www/atom-bim-site/html
mv atom-bim-site/build /var/www/atom-bim-site/html