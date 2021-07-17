import { Component, OnInit, TemplateRef } from '@angular/core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastStantardContent } from '../service/notification-toast';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(public notificationService: NotificationService) { }

  successIcon = faCheckCircle

  ngOnInit(): void {
  }

  isTemplate(content: ToastStantardContent | TemplateRef<any>) { 
    return content instanceof TemplateRef; 
  }

  asTemplate(content: ToastStantardContent | TemplateRef<any>) {
    return content as TemplateRef<any>
  }

  asStandardContent(content: ToastStantardContent | TemplateRef<any>) {
    return content as ToastStantardContent
  }

}
