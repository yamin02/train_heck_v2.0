const puppeteer = require('puppeteer-core');

(async () => {

  const browser = await puppeteer.launch({
     executablePath: '/usr/bin/chromium',
     headless:false ,
    });
const page = await browser.newPage();
await page.goto('https://eticket.railway.gov.bd/login/en')
//   await page.goto('https://eticket.railway.gov.bd/booking/train/search?fromcity=Dhaka&tocity=Chittagong&doj=18-Apr-2022&class=AC_S');
//   await page.screenshot({ path: 'example.png' });
await page.type('#mobile_number' , '01829975343')
await page.type('#password','chandanpura');
await page.click('.login-form-submit-btn');
//await page.click('.nid-verfication-flow-skip-btn');
await page.waitForSelector(".nid-verfication-flow-skip-btn")
//await page.waitForTimeout(3000);

await page.goto('https://eticket.railway.gov.bd/booking/train/search?fromcity=Dhaka&tocity=Chattogram&doj=19-Feb-2023&class=SNIGDHA');
await page.waitForSelector('.book-now-btn');

var bookbtn = await page.$$('.book-now-btn');
//bookbtn[5].click();
console.log('total',bookbtn.length);
for(var i = 0 ; i< bookbtn.length ; i++){
    var page2 =  await browser.newPage();
    await page2.goto('https://eticket.railway.gov.bd/booking/train/search?fromcity=Dhaka&tocity=Chattogram&doj=19-Feb-2023&class=SNIGDHA');
    await page2.evaluate(()=>{
      maxTickets = 100000000;
      console.log(maxTickets);
     // document.querySelectorAll('.trip-collapsible.trip-div[style*="display: none"]')[0].style.display = 'block'
     // document.querySelectorAll('div[style*="display: none"]')[1].style.display='' ;
  })
  await page2.waitForSelector('.seat-class-and-fare');
  await page2.evaluate(()=>{
    //this is to solve the chattala express minimize issue which is not yet solved
    document.querySelectorAll('.trip-collapsible.trip-div[style*="display: none"]').forEach(pes =>{
      pes.style.display = 'block'
    })
  })
    await page2.waitForSelector('.book-now-btn');
    var btn = await page2.$$('.book-now-btn');
    console.log('btn' , btn.length)
    btn[0].click();
    await page2.waitForSelector('.seat-available');
    var seats =  await page2.$$('.seat-available');
    console.log(seats.length , 'seat hecked');
    await page2.evaluate(()=>{
      var seats =document.querySelectorAll('.seat-available')
      seats.forEach(element => {
        chooseSeat(element)
      });
    })
    // Need to solve the issue of chattala express ( which stay minimized with display : none BUT Everything else is just fine like wine )
    console.log('hocche two');

  }
}
)();