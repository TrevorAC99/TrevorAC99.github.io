import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public message = 'Welcome to Trevor Carlson\'s website! ' +
    'This is a single page web app developed using ' +
    'Angular. Angular Material is used for UI themeing. ' +
    'Deployment is handled by Github pages.';

  constructor() { }

  ngOnInit() {
  }

}
