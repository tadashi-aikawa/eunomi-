import Axios, { AxiosPromise } from 'axios';
import _, { Dictionary, NumericDictionary } from 'lodash';
import dayjs from 'dayjs';
import { debug } from '../utils/logger';

const BASE = 'https://api.todoist.com/api/v8';

namespace Api {
  export interface Project {
    id: number;
    name: string;
    /** 0: 存在する, 1: 消された */
    is_deleted: number;
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
    /** 0: 通常 ～ 4: 緊急 */
    priority: number;
    /** 0: 未完了, 1: 完了 */
    checked: number;
    /** 0: 存在する, 1: 消された */
    is_deleted: number;
  }

  export interface Root {
    full_sync: boolean;
    sync_token: string;
    items?: Task[];
    projects?: Project[];
    day_orders?: Dictionary<number>;
  }

  export class Client {
    token: string;

    constructor(token: string) {
      this.token = token;
    }

    sync(resourceTypes: string[], syncToken: string = '*'): AxiosPromise<Root> {
      return Axios.get(
        `${BASE}/sync?sync_token=${syncToken}&resource_types=[${resourceTypes.map(x => `"${x}"`).join(',')}]`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );
    }
  }
}

const REST_BASE = 'https://api.todoist.com/rest/v1';

namespace RestApi {
  export class Client {
    token: string;

    constructor(token: string) {
      this.token = token;
    }

    closeTask(taskId: number): AxiosPromise<void> {
      return Axios.post(`${REST_BASE}/tasks/${taskId}/close`, undefined, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    }
  }
}

export class Task {
  constructor(
    public id: number,
    public title: string,
    public projectId: number | null,
    public projectName: string | null,
  ) {}
}

const toTask = (task: Api.Task, projectNameById: NumericDictionary<Api.Project>): Task =>
  new Task(
    task.id,
    task.content,
    task.project_id || null,
    task.project_id ? projectNameById[task.project_id].name : null,
  );

export class TodoistClient {
  token: string;
  syncToken: string = '*';
  projectById: NumericDictionary<Api.Project>;
  taskById: NumericDictionary<Api.Task>;

  setToken(token: string) {
    this.token = token;
  }

  clearSyncToken() {
    this.syncToken = '*';
  }

  /**
   * 本日のタスク一覧を取得します
   * @param token Todoistトークン
   */
  async fetchDailyTasks(): Promise<Task[]> {
    const client = new Api.Client(this.token);
    const res: Api.Root = (await client.sync(['items', 'projects', 'day_orders'], this.syncToken)).data;
    this.syncToken = res.sync_token;
    debug(`res.full_sync: ${res.full_sync}`);
    debug(`syncToken: ${this.syncToken}`);

    const _projectById: NumericDictionary<Api.Project> = _.keyBy(res.projects, x => x.id);
    const _taskById: NumericDictionary<Api.Task> = _.keyBy(res.items, x => x.id);
    debug('_projectById', _projectById);
    debug('_taskById', _taskById);
    if (res.full_sync) {
      this.projectById = _projectById;
      this.taskById = _taskById;
    } else {
      this.projectById = { ...this.projectById, ..._projectById };
      this.taskById = { ...this.taskById, ..._taskById };
    }
    debug('_dayOrders', res.day_orders);
    if (!_.isEmpty(res.day_orders)) {
      this.taskById = _.mapValues(this.taskById, task =>
        res.day_orders[task.id] ? { ...task, day_order: res.day_orders[task.id] } : task,
      );
    }

    const today = dayjs().format('YYYY-MM-DD');
    // TODO: startsWith使わずに、dayjsオブジェクト作ってちゃんと書く
    return _(this.taskById)
      .values()
      .filter(x => x.due?.date.startsWith(today))
      .reject(x => x.is_deleted === 1)
      .reject(x => x.checked === 1)
      .reject(x => this.projectById[x.project_id]?.is_deleted === 1)
      .orderBy(x => x.day_order)
      .orderBy(x => x.priority, 'desc')
      .map(x => toTask(x, this.projectById))
      .value();
  }

  async closeTask(taskId: number): Promise<void> {
    const client = new RestApi.Client(this.token);
    return client.closeTask(taskId).then();
  }
}
