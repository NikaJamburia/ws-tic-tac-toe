import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { text } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp, faMinus, faPaperPlane, faPlane, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GameApiService } from 'src/app/service/game-api/game-api.service';
import { DataType, MsgFromService, ServiceMsgType } from 'src/app/service/game-api/messages';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, OnDestroy {

  @Input() gameService!: GameApiService
  @Input() gameId!: string

  messagesSubscription$?: Subscription
  messages: UserMessage[] = []

  sendMsgForm: FormGroup = this.formBuilder.group({
    newMsgText: [''],
  })

  sendIcon = faPaperPlane
  minimizeIcon = faChevronDown
  maximizeIcon = faChevronUp
  minimized = false
  newMsgs = 0

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnDestroy(): void {
    this.messagesSubscription$?.unsubscribe()
  }

  ngOnInit(): void {
    this.messagesSubscription$ = this.gameService.messages
    .pipe(filter(msg => msg.type === ServiceMsgType.DATA && msg.dataType === DataType.MSG_FROM_OPPONENT ))
    .subscribe(msg => this.receiveMessage(msg))
  }

  private receiveMessage(msg: MsgFromService) {
    this.messages.push({ type: "incoming", time: msg.payload.sendTime, text: msg.payload.text });

    if(this.minimized) {
      this.newMsgs += 1
    }
  }

  sendMsg() {
    let msgText = this.sendMsgForm.controls.newMsgText.value
    let sendTime = new Date().toLocaleTimeString()
    
    this.gameService.sendMsgToOpponent(msgText, sendTime, this.gameId)
    this.messages.push({ type: "outgoing", time: sendTime, text: msgText })
    this.sendMsgForm.controls.newMsgText.setValue('')
  }

  minimize() {
    this.minimized = true
  }

  maximize() {
    this.minimized = false
    this.newMsgs = 0
  }

}

export interface UserMessage {
  type: "incoming" | "outgoing",
  time: string,
  text: string
}
