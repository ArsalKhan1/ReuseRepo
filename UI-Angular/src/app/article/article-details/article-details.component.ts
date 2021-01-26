/**
   * SArticle Details
   * @remarks
   * It renders article details.
   * If user has update permission, it allows user to update the article
   * it also serves as data entry screen to create article
   */
  import { HttpClient } from '@angular/common/http';
  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
  import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
  import { environment } from '../../../environments/environment';
  
  @Component({
    selector: 'app-article-details',
    templateUrl: './article-details.component.html',
    styleUrls: ['./article-details.component.scss']
  })
  export class ArticleDetailsComponent implements OnInit {
  
    public article;
  
    /** true if not in view mode */
    editMode = false;
  
    /** true if article belong to user, user can edit */
    allowEdit = false;
  
    showEditImageUrlPopOver = false;
  
    /** Search value enterted by user */
    searchValue: string;
  
    /**
     * 
     * @param activatedRoute to see the current router state
     * @param http to make API call to backend
     */
    constructor(
      private activatedRoute: ActivatedRoute,
      private http: HttpClient
    ) {
  
      /** Fetch articleId from the route in browser search bar */
      const articleId = this.activatedRoute.snapshot.params?.articleId;
  
      /** I articleId is there fetch the article from db */
      if (articleId) {
        this.http.get(`${environment.apiURL}article/${articleId}`).subscribe((article) => {
          this.article = article;
          this.allowEdit = this.article?.userId === '1' || false;
        });
      } else {
        this.article = {
          title: 'Untitled Article',
          description: 'Add Description Here! ',
          tags: [],
          userId: '1'
        }
        this.editMode = true;
        this.allowEdit = true;
      }
    }
  
    ngOnInit(): void {
    }
  
    /** To not allow user to add duplicate tags */
    /**
     * 
     * @param searchValue entered by user
     * @param item list of selected items
     */
    defaultFilterOption = (searchValue, item) => {
      if (item && item.nzLabel && typeof (item.nzLabel) !== 'object') {
        return item.nzLabel.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
      }
      else {
        return false;
      }
    };
  
    /** Create / Update article in database */
    save() {
  
      /** Everytime assign latest date to 'updatedAt' while editing or creating article */
      this.article.updatedAt = new Date();
  
      /** If createdAt date is already there, aissgn the same, otherwise use the current date */
      this.article.createdAt = this.article.createdAt || this.article.updatedAt;
  
      /** Map the tags object as expected by backend article mongoose schema */
      this.article.tags = this.article.tags.map((t) => {
        return t.name ? t : { name: t, category: 'unknown' };
      });
  
      /** If article has an Id it means it is and update operation, otherwise create a new article */
      if (this.article?._id) {
        /** Article Update Request */
        this.http.put(`${environment.apiURL}article/update/${this.article._id}`, this.article).subscribe((savedArticle) => {
          this.article = savedArticle;
          this.editMode = false;
        });
      } else {
        /** Article Create Request */
        this.http.post(`${environment.apiURL}article/create`, this.article).subscribe((savedArticle) => {
          this.article = savedArticle;
          this.editMode = false;
        });
      }
    }
  
    /** It gets called when user uploads an image to extract the objects out of it */
    handleChange(data: NzUploadChangeParam) {
      const file = { ...data.file };
  
      /** creats a url which is used to show the image in search tags */
      const url = URL.createObjectURL(file.originFileObj);
      console.log(file);
    }
  
    /** When blur, if users has already entered any search value, convert it into the tag */
    onBlur() {
      if (this.searchValue) {
        this.article.tags = [...this.article.tags, this.searchValue];
        this.searchValue = '';
      }
    }
  
  }
  