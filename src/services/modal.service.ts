import { Modal, type InstanceOptions, type ModalOptions } from "flowbite"

export default class ModalService {
    
    getModalInstance = (targetElement: string): Modal => {
        const $modalElement: HTMLElement | null = document.querySelector(targetElement)

        const modalOptions: ModalOptions = {
            backdrop: 'dynamic',
            backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
            closable: true,
        }

        // instance options object
        const instanceOptions: InstanceOptions = {
            id: 'modal-item',
            override: true,
        }

        const modal = new Modal($modalElement, modalOptions, instanceOptions)
        return modal;
    }
}