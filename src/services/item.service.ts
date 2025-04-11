import type Item from "@/models/Item";

const BASE_URL = 'http://192.168.1.64:3000/item/';

export default class ItemService {
    taskIsDone = (id: number, done: boolean): void => {
        fetch(BASE_URL + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({ done: done, updated: new Date() }),
        }).catch((error) => void 0)
    }

    updateStatusItem = (status: string, id: number) => {
        fetch(BASE_URL + id, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ status: status, updated: new Date() }),
        }).catch((error) => void 0)
    }

    updateItem = async (item: Item) => {
        try {
            const response = await fetch(BASE_URL + item.id, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(item),
            })
            const itemUpdated = await response.json();
            return itemUpdated;
        } catch(error) {
            return error;
        }
    }

    getItems = async (status: string = 'active') => {
        try {
            const response = await fetch(`${BASE_URL}?status=${status}`);
            const items = await response.json();
            return items;
        } catch (error) {
            return void 0;
        }
    }

    getStatuses = async () => {
        try {
            const response = await fetch(`${BASE_URL}status`);
            const statuses = await response.json();
            return statuses;
        } catch(error) {
            return void 0;
        }
    }

    saveItem = async (item: Item) => {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(item),
              });
            const itemSaved = await response.json();
            return itemSaved
        } catch (error) {
            return error;
        }
    }

    deleteItem = async (id: number) => {
        try {
            const response = await fetch(BASE_URL+id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                  },
            });
            const itemDeleted = await response.json();
            return itemDeleted;
        } catch (error) {
            return error;
        }
    }
}