import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// antd components module
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { AntdModule } from 'src/app/antd.module';
import { SearchComponent } from './search/search.component';
import { ArticleDetailsComponent } from './article/article-details/article-details.component';
import { ArticleListComponent } from './article/article-list/article-list.component';
import { RegisterComponent } from './account/register/register.component';
import { LoginComponent } from './account/login/login.component';
import { ProfileComponent } from './account/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ArticleDetailsComponent,
    ArticleListComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    PagenotfoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AntdModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule { }
