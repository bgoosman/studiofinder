const cheerio = require('cheerio');
const moment = require('moment');
let data = {};
module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        setValue: ({ key, value }) => {
          console.log('setValue', key, value);
          data[key] = value;
          return null;
        },
        getValue: ({ key }) => {
          return data[key] || null;
        },
        parseHtmlForSlots: ({ html, date }) => {
          console.log('parseHtmlForSlots', date);
          const $ = cheerio.load(html);
          const slots = [];
          $('.calendar-table tbody tr').each((i, el) => {
            const studioRow = $(el);
            const room = studioRow.find('td').eq(0).text();
            let startTime = 7;
            studioRow.find('td.tableAction').each(function () {
              const cell = $(this);
              if (cell.css('display') !== 'none') {
                const status = cell.text();
                const hours = Number(cell.attr('colspan')) / 2;
                if (status === 'Available') {
                  console.log(`Found ${hours} hours of availability in ${room} starting at ${startTime} on ${moment(date).format('YYYY-MM-DD')}`);
                  const start = moment(date)
                    .hour(startTime)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .toISOString();
                  const end = moment(date)
                    .hour(startTime + hours)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .toISOString();
                  const slot = {
                    room,
                    start,
                    end,
                  };
                  slots.push(slot);
                }
                startTime += hours;
              }
            });
          })
          return slots;
        },
      })
    },
  },
  video: false,
};