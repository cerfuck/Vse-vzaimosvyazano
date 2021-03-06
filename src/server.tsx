import * as http from 'http';
import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import reducers from './ui/reducers';
import { match, RouterContext as RoutingContext } from 'react-router';
import * as Helmet from 'react-helmet';
import * as fs from 'fs';
import { createPage, write, writeError, writeNotFound, redirect, getFileExtension } from './utils/server-utils';
import routes from './routes';
import { utils } from '../src/utils';
import * as url from 'url';

import { Sender, ISender } from './app/sender';
import { nodeTransport } from './io/transport/node-transport';

let HOST = process.env.HOST || '127.0.0.1';
let PORT = process.env.PORT || 5000;

function renderApp(props, res, store) {
  let markup = renderToString(<Provider store={store}><RoutingContext {...props}/></Provider>
  );
  let head = Helmet.rewind();
  let html = createPage(markup, store.getState(), head);
  write(html, 'text/html', res);
}

function parseUrl(urlString) {
  if (urlString.indexOf('//') === 0) {
    return url.parse(urlString, true, true);
  } else {
    return url.parse(urlString, true, false);
  }
}

http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    write('haha', 'text/plain', res);
  }
  else if (parseUrl(req.url)['pathname'] === '/away.php') {
    res.writeHead(302, {
      'Location': parseUrl(req.url)['query']['to']
    });
    res.end();
  } else {
    match(utils.tsReturnTypeFix({ routes, location: req.url }), (error, redirectLocation, renderProps) => {
      if (error) {
        writeError('ERROR!', res);
      } else if (redirectLocation) {
        redirect(redirectLocation, res);
      } else if (renderProps) {
        let store = createStore(reducers, {});
        let sender: ISender = new Sender(store, nodeTransport);
        sender.fetchAllData(() => {
          renderApp(renderProps, res, store);
        });
      } else {
        match(utils.tsReturnTypeFix({ routes, location: '/404' }), (error, redirectLocation, renderProps) => {
          if (renderProps) {
            let store = createStore(reducers, {});
            renderApp(renderProps, res, store);
            writeNotFound(res);
          }
        });
      }
    });
  }

}).listen(PORT, HOST);
console.log(`listening on host ${HOST}:${PORT}`);
