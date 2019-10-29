import { fetchDailyTasks } from './clients/todoist';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'todoist.fetchDailyTasks':
      fetchDailyTasks(request.token).then(sendResponse);
      return true;
    default:
      console.error('Unknown type');
  }
});
