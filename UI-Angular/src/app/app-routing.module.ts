import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleDetailsComponent } from './article/article-details/article-details.component';
import { ArticleListComponent } from './article/article-list/article-list.component';
import { SearchComponent } from './search/search.component';
import { RegisterComponent } from './account/register/register.component';
import { LoginComponent } from './account/login/login.component';
import { ProfileComponent } from './account/profile/profile.component';
import { LogoutComponent } from './account/logout/logout.component';
import { ItemListComponent } from './account/item-list/item-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'article/search',
    pathMatch: "full"
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'article',
    children: [
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'create',
        component: ArticleDetailsComponent
      },
      {
        path: 'list',
        component: ArticleListComponent
      },
      {
        path: ':articleId',
        component: ArticleDetailsComponent
      }
    ]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'item/list',
    component: ItemListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
