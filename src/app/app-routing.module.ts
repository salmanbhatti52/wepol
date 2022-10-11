import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./pages/main/main.module').then((m) => m.MainPageModule),
  },
  {
    path: 'security-alert',
    loadChildren: () =>
      import('./pages/security-alert/security-alert.module').then(
        (m) => m.SecurityAlertPageModule
      ),
  },
  {
    path: 'make-report',
    loadChildren: () =>
      import('./pages/make-report/make-report.module').then(
        (m) => m.MakeReportPageModule
      ),
  },
  {
    path: 'know-your-area',
    loadChildren: () =>
      import('./pages/know-your-area/know-your-area.module').then(
        (m) => m.KnowYourAreaPageModule
      ),
  },
  {
    path: 'get-police-service',
    loadChildren: () =>
      import('./pages/get-police-service/get-police-service.module').then(
        (m) => m.GetPoliceServicePageModule
      ),
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./pages/help/help.module').then((m) => m.HelpPageModule),
  },
  {
    path: 'help-detail',
    loadChildren: () =>
      import('./pages/help-detail/help-detail.module').then(
        (m) => m.HelpDetailPageModule
      ),
  },
  {
    path: 'premium',
    loadChildren: () =>
      import('./pages/premium/premium.module').then((m) => m.PremiumPageModule),
  },
  {
    path: 'trusted-friend',
    loadChildren: () =>
      import('./pages/trusted-friend/trusted-friend.module').then(
        (m) => m.TrustedFriendPageModule
      ),
  },
  {
    path: 'middle',
    loadChildren: () =>
      import('./pages/middle/middle.module').then((m) => m.MiddlePageModule),
  },
  {
    path: 'fire-service',
    loadChildren: () => import('./pages/fire-service/fire-service.module').then( m => m.FireServicePageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./pages/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
