import { NgModule } from '@angular/core';
import {HttpHeaders } from  '@angular/common/http'
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

@NgModule({
  exports: [
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {

    const http = httpLink.create({ uri: 'http://192.168.1.94:3000/graphql' });

    const auth = setContext((_, headers) => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      if (!token) {
        return {};
      } else {
        return {
          headers: new HttpHeaders().append('x-token', token.toString()).append('x-refresh-token', refreshToken.toString()),
        };
      }
    });


    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache()
    });
  }
}
