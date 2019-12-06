import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}
@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  name = '';
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
      this.tests = tests;
    } else {
      this.tests = await this.loadTestsFromJson();
    }
  }

  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  saveToLocalStorage() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }
  save() {
    this.saveToLocalStorage();
    this.toastService.showToast('success', 5000, 'Success: Items saved!');
  }

  addTest() {
    const test: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null,
    };
    this.tests.unshift(test);
    this.saveToLocalStorage();
  }

  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage();
  }

  calculate() {
    let pointspossible = 0;
    for (let i = 0; i < this.tests.length; i++) {
      pointspossible += this.tests[i].pointsPossible;
    }

    let pointsreceived = 0;
    for (let i = 0; i < this.tests.length; i++) {
      pointsreceived += this.tests[i].pointsReceived;
    }

    let percentage = 0;
    percentage += pointsreceived / pointspossible;
    percentage = parseFloat(percentage.toFixed(2));

    console.log(pointspossible, pointsreceived);

    let grade: string;
    if (percentage >= .90) {
      grade = 'A';
    } else if (percentage >= .80) {
      grade = 'B';
    } else if (percentage >= .70) {
      grade = 'C';
    } else if (percentage >= .60) {
      grade = 'D';
    } else if (percentage < .60) {
      grade = 'F';
    }

    const commaIndex = this.name.indexOf(', ');
    const firstName = this.name.slice(commaIndex + 1, this.name.length);
    const lastName = this.name.slice(0, commaIndex);
    const fullName = firstName + ' ' + lastName;

    return {
      name: fullName,
      totalPointsPossible: pointspossible,
      totalPointsReceived: pointsreceived,
      totalPercentage: percentage,
      finalGrade: grade,
    };

  }
  computeGrade() {
    const commaIndex = this.name.indexOf(', ');
    let error = false;

    if (this.name === '') {
      this.toastService.showToast('warning', 5000, 'Name must not be null');
      error = true;
    } else if (commaIndex === -1) {
      this.toastService.showToast('warning', 5000, 'Name must contain a comma and a space');
      error = true;
    }
    if (!error) {
      const data = this.calculate();
      this.router.navigate(['home', data]);
    }
  }
}


