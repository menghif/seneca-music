import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterUser } from '../RegisterUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerUser: RegisterUser = {
    userName: '',
    password: '',
    password2: '',
  };
  public success: boolean = false;
  public loading: boolean = false;
  public warning: string;
  public minPasswordLength: number = 10;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (
      this.registerUser.userName !== '' &&
      this.registerUser.password.length >= this.minPasswordLength &&
      this.registerUser.password === this.registerUser.password2
    ) {
      this.loading = true;
      this.auth.register(this.registerUser).subscribe(
        () => {
          this.success = true;
          this.loading = false;
          this.warning = null;
        },
        (err) => {
          this.success = false;
          this.loading = false;
          this.warning = err.error.message;
        }
      );
    } else {
      this.success = false;
      this.loading = false;
      if (this.registerUser.password !== this.registerUser.password2) {
        this.warning = 'Password does not match';
      }
      if (this.registerUser.password.length < this.minPasswordLength) {
        this.warning = `Password needs to be at least ${this.minPasswordLength} characters long`;
      }
    }
  }
}
