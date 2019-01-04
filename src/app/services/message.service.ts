import { Injectable } from '@angular/core';

import {Notification} from '../classes/notification';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    
    debugMode: boolean = true;

    notifications: Notification[] = [];

    debug(message: string, isError: boolean = false): void {
        if (this.debugMode) {
            this.add(message, isError);
        }
    }

    add(message: string, isError: boolean = false): void {
        let notification: Notification = new Notification(message, isError);
        this.addNotificationObject(notification);
    }

    addNotificationObject(notification: Notification): void {
        this.notifications.push(notification);
        console.log(notification.message);
    }

    remove(notification: Notification): void {
        if (!notification)
            return;
          
        // Find and remove item from an array
        var i = this.notifications.indexOf(notification);
        if(i != -1)
            this.notifications.splice(i, 1);
    }

    clear() {
        this.notifications = [];
    }
}