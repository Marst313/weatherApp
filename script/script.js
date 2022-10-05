'use strict';

// Selector
const dateContainer = document.querySelector('.date-full');
const positionContainer = document.querySelector('.current-position');
const curTempContainer = document.querySelector('.current-temperature');
const iconContinaer = document.querySelector('.rain-icon');
const windContainer = document.querySelector('.wind-speed');
const descriptionContainer = document.querySelector('.description-condition');
const weeklyContainer = document.querySelector('.weekly-container');
const conditionHoursContainer = document.querySelector('.date-hours');

//Selector weekly
const currentDayWeekly = document.querySelector('.current-day-weekly');
const currentHumadityWeekly = document.querySelector('.current-humadity-weekly');
const currentTempWeekly = document.querySelector('.current-temperature-weekly');

// day and Month
const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const init = function () {
  window.setInterval(date, 1000);

  let currentDay = 0;

  const maxDay = day.length;

  // Show the date text
  function date() {
    const d = new Date();
    const time = d.toLocaleTimeString('en-GB');
    const year = d.getFullYear().toString().slice(2, 4);
    currentDay = d.getDay();

    const months = month[d.getMonth()];
    const days = day[d.getDay()];
    const date = d.getDate();

    // Reveal the text date
    dateContainer.textContent = `${time} - ${days} ${date} ${months.slice(0, 3)}'${year}`;
  }

  const fahrentheitToCelcius = function (num) {
    const hasil = ((num - 32) * 5) / 9;

    return `${Math.ceil(hasil)}°`;
  };

  // Getting current position using location
  const getPosition = function () {
    return new Promise(function (resolve) {
      navigator.geolocation.getCurrentPosition(resolve, function () {
        alert('Cannot get your position !');
      });
    });
  };

  const getWeather = function () {
    getPosition()
      .then((data) => {
        const { latitude: lat, longitude: longt } = data.coords;

        return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${longt}&localityLanguage=en`);
      })
      .then((response) => {
        if (!response.ok) alert(`Cannot get current position`);

        return response.json();
      })
      .then((data) => {
        return fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${data.locality}?unitGroup=us&key=NNS9LYV4KRXJ27464LBL69AGK&contentType=json`);
      })
      .then((response) => {
        if (!response.ok) throw new Error(`Cannot find your country ${response.status}`);

        return response.json();
      })
      .then((data) => {
        console.log(data);
        const conditionName = `${data.currentConditions.icon.slice(0, 1).toUpperCase()}${data.currentConditions.icon.slice(1)}`;

        // INIT APP
        positionContainer.textContent = `${data.resolvedAddress}`;
        curTempContainer.textContent = `${fahrentheitToCelcius(data.currentConditions.temp)}`;
        iconContinaer.textContent = conditionName;
        windContainer.textContent = Math.floor(data.currentConditions.windspeed);
        descriptionContainer.textContent = data.description;

        // create Icon
        const html = `<img src="public/img/icon/${conditionName}.png" alt="${conditionName}" /> `;
        iconContinaer.closest('div').insertAdjacentHTML('afterbegin', html);

        // create hours
        const perHours = data.days[0].hours;
        perHours.forEach((el, i) => {
          const time = el.datetime.slice(0, 5);
          const temp = el.temp;

          const htmlHours = ` <ul class="flex flex-col justify-center items-center mr-28 ">
          <li class="">${time}</li>
          <!-- icon  -->
          <li><img src="public/img/icon/${el.icon}.png" alt="" data-set="${i}" /></li>

          <li>${fahrentheitToCelcius(temp)}</li>
        </ul>`;

          conditionHoursContainer.insertAdjacentHTML('afterbegin', htmlHours);
        });

        for (let i = 0; i < 7; i++) {
          let days = day[currentDay++];
          if (currentDay === maxDay) {
            currentDay = 0;
          }
          // create condition per days
          const htmlDays = `<ul class="m-1 md:p-5 flex flex-col text-sm weekly-condition mr-28">
        <li data-set="${i}"  class="weekly-day">${days}</li>
        <li class="self-center mt-5 mb-5 day-temp">${fahrentheitToCelcius(data.days[i].temp)}</li>
        <li class="self-center"><img src="public/img/icon/humidity.png" alt="" data-set="${i}" /></li>
        <li class="mt-5 self-center ">${Math.ceil(data.days[i].humidity)} %</li>
      </ul>`;

          weeklyContainer.insertAdjacentHTML('afterbegin', htmlDays);
        }
        const weeklyCondition = document.querySelector(`.weekly-day[data-set="0"]`);
        weeklyCondition.classList.add('text-green-500');
      });
  };

  getWeather();
};
init();

// // current condition weekly
// currentDayWeekly.textContent = day[currentDay];
// currentHumadityWeekly.textContent = `${Math.ceil(data.currentConditions.humidity)} %`;
// // console.log(data.currentConditions.temp);
// currentTempWeekly.textContent = fahrentheitToCelcius(data.currentConditions.temp);
