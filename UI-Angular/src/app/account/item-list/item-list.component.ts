import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  items = [];

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  delete(item, index: number) {
    this.http.delete(`${environment.apiURL}article/${item._id}`,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` } })
      .subscribe((d) => {
        console.log(d);
        /** Upon successful delete operation from the backend remove aarticle from the list */
        this.items.splice(index, 1);
      })
  }

}
