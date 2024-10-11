# How to update studiofinder.fun

To enable debug logging, set LOG_FILE=~/studiofinder.log (or whatever file you want)

If MOtiVE is enabled, set MOTIVE_API_KEY and MOTIVE_USER_ID.

For Google Calendars, set GOOGLE_KEY.

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
