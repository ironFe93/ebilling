import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup(
    {
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    }
  );

  constructor(private authService: AuthService) { // <--- inject FormBuilder
  }

  ngOnInit() {
  }

  onSubmit() {

    const credentials: any = this.loginForm.value;
    console.log(credentials);
    this.authService.login(credentials.username, credentials.password).subscribe();
  }

}

