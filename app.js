
$(document).ready(function () {

    const myShedulePage = $("#myShedulePage");
    const addShedulePage = $("#addShedulePage");
    const goToaddShedule = $("#shaBtn");
    const addShedule = $("#shBtn");
    const goBack = $("#goBack");

    const weights = $("#weights");
    const spinning = $("#spinning");
    const surfing = $("#surfing");
    const hiking = $("#hiking");

    const activities = $("#activities");
    const noActivities = $("#noActivities");

    const selectDuration = $("#selectDuration");
    const selectTime = $("#itervalTime");

    let userData = [];
    let selectedItem;
    let duration = ["15min", "30min", "45min", "1h", "1h 30min", "2h", "2h 30min"];

    duration.forEach(element => {
        selectDuration.append(`<option value="${element}">${element}</option>`);
    });

    selectDuration.change(e => {
        selectTime.html("");
        inOrder();
    })

    goToaddShedule.click(e => goToSheduleActivityPage());
    goBack.click(e => goToMyShedulePage());
    addShedule.click(e => submitShedule());

    weights.click(e => selectActivity(weights));
    spinning.click(e => selectActivity(spinning));
    surfing.click(e => selectActivity(surfing));
    hiking.click(e => selectActivity(hiking));




    //Switch Pages
    function goToSheduleActivityPage() {
        myShedulePage.hide();
        addShedulePage.show();
        inOrder();
    }


    function goToMyShedulePage() {
        if (userData.length === 0) {
            noActivities.show();
            activities.hide()
        } else {
            userDays = getUserActiveDays(userData);
            appendActivities(userDays, userData);
            activities.show();
            noActivities.hide();
        }
        myShedulePage.show();
        addShedulePage.hide();
    }




    function selectActivity(element) {
        if (selectedItem) {
            selectedItem.css("background-color", "white");
            selectedItem.css("color", "orangered");
        }

        element.css("background-color", "orangered");
        element.css("color", "white");
        selectedItem = element;
    }



    let interval;
    function submitShedule() {
        if(selectedItem == undefined){
            return
        }
        let time = selectTime.val();

        let interval = intervalToNumber()[selectDuration.val()];
        let timeStart = new Date(time);
        let timeEnd = new Date(timeStart.getTime() + interval * 60000);

        let userActivity = new UserSheldues(selectedItem, timeStart, timeEnd);
        userData.push(userActivity);

        goToMyShedulePage();

    }



    // function addTimes(date, minutes) {
    //     return new Date(date.getTime() + minutes * 60000);
    // }


    function getNumberOfIntervals(interval) {
        const days = 7;
        const hours = 24;
        const minutes = 60;
        const fullInterval = days * hours * minutes;
        return numberOfIntervals = fullInterval / interval;
    }

    function getStartTime() {

        let now = new Date();
        let startMinutes = now.getMinutes();
        let restMinutes = 60 - startMinutes;
        let start = new Date(now.getTime() + restMinutes * 60000);
        return start;
    }


    function intervalToNumber(interval) {
        return {
            "15min": 15,
            "30min": 30,
            "45min": 45,
            "1h": 60,
            "1h 30min": 90,
            "2h": 120,
            "2h 30min": 150,
        };
    }


    function addIntervals(interval, startTime, numbersOfInterval) {
        selectTime.html("");
        for (let i = 0; i < numbersOfInterval; i++) {

            if(isUsed(startTime)) {
                newDate = new Date(startTime.getTime() + (interval * 60000));
                startTime = newDate; 
                continue;
            }
           
            selectTime.append(`<option value="${startTime}">${makeDateFormat(startTime)["result"]}</option>`);
            newDate = new Date(startTime.getTime() + (interval * 60000));
            startTime = newDate; 
      
        }
    }

    function isUsed(startTime){
        let resultt;
        userData.forEach(x => {
            
                if(x.endDate.getTime() > startTime.getTime()){
                    if(x.startDate.getHours() < startTime.getHours() ){
                        resultt = true;
                       
                    }else if(x.startDate.getHours() == startTime.getHours()){
                        if(x.startDate.getMinutes() <= startTime.getMinutes()){
                            resultt = true;
                        }
                    }
               
            }
           
        });
        return resultt;
    }

    function makeDateFormat(startTime) {
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octomber", "November", "December"];
        let day = startTime.getDay();

        let month = startTime.getMonth();
        let getDayinMonth = startTime.getDate();
        let hours = startTime.getHours();

        let minutes = startTime.getMinutes();
        let dayMonth = `${months[month]} ${getDayinMonth}`;
        let dayResult = `${days[day]}`;
        let time = `${hours}:${minutes == 0 ? "0" + minutes : minutes} ${hours > 12 ? "PM" : "AM"}` ;
        let restult = `${days[day]}, ${months[month]} ${getDayinMonth}th ${hours}:${minutes == 0 ? "0" + minutes : minutes}`;

        return {
            'dayMonth': dayMonth,
            'day': dayResult,
            'time': time,
            'result': restult
        }
    }


    inOrder();

    function inOrder() {

        //start date
        let startDate = getStartTime();

        //interval
        stringInterval = selectDuration.val();
        //numberofintervals
        interval = intervalToNumber()[stringInterval];

        //print in selecttime;
        let numberOfIntervals = getNumberOfIntervals(interval);

        //addIntervals
        addIntervals(interval, startDate, numberOfIntervals);

    }

    //Show Activities of the User


    function getUserActiveDays(userData) {
        let days = [];
        userData.forEach(el => {
            if (days.indexOf(el.startDate.getDay()) === -1) {
                days.push(el.startDate.getDay());
            }
        })
        return days;
    }

    function appendActivities(days, userData) {
        activities.html("");
        let dayss= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        days.forEach(el => {
            activities.append(`<div id="${el}" class="activ">
            <h2>${dayss[el]}</h2>  
        </div>`);
            userData.forEach(x => {

                if (x.startDate.getDay() === el) {
                     let test = $(`#${el}`);
                     test.append(`
                <div class="activeChild">            
                    <div class="circut actCircut">
                        ${returnIcon()[`${x.icon[0].id}`]}
                    </div>
                    <span>${makeDateFormat(x.startDate)["time"]}</span>
                </div>
                `)
                }
            })
        })
    }
  

    function returnIcon(){
        return {
            "surfing" : ` <i class="icofont-wind-waves ficon"></i>`,
            "weights" : ` <i class="icofont-dumbbell ficon"></i>`,
            "spinning" :  `<i class="icofont-cycling ficon"></i>`,
            "hiking" : `<i class="icofont-tracking ficon"></i>`
        }
    }


});

class UserSheldues {
    constructor(icon, startDate, endDate) {
        this.icon = icon;
        this.startDate = startDate;
        this.endDate = endDate;
    }

}