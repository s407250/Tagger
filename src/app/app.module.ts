import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { PlWordnetService } from './services/plwordnet.service';
import { HttpClientModule } from '@angular/common/http';
import { TestService } from './services/test.service';
import { TestComponent } from './test/test.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AutoCompleteModule,
    BrowserAnimationsModule
  ],
  providers: [
    PlWordnetService,
    TestService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
