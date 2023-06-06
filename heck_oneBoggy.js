const puppeteer = require("puppeteer-core");
var chrome_dir = "/usr/bin/chromium";
var routes = [
  ["Chattogram", "Dhaka"],["Dhaka" , "Chattogram"]
];
var dates = [25];

(async () => {
  const browser = await puppeteer.launch(
  //   {
  //   executablePath: "/usr/bin/brave-browser",
  // //  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' ,
  //   headless: false,
  // }
  );
  const page = await browser.newPage();
  await page.goto("https://eticket.railway.gov.bd/login/en");
  await page.type("#mobile_number", "01818672900");
  await page.type("#password", "chandanpura");
  await page.click(".login-form-submit-btn");
  //await page.click('.nid-verfication-flow-skip-btn');
  await page.waitForSelector(".railway-ticket-search-submit-btn");
  while(true){
  for (var route of routes) {
    const url = `https://eticket.railway.gov.bd/booking/train/search?fromcity=${route[0]}&tocity=${route[1]}&doj=25-Apr-2023&class=SNIGDHA`;
    //await page.waitForTimeout(3000);

    await page.goto(url);
    await page.waitForSelector(".book-now-btn");
    var bookbtn = await page.$$(".book-now-btn");
    //bookbtn[5].click();
    console.log("total", bookbtn.length);
    //await page.close();
    //for(var i = 0 ; i< bookbtn.length ; i++){
      var i = 0 ;
    while (true) {
      var page2 = await browser.newPage();
      await page2.goto(url);
      await page2.waitForSelector(".seat-class-and-fare");
      await page2.evaluate(() => {
        //this is to solve the chattala express minimize issue which is not yet solved
        document
          .querySelectorAll(".trip-collapsible.trip-div")
          .forEach((pes) => {
            pes.style.display = "block";
          });
        maxTickets = 1000000000000;
        console.log(maxTickets);
      });
      await page2.waitForSelector(".book-now-btn");
      var btn = await page2.$$(".book-now-btn");
      var seat_availableDiv =  await page2.$$('.seat-availability-box')
      console.log("btn", btn.length);
      var button = await seat_availableDiv[1].$('.book-now-btn');
      if(!button){break;}
      button.click() ;
      //await page2.$$('.seat-availability-box')[1].querySelector('.book-now-btn').click()
      //btn[9].click();
      try{
        await page2.waitForSelector("#tickets_total",{timeout:2000})
      }catch(error){
        if (error.name === 'TimeoutError') {
        var button = await seat_availableDiv[10].$('.book-now-btn');
        button.click();        
        await page2.waitForSelector("#tickets_total");
        };
      }
      var seats = await page2.$$(".seat-available");
      console.log(seats.length, "seats have been Booked");
      await page2.evaluate(() => {
        var seats = document.querySelectorAll(".seat-available");
        seats.forEach((res) => {
          chooseSeat(res);
        });
      });
      // await page2.close();
      break ;

    }
    console.log('one route is done')
  }
  console.log("done with one heck");
  await new Promise(resolve => setTimeout(resolve, 1*60*1000));
  }
  //await browser.close();
  //};
})() ;

// heck() ;
// setInterval(()=>{
//     heck();
// },1000*60*1);
