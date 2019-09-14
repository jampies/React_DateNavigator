import { configure } from '@storybook/react';

function loadStories() {
    require('../components/DateNavigator/DateNavigator.story');
}

configure(loadStories, module);