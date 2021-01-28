/**
   * Search Component
   * @remarks
   * It takes text based tag or take an image, parse it to extract tag and then query articles api for matching articles.
   */
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../services/authentication.service';

/**
 * A component for users to search for articles by material tags
 */
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

  /** Search value enterted by user */
  searchValue: string;

  /**
   * Constructor that imports the appropriate services
   * 
   * @param {Object} sanitizer to sanitize content
   * @param {Object} http to make API request to backend
   * @param {Object} auth to check if the user is logged in
   */
  constructor(
    /** injected sanitizer to use it later to sanitize content to avoid xss attacks */
    public sanitizer: DomSanitizer,

    /** In built http client provided by Angular to communicate with backend through REST APIs */
    private http: HttpClient,

    // Custom authentication service to communicate with API
    private auth: AuthenticationService
  ) { }

  /**
   * Initialization function that checks if the user is logged in to render  
   * appropriate buttons
   */
  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
  }

  /**
   * Called when user uploads an image to extract the objects out of it
   * 
   * @param {NzUploadChangeParam} data based on upload file(s) event
   */
  handleChange(data: NzUploadChangeParam) {
    const file = { ...data.file };

    /** creates a url which is used to show the image in search tags */
    const url = URL.createObjectURL(file.originFileObj);
    if (file?.response?.data) {

      /** objects extracted from image are added as tags */
      file.response.data.forEach(res => {
        this.selectedSearch.push({ value: res.name, label: res.name, src: url, file: file.originFileObj });
        this.selectedSearch = [...this.selectedSearch];
      });
    }
  }



  /**
   * Filter to avoid duplicating tags
   * 
   * @param {tsring} searchValue entered by user
   * @param {Object} item list
   */
  defaultFilterOption = (searchValue, item) => {
    if (item && item.nzLabel && typeof (item.nzLabel) !== 'object') {
      return item.nzLabel.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    }
    else {
      return false;
    }
  };

  /**
   * Handle request when user clicks on search
   */
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


  /**
   * DomSanitizer helps preventing Cross Site Scripting Security bugs (XSS) by sanitizing values to be safe to use in the different DOM contexts.
   * Here we have an image url and we are sanitizing it and make it safe
   * 
   * @param {string} url upoaded image url
   */
  sanitizeImageURL(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  /**
   * When blur, if users has already entered any search value, convert it into the tag
   */
  onBlur() {
    if (this.searchValue) {
      this.selectedSearch = [...this.selectedSearch, this.searchValue];
      this.searchValue = '';
    }
  }

}
