# How to update studiofinder.fun

```
cd ~/studiofinder/packages/gibney
yarn start
cd ../finder
yarn resolve
sed -i '1d' dist/universe.json
cp dist/universe.json ../view/slots/
git add ~/studiofinder/packages/view/slots/universe.json
git commit -m "automated scrape on $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main
```
