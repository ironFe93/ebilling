//Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from "@angular/router";
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'

//Material
import { MatSidenavModule, MatButtonModule, MatIconModule, MatListModule } from "@angular/material";
import {MatRadioModule} from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';

//Components & Services
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ProductsSearchComponent } from './products-search/products-search.component';
import { ProductsSearchResultsComponent } from './products-search-results/products-search-results.component';
import { ProductsService } from "./products.service";
import { SalesShoppingCartComponent } from './sales-shopping-cart/sales-shopping-cart.component';
import { SalesComponent } from './sales/sales.component';
import { ShoppingCartService } from './shopping-cart.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { SalesCheckoutComponent } from './sales-checkout/sales-checkout.component';
import { SalesSearchComponent } from './sales-search/sales-search.component';
import { SalesSearchResultsComponent } from './sales-search-results/sales-search-results.component';
import { SalesDetailComponent } from './sales-detail/sales-detail.component';
import { ProductsComponent } from './products/products.component';
import { ProductsCreateComponent } from './products-create/products-create.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

//Auth
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { PurchasesComponent } from './purchases/purchases.component';
//https://github.com/auth0/angular2-jwt/tree/v1.0


const appRoutes = [
  { path: 'sales', component: SalesComponent , canActivate: [AuthGuard] },
  { path: 'sales-checkout', component: SalesCheckoutComponent , canActivate: [AuthGuard]},
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  { path: 'home', component: NavComponent },
  { path: 'unauthorized', component: UnauthorizedComponent , canActivate: [AuthGuard]}
];
  
/*const appRoutes: Routes = [
  { path: 'sales', component: SalesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'support', component: SupportComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: HomeComponent }
];*/

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ProductsSearchComponent,
    ProductsSearchResultsComponent,
    SalesShoppingCartComponent,
    SalesComponent,
    MessagesComponent,
    SalesCheckoutComponent,
    SalesSearchComponent,
    SalesSearchResultsComponent,
    SalesDetailComponent,
    ProductsComponent,
    ProductsCreateComponent,
    ProductDetailsComponent,
    LoginComponent ,
    UnauthorizedComponent,
    PurchasesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTabsModule, 
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token'); //missing scenariotoken is null in C:\Users\Christos\universal-app\node_modules\@auth0\angular-jwt\bundles\core.umd.js
        },
        whitelistedDomains: ['localhost:3000'],
        authScheme: 'jwt '
      }
    })
  ],
  providers: [ProductsService, ShoppingCartService, MessageService, AuthService , AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
