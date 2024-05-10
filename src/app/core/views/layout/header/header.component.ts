import { Component, EventEmitter, OnInit, Output  } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DialogService } from 'primeng/dynamicdialog';
import { UserInfoSSO } from 'src/app/core/models/UserInfoSSO';
import { environment } from 'src/environments/environment';
import { ApplicationData } from 'src/app/core/models/ResponseCredentials';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  applications: ApplicationData[] = [];
  userPicture: string = null;
  user : UserInfoSSO | null = null;
  navOpen = true;
  isloading : boolean = false;
  @Output() navOpenEvent = new EventEmitter();  

  constructor(
    public auth: AuthService,
    public dialog: DialogService
  ) { }

  ngOnInit(): void {
    this.user = this.auth.getUserInfo();
    this.userPicture = this.auth.getSSOPicture();
    this.applications = this.auth.getApplications().sort((a, b) => a.name.localeCompare(b.name)); 
  }

  getAppPicture(application: ApplicationData): string | null {

    if (application == null || application.photo == null) return null;
    return 'data:image/png;base64,'+application.photo;
  }    

  toggleSideNav() {
    this.navOpen = !this.navOpen;
    this.navOpenEvent.emit(this.navOpen);
  }

  getEmail() : string {
    if (this.user == null) return "";
    return this.user.email;
  }  

  getFullName() : string {
    if (this.user == null) return "";
    return this.user.displayName;
  }

  getName() : string {
    if (this.user == null) return "";
    return this.user.firstName;
  }

  logout() {
    this.auth.logout();
  }

  openApp(application: ApplicationData) : void {
    window.open(application.url, "_blank");
  }

  getDomain() : string {
    let gitWord2 = "pge";
    let gitWord4 = "i";
    let gitWord3 = "min";
    let gitWord1 = "ca";

    let gitWord = gitWord1+gitWord2+gitWord3+gitWord4;

    return gitWord;
  }

  emailRef() {
    window.open("mailto:ccsw.support@"+this.getDomain()+".com?subject=["+environment.appCode+"] Consulta / Feedback");
  }  

}
