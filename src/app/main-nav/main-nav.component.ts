import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  constructor(private router: Router, private toastService: ToastService) { }

  ngOnInit() {
  }

  showAbout() {
    this.toastService.showToast('success', 5000, 'This application is designed by Sai Aung Ko Ko. (C) 2019');
  }

}
