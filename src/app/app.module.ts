import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlWordnetService } from './services/plwordnet.service';
import { HttpClientModule } from '@angular/common/http';
import { TestService } from './services/test.service';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    PlWordnetService,
    TestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
