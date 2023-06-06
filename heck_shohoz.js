const puppeteer = require('puppeteer-core');
const url = `https://www.shohoz.com/booking/bus/search?fromcity=Dhaka&tocity=Chittagong&doj=16-Mar-2023&dor=`;

var heckit = async () => {
  const browser = await puppeteer.launch({
     executablePath: '/usr/bin/chromium',
     headless:false ,
    });
const page = await browser.newPage();
await page.goto(url)
await page.waitForSelector(".view-seats-spinner")
var bookbtn = await page.$$('.view-seats-spinner');
//bookbtn[5].click();
console.log('total',bookbtn.length);

for(var i = 0 ; i< bookbtn.length ; i++){
   var page2 =  await browser.newPage();
   await page2.goto(url);
   await page2.waitForSelector('.view-seats-spinner');
//    await page2.evaluate(()=>{
//     maxTickets = 10000000000000000 ;
//   })
    var btn = await page2.$$('.view-seats-spinner');
    btn[i].click();
    await page2.waitForSelector('.seat');
    var seats =  await page2.$$('.seat:not(.booked)');
    console.log(seats.length , 'seats have been Booked');
    await page2.evaluate(()=>{
        maxTickets = 100000000000000;
        var seats =document.querySelectorAll(".seat:not(.booked)")
        seats.forEach(res => { chooseSeat(res)});
    })
  }
  await browser.close();
  console.log('done with one heck');
};
heckit();


//setInterval(heckit , 3.4*1000*60)