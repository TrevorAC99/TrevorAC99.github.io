import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { LabeledItem } from 'src/app/shared/Interfaces/labeled-item';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public get aboutMe(): string {
    return this.aboutService.aboutMe;
  }

  public get technologies(): string[] {
    return this.aboutService.technologies;
  }

  public get contactInfo(): LabeledItem<string>[] {
    return this.aboutService.contactInfo;
  }

  constructor(private aboutService: AboutService) { }

  ngOnInit() {
  }

}
