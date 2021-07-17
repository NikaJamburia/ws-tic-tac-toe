import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app-component/app.component';
import { StartPageComponent } from './tic-tac-toe/start-page/start-page.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsComponent } from './notifications/component/notifications.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameComponent } from './tic-tac-toe/game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    TicTacToeComponent,
    NotificationsComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
