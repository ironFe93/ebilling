// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Material
import { MatSidenavModule, MatButtonModule, MatIconModule, MatListModule } from '@angular/material';
import { MatRadioModule} from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';


// Components & Services
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ProductsSearchComponent } from './products-search/products-search.component';
import { ProductsSearchResultsComponent } from './products-search-results/products-search-results.component';
import { ProductsService } from './products.service';
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
import { PurchasingComponent } from './purchasing/purchasing.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseService } from './purchase.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './dashboard.service';

// Auth
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { InventoryRequisitionComponent } from './inventory-requisition/inventory-requisition.component';
import { PurchasingSearchComponent } from './purchasing-search/purchasing-search.component';
import { PurchasingDetailComponent } from './purchasing-detail/purchasing-detail.component';
import { PurchasingSearchResultsComponent } from './purchasing-search-results/purchasing-search-results.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryReqSearchComponent } from './inventory-req-search/inventory-req-search.component';
import { InventoryReqSearchResultsComponent } from './inventory-req-search-results/inventory-req-search-results.component';
import { InventoryReqDetailsComponent } from './inventory-req-details/inventory-req-details.component';
import { SocketioService } from './socketio.service';

const appRoutes = [
  { path: 'sales', component: SalesComponent , canActivate: [AuthGuard] },
  { path: 'sales-checkout', component: SalesCheckoutComponent , canActivate: [AuthGuard]},
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard]},
  { path: 'purchasing', component: PurchasingComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'home', component: NavComponent },
  { path: 'unauthorized', component: UnauthorizedComponent , canActivate: [AuthGuard]}
];

/*const appRoutes: Routes = [
  { path: 'sales', component: SalesComponent },
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
    PurchasingComponent,
    PurchaseOrderComponent,
    InventoryRequisitionComponent,
    PurchasingSearchComponent,
    PurchasingDetailComponent,
    PurchasingSearchResultsComponent,
    InventoryComponent,
    InventoryReqSearchComponent,
    InventoryReqSearchResultsComponent,
    InventoryReqDetailsComponent,
    DashboardComponent
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
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          if (!localStorage.getItem('token')) {
            localStorage.setItem('token',
            'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
            '.eyJpc3MiOiJzY290Y2guaW8iLCJleHAiOjEzMDA4MTkzODAsIm5hbWUiOiJDaHJpcyBTZXZpbGxlamEiLCJhZG1pbiI6dHJ1ZX0' +
            '.03f329983b86f7d9a9f5fef85305880101d5e302afafa20154d094b229f75773');
          }
          return localStorage.getItem('token');
          // missing scenario token is null in C:\...\angular-jwt\bundles\core.umd.js
        },
        whitelistedDomains: [/^null$/],
        authScheme: 'jwt '
      }
    })
  ],
  providers: [ProductsService, ShoppingCartService,
     PurchaseService, MessageService, AuthService , AuthGuard, DashboardService, SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
