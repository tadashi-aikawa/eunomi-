import { TodoistClient } from './clients/todoist';

const todoistClient = new TodoistClient();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'todoist.fetchDailyTasks':
      todoistClient.setToken(request.token);
      todoistClient.fetchDailyTasks().then(sendResponse);
      return true;
    case 'todoist.closeTask':
      todoistClient.setToken(request.token);
      todoistClient.closeTask(request.taskId).then(sendResponse);
      return true;
    case 'todoist.clearSyncToken':
      todoistClient.clearSyncToken();
      sendResponse();
      return true;
    default:
      console.error('Unknown type');
  }
});
