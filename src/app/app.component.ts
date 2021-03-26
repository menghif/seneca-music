/*********************************************************************************
 * WEB422 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this * assignment has been copied manually or electronically from any other
 * source (including web sites) or distributed to other students.
 *
 * Name: Francesco Menghi Student ID: 141758193 Date: March 21st, 2021
 *
 ********************************************************************************/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLightTheme: boolean = false;
  title = 'web422-a5';
  searchString: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('theme')) {
      // get theme value from local storage
      localStorage.getItem('theme') === 'light'
        ? (this.isLightTheme = true)
        : (this.isLightTheme = false);
    }
  }

  handleSearch(): void {
    this.router.navigate(['/search'], {
      queryParams: { q: this.searchString },
    });
    this.searchString = '';
  }

  changeTheme(): void {
    // change theme and save new theme value to local storage
    this.isLightTheme
      ? ((this.isLightTheme = false), localStorage.setItem('theme', 'dark'))
      : ((this.isLightTheme = true), localStorage.setItem('theme', 'light'));
  }
}
