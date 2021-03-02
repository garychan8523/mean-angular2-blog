import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  companyName = "blog.dedd.ca";
  ppLink = "http://blog.dedd.ca/privacy-policy";
  tosLink = "http://blog.dedd.ca/terms-of-service";

  constructor() { }

  ngOnInit(): void {
  }

}
