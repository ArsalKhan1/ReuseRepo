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


/**
 * A component to list all the items belonging to the user and allow them
 * to delete them or add new ones
 */
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

  /**
   * Constructor that imports the appropriate services
   * 
   * @param {Object} http Angular http client to make API requests
   * @param {Object} auth authentication service to check if the user is logged in
   * @param {Object} router Angular router service to navigate the app
   * @param {Object} location Angular location service to navigate to the last page
   */
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router,
    private location: Location
  ) { }

  /**
   * Initialization function to get user data
   */
  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/article/search');
    }
    this.userId = this.auth.getData().userId;
    this.fetchItems();
  }

  /**
   * Filter function for zorro select component
   * 
   * @param {string} searchValue the value to filter for
   * @param {Object} item the list to search in
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
   * Get all items belonging to the user from the API
   */
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

  /**
   * Delete an item
   * 
   * @param {Object} item the item to delete
   * @param {int} index the index of the item in the main list so it can be removed from the UI
   */
  delete(item, index: number) {
    this.http.delete(`${environment.apiURL}users/items/delete/${item._id}`,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` } })
      .subscribe((d) => {
        console.log(d);
        /** Upon successful delete operation from the backend remove aarticle from the list */
        this.items.splice(index, 1);
      })
  }

  /**
   * Go to the previous page on the app
   */
  goBack() {
    this.location.back();
    console.log("back");
  }

  /**
   * Show the create item modal on button click
   */
  showItemModal(): void {
    this.isVisible = true;
  }

  /**
   * Create a new item using modal data
   */
  createItem() {
    this.isLoading = true;

    this.http.post(`${environment.apiURL}users/items/insert`,
      this.newItem,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` } })
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

  /**
   * Handle the event when the modal is cancelled
   */
  handleCancel(): void {
    this.isVisible = false;
    this.clearNewItem();
  }

  /**
   * Reset the variables assosciated with the modal when submitted or canceled
   */
  private clearNewItem(): void {
    this.newItem.itemName = 'Name';
    this.newItem.tags = ['tags', 'here'];
    this.editMode = false;
  }
}
