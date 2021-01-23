/**
   * Search Component
   * @remarks
   * It takes text based tag or take an image, parse it to extract tag and then query articles api for matching articles.
   */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  /** api endpoint to make HTTP Request calls to backend */
  apiURL = environment.apiURL;

  /**  to show tags in search bar */
  selectedSearch = [];

  /** api endpoint to extract objects from the image */
  tagExtractURL = environment.apiURL + 'image-extract';

  /** to show the list of tags added by users */
  tags = [];

  /** List of articles */
  articles = [];

  // If user is logged in
  loggedIn = false;

  constructor(
    /** injected sanitizer to use it later to sanitize content to avoid xss attacks */
    public sanitizer: DomSanitizer,

    /** In built http client provided by Angular to communicate with backend through REST APIs */
    private http: HttpClient,

    // Custom authentication service to communicate with API
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
  }

  /** It gets called when user uploads an image to extract the objects out of it */
  handleChange(data: NzUploadChangeParam) {
    const file = { ...data.file };

    /** creats a url which is used to show the image in search tags */
    const url = URL.createObjectURL(file.originFileObj);
    if (file?.response?.data) {

      /** objects extracted from image are added as tags */
      file.response.data.forEach(res => {
        this.selectedSearch.push({ value: res.name, label: res.name, src: url, file: file.originFileObj });
        this.selectedSearch = [...this.selectedSearch];
      });
    }
  }

  /** to avoid adding duplicate tags */
  defaultFilterOption = (searchValue, item) => {
    if (item && item.nzLabel && typeof (item.nzLabel) !== 'object') {
      return item.nzLabel.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    }
    else {
      return false;
    }
  };

  /** It gets called when user clicks on search */
  search() {

    /** Map the tags in proper format as expected by Article schema in Backend */
    this.tags = this.selectedSearch.map((t) => {
      return { name: t.value || t };
    });

    /** Make API call to fetch articles only if user has added 1 or more tags */
    if (this.tags.length) {
      /** Make API call to fetch the list articles that contains the tags added by user in search box */
      this.http.post(`${this.apiURL}article/search`, { query: { tags: this.tags } }).subscribe((articles: any) => {
        this.articles = articles;
      });
    } else {
      this.articles = [];
    }
  }

  /** DomSanitizer helps preventing Cross Site Scripting Security bugs (XSS) by sanitizing values to be safe to use in the different DOM contexts. */
  /** Here we have image url and we are sanitizing it and make it safe */
  sanitizeImageURL(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
