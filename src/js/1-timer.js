import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {

    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        message: "Please choose a date in the future",
      });
      startButton.disabled = true;
      userSelectedDate = null;
      return;
    }
    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr(datetimePicker, options);

function convertMs(ms) {
    const second = 1000; const minute = second * 60;
    const hour = minute * 60; const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    return { days, hours, minutes, seconds };
}
function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}
function updateTimer(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);
    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
}
startButton.addEventListener("click", () => {
    startButton.disabled = true;
    datetimePicker.disabled = true;
    
    updateTimer(userSelectedDate.getTime() - Date.now());

    const timerId = setInterval(() => {
        const deltaTime = userSelectedDate.getTime() - Date.now();

        if (deltaTime <= 0) {
            clearInterval(timerId);
            updateTimer(0);
            datetimePicker.disabled = false;
            return;
        }

        updateTimer(deltaTime);
    }, 1000);
});