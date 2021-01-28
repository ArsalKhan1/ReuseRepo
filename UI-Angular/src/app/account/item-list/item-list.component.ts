/**
   * item list component
   * @remarks
   * renders a list of items.
   * if user is logged in, it will let user edit or delete the items
   */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  items = [];
  userId: string;
  isVisible: boolean;
  isLoading: boolean;
  editMode = false;
  newItem = {
    itemName: 'Name',
    tags: ['tags', 'here']
  };

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/article/search');
    }
    this.userId = this.auth.getData().userId;
    this.fetchItems();
  }

  defaultFilterOption = (searchValue, item) => {
    if (item && item.nzLabel && typeof (item.nzLabel) !== 'object') {
      return item.nzLabel.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    }
    else {
      return false;
    }
  };

  async fetchItems() {
    await this.http.get(`${environment.apiURL}users/${this.userId}/items`, {headers:{Authorization: `Bearer ${this.auth.getToken()}`}}).subscribe((items: any) => {
      this.items = items;
      this.items.forEach(item => {
        let spacedTags = '';
        item.tags.forEach(i => {
          if(spacedTags != '') {
            spacedTags += ', ';
          }
          spacedTags += i;
        });
        item.tags = spacedTags;
      });
    });
  }

  delete(item, index: number) {
    this.http.delete(`${environment.apiURL}users/items/delete/${item._id}`,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` } })
      .subscribe((d) => {
        console.log(d);
        /** Upon successful delete operation from the backend remove aarticle from the list */
        this.items.splice(index, 1);
      })
  }

  goBack() {
    this.location.back();
    console.log("back");
  }

  showItemModal(): void {
    this.isVisible = true;
  }

  handleErrorResponse() {

  }

  createItem() {
    this.isLoading = true;

    this.http.post(`${environment.apiURL}users/items/insert`,
      this.newItem,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` } })
      // .pipe(catchError(this.handleErrorResponse))
      .subscribe((savedItem) => {
        this.fetchItems();
        this.isVisible = false;
        this.isLoading = false;
        this.clearNewItem();
      },
      (err) => {
        alert(err.error.errors);
        this.isVisible = false;
        this.isLoading = false;
        this.clearNewItem();
        console.log(err.error.errors);
      });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.clearNewItem();
  }

  private clearNewItem(): void {
    this.newItem.itemName = 'Name';
    this.newItem.tags = ['tags', 'here'];
    this.editMode = false;
  }
}
