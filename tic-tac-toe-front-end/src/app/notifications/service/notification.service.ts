import { Injectable, TemplateRef } from '@angular/core';
import { faCheckCircle, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NotificationToast, NotificationToastButton } from './notification-toast';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationToasts: NotificationToast[] = []

  constructor() { }


  show(notification: NotificationToast) {
    this.notificationToasts.push(notification)
  }

  remove(notification: NotificationToast) {
    this.notificationToasts = this.notificationToasts.filter(toast => toast !== notification)
  }

  showStandardSuccess(text: string) {    
    this.notificationToasts.push ({
      cssClasses: "bg-light",
      content: {
        text: text,
        icon: faCheckCircle,
        iconCssClasses: "text-success"
      },
      dissapearAfter: 3000,
      buttons: []
    })
  }

  showStandardError(text: string) {
    this.notificationToasts.push ({
      cssClasses: "bg-light",
      content: {
        text: text,
        icon: faExclamationCircle,
        iconCssClasses: "text-danger"
      },
      dissapearAfter: 5000,
      buttons: []
    })
  }

  showStandardInfo(text: string) {
    this.notificationToasts.push ({
      cssClasses: "bg-light",
      content: {
        text: text,
        icon: faInfoCircle,
        iconCssClasses: "text-primary"
      },
      dissapearAfter: 5000,
      buttons: []
    })
  }

  showStandardInfoWithOptions(text: string, buttons: NotificationToastButton[]) {
    this.notificationToasts.push ({
      cssClasses: "bg-light highlighted",
      content: {
        text: text,
        icon: faInfoCircle,
        iconCssClasses: "text-primary"
      },
      dissapearAfter: 1000000000,
      buttons: buttons
    })
  }

}
