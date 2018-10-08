import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom, map, concatMap, mergeMap, tap } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as RecipeActions from '../store/recipe.actions';
import { Recipe } from '../recipe.model';
import * as fromRecipe from '../store/recipe.reducers';

@Injectable()
export class RecipeEffects {
  @Effect()
  recipeFetch = this.actions$
    .ofType(RecipeActions.FETCH_RECIPES)
    .pipe(concatMap((action: RecipeActions.FetchRecipes) => {
      return this.httpClient.get<Recipe[]>('https://ng-recipe-book-33cf3.firebaseio.com/recipes.json', {
        observe: 'body',
        responseType: 'json'
      });
    }), map(
      (recipes) => {
        console.log(recipes);
        for (let recipe of recipes) {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
        }
        return {
          type: RecipeActions.SET_RECIPES,
          payload: recipes
        };
      }
    ));

  @Effect({ dispatch: false })
  recipeStore = this.actions$
    .ofType(RecipeActions.STORE_RECIPES)
    .pipe(withLatestFrom(this.store.select('recipes')),
      switchMap(([action, state]) => {
        const req = new HttpRequest('PUT', 'https://ng-recipe-book-33cf3.firebaseio.com/recipes.json', state.recipes, { reportProgress: true });
        return this.httpClient.request(req);
      }));


  @Effect({ dispatch: false })
  log1 = this.actions$
    .ofType(RecipeActions.STORE_RECIPES, RecipeActions.FETCH_RECIPES)
    .pipe(tap(() => console.log('pruebaaa')));

  constructor(private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<fromRecipe.FeatureState>) {
  }
}
