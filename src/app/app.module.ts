import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from "@angular/router";
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatSidenavModule, MatButtonModule, MatIconModule, MatListModule } from "@angular/material";
import {MatRadioModule} from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
//import {MatDialogModule} from '@angular/material/dialog';

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

const appRoutes = [{ path: 'sales', component: SalesComponent },
{ path: 'sales-checkout', component: SalesCheckoutComponent }];
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
    SalesSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
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
    // MatDialogModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ProductsService, ShoppingCartService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
