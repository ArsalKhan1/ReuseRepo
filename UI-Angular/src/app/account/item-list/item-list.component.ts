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

  fetchItems() {
    this.http.get(`${environment.apiURL}users/${this.userId}/items`, {headers:{Authorization: `Bearer ${this.auth.getToken()}`}}).subscribe((items: any) => {
      this.items = items;
      console.log(items);
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
}
