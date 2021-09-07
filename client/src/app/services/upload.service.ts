import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class UploadService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  createAuthenticationHeaders() {
    this.authService.loadToken();
    this.options = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json', 
        'authorization': this.authService.authToken
      }),
    };
  }

  uploadImage(file) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'upload/image', formData, this.options);
  }

}
