import Axios, { AxiosPromise } from 'axios';
import _, { Dictionary } from 'lodash';
import dayjs from 'dayjs';

const BASE = 'https://api.todoist.com/api/v8';

namespace Api {
  export interface Project {
    id: number;
    name: string;
  }

  interface Due {
    date: string;
    is_recurring: boolean;
    lang: string;
    string: string;
  }

  export interface Task {
    id: number;
    content: string;
    day_order: number;
    parent_id: number | null;
    project_id: number | null;
    due: Due | null;
  }

  export interface Root {
    items: Task[];
    projects: Project[];
  }

  export class Client {
    token: string;

    constructor(token: string) {
      this.token = token;
    }

    sync(resourceType: string[], syncToken: string = '*'): AxiosPromise<Root> {
      return Axios.get(
        `${BASE}/sync?sync_token=${syncToken}&resource_types=[${resourceType.map(x => `"${x}"`).join(',')}]`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );
    }
  }
}

export class Task {
  constructor(public id: number, public title: string, public projectName: string | null) {}
}

const toTask = (task: Api.Task, projectNameById: Dictionary<Api.Project>): Task =>
  new Task(task.id, task.content, task.project_id ? projectNameById[task.project_id].name : null);

/**
 * 本日のタスク一覧を取得します
 * @param token Todoistトークン
 */
export async function fetchDailyTasks(token: string): Promise<Task[]> {
  const client = new Api.Client(token);
  const res: Api.Root = (await client.sync(['items', 'projects'])).data;
  const projectNameById: Dictionary<Api.Project> = _.keyBy(res.projects, x => x.id);

  const today = dayjs().format('YYYY-MM-DD');
  return _(res.items)
    .filter(x => x.due && x.due.date === today)
    .orderBy(x => x.day_order)
    .map(x => toTask(x, projectNameById))
    .value();
}
