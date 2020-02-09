import { Injectable } from '@angular/core';
import { LabeledItem } from 'src/app/shared/Interfaces/labeled-item';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  public aboutMe = 'I\'m Trevor Carlson, a 3rd year student ' +
    'at the University of Wisconsin Oshkosh studying Computer ' +
    'Science with an emphasis in Systems and Theory. I do web ' +
    'development work for the University, but as my emphasis ' +
    'suggests I am very interested in systems programming.';

  public technologies: string[] = [
    'Rust',
    'TypeScript',
    'JavaScript',
    'Angular',
    'C#',
    'ASP.NET',
    'Microsoft SQL Server',
    'MySQL',
    'Java',
  ];

  public contactInfo: LabeledItem<string>[] = [
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
    },
  ];

  constructor() { }
}
