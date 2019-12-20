import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public aboutMe = 'I\'m Trevor Carlson, a 3rd year student ' +
    'at the University of Wisconsin Oshkosh studying Computer ' +
    'Science with an emphasis in Systems and Theory. I do web ' +
    'development work for the University, but as my emphasis ' +
    'suggests I have a lot of interests in systems programming.';

  public technologies = [
    'Java',
    'C#',
    'ASP.NET',
    'Microsoft SQL Server',
    'MySQL',
    'JavaScript',
    'TypeScript',
    'Angular',
    'Rust'
  ];

  public info = [
    {
      label: 'Email',
      value: 'trevorac99@gmail.com'
    },
    {
      label: 'Phone Number',
      value: '(920) 229-0865'
    },
    {
      label: 'LinkedIn',
      value: 'https://www.linkedin.com/in/trevor-a-carlson/'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
