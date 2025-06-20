import type Item from "@/models/Item";

const BASE_URL = 'http://localhost:5173/item/';

export default class ItemService {
    taskIsDone = (id: number, item: Item): void => {
        fetch(BASE_URL + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({ done: item.done, updated: new Date(), recurrent: item.recurrent }),
        }).catch((_) => void 0)
    }

    updateStatusItem = (status: string, id: number) => {
        fetch(BASE_URL + id, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ status: status, updated: new Date() }),
        }).catch((_) => void 0)
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
            return await response.json();
        } catch(error) {
            return error;
        }
    }

    getItems = async (status: string = 'active') => {
        try {
            const response = await fetch(`${BASE_URL}?status=${status}`);
            return await response.json();
        } catch (_) {
            return void 0;
        }
    }

    getStatuses = async () => {
        try {
            const response = await fetch(`${BASE_URL}status`);
            return await response.json();
        } catch(_) {
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
            return await response.json();
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
            return await response.json();
        } catch (error) {
            return error;
        }
    }
}
