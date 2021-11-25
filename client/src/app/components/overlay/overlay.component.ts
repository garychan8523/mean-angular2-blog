import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { EventEmitterService } from '../../services/event-emitter.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OverlayComponent implements OnInit {

  isShowOverlay = false;
  content;

  companyName = 'blog.dedd.ca';
  lastBuildDate = '2021-11-25';

  ppLastUpdateDate = '1 March 2021';
  tosLink = `https://${this.companyName}/terms`;
  ppLink = `https://${this.companyName}/privacy-policy`;

  aboutData = `<div class="logo-font">Blog</div>
<br>
${this.companyName}
<br><br><br><br><br>
Last update: ${this.lastBuildDate}
<br><br>
Github: <a href="https://github.com/garychan8523/mean-angular2-blog">https://github.com/garychan8523/mean-angular2-blog</a>
<br><br>
Email: blog@dedd.ca`;
  privacyPolicyData = `<h5><b>${this.companyName} Privacy Policy</b></h5>
<br>
Last updated: ${this.ppLastUpdateDate}
<br><br>
<h5>1. Introduction</h5>
<h6>This Privacy Policy sets out how we, "${this.companyName}", use and protect your personal data that you provide to us, or that is otherwise obtained or generated by us, in connection with your use of our online platform and services (the “Services”). For the purposes of this Privacy Policy, ‘we’, ‘us’ and ‘our’ refers to "${this.companyName}", and ‘you’ refers to you, the user of the Services.</h6>

<br>
<h6><b>1.1 Privacy Principles</b></h6>
<p>We have two fundamental principles when it comes to collecting and processing private data:</p>
<ul>
    <li>We don't use your data to show you ads.</li>
    <li>We only store the minimum amount of data where it is needed for our service to function as a secure and feature-rich service.</li>
</ul>

<h6><b>1.2. Terms of Service</b></h6>
<p>This Privacy Policy forms part of our Terms of Service, which describes the terms under which you use our Services and which are available at <a href="${this.tosLink}">${this.tosLink}</a>. This Privacy Policy should therefore be read in conjunction with those terms.</p>

<h6><b>1.3. Notice for UK and EEA uesrs</b></h6>
<p>This site is not intented to serve users in UK or EEA area, still, we are trying our best to fulfill those region's compliance standard.</p>

<br>
<h5>2. Legal Ground for Processing Your Personal Data</h5>
<p>We process your personal data on the ground that such processing is necessary to further our legitimate interests (including: (1) providing effective and innovative Services to our users; and (2) to detect, prevent or otherwise address fraud or security issues in respect of our provision of Services), unless those interests are overridden by your interest or fundamental rights and freedoms that require protections of personal data.</p>

<br>
<h5>3. What Personal Data We Use</h5>
<p>We process your personal data on the ground that such processing is necessary to further our legitimate interests (including: (1) providing effective and innovative Services to our users; and (2) to detect, prevent or otherwise address fraud or security issues in respect of our provision of Services), unless those interests are overridden by your interest or fundamental rights and freedoms that require protections of personal data.</p>

<h6><b>3.1. Basic Account Data</b></h6>
<p>${this.companyName} is a blog service. You provide your email address and basic account data (which may include profile name, profile picture and about information) to create an user account.</p>
<p>To make it easier for your contacts and other people to reach you and recognize who you are, the screen name you choose, your profile pictures, and your username (should you choose to set one) on ${this.companyName} are always public. We don't know your real name, gender, age or what you like.</p>
<p>We do not require your screen name to be your real name.</p>

<h6><b>3.2. Email address usage</b></h6>
<p>Your provided email address at registration, without extra permission, will only be used to send you account related or important notice email (for example, account recovery or action required email related to security breach). We do not prodive your email address to any third-party without extra permission.</p>

<h6><b>3.3. Your Contents</b></h6>
<p>${this.companyName} is a blog service. We store text, images and documents from your content submission on our servers so that the data can be access from any devices anytime without having to rely on third-party backups. The non-public visible data (for example, your password) stored are encrypted. This way our engineers cannot get access to such data.</p>

<h6><b>3.4. Cookies</b></h6>
<p>The only cookies we use are those to operate and provide our Services on the web. We do not use cookies for profiling or advertising. The cookies we use are small text files that allow us to provide and customize our Services, and in doing so provide you with an enhanced user experience. Your browser should allow you to control these cookies, including whether or not to accept them and how to remove them. You may choose to block cookies with your web browser, however, if you do disable these cookies you will not be able to log in to our Services.</p>

<br>
<h5>4. Keeping Your Personal Data Safe</h5>
<h6><b>4.1. Storing Data</b></h6>
<p>Currently our Services are data are stored in a third-party cloud service provider in Tokyo. We do not share your personal data with such providers. All data is stored encrypted so that unauthorized entities cannot get access.</p>

<h6><b>4.2. Retention</b></h6>
<p>Unless stated otherwise in this Privacy Policy, the personal data that you provide us will only be stored for as long as it is necessary for us to fulfill our obligations in respect of the provision of the Services.</p>

<br>
<h5>5. Processing Your Personal Data</h5>
<h6><b>5.1. Our Services</b></h6>
<p>${this.companyName} is a cloud service. We will process your data to deliver our Services, to any devices without a need for you to use third-party backups or cloud storage.</p>

<h6><b>5.2. Safety and Security</b></h6>
<p>${this.companyName} supports a communities which we have to police against abuse and Terms of Service violations. To improve the security of your account, as well as to prevent spam, abuse, and other violations of our Terms of Service, we may collect metadata such as your IP address, devices and our Services you've used, history of profile data changes, etc. If collected, this metadata can be kept for 12 months maximum.</p>

<h6><b>5.3. Spam and Abuse</b></h6>
<p>To prevent phishing, spam and other kinds of abuse and violations of ${this.companyName}’s Terms of Service, our moderators may check contents that were reported to them by their recipients. If a spam report on your content is confirmed by our moderators, your account function may be limited – temporarily or permanently. You can send an appeal via our offical contact blog@dedd.ca . In case of more serious violations, your account may be banned. We may also use automated algorithms to analyze contents in cloud to stop spam and phishing.</p>

<h6><b>5.4. Cross-Device Functionality</b></h6>
<p>We may also store some aggregated metadata to create our features that work across all your devices.</p>

<h6><b>5.5. Advanced features</b></h6>
<p>We may use some aggregated data about how you use ${this.companyName} to build useful features. For example, show list of recommended contents. To do this, we are calculating a rating that shows what kind of content you are interact with frequently. To turn this feature off and delete the relevant data, go to Settings > Privacy & Security > Disable “Recommand features”.</p>

<h6><b>5.6. No Ads</b></h6>
<p>Unlike other services, we don't use your data for ad targeting or other commercial purposes. ${this.companyName} only stores the information it needs to function as a secure and feature-rich cloud service.</p>

<br>
<h5>6. Who Your Personal Data May Be Shared With</h5>
<h6><b>6.1. Other ${this.companyName} users</b></h6>
<p>Other users of our Services who may be located outside the EEA. Note that by entering into the Terms of Service, you are instructing us to transfer your personal data, on your behalf, to those users in accordance with this Privacy Policy. We employ all appropriate technical and organizational measures (including encryption of your personal data) to ensure a level of security for your personal data that is appropriate to the risk.</p>

<h6><b>6.2. Site owner</b></h6>
<p>We may share your personal data with: (1) dedd.ca site owner, to help provide, improve and support our Services. We will implement appropriate safeguards to protect the security and integrity of that personal data.</p>

<h6><b>6.3. Law Enforcement Authorities</b></h6>
<p>If ${this.companyName} receives a court order that confirms you're a terror suspect, we may disclose your IP address and email address to the relevant authorities. So far, this has never happened. When it does, we will include it in a transparency report published in public.</p>

<br>
<h5>7. Your rights regarding the personal data you provide to us</h5>
<h6><b>7.1. Your Rights</b></h6>
<p>Under applicable data protection legislation, in certain circumstances, you have rights concerning your personal data. You have a right to: (1) request a copy of all your personal data that we store and to transmit that copy to another data controller; (2) delete or amend your personal data; (3) restrict, or object to, the processing of your personal data; (4) correct any inaccurate or incomplete personal data we hold on you; and (5) lodge a complaint with national data protection authorities regarding our processing of your personal data.</p>

<h6><b>7.2. Exercising Your Rights</b></h6>
<p>If you wish to exercise any of these rights, kindly contact us via our offical contact blog@dedd.ca .</p>

<h6><b>7.3. Data Settings</b></h6>
<p>Regrettably, if you're generally disagree with ${this.companyName}'s modest requirements, it won't be possible for us to provide you with our Services. You can delete your account by proceeding to the deactivation page in Settings.</p>

<br>
<h5>8. Deleting data</h5>
<h6><b>8.1. Accounts</b></h6>
<p>If you would like to delete your account, you can do this on the deactivation page in Settings. Deleting your account removes all contents and every other piece of data you store in our Services. This action must be confirmed via your account and cannot be undone.</p>

<h6><b>8.2. Blogs</b></h6>
<p>Deleting a blog remove all of its relevent content including likes count and comments, there will be no record and history left related to the deleted blog and this action can not be undone.</p>

<br>
<h5>9. Changes to this Privacy Policy</h5>
<p>We will review and may update this Privacy Policy from time to time. Any changes to this Privacy Policy will become effective when we post the revised Privacy Policy on this page <a href="${this.ppLink}">${this.ppLink}</a>. Please check our website frequently to see any updates or changes to our Privacy Policy.</p>

<br>
<h5>10. Questions and concerns</h5>
<p>If you have any questions about privacy and our data policies, please contact us via our offical contact blog@dedd.ca . We will answer at the earliest opportunity.</p>`;

  constructor(
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
    this.eventEmitterService.showOverlayEvent.subscribe((content) => {
      if (content == 'about') {
        this.showOverlay(this.aboutData);
      }
      if (content == 'privacy-policy') {
        this.showOverlay(this.privacyPolicyData);
      }
    });
  }

  showOverlay(content) {
    this.content = content;
    this.isShowOverlay = true;;
  }

  hideOverlay() {
    let current_path = location.pathname;
    if (current_path == '/about' || current_path == '/privacy-policy') {
      this.router.navigate(['/']);
    }

    this.isShowOverlay = false;
    this.content = undefined;
  }

}
