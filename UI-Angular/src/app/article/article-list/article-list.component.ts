/**
   * article list component
   * @remarks
   * renders a list of articles.
   * if user is logged in and have admin rights, it will let user edit or delete the articles
   */

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  tabPosition = 'all';
  articles = [];
  items = [];
  username: string;
  userId: string;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/article/search');
    }
    this.fetchArticles();
    this.username = this.auth.getUsername();
    this.userId = this.auth.getData().userId;
    this.fetchItems();
  }

  /*
    fetch articles based on user's preference either "all" or "my articles"
    articles will be sorted by "DESC" by the field "updatedAt"
  */

  fetchArticles() {
    const sortObj = { field: 'updatedAt', order: 'desc' };
    var listArticleQuery;
    if(this.tabPosition === 'all') {
      listArticleQuery = { query: { sort: sortObj } };
    }
    else if(this.tabPosition === 'my') {
      listArticleQuery = { query: { authorUsername: this.username, sort: sortObj } };
    }
    else {
      let itemTags = [];
      this.items.forEach(item => {
        item.tags.forEach(tag => {
          itemTags.push(tag);
        });
      });

      let uniqueTags = [...new Set(itemTags)];

      let tagObjects = [];
      uniqueTags.forEach(tag => {
        tagObjects.push({name: tag});
      });

      listArticleQuery = { query: { exclusive: true, sort: sortObj, tags: tagObjects }, jwt: this.auth.getToken() };
    }
    this.http.post(`${environment.apiURL}article/search`, listArticleQuery).subscribe((articles: any) => {
      this.articles = articles;
    });
  }

  fetchItems() {
    this.http.get(`${environment.apiURL}users/${this.userId}/items`, { headers: { Authorization: `Bearer ${this.auth.getToken()}` } }).subscribe((items: any) => {
      this.items = items;
    });
  }

  /**
   * Delete an article
   * 
   * @param article - article to be deleted 
   * @param index - index of the article to be deleted
   */
  delete(article, index: number) {
    this.http.delete(`${environment.apiURL}article/${article._id}`,
                      {headers:{Authorization: `Bearer ${this.auth.getToken()}`}})
                      .subscribe((d) => {
      console.log(d);
      /** Upon successful delete operation from the backend remove aarticle from the list */
      this.articles.splice(index, 1);
    })
  }
}
