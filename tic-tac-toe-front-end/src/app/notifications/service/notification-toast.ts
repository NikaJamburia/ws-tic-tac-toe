import { TemplateRef } from "@angular/core";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

export interface NotificationToast {
    cssClasses: string
    content: ToastStantardContent | TemplateRef<any>
    dissapearAfter: number
}

export interface ToastStantardContent {
    text: string,
    icon?: IconDefinition
    iconCssClasses: string
}