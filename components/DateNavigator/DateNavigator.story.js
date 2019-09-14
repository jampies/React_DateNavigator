import React from 'react';
import { storiesOf } from '@storybook/react';
import DateNavigator from './DateNavigator';

class DateNavigatorStoryWrapper extends React.Component {
  constructor () {
    super();

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      date: new Date()
    };
  }

  handleChange (date) {
    this.setState({
      date: new Date(date)
    });
  }

  render () {
    return (
        <DateNavigator date={this.state.date} onChange={this.handleChange} />
    );
  }
}

export default DateNavigatorStoryWrapper;

storiesOf('DateNavigator', module).add('Example', () => {
  return (
    <DateNavigatorStoryWrapper />
  );
});
