import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
// *** REPLACE_IMPORT_MODULE *** // Do not delete/modify this line

const recursiveModuleFromRouters = (routes: any[] | any) => {
  let modules: any[] = [];
  if (routes instanceof Array) {
    for (let i = 0; i < routes.length; i += 1) {
      modules = [...modules, ...recursiveModuleFromRouters(routes[i])];
    }
  } else if (routes.children) {
    modules = [...modules, ...recursiveModuleFromRouters(routes.children)];
  } else if (routes.module) {
    modules.push(routes.module);
  }
  return modules;
};

const routes: Routes = [
  {
    path: '/api/core',
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/health', module: HealthModule },
      { path: '/users', module: UsersModule },
      // *** REPLACE_INIT_ROUTE *** // Do not delete/modify this line
    ],
  },
];
const imports = [
  RouterModule.register(routes),
  ...recursiveModuleFromRouters(routes),
];
@Module({
  imports,
})
export default class CoreModule {}
