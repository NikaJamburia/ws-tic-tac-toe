import { TemplateRef } from "@angular/core";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

export interface NotificationToast {
    cssClasses: string
    content: ToastStantardContent | TemplateRef<any>
    dissapearAfter: number
    buttons: NotificationToastButton[]
}

export interface NotificationToastButton {
    color: string, 
    text: string,
    onClick: () => void
}

export interface ToastStantardContent {
    text: string,
    icon?: IconDefinition
    iconCssClasses: string
}