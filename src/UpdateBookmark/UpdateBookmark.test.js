import React from 'react';
import ReactDOM from 'react-dom';
import UpdateBookmark from './UpdateBookmark';

it.skip('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UpdateBookmark />, div);
  ReactDOM.unmountComponentAtNode(div);
});
