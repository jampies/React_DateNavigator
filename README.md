# React_DateNavigator

A date selector component built with React

## Dependencies

* Node v8+ and NPM

## Starting it up

* `npm install` to install any other necessary dependencies
* `npm start` will start up storybook locally to demo the component
* `npm test` runs the unit tests

## Usage

```
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
        <DateNavigator 
            date={this.state.date} 
            onChange={this.handleChange} 
        />
    );
  }
}
```

## Conventions

* Tests are located in the same folder as the component tested and has `.spec.js` extensions
* Stories are located in the same folder as the component described and has `.story.js` extensions

## Authored by
Murray le Roux