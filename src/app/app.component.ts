import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth/store/auth.actions';
import * as fromApp from './store/app.reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedFeature = 'recipe';

   constructor (private store: Store<fromApp.AppState>) {

   }
  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyA9a4XgKcIz826_ppvW8VYtJKRsvPW6by0",
      authDomain: "ng-recipe-book-33cf3.firebaseapp.com"
    });
    this.store.dispatch(new AuthActions.TrySignin({username: 'admin@admin.com', password: 'admin123'}));

  }

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
