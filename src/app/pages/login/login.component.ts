import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  constructor(public route: ActivatedRoute, public router: Router) { }

  token;
  refreshToken;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.refreshToken = params['refreshToken'];
      if (this.token && this.refreshToken) {
        localStorage.setItem('token', this.token);
        localStorage.setItem('refreshToken', this.refreshToken);
        this.router.navigate(['/home']);
      }
    });
  }


}
