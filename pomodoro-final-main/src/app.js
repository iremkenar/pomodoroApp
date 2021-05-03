import { getDataFromApi, addTaskToApi } from './data';
import { POMODORO_BREAK, POMODORO_WORK } from './constans';
import { getNow, addMinutes, getTimeRemaining } from './helpers/date';

class PomodoroApp {
  constructor(options) {
    let {
      tableTbodySelector,
      taskFormSelector,
      startButtonSelector,
      timerSelector,
      pauseButtonSelector,
    } = options;
    this.data = [];
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$startButton = document.querySelector(startButtonSelector);
    this.$pauseButton = document.querySelector(pauseButtonSelector);
    this.$timerEl = document.querySelector(timerSelector);
    this.currentInterval = null;
    this.currentRemaining = null;
    this.currentTask = null;
    this.breakInterval = null;
  }

  addTask(task) {
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.data = [...this.data, newTask];
        this.addTaskToTable(newTask);
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.setAttribute('data-taskId', `task${task.id}`);
    $newTaskEl.classList.add('task');
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}</td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      this.data = currentTasks;
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  initializeTimer(endTime) {
    this.currentInterval = setInterval(() => {
      const remainingTime = getTimeRemaining(endTime);
      const { total, minutes, seconds } = remainingTime;
      this.currentRemaining = total;
      this.$timerEl.innerHTML = minutes + ':' + seconds;
      if (total <= 0) {
        clearInterval(this.currentInterval);
        this.currentTask.completed = true;
        const now = getNow();
        const breakEndDate = addMinutes(now, POMODORO_BREAK);
        this.breakInterval = setInterval(() => {
          const remainingBreakTime = getTimeRemaining(breakEndDate);
          const { total, minutes, seconds } = remainingBreakTime;
          this.$timerEl.innerHTML =
            'Chill: ' +
            remainingBreakTime.minutes +
            ':' +
            remainingBreakTime.seconds;
          if (remainingBreakTime.total <= 0) {
            clearInterval(this.breakInterval);
            this.createNewTimer();
          }
        }, 1000);
      }
    }, 1000);
  }

  setActiveTask() {
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(($taskItem) => ($taskItem.style.background = '#fff'));
    this.currentTask = this.data.find((task) => !task.completed);
    const targetEl = document.querySelector(
      `tr[data-taskId = 'task${this.currentTask.id}']`
    );
    targetEl.style.background = 'red';
  }

  createNewTimer() {
    const now = getNow();
    const endDate = addMinutes(now, POMODORO_WORK);
    this.initializeTimer(endDate);
    this.setActiveTask();
  }

  handleStart() {
    this.$startButton.addEventListener('click', () => {
      const now = getNow();
      if (this.currentRemaining) {
        const remaining = new Date(now.getTime() + this.currentRemaining);
        this.initializeTimer(remaining);
      } else {
        this.createNewTimer();
      }
    });
  }

  handlePause() {
    this.$pauseButton.addEventListener('click', () => {
      clearInterval(this.currentInterval);
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
    this.handleStart();
    this.handlePause();
  }
}

export default PomodoroApp;
